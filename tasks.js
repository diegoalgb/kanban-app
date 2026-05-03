#!/usr/bin/env node

// tasks.js — command-line task list manager
//
// Mirrors the Kanban board's three-column model (todo, in-progress, done)
// in a simple text interface. Tasks are persisted to tasks.json in the
// same directory so state survives between runs.
//
// Usage:
//   node tasks.js list
//   node tasks.js add <title>
//   node tasks.js move <id> <column>   (column: todo | in-progress | done)
//   node tasks.js delete <id>

const fs = require("fs");
const path = require("path");

// Store data next to this script so it is easy to find and delete.
const DATA_FILE = path.join(__dirname, "tasks.json");

// Column display names, ordered left-to-right as they appear on the board.
const COLUMNS = ["todo", "in-progress", "done"];
const COLUMN_LABELS = { todo: "To Do", "in-progress": "In Progress", done: "Done" };

// ─── persistence ────────────────────────────────────────────────────────────

// loadTasks reads the JSON file and returns a tasks array.
// Returns an empty array when the file does not exist yet (first run).
function loadTasks() {
  if (!fs.existsSync(DATA_FILE)) return [];
  // Parse the raw JSON; if the file is corrupt this will throw with a
  // clear message rather than silently returning bad data.
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

// saveTasks writes the tasks array back to disk as pretty-printed JSON.
// Pretty-printing makes the file human-readable and diff-friendly.
function saveTasks(tasks) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// ─── task helpers ───────────────────────────────────────────────────────────

// nextId returns an integer one higher than the current maximum id.
// Using monotonically increasing integers keeps ids short and easy to type.
function nextId(tasks) {
  if (tasks.length === 0) return 1;
  return Math.max(...tasks.map((t) => t.id)) + 1;
}

// findTask returns the task with the given id, or null if not found.
function findTask(tasks, id) {
  return tasks.find((t) => t.id === id) ?? null;
}

// ─── commands ───────────────────────────────────────────────────────────────

// cmdList prints every column and its tasks.
// Groups by column order so output matches the visual board layout.
function cmdList(tasks) {
  for (const col of COLUMNS) {
    const items = tasks.filter((t) => t.column === col);
    console.log(`\n${COLUMN_LABELS[col]} (${items.length})`);
    console.log("─".repeat(30));
    if (items.length === 0) {
      console.log("  (empty)");
    } else {
      // Show id first so the user can copy-paste it into move/delete commands.
      items.forEach((t) => console.log(`  [${t.id}] ${t.title}`));
    }
  }
  console.log("");
}

// cmdAdd creates a new task in the "todo" column and persists it.
// New tasks always start in "todo" — matching the Kanban workflow where
// work enters the board before being picked up.
function cmdAdd(tasks, title) {
  if (!title) return console.error("Error: title is required.");
  const task = { id: nextId(tasks), title, column: "todo" };
  tasks.push(task);
  saveTasks(tasks);
  console.log(`Added [${task.id}] "${task.title}" → To Do`);
}

// cmdMove changes a task's column and persists the change.
function cmdMove(tasks, id, column) {
  if (!COLUMNS.includes(column)) {
    return console.error(`Error: column must be one of: ${COLUMNS.join(", ")}`);
  }
  const task = findTask(tasks, id);
  if (!task) return console.error(`Error: no task with id ${id}`);
  task.column = column;
  saveTasks(tasks);
  console.log(`Moved [${task.id}] "${task.title}" → ${COLUMN_LABELS[column]}`);
}

// cmdDelete removes a task by id.
function cmdDelete(tasks, id) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return console.error(`Error: no task with id ${id}`);
  const [removed] = tasks.splice(index, 1);
  saveTasks(tasks);
  console.log(`Deleted [${removed.id}] "${removed.title}"`);
}

// ─── help ───────────────────────────────────────────────────────────────────

function printHelp() {
  console.log(`
Usage:
  node tasks.js list
  node tasks.js add <title>
  node tasks.js move <id> <column>   (todo | in-progress | done)
  node tasks.js delete <id>
`);
}

// ─── entry point ────────────────────────────────────────────────────────────

// Slice off "node" and the script path to get the user-supplied arguments.
const [command, ...args] = process.argv.slice(2);
const tasks = loadTasks();

// Dispatch to the appropriate command handler.
// parseInt for id args because JSON stores ids as numbers and === won't match
// a string against a number.
switch (command) {
  case "list":
    cmdList(tasks);
    break;
  case "add":
    cmdAdd(tasks, args.join(" "));
    break;
  case "move":
    cmdMove(tasks, parseInt(args[0], 10), args[1]);
    break;
  case "delete":
    cmdDelete(tasks, parseInt(args[0], 10));
    break;
  default:
    printHelp();
}
