import React from 'react';

interface ImagePickerProps {
  value?: string;
  onChange: (dataUrl: string | undefined) => void;
}

export default function ImagePicker({ value, onChange }: ImagePickerProps) {
  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {value && (
        <img src={value} alt="" style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: 6, border: '1px solid var(--border)' }} />
      )}
      <input type="file" accept="image/*" onChange={handleFile} style={{ color: 'var(--text)' }} />
      {value && <button type="button" className="btn btn-sm" onClick={() => onChange(undefined)}>Remove</button>}
    </div>
  );
}
