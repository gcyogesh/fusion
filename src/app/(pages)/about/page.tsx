import HeroBanner from "@/components/organisms/Banner/HeroBanner";
import { fetchAPI } from "@/utils/apiService";

export default async function About() {
  const herodata = await fetchAPI({ endpoint: "herobanner/about" });

  return (
    <>
  
      <HeroBanner herodata={herodata.data} />
    </>
  );
}
