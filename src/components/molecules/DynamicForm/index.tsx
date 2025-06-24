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

interface Destination {
  _id: string;
  title: string;
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

  // Helper to get label for current value
  const getCurrentCategoryLabel = (val: any) => {
    if (val && typeof val === 'object') {
      return val.name || val.title || val.slug || val._id || 'Current';
    }
    return val;
  };

  // Helper to get value for current value
  const getCurrentCategoryValue = (val: any) => {
    if (val && typeof val === 'object') {
      return val._id || val.id || val.slug || val.name || val.title;
    }
    return val;
  };

  // Ensure current value is always present in the dropdown
  const allCategories = (() => {
    if (!value) return categories;
    const valueId = getCurrentCategoryValue(value);
    const exists = categories.some(cat => String(cat._id || cat.id || cat.slug) === String(valueId));
    if (!exists) {
      // Add a temporary option for the current value
      return [
        { _id: valueId, name: `Current: ${getCurrentCategoryLabel(value)}` },
        ...categories,
      ];
    }
    return categories;
  })();

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
        value={getCurrentCategoryValue(value) || ""}
        onChange={handleSelect}
        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        disabled={loading}
      >
        <option value="">Select a {label.toLowerCase()}</option>
        {allCategories.map(cat => (
          <option key={cat._id || cat.id || cat.slug} value={cat._id || cat.id || cat.slug}>
            {cat.name || cat.title || cat.slug}
            {justAddedId === (cat._id || cat.id || cat.slug) ? " (new)" : ""}
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

function DestinationSelect({ value, onChange }) {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchAPI<{ data: Destination[] }>({ endpoint: 'destinations' })
      .then(res => setDestinations(res.data || []))
      .catch(() => setDestinations([]))
      .finally(() => setLoading(false));
  }, []);

  // Helper to get label for current value
  const getCurrentDestinationLabel = (val: any) => {
    if (val && typeof val === 'object') {
      return val.title || val.name || val._id || 'Current';
    }
    return val;
  };

  // Helper to get value for current value
  const getCurrentDestinationValue = (val: any) => {
    if (val && typeof val === 'object') {
      return val._id || val.id || val.title || val.name;
    }
    return val;
  };

  // Ensure current value is always present in the dropdown
  const allDestinations = (() => {
    if (!value) return destinations;
    const valueId = getCurrentDestinationValue(value);
    const exists = destinations.some(dest => String(dest._id) === String(valueId));
    if (!exists) {
      return [
        { _id: valueId, title: `Current: ${getCurrentDestinationLabel(value)}` },
        ...destinations,
      ];
    }
    return destinations;
  })();

  return (
    <div className="flex flex-col gap-2">
      <select
        value={getCurrentDestinationValue(value) || ''}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        disabled={loading}
      >
        <option value="">Select a destination</option>
        {allDestinations.map(dest => (
          <option key={dest._id} value={dest._id}>{dest.title}</option>
        ))}
      </select>
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
  templates?: Record<string, any>;
}

// Add this utility function at the top (outside the component)
function deepReset(obj: any): any {
  if (Array.isArray(obj)) return [];
  if (obj && typeof obj === 'object') {
    const result: any = {};
    for (const k in obj) {
      if (Array.isArray(obj[k])) {
        result[k] = [];
      } else if (obj[k] && typeof obj[k] === 'object') {
        result[k] = deepReset(obj[k]);
      } else {
        result[k] = '';
      }
    }
    return result;
  }
  return '';
}

export default function DynamicForm<T extends { _id?: string }>({
  data,
  endpoint,
  onCancel,
  onSave,
  title = "Form",
  isSaving = false,
  columns = [],
  method = "POST",
  templates = {},
}: Props<T>) {
  // ========== State ==========
  const [formData, setFormData] = useState<T>(data);
  const [error, setError] = useState<string | string[] | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const lastResponse = useRef<T | null>(null);
  const [customKeys, setCustomKeys] = useState<string[]>([]);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [keyInputValue, setKeyInputValue] = useState('');

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
    // Destination select
    if (key === 'destination' || key === 'destinationId') {
      return (
        <DestinationSelect
          value={typeof formData[key] === 'string' ? formData[key] : (formData[key]?._id || '')}
          onChange={val => handleChange(key, typeof val === 'string' ? val : (val?._id || ''))}
        />
      );
    }
    // Category select
    if (key === 'category' || key === 'categorySlug') {
      // Compute the category endpoint dynamically
      let categoryEndpoint = 'category/activities'; // default fallback
      if (endpoint.includes('blog')) categoryEndpoint = 'category/blogs';
      else if (endpoint.includes('destination')) categoryEndpoint = 'category/destinations';
      else if (endpoint.includes('activity')) categoryEndpoint = 'category/activities';
      // Add more as needed

      return (
        <CategorySelect
          value={formData[key]}
          onChange={val => handleChange(key, val)}
          endpoint={categoryEndpoint}
          allowAdd={true}
          label={getFieldLabel(key)}
        />
      );  
    }
    // Image fields
    if (key.toLowerCase().includes('image') || key.toLowerCase().includes('photo') || key.toLowerCase().includes('gallery')) {
      // Always treat as array for preview
      let files: (File | string)[] = [];
      if (Array.isArray(formData[key])) {
        files = formData[key];
      } else if (formData[key]) {
        files = [formData[key]];
      }
      return (
        <div className="space-y-6">
          {/* Helper text for clarity */}
          <div className="text-xs text-gray-500 mb-1">
            {key.toLowerCase().includes('gallery')
              ? 'You can add multiple images. Select more files to add.'
              : 'You can add another image after uploading one.'}
          </div>
          {/* Visible file input */}
          <input
            type="file"
            accept="image/*"
            multiple={key.toLowerCase().includes('gallery')}
            onChange={e => {
              const filesInput = (e.target as HTMLInputElement).files;
              if (filesInput && filesInput.length > 0) {
                if (key.toLowerCase().includes('gallery')) {
                  handleChange(key, [...files, ...Array.from(filesInput)]);
                } else {
                  handleChange(key, [filesInput[0]]);
                }
              }
            }}
            className="block mb-2"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {files.map((file, index) => (
              <div key={index} className="group relative aspect-square">
                {file ? (
                  <>
                    <img
                      src={file instanceof File ? URL.createObjectURL(file) : file}
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
                        input.onchange = (e) => {
                          const filesInput = (e.target as HTMLInputElement).files;
                          if (filesInput && filesInput.length > 0) {
                            const newFiles = [...files];
                            newFiles[index] = filesInput[0];
                            handleChange(key, newFiles);
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
                        const newFiles = files.filter((_, i) => i !== index);
                        handleChange(key, newFiles);
                      }}
                      className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-red-100 transition-all duration-200 z-20"
                      title="Delete Image"
                    >
                      <FiTrash className="w-5 h-5 text-red-600" />
                    </button>
                  </>
                ) : null}
              </div>
            ))}
          </div>
          {/* Add another image icon button for single-image fields */}
          {!key.toLowerCase().includes('gallery') && (
            <button
              type="button"
              className="mt-2 flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-md"
              title="Add another image"
              aria-label="Add another image"
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                  const filesInput = (e.target as HTMLInputElement).files;
                  if (filesInput && filesInput.length > 0) {
                    handleChange(key, [...files, filesInput[0]]);
                  }
                };
                input.click();
              }}
            >
              <FiPlus className="w-6 h-6" />
            </button>
          )}
        </div>
      );
    }
    // Custom object fields: for any object, including nested objects (like itinerary)
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const obj = formData[key] || {};
      return (
        <div className="space-y-2">
          {Object.entries(obj).map(([k, v], idx) => (
            <div key={k + idx} className="flex gap-2 items-center">
              <input
                type="text"
                value={k}
                readOnly
                className="w-1/3 px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-gray-500"
              />
              <input
                type="text"
                value={typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean' ? String(v) : JSON.stringify(v)}
                onChange={e => {
                  let newValue: any = e.target.value;
                  // Try to parse JSON if original value was object/array
                  if (typeof v === 'object' && v !== null) {
                    try {
                      newValue = JSON.parse(e.target.value);
                    } catch {
                      newValue = e.target.value;
                    }
                  } else if (typeof v === 'number') {
                    newValue = Number(e.target.value);
                  } else if (typeof v === 'boolean') {
                    newValue = e.target.value === 'true';
                  }
                  const updated = { ...obj, [k]: newValue };
                  handleChange(key, updated);
                }}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl"
              />
            </div>
          ))}
        </div>
      );
    }
    // Array fields
    if (Array.isArray(value)) {
      // Handle array of strings (e.g., quickfacts)
      if (value.length === 0 || value.every(v => typeof v === 'string')) {
        return (
          <div className="space-y-2">
            {value.map((item, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  value={String(item)}
                  onChange={e => {
                    const updated = [...value];
                    updated[idx] = e.target.value;
                    handleChange(key, updated);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-xl"
                />
                <button
                  type="button"
                  className="px-3 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
                  onClick={() => {
                    const updated = value.filter((_, i) => i !== idx);
                    handleChange(key, updated);
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
              onClick={() => handleChange(key, [...value, ''])}
            >
              Add
            </button>
          </div>
        );
      }
      if (value.length > 0 && typeof value[0] === 'object') {
        const templateObj = value[0];
        return (
          <div className="space-y-4">
            {value.map((item, idx) => (
              <div key={idx} className="p-4 border rounded-xl mb-2 bg-gray-50">
                {Object.keys(templateObj).map(k => (
                  <div key={k} className="flex gap-2 items-center mb-2">
                    <input
                      type="text"
                      value={k}
                      readOnly
                      className="w-1/3 px-3 py-2 border border-gray-200 rounded-xl bg-gray-100 text-gray-500"
                    />
                    {(k.toLowerCase() === 'image' || k.toLowerCase().includes('image')) ? (
                      <div className="flex flex-col gap-2 w-full">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => {
                            const filesInput = (e.target as HTMLInputElement).files;
                            if (filesInput && filesInput.length > 0) {
                              const updatedArray = [...value];
                              updatedArray[idx] = { ...item, [k]: filesInput[0] };
                              handleChange(key, updatedArray);
                            }
                          }}
                        />
                        {item[k] && (
                          <img
                            src={item[k] instanceof File ? URL.createObjectURL(item[k]) : String(item[k])}
                            alt={k}
                            className="w-24 h-24 object-cover rounded border"
                          />
                        )}
                      </div>
                    ) : (
                      <input
                        type="text"
                        value={typeof item[k] === 'string' || typeof item[k] === 'number' || typeof item[k] === 'boolean'
                          ? String(item[k])
                          : JSON.stringify(item[k])}
                        onChange={e => {
                          let newValue = e.target.value;
                          if (typeof item[k] === 'object' && item[k] !== null) {
                            try { newValue = JSON.parse(e.target.value); } catch { newValue = e.target.value; }
                          } else if (typeof item[k] === 'number') {
                            newValue = Number(e.target.value);
                          } else if (typeof item[k] === 'boolean') {
                            newValue = e.target.value === 'true';
                          }
                          const updatedArray = [...value];
                          updatedArray[idx] = { ...item, [k]: newValue };
                          handleChange(key, updatedArray);
                        }}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-xl"
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
              onClick={() => {
                const newObj = {};
                Object.keys(templateObj).forEach(k => {
                  newObj[k] = '';
                });
                const updatedArray = [...value, newObj];
                handleChange(key, updatedArray);
              }}
            >
              Add New Object
            </button>
          </div>
        );
      }
      // If array is empty, render Add New button that adds an empty string
      if (value.length === 0) {
        return (
          <div className="space-y-2">
            <button
              type="button"
              className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
              onClick={() => {
                handleChange(key, ['']);
              }}
            >
              Add
            </button>
          </div>
        );
      }
    }
    // Boolean fields
    if (typeof value === "boolean") {
      return (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!formData[key]}
            onChange={e => handleChange(key, e.target.checked)}
            className="w-5 h-5 accent-blue-500"
            id={`checkbox-${key}`}
          />
          <label htmlFor={`checkbox-${key}`} className="text-sm text-gray-700 select-none">On/Off</label>
        </div>
      );
    }
    // Number fields
    if (typeof value === "number") {
      return (
        <input
          type="number"
          value={typeof formData[key] === 'number' ? formData[key] : 0}
          onChange={(e) => handleChange(key, Number(e.target.value))}
          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
        />
      );
    }
    // For all other objects, show as read-only JSON
    if (typeof value === 'object' && value !== null) {
      return (
        <textarea
          value={formData[key] ? JSON.stringify(formData[key] as any, null, 2) : ''}
          readOnly
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-mono text-gray-500"
        />
      );
    }
    // If array is empty, render nothing (or just Add New if you want to allow adding)
    if (Array.isArray(value) && value.length === 0) {
      return null;
    }
    return (
      <input
        type="text"
        value={typeof formData[key] === 'string' ? formData[key] as string : ''}
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
      // Debug log for formData
      console.log('Submitting formData:', formData);
      // Validate category field
      if ('category' in formData && (!formData['category'] || formData['category'] === '')) {
        setError('Please select a valid category.');
        setIsSubmitting(false);
        return;
      }
      let hasFile = false;
      const fileFields = new Set(['image', 'imageUrls', 'gallery', 'cover', 'blogImage']);
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        let uploadKey = key;
        // For blogs, always send the image as 'image'
        if (endpoint.includes('blog') && fileFields.has(key)) {
          uploadKey = 'image';
        }
        if (
          fileFields.has(key) &&
          Array.isArray(value) &&
          value.length &&
          value[0] &&
          typeof value[0] === 'object' &&
          (value[0] as File) instanceof File
        ) {
          hasFile = true;
          value.forEach((file) => {
            formDataToSend.append(uploadKey, file);
          });
        } else if (
          fileFields.has(key) &&
          typeof value === 'object' &&
          (value as File) instanceof File
        ) {
          hasFile = true;
          formDataToSend.append(uploadKey, value);
        } else {
          // Special handling for destinationId: always send as plain string
          if (key === 'destinationId') {
            formDataToSend.append(key, value ? value.toString() : '');
          } else if (typeof value === 'object' && value !== null && !(value instanceof Date)) {
            formDataToSend.append(key, JSON.stringify(value));
          } else if (typeof value !== 'undefined' && value !== null) {
            formDataToSend.append(key, value.toString());
          } else {
            formDataToSend.append(key, '');
          }
        }
      });
      const url = data._id ? `${endpoint}/${data._id}` : endpoint;
      const response = await fetchAPI({
        endpoint: url,
        method: data._id ? "PUT" : "POST",
        data: hasFile ? formDataToSend : formData
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