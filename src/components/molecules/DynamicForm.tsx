'use client';

import React, { useState, useEffect } from 'react';
import { FiCamera, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import { fetchAPI } from '@/utils/apiService';

const isImageField = (key: string, label?: string) => {
  const str = (key + ' ' + (label || '')).toLowerCase();
  return str.includes('imageurls') || str.includes('imageurl') || str.includes('image') || str.includes('photo') || str.includes('gallery') || str.includes('thumbnail');
};

const isTextareaField = (key: string, label?: string) => {
  const str = (key + ' ' + (label || '')).toLowerCase();
  return str.includes('description') || str.includes('desc') || str.includes('about');
};

const isCheckboxField = (key: string, label?: string, value?: any) => {
  const str = (key + ' ' + (label || '')).toLowerCase();
  return (
    (str.startsWith('is') || str.startsWith('has') || str.includes('enabled')) &&
    (typeof value === 'boolean' || value === 0 || value === 1)
  );
};

const renderObjectField = (key: string, value: any, handleChange: (k: string, v: any) => void) => {
  if (Array.isArray(value)) {
    return (
      <div className="flex flex-col gap-4">
        <label className="text-base font-semibold text-stone-800 mb-1">{key}</label>
        <ul className="pl-4 list-disc space-y-2">
          {value.map((item, idx) => (
            <li key={idx}>{typeof item === 'object' ? renderObjectField(`${key}[${idx}]`, item, handleChange) : String(item)}</li>
          ))}
        </ul>
      </div>
    );
  }
  if (typeof value === 'object' && value !== null) {
    return (
      <div className="flex flex-col gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
        <label className="text-base font-semibold text-stone-800 mb-1">{key}</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(value).map(([k, v]) => (
            <div key={k} className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">{k}</span>
              <span className="text-base text-gray-700 bg-white rounded px-2 py-1 border border-slate-200">{String(v)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return <span className="text-gray-700">{String(value)}</span>;
};

interface Props {
  fields: Record<string, any>;
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  onCancel?: () => void;
  onSave?: (data: any) => void;
  title?: string;
  loading?: boolean;
  error?: string | null;
}

const DynamicForm: React.FC<Props> = ({ fields, title = '', endpoint="blogs", method = 'PUT', onCancel, onSave }) => {
  const [formData, setFormData] = useState(fields);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [objectUrls, setObjectUrls] = useState<Record<string, string[]>>({});

  const handleFieldChange =  (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (key: string, file: File) => {
    // For imageUrls field, we'll handle it specially in the submit
    // Just store the file reference for now
    const currentImages = formData[key];
    const newImages = Array.isArray(currentImages) 
      ? [...currentImages, file]
      : currentImages 
        ? [currentImages, file]
        : [file];
    handleFieldChange(key, newImages);
    
    // Create and store object URL for preview
    const objectUrl = URL.createObjectURL(file);
    setObjectUrls(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), objectUrl]
    }));
  };

  const handleRemoveImage = (key: string, index: number) => {
    const currentImages = formData[key];
    if (Array.isArray(currentImages)) {
      // Clean up object URL
      const currentUrls = objectUrls[key] || [];
      if (currentUrls[index]) {
        URL.revokeObjectURL(currentUrls[index]);
      }
      
      // Remove from both arrays
      const newImages = currentImages.filter((_, i) => i !== index);
      const newUrls = currentUrls.filter((_, i) => i !== index);
      
      handleFieldChange(key, newImages.length === 1 ? newImages[0] : newImages);
      setObjectUrls(prev => ({
        ...prev,
        [key]: newUrls
      }));
    } else {
      handleFieldChange(key, '');
      setObjectUrls(prev => ({
        ...prev,
        [key]: []
      }));
    }
  };

  useEffect(() => {
    setFormData(fields);
  }, [fields]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    console.log('=== FORM SUBMIT DEBUG ===');
    console.log('Endpoint:', endpoint);
    console.log('Method:', method);
    console.log('FormData keys:', Object.keys(formData));
    console.log('_id:', formData._id);
    console.log('id:', formData.id);
    console.log('Is edit mode:', method === 'PUT' || method === 'PATCH');
    
    try {
      // Create FormData for file uploads
      const formDataToSend = new FormData();
      
      // Add all form fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        // Include _id and id for edit operations, but skip other system fields
        if (['__v', 'createdAt', 'updatedAt', 'slug'].includes(key)) {
          return; // Skip these system fields
        }
        
        if (key === 'imageUrls' && Array.isArray(value)) {
          // Handle imageUrls specially - append each file or URL
          value.forEach((item) => {
            if (item instanceof File) {
              console.log('Adding file:', item.name);
              formDataToSend.append('imageUrls', item);
            } else if (typeof item === 'string') {
              console.log('Adding existing image URL:', item);
              formDataToSend.append('imageUrls', item);
            }
          });
        } else if (key === 'imageUrls' && typeof value === 'string') {
          // Handle single image URL
          console.log('Adding single image URL:', value);
          formDataToSend.append('imageUrls', value);
        } else if (Array.isArray(value)) {
          // Handle other arrays
          value.forEach((item) => {
            formDataToSend.append(key, item);
          });
        } else {  
          // Handle regular fields (including _id and id)
          console.log('Adding field:', key, value);
          formDataToSend.append(key, value);
        }
      });
      
      // Log FormData contents
      console.log('FormData contents:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }
      
      const apiId = (method === "PUT" || method === "PATCH") && (formData._id || formData.id) ? (formData._id || formData.id) : undefined;
      console.log('API ID for request:', apiId);
      console.log('Final API call params:', { endpoint, method, id: apiId });
      
      const res = await fetchAPI({ 
        endpoint: endpoint, 
        method, 
        data: formDataToSend,
        id: apiId
      });
      
      console.log('API success response:', res);
      console.log('Response data:', res.data);
      console.log('Response status:', res.status);
      
      // Check if the response actually contains updated data
      if (res.data) {
        console.log('✅ Update successful - new data received');
        onSave && onSave(res.data);
      } else {
        console.log('⚠️ No data in response - update may have failed');
        setError('Update completed but no data returned from server');
      }
    } catch (err: any) {
      console.error('=== API ERROR ===');
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      console.error('Endpoint:', endpoint);
      console.error('Method:', method);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative rounded-2xl shadow-2xl border border-slate-200 flex flex-col w-full">
      <div className="flex items-center justify-between px-8 pt-8 pb-3 sticky top-0 z-20 bg-white/95 rounded-t-2xl">
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">{title}</h2>
        <button type="button" className="ml-2 bg-white/90 rounded-full p-2 shadow hover:bg-red-100 transition" onClick={onCancel}>
          <FiX className="w-7 h-7 text-red-500" />
        </button>
      </div>
      <div className="max-h-[70vh] overflow-y-auto px-8 pb-8 flex flex-col gap-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
            <span className="block sm:inline mt-2">Endpoint: {endpoint}</span>
            <span className="block sm:inline">Method: {method}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(formData).map(([key, value]) => {
            const label = key.charAt(0).toUpperCase() + key.slice(1);
            
            // Skip system fields
            if (['_id', 'id', '__v', 'createdAt', 'updatedAt', 'slug'].includes(key)) {
              return null;
            }
            
            if (['inclusion', 'exclusion'].includes(key.toLowerCase())) {
              return (
                <div key={key} className="col-span-full">
                  <label className="text-xl font-semibold text-stone-800 mb-4">{label}</label>
                  <textarea
                    value={Array.isArray(value) ? value.join('\n') : value}
                    onChange={e => handleFieldChange(key, e.target.value.split('\n'))}
                    className="w-full p-8 border-2 border-slate-200 rounded-2xl min-h-[300px] focus:ring-4 focus:ring-blue-400/20 focus:border-blue-400 text-xl resize-y leading-relaxed shadow-sm hover:border-slate-300 transition-all duration-200"
                    placeholder={`Enter ${label.toLowerCase()}...`}
                  />
                </div>
              );
            }
            if (isImageField(key, label)) {
              const images = Array.isArray(value) ? value : value ? [value] : [];
              return (
                <div key={key} className="col-span-full">
                  <label className="text-xl font-semibold text-stone-800 mb-4">
                    {key.toLowerCase().includes('imageurls') ? 'Image URLs' : `${label} (Images)`}
                  </label>
                  
                  {/* Display existing images */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                      {images.map((image, index) => {
                        const imageUrl = image instanceof File 
                          ? (objectUrls[key]?.[index] || URL.createObjectURL(image))
                          : image;
                        
                        return (
                          <div key={index} className="relative group">
                            <img 
                              src={imageUrl} 
                              alt={`${label} ${index + 1}`} 
                              className="w-full h-32 object-cover rounded-lg border border-slate-200 shadow-sm"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('Delete button clicked for:', key, index);
                                handleRemoveImage(key, index);
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-100 hover:bg-red-600 z-20 cursor-pointer"
                              title="Remove image"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  
                  {/* Add new image button */}
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg border border-blue-200 cursor-pointer transition-colors duration-200">
                      <FiPlus className="w-4 h-4" />
                      <span>Add Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={e => {
                          if (e.target.files) {
                            Array.from(e.target.files).forEach(file => {
                              handleImageUpload(key, file);
                            });
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                    {images.length > 0 && (
                      <span className="text-sm text-gray-500">
                        {images.length} image{images.length !== 1 ? 's' : ''} uploaded
                      </span>
                    )}
                  </div>
                </div>
              );
            }
            if (isTextareaField(key, label)) {
              return (
                <div key={key} className="col-span-full">
                  <label className="text-xl font-semibold text-stone-800 mb-4">{label}</label>
                  <textarea
                    value={value || ''}
                    onChange={e => handleFieldChange(key, e.target.value)}
                    className="w-full p-8 border-2 border-slate-200 rounded-2xl min-h-[300px] focus:ring-4 focus:ring-blue-400/20 focus:border-blue-400 text-xl resize-y leading-relaxed shadow-sm hover:border-slate-300 transition-all duration-200"
                    placeholder={`Enter ${label.toLowerCase()}...`}
                  />
                </div>
              );
            }
            if (isCheckboxField(key, label, value)) {
              return (
                <div key={key} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={!!value}
                    onChange={e => handleFieldChange(key, e.target.checked)}
                  />
                  <label className="text-base font-medium text-stone-800">{label}</label>
                </div>
              );
            }
            if (typeof value === 'object') {
              return (
                <div key={key} className="col-span-full">
                  {renderObjectField(key, value, handleFieldChange)}
                </div>
              );
            }
            return (
              <div key={key}>
                <label className="text-xl font-semibold text-stone-800 mb-4">{label}</label>
                <input
                  type="text"
                  value={value || ''}
                  onChange={e => handleFieldChange(key, e.target.value)}
                  className="w-full p-6 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-400/20 focus:border-blue-400 text-xl min-h-[80px] shadow-sm hover:border-slate-300 transition-all duration-200"
                  placeholder={`Enter ${label.toLowerCase()}...`}
                />
              </div>
            );
          }).filter(field => field !== null)}
          <div className="col-span-full flex justify-end gap-4 mt-8">
            <button type="button" onClick={onCancel} className="bg-gray-200 px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-300 transition-colors">Cancel</button>
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-blue-700 transition-colors">
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DynamicForm;
