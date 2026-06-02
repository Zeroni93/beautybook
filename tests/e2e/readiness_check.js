const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

function loadEnv(envPath) {
  const env = {}
  if (!fs.existsSync(envPath)) return env
  const txt = fs.readFileSync(envPath, 'utf8')
  txt.split(/\n/).forEach(line => {
    line = line.trim()
    if (!line || line.startsWith('#')) return
    const [k, ...rest] = line.split('=')
    env[k] = rest.join('=').replace(/^"|"$/g, '')
  })
  return env
}

;(async () => {
  try {
    const env = loadEnv(path.resolve(__dirname, '..', '..', '.env.local'))
    const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const SUPABASE_ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const SUPABASE_SERVICE = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!SUPABASE_URL || (!SUPABASE_ANON && !SUPABASE_SERVICE)) {
      console.error('Missing supabase env keys in .env.local or process.env')
      process.exit(2)
    }

    const clientKey = SUPABASE_SERVICE || SUPABASE_ANON
    const supabase = createClient(SUPABASE_URL, clientKey)

    const requiredTables = [
      'seller_profiles',
      'services',
      'availability_rules',
      'booking_requests',
      'seller_portfolio_media',
      'provider_reviews'
    ]

    const tableResults = {}
    for (const t of requiredTables) {
      try {
        // use select('*') to avoid interpreting a literal as a column name
        const { data, error } = await supabase.from(t).select('*').limit(1)
        if (error) {
          tableResults[t] = { ok: false, error: error.message || error }
        } else {
          tableResults[t] = { ok: true, sample: Array.isArray(data) ? data.length : null }
        }
      } catch (err) {
        tableResults[t] = { ok: false, error: String(err) }
      }
    }

    // storage bucket check
    let storageOk = false
    let bucketExists = false
    let uploadOk = false
    const bucketName = 'provider-media'
    try {
      const { data: buckets, error: bErr } = await supabase.storage.listBuckets()
      if (bErr) {
        // older supabase client may not support listBuckets with anon; try calling from().list
        console.warn('listBuckets error:', bErr.message || bErr)
      } else {
        bucketExists = Array.isArray(buckets) && buckets.some(b => b.name === bucketName)
      }
    } catch (err) {
      // ignore
    }

    // Try a simple upload if bucket exists
    if (bucketExists) {
      // pick an existing seller id
      const { data: anySeller, error: anyErr } = await supabase.from('seller_profiles').select('user_id').limit(1).single()
      if (!anyErr && anySeller && anySeller.user_id) {
        const testPath = `e2e/${anySeller.user_id}/readiness-test-${Date.now()}.txt`
        const tmp = path.resolve(__dirname, 'tmp-readiness.txt')
        fs.writeFileSync(tmp, 'readiness test ' + new Date().toISOString())
        try {
          const file = fs.createReadStream(tmp)
          const { data: upData, error: upErr } = await supabase.storage.from(bucketName).upload(testPath, file)
          if (upErr) {
            uploadOk = false
          } else {
            uploadOk = true
            // remove uploaded object
            await supabase.storage.from(bucketName).remove([testPath])
          }
        } catch (err) {
          uploadOk = false
        } finally {
          fs.unlinkSync(tmp)
        }
      }
    }

    // perform a short booking insert test using existing seller (like run_booking_test does)
    let bookingTest = { ok: false, details: null }
    try {
      const { data: seller } = await supabase.from('seller_profiles').select('user_id').limit(1).single()
      if (!seller || !seller.user_id) {
        bookingTest = { ok: false, details: 'no seller_profiles row available' }
      } else {
        const sellerId = seller.user_id
        const date = new Date().toISOString().slice(0,10)
        const insertObj = {
          seller_id: sellerId,
          customer_name: 'Readiness Tester',
          customer_phone: '555-000-0002',
          service_id: null,
          service_name: 'Readiness Service',
          preferred_date: date,
          preferred_time: '13:00',
          notes: 'readiness check',
          status: 'pending',
          confirmation_mode: 'manual'
        }
        const { data: insData, error: insErr } = await supabase.from('booking_requests').insert(insertObj).select().limit(1)
        if (insErr) {
          bookingTest = { ok: false, details: insErr.message || insErr }
        } else {
          const created = insData && insData[0]
          bookingTest = { ok: true, id: created && created.id }
          // cleanup
          if (created && created.id) await supabase.from('booking_requests').delete().eq('id', created.id)
        }
      }
    } catch (err) {
      bookingTest = { ok: false, details: String(err) }
    }

    // reviews test: quick insert & delete if table exists
    let reviewsTest = { ok: false, details: null }
    if (tableResults['provider_reviews'] && tableResults['provider_reviews'].ok) {
      try {
        const { data: seller } = await supabase.from('seller_profiles').select('user_id').limit(1).single()
        if (!seller || !seller.user_id) {
          reviewsTest = { ok: false, details: 'no seller_profiles row available' }
        } else {
          const provider_id = seller.user_id
          // use columns that match migrations: customer_name and review_text
          const insert = { provider_id, customer_name: 'E2E Reviewer', rating: 5, review_text: 'Readiness review test' }
          const { data: rData, error: rErr } = await supabase.from('provider_reviews').insert(insert).select().limit(1)
          if (rErr) {
            reviewsTest = { ok: false, details: rErr.message || rErr }
          } else {
            reviewsTest = { ok: true }
            const created = rData && rData[0]
            if (created && created.id) await supabase.from('provider_reviews').delete().eq('id', created.id)
          }
        }
      } catch (err) {
        reviewsTest = { ok: false, details: String(err) }
      }
    } else {
      reviewsTest = { ok: false, details: 'provider_reviews table missing or inaccessible' }
    }

    const results = { tables: tableResults, bucketExists, uploadOk, bookingTest, reviewsTest }
    console.log('\nREADINESS CHECK RESULTS:\n', JSON.stringify(results, null, 2))
    process.exit(0)
  } catch (err) {
    console.error('Unexpected error', err)
    process.exit(20)
  }
})()
