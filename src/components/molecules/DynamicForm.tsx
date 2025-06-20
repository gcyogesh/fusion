  'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import Alert from '../atoms/alert';
import { fetchAPI } from '@/utils/apiService';
import Button from '../atoms/button';

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
      <div className="flex flex-col gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm">
        <label className="text-base font-semibold text-stone-800 mb-1">{key}</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(value).map(([k, v]) => (
            <div key={k} className="flex flex-col gap-1">
              <span className="text-xs text-gray-500">{k}</span>
              <span className="text-base text-gray-700 bg-white rounded px-3 py-2 border border-slate-200">{String(v)}</span>
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

const DynamicForm: React.FC<Props> = ({ fields, title = '', endpoint = "blogs", method = 'PUT', onCancel, onSave }) => {
  const [formData, setFormData] = useState(fields);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [objectUrls, setObjectUrls] = useState<Record<string, string[]>>({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<'confirm' | 'success' | 'error' | 'warning'>('confirm');
  const [alertMessage, setAlertMessage] = useState('');
  const [submitConfirmed, setSubmitConfirmed] = useState(false);

  const handleConfirmSubmit = () => {
    setShowAlert(true);
    setAlertType('confirm');
    setAlertMessage('Are you sure you want to save the changes?');
  };

  const handleAlertConfirm = () => {
    setShowAlert(false);
    setSubmitConfirmed(true);
  };

  const handleAlertCancel = () => {
    setShowAlert(false);
    setSubmitConfirmed(false);
  };

  const handleFieldChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleImageUpload = (key: string, file: File) => {
    const currentImages = formData[key];
    const newImages = Array.isArray(currentImages)
      ? [...currentImages, file]
      : currentImages
        ? [currentImages, file]
        : [file];
    handleFieldChange(key, newImages);

    const objectUrl = URL.createObjectURL(file);
    setObjectUrls(prev => ({
      ...prev,
      [key]: [...(prev[key] || []), objectUrl]
    }));
  };

  const handleRemoveImage = (key: string, index: number) => {
    const currentImages = formData[key];
    if (Array.isArray(currentImages)) {
      const currentUrls = objectUrls[key] || [];
      if (currentUrls[index]) URL.revokeObjectURL(currentUrls[index]);
      const newImages = currentImages.filter((_, i) => i !== index);
      const newUrls = currentUrls.filter((_, i) => i !== index);
      handleFieldChange(key, newImages.length === 1 ? newImages[0] : newImages);
      setObjectUrls(prev => ({ ...prev, [key]: newUrls }));
    } else {
      handleFieldChange(key, '');
      setObjectUrls(prev => ({ ...prev, [key]: [] }));
    }
  };

  useEffect(() => {
    setFormData(fields);
  }, [fields]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitConfirmed) return handleConfirmSubmit();
    setSubmitConfirmed(false);
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (["__v", "createdAt", "updatedAt", "slug"].includes(key)) return;

        if (key === 'imageUrls' && Array.isArray(value)) {
          value.forEach(item => {
            if (item instanceof File) {
              formDataToSend.append('imageUrls', item);
            } else if (typeof item === 'string') {
              formDataToSend.append('imageUrls', item);
            }
          });
        } else if (key === 'imageUrls' && typeof value === 'string') {
          formDataToSend.append('imageUrls', value);
        } else if (Array.isArray(value)) {
          value.forEach(item => {
            formDataToSend.append(key, item);
          });
        } else {
          formDataToSend.append(key, value);
        }
      });

      const apiId = (method === "PUT" || method === "PATCH") && (formData._id || formData.id) ? (formData._id || formData.id) : undefined;

      const res = await fetchAPI({
        endpoint: endpoint,
        method,
        data: formDataToSend,
        id: apiId
      });

      if (res.data) {
        onSave && onSave(res.data);
        setAlertType('success');
        setAlertMessage('Saved successfully!');
        setShowAlert(true);
      } else {
        setAlertType('warning');
        setAlertMessage('Update completed but no data returned from server');
        setShowAlert(true);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setAlertType('error');
      setAlertMessage(err.message || 'An error occurred');
      setShowAlert(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (submitConfirmed) {
      handleSubmit(new Event('submit') as any);
      setSubmitConfirmed(false);
    }
  }, [submitConfirmed]);

  return (
    <div className="relative rounded-3xl shadow-2xl border border-slate-100 bg-white flex flex-col w-full">
      <Alert
        show={showAlert}
        type={alertType}
        message={alertMessage}
        onConfirm={handleAlertConfirm}
        onCancel={handleAlertCancel}
      />
      <div className="flex items-center justify-between px-10 pt-8 pb-4 sticky top-0 z-20 bg-white/95 rounded-t-3xl border-b border-slate-100">
        <h2 className="text-4xl font-bold text-gray-900 tracking-tight">{title}</h2>
        <button type="button" className="ml-2 bg-white rounded-full p-2 shadow hover:bg-red-100 transition" onClick={onCancel}>
          <FiX className="w-7 h-7 text-red-500" />
        </button>
      </div>
      <div className="max-h-[70vh] overflow-y-auto px-10 pb-10 flex flex-col gap-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {Object.entries(formData).map(([key, value]) => {
            const label = key.charAt(0).toUpperCase() + key.slice(1);

            if (['_id', 'id', '__v', 'createdAt', 'updatedAt', 'slug'].includes(key)) return null;

            if (key.toLowerCase() === "itinerary" && Array.isArray(value)) {
              return (
                <div key={key} className="col-span-full">
                  <label className="text-xl font-semibold text-stone-800 mb-4">{label}</label>
                  <div className="flex flex-col gap-2">
                    {value.map((item, idx) => (
                      <div key={idx} className="flex flex-col gap-1 border p-3 rounded-xl mb-2 bg-gray-50">
                        <div className="flex items-center gap-4 mb-2">
                          {item.image ? (
                            <img
                              src={typeof item.image === 'string' ? item.image : URL.createObjectURL(item.image)}
                              alt={item.title || 'Itinerary Image'}
                              className="w-24 h-24 object-cover rounded-xl border"
                            />
                          ) : (
                            <div className="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-xl border text-gray-400">
                              No Image
                            </div>
                          )}
                          <div className="flex-1">
                            <input
                              type="text"
                              placeholder="Title"
                              className="w-full px-2 py-1 border rounded mb-2"
                              value={item.title || ''}
                              onChange={e => {
                                const newArr = [...value];
                                newArr[idx] = { ...item, title: e.target.value };
                                handleFieldChange(key, newArr);
                              }}
                            />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const newArr = [...value];
                                  newArr[idx] = { ...item, image: file };
                                  handleFieldChange(key, newArr);
                                }
                              }}
                              className="mt-1"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const newArr = value.filter((_, i) => i !== idx);
                              handleFieldChange(key, newArr);
                            }}
                            className="text-red-500 hover:text-red-700 ml-2"
                            title="Remove"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                        <textarea
                          placeholder="Description"
                          className="px-2 py-1 border rounded mb-2"
                          value={item.description || ''}
                          onChange={e => {
                            const newArr = [...value];
                            newArr[idx] = { ...item, description: e.target.value };
                            handleFieldChange(key, newArr);
                          }}
                        />
                        <div className="mt-2">
                          <label className="font-semibold">Activities</label>
                          {(Array.isArray(item.activities) ? item.activities : []).map((act, actIdx) => (
                            <div key={actIdx} className="flex items-center gap-2 mt-1">
                              <span className="flex-1">{act}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newArr = [...value];
                                  newArr[idx] = {
                                    ...item,
                                    activities: item.activities.filter((_, i) => i !== actIdx)
                                  };
                                  handleFieldChange(key, newArr);
                                }}
                                className="text-red-500 hover:text-red-700"
                                title="Remove"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          ))}
                          <div className="flex gap-2 mt-2">
                            <input
                              type="text"
                              placeholder="Add activity..."
                              className="flex-1 px-2 py-1 border rounded"
                              value={item._activityInput || ''}
                              onChange={e => {
                                const newArr = [...value];
                                newArr[idx] = { ...item, _activityInput: e.target.value };
                                handleFieldChange(key, newArr);
                              }}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const inputValue = item._activityInput?.trim();
                                  if (inputValue) {
                                    const newArr = [...value];
                                    newArr[idx] = {
                                      ...item,
                                      activities: [...(item.activities || []), inputValue],
                                      _activityInput: ''
                                    };
                                    handleFieldChange(key, newArr);
                                  }
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const inputValue = item._activityInput?.trim();
                                if (inputValue) {
                                  const newArr = [...value];
                                  newArr[idx] = {
                                    ...item,
                                    activities: [...(item.activities || []), inputValue],
                                    _activityInput: ''
                                  };
                                  handleFieldChange(key, newArr);
                                }
                              }}
                              className="p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                              title="Add"
                            >
                              <FiPlus />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const newArr = [
                          ...value,
                          { day: value.length + 1, title: '', description: '', activities: [] }
                        ];
                        handleFieldChange(key, newArr);
                      }}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 self-start"
                    >
                      <FiPlus className="inline mr-1" /> Add Itinerary
                    </button>
                  </div>
                </div>
              );
            }
            if (["inclusion", "inclusions", "exclusion", "exclusions"].includes(key.toLowerCase())) {
              return (
                <div key={key} className="col-span-full">
                  <label className="text-xl font-semibold text-stone-800 mb-4">{label}</label>
                  <div className="flex flex-col gap-2">
                    {(Array.isArray(value) ? value : []).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="flex-1">{item}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const newArr = value.filter((_, i) => i !== idx);
                            handleFieldChange(key, newArr);
                          }}
                          className="text-red-500 hover:text-red-700"
                          title="Remove"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        placeholder={`Add ${label.toLowerCase()}...`}
                        className="flex-1 px-4 py-2 border rounded-xl"
                        value={formData[`_${key}_input`] || ''}
                        onChange={e => handleFieldChange(`_${key}_input`, e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const inputValue = e.currentTarget.value.trim();
                            if (inputValue) {
                              handleFieldChange(key, [...(value || []), inputValue]);
                              handleFieldChange(`_${key}_input`, '');
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const inputValue = formData[`_${key}_input`] || '';
                          if (inputValue.trim()) {
                            handleFieldChange(key, [...(value || []), inputValue.trim()]);
                            handleFieldChange(`_${key}_input`, '');
                          }
                        }}
                        className="p-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                        title="Add"
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
            if (isImageField(key, label)) {
              const images = Array.isArray(value) ? value : value ? [value] : [];
              return (
                <div key={key} className="col-span-full">
                  <label className="text-xl font-semibold text-stone-800 mb-4 block">
                    {key.toLowerCase().includes('imageurls') ? 'Image URLs' : `${label} (Images)`}
                  </label>

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                      {images.map((image, index) => {
                        const imageUrl = image instanceof File ? (objectUrls[key]?.[index] || URL.createObjectURL(image)) : image;
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
                                handleRemoveImage(key, index);
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 z-20"
                              title="Remove image"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

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
                            Array.from(e.target.files).forEach(file => handleImageUpload(key, file));
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
                    className="w-full p-6 border-2 border-slate-200 rounded-2xl min-h-[250px] focus:ring-4 focus:ring-blue-400/20 focus:border-blue-400 text-lg resize-y shadow hover:border-slate-300 transition-all duration-200"
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
                <label className="text-xl font-semibold text-stone-800 mb-2 block">{label}</label>
                <input
                  type="text"
                  value={value || ''}
                  onChange={e => handleFieldChange(key, e.target.value)}
                  className="w-full p-5 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-400/20 focus:border-blue-400 text-lg min-h-[60px] shadow-sm hover:border-slate-300 transition-all duration-200"
                  placeholder={`Enter ${label.toLowerCase()}...`}
                />
              </div>
            );
          }).filter(field => field !== null)}
          <div className="col-span-full flex justify-end gap-4 mt-8">
<Button onClick={onCancel} text={'Cancel'} variant='secondary' />

           
<Button  text={loading ? 'Saving...' : 'Save'} variant='primary' onClick={handleConfirmSubmit} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default DynamicForm;
