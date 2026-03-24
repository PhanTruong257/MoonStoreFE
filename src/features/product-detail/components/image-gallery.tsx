interface ImageGalleryProps {
  images: string[]
  alt: string
}

export const ImageGallery = ({ images, alt }: ImageGalleryProps) => {
  return (
    <div className="image-gallery">
      {images.map((image) => (
        <img key={image} src={image} alt={alt} loading="lazy" />
      ))}
    </div>
  )
}
