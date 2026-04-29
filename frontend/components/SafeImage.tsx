'use client'

import Image, { ImageProps } from 'next/image'
import { useState, useEffect } from 'react'

interface SafeImageProps extends Omit<ImageProps, 'src' | 'alt'> {
  src?: string | null
  alt?: string
}

export default function SafeImage({ src, alt, ...props }: SafeImageProps) {
  const [error, setError] = useState(false)
  const [validSrc, setValidSrc] = useState<string>('https://picsum.photos/seed/hotel/600/400')

  useEffect(() => {
    if (!src || src.trim() === '') {
      setError(true)
      return
    }

    try {
      // Validate URL construction
      if (src.startsWith('http') || src.startsWith('/') || src.startsWith('data:')) {
        setValidSrc(src)
        setError(false)
      } else {
        setError(true)
      }
    } catch (e) {
      setError(true)
    }
  }, [src])

  const fallback = 'https://picsum.photos/seed/hotel/600/400'

  return (
    <Image
      {...props}
      src={error ? fallback : validSrc}
      alt={alt || 'Hotel image'}
      onError={() => setError(true)}
    />
  )
}
