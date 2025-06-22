"use client";

import { useState, useEffect } from "react";
import { FiEdit, FiTrash, FiCamera, FiX, FiAlertCircle } from "react-icons/fi";
import { MdStar, MdFavorite, MdAddCircle, MdWorkspacePremium, MdLocationOn } from "react-icons/md";
import Button from "@/components/atoms/button";
import DynamicForm from "@/components/molecules/DynamicForm";
import { fetchAPI } from "@/utils/apiService";
import Pagination from "@/components/atoms/pagination";
import { useRouter, useSearchParams } from "next/navigation";

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

// Safely converts any value to a string for display, preventing [object Object]
const safeString = (value: unknown): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (Array.isArray(value)) return '...'; // Keep it simple
  if (typeof value === 'object') {
    if ('title' in value && typeof value.title === 'string' && value.title) return value.title;
    if ('name' in value && typeof value.name === 'string' && value.name) return value.name;
    return '...';
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
    if (!items.length) {
      const sampleItem: any = {};
      columns.forEach(col => {
        sampleItem[col.accessor] = '';
      });
      setCurrentItem(sampleItem as T);
      setShowForm(true);
      return;
    };
    const firstItem = items[0];
    const emptyItem: Partial<T> = {};
    Object.keys(firstItem).forEach((key) => {
      const value = (firstItem as any)[key];
      if (key === '_id' || key === 'id' || key === 'createdAt' || key === 'updatedAt' || key === '__v') {
         (emptyItem as any)[key] = undefined;
      } else if (Array.isArray(value)) {
        (emptyItem as any)[key] = [];
      } else if (typeof value === 'boolean') {
        (emptyItem as any)[key] = false;
      } else if (typeof value === 'number') {
        (emptyItem as any)[key] = 0;
      } else {
        (emptyItem as any)[key] = '';
      }
    });
    setCurrentItem(emptyItem as T);
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
          {paginatedItems.map((item) => (
            <div
              key={item._id || item.id}
              className="relative rounded-xl overflow-hidden shadow group bg-white"
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
                <div className="absolute bottom-0 left-0 w-full p-4 flex items-center gap-2">
                  <MdLocationOn className="text-yellow-400 text-xl drop-shadow" />
                  <span className="text-white font-bold text-lg drop-shadow">
                    {safeString(item.title) || safeString(item.name) || 'Untitled'}
                  </span>
                </div>
              </div>
            </div>
          ))}
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
