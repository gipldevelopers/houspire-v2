// src/components/forms/StyleForm.js
"use client";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  X,
  Upload,
  Image,
  Tag,
  Palette,
  CheckCircle2,
  Plus,
  AlertCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { styleSchema } from "@/lib/validations/style";

const categories = [
  { value: "MODERN", label: "Modern" },
  { value: "FUSION", label: "Fusion" },
  { value: "CLASSIC", label: "Classic" },
  { value: "INDIAN", label: "Indian" },
];

export default function StyleForm({
  initialData = null,
  onSubmit,
  isSubmitting = false,
  submitButtonText = "Create Style",
  showDeleteButton = false,
  onDelete,
  getImageUrl 
}) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    setError,
    clearErrors,
    trigger,
  } = useForm({
    resolver: zodResolver(styleSchema),
    mode: "onChange",
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      popularity: initialData?.popularity || 50,
      isActive: initialData?.isActive !== undefined ? initialData.isActive : true,
      tags: initialData?.tags || [],
      characteristics: initialData?.characteristics || [],
      imageUrl: initialData?.imageUrl || "",
    },
  });

  const watchedValues = watch();
  const tags = watch("tags") || [];
  const characteristics = watch("characteristics") || [];

  // Initialize form with initial data
  useEffect(() => {
    if (initialData) {
      setPreviewUrl(initialData.imageUrl || null);
    }
  }, [initialData]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("imageUrl", {
          message: "Please select an image file (JPEG, PNG, etc.)",
        });
        return;
      }

      if (file.size > 20 * 1024 * 1024) {
        setError("imageUrl", { message: "File size must be less than 20MB" });
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      setSelectedFile(file);
      setValue("imageUrl", objectUrl, { shouldValidate: true });
      clearErrors("imageUrl");
    }
  };

  const addTag = () => {
    const currentTag = watchedValues.currentTag || "";
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      const newTags = [...tags, currentTag.trim()];
      setValue("tags", newTags, { shouldValidate: true });
      setValue("currentTag", "");
      trigger("tags");
    }
  };

  const removeTag = (tagToRemove) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setValue("tags", newTags, { shouldValidate: true });
    trigger("tags");
  };

  const addCharacteristic = () => {
    const currentCharacteristic = watchedValues.currentCharacteristic || "";
    if (
      currentCharacteristic.trim() &&
      !characteristics.includes(currentCharacteristic.trim())
    ) {
      const newCharacteristics = [
        ...characteristics,
        currentCharacteristic.trim(),
      ];
      setValue("characteristics", newCharacteristics, { shouldValidate: true });
      setValue("currentCharacteristic", "");
      trigger("characteristics");
    }
  };

  const removeCharacteristic = (charToRemove) => {
    const newCharacteristics = characteristics.filter(
      (char) => char !== charToRemove
    );
    setValue("characteristics", newCharacteristics, { shouldValidate: true });
    trigger("characteristics");
  };

  const handleKeyPress = (e, type) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (type === "tag") addTag();
      if (type === "characteristic") addCharacteristic();
    }
  };

const onFormSubmit = (data) => {
  // ✅ Make sure isActive is included
  const submitData = {
    ...data,
    isActive: data.isActive !== undefined ? data.isActive : true,
    imageUrl: previewUrl,
    ...(selectedFile && { file: selectedFile }),
  };
  
  onSubmit(submitData);
};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Form */}
      <div className="lg:col-span-2 space-y-6">
        {/* Basic Information */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Enter the basic details for the design style
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Style Name *
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  className={
                    errors.name ? "border-red-500 focus:border-red-500" : ""
                  }
                  placeholder="e.g., Scandinavian, Modern, Bohemian"
                />
                {errors.name && (
                  <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category *
                </Label>
                <Select
                  value={watchedValues.category}
                  onValueChange={(value) =>
                    setValue("category", value, { shouldValidate: true })
                  }
                >
                  <SelectTrigger
                    className={
                      errors.category
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description *
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                className={
                  errors.description
                    ? "border-red-500 focus:border-red-500"
                    : ""
                }
                placeholder="Describe the design style, its key features, and appeal..."
                rows={4}
              />
              {errors.description && (
                <p className="text-red-600 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="popularity" className="text-sm font-medium">
                Popularity: {watchedValues.popularity}%
              </Label>
              <Input
                id="popularity"
                type="range"
                min="0"
                max="100"
                {...register("popularity", { valueAsNumber: true })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Style Image */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="w-5 h-5" />
              Style Image *
            </CardTitle>
            <CardDescription>
              Upload a representative image for this design style
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors min-h-[200px] flex items-center justify-center"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
                {previewUrl || initialData?.imageUrl ? (
                  <div className="space-y-4 w-full">
                     <img
                      src={previewUrl || (getImageUrl && getImageUrl(initialData?.imageUrl)) || initialData?.imageUrl}
                      alt="Style preview"
                      className="max-h-48 mx-auto rounded-lg object-cover shadow-lg"
                    />
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">
                        {selectedFile?.name || "Current image"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Click to change image
                      </p>
                    </div>
                  </div>
                ) : (
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-lg">
                      Click to upload style image
                    </p>
                    <p className="text-muted-foreground mt-2">
                      Recommended: 800x600px or larger
                    </p>
                  </div>
                </div>
              )}
            </div>
            {errors.imageUrl && (
              <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.imageUrl.message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Tags */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Tags *
            </CardTitle>
            <CardDescription>
              Add relevant tags to help users discover this style
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={watchedValues.currentTag || ""}
                onChange={(e) => setValue("currentTag", e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, "tag")}
                placeholder="Add a tag (e.g., Minimal, Cozy, Modern)"
                className="flex-1"
              />
              <Button
                onClick={addTag}
                disabled={!watchedValues.currentTag?.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    {tag}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            )}
            {errors.tags && (
              <p className="text-red-600 text-xs flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.tags.message}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Characteristics */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Key Characteristics *</CardTitle>
            <CardDescription>
              List the main features and characteristics of this style
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={watchedValues.currentCharacteristic || ""}
                onChange={(e) =>
                  setValue("currentCharacteristic", e.target.value)
                }
                onKeyPress={(e) => handleKeyPress(e, "characteristic")}
                placeholder="Add a characteristic (e.g., Clean Lines, Natural Materials)"
                className="flex-1"
              />
              <Button
                onClick={addCharacteristic}
                disabled={!watchedValues.currentCharacteristic?.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {characteristics.length > 0 && (
              <div className="space-y-2">
                {characteristics.map((char, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted rounded-lg"
                  >
                    <span className="text-sm">{char}</span>
                    <X
                      className="w-4 h-4 cursor-pointer text-muted-foreground"
                      onClick={() => removeCharacteristic(char)}
                    />
                  </div>
                ))}
              </div>
            )}
            {errors.characteristics && (
              <p className="text-red-600 text-xs flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.characteristics.message}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Settings */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="isActive" className="text-sm font-medium">
              Status
            </Label>
            <Select
              value={watchedValues.isActive !== undefined ? (watchedValues.isActive ? "true" : "false") : "true"}
              onValueChange={(value) => {
                setValue("isActive", value === "true", { shouldValidate: true });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

     
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Style Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium text-foreground">
                  {watchedValues.name || "Not set"}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-medium text-foreground">
                  {watchedValues.category
                    ? categories.find((c) => c.value === watchedValues.category)
                        ?.label
                    : "Not set"}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Tags:</span>
                <span className="font-medium text-foreground">
                  {tags.length} added
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Characteristics:</span>
                <span className="font-medium text-foreground">
                  {characteristics.length} added
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Image:</span>
                <span className="font-medium text-foreground">
                  {previewUrl ? "Uploaded" : "Not set"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Save Style</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={handleSubmit(onFormSubmit)}
              disabled={isSubmitting || Object.keys(errors).length > 0}
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  {submitButtonText}...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  {submitButtonText}
                </>
              )}
            </Button>

            {showDeleteButton && onDelete && (
              <Button
                variant="outline"
                onClick={onDelete}
                disabled={isSubmitting}
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Delete Style
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
