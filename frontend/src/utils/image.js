export const getImageCandidates = (seed, primary) => {
  const safeSeed = encodeURIComponent(String(seed || 'product-image').trim().toLowerCase())
  const candidates = [
    primary,
    `https://picsum.photos/seed/${safeSeed}/800/800`,
    '/placeholder-product.svg'
  ]

  return candidates.filter(Boolean)
}
