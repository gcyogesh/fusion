import React from 'react';
import Link from 'next/link';

interface BreadcrumbProps {
  currentnavlink: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ currentnavlink }) => {
  const paths = currentnavlink.split('/');
  const fullPaths: string[] = [];

  // Build cumulative paths for links
  paths.forEach((_, i) => {
    fullPaths.push('/' + paths.slice(0, i + 1).join('/').toLowerCase());
  });

  return (
    <section className="w-full h-[40px] max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-4 sm:py-6 md:py-8 lg:py-10 xl:py-12">
      <div className="font-inter text-[18px] font-semibold flex gap-1 items-center">
        <Link href="/" className="text-gray-400 hover:text-gray-600">Home</Link>
        {paths.map((segment, i) => (
          <React.Fragment key={i}>
            <span className="mx-1">|</span>
            {i < paths.length - 1 ? (
              <Link href={fullPaths[i]} className="text-gray-400 hover:text-gray-600 capitalize">
                {segment}
              </Link>
            ) : (
              <span className="text-black capitalize">{segment}</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default Breadcrumb;
