'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Card } from './Board';

interface KanbanCardProps {
  card: Card;
  onDelete: () => void;
}

export function KanbanCard({ card, onDelete }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-background rounded-md p-3 shadow-sm flex items-start justify-between gap-2 group cursor-grab active:cursor-grabbing"
    >
      <span className="text-sm leading-snug">{card.title}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 -mr-1 -mt-0.5"
        onPointerDown={e => e.stopPropagation()}
        onClick={e => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
