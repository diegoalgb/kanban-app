'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { Column } from './Column';

export type Card = { id: string; title: string };
export type ColumnType = { id: string; title: string; cards: Card[] };

const initial: ColumnType[] = [
  {
    id: 'todo',
    title: 'To Do',
    cards: [
      { id: 'c1', title: 'Design landing page' },
      { id: 'c2', title: 'Set up CI/CD pipeline' },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    cards: [{ id: 'c3', title: 'Build kanban board' }],
  },
  {
    id: 'done',
    title: 'Done',
    cards: [{ id: 'c4', title: 'Project setup' }],
  },
];

export function Board() {
  const [columns, setColumns] = useState<ColumnType[]>(initial);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  function addCard(columnId: string, title: string) {
    setColumns(cols =>
      cols.map(col =>
        col.id === columnId
          ? { ...col, cards: [...col.cards, { id: crypto.randomUUID(), title }] }
          : col
      )
    );
  }

  function deleteCard(columnId: string, cardId: string) {
    setColumns(cols =>
      cols.map(col =>
        col.id === columnId
          ? { ...col, cards: col.cards.filter(c => c.id !== cardId) }
          : col
      )
    );
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const sourceCol = columns.find(col => col.cards.some(c => c.id === activeId));
    if (!sourceCol) return;

    const targetCol =
      columns.find(col => col.id === overId) ??
      columns.find(col => col.cards.some(c => c.id === overId));
    if (!targetCol) return;

    const card = sourceCol.cards.find(c => c.id === activeId)!;

    setColumns(cols => {
      if (sourceCol.id === targetCol.id) {
        const fromIdx = sourceCol.cards.findIndex(c => c.id === activeId);
        const toIdx = sourceCol.cards.findIndex(c => c.id === overId);
        if (toIdx === -1) return cols;
        return cols.map(col =>
          col.id === sourceCol.id
            ? { ...col, cards: arrayMove(col.cards, fromIdx, toIdx) }
            : col
        );
      }

      return cols.map(col => {
        if (col.id === sourceCol.id) {
          return { ...col, cards: col.cards.filter(c => c.id !== activeId) };
        }
        if (col.id === targetCol.id) {
          const cards = [...col.cards];
          const overIdx = cards.findIndex(c => c.id === overId);
          overIdx === -1 ? cards.push(card) : cards.splice(overIdx, 0, card);
          return { ...col, cards };
        }
        return col;
      });
    });
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={onDragEnd}>
      {/* Horizontal padding is managed by the page wrapper; board only handles
          column layout and the gap between them. */}
      <div className="flex gap-4 items-start">
        {columns.map(col => (
          <Column key={col.id} column={col} onAddCard={addCard} onDeleteCard={deleteCard} />
        ))}
      </div>
    </DndContext>
  );
}
