import React, { useRef, useState } from 'react';
import { Upload, X, Loader2, GripVertical, Star } from 'lucide-react';
import { uploadImage, deleteImage } from '../lib/storage';

type StorageBucket = 'product-images' | 'banner-images' | 'blog-images' | 'general';

interface ImageGalleryProps {
  images: string[];
  onChange: (images: string[]) => void;
  bucket?: StorageBucket;
  maxImages?: number;
}

export const ImageGallery: React.FC<ImageGalleryProps> = (props) => {
  const { images, onChange, maxImages = 10 } = props;
  const bucket: StorageBucket = (props.bucket as StorageBucket) || 'product-images';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;
      if (file.size > 5 * 1024 * 1024) {
        alert(`Arquivo ${file.name} excede 5MB`);
        continue;
      }

      try {
        const { url } = await uploadImage(file, bucket);
        newImages.push(url);
      } catch (err) {
        console.error('Upload error:', err);
      }
    }

    if (newImages.length > 0) {
      onChange([...images, ...newImages].slice(0, maxImages));
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDelete = async (index: number) => {
    const imageUrl = images[index];

    // Only delete from storage if it's a Supabase URL
    if (imageUrl.includes('supabase')) {
      try {
        const path = imageUrl.split('/').pop() || '';
        await deleteImage(bucket, path);
      } catch (err) {
        console.error('Delete error:', err);
      }
    }

    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleSetCover = (index: number) => {
    if (index === 0) return;
    const newImages = [...images];
    const [removed] = newImages.splice(index, 1);
    newImages.unshift(removed);
    onChange(newImages);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(e.dataTransfer.files);
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-neutral-700">
        Fotos <span className="text-red-500">(obrigatório)</span>
      </label>

      {/* Images Grid */}
      <div className="flex flex-wrap gap-3">
        {images.map((img, index) => (
          <div
            key={index}
            className="relative group w-24 h-24 rounded-lg overflow-hidden border-2 border-neutral-200 bg-neutral-100"
          >
            <img
              src={img}
              alt={`Foto ${index + 1}`}
              className="w-full h-full object-cover"
            />

            {/* Cover Badge */}
            {index === 0 && (
              <div className="absolute inset-x-0 bottom-0 bg-black/80 text-white text-[9px] font-bold uppercase tracking-wider text-center py-1 flex items-center justify-center gap-1">
                <Star className="w-3 h-3 fill-current" />
                FOTO DE CAPA
              </div>
            )}

            {/* Actions Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => handleSetCover(index)}
                  className="p-1.5 bg-white/90 rounded-full hover:bg-white text-neutral-700 transition-colors"
                  title="Definir como capa"
                >
                  <Star className="w-3 h-3" />
                </button>
              )}
              <button
                type="button"
                onClick={() => handleDelete(index)}
                className="p-1.5 bg-white/90 rounded-full hover:bg-red-500 hover:text-white text-red-600 transition-colors"
                title="Remover"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Order Number */}
            <div className="absolute top-1 left-1 bg-black/70 text-white text-[9px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {index + 1}
            </div>
          </div>
        ))}

        {/* Upload Button */}
        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`w-24 h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-colors ${
              dragOver
                ? 'border-[#C18282] bg-[#C18282]/10'
                : 'border-neutral-300 hover:border-[#C18282] bg-neutral-50'
            } disabled:opacity-50`}
          >
            {uploading ? (
              <Loader2 className="w-5 h-5 animate-spin text-[#C18282]" />
            ) : (
              <Upload className="w-5 h-5 text-neutral-400" />
            )}
            <span className="text-[10px] text-neutral-500 font-medium">
              {uploading ? 'Enviando...' : 'Selecionar'}
            </span>
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleUpload(e.target.files)}
      />

      <p className="text-[10px] text-neutral-400">
        {images.length}/{maxImages} fotos • Arraste ou clique para adicionar • Máx. 5MB por arquivo
      </p>
    </div>
  );
};
