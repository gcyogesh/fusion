import TestimonialCarousel from "@/components/organisms/testimonial/testimonial";
import Breadcrumb from "@/components/atoms/breadcrumb";
import { fetchAPI } from "@/utils/apiService"; // Ensure this import is correct
import TextHeader from "@/components/atoms/headings";
import HeroSection from "@/components/organisms/HeroSection";

export const metadata = {
  title: "Reviews",
};

export default async function Reviews() {
 const testimonialData = (await fetchAPI({ endpoint: "testimonials" })) || [];

  return (
    <>
      <Breadcrumb currentnavlink="About/Testimonials" />
      
      <main className="mx-auto max-w-7xl px-6 sm:px-8 py-12 sm:py-20">
        <TextHeader
            text="Memorable Journeys, Happy Clients"
            specialWordsIndices="1"
            align="left"
            width="500px"
            buttonText="Reviews"
            className="mb-8"
          />
         <TestimonialCarousel testimonialData={testimonialData} isReviewPage={true} />
      </main>
    </>
  );
}
