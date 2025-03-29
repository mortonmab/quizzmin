import React, { useState, useRef } from "react";
import { Button } from "./button";
import { Progress } from "./progress";
import { cn } from "@/lib/utils";
import { Upload, X, FileText, AlertCircle } from "lucide-react";

interface FileUploadProps {
  accept?: string;
  maxSize?: number; // in bytes
  onUpload: (file: File) => Promise<{ success: boolean; error?: string }>;
  className?: string;
  buttonText?: string;
  description?: string;
}

const FileUpload = ({
  accept = "*/*",
  maxSize = 100 * 1024 * 1024, // 100MB default
  onUpload,
  className,
  buttonText = "Upload File",
  description = "Drag and drop a file here, or click to select",
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setError(null);

    // Check file type
    if (accept !== "*/*") {
      const acceptedTypes = accept.split(",").map((type) => type.trim());
      const fileType = file.type;

      if (
        !acceptedTypes.some((type) => {
          // Handle wildcards like image/*
          if (type.endsWith("/*")) {
            const category = type.split("/")[0];
            return fileType.startsWith(`${category}/`);
          }
          return type === fileType;
        })
      ) {
        setError(`Invalid file type. Accepted types: ${accept}`);
        return;
      }
    }

    // Check file size
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      setError(`File size exceeds the maximum limit of ${maxSizeMB}MB`);
      return;
    }

    setFile(file);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setProgress(0);
    setError(null);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + Math.random() * 10;
        return newProgress >= 95 ? 95 : newProgress;
      });
    }, 300);

    try {
      const result = await onUpload(file);

      clearInterval(progressInterval);

      if (result.success) {
        setProgress(100);
        setTimeout(() => {
          setFile(null);
          setProgress(0);
        }, 1000);
      } else {
        setError(result.error || "Upload failed");
        setProgress(0);
      }
    } catch (err) {
      clearInterval(progressInterval);
      setError("An unexpected error occurred");
      setProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setFile(null);
    setError(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept={accept}
        onChange={handleFileChange}
      />

      {!file ? (
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-gray-300 hover:border-primary/50",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <Upload className="h-12 w-12 text-gray-400" />
            <div>
              <p className="text-lg font-medium">{buttonText}</p>
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
            <p className="text-xs text-gray-400">
              Maximum file size: {formatFileSize(maxSize)}
            </p>
          </div>
        </div>
      ) : (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-primary" />
              <div>
                <p className="font-medium truncate max-w-[200px] sm:max-w-xs">
                  {file.name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              disabled={isUploading}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {progress > 0 && <Progress value={progress} className="h-2 mb-4" />}

          {error && (
            <div className="flex items-center space-x-2 text-destructive mb-4 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={handleUpload} disabled={isUploading}>
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export { FileUpload };
