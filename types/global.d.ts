// Declares plain CSS files as side-effect-only imports so TypeScript does not
// raise an error when layout.tsx (and similar files) import globals.css without
// a default export. Next.js processes these at build time; TS only needs to
// know the import is valid.
declare module '*.css';
