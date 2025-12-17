import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { ImageFormat } from '../../types';

// --- Tool 1: Image Converter ---
export const ImageConverter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<ImageFormat>(ImageFormat.PNG);
  const [preview, setPreview] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const convertImage = () => {
    if (!file || !canvasRef.current) return;
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx && canvasRef.current) {
        canvasRef.current.width = img.width;
        canvasRef.current.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        const dataUrl = canvasRef.current.toDataURL(format);
        const link = document.createElement('a');
        link.download = `converted-image.${format.split('/')[1]}`;
        link.href = dataUrl;
        link.click();
      }
    };
  };

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-navy-700 file:text-gold-400 hover:file:bg-navy-800"/>
      {preview && <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg border border-navy-700" />}
      <div className="flex gap-2">
        <select 
          value={format} 
          onChange={(e) => setFormat(e.target.value as ImageFormat)}
          className="bg-navy-700 text-white p-2 rounded border border-navy-600 focus:border-gold-400 outline-none"
        >
          <option value={ImageFormat.PNG}>PNG</option>
          <option value={ImageFormat.JPEG}>JPEG</option>
          <option value={ImageFormat.WEBP}>WEBP</option>
        </select>
        <Button onClick={convertImage} disabled={!file}>Convert & Download</Button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

// --- Tool 2: Image Compressor ---
export const ImageCompressor: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.8);
  const [compressedInfo, setCompressedInfo] = useState<string>('');

  const handleCompress = () => {
    if (!file) return;
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
            setCompressedInfo(`Original: ${(file.size / 1024).toFixed(2)}KB | Compressed: ${(blob.size / 1024).toFixed(2)}KB`);
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `compressed-${file.name}`;
            link.click();
        }
      }, 'image/jpeg', quality);
    };
  };

  return (
    <div className="space-y-4">
      <input type="file" accept="image/*" onChange={(e) => e.target.files && setFile(e.target.files[0])} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-navy-700 file:text-gold-400"/>
      <div className="flex items-center gap-4">
        <label>Quality: {Math.round(quality * 100)}%</label>
        <input 
          type="range" min="0.1" max="1" step="0.1" 
          value={quality} 
          onChange={(e) => setQuality(parseFloat(e.target.value))}
          className="accent-gold-400 w-full"
        />
      </div>
      <Button onClick={handleCompress} disabled={!file}>Compress Image</Button>
      {compressedInfo && <p className="text-sm text-gold-400">{compressedInfo}</p>}
    </div>
  );
};

// --- Tool 3: Image Cropper (Simplified) ---
export const ImageCropper: React.FC = () => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files?.[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => setImageSrc(ev.target?.result as string);
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    // Effect to draw image on canvas
    useEffect(() => {
        if(imageSrc && canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            const img = new Image();
            img.src = imageSrc;
            img.onload = () => {
                if(canvasRef.current) {
                    // Limit max width for display
                    const maxWidth = 500;
                    const scale = maxWidth / img.width;
                    canvasRef.current.width = maxWidth;
                    canvasRef.current.height = img.height * scale;
                    ctx?.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
                }
            }
        }
    }, [imageSrc]);

    const handleMouseDown = (e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if(rect) {
            setStartPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            setCurrentPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            setIsDragging(true);
        }
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if(!isDragging) return;
        const rect = canvasRef.current?.getBoundingClientRect();
        if(rect) {
            setCurrentPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            // Redraw image and rect
            const ctx = canvasRef.current?.getContext('2d');
            const img = new Image();
            img.src = imageSrc!;
            if(canvasRef.current && ctx) {
                 ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
                 ctx.strokeStyle = '#FFD700';
                 ctx.lineWidth = 2;
                 ctx.strokeRect(startPos.x, startPos.y, currentPos.x - startPos.x, currentPos.y - startPos.y);
            }
        }
    }

    const handleMouseUp = () => setIsDragging(false);

    const cropAndExport = () => {
        if(!canvasRef.current || !imageSrc) return;
        const width = currentPos.x - startPos.x;
        const height = currentPos.y - startPos.y;
        
        if (width === 0 || height === 0) return;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = Math.abs(width);
        tempCanvas.height = Math.abs(height);
        const ctx = tempCanvas.getContext('2d');
        
        const sourceCanvas = canvasRef.current;
        
        ctx?.drawImage(sourceCanvas, 
            Math.min(startPos.x, currentPos.x), Math.min(startPos.y, currentPos.y), 
            Math.abs(width), Math.abs(height), 
            0, 0, Math.abs(width), Math.abs(height)
        );

        const url = tempCanvas.toDataURL();
        const link = document.createElement('a');
        link.href = url;
        link.download = 'cropped.png';
        link.click();
    }

    return (
        <div className="space-y-4">
             <input type="file" accept="image/*" onChange={handleFile} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-navy-700 file:text-gold-400"/>
             <p className="text-xs text-gray-400">Click and drag on the image to select crop area.</p>
             <canvas 
                ref={canvasRef} 
                className="border border-navy-700 cursor-crosshair max-w-full"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
             />
             <Button onClick={cropAndExport} disabled={!imageSrc}>Crop & Download</Button>
        </div>
    )
}
