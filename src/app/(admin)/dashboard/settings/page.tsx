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
  FiMessageCircle,
  FiFileText,
  FiCrop,
} from "react-icons/fi";
import { MdEdit } from "react-icons/md";
import Button from "@/components/atoms/button";
import { fetchAPI } from "@/utils/apiService";
import { AdminTable } from "@/components/organisms/ListingCard";
import Loader from "@/components/atoms/Loader";
import Alert from "@/components/atoms/alert";
import PasswordChangeComponent from "@/components/molecules/adminForm/PasswordChangeComponent";
import { ImageCropper, useImageCropper } from "@/components/atoms/imageCropper";

const HERO_PAGES = [
  { label: "Home", value: "home" },
  { label: "Contact", value: "contact" },
  { label: "Blog", value: "blog" },
  { label: "Activity", value: "activity" },
  { label: "Destination", value: "destinations" },
];

type TabType = "general" | "faq" | "password" | "terms";

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
    height: "230",
    width: "200",
  });
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroSaving, setHeroSaving] = useState(false);
  const [heroError, setHeroError] = useState("");
  const [heroSuccess, setHeroSuccess] = useState("");
  
  // Terms & Conditions state
  const [termsData, setTermsData] = useState({
    _id: "",
    pageTitle: "Terms and Conditions",
    sections: []
  });
  const [termsLoading, setTermsLoading] = useState(false);
  const [termsSaving, setTermsSaving] = useState(false);

  // Cancellation Policy state
  const [cancellationData, setCancellationData] = useState({
    _id: "",
    pageTitle: "Cancellation Policy",
    sections: []
  });
  const [cancellationLoading, setCancellationLoading] = useState(false);
  const [cancellationSaving, setCancellationSaving] = useState(false);

  const [logoUrls, setLogoUrls] = useState<string[]>(["", ""]);
  const [logoFiles, setLogoFiles] = useState<(File | null)>([null, null]);

  // Contact details state
  const [contactData, setContactData] = useState({
    _id: "",
    address: "",
    phone: "",
    email: "",
    phones: [] as string[],
    whatsappNumber: "",
    socialLinks: {
      facebook: "",
      linkedin: "",
      twitter: "",
      instagram: "",
    }
  });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSaving, setContactSaving] = useState(false);

  // FAQ tab state
  const [faqData, setFaqData] = useState<any[]>([]);
  const [faqLoading, setFaqLoading] = useState(false);

  const [alert, setAlert] = useState<{
    show: boolean;
    type: 'success' | 'error' | 'warning' | 'confirm';
    message: string;
  }>({ show: false, type: 'success', message: '' });

  // Image Cropper state
  const [showImageCropper, setShowImageCropper] = useState(false);

  // Fetch terms data when tab is activated
  useEffect(() => {
  if (activeTab === "terms") {
    setTermsLoading(true);
    fetchAPI({ endpoint: "terms" })
      .then((res) => {
        const data = res?.data;
        if (data && data.length > 0) {
          // Get the first (and only) terms document
          const termsDoc = data[0];
          setTermsData({
            _id: termsDoc._id || "",
            pageTitle: termsDoc.pageTitle || "Terms and Conditions",
            sections: termsDoc.sections || []
          });
        } else {
          // Initialize with empty structure if no terms exist
          setTermsData({
            _id: "",
            pageTitle: "Terms and Conditions",
            sections: []
          });
        }
      })
      .catch((error) => {
        console.error("Failed to fetch terms:", error);
        setAlert({
          show: true,
          type: "error",
          message: "Failed to fetch Terms & Conditions.",
        });
      })
      .finally(() => setTermsLoading(false));

    // Also fetch cancellation policy data
    setCancellationLoading(true);
    fetchAPI({ endpoint: "cancellation" })
      .then((res) => {
        const data = res?.data;
        if (data && data.length > 0) {
          // Get the first (and only) cancellation document
          const cancellationDoc = data[0];
          setCancellationData({
            _id: cancellationDoc._id || "",
            pageTitle: cancellationDoc.pageTitle || "Cancellation Policy",
            sections: cancellationDoc.sections || []
          });
        } else {
          // Initialize with empty structure if no cancellation policy exists
          setCancellationData({
            _id: "",
            pageTitle: "Cancellation Policy",
            sections: []
          });
        }
      })
      .catch((error) => {
        console.error("Failed to fetch cancellation policy:", error);
        setAlert({
          show: true,
          type: "error",
          message: "Failed to fetch Cancellation Policy.",
        });
      })
      .finally(() => setCancellationLoading(false));
  }
}, [activeTab]);


const handleAddSection = () => {
  setTermsData({
    ...termsData,
    sections: [
      ...termsData.sections,
      { title: "", content: "" }
    ]
  });
};

const handleRemoveSection = (index) => {
  const newSections = termsData.sections.filter((_, i) => i !== index);
  setTermsData({
    ...termsData,
    sections: newSections
  });
};

const handleSectionChange = (index, field, value) => {
  const newSections = [...termsData.sections];
  newSections[index] = {
    ...newSections[index],
    [field]: value
  };
  setTermsData({
    ...termsData,
    sections: newSections
  });
};

const handlePageTitleChange = (value) => {
  setTermsData({
    ...termsData,
    pageTitle: value
  });
};

// Cancellation Policy handlers
const handleAddCancellationSection = () => {
  const newSections = [...cancellationData.sections];
  newSections.push({
    title: "",
    content: ""
  });
  setCancellationData({
    ...cancellationData,
    sections: newSections
  });
};

const handleRemoveCancellationSection = (index) => {
  const newSections = [...cancellationData.sections];
  newSections.splice(index, 1);
  setCancellationData({
    ...cancellationData,
    sections: newSections
  });
};

const handleCancellationSectionChange = (index, field, value) => {
  const newSections = [...cancellationData.sections];
  newSections[index] = {
    ...newSections[index],
    [field]: value
  };
  setCancellationData({
    ...cancellationData,
    sections: newSections
  });
};

const handleCancellationPageTitleChange = (value) => {
  setCancellationData({
    ...cancellationData,
    pageTitle: value
  });
};
  // Save terms handler
  const handleSaveTerms = async () => {
  // Validate that we have at least one section with content
  const validSections = termsData.sections.filter(
    section => section.title.trim() && section.content.trim()
  );

  if (validSections.length === 0) {
    setAlert({
      show: true,
      type: "warning",
      message: "Please add at least one section with both title and content.",
    });
    return;
  }

  setTermsSaving(true);
  try {
    const payload = {
      pageTitle: termsData.pageTitle,
      sections: validSections
    };

    let response;
    if (termsData._id) {
      // Update existing terms
      response = await fetchAPI({
        endpoint: `terms/${termsData._id}`,
        method: "PUT",
        data: payload,
      });
    } else {
      // Create new terms
      response = await fetchAPI({
        endpoint: "terms",
        method: "POST",
        data: payload,
      });
    }

    // Update the local state with the response
    if (response?.data) {
      setTermsData({
        _id: response.data._id,
        pageTitle: response.data.pageTitle,
        sections: response.data.sections
      });
    }

    setAlert({
      show: true,
      type: "success",
      message: "Terms & Conditions saved successfully!",
    });
  } catch (e) {
    setAlert({
      show: true,
      type: "error",
      message: e.message || "Failed to save Terms & Conditions.",
    });
  } finally {
    setTermsSaving(false);
  }
};

// Save cancellation policy handler
const handleSaveCancellation = async () => {
  // Validate that we have at least one section with content
  const validSections = cancellationData.sections.filter(
    section => section.title.trim() && section.content.trim()
  );

  if (validSections.length === 0) {
    setAlert({
      show: true,
      type: "warning",
      message: "Please add at least one section with both title and content.",
    });
    return;
  }

  setCancellationSaving(true);
  try {
    const payload = {
      pageTitle: cancellationData.pageTitle,
      sections: validSections
    };

    let response;
    if (cancellationData._id) {
      // Update existing cancellation policy
      response = await fetchAPI({
        endpoint: `cancellation/${cancellationData._id}`,
        method: "PUT",
        data: payload,
      });
    } else {
      // Create new cancellation policy
      response = await fetchAPI({
        endpoint: "cancellation",
        method: "POST",
        data: payload,
      });
    }

    // Update the local state with the response
    if (response?.data) {
      setCancellationData({
        _id: response.data._id,
        pageTitle: response.data.pageTitle,
        sections: response.data.sections
      });
    }

    setAlert({
      show: true,
      type: "success",
      message: "Cancellation Policy saved successfully!",
    });
  } catch (e) {
    setAlert({
      show: true,
      type: "error",
      message: e.message || "Failed to save Cancellation Policy.",
    });
  } finally {
    setCancellationSaving(false);
  }
};

  // Fetch hero data
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
              height: data.height || '230',
              width: data.width || '200',
            });
          }
        })
        .catch(() => setHeroError("Failed to fetch hero banner."))
        .finally(() => setHeroLoading(false));
    }
  }, [selectedHeroPage, activeTab]);

  // Fetch logos
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

  // Fetch contact details
  useEffect(() => {
    if (activeTab === "general") {
      setContactLoading(true);
      fetchAPI({ endpoint: "info" })
        .then((res: any) => {
          if (res?.data) {
            const data = res.data;
            setContactData({
              _id: data._id || "",
              address: data.address || "",
              phone: data.phone || "",
              email: data.email || "",
              phones: data.phones || [],
              whatsappNumber: data.whatsappNumber || "",
              socialLinks: {
                facebook: data.socialLinks?.facebook || "",
                linkedin: data.socialLinks?.linkedin || "",
                twitter: data.socialLinks?.twitter || "",
                instagram: data.socialLinks?.instagram || "",
              }
            });
          }
        })
        .catch(() => console.error("Failed to fetch contact info"))
        .finally(() => setContactLoading(false));
    }
  }, [activeTab]);

  // Fetch FAQs
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

  // General tab handlers
  const handleHeroChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setHeroData({ ...heroData, [e.target.name]: e.target.value });
  };

  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Open image cropper with the selected file
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setShowImageCropper(true);
      // The cropper will handle the file processing
    }
  };

  const handleCropCurrentImage = () => {
    if (heroData.bannerImage) {
      setShowImageCropper(true);
    } else {
      setAlert({
        show: true,
        type: 'warning',
        message: 'No current image to crop. Please upload an image first.',
      });
    }
  };

  const handleAddNewImage = () => {
    // Trigger file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        const imageUrl = URL.createObjectURL(file);
        // Set the image source for the cropper
        setHeroData({
          ...heroData,
          bannerImage: imageUrl
        });
        setShowImageCropper(true);
      }
    };
    fileInput.click();
  };

  const handleImageCropComplete = (croppedFile: File, cropData: any) => {
    setHeroImageFile(croppedFile);
    
    // Use the crop data dimensions directly
    setHeroData({
      ...heroData,
      bannerImage: URL.createObjectURL(croppedFile),
      width: cropData.finalWidth ? cropData.finalWidth.toString() : heroData.width,
      height: cropData.finalHeight ? cropData.finalHeight.toString() : heroData.height,
    });
    
    setShowImageCropper(false);
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

  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name.startsWith('socialLinks.')) {
      const socialField = name.split('.')[1];
      setContactData({
        ...contactData,
        socialLinks: {
          ...contactData.socialLinks,
          [socialField]: value
        }
      });
    } else if (name === 'phones') {
      const phoneArray = value.split(',').map(phone => phone.trim());
      setContactData({
        ...contactData,
        phones: phoneArray
      });
    } else {
      setContactData({ ...contactData, [name]: value });
    }
  };

  // 
  const handleSaveHero = async () => {
    setHeroSaving(true);
    try {
      const formData = new FormData();
  
      // Always include all required fields
      formData.append('page', selectedHeroPage);
      formData.append('title', heroData.title);
      formData.append('subTitle', heroData.subTitle);
      formData.append('description', heroData.description);
      formData.append('buttonText', heroData.buttonText);
      formData.append('buttonLink', heroData.buttonLink);
      formData.append('height', heroData.height.toString());
      formData.append('width', heroData.width.toString());
  
      // Only append the file if it exists
      if (heroImageFile) {
        formData.append('bannerImage', heroImageFile);
      }
  
      await fetchAPI({
        endpoint: `herobanner/${selectedHeroPage}`, // ✅ Template literal fixed here
        method: 'PUT',
        data: formData,
      });
  
      setAlert({
        show: true,
        type: 'success',
        message: 'Hero banner updated successfully!',
      });
  
      setHeroImageFile(null);
    } catch (e: any) {
      setAlert({
        show: true,
        type: 'error',
        message: e.message || 'Failed to update hero banner.',
      });
    } finally {
      setHeroSaving(false);
    }
  };
  










  
  const handleSaveLogos = async () => {
    if (!logoFiles[0] || !logoFiles[1]) {
      setAlert({ show: true, type: 'warning', message: 'Please select both primary and secondary logos to upload.' });
      return;
    }
    try {
      const formData = new FormData();
      formData.append('urls', logoFiles[0]);
      formData.append('urls', logoFiles[1]);
      
      const res: any = await fetchAPI({
        endpoint: 'logo',
        method: 'POST',
        data: formData,
      });
      
      if (res?.data?.image?.urls) {
        setLogoUrls([
          res.data.image.urls[0] || '',
          res.data.image.urls[1] || '',
        ]);
        setLogoFiles([null, null]);
        setAlert({ show: true, type: 'success', message: 'Logos uploaded successfully!' });
      } else {
        setAlert({ show: true, type: 'error', message: 'Failed to upload logos.' });
      }
    } catch (e: any) {
      setAlert({ show: true, type: 'error', message: e.message || 'Failed to upload logos.' });
    }
  };

  const handleSaveContact = async () => {
    if (
      !contactData.address.trim() ||
      !contactData.phone.trim() ||
      !contactData.email.trim()
    ) {
      setAlert({
        show: true,
        type: 'warning',
        message: 'Address, and email are required.',
      });
      return;
    }

    setContactSaving(true);
    try {
      await fetchAPI({
        endpoint: 'info',
        method: 'POST',
        data: {
          _id: contactData._id,
          address: contactData.address,
          phone: contactData.phone,
          email: contactData.email,
          phones: contactData.phones,
          whatsappNumber: contactData.whatsappNumber,
          socialLinks: contactData.socialLinks,
        },
      });

      setAlert({
        show: true,
        type: 'success',
        message: 'Contact details updated successfully!',
      });
    } catch (e: any) {
      setAlert({
        show: true,
        type: 'error',
        message: e.message || 'Failed to update contact details.',
      });
    } finally {
      setContactSaving(false);
    }
  };

  // Tab rendering functions
  const faqColumns = [
    { key: "question", label: "Question", type: "text", accessor: "question" as keyof any },
    { key: "answer", label: "Answer", type: "textarea", accessor: "answer" as keyof any },
  ];

  const mappedFaqData = faqData.map(faq => ({
    ...faq,
    question: faq.question || faq.title || '',
  }));

  const renderGeneralTab = () => (
    <section className="bg-white rounded-xl shadow-md border border-gray-200 w-full px-8 md:px-16 py-12">
      {alert.show && (
        <Alert
          show={alert.show}
          type={alert.type}
          message={alert.message}
          onConfirm={() => setAlert({ ...alert, show: false })}
        />
      )}
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
            <Button text="Save Logos" onClick={handleSaveLogos} className="px-8 py-2 rounded-lg shadow-sm text-base font-semibold bg-primary text-white transition hover:bg-primary/90" />
          </div>
        </div>
        
        {/* Hero Section */}
        <div className="flex flex-col gap-4 border-l border-gray-200 pl-6">
          <div className="flex items-center gap-2 mb-1">
            <FiImage className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-gray-900">Hero Section</h2>
          </div>
          <p className="text-gray-500 text-sm mb-2">Edit the hero banner for each main page. Update the title, subtitle, button, and image. <span className="text-blue-600 font-medium">Note: Use fixed pixel dimensions (e.g., 600px) to ensure consistent image display across all screen resolutions.</span></p>
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
            <label className="text-sm font-semibold text-gray-700">Height</label>
            <input
              type="text"
              name="height"
              placeholder="Height in pixels (e.g., 600px)"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white transition hover:bg-gray-50"
              value={heroData.height}
              onChange={e => setHeroData({ ...heroData, height: e.target.value })}
            />
            <label className="text-sm font-semibold text-gray-700">Width</label>
            <input
              type="text"
              name="width"
              placeholder="Width will always be full screen (100vw)"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white transition hover:bg-gray-50"
              value={heroData.width}
              onChange={e => setHeroData({ ...heroData, width: e.target.value })}
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">Width is automatically set to full screen coverage</p>
            <label className="text-sm font-semibold text-gray-700">Hero Image <span className='text-xs text-gray-400'>(JPG, PNG, max 2MB)</span></label>
            
            {/* Image Upload and Cropper Controls */}
            <div className="space-y-3">
              <label className="block cursor-pointer group w-full flex flex-col items-center justify-center mt-1">
                <div className="w-full max-w-xs h-20 bg-neutral-50 border border-gray-200 rounded-lg flex flex-col items-center justify-center gap-2 transition group-hover:border-primary overflow-hidden relative mx-auto">
                  {heroData.bannerImage ? (
                    <img
                      src={heroData.bannerImage}
                      alt="Banner"
                      className="object-cover w-full h-full rounded-lg transition-transform duration-200 group-hover:scale-105"
                      {...(!isNaN(Number(heroData.height)) && { height: Number(heroData.height) })}
                      {...(!isNaN(Number(heroData.width)) && { width: Number(heroData.width) })}
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
              
              {/* Cropper Buttons */}
              <div className="flex gap-2">
                <button
                  data-testid="crop-current-image"
                  type="button"
                  onClick={handleCropCurrentImage}
                  disabled={!heroData.bannerImage}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiCrop className="w-4 h-4" />
                  Crop Current Image
                </button>
                <button
                  data-testid="add-new-image"
                  type="button"
                  onClick={handleAddNewImage}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <FiUploadCloud className="w-4 h-4" />
                  Add New Image
                </button>
              </div>
              

            </div>
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
          
          {contactLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2">
                <Loader />
                <span className="text-gray-600 text-sm">Loading contact details...</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                <FiMapPin className="w-4 h-4" />
                Address
              </label>
            
           
              <input 
                type="text" 
                name="phone"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white transition hover:bg-gray-50" 
                placeholder="Primary Phone Number" 
                value={contactData.phone}
                onChange={handleContactChange}
              />
              
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                <FiPhone className="w-4 h-4" />
                Additional Phones <span className="text-xs text-gray-400">(comma-separated)</span>
              </label>
              <input 
                type="text" 
                name="phones"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white transition hover:bg-gray-50" 
                placeholder="Additional phone numbers" 
                value={contactData.phones.join(', ')}
                onChange={handleContactChange}
              />
              
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                <FiMessageCircle className="w-4 h-4" />
                WhatsApp Number
              </label>
              <input 
                type="text" 
                name="whatsappNumber"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white transition hover:bg-gray-50" 
                placeholder="WhatsApp Number" 
                value={contactData.whatsappNumber}
                onChange={handleContactChange}
              />
              
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                <FiMail className="w-4 h-4" />
                Email
              </label>
              <input 
                type="email" 
                name="email"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white transition hover:bg-gray-50" 
                placeholder="Business Email" 
                value={contactData.email}
                onChange={handleContactChange}
              />
              
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                <FiGlobe className="w-4 h-4" />
                Social Links
              </label>
              
              <div className="space-y-2">
                <input 
                  type="url" 
                  name="socialLinks.facebook"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white transition hover:bg-gray-50" 
                  placeholder="Facebook URL" 
                  value={contactData.socialLinks.facebook}
                  onChange={handleContactChange}
                />
                <input 
                  type="url" 
                  name="socialLinks.instagram"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white transition hover:bg-gray-50" 
                  placeholder="Instagram URL" 
                  value={contactData.socialLinks.instagram}
                  onChange={handleContactChange}
                />
                <input 
                  type="url" 
                  name="socialLinks.linkedin"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white transition hover:bg-gray-50" 
                  placeholder="LinkedIn URL" 
                  value={contactData.socialLinks.linkedin}
                  onChange={handleContactChange}
                />
                <input 
                  type="url" 
                  name="socialLinks.twitter"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white transition hover:bg-gray-50" 
                  placeholder="Twitter URL" 
                  value={contactData.socialLinks.twitter}
                  onChange={handleContactChange}
                />
              </div>
              
              <div className="flex justify-start mt-3">
                <Button 
                  text={contactSaving ? "Saving..." : "Save Contact Details"} 
                  onClick={handleSaveContact}
                  disabled={contactSaving || contactLoading}
                  className="px-8 py-2 rounded-lg shadow-sm text-base font-semibold bg-primary text-white transition hover:bg-primary/90" 
                />
              </div>
            </div>
          )}
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
          data={mappedFaqData}
          columns={faqColumns}
          endpoint="faqs"
        />
      )}
    </section>
  );

  const renderPasswordTab = () => (
    <section className="w-full flex justify-center">
      <PasswordChangeComponent />
    </section>
  );

 const renderTermsTab = () => (
  <section className="bg-white rounded-xl shadow-md border border-gray-200 w-full px-8 md:px-16 py-12">
    <div className="flex items-center gap-2 mb-6">
      <FiFileText className="w-6 h-6 text-primary" />
      <h2 className="text-2xl font-bold text-gray-900">Terms & Conditions & Cancellation Policy</h2>
    </div>
    
    {alert.show && (
      <Alert
        show={alert.show}
        type={alert.type}
        message={alert.message}
        onConfirm={() => setAlert({ ...alert, show: false })}
      />
    )}
    
    {(termsLoading || cancellationLoading) ? (
      <div className="flex items-center justify-center py-8">
        <div className="flex items-center gap-2">
          <Loader />
          <span className="text-gray-600 text-sm">Loading content...</span>
        </div>
      </div>
    ) : (
      <div className="space-y-12">
        {/* Terms & Conditions Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <FiFileText className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold text-gray-900">Terms & Conditions</h3>
          </div>
          
          <p className="text-gray-500 text-base">
            Manage your website's Terms & Conditions. You can add multiple sections with titles and content.
          </p>
          
          {/* Page Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Page Title</label>
            <input
              type="text"
              value={termsData.pageTitle}
              onChange={(e) => handlePageTitleChange(e.target.value)}
              placeholder="Terms and Conditions"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white transition hover:bg-gray-50"
            />
          </div>

          {/* Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">Sections</h4>
              <Button
                text="Add Section"
                onClick={handleAddSection}
                className="px-4 py-2 rounded-lg shadow-sm text-sm font-semibold bg-green-600 text-white transition hover:bg-green-700"
              />
            </div>

            {termsData.sections.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <FiFileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 mb-3">No sections added yet.</p>
                <Button
                  text="Add First Section"
                  onClick={handleAddSection}
                  className="px-6 py-2 rounded-lg shadow-sm text-sm font-semibold bg-primary text-white transition hover:bg-primary/90"
                />
              </div>
            ) : (
              <div className="space-y-4">
                {termsData.sections.map((section, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-sm font-semibold text-gray-700">Section {index + 1}</h5>
                      <button
                        onClick={() => handleRemoveSection(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Remove section"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">Section Title</label>
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                          placeholder="e.g., Acceptance of Terms"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white transition hover:bg-gray-50"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">Section Content</label>
                        <textarea
                          rows={4}
                          value={section.content}
                          onChange={(e) => handleSectionChange(index, 'content', e.target.value)}
                          placeholder="Enter the content for this section..."
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white transition hover:bg-gray-50 resize-vertical"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-start pt-4 border-t border-gray-200">
            <Button
              text={termsSaving ? "Saving..." : "Save Terms & Conditions"}
              onClick={handleSaveTerms}
              disabled={termsSaving}
              className="px-8 py-3 rounded-lg shadow-sm text-base font-semibold bg-primary text-white transition hover:bg-primary/90 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* Cancellation Policy Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <FiHelpCircle className="w-5 h-5 text-orange-500" />
            <h3 className="text-xl font-semibold text-gray-900">Cancellation Policy</h3>
          </div>
          
          <p className="text-gray-500 text-base">
            Manage your website's Cancellation Policy. You can add multiple sections with titles and content.
          </p>
          
          {/* Page Title */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Page Title</label>
            <input
              type="text"
              value={cancellationData.pageTitle}
              onChange={(e) => handleCancellationPageTitleChange(e.target.value)}
              placeholder="Cancellation Policy"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white transition hover:bg-gray-50"
            />
          </div>

          {/* Sections */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-900">Sections</h4>
              <Button
                text="Add Section"
                onClick={handleAddCancellationSection}
                className="px-4 py-2 rounded-lg shadow-sm text-sm font-semibold bg-orange-600 text-white transition hover:bg-orange-700"
              />
            </div>

            {cancellationData.sections.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <FiHelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 mb-3">No sections added yet.</p>
                <Button
                  text="Add First Section"
                  onClick={handleAddCancellationSection}
                  className="px-6 py-2 rounded-lg shadow-sm text-sm font-semibold bg-orange-500 text-white transition hover:bg-orange-600"
                />
              </div>
            ) : (
              <div className="space-y-4">
                {cancellationData.sections.map((section, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="text-sm font-semibold text-gray-700">Section {index + 1}</h5>
                      <button
                        onClick={() => handleRemoveCancellationSection(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                        title="Remove section"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">Section Title</label>
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => handleCancellationSectionChange(index, 'title', e.target.value)}
                          placeholder="e.g., Cancellation Timeframe"
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white transition hover:bg-gray-50"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium text-gray-600 mb-1 block">Section Content</label>
                        <textarea
                          rows={4}
                          value={section.content}
                          onChange={(e) => handleCancellationSectionChange(index, 'content', e.target.value)}
                          placeholder="Enter the content for this section..."
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none text-base bg-white transition hover:bg-gray-50 resize-vertical"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-start pt-4 border-t border-gray-200">
            <Button
              text={cancellationSaving ? "Saving..." : "Save Cancellation Policy"}
              onClick={handleSaveCancellation}
              disabled={cancellationSaving}
              className="px-8 py-3 rounded-lg shadow-sm text-base font-semibold bg-orange-500 text-white transition hover:bg-orange-600 disabled:opacity-50"
            />
          </div>
        </div>
      </div>
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
            data-testid="general-tab"
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
          <button 
            className={`pb-3 font-semibold text-base focus:outline-none transition-colors ${
              activeTab === "password" 
                ? "text-primary border-b-2 border-primary" 
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("password")}
          >
            Password
          </button>
          <button
            className={`pb-3 font-semibold text-base focus:outline-none transition-colors ${
              activeTab === "terms"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("terms")}
          >
            Terms & Conditions
          </button>
        </nav>
      </header>
      <main className="flex-1 w-full flex flex-col items-center justify-start py-10 px-0">
        {activeTab === "general" && renderGeneralTab()}
        {activeTab === "faq" && renderFaqTab()}
        {activeTab === "password" && renderPasswordTab()}
        {activeTab === "terms" && renderTermsTab()}
      </main>

      {/* Image Cropper Components */}
      {showImageCropper && (
        <ImageCropper
          onCropComplete={handleImageCropComplete}
          onCancel={() => setShowImageCropper(false)}
          initialImage={heroData.bannerImage}
          aspectRatio={3/1}
          quality={0.9}
          format="image/jpeg"
        />
      )}



      {/* Alert Component */}
      {alert.show && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ ...alert, show: false })}
        />
      )}
    </div>
  );
}