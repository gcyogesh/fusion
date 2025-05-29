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
    <section className=" bg-[#FEF9EE] w-full h-8  fixed z-40 top-10 ">
    <div className="max-w-7xl mx-auto text-[18px] font-semibold flex gap-1 items-center ">
     
        <Link href="/" className="text-gray-400 hover:text-gray-600">Home</Link>
        {paths.map((segment, i) => (
          <React.Fragment key={i}>
           
          <h1 className="text-gray-400   mx-0.5  " >&raquo;</h1> 

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
