export function getAverageRating(reviews: Array<any>) {
  if (!reviews || reviews.length === 0) return 0
  const sum = reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0)
  return sum / reviews.length
}

export function getReviewCount(reviews: Array<any>) {
  return reviews ? reviews.length : 0
}

export function formatRating(rating: number) {
  if (!rating) return '—'
  return Number(rating).toFixed(1)
}
