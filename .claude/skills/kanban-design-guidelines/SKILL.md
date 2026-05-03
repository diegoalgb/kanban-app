---
name: kanban-design-guidelines
description: Visual design guidelines for the Kanban app — enforce dark mode, high-contrast UI, sharp corners (≤2 px), Geist fonts, and horizontal screen margins. Apply whenever creating or modifying any UI component, page, or style in this project.
user-invocable: true
---

# Kanban Visual Design Guidelines

These rules apply to **every UI component, page layout, and style decision** in this project. Follow them without exception.

---

## 1. Dark Mode — Always On

The app is permanently dark mode. There is no light-mode variant and no theme toggle.

- Set `class="dark"` on the root `<html>` element (or via `next-themes` with `defaultTheme="dark"` and `forcedTheme="dark"`).
- Never use light-mode-only color tokens (`bg-white`, `text-black`, bare `bg-background` without confirming its dark value, etc.).
- Use shadcn/ui semantic tokens (`bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border`) — these resolve to the correct dark values automatically when `class="dark"` is present.

---

## 2. High-Contrast Colors and Elements

Every piece of text, icon, border, and interactive element must be clearly legible against its background.

**Rules:**
- Prefer `text-foreground` (near-white) for body text and `text-muted-foreground` for secondary text. Never use gray so light it disappears on dark backgrounds.
- Interactive elements (buttons, inputs, cards) must have a visible border (`border border-border`) so they stand out from the page background.
- Hover and focus states must be clearly distinguishable — use `hover:bg-accent` or a solid color shift, not a subtle opacity nudge.
- Status colors (In Progress, Done, blocked, etc.) must use saturated, accessible hues (e.g. Tailwind `blue-400`, `green-400`, `red-400`) — not washed-out pastels.

---

## 3. Corner Rounding — Maximum 2 px

Corners are sharp. This gives the UI a clean, structured, professional look.

- **Maximum allowed rounding: `rounded-sm` (2 px in Tailwind v3/v4).**
- Use `rounded-none` (0 px) on large structural containers (columns, cards, sidebar).
- Use `rounded-sm` (2 px) only on small interactive elements (buttons, badges, tags, inputs) where a hard edge would look too severe.
- **Never use** `rounded`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-full`, or any custom border-radius above 2 px.

```tsx
// Correct
<Card className="rounded-none border border-border" />
<Button className="rounded-sm" />

// Wrong — too much rounding
<Card className="rounded-lg" />
<Button className="rounded-full" />
```

---

## 4. Typography — Geist Font Family

All text uses the **Geist** font family, loaded via `next/font/google` or the `geist` npm package.

- **Body text / UI labels:** `Geist` (sans-serif).
- **Code / monospace contexts:** `Geist Mono`.
- Apply fonts at the root layout (`layout.tsx`) using `next/font`, then set `font-sans` via a CSS variable so Tailwind picks it up.

**Reference setup (`app/layout.tsx`):**
```tsx
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

// Apply both font variables to <html> so CSS can reference them.
// GeistSans.variable = '--font-geist-sans', GeistMono.variable = '--font-geist-mono'
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`dark ${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
```

**`tailwind.config.ts`:**
```ts
theme: {
  extend: {
    fontFamily: {
      sans: ['var(--font-geist-sans)', 'sans-serif'],
      mono: ['var(--font-geist-mono)', 'monospace'],
    },
  },
},
```

---

## 5. Horizontal Screen Margins

The main content must never touch the left or right edges of the viewport. This prevents the dark content area from feeling overwhelming and gives the layout room to breathe.

- Wrap every top-level page in a container with horizontal padding: `px-6` minimum on mobile, `px-12` or `px-16` on desktop.
- Use a max-width constraint (`max-w-screen-xl mx-auto`) so the board doesn't stretch to extreme widths on large monitors.
- The margin/padding area should be the page background color (`bg-background`) — it is not a decorative stripe, just breathing room.

```tsx
// Correct page wrapper
<main className="min-h-screen bg-background px-6 md:px-12 lg:px-16">
  <div className="mx-auto max-w-screen-xl">
    {/* board content */}
  </div>
</main>
```

---

## Quick-Reference Checklist

Before shipping any UI change, verify:

- [ ] `class="dark"` is active; no light-mode-only colors used
- [ ] All text meets contrast requirements; status colors are saturated
- [ ] No border-radius exceeds `rounded-sm` (2 px)
- [ ] Fonts are Geist Sans / Geist Mono, loaded via `next/font`
- [ ] Page content has `px-6 md:px-12 lg:px-16` horizontal padding and `max-w-screen-xl mx-auto`
