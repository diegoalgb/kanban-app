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

  // dnd-kit requires inline transform/transition so drag position updates happen
  // outside React's render cycle. Opacity drops to 0.4 while dragging to show
  // the "ghost" placeholder position in the column.
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    // rounded-none: sharp corners per design guidelines.
    // bg-card sits one lightness step above bg-muted (the column background)
    // to give cards clear visual separation without a shadow.
    // border-border keeps the card edge visible against the column background.
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-card border border-border rounded-none p-3 flex items-start justify-between gap-2 group cursor-grab active:cursor-grabbing"
    >
      <span className="text-sm leading-snug text-foreground">{card.title}</span>
      {/* Delete button stays invisible until hover so it doesn't compete with
          the card content. onPointerDown stops propagation to prevent the
          drag sensor from activating when the user clicks delete. */}
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 -mr-1 -mt-0.5 hover:bg-destructive/20 hover:text-destructive"
        onPointerDown={e => e.stopPropagation()}
        onClick={e => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <X data-icon="inline-start" />
      </Button>
    </div>
  );
}
