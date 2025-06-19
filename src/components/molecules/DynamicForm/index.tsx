"use client";

import { useState } from "react";
import Button from "@/components/atoms/button";
import { fetchAPI } from "@/utils/apiService";
import { FiEdit, FiTrash, FiPlus, FiX, FiAlertCircle } from "react-icons/fi";

interface Props<T> {
  data: T;
  endpoint: string;
  onCancel: () => void;
  onSave: (savedData: T) => void;
  title?: string;
  isSaving?: boolean;
  columns?: { label: string; accessor: keyof T }[];
  method?: "POST" | "PUT" | "PATCH";
}

export default function DynamicForm<T extends { _id?: string }>({
  data,
  endpoint,
  onCancel,
  onSave,
  title = "Form",
  isSaving = false,
  columns = [],
  method = "POST"
}: Props<T>) {
  const [formData, setFormData] = useState<T>(data);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getFieldLabel = (key: string) => {
    const column = columns.find(col => col.accessor === key);
    return column?.label || key.charAt(0).toUpperCase() + key.slice(1);
  };

  const shouldSkipField = (key: string) => {
    // Skip all system and internal fields
    return [
      '_id',
      '__v',
      'slug',
      'createdAt',
      'updatedAt',
      'id',
      'created_at',
      'updated_at',
      'created_by',
      'updated_by'
    ].includes(key);
  };

  const renderField = (key: string, value: any) => {
    // Handle image fields
    if (key.toLowerCase().includes('image') || key.toLowerCase().includes('photo')) {
      const images = Array.isArray(value) ? value : [value];
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image, index) => (
              <div key={index} className="group relative aspect-square">
                {image ? (
                  <>
                    <img 
                      src={image} 
                      alt={`${key} ${index + 1}`} 
                      className="w-full h-full object-cover rounded-2xl border border-gray-200 shadow-sm"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-2xl flex items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.accept = 'image/*';
                          input.multiple = true;
                          input.onchange = async (e) => {
                            const files = (e.target as HTMLInputElement).files;
                            if (files && files.length > 0) {
                              const newImages = [...images];
                              for (const file of Array.from(files)) {
                                const reader = new FileReader();
                                const result = await new Promise<string>((resolve) => {
                                  reader.onloadend = () => resolve(reader.result as string);
                                  reader.readAsDataURL(file);
                                });
                                newImages.push(result);
                              }
                              handleChange(key, newImages);
                            }
                          };
                          input.click();
                        }}
                        className="p-3 bg-white/90 rounded-xl hover:bg-blue-100 transition-all duration-200 transform hover:scale-110"
                        title="Add More Images"
                      >
                        <FiPlus className="w-5 h-5 text-blue-600" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = images.filter((_, i) => i !== index);
                          handleChange(key, newImages);
                        }}
                        className="p-3 bg-white/90 rounded-xl hover:bg-red-100 transition-all duration-200 transform hover:scale-110"
                        title="Delete Image"
                      >
                        <FiTrash className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div 
                    className="w-full h-full border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-all duration-200 bg-gray-50 group"
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.multiple = true;
                      input.onchange = async (e) => {
                        const files = (e.target as HTMLInputElement).files;
                        if (files && files.length > 0) {
                          const newImages = [...images];
                          for (const file of Array.from(files)) {
                            const reader = new FileReader();
                            const result = await new Promise<string>((resolve) => {
                              reader.onloadend = () => resolve(reader.result as string);
                              reader.readAsDataURL(file);
                            });
                            newImages.push(result);
                          }
                          handleChange(key, newImages);
                        }
                      };
                      input.click();
                    }}
                  >
                    <div className="p-4 bg-white rounded-full shadow-sm group-hover:shadow-md transition-all duration-200">
                      <FiPlus className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <span className="mt-2 text-sm text-gray-500 group-hover:text-blue-500 transition-colors">
                      Add Images
                    </span>
                  </div>
                )}
              </div>
            ))}
            {/* Always show an "Add Image" slot at the end */}
            <div 
              className="w-full h-full border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-all duration-200 bg-gray-50 group"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.multiple = true;
                input.onchange = async (e) => {
                  const files = (e.target as HTMLInputElement).files;
                  if (files && files.length > 0) {
                    const newImages = [...images];
                    for (const file of Array.from(files)) {
                      const reader = new FileReader();
                      const result = await new Promise<string>((resolve) => {
                        reader.onloadend = () => resolve(reader.result as string);
                        reader.readAsDataURL(file);
                      });
                      newImages.push(result);
                    }
                    handleChange(key, newImages);
                  }
                };
                input.click();
              }}
            >
              <div className="p-4 bg-white rounded-full shadow-sm group-hover:shadow-md transition-all duration-200">
                <FiPlus className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <span className="mt-2 text-sm text-gray-500 group-hover:text-blue-500 transition-colors">
                Add Images
              </span>
            </div>
          </div>
        </div>
      );
    }

    if (typeof value === "boolean") {
      return (
        <div className="flex items-center gap-3">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData[key]}
              onChange={(e) => handleChange(key, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
          <span className="text-sm text-gray-600">Toggle {getFieldLabel(key)}</span>
        </div>
      );
    }

    if (Array.isArray(value)) {
      return (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {formData[key].map((item: any, index: number) => (
              <div 
                key={index} 
                className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100"
              >
                <span className="text-sm text-blue-700">{item}</span>
                <button
                  type="button"
                  onClick={() => {
                    const newArray = formData[key].filter((_: any, i: number) => i !== index);
                    handleChange(key, newArray);
                  }}
                  className="text-blue-400 hover:text-red-500 transition-colors"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={`Add ${getFieldLabel(key).toLowerCase()}...`}
              className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const input = e.target as HTMLInputElement;
                  const value = input.value.trim();
                  if (value) {
                    handleChange(key, [...formData[key], value]);
                    input.value = '';
                  }
                }
              }}
            />
            <button
              type="button"
              onClick={(e) => {
                const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                const value = input.value.trim();
                if (value) {
                  handleChange(key, [...formData[key], value]);
                  input.value = '';
                }
              }}
              className="px-5 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium"
            >
              Add
            </button>
          </div>
        </div>
      );
    }

    if (typeof value === "number") {
      return (
        <input
          type="number"
          value={formData[key]}
          onChange={(e) => handleChange(key, Number(e.target.value))}
          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      );
    }

    return (
      <input
        type="text"
        value={formData[key]}
        onChange={(e) => handleChange(key, e.target.value)}
        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
      />
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const url = data._id ? `${endpoint}/${data._id}` : endpoint;
      const response = await fetchAPI({
        endpoint: url,
        method: data._id ? "PUT" : "POST",
        data: formData
      });

      if (!response.ok) {
        throw new Error("Failed to save changes");
      }

      const savedData = await response.json();
      onSave(savedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-50 to-white">
      <div className="w-full h-full flex flex-col">
        <div className="flex justify-between items-center p-8 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
              {data._id ? "Edit Item" : "Add New Item"}
            </h2>
            <p className="text-gray-500 mt-2 text-lg">
              {data._id ? "Update the details below" : "Fill in the details below"}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-all duration-200 p-2 hover:bg-gray-100 rounded-xl"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {Object.entries(data).map(([key, value]) => {
                // Skip unnecessary fields
                if (shouldSkipField(key)) return null;

                // Full width for certain fields
                const isFullWidth = 
                  key.toLowerCase().includes('image') || 
                  key.toLowerCase().includes('photo') || 
                  key.toLowerCase().includes('description') ||
                  Array.isArray(value);

                return (
                  <div 
                    key={key} 
                    className={`flex flex-col gap-3 ${isFullWidth ? 'md:col-span-2' : ''}`}
                  >
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      {getFieldLabel(key)}
                    </label>
                    {renderField(key, value)}
                  </div>
                );
              })}
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center gap-2">
                <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </form>

        <div className="flex justify-end gap-4 p-8 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
          <Button
            text="Cancel"
            variant="secondary"
            onClick={onCancel}
            className="px-6 py-2.5"
          />
          <Button
            text={isSubmitting ? "Saving..." : "Save"}
            variant="primary"
            onClick={handleSubmit}
            className={`px-6 py-2.5 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          />
        </div>
      </div>
    </div>
  );
}