'use client';

import React, { useState, useRef } from 'react';

export default function HomePage() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/process-photo', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 p-4 max-w-md mx-auto space-y-4">
      <header className="bg-white p-4 rounded-2xl text-center shadow-sm">
        <h1 className="text-xl font-bold">Nutrición de Mamá</h1>
      </header>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-md"
      >
        {uploading ? 'Analizando foto...' : '📷 Tomar Foto a Comida'}
      </button>

      {result && (
        <div className="bg-white p-4 rounded-2xl shadow-sm space-y-2">
          {result.image_url && (
            <img
              src={result.image_url}
              alt="Plato"
              style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px' }}
            />
          )}
          <h2 className="font-bold text-lg text-slate-800">{result.dish_name}</h2>
          <p className="text-sm text-slate-600">
            {result.calories} kcal | P: {result.proteins_g}g | G: {result.fats_g}g | C: {result.carbs_g}g
          </p>
        </div>
      )}
    </main>
  );
}
