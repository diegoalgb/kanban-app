'use client';

import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KanbanCard } from './KanbanCard';
import { type ColumnType } from './Board';

interface ColumnProps {
  column: ColumnType;
  onAddCard: (columnId: string, title: string) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
}

// Saturated status colors per design guidelines — each column gets a top border
// accent and a matching title color so the three stages are visually distinct
// at a glance without needing icons or heavy decoration.
const COLUMN_ACCENT: Record<string, string> = {
  todo: 'border-t-2 border-t-blue-400',
  'in-progress': 'border-t-2 border-t-amber-400',
  done: 'border-t-2 border-t-green-400',
};

// Title color matches the accent border so the column heading reads as a label
// for the status band, not generic text.
const COLUMN_TITLE_COLOR: Record<string, string> = {
  todo: 'text-blue-400',
  'in-progress': 'text-amber-400',
  done: 'text-green-400',
};

export function Column({ column, onAddCard, onDeleteCard }: ColumnProps) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');

  const { setNodeRef } = useDroppable({ id: column.id });

  // Trim whitespace before calling up so the parent never receives blank titles.
  function handleAdd() {
    if (title.trim()) {
      onAddCard(column.id, title.trim());
      setTitle('');
      setAdding(false);
    }
  }

  return (
    // rounded-none: sharp corners per design guidelines.
    // border-border: visible boundary against the page background for contrast.
    // COLUMN_ACCENT adds the coloured 2px top border for status identification.
    <div
      className={cn(
        'flex flex-col w-72 bg-muted border border-border rounded-none p-3 shrink-0',
        COLUMN_ACCENT[column.id]
      )}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className={cn('font-semibold text-sm tracking-wide uppercase', COLUMN_TITLE_COLOR[column.id])}>
          {column.title}
        </h2>
        {/* Card count in muted tone so it's readable but subordinate to the title. */}
        <span className="text-xs text-muted-foreground font-mono">{column.cards.length}</span>
      </div>

      <div ref={setNodeRef} className="flex flex-col gap-2 min-h-[2rem]">
        <SortableContext items={column.cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {column.cards.map(card => (
            <KanbanCard
              key={card.id}
              card={card}
              onDelete={() => onDeleteCard(column.id, card.id)}
            />
          ))}
        </SortableContext>
      </div>

      {adding ? (
        <div className="mt-2 flex flex-col gap-1">
          <Input
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleAdd();
              if (e.key === 'Escape') setAdding(false);
            }}
            placeholder="Card title..."
          />
          <div className="flex gap-1">
            <Button size="sm" onClick={handleAdd}>
              Add
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setAdding(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={() => setAdding(true)}
        >
          {/* No sizing classes on icon — Button handles icon sizing via CSS. */}
          <Plus data-icon="inline-start" />
          Add card
        </Button>
      )}
    </div>
  );
}
