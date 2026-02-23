import React, { useRef, useEffect, useCallback } from 'react';
import type { MapEntity, Asset } from '@hvsv3/shared';
import { canvasToGrid, clamp } from '../../lib/geometry.ts';

interface MapCanvasProps {
  cols: number;
  rows: number;
  entities: MapEntity[];
  assets: Asset[];
  selectedEntityIdx: number | null;
  onPlaceEntity: (x: number, y: number) => void;
  onSelectEntity: (idx: number | null) => void;
  onMoveEntity: (idx: number, x: number, y: number) => void;
}

const CELL = 40;

function getAsset(assets: Asset[], id: string): Asset | undefined {
  return assets.find((a) => a.id === id);
}

export default function MapCanvas({
  cols,
  rows,
  entities,
  assets,
  selectedEntityIdx,
  onPlaceEntity,
  onSelectEntity,
  onMoveEntity,
}: MapCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dragging = useRef<{ idx: number; offsetX: number; offsetY: number } | null>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = cols * CELL;
    const H = rows * CELL;
    canvas.width = W;
    canvas.height = H;

    // Background
    ctx.fillStyle = '#1e2130';
    ctx.fillRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= cols; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL, 0);
      ctx.lineTo(x * CELL, H);
      ctx.stroke();
    }
    for (let y = 0; y <= rows; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL);
      ctx.lineTo(W, y * CELL);
      ctx.stroke();
    }

    // Entities
    entities.forEach((ent, idx) => {
      const cx = ent.x * CELL + CELL / 2;
      const cy = ent.y * CELL + CELL / 2;
      const asset = getAsset(assets, ent.assetId);
      const isSelected = idx === selectedEntityIdx;

      // Selection ring
      if (isSelected) {
        ctx.strokeStyle = '#6c63ff';
        ctx.lineWidth = 2;
        ctx.strokeRect(ent.x * CELL + 1, ent.y * CELL + 1, CELL - 2, CELL - 2);
      }

      // Kind-based background
      if (ent.meta?.kind === 'spawn') {
        ctx.fillStyle = 'rgba(34,197,94,0.25)';
        ctx.fillRect(ent.x * CELL, ent.y * CELL, CELL, CELL);
      } else if (ent.meta?.kind === 'pen') {
        ctx.fillStyle = 'rgba(239,68,68,0.25)';
        ctx.fillRect(ent.x * CELL, ent.y * CELL, CELL, CELL);
      } else if (ent.meta?.kind === 'pathNode') {
        ctx.fillStyle = 'rgba(0,212,255,0.2)';
        ctx.fillRect(ent.x * CELL, ent.y * CELL, CELL, CELL);
      }

      // Emoji / text
      const emoji = asset?.emoji ?? '?';
      ctx.font = `${Math.round(CELL * 0.55)}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      ctx.fillText(emoji, cx, cy);
    });
  }, [cols, rows, entities, assets, selectedEntityIdx]);

  useEffect(() => {
    draw();
  }, [draw]);

  function getGridPos(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleX = (cols * CELL) / rect.width;
    const scaleY = (rows * CELL) / rect.height;
    const px = (e.clientX - rect.left) * scaleX;
    const py = (e.clientY - rect.top) * scaleY;
    const gx = clamp(canvasToGrid(px, CELL), 0, cols - 1);
    const gy = clamp(canvasToGrid(py, CELL), 0, rows - 1);
    return { gx, gy };
  }

  function findEntityAt(gx: number, gy: number): number | null {
    for (let i = entities.length - 1; i >= 0; i--) {
      if (entities[i].x === gx && entities[i].y === gy) return i;
    }
    return null;
  }

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    const { gx, gy } = getGridPos(e);
    const hit = findEntityAt(gx, gy);
    if (hit !== null) {
      onSelectEntity(hit);
      dragging.current = { idx: hit, offsetX: 0, offsetY: 0 };
    } else {
      onSelectEntity(null);
      onPlaceEntity(gx, gy);
    }
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!dragging.current) return;
    const { gx, gy } = getGridPos(e);
    onMoveEntity(dragging.current.idx, gx, gy);
  }

  function handleMouseUp() {
    dragging.current = null;
  }

  return (
    <div style={{ overflowX: 'auto', overflowY: 'auto', border: '1px solid var(--border)', borderRadius: 8, maxHeight: 600 }}>
      <canvas
        ref={canvasRef}
        style={{ display: 'block', cursor: 'crosshair', maxWidth: '100%' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
}
