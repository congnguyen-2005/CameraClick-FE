import React, { useState, useEffect } from "react";

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://cameraclick-be-production.up.railway.app/api";
const IMG_STORAGE = `${API_URL}/storage/`;

const SafeImage = ({ src, className, style, alt }) => {
  const [imgSrc, setImgSrc] = useState("https://ui-avatars.com/api/?name=User&background=random");

  useEffect(() => {
    // Logic: Nếu có src từ DB thì ghép link storage, nếu không thì giữ nguyên avatar mặc định
    if (src && src !== "null" && src !== "undefined") {
      // Kiểm tra xem src có phải là link full (http...) hay chỉ là tên file
      if (src.startsWith("http")) {
        setImgSrc(src);
      } else {
        setImgSrc(`${IMG_STORAGE}${src}`);
      }
    }
  }, [src]);

  return (
    <img
      src={imgSrc}
      className={className}
      style={style}
      alt={alt || "Image"}
      onError={(e) => {
        // Ngăn lặp vô tận
        e.target.onerror = null; 
        setImgSrc("https://ui-avatars.com/api/?name=Error&background=ccc");
      }}
    />
  );
};

export default SafeImage;