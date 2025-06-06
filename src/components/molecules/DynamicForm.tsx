import React, { useState } from "react";
import { FiCamera, FiX } from "react-icons/fi";

// Helper functions for smart field detection
const isImageField = (key, label) => {
  const str = (key + ' ' + (label || '')).toLowerCase();
  return (
    str.includes('image') ||
    str.includes('photo') ||
    str.includes('gallery') ||
    str.includes('thumbnail')
  );
};

const isTextareaField = (key, label) => {
  const str = (key + ' ' + (label || '')).toLowerCase();
  return (
    str.includes('description') ||
    str.includes('desc') ||
    str.includes('about')
  );
};

const isCheckboxField = (key, label, value) => {
  const str = (key + ' ' + (label || '')).toLowerCase();
  return (
    (str.startsWith('is') || str.startsWith('has') || str.includes('enabled')) &&
    (typeof value === 'boolean' || value === 0 || value === 1)
  );
};

// Helper: Render object/array fields nicely
const renderObjectField = (key, value, handleChange) => {
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
                  <img src={v} alt={k} className="max-h-32 rounded-lg border border-slate-200 shadow object-contain bg-white" />
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

const DynamicForm = ({
  fields = {},
  onChange,
  onCancel,
  onSave,
  title = "",
  loading = false,
  error = null,
}) => {
  const [imagePreview, setImagePreview] = useState(null);

  return (
    <div className="relative  rounded-2xl shadow-2xl border border-slate-200 flex flex-col w-full">
      <div className="flex items-center justify-between px-8 pt-8 pb-3 sticky top-0 z-20 bg-white/95 rounded-t-2xl">
        <h2 className="text-3xl font-bold text-gray-800 tracking-tight">{title}</h2>
        <button
          type="button"
          className="ml-2 bg-white/90 rounded-full p-2 shadow hover:bg-red-100 transition"
          onClick={onCancel}
          aria-label="Close"
        >
          <FiX className="w-7 h-7 text-red-500" />
        </button>
      </div>
      <div className="max-h-[70vh] overflow-y-auto scroll-smooth px-8 pb-8 flex flex-col gap-8" style={{scrollPaddingTop: '4rem'}}>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSave && onSave();
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(fields)
              .filter(([key]) => key.toLowerCase() !== 'destination')
              .map(([key, value], idx) => {
                const label = key.charAt(0).toUpperCase() + key.slice(1);
                if (["inclusion", "exclusion"].includes(key.toLowerCase())) {
                  const textareaValue = Array.isArray(value) ? value.join("\n") : (value || "");
                  return (
                    <div key={key} className="flex flex-col gap-3 col-span-full">
                      <label className="text-base font-semibold text-stone-800 mb-1">{label}</label>
                      <textarea
                        value={textareaValue}
                        onChange={e => {
                          const v = e.target.value.split("\n");
                          onChange && onChange(key, v);
                        }}
                        className="p-3 border border-slate-200 rounded-lg min-h-[100px] focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-base"
                        placeholder={`Enter ${label.toLowerCase()}`}
                      />
                    </div>
                  );
                }
                if (isImageField(key, label)) {
                  const fileInputId = `file-input-${key}`;
                  return (
                    <div key={key} className="flex flex-col gap-3 col-span-full">
                      <label className="text-base font-semibold text-stone-800 mb-1">{label} (Image Upload)</label>
                      <div className="relative w-full max-w-xs">
                        {(imagePreview || value) && (
                          <img
                            src={imagePreview || value}
                            alt="Preview"
                            className="mt-2 max-h-48 rounded-lg border border-slate-200 shadow object-contain w-full bg-white"
                          />
                        )}
                        <button
                          type="button"
                          className="absolute bottom-2 right-2 bg-white/90 rounded-full p-2 shadow hover:bg-blue-100 transition"
                          onClick={() => document.getElementById(fileInputId)?.click()}
                          tabIndex={-1}
                        >
                          <FiCamera className="w-5 h-5 text-blue-600" />
                        </button>
                      </div>
                      <input
                        id={fileInputId}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setImagePreview(reader.result);
                              onChange && onChange(key, reader.result);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                  );
                }
                if (typeof value === 'object' && value !== null) {
                  return (
                    <div key={key} className="col-span-full">
                      {renderObjectField(key, value, (k, v) => onChange && onChange(key, v))}
                    </div>
                  );
                }
                if (isCheckboxField(key, label, value)) {
                  return (
                    <div key={key} className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={!!value}
                        onChange={e => onChange && onChange(key, e.target.checked)}
                        className="h-5 w-5 accent-blue-600 rounded border-gray-300 focus:ring-2 focus:ring-blue-400 transition"
                      />
                      <label className="text-lg font-medium text-stone-800 cursor-pointer">{label.replace(/_/g, ' ')}</label>
                    </div>
                  );
                }
                if (isTextareaField(key, label)) {
                  return (
                    <div key={key} className="flex flex-col gap-3 col-span-full">
                      <label className="text-base font-semibold text-stone-800 mb-1">{label}</label>
                      <textarea
                        value={value || ""}
                        onChange={e => onChange && onChange(key, e.target.value)}
                        className="p-3 border border-slate-200 rounded-lg min-h-[100px] focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-base"
                        placeholder={`Enter ${label.toLowerCase()}`}
                      />
                    </div>
                  );
                }
                return (
                  <div key={key} className="flex flex-col gap-3">
                    <label className="text-base font-semibold text-stone-800 mb-1">{label}</label>
                    <input
                      type={typeof value === "number" ? "number" : "text"}
                      value={value}
                      onChange={e => onChange && onChange(key, e.target.value)}
                      className="p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-base"
                      placeholder={`Enter ${label.toLowerCase()}`}
                    />
                  </div>
                );
              })}
          </div>
          <div className="mt-10 flex gap-4 justify-end">
            <button
              type="button"
              className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2 rounded-lg font-semibold transition ${loading ? 'bg-blue-300 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default DynamicForm;