"use client";

import { useState, useEffect } from "react";
import { FiEdit, FiTrash, FiCamera, FiX, FiAlertCircle } from "react-icons/fi";
import { MdStar, MdFavorite, MdAddCircle, MdWorkspacePremium, MdLocationOn } from "react-icons/md";
import Button from "@/components/atoms/button";
import DynamicForm from "@/components/molecules/DynamicForm";
import { fetchAPI } from "@/utils/apiService";
import Pagination from "@/components/atoms/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

// Define a generic type for items
export interface ItemBase {
  _id?: string;
  id?: string | number;
  title?: string;
  name?: string;
  image?: string;
  gallery?: string[];
  [key: string]: unknown;
}

// Improved safeString for arrays/objects
const safeString = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return '';
    if (typeof value[0] === 'object' && value[0] !== null) {
      // Array of objects: try to show title/name or JSON
      return value
        .map((v) =>
          typeof v === 'object'
            ? (v.title || v.name || JSON.stringify(v))
            : String(v)
        )
        .join(', ');
    }
    // Array of primitives
    return value.join(', ');
  }
  if (typeof value === 'object') {
    if ('title' in value && typeof value.title === 'string' && value.title) return value.title;
    if ('name' in value && typeof value.name === 'string' && value.name) return value.name;
    return JSON.stringify(value);
  }
  return String(value);
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

// Helper: recursively blank out all values but keep structure
function deepTemplateClone(template) {
  if (Array.isArray(template)) {
    if (template.length > 0 && typeof template[0] === 'object' && template[0] !== null) {
      return [deepTemplateClone(template[0])];
    }
    return [''];
  } else if (template && typeof template === 'object') {
    const result = {};
    for (const k in template) {
      const val = template[k];
      if (Array.isArray(val)) result[k] = deepTemplateClone(val);
      else if (typeof val === 'object' && val !== null) result[k] = deepTemplateClone(val);
      else result[k] = '';
    }
    return result;
  }
  return '';
}

export function AdminTable<T extends ItemBase>({
  title,
  buttonText,
  data: initialData,
  columns,
  endpoint,
}: AdminTableProps<T>) {
  const [items, setItems] = useState<T[]>(initialData);
  const [showForm, setShowForm] = useState(false);
  const [currentItem, setCurrentItem] = useState<T | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  const paginatedItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 1500);
  };

  const refreshData = async () => {
    try {
      const response = await fetchAPI<any>({ endpoint });
      let data: T[] = [];
      if (response && Array.isArray(response.data)) {
        data = response.data;
      } else if (response && Array.isArray(response)) {
        data = response;
      }
      setItems(data);
    } catch (error) {
      console.error("Failed to refresh data", error);
      setItems([]);
    }
  };

  useEffect(() => {
    refreshData();
  }, [endpoint]);

  const handleEdit = (item: T) => {
    setCurrentItem(item);
    setShowForm(true);
  };

  const handleDelete = async (item: T) => {
    if (!confirm(`Are you sure you want to delete this item?`)) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await fetchAPI({ endpoint, method: "DELETE", id: item._id || item.id });
      await refreshData();
      showSuccessMessage("Item deleted successfully!");
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Failed to delete.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddNew = () => {
    if (!items.length) return; // or show a message
    const template = items[0];
    const emptyItem = deepTemplateClone(template);
    setCurrentItem(emptyItem);
    setShowForm(true);
  };

  const handleSave = async (savedItem: T) => {
    setShowForm(false);
    setCurrentItem(null);
    await refreshData();
    showSuccessMessage(savedItem._id ? "Item updated!" : "Item added!");
  };

  return (
    <div className="w-full min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4">
        {showSuccess && (
          <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm">
            {successMessage}
          </div>
        )}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
          <h2 className="text-2xl font-bold flex items-center gap-2">{title}</h2>
          <Button text={buttonText} variant="primary" onClick={handleAddNew} />
        </div>
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {paginatedItems.map((item) => {
            const itemId = item._id || item.id;
            const cardContent = (
              <div
                className="relative rounded-xl overflow-hidden shadow group bg-white cursor-pointer"
              >
                <div className="relative h-56">
                  <img
                    src={safeString(item.image) || item.gallery?.[0] || '/fallback.jpg'}
                    alt={safeString(item.title)}
                    className="w-full h-full object-cover"
                    onError={e => { (e.currentTarget as HTMLImageElement).src = '/fallback.jpg'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute top-3 right-3 flex gap-2 z-10">
                    <button className="bg-white/90 hover:bg-blue-100 p-2 rounded-full shadow" onClick={() => handleEdit(item)}>
                      <FiEdit className="text-blue-600" />
                    </button>
                    <button className="bg-white/90 hover:bg-red-100 p-2 rounded-full shadow" onClick={() => handleDelete(item)}>
                      <FiTrash className="text-red-600" />
                    </button>
                  </div>
                  {/* See Packages button overlay - enhanced professional UI */}
                  {itemId && (
                    <Link
                      href={`/dashboard/packages/${itemId}`}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
                      style={{ pointerEvents: 'auto' }}
                    >
                      <span className="flex items-center gap-2 px-7 py-3 rounded-xl bg-white border border-blue-100 shadow-xl text-blue-700 font-bold text-lg hover:scale-105 hover:brightness-110 transition-all duration-200"
                        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)' }}
                        title="See Packages"
                      >
                        {/* Clean Lucide/Feather-style package icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                          <line x1="12" y1="22.08" x2="12" y2="12" />
                        </svg>
                      </span>
                    </Link>
                  )}
                  <div className="absolute bottom-0 left-0 w-full p-4 flex items-center gap-2">
                    <MdLocationOn className="text-yellow-400 text-xl drop-shadow" />
                    <span className="text-white font-bold text-lg drop-shadow">
                      {safeString(item.title) || safeString(item.name) || 'Untitled'}
                    </span>
                  </div>
                </div>
              </div>
            );
            return itemId ? (
              <div key={itemId} className="block">
                {cardContent}
              </div>
            ) : (
              <div key={itemId || Math.random()}>{cardContent}</div>
            );
          })}
        </div>
        {showForm && currentItem && (
          <DynamicForm
            data={currentItem}
            columns={columns}
            title={currentItem._id ? `Edit ${title}` : `Add ${title}`}
            endpoint={endpoint}
            method={currentItem._id ? "PUT" : "POST"}
            onCancel={() => setShowForm(false)}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
}