import NextImage from 'next/image';

const CloudinaryLoader = ({ src, width, quality }) => {
  return `${src}?w=${width}&q=${quality || 75}`;
};

export default function Image({
  className = 'Image',
  src,
  width,
  height,
  alt = '',
}) {
  return (
    <NextImage
      className={className}
      loader={CloudinaryLoader}
      src={src}
      alt={alt}
      width={width}
      height={height}
    />
  );
}
