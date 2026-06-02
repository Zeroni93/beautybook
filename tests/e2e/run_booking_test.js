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
  // .env.local lives at the project root
  const env = loadEnv(path.resolve(__dirname, '..', '..', '.env.local'))
    const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const SUPABASE_ANON = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const SUPABASE_SERVICE = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!SUPABASE_URL || (!SUPABASE_ANON && !SUPABASE_SERVICE)) {
      console.error('Missing supabase env keys in .env.local or process.env')
      process.exit(2)
    }

    // prefer service role key for local E2E testing (bypass RLS). This script is for local verification only.
    const clientKey = SUPABASE_SERVICE || SUPABASE_ANON
    const supabase = createClient(SUPABASE_URL, clientKey)

    // Prefer using an existing seller_profiles row to avoid auth FK constraints
    const { data: anySeller, error: anyErr } = await supabase.from('seller_profiles').select('user_id').limit(1).single()
    if (anyErr || !anySeller) {
      console.error('No seller_profiles rows found in the target DB. Please create at least one provider before running E2E tests.')
      process.exit(7)
    }
    const sellerId = anySeller.user_id
    const now = new Date()
    const date = now.toISOString().slice(0,10)
    const time = '12:00'

    console.log('Creating booking_request (seller:', sellerId, ')')
      // ensure seller_profiles exists for FK constraint; create a temporary test profile if missing
      const { data: existingProfile } = await supabase.from('seller_profiles').select('user_id').eq('user_id', sellerId).limit(1).single()
      let createdProfile = null
      if (!existingProfile) {
        console.log('No seller_profiles row found for seller_id; creating temporary test profile')
        // Try inserting with multiple fields, but fallback if some columns don't exist in this DB schema
        const candidates = [
          { user_id: sellerId, business_name: 'E2E Test Provider', full_name: 'E2E Test', city: 'Testville', state: 'TS' },
          { user_id: sellerId, business_name: 'E2E Test Provider', full_name: 'E2E Test' },
          { user_id: sellerId, business_name: 'E2E Test Provider' },
          { user_id: sellerId }
        ]
        for (const obj of candidates) {
          const { data: cp, error: cpErr } = await supabase.from('seller_profiles').insert(obj).select().limit(1)
          if (!cpErr && cp && cp.length) {
            createdProfile = cp[0]
            console.log('Created test seller_profiles row with columns:', Object.keys(obj).join(','))
            break
          }
          // if error indicates unknown column, try next candidate; otherwise fail fast
          const msg = cpErr && (cpErr.message || String(cpErr))
          if (cpErr && !/column|unknown|does not exist|schema cache/i.test(msg)) {
            console.error('Could not create test seller_profile:', msg)
            process.exit(6)
          }
          console.log('Insert attempt failed, trying simpler payload...')
        }
        if (!createdProfile) {
          console.error('All attempts to create a test seller_profiles row failed')
          process.exit(6)
        }
      }
    const insertObj = {
      seller_id: sellerId,
      customer_name: 'E2E Tester',
      customer_phone: '555-000-0001',
      service_id: null,
      service_name: 'E2E Test Service',
      preferred_date: date,
      preferred_time: time,
      notes: 'Automated E2E test booking',
      status: 'pending',
      confirmation_mode: 'manual'
    }

    const { data: insData, error: insErr } = await supabase.from('booking_requests').insert(insertObj).select().limit(1)
    if (insErr) {
      console.error('Insert error:', insErr.message || insErr)
      process.exit(3)
    }
    const created = insData && insData[0]
    if (!created) {
      console.error('No row returned after insert')
      process.exit(4)
    }
    console.log('Inserted booking id:', created.id)

    // Read back
    const { data: readData, error: readErr } = await supabase.from('booking_requests').select('*').eq('id', created.id).limit(1).single()
    if (readErr) {
      console.error('Read error:', readErr.message || readErr)
      process.exit(5)
    }
    console.log('Read booking row status:', readData.status)

    // Update to confirmed
    const { error: upErr } = await supabase.from('booking_requests').update({ status: 'confirmed' }).eq('id', created.id)
    if (upErr) {
      console.error('Update (confirmed) error:', upErr.message || upErr)
      process.exit(6)
    }
    const { data: after1 } = await supabase.from('booking_requests').select('status').eq('id', created.id).limit(1)
    console.log('After set confirmed:', after1 && after1[0] && after1[0].status)

    // Update to declined
    const { error: upErr2 } = await supabase.from('booking_requests').update({ status: 'declined' }).eq('id', created.id)
    if (upErr2) {
      console.error('Update (declined) error:', upErr2.message || upErr2)
      process.exit(7)
    }
    const { data: after2 } = await supabase.from('booking_requests').select('status').eq('id', created.id).limit(1)
    console.log('After set declined:', after2 && after2[0] && after2[0].status)

    // Update to completed
    const { error: upErr3 } = await supabase.from('booking_requests').update({ status: 'completed' }).eq('id', created.id)
    if (upErr3) {
      console.error('Update (completed) error:', upErr3.message || upErr3)
      process.exit(8)
    }
    const { data: after3 } = await supabase.from('booking_requests').select('status').eq('id', created.id).limit(1)
    console.log('After set completed:', after3 && after3[0] && after3[0].status)

    console.log('E2E booking test completed successfully')
      // cleanup: remove created booking and profile if we created them
      try {
        await supabase.from('booking_requests').delete().eq('id', created.id)
        if (createdProfile) {
          await supabase.from('seller_profiles').delete().eq('user_id', createdProfile.user_id)
          console.log('Cleaned up test seller_profiles')
        }
        console.log('Cleaned up test booking and profile')
      } catch (cleanupErr) {
        console.warn('Cleanup error (non-fatal):', cleanupErr)
      }
      process.exit(0)
  } catch (err) {
    console.error('Unexpected error', err)
    process.exit(10)
  }
})()
