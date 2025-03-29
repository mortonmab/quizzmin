import React, { useState, useEffect } from "react";
import { Video, VideoFilters } from "@/types/video";
import { getVideos, createVideo, updateVideo, deleteVideo } from "@/lib/database";
import { validateVideoFile, extractVideoId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "@/components/ui/file-upload";
import {
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  Eye,
  Youtube,
  Video as VideoIcon,
  ExternalLink,
  Clock,
  FileVideo,
  Link,
} from "lucide-react";

const VideoManagement = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filters, setFilters] = useState<VideoFilters>({});
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url: "",
    thumbnailUrl: "",
    type: "file" as "file" | "youtube" | "vimeo",
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Load videos
  useEffect(() => {
    loadVideos();
  }, [filters]);
  
  // Initial data loading
  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = async () => {
    try {
      const fetchedVideos = await getVideos(filters);
      setVideos(fetchedVideos);
    } catch (error) {
      console.error("Error loading videos:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      url: "",
      thumbnailUrl: "",
      type: "file",
      isActive: true,
    });
    setFormErrors({});
  };

  const handleEditVideo = (video: Video) => {
    setSelectedVideo(video);
    setFormData({
      title: video.title,
      description: video.description || "",
      url: video.url,
      thumbnailUrl: video.thumbnailUrl || "",
      type: video.type,
      isActive: video.isActive,
    });
    setIsFormOpen(true);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.url.trim()) {
      errors.url = "URL is required";
    } else if (formData.type === "youtube" || formData.type === "vimeo") {
      const { platform, id } = extractVideoId(formData.url);
      if (!platform || !id) {
        errors.url = `Invalid ${formData.type} URL`;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (selectedVideo) {
        // Update existing video
        await updateVideo(selectedVideo.id, formData);
      } else {
        // Create new video
        await createVideo(formData as Omit<Video, "id">);
      }

      setIsFormOpen(false);
      resetForm();
      setSelectedVideo(null);
      loadVideos();
    } catch (error) {
      console.error("Error saving video:", error);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    try {
      await deleteVideo(id);
      setVideoToDelete(null);
      loadVideos();
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  const handleFileUpload = async (file: File) => {
    const validation = validateVideoFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // In a real app, this would upload the file to a storage service
    // and return the URL. For now, we'll just use a fake URL.
    const fakeUrl = URL.createObjectURL(file);

    setFormData({
      ...formData,
      title: formData.title || file.name.split(".")[0],
      url: fakeUrl,
      type: "file",
    });

    return { success: true };
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "Unknown";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown";
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getVideoTypeIcon = (type: string) => {
    switch (type) {
      case "youtube":
        return <Youtube className="h-4 w-4 text-red-500" />;
      case "vimeo":
        return <VideoIcon className="h-4 w-4 text-blue-500" />;
      default:
        return <FileVideo className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Video Management</h1>
          <p className="text-gray-500">
            Manage intro videos for your quiz application
          </p>
        </div>

        <Button onClick={() => {
          resetForm();
          setIsFormOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Video
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search videos..."
                className="pl-10"
                value={filters.searchTerm || ""}
                onChange={(e) =>
                  setFilters({ ...filters, searchTerm: e.target.value })
                }
              />
            </div>

            <div className="flex gap-4">
              <Select
                value={filters.type || ""}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    type: value as "file" | "youtube" | "vimeo" | undefined,
                  })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Types" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="file">File</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="vimeo">Vimeo</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filters.isActive !== undefined ? filters.isActive.toString() : ""}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    isActive: value === "" ? undefined : value === "true",
                  })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="All Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Status</SelectItem>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Videos Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-gray-500">No videos found</p>
                    <Button
                      variant="link"
                      onClick={() => {
                        resetForm();
                        setIsFormOpen(true);
                      }}
                      className="mt-2"
                    >
                      Add your first video
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                videos.map((video) => (
                  <TableRow key={video.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        {video.thumbnailUrl ? (
                          <img
                            src={video.thumbnailUrl}
                            alt={video.title}
                            className="h-8 w-12 object-cover rounded"
                          />
                        ) : (
                          <div className="h-8 w-12 bg-gray-200 rounded flex items-center justify-center">
                            <VideoIcon className="h-4 w-4 text-gray-500" />
                          </div>
                        )}
                        <span className="truncate max-w-[200px]">{video.title}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {getVideoTypeIcon(video.type)}
                        <span className="capitalize">{video.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>{formatDuration(video.duration)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={video.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                      >
                        {video.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedVideo(video);
                            setIsPreviewOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditVideo(video)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setVideoToDelete(video.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Video Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={(open) => {
        if (!open) {
          resetForm();
          setSelectedVideo(null);
        }
        setIsFormOpen(open);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedVideo ? "Edit Video" : "Add New Video"}</DialogTitle>
            <DialogDescription>
              {selectedVideo ? "Update video details" : "Add a new intro video for your quiz"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Video Type</label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value as "file" | "youtube" | "vimeo" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="file">Upload File</SelectItem>
                  <SelectItem value="youtube">YouTube Link</SelectItem>
                  <SelectItem value="vimeo">Vimeo Link</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.type === "file" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Video File</label>
                <FileUpload
                  accept="video/mp4,video/avi,video/quicktime"
                  maxSize={100 * 1024 * 1024} // 100MB