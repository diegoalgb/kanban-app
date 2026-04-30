'use client';

import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { KanbanCard } from './KanbanCard';
import { type ColumnType } from './Board';

interface ColumnProps {
  column: ColumnType;
  onAddCard: (columnId: string, title: string) => void;
  onDeleteCard: (columnId: string, cardId: string) => void;
}

export function Column({ column, onAddCard, onDeleteCard }: ColumnProps) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState('');

  const { setNodeRef } = useDroppable({ id: column.id });

  function handleAdd() {
    if (title.trim()) {
      onAddCard(column.id, title.trim());
      setTitle('');
      setAdding(false);
    }
  }

  return (
    <div className="flex flex-col w-72 bg-muted rounded-lg p-3 shrink-0">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="font-semibold text-sm">{column.title}</h2>
        <span className="text-xs text-muted-foreground">{column.cards.length}</span>
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
          <Plus className="h-4 w-4 mr-1" />
          Add card
        </Button>
      )}
    </div>
  );
}
