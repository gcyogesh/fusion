"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
// Lazy-load Button for performance
const Button = dynamic(() => import("@/components/atoms/button"), { ssr: false });
import { fetchAPI } from "@/utils/apiService";
import { FiEdit, FiTrash, FiPlus, FiX, FiAlertCircle, FiCamera } from "react-icons/fi";
import { FaStar } from 'react-icons/fa';
import Alert from "@/components/atoms/alert";
import Loader from "@/components/atoms/Loader";

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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    fetchAPI<{ data: Category[] }>({ endpoint })
      .then(res => setCategories(res.data || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, [endpoint]);

  // Close modal on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

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

  const handleDeleteCategory = async (catId: string) => {
    setDeletingId(catId);
    setError(null);
  };

  const confirmDeleteCategory = async () => {
    try {
      await fetchAPI({ endpoint: `${endpoint}/${deletingId}`, method: 'DELETE' });
      setCategories(prev => prev.filter(cat => (cat._id || cat.id || cat.slug) !== deletingId));
    } catch (err) {
      setError('Failed to delete category');
    } finally {
      setDeletingId(null);
    }
  };

  // Helper: Spinner for delete button
  const Spinner = () => (
    <Loader size="sm" color="gray" />
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <select
          value={getCurrentCategoryValue(value) || ""}
          onChange={handleSelect}
          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          disabled={loading}
        >
          <option value="">Select a {label.toLowerCase()}</option>
          {allCategories.map(cat => {
            const valueId = cat._id;
            const isRealCategory = !!valueId && typeof valueId === 'string' && valueId.length >= 12;
            const labelText = 'name' in cat ? cat.name : ('title' in cat ? cat.title : ('slug' in cat ? cat.slug : ''));
            const isSelected = getCurrentCategoryValue(value) === valueId;
            return (
              <option key={valueId ?? ''} value={valueId ?? ''}>
                {labelText ?? ''}
                {justAddedId === (valueId ?? '') ? " (new)" : ""}
              </option>
            );
          })}
        </select>
        <button
          type="button"
          className="mt-2 text-xs text-primary underline"
          onClick={() => setShowDropdown((v) => !v)}
        >
          Show Categories
        </button>
        {showDropdown && (
          <>
            {/* Overlay */}
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => setShowDropdown(false)} />
            {/* Modal */}
            <div ref={dropdownRef} className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl border border-primary/20 w-full max-w-md p-0 flex flex-col">
              <div className="px-6 pt-5 pb-2 flex items-center justify-between border-b border-gray-100 bg-primary/5 rounded-t-2xl">
                <div className="font-semibold text-lg text-gray-800">Manage Categories</div>
                <button onClick={() => setShowDropdown(false)} className="text-gray-400 hover:text-primary p-2 rounded-full bg-white shadow border border-gray-200">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              {error && (
                <div className="px-6 py-2 text-red-600 bg-red-50 border-b border-red-200 text-sm">{error}</div>
              )}
              <div className="overflow-y-auto max-h-60 px-2 py-2 bg-white rounded-b-2xl">
                {allCategories.map(cat => {
                  const valueId = cat._id;
                  const isRealCategory = !!valueId && typeof valueId === 'string' && valueId.length >= 12;
                  const labelText = 'name' in cat ? cat.name : ('title' in cat ? cat.title : ('slug' in cat ? cat.slug : ''));
                  const isSelected = getCurrentCategoryValue(value) === valueId;
                  return (
                    <div
                      key={valueId ?? ''}
                      className="flex items-center justify-between px-3 py-2 rounded-lg transition hover:bg-primary/10 cursor-pointer"
                    >
                      <span className="truncate text-gray-800 text-sm font-medium">{labelText ?? ''}</span>
                      {!isSelected && isRealCategory && (
                        <button
                          type="button"
                          className="text-red-500 hover:text-red-700 text-xs ml-2 disabled:opacity-50 rounded-full p-1 bg-red-50 hover:bg-red-100 border border-transparent hover:border-red-200 transition flex items-center justify-center"
                          disabled={deletingId === valueId}
                          onClick={async () => {
                            setDeletingId(String(valueId));
                            setError(null);
                            await confirmDeleteCategory();
                          }}
                        >
                          {deletingId === valueId ? <Spinner /> : <FiTrash className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  );
                })}
                {allCategories.length === 0 && (
                  <div className="text-gray-400 text-center py-6">No categories found.</div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
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
            className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/80 transition-colors"
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
  const [arrayFieldErrors, setArrayFieldErrors] = useState<Record<string, string>>({});

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
    // Skip certain fields based on endpoint
    if (endpoint.includes('faq')) {
      // Skip image-related fields for FAQs
      if (key.toLowerCase().includes('image') || key.toLowerCase().includes('photo') || key.toLowerCase().includes('gallery')) {
        return true;
      }
    }
    
    // Skip internal fields
    return [
      '_id',
      'id',
      'createdAt',
      'updatedAt',
      '__v',
      'slug',
      'totaltrips',
      'totalTrips',
      'isfeatured',
      'isFeatured'
    ].includes(key);
  };

  // ========== Field Renderer ==========
  const renderField = (key: string, value: unknown) => {
    // FAQ answer field - make it a large textarea
    if (endpoint.includes('faq') && key === 'answer') {
      return (
        <textarea
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none min-h-[120px] text-base"
          value={formData[key] || ''}
          onChange={e => handleChange(key, e.target.value)}
          placeholder="Enter answer..."
          rows={5}
        />
      );
    }
    
    // Description textarea
    if (key === 'description') {
      return (
        <textarea
          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-y min-h-[80px] text-base"
          value={formData[key] || ''}
          onChange={e => handleChange(key, e.target.value)}
          placeholder="Enter description..."
          rows={3}
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
      // Determine max images based on endpoint/type
      let maxImages = 1;
      if (endpoint.includes('destination')) maxImages = 5;
      else if (endpoint.includes('blog')) maxImages = 1;
      else if (endpoint.includes('activity')) maxImages = 1;
      // Fill slots up to maxImages
      const slots = Array.from({ length: maxImages }, (_, i) => files[i] || null);
      const showImageError = error === 'Image is required' && endpoint.includes('blog');
      return (
        <div className={`space-y-4 ${showImageError ? 'border border-red-500 rounded-xl p-2' : ''}`}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {slots.map((file, index) => (
              <div key={index} className="group relative aspect-square flex items-center justify-center border-2 border-dashed border-primary/30 rounded-xl bg-primary/5">
                {file ? (
                  <>
                    <img
                      src={(file && typeof window !== 'undefined' && ((file as any) instanceof File)) ? URL.createObjectURL(file as any) : String(file ?? '')}
                      alt={`${key} ${index + 1}`}
                      className="w-full h-full object-cover rounded-xl"
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
                      className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl z-10"
                      title="Replace Image"
                    >
                      <FiCamera className="w-8 h-8 text-white" />
                    </button>
                    {/* Delete icon */}
                    <button
                      type="button"
                      onClick={() => {
                        // Prevent deletion if there's only one image left (for all endpoints)
                        if (files.length === 1) {
                          setArrayFieldErrors(prev => ({ ...prev, [key]: 'At least one image is required.' }));
                          return;
                        }
                        setArrayFieldErrors(prev => ({ ...prev, [key]: '' }));
                        const newFiles = files.filter((_, i) => i !== index);
                        handleChange(key, newFiles);
                      }}
                      className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-red-100 transition-all duration-200 z-20"
                      title="Delete Image"
                    >
                      <FiTrash className="w-5 h-5 text-red-600" />
                    </button>
                  </>
                ) : (
                  // Empty slot: show add button if not at max
                  files.length < maxImages && (
                    <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                      <FiCamera className="w-10 h-10 text-primary mb-1" />
                      <span className="text-xs text-primary font-semibold">Add Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const filesInput = (e.target as HTMLInputElement).files;
                          if (filesInput && filesInput.length > 0) {
                            const newFiles = [...files];
                            newFiles[index] = filesInput[0];
                            handleChange(key, newFiles);
                          }
                        }}
                      />
                    </label>
                  )
                )}
              </div>
            ))}
          </div>
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
                value={String(typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean' ? v : JSON.stringify(v))}
                onChange={e => {
                  let newValue: any = e.target.value;
                  if (typeof v === 'object' && v !== null) {
                    try { newValue = JSON.parse(e.target.value); } catch { newValue = e.target.value; }
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
    if (Array.isArray(value) && (value.length === 0 || value.every(v => typeof v === 'string'))) {
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
                className="px-3 py-2 bg-primary text-white rounded-xl hover:bg-primary/80"
                onClick={() => {
                  // Prevent deletion if there's only one item left (for all endpoints)
                  console.log('Attempting to delete item:', { key, currentLength: value.length, idx });
                  if (value.length === 1) {
                    console.log('Preventing deletion - only one item left');
                    setArrayFieldErrors(prev => ({ ...prev, [key]: 'At least one item is required.' }));
                    return;
                  }
                  console.log('Allowing deletion - multiple items exist');
                  setArrayFieldErrors(prev => ({ ...prev, [key]: '' }));
                  const updated = value.filter((_, i) => i !== idx);
                  handleChange(key, updated);
                }}
              >
                Remove
              </button>
            </div>
          ))}
          {arrayFieldErrors[key] && (
            <div className="text-red-600 text-xs mt-1">{arrayFieldErrors[key]}</div>
          )}
          <button
            type="button"
            className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/80"
            onClick={() => {
              setArrayFieldErrors(prev => ({ ...prev, [key]: '' }));
              handleChange(key, [...value, '']);
            }}
          >
            Add
          </button>
        </div>
      );
    }
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
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
                          src={(typeof File !== 'undefined' && item[k] instanceof File) ? URL.createObjectURL(item[k]) : String(item[k])}
                          alt={k}
                          className="w-24 h-24 object-cover rounded border"
                        />
                      )}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={String(item[k] ?? '')}
                      onChange={e => {
                        let newValue: any = e.target.value;
                        if (typeof item[k] === 'object' && item[k] !== null) {
                          try { newValue = JSON.parse(e.target.value); } catch { newValue = e.target.value; }
                        } else if (typeof item[k] === 'number') {
                          newValue = e.target.value;
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
              <button
                type="button"
                className="mt-2 px-3 py-2 bg-primary text-white rounded-xl hover:bg-primary/80"
                onClick={() => {
                  // Prevent deletion if there's only one item left (for all endpoints)
                  console.log('Attempting to delete item:', { key, currentLength: value.length, idx });
                  if (value.length === 1) {
                    console.log('Preventing deletion - only one item left');
                    setArrayFieldErrors(prev => ({ ...prev, [key]: 'At least one item is required.' }));
                    return;
                  }
                  console.log('Allowing deletion - multiple items exist');
                  setArrayFieldErrors(prev => ({ ...prev, [key]: '' }));
                  const updated = value.filter((_, i) => i !== idx);
                  handleChange(key, updated);
                }}
              >
                Remove
              </button>
            </div>
          ))}
          {arrayFieldErrors[key] && (
            <div className="text-red-600 text-xs mt-1">{arrayFieldErrors[key]}</div>
          )}
          <button
            type="button"
            className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/80"
            onClick={() => {
              setArrayFieldErrors(prev => ({ ...prev, [key]: '' }));
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
          value={String(typeof formData[key] === 'number' ? formData[key] : 0)}
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
    if (key.toLowerCase() === 'totaltrips') {
      return (
        <input
          type="text"
          value={String(formData[key] ?? '')}
          readOnly
          className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
        />
      );
    }
    // Rating star selector
    if (key === 'rating') {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
          <StarRating
            value={formData[key] || ''}
            onChange={val => handleChange(key, val)}
          />
        </div>
      );
    }
    return (
      <input
        type="text"
        value={String(formData[key] ?? '')}
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
      // Blog image required validation
      if (endpoint.includes('blog')) {
        const hasImage = (
          (Array.isArray(formData['image']) && formData['image'].length > 0) ||
          (Array.isArray(formData['gallery']) && formData['gallery'].length > 0) ||
          (Array.isArray(formData['imageUrls']) && formData['imageUrls'].length > 0) ||
          (Array.isArray(formData['image']) && formData['image'].length > 0) ||
          (typeof formData['image'] === 'string' && formData['image']) ||
          (typeof formData['gallery'] === 'string' && formData['gallery']) ||
          (typeof formData['imageUrls'] === 'string' && formData['imageUrls']) ||
          (typeof formData['blogImage'] === 'string' && formData['blogImage'])
        );
        if (!hasImage) {
          setError('Image is required');
          setIsSubmitting(false);
          return;
        }
      }
      let hasFile = false;
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        const isFileField = /image|photo|gallery/i.test(key);
        // Helper: type guard for File
        const isFile = (v: any): v is File => typeof File !== 'undefined' && v && typeof v === 'object' && 'name' in v && 'size' in v && 'type' in v;
        const uploadKey = (endpoint.includes('blog') && isFileField) ? 'imageUrl' : key;
        if (
          isFileField &&
          Array.isArray(value) &&
          value.length &&
          value[0] &&
          typeof value[0] === 'object' &&
          isFile(value[0])
        ) {
          hasFile = true;
          value.forEach((file) => {
            if (isFile(file)) formDataToSend.append(uploadKey, file);
          });
        } else if (
          isFileField &&
          typeof value === 'object' &&
          isFile(value)
        ) {
          hasFile = true;
          formDataToSend.append(uploadKey, value);
        } else {
          // Special handling for destinationId: always send as plain string
          if (key === 'destinationId') {
            formDataToSend.append(key, value ? String(value) : '');
          } else if (typeof value === 'object' && value !== null && Object.prototype.toString.call(value) !== '[object Date]') {
            formDataToSend.append(key, JSON.stringify(value));
          } else if (typeof value === 'boolean') {
            formDataToSend.append(key, value ? 'true' : 'false');
          } else if (typeof value !== 'undefined' && value !== null) {
            formDataToSend.append(key, String(value));
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-fadeIn" />
      {/* Modal */}
      <div className="relative w-full max-w-4xl min-h-[120px] bg-white rounded-2xl shadow-2xl border border-primary/20 px-16 py-8 flex flex-col animate-scaleIn overflow-y-auto max-h-[80vh]">
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
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-row items-center gap-3 w-full min-w-0 h-[44px]">
            <h2 className="text-2xl font-bold text-gray-800 tracking-tight whitespace-nowrap leading-[44px] h-[44px] flex items-center">
              {formData._id ? "Edit Item" : "Add New Item"}
            </h2>
            <span className="text-base text-gray-400 font-normal whitespace-nowrap overflow-hidden text-ellipsis leading-[44px] h-[44px] flex items-center">
              {formData._id ? "Update the details below" : "Fill in the details below"}
            </span>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-primary transition-all duration-200 p-2 hover:bg-primary/10 rounded-xl absolute top-4 right-4"
            style={{ position: 'absolute', top: 16, right: 16 }}
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        {/* Form Content */}
        <form onSubmit={handleSubmit} className="w-full">
          <div className="space-y-8 w-full">
            <div className="grid grid-cols-1 gap-8 w-full">
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
                    className={`flex flex-col gap-2 ${isFullWidth ? '' : ''}`}
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
          {/* Actions */}
          <div className="flex justify-end gap-4 mt-8">
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
        </form>
      </div>
    </div>
  );
}