'use client';

import React from 'react';
import Image from 'next/image';

interface HeroSectionProps {
  name: string;
  title: string;
  image: string;
  bio: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ name, title, image, bio }) => {
  return (
    <section className="relative bg-gradient-to-b from-blue-50 to-white py-20 mb-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-dark">
              <span className="text-primary">{name}</span>
              {title && <><br/>{title}</>}
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {bio}
            </p>
          </div>
          <div className="md:w-1/2 relative">
            <div className="w-full h-64 md:h-96 relative rounded-lg overflow-hidden shadow-lg">
              <Image 
                src={image} 
                alt={`${name} profile image`}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 