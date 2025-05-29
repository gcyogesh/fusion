import { notFound } from "next/navigation";

import { fetchAPI } from "@/utils/apiService";
import TextDescription from "@/components/atoms/description";
import TextHeader from "@/components/atoms/headings";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function Page({ params }: PageProps) {
  const endpoint = `blogs/${params.slug}`;

  let blogdata = null;

  try {
    blogdata = await fetchAPI({ endpoint });
   
    // Optional: check if blogdata is empty or invalid
    if (!blogdata || Object.keys(blogdata).length === 0) {
      notFound();
    }
  } catch (error) {
    // Suppress the error and redirect to 404
    notFound();
  }

  return (
    <>
<section>
    <div className="mx-auto max-w-7xl py-18">
<TextHeader text={blogdata.data.subtitle} align="left" width={500}/>
       <TextDescription text={blogdata.data.description}/>
</div>
</section>
    </>
  );
}
