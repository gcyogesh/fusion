import { Metadata } from "next";
import Breadcrumb from "@/components/atoms/breadcrumb"; // Adjust the path to match your project

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Read our terms and conditions carefully.",
};

const termsData = [
  {
    title: "1. Introduction",
    content:
      "By accessing this website, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, then you may not access the service.",
  },
  {
    title: "2. Intellectual Property Rights",
    content:
      "All content, trademarks, and data on this website, including but not limited to software, databases, text, graphics, icons, are the property of the website owner or its licensors.",
  },
  {
    title: "3. Restrictions",
    content:
      "You are specifically restricted from all of the following: publishing any website material in any media; selling, sublicensing and/or otherwise commercializing any website material; publicly performing or showing any website material.",
  },
  {
    title: "4. Limitation of Liability",
    content:
      "In no event shall the website, nor any of its officers, directors, and employees, be held liable for anything arising out of or in any way connected with your use of this Website.",
  },
  {
    title: "5. Changes to Terms",
    content:
      "We reserve the right to revise these terms at any time. You are expected to check this page from time to time to take notice of any changes we made.",
  },
];

export default function TermsPage() {
  return (
    <>
      <Breadcrumb currentnavlink="About/terms and conditions" />
      <main className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8 text-center">Terms and Conditions</h1>
        {termsData.map((term, index) => (
          <section key={index} className="mb-2">
            <h2 className="text-xl font-semibold mb-1">{term.title}</h2>
            <p className="text-gray-700">{term.content}</p>
          </section>
        ))}
      </main>
    </>
  );
}

