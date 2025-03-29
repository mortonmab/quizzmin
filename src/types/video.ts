export interface Video {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl?: string;
  type: "file" | "youtube" | "vimeo";
  duration?: number; // in seconds
  fileSize?: number; // in bytes
  createdAt?: Date;
  updatedAt?: Date;
  isActive: boolean;
}

export interface VideoUploadResponse {
  success: boolean;
  video?: Video;
  error?: string;
}

export interface VideoFilters {
  type?: "file" | "youtube" | "vimeo";
  isActive?: boolean;
  searchTerm?: string;
}
