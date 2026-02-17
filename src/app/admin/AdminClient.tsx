"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ImageIcon,
  Loader2,
  Pencil,
  PlusCircle,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

type Project = {
  id: string;
  title: string;
  description?: string | null;
  image_src?: string | null;
  github_url?: string | null;
  demo_url?: string | null;
  date?: string | null;
  created_at?: string;
};

export default function AdminClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_src: "",
    github_url: "",
    demo_url: "",
    date: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate if string is a valid URL
  function isValidImageUrl(url: string): boolean {
    if (!url || url.trim() === "") return false;
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }

  async function fetchProjects() {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  function openCreateDialog() {
    setEditingProject(null);
    setFormData({
      title: "",
      description: "",
      image_src: "",
      github_url: "",
      demo_url: "",
      date: "",
    });
    setUploadError(null);
    setDialogOpen(true);
  }

  function openEditDialog(project: Project) {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description || "",
      image_src: project.image_src || "",
      github_url: project.github_url || "",
      demo_url: project.demo_url || "",
      date: project.date || "",
    });
    setUploadError(null);
    setDialogOpen(true);
  }

  async function uploadFile(file: File) {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be less than 5MB");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      const result = await res.json();

      if (!res.ok) {
        const details =
          typeof result?.details === "string" && result.details.trim()
            ? ` - ${result.details}`
            : "";
        throw new Error(
          `${result.error || `Upload failed (HTTP ${res.status})`}${details}`,
        );
      }

      setFormData((prev) => ({ ...prev, image_src: result.url }));
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  function removeImage() {
    setFormData((prev) => ({ ...prev, image_src: "" }));
    setUploadError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const method = editingProject ? "PUT" : "POST";
      const body = editingProject
        ? { id: editingProject.id, ...formData }
        : formData;

      const res = await fetch("/api/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      console.log("API Response status:", res.status, res.statusText);

      let result;
      try {
        result = await res.json();
      } catch (parseError) {
        console.error("Failed to parse response:", parseError);
        result = { error: `HTTP ${res.status}: ${res.statusText}` };
      }

      if (!res.ok) {
        console.error("API Error:", result, "Status:", res.status);
        throw new Error(
          result.error || `${method} failed with status ${res.status}`,
        );
      }

      setDialogOpen(false);
      setFormData({
        title: "",
        description: "",
        image_src: "",
        github_url: "",
        demo_url: "",
        date: "",
      });
      await fetchProjects();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      alert(
        `Failed to ${editingProject ? "update" : "add"} project: ${errorMessage}`,
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch("/api/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      await fetchProjects();
    } catch (err) {
      alert("Failed to delete project");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Projects</h2>
          <p className="text-muted-foreground">
            Manage your portfolio projects
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-125">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingProject ? "Edit Project" : "Add New Project"}
                </DialogTitle>
                <DialogDescription>
                  {editingProject
                    ? "Update the project details below."
                    : "Add a new project to your portfolio."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="My Awesome Project"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="A brief description of the project..."
                    rows={4}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="github_url">GitHub URL (optional)</Label>
                  <Input
                    id="github_url"
                    type="url"
                    value={formData.github_url}
                    onChange={(e) =>
                      setFormData({ ...formData, github_url: e.target.value })
                    }
                    placeholder="https://github.com/username/repo"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="demo_url">Demo URL (optional)</Label>
                  <Input
                    id="demo_url"
                    type="url"
                    value={formData.demo_url}
                    onChange={(e) =>
                      setFormData({ ...formData, demo_url: e.target.value })
                    }
                    placeholder="https://example.com"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date">Date (optional)</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Project Image</Label>

                  {/* Image Preview */}
                  {formData.image_src && isValidImageUrl(formData.image_src) ? (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border bg-muted">
                      <Image
                        src={formData.image_src}
                        alt="Project preview"
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={removeImage}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className={`flex flex-col items-center justify-center w-full h-40 rounded-lg border-2 border-dashed transition-colors cursor-pointer ${
                        isDragging
                          ? "border-primary bg-primary/10"
                          : "border-muted-foreground/25 hover:border-muted-foreground/50 bg-muted/50"
                      }`}
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}>
                      {uploading ? (
                        <>
                          <Loader2 className="h-10 w-10 text-muted-foreground mb-2 animate-spin" />
                          <p className="text-sm text-muted-foreground">
                            Uploading...
                          </p>
                        </>
                      ) : isDragging ? (
                        <>
                          <Upload className="h-10 w-10 text-primary mb-2" />
                          <p className="text-sm text-primary">
                            Drop image here
                          </p>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Drag & drop or click to upload
                          </p>
                          <p className="text-xs text-muted-foreground/75 mt-1">
                            PNG, JPG, WebP up to 5MB
                          </p>
                        </>
                      )}
                    </div>
                  )}

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />

                  {/* Upload Button */}
                  {(!formData.image_src ||
                    !isValidImageUrl(formData.image_src)) && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="w-full">
                      {uploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Choose Image
                        </>
                      )}
                    </Button>
                  )}

                  {/* Error Message */}
                  {uploadError && (
                    <p className="text-sm text-destructive">{uploadError}</p>
                  )}

                  {/* Manual URL Input (optional) */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Or paste URL:</span>
                      <Input
                        value={formData.image_src}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            image_src: e.target.value,
                          })
                        }
                        placeholder="https://example.com/image.jpg"
                        className={`h-8 text-xs ${formData.image_src && !isValidImageUrl(formData.image_src) ? "border-destructive" : ""}`}
                      />
                    </div>
                    {formData.image_src &&
                      !isValidImageUrl(formData.image_src) && (
                        <p className="text-xs text-destructive">
                          Please enter a valid URL (https://...)
                        </p>
                      )}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  disabled={submitting}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : editingProject ? (
                    "Update"
                  ) : (
                    "Add"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Projects Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
          <CardDescription>
            A list of all projects in your portfolio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No projects yet. Add your first project to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Preview</TableHead>
                  <TableHead>GitHub</TableHead>
                  <TableHead>Demo</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">
                      {project.title}
                    </TableCell>
                    <TableCell className="max-w-75 truncate">
                      {project.description || (
                        <span className="text-muted-foreground italic">
                          No description
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {project.image_src &&
                      isValidImageUrl(project.image_src) ? (
                        <div className="relative w-auto h-20 rounded-md overflow-hidden border border-border">
                          <Image
                            src={project.image_src}
                            alt={project.title}
                            fill
                            className="object-cover hover:opacity-75 transition-opacity cursor-pointer"
                            onClick={() =>
                              window.open(project.image_src, "_blank")
                            }
                          />
                        </div>
                      ) : (
                        <Badge variant="outline">No Image</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {project.github_url ? (
                        <a
                          href={project.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline">
                          <Badge variant="secondary" className="cursor-pointer">
                            GitHub
                          </Badge>
                        </a>
                      ) : (
                        <Badge variant="outline">—</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {project.demo_url ? (
                        <a
                          href={project.demo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline">
                          <Badge variant="secondary" className="cursor-pointer">
                            Live
                          </Badge>
                        </a>
                      ) : (
                        <Badge variant="outline">—</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {project.date
                        ? new Date(project.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon-sm"
                              onClick={() => openEditDialog(project)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit Project</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="destructive"
                              size="icon-sm"
                              onClick={() => handleDelete(project.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Delete Project</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
