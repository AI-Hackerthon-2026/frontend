import { useState } from 'react'
import { resolveApiAssetUrl } from '../../services/api'

interface PortfolioThumbnailProps {
  alt: string
  className: string
  fallback: string
  imageClassName?: string
  src?: string | null
}

function PortfolioThumbnail({
  alt,
  className,
  fallback,
  imageClassName = 'size-full object-cover',
  src,
}: PortfolioThumbnailProps) {
  const [failedImageUrl, setFailedImageUrl] = useState('')
  const imageUrl = resolveApiAssetUrl(src)
  const hasImageError = failedImageUrl === imageUrl

  return (
    <div className={className}>
      {imageUrl && !hasImageError ? (
        <img
          alt={alt}
          className={imageClassName}
          onError={() => setFailedImageUrl(imageUrl)}
          src={imageUrl}
        />
      ) : (
        fallback
      )}
    </div>
  )
}

export default PortfolioThumbnail
