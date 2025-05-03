
import React, { useState, useRef } from 'react';
import { Upload, X, Play, RefreshCcw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  onAnalyzeClick: () => void;
  onReset: () => void;
  isProcessing: boolean;
  hasResults: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelected, 
  onAnalyzeClick,
  onReset,
  isProcessing,
  hasResults
}) => {
  const { toast } = useToast();
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file: File) => {
    // Check if file is a video
    if (!file.type.startsWith('video/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a video file",
        variant: "destructive"
      });
      return;
    }
    
    // Check file size (limit to 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a video smaller than 100MB",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedFile(file);
    onFileSelected(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    
    validateAndSetFile(files[0]);
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onReset();
  };

  return (
    <div className="w-full">
      {selectedFile ? (
        <div className="relative rounded-lg border p-4 flex flex-col items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-2 right-2" 
            onClick={clearSelectedFile}
          >
            <X size={18} />
          </Button>
          <video 
            className="max-h-64 rounded-md" 
            src={URL.createObjectURL(selectedFile)} 
            controls 
          />
          <div className="mt-2 text-sm">
            <span className="font-medium">{selectedFile.name}</span>
            <span className="text-muted-foreground ml-2">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>
          
          <div className="flex gap-3 mt-4 w-full justify-center">
            <Button 
              onClick={onAnalyzeClick}
              disabled={isProcessing}
              className="w-1/2"
            >
              <Play size={16} />
              Analyze
            </Button>
            <Button 
              onClick={clearSelectedFile}
              variant="outline"
              className="w-1/2"
            >
              <RefreshCcw size={16} />
              Reset
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors ${
            isDragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/20'
          } cursor-pointer`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={48} className="text-muted-foreground mb-4" />
          <div className="text-center">
            <p className="text-lg font-medium">Upload a video clip</p>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Drag & drop or click to select a video file
            </p>
            <Button>
              Select Video
              <input 
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="video/*"
                onChange={handleFileChange}
              />
            </Button>
          </div>
        </div>
      )}

      {hasResults && (
        <div className="mt-4">
          <Button 
            variant="outline" 
            onClick={clearSelectedFile} 
            className="w-full"
          >
            <RefreshCcw size={16} className="mr-2" />
            Analyze Another Video
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
