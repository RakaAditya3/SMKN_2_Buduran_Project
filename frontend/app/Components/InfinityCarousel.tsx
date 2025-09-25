import React from 'react';
import Image from 'next/image';

const InfiniteCarousel: React.FC = () => {
  const images = [
    '/images/LogoJagoan-1.png',
    '/images/komdigi.png',
    '/images/maspion.png',
    '/images/1000sd.png',
    '/images/LogoJagoan-1.png',
    '/images/komdigi.png',
    '/images/maspion.png',
    '/images/1000sd.png',
  ];

  return (
    <div className="relative w-full overflow-hidden py-8">
      <div className="flex animate-loop-scroll">
        {[...images, ...images].map((src, i) => (
          <div
            key={i}
            className="flex-shrink-0 w-[100px] mx-6 flex items-center justify-center"
          >
            <div className="transition-all duration-500 transform hover:scale-105">
              <Image
                src={src}
                alt={`carousel-${i}`}
                width={70}
                height={120}
                className="object-contain w-[200px] h-[120px] hover:grayscale-0 transition duration-500"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfiniteCarousel;
