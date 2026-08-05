import React, { useRef, useState } from 'react';
import { Upload, Link, Loader2, X, Image } from 'lucide-react';
import { uploadImage } from '../lib/storage';

type StorageBucket = 'product-images' | 'banner-images' | 'blog-images' | 'general';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: StorageBucket;
  label?: string;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  bucket = 'banner-images',
  label,
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [mode, setMode] = useState<'url' | 'upload'>(value ? 'url' : 'upload');
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Arquivo excede 5MB');
      return;
    }

    setUploading(true);
    try {
      const { url } = await uploadImage(file, bucket);
      onChange(url);
    } catch (err) {
      console.error('Upload error:', err);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-xs font-semibold text-neutral-700 mb-1">{label}</label>
      )}

      {/* Mode Toggle */}
      <div className="flex gap-1 mb-2">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
            mode === 'upload'
              ? 'bg-[#C18282] text-white'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          <Upload className="w-3 h-3" /> Upload
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
            mode === 'url'
              ? 'bg-[#C18282] text-white'
              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          <Link className="w-3 h-3" /> URL
        </button>
      </div>

      {/* Preview */}
      {value && (
        <div className="relative mb-2">
          <img src={value} alt="" className="w-full h-32 object-cover rounded-lg border border-neutral-200" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Upload Mode */}
      {mode === 'upload' && !value && (
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-[#C18282] bg-[#C18282]/5'
              : 'border-neutral-300 hover:border-[#C18282] hover:bg-neutral-50'
          }`}
        >
          {uploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-[#C18282] mx-auto" />
          ) : (
            <>
              <Image className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <p className="text-xs text-neutral-500">Arraste ou clique para enviar</p>
              <p className="text-[10px] text-neutral-400 mt-1">PNG, JPG até 5MB</p>
            </>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={e => handleUpload(e.target.files)}
            className="hidden"
          />
        </div>
      )}

      {/* URL Mode */}
      {mode === 'url' && !value && (
        <input
          type="url"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="https://exemplo.com/imagem.jpg"
          className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
        />
      )}
    </div>
  );
};
