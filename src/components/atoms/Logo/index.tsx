"use client";
import React, { useEffect, useState, useMemo } from "react";

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

const LogoComponent = ({ width = 180, height, index }: LogoProps) => {
  const [logo, setLogo] = useState<LogoType | null>(null);
  const [, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch(`https://newapi.fusionexpeditions.com/api/logo`);
        if (!response.ok) throw new Error("Network response was not ok");
        const result = await response.json();
        const imageData = result.data.image;
        const logoData: LogoType = {
          url: imageData.urls?.[index ?? 0] || "",
          alt: imageData.alt || "Logo",
          width: imageData.width,
          height: imageData.height,
        };
        setLogo(logoData);
      } catch (err) {
        console.error("Error fetching logo:", err);
        setError("Failed to fetch logo");
      } finally {
        setLoading(false);
      }
    };

    fetchLogo();
  }, [index]);

  const memoizedLogo = useMemo(() => logo, [logo]);

  if (error) return <div>{error}</div>;

  return (
    <div className="flex justify-center">
      {memoizedLogo && (
        <img
          src={memoizedLogo.url}
          alt={memoizedLogo.alt}
          width={width}
          height={height || memoizedLogo.height}
          className="h-auto"
        />
      )}
    </div>
  );
};

// Export memoized component
export default React.memo(LogoComponent);
