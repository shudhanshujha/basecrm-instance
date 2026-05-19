import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

interface FileUploadProps {
  entityType: 'site' | 'campaign' | 'invoice' | 'client' | 'expense';
  entityId: string;
  onUploadComplete?: (fileRecord: any) => void;
  label?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ entityType, entityId, onUploadComplete, label = 'Upload File' }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 50MB Limit
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size exceeds 50MB limit');
      return;
    }

    setUploading(true);
    setProgress(10);

    try {
      // 1. Get presigned URL from API
      const { data: { uploadUrl, fileRecord } } = await api.post('/files/upload', {
        fileName: file.name,
        mimeType: file.type,
        size: file.size,
        [`${entityType}Id`]: entityId,
      });

      setProgress(30);

      // 2. Upload directly to R2 using the presigned URL
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!response.ok) throw new Error('Upload failed');

      setProgress(100);
      toast.success('File uploaded successfully');
      if (onUploadComplete) onUploadComplete(fileRecord);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.error || error.message || 'Failed to upload file');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="w-full">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer bg-bg-surface hover:bg-bg-surface-2 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-accent-orange animate-spin mb-2" />
              <p className="text-sm text-text-muted">Uploading... {progress}%</p>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-text-muted mb-2" />
              <p className="text-sm text-text-muted">{label}</p>
              <p className="text-xs text-text-muted/60 mt-1">Max 50MB (PDF, PNG, JPG)</p>
            </>
          )}
        </div>
        <input type="file" className="hidden" onChange={handleFileChange} disabled={uploading} />
      </label>
    </div>
  );
};

export default FileUpload;
