"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { usePromptContext } from "@/lib/prompt-context";

interface MaskPainterProps {
  sourceImage: string;
  onMaskChange: (maskDataUrl: string) => void;
}

export function MaskPainter({ sourceImage, onMaskChange }: MaskPainterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(30);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 512, height: 512 });
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Load the source image
  useEffect(() => {
    if (!sourceImage) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageRef.current = img;

      // Calculate canvas size maintaining aspect ratio
      const maxWidth = 512;
      const maxHeight = 512;
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      setCanvasSize({ width: Math.round(width), height: Math.round(height) });
      setImageLoaded(true);
    };
    img.src = sourceImage;
  }, [sourceImage]);

  // Initialize canvas with the image
  useEffect(() => {
    if (!imageLoaded || !canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Draw the source image
    ctx.drawImage(imageRef.current, 0, 0, canvasSize.width, canvasSize.height);
  }, [imageLoaded, canvasSize]);

  const getCoordinates = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  }, []);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const coords = getCoordinates(e);
    if (!coords) return;

    // Draw a red semi-transparent circle (will be converted to black in mask)
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.beginPath();
    ctx.arc(coords.x, coords.y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  }, [isDrawing, brushSize, getCoordinates]);

  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    draw(e);
  }, [draw]);

  const stopDrawing = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
      generateMask();
    }
  }, [isDrawing]);

  const generateMask = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a new canvas for the mask
    const maskCanvas = document.createElement("canvas");
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;
    const maskCtx = maskCanvas.getContext("2d");
    if (!maskCtx) return;

    // Get the original canvas data
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Create mask: red areas become black (edit), everything else white (keep)
    const maskImageData = maskCtx.createImageData(canvas.width, canvas.height);
    const maskData = maskImageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Check if this pixel is part of the red painted area
      // Red overlay has high R, low G, low B
      const isRedArea = r > 150 && g < 100 && b < 100;

      if (isRedArea) {
        // Black = area to edit
        maskData[i] = 0;
        maskData[i + 1] = 0;
        maskData[i + 2] = 0;
        maskData[i + 3] = 255;
      } else {
        // White = area to keep
        maskData[i] = 255;
        maskData[i + 1] = 255;
        maskData[i + 2] = 255;
        maskData[i + 3] = 255;
      }
    }

    maskCtx.putImageData(maskImageData, 0, 0);
    const maskDataUrl = maskCanvas.toDataURL("image/png");
    onMaskChange(maskDataUrl);
  }, [onMaskChange]);

  const clearMask = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !imageRef.current) return;

    // Redraw the original image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(imageRef.current, 0, 0, canvasSize.width, canvasSize.height);
    onMaskChange("");
  }, [canvasSize, onMaskChange]);

  if (!sourceImage) {
    return (
      <div className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-8 text-center">
        <p className="text-zinc-500 dark:text-zinc-400">
          Upload an image first to paint the areas you want to edit
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Brush Size: {brushSize}px
          </label>
          <input
            type="range"
            min="5"
            max="100"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-32 accent-[#998748]"
          />
        </div>
        <button
          onClick={clearMask}
          className="px-3 py-1.5 text-sm bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 rounded-lg transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="relative border border-zinc-300 dark:border-zinc-700 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="cursor-crosshair touch-none"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>

      <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center">
        Paint over the areas you want to edit (shown in red). These areas will be regenerated based on your prompt.
      </p>
    </div>
  );
}
