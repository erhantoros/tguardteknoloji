import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';

interface MultiFileUploadProps {
  onUpload: (urls: string[]) => void;
  accept?: string;
  maxSize?: number; // in MB
  maxFiles?: number;
}

function MultiFileUpload({ onUpload, accept = "image/*", maxSize = 20, maxFiles = 10 }: MultiFileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Check if total files exceed maxFiles
    if (selectedFiles.length + files.length > maxFiles) {
      toast.error(`En fazla ${maxFiles} dosya seçebilirsiniz`);
      return;
    }

    // Check file sizes
    const oversizedFiles = files.filter(file => file.size > maxSize * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error(`Bazı dosyalar ${maxSize}MB'dan büyük`);
      return;
    }

    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    setSelectedFiles(prev => [...prev, ...files]);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    try {
      for (const file of selectedFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('public')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('public')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      onUpload(uploadedUrls);
      toast.success('Dosyalar başarıyla yüklendi');
      
      // Clear selections
      setSelectedFiles([]);
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setPreviewUrls([]);
    } catch (error: any) {
      console.error('Error uploading files:', error);
      toast.error(error.message || 'Dosyalar yüklenirken bir hata oluştu');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept={accept}
          multiple
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || selectedFiles.length >= maxFiles}
          className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="h-5 w-5 mr-2" />
          Dosya Seç
        </button>
        {selectedFiles.length > 0 && (
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <span className="animate-spin mr-2">⌛</span>
                Yükleniyor...
              </>
            ) : (
              'Yükle'
            )}
          </button>
        )}
      </div>

      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previewUrls.map((url, index) => (
            <div key={url} className="relative group">
              <img
                src={url}
                alt={`Preview ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => removeFile(index)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-gray-400">
        Maksimum {maxFiles} dosya, her biri en fazla {maxSize}MB
      </p>
    </div>
  );
}

export default MultiFileUpload;