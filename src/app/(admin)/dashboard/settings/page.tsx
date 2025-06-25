"use client";
import React, { useState, useEffect } from "react";
import {
  FiImage,
  FiEdit2,
  FiMail,
  FiPhone,
  FiMapPin,
  FiGlobe,
  FiUploadCloud,
} from "react-icons/fi";
import { MdEdit } from "react-icons/md";
import Button from "@/components/atoms/button";
import { fetchAPI } from "@/utils/apiService";

const HERO_PAGES = [
  { label: "Home", value: "home" },
  { label: "Contact", value: "contact" },
  { label: "Blog", value: "blog" },
  { label: "Activity", value: "activity" },
  { label: "Destination", value: "destinations" },
];

export default function SettingsPage() {
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

  useEffect(() => {
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
  }, [selectedHeroPage]);

  useEffect(() => {
    fetchAPI({ endpoint: "logo" }).then((res: any) => {
      if (res?.data?.image?.urls) {
        setLogoUrls([
          res.data.image.urls[0] || "",
          res.data.image.urls[1] || "",
        ]);
      }
    });
  }, []);

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
          endpoint: "upload",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4 py-10 overflow-y-auto">
      <div className="w-full max-w-7xl">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2 text-center">
          Site Settings
        </h1>
        <p className="text-gray-500 mb-10 text-lg text-center">
          Manage your website's branding, hero section, and contact information.
        </p>
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-0 flex flex-col lg:flex-row overflow-hidden">
          {/* Logo Management */}
          <div className="flex-1 bg-gradient-to-b from-primary/5 to-white p-10 flex flex-col items-center justify-center min-w-[340px] gap-8 border-r border-gray-100">
            <h2 className="text-2xl font-bold text-primary mb-6 tracking-tight flex items-center gap-2">
              <FiImage className="w-7 h-7" /> Logo Management
            </h2>
            <div className="flex flex-row gap-8 w-full justify-center">
              {[0, 1].map((idx) => (
                <div key={idx} className="flex flex-col items-center w-44">
                  <span className="text-base font-semibold text-gray-700 mb-2">
                    {idx === 0 ? "Primary Logo" : "Secondary Logo"}
                  </span>
                  <label className="block cursor-pointer group w-full relative">
                    <div className="w-full h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 transition group-hover:border-primary group-hover:bg-primary/5 overflow-hidden relative shadow-sm">
                      {logoUrls[idx] ? (
                        <>
                          <img
                            src={logoUrls[idx]}
                            alt={idx === 0 ? "Primary Logo" : "Secondary Logo"}
                            className="h-full object-contain mx-auto rounded-lg"
                          />
                          <span className="absolute top-2 right-2 bg-white rounded-full shadow p-1 cursor-pointer group-hover:bg-primary/10 transition">
                            <MdEdit className="w-5 h-5 text-primary" />
                          </span>
                        </>
                      ) : (
                        <>
                          <FiUploadCloud className="w-8 h-8 text-primary mb-1" />
                          <span className="text-gray-700 font-medium">
                            Click or drag logo here to upload
                          </span>
                          <span className="text-xs text-gray-400">
                            PNG, JPG, SVG. Max 1MB.
                          </span>
                        </>
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
            <div className="flex justify-center mt-8 w-full">
              <Button text="Save Logos" className="w-full max-w-xs" />
            </div>
          </div>

          {/* Hero Section & Contact */}
          <div className="flex-[2] flex flex-col gap-10 p-10 bg-white">
            {/* Hero Section */}
            <div className="bg-gray-50 rounded-2xl shadow border border-gray-100 p-8 mb-2">
              <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-6">
                <FiImage className="w-6 h-6" /> Hero Section
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-medium text-gray-700">Page</label>
                  <select
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white mb-2"
                    value={selectedHeroPage}
                    onChange={(e) => setSelectedHeroPage(e.target.value)}
                  >
                    {HERO_PAGES.map((page) => (
                      <option key={page.value} value={page.value}>
                        {page.label}
                      </option>
                    ))}
                  </select>
                  <label className="text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    name="title"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white"
                    value={heroData.title}
                    onChange={handleHeroChange}
                  />
                  <label className="text-sm font-medium text-gray-700 mt-2">Subtitle</label>
                  <input
                    type="text"
                    name="subTitle"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white"
                    value={heroData.subTitle}
                    onChange={handleHeroChange}
                  />
                  <label className="text-sm font-medium text-gray-700 mt-2">Button Text</label>
                  <input
                    type="text"
                    name="buttonText"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white"
                    value={heroData.buttonText}
                    onChange={handleHeroChange}
                  />
                  <label className="text-sm font-medium text-gray-700 mt-2">Button Link</label>
                  <input
                    type="text"
                    name="buttonLink"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white"
                    value={heroData.buttonLink}
                    onChange={handleHeroChange}
                  />
                </div>
                <div className="flex flex-col gap-3 justify-between">
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white min-h-[80px]"
                    value={heroData.description}
                    onChange={handleHeroChange}
                  />
                  <label className="text-sm font-medium text-gray-700 mt-2">Hero Image</label>
                  <label className="block cursor-pointer group w-full flex flex-col items-center justify-center mt-2">
                    <div className="w-full max-w-xs h-28 bg-gray-100 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-2 transition group-hover:border-primary group-hover:bg-primary/5 overflow-hidden relative mx-auto">
                      {heroData.bannerImage ? (
                        <img
                          src={heroData.bannerImage}
                          alt="Banner"
                          className="object-cover w-full h-full rounded-lg"
                        />
                      ) : (
                        <>
                          <FiUploadCloud className="w-8 h-8 text-primary mb-1" />
                          <span className="text-gray-700 font-medium">
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
                </div>
              </div>
              {heroError && <div className="text-red-500 text-sm mt-2">{heroError}</div>}
              {heroSuccess && <div className="text-green-600 text-sm mt-2">{heroSuccess}</div>}
              <div className="flex justify-end mt-8">
                <Button text={heroSaving ? "Saving..." : "Save Hero Section"} onClick={handleSaveHero} disabled={heroSaving || heroLoading} />
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-gray-50 rounded-2xl shadow border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-primary flex items-center gap-2 mb-6">
                <FiMail className="w-6 h-6" /> Contact Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FiMapPin className="w-4 h-4" /> Address
                  </label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white" placeholder="Address" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FiPhone className="w-4 h-4" /> Phone
                  </label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white" placeholder="Phone" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FiMail className="w-4 h-4" /> Email
                  </label>
                  <input type="email" className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white" placeholder="Email" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <FiGlobe className="w-4 h-4" /> Social Links
                  </label>
                  <input type="text" className="w-full border border-gray-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white" placeholder="Social Links" />
                </div>
              </div>
              <div className="flex justify-end mt-8">
                <Button text="Save Contact Details" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
