'use client';
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Camera as CameraIcon, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Camera } from "react-camera-pro";
import { fileToBase64 } from '@/util';

interface ImageUploaderProps {
  onImageSelected: (base64Image: string) => void;
  onConfirmClick?: () => void;
}

export const ImageUploader = ({ onImageSelected, onConfirmClick }: ImageUploaderProps) => {
  const camera = useRef(null);
  const errorMessages = {
    noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
    permissionDenied: 'Permission denied. Please refresh and give camera permission.',
    switchCamera:
      'It is not possible to switch camera to different one because there is only one video device accessible.',
    canvas: 'Canvas is not supported.'
  }
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isFromCamera, setIsFromCamera] = useState(false);
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
    reader.onload = async () => {
      setPreviewImage(reader.result as string);
      setIsFromCamera(false);
      const base64Image = await fileToBase64(file)
      onImageSelected(base64Image);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraClick = () => {
    const photo = camera.current.takePhoto()
    setPreviewImage(photo);
    setIsFromCamera(true);
    //FIXME: fix error message, is returning flagged!
    onImageSelected(photo);
    setIsCameraOpen(false);
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*';
      fileInputRef.current.removeAttribute('capture');
      fileInputRef.current.click();
    }
  };

  const activateCamera = () => {
    setIsCameraOpen(true);
    onImageSelected('');
    setPreviewImage(null);
  };

  const onCancel = () => {
    setPreviewImage(null);
    setIsFromCamera(false);
    setIsCameraOpen(false);
    onImageSelected('');
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

      {isCameraOpen && !previewImage && (
        <div className={`relative w-full max-w-md aspect-square rounded-2xl overflow-hidden bg-gray-50 shadow-sm ${isCameraOpen ? "block" : "hidden"}`}>
          <Camera ref={camera} errorMessages={errorMessages} facingMode="environment" />
        </div>
      )}
      {previewImage && (
        <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden bg-gray-50 shadow-sm">
          <img
            src={previewImage}
            alt="Food preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}
      {!isCameraOpen && !previewImage && (
        <div className="w-full max-w-md aspect-square border border-dashed rounded-2xl flex flex-col items-center justify-center bg-gray-50">
          <div className="p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-macrolens-primary-light mb-4">
              <CameraIcon className="h-8 w-8 text-macrolens-primary" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Take or upload a food photo</h3>
            <p className="mt-1 text-sm text-gray-500">PNG, JPG or HEIC up to 10MB</p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
          {/* Take Photo / Capture button */}
          {(!previewImage && !isCameraOpen || previewImage && !isFromCamera) && (
            <Button
              onClick={() => setIsCameraOpen(true)}
              className="flex-1 bg-macrolens-primary hover:bg-macrolens-primary/90 flex gap-2 items-center justify-center rounded-full w-full"
            >
              <CameraIcon className="w-5 h-5" />
              Take Photo
            </Button>
          )} 
          {!previewImage && isCameraOpen && (
            <Button
              onClick={handleCameraClick}
              className="flex-1 bg-macrolens-primary hover:bg-macrolens-primary/90 flex gap-2 items-center justify-center rounded-full w-full"
            >
              <CameraIcon className="w-5 h-5" />
              Capture
            </Button>
          )}
          
          {/* Take another photo button - only shown when there's a preview */}
          {previewImage && isFromCamera && (
            <Button
              onClick={activateCamera}
              className="flex-1 bg-macrolens-primary hover:bg-macrolens-primary/90 flex gap-2 items-center justify-center rounded-full w-full"
            >
              <CameraIcon className="w-5 h-5" />
              Take another photo
            </Button>
          )}

          {/* Upload Photo / Upload Another Photo button */}
          <Button
            onClick={handleUploadClick}
            variant="outline"
            className="flex-1 border-macrolens-primary text-macrolens-primary hover:bg-macrolens-primary-light flex gap-2 items-center justify-center rounded-full"
          >
            <Upload className="w-5 h-5" />
            {previewImage && !isFromCamera ? "Upload Another Photo" : "Upload Photo"}
          </Button>

          {/* Confirm button - only shown when there's a preview image */}
          {onConfirmClick && previewImage && (
            <Button
              onClick={onConfirmClick}
              className="flex-1 bg-macrolens-primary hover:bg-macrolens-primary/90 flex gap-2 items-center justify-center rounded-full w-full"
            >
              Confirm
            </Button>
          )}
          {previewImage && (
            <Button
              onClick={onCancel}
              variant="outline"
              className="flex-1 border-macrolens-primary text-macrolens-primary hover:bg-macrolens-primary-light flex gap-2 items-center justify-center rounded-full"
            >
              Cancel
            </Button>
          )}
      </div>
    </div>
  );
};
