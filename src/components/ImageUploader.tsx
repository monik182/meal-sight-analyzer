'use client';
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Camera, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
}

export const ImageUploader = ({ onImageSelected }: ImageUploaderProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please select an image file."
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result as string);
      onImageSelected(file);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*';
      fileInputRef.current.capture = 'environment';
      fileInputRef.current.click();
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*';
      fileInputRef.current.removeAttribute('capture');
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-4">
      <input 
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
        accept="image/*"
      />

      {previewImage ? (
        <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden bg-gray-50 shadow-sm">
          <img 
            src={previewImage} 
            alt="Food preview" 
            className="w-full h-full object-cover" 
          />
        </div>
      ) : (
        <div className="w-full max-w-md aspect-square border border-dashed rounded-2xl flex flex-col items-center justify-center bg-gray-50">
          <div className="p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-macrolens-primary-light mb-4">
              <Camera className="h-8 w-8 text-macrolens-primary" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Take or upload a food photo</h3>
            <p className="mt-1 text-sm text-gray-500">PNG, JPG or HEIC up to 10MB</p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        <Button 
          onClick={handleCameraClick}
          className="flex-1 bg-macrolens-primary hover:bg-macrolens-primary/90 flex gap-2 items-center justify-center rounded-full"
        >
          <Camera className="w-5 h-5" />
          Take Photo
        </Button>
        <Button 
          onClick={handleUploadClick}
          variant="outline" 
          className="flex-1 border-macrolens-primary text-macrolens-primary hover:bg-macrolens-primary-light flex gap-2 items-center justify-center rounded-full"
        >
          <Upload className="w-5 h-5" />
          Upload Photo
        </Button>
      </div>
    </div>
  );
};
