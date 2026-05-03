import { Board } from '@/components/kanban/Board';

// The outer wrapper owns all horizontal padding so content never touches the
// viewport edges. max-w-screen-xl prevents the board from stretching too wide
// on large monitors.
export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <header className="border-b px-6 md:px-12 lg:px-16 py-4">
        <div className="mx-auto max-w-screen-xl">
          <h1 className="text-xl font-bold text-foreground tracking-tight">Kanban Board</h1>
        </div>
      </header>
      <div className="px-6 md:px-12 lg:px-16 py-6">
        <div className="mx-auto max-w-screen-xl">
          <Board />
        </div>
      </div>
    </main>
  );
}
