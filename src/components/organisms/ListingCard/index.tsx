"use client";

import { useState, useEffect } from "react";
import { FiEdit, FiTrash, FiCamera, FiX, FiAlertCircle } from "react-icons/fi";
import Button from "@/components/atoms/button";
import DynamicForm from "@/components/molecules/DynamicForm";
import { fetchAPI } from "@/utils/apiService";

const renderObjectField = (key: string, value: any, handleChange: (key: string, value: any) => void) => {
  if (Array.isArray(value)) {
    return (
      <div className="flex flex-col gap-4">
        <label className="text-base font-semibold text-stone-800 mb-1">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
        <ul className="pl-4 list-disc space-y-2">
          {value.map((item, idx) => (
            <li key={idx} className="mb-2">
              {typeof item === "object" ? renderObjectField(`${key} [${idx}]`, item, handleChange) : String(item)}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (typeof value === "object" && value !== null) {
    const imageKeys = Object.keys(value).filter(k => typeof value[k] === "string" && value[k].match(/\.(jpg|jpeg|png|gif|webp)$/i));
    return (
      <div className="flex flex-col gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
        <label className="text-base font-semibold text-stone-800 mb-1">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(value).map(([k, v]) => {
            if (imageKeys.includes(k)) {
              const fileInputId = `file-input-${key}-${k}`;
              return (
                <div key={k} className="flex flex-col items-start gap-2 relative">
                  <img src={v as string} alt={k} className="max-h-32 rounded-lg border border-slate-200 shadow object-contain bg-white" />
                  <button
                    type="button"
                    className="absolute bottom-2 right-2 bg-white/90 rounded-full p-1 shadow hover:bg-blue-100 transition"
                    onClick={() => document.getElementById(fileInputId)?.click()}
                    tabIndex={-1}
                  >
                    <FiCamera className="w-4 h-4 text-blue-600" />
                  </button>
                  <input
                    id={fileInputId}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      if (e.target.files && e.target.files[0]) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          handleChange(key, { ...value, [k]: reader.result });
                        };
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }}
                  />
                  <span className="text-xs text-gray-500 mt-1">{k}</span>
                </div>
              );
            }
            return (
              <div key={k} className="flex flex-col gap-1">
                <span className="text-xs text-gray-500">{k}</span>
                <span className="text-base text-gray-700 bg-white rounded px-2 py-1 border border-slate-200">{String(v)}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return <span className="text-gray-700">{String(value)}</span>;
};

type Column<T> = {
  label: string;
  accessor: keyof T;
  render?: (row: T) => React.ReactNode;
};

interface AdminTableProps<T> {
  title: string;
  buttonText: string;
  data: T[];
  columns: Column<T>[];
  endpoint: string;
}

export function AdminTable<T extends Record<string, any>>({
  title,
  buttonText,
  data,
  columns,
  endpoint,
}: AdminTableProps<T>) {
  const [items, setItems] = useState<T[]>(data);
  const [showForm, setShowForm] = useState(false);
  const [currentItem, setCurrentItem] = useState<T | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleAddNew = () => {
    if (!data.length) return;

    // Get the first item's structure to create empty fields
    const firstItem = data[0];
    const emptyItem = Object.entries(firstItem).reduce((acc, [key, value]) => {
      // Skip internal and auto-generated fields
      if (['_id', '__v', 'slug', 'createdAt', 'updatedAt'].includes(key)) return acc;

      // Create empty value based on the type of the original value
      if (typeof value === 'boolean') {
        acc[key as keyof T] = false as T[keyof T];
      } else if (Array.isArray(value)) {
        acc[key as keyof T] = [] as T[keyof T];
      } else if (typeof value === 'object' && value !== null) {
        acc[key as keyof T] = {} as T[keyof T];
      } else if (typeof value === 'number') {
        acc[key as keyof T] = 0 as T[keyof T];
      } else {
        acc[key as keyof T] = '' as T[keyof T];
      }
      return acc;
    }, {} as T);

    setCurrentItem(emptyItem);
    setImagePreview(null);
    setShowForm(true);
  };

  const handleEdit = (item: T) => {
    console.log('=== EDIT DEBUG ===');
    console.log('Item being edited:', item);
    console.log('Item _id:', item._id);
    console.log('Item id:', item.id);
    console.log('Is edit mode:', !!item._id);
    
    setCurrentItem(item);
    if (item.image && typeof item.image === "string") {
      setImagePreview(item.image);
    } else {
      setImagePreview(null);
    }
    setShowForm(true);
  };

  // Debug currentItem changes
  useEffect(() => {
    if (currentItem) {
      console.log('DynamicForm props:', {
        fields: currentItem,
        endpoint,
        method: currentItem._id ? "PUT" : "POST",
        hasId: !!currentItem._id
      });
    }
  }, [currentItem, endpoint]);

  const handleDelete = async (item: T) => {
    if (!confirm(`Are you sure you want to delete this item?`)) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      console.log('Deleting item:', item);
      console.log('Item ID:', item._id || item.id);
      await fetchAPI({ endpoint, method: "DELETE", id: item._id || item.id });
      const updated = items.filter(i => (i._id || i.id) !== (item._id || item.id));
      setItems(updated);
    } catch (err: any) {
      console.error('Delete error:', err);
      setDeleteError(err.message || "Failed to delete item.");
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleSave = async (savedData: T) => {
    setIsSaving(true);
    setError(null);
    try {
      if (currentItem?._id) {
        setItems(items.map(item => item._id === savedData._id ? savedData : item));
      } else {
        setItems([...items, savedData]);
      }
      setShowForm(false);
      setCurrentItem(null);
      setImagePreview(null);
    } catch (err: any) {
      setError(err.message || "Failed to save item.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="w-full max-w-7xl p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 tracking-tight">{title}</h2>
            <p className="text-gray-500 mt-2 text-lg">Manage your {title.toLowerCase()} here</p>
          </div>
          <Button
            text={buttonText}
            variant="primary"
            onClick={handleAddNew}
            className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-white">
                  {columns.map((column) => (
                    <th 
                      key={String(column.accessor)} 
                      className="px-8 py-5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className="px-8 py-5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {items.map((item, index) => (
                  <tr 
                    key={index} 
                    className="hover:bg-gray-50/50 transition-all duration-200"
                  >
                    {columns.map((column) => (
                      <td 
                        key={String(column.accessor)} 
                        className="px-8 py-5 whitespace-nowrap text-sm text-gray-700"
                      >
                        {column.render
                          ? column.render(item)
                          : String(item[column.accessor])}
                      </td>
                    ))}
                    <td className="px-8 py-5 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end gap-4">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-800 transition-all duration-200 p-2 hover:bg-blue-50 rounded-xl"
                          title="Edit"
                        >
                          <FiEdit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="text-red-600 hover:text-red-800 transition-all duration-200 p-2 hover:bg-red-50 rounded-xl"
                          title="Delete"
                        >
                          <FiTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table> 
          </div>
        </div>

        {/* Form Modal */}
        {showForm && currentItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-full mx-auto max-w-3xl xl:max-w-4xl flex flex-col justify-center bg-white rounded-3xl shadow-2xl p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center sticky top-0 pb-6 bg-white border-b border-gray-100">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 tracking-tight">
                    {currentItem._id ? "Edit Item" : "Add New Item"}
                  </h2>
                  <p className="text-gray-500 mt-2">
                    {currentItem._id ? "Update the details below" : "Fill in the details below"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setCurrentItem(null);
                    setImagePreview(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-all duration-200 p-2 hover:bg-gray-100 rounded-xl"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center gap-2">
                  <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <div className="mt-8">
                <DynamicForm
                  fields={currentItem}
                  endpoint={endpoint}
                  method={currentItem._id ? "PUT" : "POST"}
                  onCancel={() => {
                    setShowForm(false);
                    setCurrentItem(null);
                    setImagePreview(null);
                  }}
                  onSave={handleSave}
                  title={currentItem._id ? "Edit Item" : "Add New Item"}
                  loading={isSaving}  
                  error={error}
                />
              </div>
            </div>
          </div>
        )}

        {/* Delete Error Display */}
        {deleteError && (
          <div className="fixed bottom-6 right-6 p-4 bg-red-500 text-white rounded-xl shadow-lg z-50 flex items-center gap-3">
            <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{deleteError}</span>
          </div>
        )}
      </div>
    </div>
  );
}
