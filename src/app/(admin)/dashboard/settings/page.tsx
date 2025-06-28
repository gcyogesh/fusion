"use client";
import React, { useState, useEffect } from "react";
import {
  FiImage,
  FiMail,
  FiPhone,
  FiMapPin,
  FiGlobe,
  FiUploadCloud,
  FiRefreshCw,
  FiHelpCircle,
} from "react-icons/fi";
import { MdEdit } from "react-icons/md";
import Button from "@/components/atoms/button";
import { fetchAPI } from "@/utils/apiService";
import { AdminTable } from "@/components/organisms/ListingCard";
import Loader from "@/components/atoms/Loader";

const HERO_PAGES = [
  { label: "Home", value: "home" },
  { label: "Contact", value: "contact" },
  { label: "Blog", value: "blog" },
  { label: "Activity", value: "activity" },
  { label: "Destination", value: "destinations" },
];

type TabType = "general" | "faq";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("general");
  
  // General tab state
  const [selectedHeroPage, setSelectedHeroPage] = useState("home");
  const [heroLoading, setHeroLoading] = useState(false);
  const [heroData, setHeroData] = useState({
    _id: "",
    title: "",
    subTitle: "",
    description: "",
    buttonText: "",
    buttonLink: "",
    bannerImage: "",
  });
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroSaving, setHeroSaving] = useState(false);
  const [heroError, setHeroError] = useState("");
  const [heroSuccess, setHeroSuccess] = useState("");

  const [logoUrls, setLogoUrls] = useState<string[]>(["", ""]);
  const [logoFiles, setLogoFiles] = useState<(File | null)[]>([null, null]);

  // FAQ tab state
  const [faqData, setFaqData] = useState<any[]>([]);
  const [faqLoading, setFaqLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "general") {
      setHeroLoading(true);
      setHeroError("");
      fetchAPI({ endpoint: `herobanner/${selectedHeroPage}` })
        .then((res: any) => {
          if (res?.data) {
            const data = res.data;
            setHeroData({
              _id: data._id || "",
              title: data.title || "",
              subTitle: data.subTitle || "",
              description: data.description || "",
              buttonText: data.buttonText || "",
              buttonLink: data.buttonLink || "",
              bannerImage: data.bannerImage || "",
            });
          }
        })
        .catch(() => setHeroError("Failed to fetch hero banner."))
        .finally(() => setHeroLoading(false));
    }
  }, [selectedHeroPage, activeTab]);

  useEffect(() => {
    if (activeTab === "general") {
      fetchAPI({ endpoint: "logo" }).then((res: any) => {
        if (res?.data?.image?.urls) {
          setLogoUrls([
            res.data.image.urls[0] || "",
            res.data.image.urls[1] || "",
          ]);
        }
      });
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "faq") {
      setFaqLoading(true);
      fetchAPI({ endpoint: "faqs" })
        .then((res: any) => {
          if (res?.data) {
            setFaqData(res.data);
          }
        })
        .catch(() => console.error("Failed to fetch FAQs"))
        .finally(() => setFaqLoading(false));
    }
  }, [activeTab]);

  const handleHeroChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setHeroData({ ...heroData, [e.target.name]: e.target.value });
  };

  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setHeroImageFile(e.target.files[0]);
      setHeroData({
        ...heroData,
        bannerImage: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    if (e.target.files && e.target.files[0]) {
      const newFiles = [...logoFiles];
      const newUrls = [...logoUrls];
      newFiles[idx] = e.target.files[0];
      newUrls[idx] = URL.createObjectURL(e.target.files[0]);
      setLogoFiles(newFiles);
      setLogoUrls(newUrls);
    }
  };

  const handleSaveHero = async () => {
    setHeroSaving(true);
    setHeroError("");
    setHeroSuccess("");
    try {
      let bannerImageUrl = heroData.bannerImage;
      if (heroImageFile) {
        const formData = new FormData();
        formData.append("file", heroImageFile);
        const uploadRes: any = await fetchAPI({
          endpoint: "herobanner",
          method: "POST",
          data: formData,
        });
        bannerImageUrl = uploadRes?.url || bannerImageUrl;
      }
      await fetchAPI({
        endpoint: `herobanner/${selectedHeroPage}`,
        method: "PUT",
        data: {
          title: heroData.title,
          subTitle: heroData.subTitle,
          description: heroData.description,
          buttonText: heroData.buttonText,
          buttonLink: heroData.buttonLink,
          bannerImage: bannerImageUrl,
        },
      });
      setHeroSuccess("Hero banner updated!");
      setHeroImageFile(null);
    } catch (e: any) {
      setHeroError(e.message || "Failed to update hero banner.");
    } finally {
      setHeroSaving(false);
      setTimeout(() => setHeroSuccess(""), 2500);
    }
  };

  const faqColumns = [
    { key: "question", label: "Question", type: "text", accessor: "question" as keyof any },
    { key: "answer", label: "Answer", type: "textarea", accessor: "answer" as keyof any },
  ];

  const renderGeneralTab = () => (
    <section className="bg-white rounded-xl shadow-md border border-gray-200 w-full px-8 md:px-16 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {/* Logo Management */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <FiImage className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-gray-900">Logo Management</h2>
          </div>
          <p className="text-gray-500 text-sm mb-2">Upload your primary and secondary logos for your brand. SVG or PNG recommended.</p>
          <div className="flex flex-col gap-3">
            {[0, 1].map((idx) => (
              <div key={idx} className="flex flex-col items-start gap-1">
                <label className="text-sm font-semibold text-gray-700 mb-1">
                  {idx === 0 ? "Primary Logo" : "Secondary Logo"}
                </label>
                <label className="block relative cursor-pointer group w-full">
                  <div className="w-full h-20 bg-neutral-50 border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden group-hover:border-primary transition-all duration-200 relative">
                    {logoUrls[idx] ? (
                      <img
                        src={logoUrls[idx]}
                        alt={`Logo ${idx}`}
                        className="h-full object-contain mx-auto transition-transform duration-200 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full">
                        <FiUploadCloud className="w-7 h-7 text-primary mb-1" />
                        <span className="text-xs text-gray-700">Upload logo</span>
                        <span className="text-xs text-gray-400">PNG, SVG. Max 1MB.</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleLogoChange(e, idx)}
                  />
                </label>
              </div>
            ))}
          </div>
          <div className="flex justify-start mt-3">
            <Button text="Save Logos" className="px-8 py-2 rounded-lg shadow-sm text-base font-semibold bg-primary text-white transition hover:bg-primary/90" />
          </div>
        </div>
        {/* Hero Section */}
        <div className="flex flex-col gap-4 border-l border-gray-200 pl-6">
          <div className="flex items-center gap-2 mb-1">
            <FiImage className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-gray-900">Hero Section</h2>
          </div>
          <p className="text-gray-500 text-sm mb-2">Edit the hero banner for each main page. Update the title, subtitle, button, and image.</p>
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-gray-700">Page</label>
            <select
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white transition hover:bg-gray-50"
              value={selectedHeroPage}
              onChange={(e) => setSelectedHeroPage(e.target.value)}
            >
              {HERO_PAGES.map((page) => (
                <option key={page.value} value={page.value}>
                  {page.label}
                </option>
              ))}
            </select>
            <label className="text-sm font-semibold text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Title"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white transition hover:bg-gray-50"
              value={heroData.title}
              onChange={handleHeroChange}
            />
            <label className="text-sm font-semibold text-gray-700">Subtitle</label>
            <textarea
              name="subTitle"
              placeholder="Subtitle"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white min-h-[60px] transition hover:bg-gray-50"
              value={heroData.subTitle}
              onChange={handleHeroChange}
            />
            <label className="text-sm font-semibold text-gray-700">Button Text</label>
            <input
              type="text"
              name="buttonText"
              placeholder="Button Text"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white transition hover:bg-gray-50"
              value={heroData.buttonText}
              onChange={handleHeroChange}
            />
            <label className="text-sm font-semibold text-gray-700">Button Link</label>
            <input
              type="text"
              name="buttonLink"
              placeholder="Button Link"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white transition hover:bg-gray-50"
              value={heroData.buttonLink}
              onChange={handleHeroChange}
            />
            <label className="text-sm font-semibold text-gray-700">Description</label>
            <textarea
              name="description"
              placeholder="Description"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white min-h-[60px] transition hover:bg-gray-50"
              value={heroData.description}
              onChange={handleHeroChange}
            />
            <label className="text-sm font-semibold text-gray-700">Hero Image <span className='text-xs text-gray-400'>(JPG, PNG, max 2MB)</span></label>
            <label className="block cursor-pointer group w-full flex flex-col items-center justify-center mt-1">
              <div className="w-full max-w-xs h-20 bg-neutral-50 border border-gray-200 rounded-lg flex flex-col items-center justify-center gap-2 transition group-hover:border-primary overflow-hidden relative mx-auto">
                {heroData.bannerImage ? (
                  <img
                    src={heroData.bannerImage}
                    alt="Banner"
                    className="object-cover w-full h-full rounded-lg transition-transform duration-200 group-hover:scale-105"
                  />
                ) : (
                  <>
                    <FiUploadCloud className="w-7 h-7 text-primary mb-1" />
                    <span className="text-xs text-gray-700 font-medium">
                      Click or drag hero image here to upload
                    </span>
                    <span className="text-xs text-gray-400">
                      PNG, JPG. Max 2MB.
                    </span>
                  </>
                )}
              </div>
              <input type="file" accept="image/*" className="hidden" onChange={handleHeroImageChange} />
            </label>
            {heroError && <div className="text-red-500 text-xs mt-2">{heroError}</div>}
            {heroSuccess && <div className="text-green-600 text-xs mt-2">{heroSuccess}</div>}
            <div className="flex justify-start mt-3">
              <Button text={heroSaving ? "Saving..." : "Save Hero Section"} onClick={handleSaveHero} disabled={heroSaving || heroLoading} className="px-8 py-2 rounded-lg shadow-sm text-base font-semibold bg-primary text-white transition hover:bg-primary/90" />
            </div>
          </div>
        </div>
        {/* Contact Details */}
        <div className="flex flex-col gap-4 border-l border-gray-200 pl-6">
          <div className="flex items-center gap-2 mb-1">
            <FiMail className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-gray-900">Contact Details</h2>
          </div>
          <p className="text-gray-500 text-sm mb-2">Update your business contact information and social links.</p>
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-gray-700">Address</label>
            <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white transition hover:bg-gray-50" placeholder="Address" />
            <label className="text-sm font-semibold text-gray-700">Phone</label>
            <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white transition hover:bg-gray-50" placeholder="Phone" />
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <input type="email" className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white transition hover:bg-gray-50" placeholder="Email" />
            <label className="text-sm font-semibold text-gray-700">Social Links</label>
            <input type="text" className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white transition hover:bg-gray-50" placeholder="Social Links" />
            <div className="flex justify-start mt-3">
              <Button text="Save Contact Details" className="px-8 py-2 rounded-lg shadow-sm text-base font-semibold bg-primary text-white transition hover:bg-primary/90" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  const renderFaqTab = () => (
    <section className="bg-white rounded-xl shadow-md border border-gray-200 w-full px-8 md:px-16 py-12">
      <div className="flex items-center gap-2 mb-6">
        <FiHelpCircle className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold text-gray-900">FAQ Management</h2>
      </div>
      <p className="text-gray-500 text-base mb-8">Manage frequently asked questions that appear on your website. Add, edit, or remove FAQs to help your visitors find answers quickly.</p>
      
      {faqLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <Loader />
            <span className="text-gray-600">Loading FAQs...</span>
          </div>
        </div>
      ) : (
        <AdminTable
          title="Frequently Asked Questions"
          buttonText="Add New FAQ"
          data={faqData}
          
          columns={faqColumns}
          endpoint="faqs"
        />
      )}
    </section>
  );

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      {/* Page Title and Tabs */}
      <header className="bg-white border-b border-gray-100 px-4 md:px-16 py-8 w-full">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-2">Site Settings</h1>
        <p className="text-gray-500 text-xl max-w-2xl">Manage your website's branding, hero section, contact information, and FAQs.</p>
        <nav className="mt-8 flex gap-6 border-b border-gray-200">
          <button 
            className={`pb-3 font-semibold text-base focus:outline-none transition-colors ${
              activeTab === "general" 
                ? "text-primary border-b-2 border-primary" 
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("general")}
          >
            General
          </button>
          <button 
            className={`pb-3 font-semibold text-base focus:outline-none transition-colors ${
              activeTab === "faq" 
                ? "text-primary border-b-2 border-primary" 
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("faq")}
          >
            FAQ
          </button>
        </nav>
      </header>
      <main className="flex-1 w-full flex flex-col items-center justify-start py-10 px-0">
        {activeTab === "general" ? renderGeneralTab() : renderFaqTab()}
      </main>
    </div>
  );
}
