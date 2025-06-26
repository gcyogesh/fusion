'use client'

import React, { useState, useEffect } from 'react';
import { fetchAPI } from '@/utils/apiService';
import { FiX, FiCamera, FiPlus, FiMapPin, FiDollarSign, FiInfo, FiList, FiFlag, FiImage, FiCalendar, FiUsers, FiActivity, FiHome, FiSun, FiNavigation, FiAlertCircle } from 'react-icons/fi';
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
  location: { city: string; country: string; coordinates: { lat: string; lng: string } };
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
  tags: string[];
  rating: string;
  destination: string;
}

interface TourPackageFormProps {
  initialData?: Partial<TourPackageFormData>;
  onClose: () => void;
  destinationId?: string;
  destinationTitle?: string;
}

// Move InputField component outside
const InputField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  type = 'text', 
  className = '',
  icon = null,
  errors = {},
  min,
  max,
  readOnly = false
}) => (
  <div className={`mb-4 ${className}`}>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
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
        className={`w-full pl-10 pr-3 py-3 border rounded-lg shadow-sm ${
          errors[name] ? 'border-red-500' : 'border-gray-300'
        }`}
        readOnly={readOnly}
      />
    </div>
    {errors[name] && (
      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
        <FiAlertCircle className="flex-shrink-0" /> 
        {errors[name]}
      </p>
    )}
  </div>
);

// Move TextareaField component outside
const TextareaField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  rows = 3,
  icon = null,
  errors = {}
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
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
        className={`w-full pl-10 pr-3 py-2 border rounded-lg shadow-sm ${
          errors[name] ? 'border-red-500' : 'border-gray-300'
        }`}
      />
    </div>
    {errors[name] && (
      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
        <FiAlertCircle className="flex-shrink-0" /> 
        {errors[name]}
      </p>
    )}
  </div>
);

// Move FileUploadField component outside
const FileUploadField = ({ label, name, onChange, multiple = false, accept = 'image/*', files }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-300 rounded-lg">
      <div className="space-y-1 text-center">
        <FiCamera className="mx-auto h-12 w-12 text-gray-400" />
        <div className="flex text-sm text-gray-600">
          <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80">
            <span>Upload files</span>
            <input
              type="file"
              name={name}
              className="sr-only"
              onChange={onChange}
              multiple={multiple}
              accept={accept}
            />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs text-gray-500">
          PNG, JPG, WEBP up to 5MB
        </p>
        {files && files.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center bg-primary/10 rounded-lg px-3 py-2">
                <span className="text-sm text-primary truncate max-w-xs">{file.name}</span>
                <button 
                  type="button" 
                  onClick={() => {
                    if (multiple) {
                      const newFiles = [...files];
                      newFiles.splice(index, 1);
                      onChange({ target: { files: newFiles } });
                    } else {
                      onChange({ target: { files: [] } });
                    }
                  }}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <FiX />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

// Move ArrayField component outside
const ArrayField = ({ label, name, value, onChange, placeholder, required = false, errors = {} }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="space-y-2">
      {value.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => {
              const updated = [...value];
              updated[idx] = e.target.value;
              onChange(updated);
            }}
            placeholder={placeholder}
            className="flex-1 px-4 py-2.5 bg-white border border-gray-300 rounded-lg outline-none transition-all"
          />
          <button
            type="button"
            onClick={() => {
              const updated = [...value];
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
        onClick={() => onChange([...value, ''])}
        className="flex items-center gap-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
      >
        <FiPlus className="text-lg" /> Add Item
      </button>
    </div>
    {errors[name] && (
      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
        <FiAlertCircle className="flex-shrink-0" /> 
        {errors[name]}
      </p>
    )}
  </div>
);

const TourPackageForm = ({ initialData = undefined, onClose, destinationId, destinationTitle }: TourPackageFormProps) => {
  const [formData, setFormData] = useState<TourPackageFormData>({
    title: '',
    description: '',
    overview: '',
    location: { city: '', country: '', coordinates: { lat: '', lng: '' } },
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
    tags: [],
    rating: '',
    destination: initialData?.destination || destinationId || "",
  });

  const [galleryFiles, setGalleryFiles] = useState([]);
  const [googleMapImage, setGoogleMapImage] = useState(null);
  const [itineraryImages, setItineraryImages] = useState([]);
  const [alert, setAlert] = useState<{ show: boolean; type: 'success' | 'error' | 'confirm' | 'warning'; message: string }>({ show: false, type: 'success', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        inclusions: Array.isArray(initialData.inclusions)
          ? initialData.inclusions
          : (initialData.inclusions ? initialData.inclusions.split(',').map(s => s.trim()).filter(Boolean) : []),
        exclusions: Array.isArray(initialData.exclusions)
          ? initialData.exclusions
          : (initialData.exclusions ? initialData.exclusions.split(',').map(s => s.trim()).filter(Boolean) : []),
        highlights: Array.isArray(initialData.highlights)
          ? initialData.highlights
          : (initialData.highlights ? initialData.highlights.split(',').map(s => s.trim()).filter(Boolean) : []),
        quickfacts: Array.isArray(initialData.quickfacts)
          ? initialData.quickfacts
          : (initialData.quickfacts ? initialData.quickfacts.split(',').map(s => s.trim()).filter(Boolean) : []),
        tags: Array.isArray(initialData.tags)
          ? initialData.tags
          : (initialData.tags ? initialData.tags.split(',').map(s => s.trim()).filter(Boolean) : []),
        feature: {
          ...initialData.feature,
          meals: Array.isArray(initialData.feature?.meals)
            ? initialData.feature.meals
            : (initialData.feature?.meals ? initialData.feature.meals.split(',').map(s => s.trim()).filter(Boolean) : []),
          activities: Array.isArray(initialData.feature?.activities)
            ? initialData.feature.activities
            : (initialData.feature?.activities ? initialData.feature.activities.split(',').map(s => s.trim()).filter(Boolean) : []),
          accommodation: Array.isArray(initialData.feature?.accommodation)
            ? initialData.feature.accommodation
            : (initialData.feature?.accommodation ? initialData.feature.accommodation.split(',').map(s => s.trim()).filter(Boolean) : []),
          bestSeason: Array.isArray(initialData.feature?.bestSeason)
            ? initialData.feature.bestSeason
            : (initialData.feature?.bestSeason ? initialData.feature.bestSeason.split(',').map(s => s.trim()).filter(Boolean) : []),
        }
      });
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

  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.overview.trim()) newErrors.overview = 'Overview is required';
    if (!formData.location.city.trim()) newErrors.city = 'City is required';
    if (!formData.location.country.trim()) newErrors.country = 'Country is required';
    if (!formData.duration.days) newErrors.days = 'Duration days is required';
    if (!formData.duration.nights) newErrors.nights = 'Duration nights is required';
    if (!formData.basePrice) newErrors.basePrice = 'Base price is required';
    if (!formData.destination.trim()) newErrors.destination = 'Destination is required';

    if (formData.basePrice && isNaN(parseFloat(formData.basePrice))) {
      newErrors.basePrice = 'Base price must be a number';
    }
    if (formData.duration.days && isNaN(parseInt(formData.duration.days))) {
      newErrors.days = 'Days must be a number';
    }
    if (formData.duration.nights && isNaN(parseInt(formData.duration.nights))) {
      newErrors.nights = 'Nights must be a number';
    }
    if (formData.location.coordinates.lat && isNaN(parseFloat(formData.location.coordinates.lat))) {
      newErrors.lat = 'Latitude must be a number';
    }
    if (formData.location.coordinates.lng && isNaN(parseFloat(formData.location.coordinates.lng))) {
      newErrors.lng = 'Longitude must be a number';
    }

    const maxFileSize = 5 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    [...galleryFiles, googleMapImage, ...itineraryImages].forEach((file, index) => {
      if (file) {
        if (file.size > maxFileSize) {
          newErrors.fileSize = `File "${file.name}" is too large. Maximum size is 5MB.`;
        }
        if (!allowedTypes.includes(file.type)) {
          newErrors.fileType = `File "${file.name}" is not a supported image type.`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNestedChange = (field, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        [key]: value,
      },
    }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setGalleryFiles(files);
  };

  const handleMapImageChange = (e) => {
    const file = e.target.files[0];
    setGoogleMapImage(file);
  };

  const handleItineraryImageChange = (idx, e) => {
    const file = e.target.files[0];
    setFormData((prev) => {
      const updated = [...prev.itinerary];
      updated[idx] = { ...updated[idx], image: file };
      return { ...prev, itinerary: updated };
    });
  };

  const handleItineraryChange = (idx, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.itinerary];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, itinerary: updated };
    });
  };

  const handleItineraryActivitiesChange = (idx, activities) => {
    setFormData((prev) => {
      const updated = [...prev.itinerary];
      updated[idx] = { ...updated[idx], activities };
      return { ...prev, itinerary: updated };
    });
  };

  const handleAddItineraryDay = () => {
    setFormData((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        { day: prev.itinerary.length + 1, title: '', description: '', activities: [], image: '' },
      ],
    }));
  };

  const handleRemoveItineraryDay = (idx) => {
    setFormData((prev) => {
      const updated = [...prev.itinerary];
      updated.splice(idx, 1);
      return { ...prev, itinerary: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);
    setErrors({});

    if (!validateForm()) {
      setSubmitStatus({ type: 'error', message: 'Please fix the errors above before submitting.' });
      return;
    }

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

      const jsonFields = {
        location: formData.location,
        duration: formData.duration,
        feature: {
          ...formData.feature,
          meals: formData.feature.meals,
          activities: formData.feature.activities,
          accommodation: formData.feature.accommodation,
          bestSeason: formData.feature.bestSeason
        },
        itinerary: [],
        inclusions: formData.inclusions,
        exclusions: formData.exclusions,
        highlights: formData.highlights,
        quickfacts: formData.quickfacts,
        tags: formData.tags
      };

      Object.entries(jsonFields).forEach(([key, value]) => {
        form.append(key, JSON.stringify(value));
      });

      if (galleryFiles.length > 0) {
        galleryFiles.forEach((file) => {
          form.append('gallery', file);
        });
      }

      if (googleMapImage) {
        form.append('googleMapImage', googleMapImage);
      }

      if (itineraryImages.length > 0) {
        itineraryImages.forEach((file) => {
          form.append('itineraryImages', file);
        });
      }

      await fetchAPI({
        endpoint: 'tour/tour-packages',
        method: 'POST',
        data: form,
      });

      setSubmitStatus({ type: 'success', message: 'Tour Package Created Successfully!' });
      resetForm();
    } catch (err) {
      let errorMessage = 'Failed to create tour package.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
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
      location: { city: '', country: '', coordinates: { lat: '', lng: '' } },
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
      tags: [],
      rating: '',
      destination: '',
    });
    setGalleryFiles([]);
    setGoogleMapImage(null);
    setItineraryImages([]);
  };

  const renderStatus = () => {
    if (!submitStatus || submitStatus.type !== 'success') return null;
    return (
      <Alert
        show={alert.show}
        type={alert.type}
        message={alert.message}
        onConfirm={() => setAlert({ ...alert, show: false })}
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
        required
        icon={<FiInfo />}
        errors={errors} min={undefined} max={undefined}      />
      
      <TextareaField 
        label="Description" 
        name="description" 
        value={formData.description} 
        onChange={handleChange} 
        placeholder="Enter detailed description" 
        required 
        icon={<FiList />}
        rows={4}
        errors={errors}
      />
      
      <TextareaField 
        label="Overview" 
        name="overview" 
        value={formData.overview} 
        onChange={handleChange} 
        placeholder="Enter brief overview" 
        required 
        icon={<FiInfo />}
        errors={errors}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField 
          label="Destination"
          name="destinationTitle"
          value={destinationTitle || ''}
          onChange={() => {}}
          readOnly
          required
          icon={<FiFlag />}
        />
        <input type="hidden" name="destination" value={destinationId} />
        <InputField 
          label="Rating (1-5)" 
          name="rating"
          value={formData.rating} 
          onChange={handleChange} 
          placeholder="Enter rating" 
          type="number" 
          min="1"
          max="5"
          icon={<svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>}
          errors={errors}
        />
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
          required
          icon={<FiMapPin />}
          errors={errors} min={undefined} max={undefined}        />
        <InputField 
          label="Country"
          name="country"
          value={formData.location.country}
          onChange={(e) => handleNestedChange('location', 'country', e.target.value)}
          placeholder="Enter country"
          required
          icon={<FiMapPin />}
          errors={errors} min={undefined} max={undefined}        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField 
          label="Latitude"
          name="lat"
          value={formData.location.coordinates.lat}
          onChange={(e) => setFormData({
            ...formData,
            location: {
              ...formData.location,
              coordinates: {
                ...formData.location.coordinates,
                lat: e.target.value
              }
            }
          })}
          placeholder="Enter latitude"
          icon={<FiNavigation />}
          errors={errors} min={undefined} max={undefined}        />
        <InputField 
          label="Longitude"
          name="lng"
          value={formData.location.coordinates.lng}
          onChange={(e) => setFormData({
            ...formData,
            location: {
              ...formData.location,
              coordinates: {
                ...formData.location.coordinates,
                lng: e.target.value
              }
            }
          })}
          placeholder="Enter longitude"
          icon={<FiNavigation />}
          errors={errors} min={undefined} max={undefined}        />
      </div>
      
      <FileUploadField 
        label="Google Map Image" 
        name="googleMapImage" 
        onChange={handleMapImageChange} 
        files={googleMapImage ? [googleMapImage] : []} 
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
          required
          type="number"
          icon={<FiDollarSign />}
          errors={errors} min={undefined} max={undefined}        />
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
          required
          type="number"
          icon={<FiCalendar />}
          errors={errors} min={undefined} max={undefined}        />
        <InputField 
          label="Duration (Nights)"
          name="nights"
          value={formData.duration.nights}
          onChange={(e) => handleNestedChange('duration', 'nights', e.target.value)}
          placeholder="Enter nights"
          required
          type="number"
          icon={<FiCalendar />}
          errors={errors} min={undefined} max={undefined}        />
      </div>
    </div>
  );

  const renderDetailsTab = () => (
    <div className="space-y-4">
      <ArrayField 
        label="Inclusions" 
        name="inclusions" 
        value={formData.inclusions} 
        onChange={(val) => setFormData({...formData, inclusions: val})} 
        placeholder="Add inclusion" 
        errors={errors}
      />
      
      <ArrayField 
        label="Exclusions" 
        name="exclusions" 
        value={formData.exclusions} 
        onChange={(val) => setFormData({...formData, exclusions: val})} 
        placeholder="Add exclusion" 
        errors={errors}
      />
      
      <ArrayField 
        label="Highlights" 
        name="highlights" 
        value={formData.highlights} 
        onChange={(val) => setFormData({...formData, highlights: val})} 
        placeholder="Add highlight" 
        errors={errors}
      />
      
      <ArrayField 
        label="Quick Facts" 
        name="quickfacts" 
        value={formData.quickfacts} 
        onChange={(val) => setFormData({...formData, quickfacts: val})} 
        placeholder="Add quick fact" 
        errors={errors}
      />
      
      <ArrayField 
        label="Tags" 
        name="tags" 
        value={formData.tags} 
        onChange={(val) => setFormData({...formData, tags: val})} 
        placeholder="Add tag" 
        errors={errors}
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
          errors={errors} min={undefined} max={undefined}        />
        
        <InputField 
          label="Trip Duration"
          name="tripDuration"
          value={formData.feature.tripDuration}
          onChange={(e) => handleNestedChange('feature', 'tripDuration', e.target.value)}
          placeholder="Enter trip duration"
          icon={<FiCalendar />}
          errors={errors} min={undefined} max={undefined}        />
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
              <option value="Challenging">Challenging</option>
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
          </svg>} min={undefined} max={undefined}        />
      </div>
      
      <InputField 
        label="Start/End Point"
        name="startEndPoint"
        value={formData.feature.startEndPoint}
        onChange={(e) => handleNestedChange('feature', 'startEndPoint', e.target.value)}
        placeholder="Enter start and end point"
        icon={<FiNavigation />} min={undefined} max={undefined}      />
      
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
          <FileUploadField
            label="Image"
            name={`image-${idx}`}
            onChange={e => handleItineraryImageChange(idx, e)}
            multiple={false}
            files={item.image ? [item.image] : []}
            accept="image/*"
          />
        </div>
      ))}
      <Button text="Add Day" onClick={handleAddItineraryDay} leftIcon={<FiPlus />} />
    </div>
  );

  const renderMediaTab = () => (
    <div className="space-y-4">
      <FileUploadField 
        label="Gallery Images" 
        name="gallery" 
        onChange={handleGalleryChange} 
        multiple 
        files={galleryFiles} 
      />
      {(errors.fileSize || errors.fileType) && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <FiAlertCircle className="text-red-500 flex-shrink-0" />
          <div>
            {errors.fileSize && <p className="text-red-600">{errors.fileSize}</p>}
            {errors.fileType && <p className="text-red-600">{errors.fileType}</p>}
          </div>
        </div>
      )}
    </div>
  );

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
                  className={`flex items-center gap-2 whitespace-nowrap py-4 px-6 font-medium text-base transition-all duration-200 ${
                    activeTab === tab
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
            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">
              {activeTab === 'basic' && renderBasicInfoTab()}
              {activeTab === 'location' && renderLocationTab()}
              {activeTab === 'pricing' && renderPricingTab()}
              {activeTab === 'details' && renderDetailsTab()}
              {activeTab === 'features' && renderFeaturesTab()}
              {activeTab === 'itinerary' && renderItineraryTab()}
              {activeTab === 'media' && renderMediaTab()}
              <div className="pt-6 border-t border-gray-200 flex justify-between">
                <Button
                  text="Reset Form"
                  onClick={resetForm}
                  variant="secondary"
                  className="!px-6 !py-3"
                />
                <Button
                  text={isSubmitting ? 'Processing...' : (initialData ? 'Update Package' : 'Create Tour Package')}
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                  leftIcon={isSubmitting ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : undefined}
                  className="!py-3 !px-8 font-bold"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TourPackageForm;