import Breadcrumb from "@/components/atoms/breadcrumb";
import { fetchAPI } from "@/utils/apiService";

export default async function TermsPage() {
  const teamsdata = await fetchAPI({ endpoint: "terms" });
  const terms = teamsdata?.data?.[0];
  const sections = terms?.sections || [];

  return (
    <>
      <Breadcrumb currentnavlink="About/terms and conditions" />
      <main className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">
          {terms?.pageTitle || "Terms and Conditions"}
        </h1>

        {sections.map((section, index) => (
          <section key={index} className="mb-6">
            <h2 className="text-xl font-semibold mb-1">{section.title}</h2>
            <p className="text-gray-700">{section.content}</p>
          </section>
        ))}
      </main>
    </>
  );
}

