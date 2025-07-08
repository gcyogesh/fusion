'use client';

import { useState } from 'react';

export default function FormPage() {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    tag: '',
    totalTrips: 0,
    isFeatured: false,
  });

  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('subtitle', formData.subtitle);
    data.append('tag', formData.tag);
    data.append('totalTrips', String(formData.totalTrips));
    data.append('isFeatured', String(formData.isFeatured));

    files.forEach((file) => {
      data.append('imageUrls', file); // Make sure backend expects `imageFiles`
    });

    try {
      const response = await fetch('https://yogeshbhai.ddns.net/api/destinations/', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(err);
      }

      setStatus('✅ Successfully submitted!');
    } catch (error) {
      console.error(error);
      setStatus('❌ Failed to submit: ' + (error as Error).message);
    }
  };

  return (
    <section className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Submit a Destination</h1>
      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="subtitle"
          placeholder="Subtitle"
          value={formData.subtitle}
          onChange={handleChange}
          className="w-full p-2 border rounded min-h-[60px]"
          required
        />
        <input
          name="tag"
          placeholder="Tag"
          value={formData.tag}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="totalTrips"
          type="number"
          placeholder="Total Trips"
          value={formData.totalTrips}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <label className="flex items-center gap-2">
          <input
            name="isFeatured"
            type="checkbox"
            checked={formData.isFeatured}
            onChange={handleChange}
          />
          <span>Is Featured?</span>
        </label>

        <div>
          <label className="block mb-2 font-semibold">Upload Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="block w-full"
            required
          />
          <ul className="text-sm mt-2">
            {files.map((file, i) => (
              <li key={i}>{file.name}</li>
            ))}
          </ul>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>

      {status && <p className="mt-4">{status}</p>}
    </section>
  );
}
