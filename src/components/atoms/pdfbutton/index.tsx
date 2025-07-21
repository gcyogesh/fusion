'use client';

import Link from 'next/link';
import Button from '@/components/atoms/button';

type Props = {
  packageId: string;
};

const DownloadPdfButton = ({ packageId }: Props) => {
  return (
    <Link
      href={`${process.env.NEXT_PUBLIC_API_URL}/tour/tour-packages/${packageId}/download-pdf`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="px-15">
        <Button
          text="Download PDF"
          variant="secondary"
          className="bg-white hover:text-white"
        />
      </div>
    </Link>
  );
};

export default DownloadPdfButton;