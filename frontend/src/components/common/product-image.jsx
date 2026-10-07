import { useState } from "react";
import { ImageOff } from "lucide-react";

function ProductImage({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-100 text-gray-400 ${className}`}>
        <ImageOff className="mb-2 h-8 w-8" />
        <span className="line-clamp-2 px-2 text-center text-xs">{alt}</span>
      </div>
    );
  }

  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} className={`object-cover ${className}`} />;
}

export default ProductImage;
