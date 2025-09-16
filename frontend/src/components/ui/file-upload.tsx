import React, { useRef, useState } from 'react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFileChange: (file: File | null) => void;
  previewUrl?: string;
  label?: string;
  accept?: string;
  className?: string;
  buttonText?: string;
}

export const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(
  ({ onFileChange, previewUrl, label, accept = 'image/*', className, buttonText = 'Dosya Seç', ...props }, ref) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      onFileChange(file);
    };

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === 'dragenter' || e.type === 'dragover') {
        setDragActive(true);
      } else if (e.type === 'dragleave') {
        setDragActive(false);
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onFileChange(e.dataTransfer.files[0]);
      }
    };

    const handleButtonClick = () => {
      fileInputRef.current?.click();
    };

    return (
      <div className={cn('space-y-2', className)}>
        {label && <div className="text-sm font-medium">{label}</div>}
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors',
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400',
            'flex flex-col items-center justify-center gap-2'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          {previewUrl ? (
            <div className="relative w-full">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="mx-auto max-h-48 object-contain rounded" 
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileChange(null);
                }}
              >
                Kaldır
              </Button>
            </div>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div className="text-sm text-gray-600">
                Dosyayı sürükleyip bırakın veya seçmek için tıklayın
              </div>
              <Button type="button" variant="outline" size="sm">
                {buttonText}
              </Button>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept={accept}
            {...props}
          />
        </div>
      </div>
    );
  }
);

FileUpload.displayName = 'FileUpload'; 