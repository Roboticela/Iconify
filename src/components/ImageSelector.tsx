"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Image as ImageIcon, X } from "lucide-react";

interface ImageSelectorProps {
  selectedImage?: string | null;
  onImageSelect?: (image: string | null) => void;
}

export default function ImageSelector({ selectedImage, onImageSelect }: ImageSelectorProps) {
  const [preview, setPreview] = useState<string | null>(selectedImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onImageSelect?.(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onImageSelect?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-full w-full bg-card/40 backdrop-blur-md rounded-xl transition-all duration-300 ease-in-out overflow-hidden flex flex-col p-4 min-h-0"
    >
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Image Selector
        </h3>
      </div>

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 bg-accent/20 transition-colors min-h-0 overflow-hidden cursor-pointer ${
          isDragging ? "bg-accent/40 border-primary" : "hover:bg-accent/30"
        }`}
      >
        {preview ? (
          <div className="relative w-full h-full flex items-center justify-center min-h-0 overflow-hidden">
            <img
              src={preview}
              alt="Selected"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-card/90 backdrop-blur-sm border border-border hover:bg-accent transition-colors z-10"
              aria-label="Remove image"
            >
              <X className="w-4 h-4 text-foreground" />
            </motion.button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 flex-shrink-0">
            <Upload className="w-12 h-12 text-foreground/50" />
            <div className="text-center">
              <p className="text-sm text-foreground/70 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-foreground/50">
                PNG, JPG, SVG up to 10MB
              </p>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </motion.div>
  );
}
