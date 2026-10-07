'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { RotateCcw, Check, Type, PenTool } from 'lucide-react';

interface SignaturePadProps {
  onSignatureCapture: (dataUrl: string, typedName?: string) => void;
  disabled?: boolean;
}

export function SignaturePad({ onSignatureCapture, disabled }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [useTypedFallback, setUseTypedFallback] = useState(false);
  const [typedName, setTypedName] = useState('');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-dpi crisp canvas
    const ratio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * ratio;
    canvas.height = rect.height * ratio;
    ctx.scale(ratio, ratio);

    ctx.strokeStyle = '#1D2421';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, [useTypedFallback]);

  function getCoordinates(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (disabled || useTypedFallback) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.setPointerCapture(e.pointerId);
    setIsDrawing(true);
    setHasDrawn(true);

    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing || disabled || useTypedFallback) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function handlePointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.releasePointerCapture(e.pointerId);

    const dataUrl = canvas.toDataURL('image/png');
    onSignatureCapture(dataUrl);
  }

  function handleClear() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    onSignatureCapture('');
  }

  function handleTypedChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setTypedName(val);
    setHasDrawn(val.trim().length > 1);
    onSignatureCapture('', val);
  }

  return (
    <div className="space-y-3 font-sans select-none">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-text-secondary uppercase tracking-wider">
          Recipient Signature
        </span>
        <button
          type="button"
          onClick={() => {
            setUseTypedFallback(!useTypedFallback);
            handleClear();
          }}
          className="text-primary hover:underline text-[11px] font-medium flex items-center gap-1"
        >
          {useTypedFallback ? (
            <>
              <PenTool className="w-3 h-3" />
              <span>Switch to draw signature</span>
            </>
          ) : (
            <>
              <Type className="w-3 h-3" />
              <span>Can't draw? Type signature</span>
            </>
          )}
        </button>
      </div>

      {useTypedFallback ? (
        <div className="p-4 bg-surface rounded border border-border space-y-2">
          <input
            type="text"
            placeholder="Type recipient legal full name..."
            value={typedName}
            onChange={handleTypedChange}
            className="w-full bg-surface-elevated border border-border-strong rounded p-3 text-sm text-ink focus:outline-none focus:border-primary font-serif italic"
          />
          <p className="text-[11px] text-text-muted">
            Legal electronic typed acknowledgment of physical delivery custody.
          </p>
        </div>
      ) : (
        <div className="relative">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="w-full h-36 bg-surface-elevated rounded border border-border-strong touch-none cursor-crosshair shadow-inner"
          />

          {!hasDrawn && (
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-text-muted text-xs">
              <PenTool className="w-5 h-5 mb-1 opacity-40" />
              <span>Sign on the line above using finger or stylus</span>
            </div>
          )}

          {hasDrawn && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute bottom-2 right-2 px-2.5 py-1 bg-surface/90 hover:bg-surface-sunken border border-border rounded text-[11px] font-medium text-text-secondary flex items-center gap-1 shadow-sm"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
