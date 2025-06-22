"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
// Lazy-load Button for performance
const Button = dynamic(() => import("@/components/atoms/button"), { ssr: false });
import { fetchAPI } from "@/utils/apiService";
import { FiEdit, FiTrash, FiPlus, FiX, FiAlertCircle, FiCamera } from "react-icons/fi";
import Alert from "@/components/atoms/alert";

// ===================== Helper Components =====================
interface Category {
  _id?: string;
  id?: string | number;
  slug?: string;
  name?: string;
  title?: string;
}

function CategorySelect({ value, onChange, endpoint, allowAdd = true, label = "Category" }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchAPI<{ data: Category[] }>({ endpoint })
      .then(res => setCategories(res.data || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, [endpoint]);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetchAPI<Category>({ endpoint, method: "POST", data: { name: newCategory } });
      setCategories(prev => [...prev, response]);
      setJustAddedId(String(response.slug || response._id || response.id));
      setNewCategory("");
    } catch (err) {
      setError("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (e) => {
    onChange(e.target.value);
    setJustAddedId(null);
  };

  return (
    <div className="flex flex-col gap-2">
      <select
        value={value || ""}
        onChange={handleSelect}
        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        disabled={loading}
      >
        <option value="">Select a {label.toLowerCase()}</option>
        {categories.map(cat => (
          <option key={cat.slug || cat._id || cat.id} value={cat.slug || cat._id || cat.id}>
            {cat.name || cat.title || cat.slug}
            {justAddedId === (cat.slug || cat._id || cat.id) ? " (new)" : ""}
          </option>
        ))}
      </select>
      {allowAdd && (
        <div className="flex gap-2 mt-1">
          <input
            type="text"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            placeholder={`Add new ${label.toLowerCase()}...`}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-xl"
            disabled={loading}
          />
          <button
            type="button"
            onClick={handleAddCategory}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
            disabled={loading || !newCategory.trim()}
          >
            Add
          </button>
        </div>
      )}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

// ===================== Main DynamicForm Component =====================
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
  // ========== State ==========
  const [formData, setFormData] = useState<T>(data);
  const [error, setError] = useState<string | string[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const lastResponse = useRef<T | null>(null);

  // ========== Handlers ==========
  const handleChange = (key: string, value: unknown) => {
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

  // ========== Field Renderer ==========
  const renderField = (key: string, value: unknown) => {
    // Description textarea
    if (key === 'description') {
      return (
        <textarea
          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all min-h-[120px]"
          value={formData[key] || ''}
          onChange={e => handleChange(key, e.target.value)}
          placeholder="Enter description..."
        />
      );
    }
    // Category select
    if (key === 'category' || key === 'categorySlug') {
      return (
        <CategorySelect
          value={formData[key]}
          onChange={val => handleChange(key, val)}
          endpoint="category/activities"
          allowAdd={true}
          label={getFieldLabel(key)}
        />
      );  
    }
    // Image fields
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
                    {/* Replace icon on hover */}
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = async (e) => {
                          const files = (e.target as HTMLInputElement).files;
                          if (files && files.length > 0) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              const newImages = [...images];
                              newImages[index] = reader.result as string;
                              handleChange(key, newImages);
                            };
                            reader.readAsDataURL(files[0]);
                          }
                        };
                        input.click();
                      }}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl z-10"
                      title="Replace Image"
                    >
                      <FiCamera className="w-8 h-8 text-white" />
                    </button>
                    {/* Delete icon */}
                    <button
                      type="button"
                      onClick={() => {
                        const newImages = images.filter((_, i) => i !== index);
                        handleChange(key, newImages);
                      }}
                      className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-red-100 transition-all duration-200 z-20"
                      title="Delete Image"
                    >
                      <FiTrash className="w-5 h-5 text-red-600" />
                    </button>
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
    // Boolean fields
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
    // Array fields
    if (Array.isArray(value)) {
      return (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {formData[key].map((item: unknown, index: number) => (
              <div 
                key={index} 
                className="flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100"
              >
                <span className="text-sm text-blue-700">{String(item)}</span>
                <button
                  type="button"
                  onClick={() => {
                    const newArray = formData[key].filter((_: unknown, i: number) => i !== index);
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
    // Number fields
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
    // Default: text input
    return (
      <input
        type="text"
        value={formData[key]}
        onChange={(e) => handleChange(key, e.target.value)}
        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
      />
    );
  };

  // ========== Submit Handler ==========
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
      lastResponse.current = response as T;
      setSuccess("Saved successfully!");
      // Do NOT call onSave here
    } catch (err: any) {
      if (err && err.response && err.response.data && err.response.data.errors) {
        setError(err.response.data.errors);
      } else if (err && err.message) {
        setError(err.message);
      } else {
        setError("An error occurred. Please check your input and try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========== Render ==========
  return (
    <div className="fixed inset-0 z-50 w-screen h-screen bg-white flex flex-col">
      {/* Error Alert */}
      <Alert
        show={!!error}
        type="error"
        message={Array.isArray(error) ? error.join("\n") : error || ""}
        onConfirm={() => setError(null)}
        onCancel={() => setError(null)}
      />
      {/* Success Alert */}
      <Alert
        show={!!success}
        type="success"
        message={success || ""}
        onConfirm={() => {
          setSuccess(null);
          if (lastResponse.current) {
            onSave(lastResponse.current);
            lastResponse.current = null;
          }
        }}
      />
      {/* Header */}
      <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100 bg-white/90 backdrop-blur-sm">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 tracking-tight">
            {formData._id ? "Edit Item" : "Add New Item"}
          </h2>
          <p className="text-gray-500 mt-2 text-lg">
            {formData._id ? "Update the details below" : "Fill in the details below"}
          </p>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600 transition-all duration-200 p-2 hover:bg-gray-100 rounded-xl"
        >
          <FiX className="w-6 h-6" />
        </button>
      </div>
      {/* Form Content */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-6 w-full">
        <div className="space-y-10 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
            {Object.entries(formData).map(([key, value]) => {
              if (shouldSkipField(key)) return null;
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
              <div>
                {Array.isArray(error) ? (
                  <ul className="list-disc pl-5">
                    {error.map((errMsg, idx) => (
                      <li key={idx}>{errMsg}</li>
                    ))}
                  </ul>
                ) : (
                  <span>{error}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </form>
      {/* Sticky Footer Actions */}
      <div className="flex justify-end gap-4 px-8 py-6 border-t border-gray-100 bg-white/90 backdrop-blur-sm">
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
  );
}
// ===================== End of File =====================