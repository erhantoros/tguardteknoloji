import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

interface FileUploadProps {
  onUpload: (url: string) => void;
  accept?: string;
  maxSize?: number; // in MB
}

function FileUpload({ onUpload, accept = "image/*", maxSize = 50 }: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`Dosya boyutu ${maxSize}MB'dan küçük olmalıdır`);
      return;
    }

    setUploading(true);
    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('public')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl }, error: urlError } = supabase.storage
        .from('public')
        .getPublicUrl(filePath);

      if (urlError) throw urlError;

      onUpload(publicUrl);
      toast.success('Dosya başarıyla yüklendi');
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast.error(error.message || 'Dosya yüklenirken bir hata oluştu');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept={accept}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Upload className="h-5 w-5 mr-2" />
        {uploading ? (
          <>
            <span className="animate-spin mr-2">⌛</span>
            Yükleniyor...
          </>
        ) : (
          'Dosya Seç'
        )}
      </button>
      <p className="mt-2 text-sm text-gray-400">
        Maksimum dosya boyutu: {maxSize}MB
      </p>
    </div>
  );
}

export default FileUpload;