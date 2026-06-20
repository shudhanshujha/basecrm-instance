import React, { useState, useEffect } from 'react';
import { FileText, Download, Trash2, Loader2, ExternalLink } from 'lucide-react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';

interface FileRecord {
  id: string;
  fileName: string;
  fileKey: string;
  fileSize: number | null;
  mimeType: string | null;
  downloadUrl: string | null;
  createdAt: string;
}

interface FileListProps {
  entityType: 'asset' | 'deal' | 'invoice' | 'client' | 'expense' | 'activityLog';
  entityId: string;
  refreshTrigger?: number;
}

const FileList: React.FC<FileListProps> = ({ entityType, entityId, refreshTrigger = 0 }) => {
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchFiles();
  }, [entityType, entityId, refreshTrigger]);

  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const params: any = {};
      params[`${entityType}Id`] = entityId;
      const res = await api.get('/files/list', { params });
      setFiles(res.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (file: FileRecord) => {
    if (file.downloadUrl) {
      window.open(file.downloadUrl, '_blank');
    }
  };

  const handleDelete = async (file: FileRecord) => {
    if (!window.confirm(`Delete ${file.fileName}?`)) return;
    try {
      setDeletingId(file.id);
      await api.delete(`/files/delete/${encodeURIComponent(file.fileKey)}`);
      toast.success('File deleted');
      fetchFiles();
    } catch (error) {
      toast.error('Failed to delete file');
    } finally {
      setDeletingId(null);
    }
  };

  const formatSize = (bytes: number | null) => {
    if (bytes == null) return '—';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getMimeIcon = (mime: string | null) => {
    return <FileText size={16} className="text-accent-blue" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 size={20} className="animate-spin text-text-muted" />
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-text-muted text-[13px] italic border border-dashed border-border rounded-xl">
        No files attached
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex items-center justify-between p-3 bg-bg-surface-2 border border-border rounded-xl hover:border-accent-blue/30 transition-all group"
        >
          <div className="flex items-center gap-3 min-w-0">
            {getMimeIcon(file.mimeType)}
            <div className="min-w-0">
              <p className="text-[14px] font-bold text-text-primary truncate max-w-[200px]">{file.fileName}</p>
              <p className="text-[11px] text-text-muted font-bold uppercase tracking-wider">
                {formatSize(file.fileSize)} · {file.mimeType || 'unknown'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-all">
            <button
              onClick={() => handleDownload(file)}
              className="p-2 text-text-muted hover:text-accent-blue hover:bg-white/5 rounded-xl transition-all"
              title="Download"
            >
              <Download size={14} />
            </button>
            <button
              onClick={() => handleDelete(file)}
              disabled={deletingId === file.id}
              className="p-2 text-text-muted hover:text-danger hover:bg-white/5 rounded-xl transition-all"
              title="Delete"
            >
              {deletingId === file.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FileList;
