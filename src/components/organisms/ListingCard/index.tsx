"use client";

import { useState } from "react";
import { FiEdit, FiTrash, FiCamera, FiX } from "react-icons/fi";
import Button from "@/components/atoms/button";
import DynamicForm from "@/components/molecules/DynamicForm";
import { fetchAPI } from "@/utils/apiService";


// Helper: Render object/array fields nicely
const renderObjectField = (key: string, value: any, handleChange: (key: string, value: any) => void) => {
  if (Array.isArray(value)) {
    return (
      <div className="flex flex-col gap-4">
        <label className="text-base font-semibold text-stone-800 mb-1">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
        <ul className="pl-4 list-disc space-y-2">
          {value.map((item, idx) => (
            <li key={idx} className="mb-2">
              {typeof item === 'object' ? renderObjectField(`${key} [${idx}]`, item, handleChange) : String(item)}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  if (typeof value === 'object' && value !== null) {
    // If the object has an image url, show it
    const imageKeys = Object.keys(value).filter(k => typeof value[k] === 'string' && value[k].match(/\.(jpg|jpeg|png|gif|webp)$/i));
    return (
      <div className="flex flex-col gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100 shadow-sm">
        <label className="text-base font-semibold text-stone-800 mb-1">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(value).map(([k, v], idx) => {
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

  const handleEdit = (item: T) => {
    setCurrentItem(item);
    if (item.image && typeof item.image === "string") {
      setImagePreview(item.image);
    } else {
      setImagePreview(null);
    }
    setShowForm(true);
  };

  const handleDelete = async (item: T) => {
    if (!confirm(`Are you sure you want to delete this item?`)) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await fetchAPI({ endpoint, method: 'DELETE', id: item.id });
      const updated = items.filter((i) => i.id !== item.id);
      setItems(updated);
    } catch (err: any) {
      setDeleteError(err.message || 'Failed to delete item.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChange = (key: string, value: any) => {
    if (!currentItem) return;
    if (key === "image" && value instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setCurrentItem({ ...currentItem, [key]: reader.result });
      };
      reader.readAsDataURL(value);
    } else {
      setCurrentItem({ ...currentItem, [key]: value });
    }
  };

  const handleSave = async () => {
    if (!currentItem) return;
    setIsSaving(true);
    setError(null);
    try {
      const method = currentItem.id ? 'PUT' : 'POST';
      const id = currentItem.id ? currentItem.id : undefined;

      const savedItem = await fetchAPI<T>(
        {
          endpoint,
          method,
          data: currentItem,
          id
        }
      );

      if (currentItem.id) {
        setItems(items.map(item => item.id === savedItem.id ? savedItem : item));
      } else {
        setItems([...items, savedItem]);
      }

      setShowForm(false);
      setCurrentItem(null);
      setImagePreview(null);
    } catch (err: any) {
      setError(err.message || 'Failed to save item.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
          <Button
            text={buttonText}
            variant="primary"
            onClick={() => {
              setCurrentItem({} as T);
              setImagePreview(null);
              setShowForm(true);
            }}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
          <table className="min-w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th key={String(column.accessor)} className="px-6 py-3">
                    {column.label}
                  </th>
                ))}
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={String(column.accessor)} className="px-6 py-4">
                      {column.render
                        ? column.render(item)
                        : String(item[column.accessor])}
                    </td>
                  ))}
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <FiEdit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="text-red-600 hover:text-red-800"
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

        {/* Form Modal */}
        {showForm && currentItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            aria-modal="true"
            role="dialog"
          >
            <div className="w-full mx-auto max-w-3xl xl:max-w-4xl flex flex-col justify-center bg-white rounded-xl shadow-xl p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center sticky top-0 pb-4">
                 <h2 className="text-2xl font-semibold text-gray-800">
                  {Object.keys(currentItem).length === 0 ? "Add New Item" : "Edit Item"}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setCurrentItem(null);
                    setImagePreview(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
              {error && <p className="text-red-500 mb-4">Error: {error}</p>}
              <DynamicForm
                 fields={currentItem}
                 onChange={(key, value) => handleChange(key, value)}
                 onCancel={() => {
                    setShowForm(false);
                    setCurrentItem(null);
                    setImagePreview(null);
                  }}
                 onSave={handleSave}
                 title={Object.keys(currentItem).length === 0 ? "Add New Item" : "Edit Item"}
                 loading={isSaving}
                 error={error}
               />
            </div>
          </div>
        )}

        {/* Delete Error Display */}
        {deleteError && (
          <div className="fixed bottom-4 left-4 p-4 bg-red-500 text-white rounded shadow-lg z-50">
            {deleteError}
          </div>
        )}
      </div>
    </div>
  );
}