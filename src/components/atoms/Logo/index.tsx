"use client"
import React, { useEffect, useState } from 'react'; // githubasdss asdfas


interface LogoType {
  url: string;
  alt: string;
  width: number;
  height: number;
}

interface LogoProps {
  width?: number;
  height?: number;
  index?: number;
}

const Logo = ({ width = 180, height, index }: LogoProps) => {
  const [logo, setLogo] = useState<LogoType | null>(null);
  const [, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch("https://yogeshbhai.ddns.net/api/logo");
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        const imageData = result.data.image;
        console.log(imageData.urls)
        setLogo({
          url: imageData.urls?.[index ?? 0] || '',
          alt: imageData.alt || 'Logo',
          width: imageData.width,
          height: imageData.height,
        });
      } catch (err) {
        setError( 'Failed to fetch logo');
        console.error('Error fetching logo:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogo();
  }, []);


  if (error) return <div>{error}</div>;

  return (
    <div className="flex justify-center">
      <img
        src={`${logo?.url}`}
        alt={logo?.alt}
        width={width}
        height={height || logo?.height}
        className="h-auto"
      />
    </div>
  );
};

export default Logo;