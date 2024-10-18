import React from 'react'
import ThemedImage from '@theme/ThemedImage'
import useBaseUrl from '@docusaurus/useBaseUrl'

type ImageProps = {
  alt: string
  srcLight: string
  srcDark: string
  width: number
  height: number
}

export const Image = (props: ImageProps) => {
  //width、height は渡さない
  const { srcLight, srcDark, width, height, ...otherProps } = props

  return (
    <ThemedImage
      loading="lazy"
      sources={{
        light: useBaseUrl(`/img${srcLight.replace('.png', '.avif')}`),
        dark: useBaseUrl(`/img${srcDark.replace('.png', '.avif')}`),
      }}
      {...otherProps}
    />
  )
}
