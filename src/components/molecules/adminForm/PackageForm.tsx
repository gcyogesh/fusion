'use client'
import React, { useState, useEffect } from 'react';
import { fetchAPI } from '@/utils/apiService';
import { FiX, FiCamera, FiPlus, FiMapPin, FiDollarSign, FiInfo, FiList, FiFlag, FiImage, FiCalendar, FiUsers, FiActivity, FiHome, FiSun, FiNavigation, FiTag } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import Button from '@/components/atoms/button';
import Alert from '@/components/atoms/alert';

// Type for feature
interface Feature {
  groupSize: { min: string };
  tripDuration: string;
  tripDifficulty: string;
  meals: string[];
  activities: string[];
  accommodation: string[];
  maxAltitude: string;
  bestSeason: string[];
  startEndPoint: string;
}

// Type for formData
export interface TourPackageFormData {
  title: string;
  description: string;
  overview: string;
  location: { city: string; country: string;  };
  duration: { days: string; nights: string };
  basePrice: string;
  currency: string;
  itinerary: any[];
  inclusions: string[];
  exclusions: string[];
  highlights: string[];
  quickfacts: string[];
  feature: Feature;
  type: string;
  tag: string;
  rating: string;
  destination: string;
  activitiescategory: string;
}

interface TourPackageFormProps {
  initialData?: Partial<TourPackageFormData>;
  destinationId?: string;
  destinationTitle?: string;
  onClose?: () => void;
  type?: string;
}

// InputField component without validation
const InputField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  className = '',
  icon = null,
  min,
  max,
  readOnly = false
}) => (
  <div className={`mb-4 ${className}`}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary">
          {icon}
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm"
        readOnly={readOnly}
      />
    </div>
  </div>
);

// TextareaField component without validation
const TextareaField = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  icon = null
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute top-3 left-3 text-primary">
          {icon}
        </div>
      )}
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm"
      />
    </div>
  </div>
);

// Enhanced FileUploadField for single image (Google Map Image) without validation
const SingleImageUploadField = ({ label, name, onChange, file }) => {
  let previewUrl = '';
  if (file) {
    if (typeof file === 'string') {
      previewUrl = file;
    } else {
      previewUrl = URL.createObjectURL(file);
    }
  }
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="mt-1 flex flex-col items-center justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg">
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-48 h-32 object-cover rounded-lg border"
            />
            <button
              type="button"
              onClick={() => onChange({ target: { files: [] } })}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
            >
              Replace Image
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center cursor-pointer">
            <FiCamera className="mx-auto h-12 w-12 text-gray-400" />
            <span className="text-primary font-medium">{label ? `Upload ${label}` : 'Upload Image'}</span>
            <input
              type="file"
              name={name}
              className="sr-only"
              onChange={onChange}
              accept="image/*"
            />
            <span className="text-xs text-gray-500 mt-2">PNG, JPG, WEBP up to 5MB</span>
          </label>
        )}
      </div>
    </div>
  );
};

// Enhanced MultiImageUploadField for dynamic slots without validation
const MultiImageUploadField = ({ label, name, onChange, files, max = 10 }) => {
  const slots = files.length < max ? [...files, null] : files;
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="mt-1 flex flex-wrap gap-4 justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg">
        {slots.map((file, index) => {
          let previewUrl = '';
          if (file) {
            previewUrl = typeof file === 'string' ? file : URL.createObjectURL(file);
          }
          return (
            <div key={index} className="flex flex-col items-center gap-2 bg-primary/10 rounded-lg px-3 py-2 relative w-32 h-32 justify-center">
              {file ? (
                <>
                  <img
                    src={previewUrl}
                    alt={`Gallery Preview ${index + 1}`}
                    className="w-28 h-20 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newFiles = [...files];
                      newFiles.splice(index, 1);
                      onChange({ target: { files: newFiles } });
                    }}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                  >
                    Remove
                  </button>
                </>
              ) : (
                <label htmlFor={`gallery-upload-${name}-${index}`} className="flex flex-col items-center cursor-pointer w-full h-full justify-center">
                  <FiCamera className="mx-auto h-8 w-8 text-gray-400" />
                  <span className="text-primary font-medium text-xs">Add Image</span>
                  <input
                    type="file"
                    name={name}
                    className="sr-only"
                    id={`gallery-upload-${name}-${index}`}
                    onChange={e => {
                      const newFiles = [...files];
                      const fileInput = e.target.files && e.target.files[0];
                      if (fileInput) {
                        newFiles[index] = fileInput;
                        onChange({ target: { files: newFiles } });
                      }
                    }}
                    accept="image/*"
                  />
                </label>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ArrayField component without validation
const ArrayField = ({ label, name, value = [], onChange, placeholder }) => {
  const safeValue = Array.isArray(value) ? value : [];

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="space-y-2">
        {safeValue.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => {
                const updated = [...safeValue];
                updated[idx] = e.target.value;
                onChange(updated);
              }}
              placeholder={placeholder}
              className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => {
                const updated = [...safeValue];
                updated.splice(idx, 1);
                onChange(updated);
              }}
              className="p-2 text-red-500 hover:text-red-700 bg-red-50 rounded-lg"
            >
              <FiX />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...safeValue, ''])}
          className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          <FiPlus className="text-lg" /> Add Item
        </button>
      </div>
    </div>
  );
};

// StarRating component
const StarRating = ({ value, onChange, max = 5 }) => (
  <div className="flex items-center gap-1">
    {[...Array(max)].map((_, i) => (
      <button
        type="button"
        key={i}
        onClick={() => onChange((i + 1).toString())}
        className="focus:outline-none"
        aria-label={`Rate ${i + 1} star${i === 0 ? '' : 's'}`}
      >
        <FaStar
          className={
            'w-6 h-6 ' +
            (i < Number(value)
              ? 'text-yellow-400'
              : 'text-gray-300 hover:text-yellow-400')
          }
        />
      </button>
    ))}
    <span className="ml-2 text-sm text-gray-600">{value || 0}/5</span>
  </div>
);

const CategorySelectField = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select category",
  loading = false,
  icon = null
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary">
          {icon}
        </div>
      )}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm ${loading ? 'cursor-wait' : 'cursor-pointer'}`}
        disabled={loading}
      >
        <option value="">{loading ? 'Loading categories...' : placeholder}</option>
        {Array.isArray(options) && options.map((option) => (
          <option key={option._id} value={option._id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const TourPackageForm = ({ initialData = undefined, onClose, destinationId, destinationTitle, type }: TourPackageFormProps) => {
  const [formData, setFormData] = useState<TourPackageFormData>({
    title: '',
    description: '',
    overview: '',
    location: { city: '', country: '' },
    duration: { days: '', nights: '' },
    basePrice: '',
    currency: 'npr',
    itinerary: [],
    inclusions: [],
    exclusions: [],
    highlights: [],
    quickfacts: [],
    feature: {
      groupSize: { min: '' },
      tripDuration: '',
      tripDifficulty: 'Moderate',
      meals: [],
      activities: [],
      accommodation: [],
      maxAltitude: '',
      bestSeason: [],
      startEndPoint: '',
    },
    type: 'tour',
    tag: '',
    rating: '',
    destination: initialData?.destination || destinationId || "",
    activitiescategory: '',
  });

  const [galleryFiles, setGalleryFiles] = useState([]);
  const [googleMapImage, setGoogleMapImage] = useState(null);
  const [itineraryImages, setItineraryImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [alert, setAlert] = useState<{ show: boolean; type: 'success' | 'error' | 'confirm' | 'warning'; message: string }>({ show: false, type: 'success', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await fetch('https://yogeshbhai.ddns.net/api/category/activities');
        const json = await response.json();
        setCategories(json.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setAlert({ show: true, type: 'error', message: 'Failed to load categories' });
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        title: initialData.title ?? '',
        description: initialData.description ?? '',
        overview: initialData.overview ?? '',
        location: initialData.location ?? { city: '', country: '',  },
        duration: initialData.duration ?? { days: '', nights: '' },
        basePrice: initialData.basePrice ?? '',
        currency: initialData.currency ?? 'npr',
        itinerary: initialData.itinerary ?? [],
        inclusions: Array.isArray(initialData.inclusions)
          ? initialData.inclusions
          : (typeof initialData.inclusions === 'string' && !!initialData.inclusions ? (initialData.inclusions as string).split(',').map(s => s.trim()).filter(Boolean) : []),
        exclusions: Array.isArray(initialData.exclusions)
          ? initialData.exclusions
          : (typeof initialData.exclusions === 'string' && !!initialData.exclusions ? (initialData.exclusions as string).split(',').map(s => s.trim()).filter(Boolean) : []),
        highlights: Array.isArray(initialData.highlights)
          ? initialData.highlights
          : (typeof initialData.highlights === 'string' && !!initialData.highlights ? (initialData.highlights as string).split(',').map(s => s.trim()).filter(Boolean) : []),
        quickfacts: Array.isArray(initialData.quickfacts)
          ? initialData.quickfacts
          : (typeof initialData.quickfacts === 'string' && !!initialData.quickfacts ? (initialData.quickfacts as string).split(',').map(s => s.trim()).filter(Boolean) : []),
        tag: Array.isArray(initialData.tag)
          ? initialData.tag[0] || ''
          : (typeof initialData.tag === 'string' && initialData.tag.startsWith('[')
            ? JSON.parse(initialData.tag)[0] || ''
            : initialData.tag ?? ''),
        feature: {
          ...prev.feature,
          ...initialData.feature,
          meals: Array.isArray(initialData.feature?.meals)
            ? initialData.feature.meals
            : (typeof initialData.feature?.meals === 'string' && !!initialData.feature.meals ? (initialData.feature.meals as string).split(',').map(s => s.trim()).filter(Boolean) : []),
          activities: Array.isArray(initialData.feature?.activities)
            ? initialData.feature.activities
            : (typeof initialData.feature?.activities === 'string' && !!initialData.feature.activities ? (initialData.feature.activities as string).split(',').map(s => s.trim()).filter(Boolean) : []),
          accommodation: Array.isArray(initialData.feature?.accommodation)
            ? initialData.feature.accommodation
            : (typeof initialData.feature?.accommodation === 'string' && !!initialData.feature.accommodation ? (initialData.feature.accommodation as string).split(',').map(s => s.trim()).filter(Boolean) : []),
          bestSeason: Array.isArray(initialData.feature?.bestSeason)
            ? initialData.feature.bestSeason
            : (typeof initialData.feature?.bestSeason === 'string' && !!initialData.feature.bestSeason ? (initialData.feature.bestSeason as string).split(',').map(s => s.trim()).filter(Boolean) : []),
        },
        activitiescategory: initialData.activitiescategory ?? '',
      }));

      // Gallery and map image handling
      const gallery = 'gallery' in initialData ? initialData.gallery : undefined;
      const baseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL || '';
      let galleryArr = Array.isArray(gallery) ? gallery : (typeof gallery === 'string' ? [gallery] : []);
      galleryArr = galleryArr.map(img => {
        if (typeof img === 'string' && img && !img.startsWith('http')) {
          return `${baseUrl}${img}`;
        }
        return img;
      });
      setGalleryFiles(galleryArr);

      const mapImg = 'googleMapUrl' in initialData ? initialData.googleMapUrl : undefined;
      let mapImgUrl = null;
      if (typeof mapImg === 'string' && mapImg) {
        mapImgUrl = mapImg.startsWith('http') ? mapImg : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL || ''}${mapImg}`;
      }
      setGoogleMapImage(mapImgUrl);

      // Initialize itinerary images
      if (initialData.itinerary && Array.isArray(initialData.itinerary)) {
        const images = initialData.itinerary.map(item => item.image || null);
        setItineraryImages(images);
      }
    }
  }, [initialData]);

  useEffect(() => {
    if (destinationId) {
      setFormData((prev) => ({ ...prev, destination: destinationId }));
    }
  }, [destinationId]);

  useEffect(() => {
    if (submitStatus && submitStatus.type === 'success') {
      setAlert({ show: true, type: 'success', message: submitStatus.message });
    }
  }, [submitStatus]);

  // Next/Back navigation without validation
  const tabOrder = ['basic', 'location', 'pricing', 'details', 'features', 'itinerary', 'media'];
  const isLastTab = activeTab === tabOrder[tabOrder.length - 1];
  const isFirstTab = activeTab === tabOrder[0];

  const goToNextTab = () => {
    const idx = tabOrder.indexOf(activeTab);
    if (idx < tabOrder.length - 1) setActiveTab(tabOrder[idx + 1]);
  };

  const goToPrevTab = () => {
    const idx = tabOrder.indexOf(activeTab);
    if (idx > 0) setActiveTab(tabOrder[idx - 1]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (field, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [key]: value,
      },
    }));
  };



  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setGalleryFiles(files);

  };

  const handleMapImageChange = (e) => {
    const file = e.target.files[0];
    setGoogleMapImage(file);

  };

  // NEW: Handle itinerary image changes
  const handleItineraryImageChange = (idx, e) => {
    const file = e.target.files[0];
    setItineraryImages(prev => {
      const updated = [...prev];
      updated[idx] = file;
      return updated;
    });
    // Clear error for this specific itinerary image

  };
  const handleItineraryChange = (idx, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.itinerary];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, itinerary: updated };
    });
    // Clear related errors

  };

  const handleItineraryActivitiesChange = (idx, activities) => {
    setFormData((prev) => {
      const updated = [...prev.itinerary];
      updated[idx] = { ...updated[idx], activities };
      return { ...prev, itinerary: updated };
    });
    // Clear related errors

  };

  const handleAddItineraryDay = () => {
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        { day: prev.itinerary.length + 1, title: '', description: '', activities: [] },
      ],
    }));
    // Add corresponding image slot
    setItineraryImages(prev => [...prev, null]);
  };

  const handleRemoveItineraryDay = (idx) => {
    setFormData((prev) => {
      const updated = [...prev.itinerary];
      updated.splice(idx, 1);
      // Update day numbers
      updated.forEach((item, index) => {
        item.day = index + 1;
      });
      return { ...prev, itinerary: updated };
    });
    // Remove corresponding image
    setItineraryImages(prev => {
      const updated = [...prev];
      updated.splice(idx, 1);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();



    // Validate all tabs before submission




    setIsSubmitting(true);

    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('overview', formData.overview);
      form.append('basePrice', formData.basePrice);
      form.append('currency', formData.currency);
      form.append('type', formData.type);
      form.append('rating', formData.rating);
      form.append('destination', formData.destination);
      form.append('activitiescategory', formData.activitiescategory);
      form.append('tag', formData.tag);

      // JSON fields
      const jsonFields = {
        location: formData.location,
        duration: formData.duration,
        feature: formData.feature,
        itinerary: formData.itinerary.map(day => ({
          day: day.day,
          title: day.title,
          description: day.description,
          activities: day.activities
          // DO NOT include image here!
        })),
        inclusions: formData.inclusions,
        exclusions: formData.exclusions,
        highlights: formData.highlights,
        quickfacts: formData.quickfacts,
      };
      Object.entries(jsonFields).forEach(([key, value]) => {
        form.append(key, JSON.stringify(value));
      });

      // Gallery images
      galleryFiles.forEach(file => form.append('gallery', file));

      // Google Map image
      if (googleMapImage) form.append('googleMapImage', googleMapImage);



      itineraryImages.forEach((file, index) => {
        if (file) {
          form.append('itineraryImages', file);
        }
      });

      // Console log all FormData
      for (let pair of form.entries()) {
        console.log(pair[0] + ':', pair[1]);
      }

      await fetchAPI({
        endpoint: 'tour/tour-packages',
        method: 'POST',
        data: form,
      });

      setSubmitStatus({ type: 'success', message: 'Tour Package Created Successfully!' });
      setAlert({ show: true, type: 'success', message: 'Tour Package Created Successfully!' });
      resetForm();
    } catch (err) {
      let errorMessage = 'Failed to create tour package.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      // Show alert for backend validation errors
      setAlert({ show: true, type: 'error', message: errorMessage });
      setSubmitStatus({ type: 'error', message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      overview: '',
      location: { city: '', country: '', },
      duration: { days: '', nights: '' },
      basePrice: '',
      currency: 'npr',
      itinerary: [],
      inclusions: [],
      exclusions: [],
      highlights: [],
      quickfacts: [],
      feature: {
        groupSize: { min: '' },
        tripDuration: '',
        tripDifficulty: 'Moderate',
        meals: [],
        activities: [],
        accommodation: [],
        maxAltitude: '',
        bestSeason: [],
        startEndPoint: '',
      },
      type: 'tour',
      tag: '',
      rating: '',
      destination: '',
      activitiescategory: '', // <-- Add this line to fix the error
    });
    setGalleryFiles([]);
    setGoogleMapImage(null);
  };

  const renderStatus = () => {
    if (!alert.show) return null;
    return (
      <Alert
        show={alert.show}
        type={alert.type}
        message={alert.message}
        onConfirm={() => {
          setAlert({ ...alert, show: false });

        }}
        onCancel={() => {
          setAlert({ ...alert, show: false });

        }}
      />
    );
  };

  const renderBasicInfoTab = () => (
    <div className="space-y-4">
      <InputField
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Enter tour title"

        icon={<FiInfo />}

        min={undefined}
        max={undefined}
      />

      <TextareaField
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Enter detailed description"
        icon={<FiList />}
        rows={4}
      />

      <TextareaField
        label="Overview"
        name="overview"
        value={formData.overview}
        onChange={handleChange}
        placeholder="Enter brief overview"
        icon={<FiInfo />}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InputField
          label={type === 'activities' ? 'Activity' : 'Destination'}
          name="destinationTitle"
          value={destinationTitle || ''}
          onChange={() => { }}
          readOnly

          icon={<FiFlag />}
          placeholder={type === 'activities' ? 'Activity' : 'Destination'}
          min={undefined}
          max={undefined}
        />
        <input type="hidden" name="destination" value={destinationId} />

        {/* NEW: Activities Category Selection */}
        <CategorySelectField
          label="Activities Category"
          name="activitiescategory"
          value={formData.activitiescategory}
          onChange={handleChange}
          options={categories}
          placeholder="Select category"
          loading={loadingCategories}

          icon={<FiTag />}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
          <StarRating
            value={formData.rating}
            onChange={val => setFormData(f => ({ ...f, rating: val }))}
          />

        </div>
      </div>
    </div>
  );
  const renderLocationTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="City"
          name="city"
          value={formData.location.city}
          onChange={(e) => handleNestedChange('location', 'city', e.target.value)}
          placeholder="Enter city"

          icon={<FiMapPin />}
          min={undefined} max={undefined} />
        <InputField
          label="Country"
          name="country"
          value={formData.location.country}
          onChange={(e) => handleNestedChange('location', 'country', e.target.value)}
          placeholder="Enter country"

          icon={<FiMapPin />}
          min={undefined} max={undefined} />
      </div>
    
      <SingleImageUploadField
        label="Google Map Image"
        name="googleMapUrl"
        onChange={handleMapImageChange}
        file={googleMapImage}
      />
    </div>
  );

  const renderPricingTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Base Price"
          name="basePrice"
          value={formData.basePrice}
          onChange={handleChange}
          placeholder="Enter base price"

          type="number"
          icon={<FiDollarSign />}
          min={undefined} max={undefined} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary">
              <FiDollarSign />
            </div>
            <select
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm"
            >
              <option value="npr">NPR (Nepalese Rupee)</option>
              <option value="usd">USD (US Dollar)</option>
              <option value="eur">EUR (Euro)</option>
              <option value="gbp">GBP (British Pound)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Duration (Days)"
          name="days"
          value={formData.duration.days}
          onChange={(e) => handleNestedChange('duration', 'days', e.target.value)}
          placeholder="Enter days"

          type="number"
          icon={<FiCalendar />}
          min={undefined} max={undefined} />
        <InputField
          label="Duration (Nights)"
          name="nights"
          value={formData.duration.nights}
          onChange={(e) => handleNestedChange('duration', 'nights', e.target.value)}
          placeholder="Enter nights"

          type="number"
          icon={<FiCalendar />}
          min={undefined} max={undefined} />
      </div>
    </div>
  );

  const renderDetailsTab = () => (
    <div className="space-y-4">
      <ArrayField
        label="Inclusions"
        name="inclusions"
        value={formData.inclusions}
        onChange={(val) => setFormData({ ...formData, inclusions: val })}
        placeholder="Add inclusion"

      />

      <ArrayField
        label="Exclusions"
        name="exclusions"
        value={formData.exclusions}
        onChange={(val) => setFormData({ ...formData, exclusions: val })}
        placeholder="Add exclusion"

      />

      <ArrayField
        label="Highlights"
        name="highlights"
        value={formData.highlights}
        onChange={(val) => setFormData({ ...formData, highlights: val })}
        placeholder="Add highlight"

      />

      <ArrayField
        label="Quick Facts"
        name="quickfacts"
        value={formData.quickfacts}
        onChange={(val) => setFormData({ ...formData, quickfacts: val })}
        placeholder="Add quick fact"

      />

      <InputField
        label="Tag  (If it is Special tour then write 'special')"
        name="tag"
        value={formData.tag}
        onChange={handleChange}
        placeholder="Enter tag"

        icon={<FiTag />}
        min={undefined}
        max={undefined}
      />
    </div>
  );

  const renderFeaturesTab = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          label="Min Group Size"
          name="min"
          value={formData.feature.groupSize.min}
          onChange={(e) => setFormData({
            ...formData,
            feature: {
              ...formData.feature,
              groupSize: { min: e.target.value }
            }
          })}
          placeholder="Enter minimum group size"
          type="number"
          icon={<FiUsers />}
          min={undefined} max={undefined} />

        <InputField
          label="Trip Duration"
          name="tripDuration"
          value={formData.feature.tripDuration}
          onChange={(e) => handleNestedChange('feature', 'tripDuration', e.target.value)}
          placeholder="Enter trip duration"
          icon={<FiCalendar />}
          min={undefined} max={undefined} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Trip Difficulty</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-primary">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <select
              value={formData.feature.tripDifficulty}
              onChange={(e) => handleNestedChange('feature', 'tripDifficulty', e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm "
            >
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Difficult">Difficult</option>
            </select>
          </div>
        </div>

        <InputField
          label="Max Altitude"
          name="maxAltitude"
          value={formData.feature.maxAltitude}
          onChange={(e) => handleNestedChange('feature', 'maxAltitude', e.target.value)}
          placeholder="Enter max altitude"
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"></path>
          </svg>} min={undefined} max={undefined} />
      </div>

      <InputField
        label="Start/End Point"
        name="startEndPoint"
        value={formData.feature.startEndPoint}
        onChange={(e) => handleNestedChange('feature', 'startEndPoint', e.target.value)}
        placeholder="Enter start and end point"
        icon={<FiNavigation />} min={undefined} max={undefined} />

      <ArrayField
        label="Meals"
        name="meals"
        value={formData.feature.meals}
        onChange={(val) => handleNestedChange('feature', 'meals', val)}
        placeholder="Add meal"
      />

      <ArrayField
        label="Activities"
        name="activities"
        value={formData.feature.activities}
        onChange={(val) => handleNestedChange('feature', 'activities', val)}
        placeholder="Add activity"
      />

      <ArrayField
        label="Accommodation"
        name="accommodation"
        value={formData.feature.accommodation}
        onChange={(val) => handleNestedChange('feature', 'accommodation', val)}
        placeholder="Add accommodation"
      />

      <ArrayField
        label="Best Season"
        name="bestSeason"
        value={formData.feature.bestSeason}
        onChange={(val) => handleNestedChange('feature', 'bestSeason', val)}
        placeholder="Add season"
      />
    </div>
  );

  const renderItineraryTab = () => (
    <div className="space-y-6">
      {formData.itinerary.map((item, idx) => (
        <div key={idx} className="border rounded-lg p-4 mb-2 bg-primary/5">
          <div className="flex gap-4 items-center mb-2">
            <InputField
              label="Day"
              name={`day-${idx}`}
              type="number"
              value={item.day}
              onChange={e => handleItineraryChange(idx, 'day', e.target.value)}
              className="w-24"
              placeholder="Day number"
              min={1}
              max={365}
            />
            <InputField
              label="Title"
              name={`title-${idx}`}
              value={item.title}
              onChange={e => handleItineraryChange(idx, 'title', e.target.value)}
              className="flex-1"
              placeholder="Day title"
              min={undefined}
              max={undefined}
            />
            <Button text="Remove" onClick={() => handleRemoveItineraryDay(idx)} variant="secondary" className="!px-4 !py-2" />
          </div>
          <TextareaField
            label="Description"
            name={`description-${idx}`}
            value={item.description}
            onChange={e => handleItineraryChange(idx, 'description', e.target.value)}
            rows={2}
            placeholder="Day description"
          />
          <ArrayField
            label="Activities"
            name={`activities-${idx}`}
            value={item.activities}
            onChange={val => handleItineraryActivitiesChange(idx, val)}
            placeholder="Add activity"
          />
          <SingleImageUploadField
            label="Image"
            name={`image-${idx}`}
            onChange={e => handleItineraryImageChange(idx, e)}
            file={itineraryImages[idx] || null}
          />
        </div>
      ))}
      <Button text="Add Day" onClick={handleAddItineraryDay} leftIcon={<FiPlus />} />
    </div>
  );

  const renderMediaTab = () => {
    const gallerySlots = galleryFiles.length < 10 ? [...galleryFiles, ...Array(10 - galleryFiles.length).fill(null)] : galleryFiles;
    return (
      <div className="space-y-4">
        <MultiImageUploadField
          label="Gallery Images"
          name="gallery"
          onChange={handleGalleryChange}
          files={gallerySlots}
          max={10}
        />

      </div>
    );
  };

  const tabIcons = {
    basic: <FiInfo className="w-5 h-5" />,
    location: <FiMapPin className="w-5 h-5" />,
    pricing: <FiDollarSign className="w-5 h-5" />,
    details: <FiList className="w-5 h-5" />,
    features: <FiActivity className="w-5 h-5" />,
    itinerary: <FiList className="w-5 h-5" />,
    media: <FiImage className="w-5 h-5" />
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto p-4 md:p-8 flex items-center justify-center">
      <div className="max-w-6xl w-full max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-primary/10 flex flex-col relative">
        {/* X Button Only */}
        <button
          onClick={onClose}
          aria-label="Close form"
          className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-lg text-primary hover:bg-primary/10 hover:text-primary-dark transition-colors duration-150 z-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <FiX className="w-7 h-7" />
        </button>
        {/* Form Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {['basic', 'location', 'pricing', 'details', 'features', 'itinerary', 'media'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center gap-2 whitespace-nowrap py-4 px-6 font-medium text-base transition-all duration-200 ${activeTab === tab
                      ? 'text-primary border-b-2 border-primary bg-primary/10'
                      : 'text-gray-500 hover:text-primary hover:bg-primary/10'
                    }`}
                >
                  {tabIcons[tab]}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {renderStatus()}
            <form
              onSubmit={e => e.preventDefault()}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                }
              }}
              autoComplete="off" className="space-y-6">
              {activeTab === 'basic' && renderBasicInfoTab()}
              {activeTab === 'location' && renderLocationTab()}
              {activeTab === 'pricing' && renderPricingTab()}
              {activeTab === 'details' && renderDetailsTab()}
              {activeTab === 'features' && renderFeaturesTab()}
              {activeTab === 'itinerary' && renderItineraryTab()}
              {activeTab === 'media' && renderMediaTab()}
              <div className="pt-6 border-t border-gray-200 flex justify-between">
                <Button
                  type="button"
                  text="Back"
                  onClick={goToPrevTab}
                  variant="secondary"
                  className="!px-6 !py-3"
                  disabled={isFirstTab}
                />
                {isLastTab ? (
                  <Button
                    type="button"
                    text={isSubmitting ? 'Processing...' : (initialData ? 'Update Package' : 'Create Tour Package')}
                    disabled={isSubmitting}
                    leftIcon={isSubmitting ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : undefined}
                    className="!py-3 !px-8 font-bold"
                    onClick={handleSubmit}
                  />
                ) : (
                  <Button
                    type="button"
                    text="Next"
                    onClick={goToNextTab}
                    className="!py-3 !px-8 font-bold"
                  />
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TourPackageForm;