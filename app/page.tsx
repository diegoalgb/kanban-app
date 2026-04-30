import { Board } from '@/components/kanban/Board';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b px-6 py-4">
        <h1 className="text-xl font-bold">Kanban Board</h1>
      </header>
      <Board />
    </main>
  );
}
