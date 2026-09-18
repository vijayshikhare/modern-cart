import { useMemo, useState } from 'react'
import { getImageCandidates } from '../../utils/image'

const SmartImage = ({ seed, src, alt, className, ...props }) => {
  const candidates = useMemo(() => getImageCandidates(seed, src), [seed, src])
  const [index, setIndex] = useState(0)

  const handleError = () => {
    setIndex((prev) => Math.min(prev + 1, candidates.length - 1))
  }

  return (
    <img
      src={candidates[index]}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  )
}

export default SmartImage
