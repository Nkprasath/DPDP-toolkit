// Vite config with dynamic base for GitHub Pages
// Set base via env VITE_BASE (e.g. "/repo-name/"). Defaults to "/".
const { defineConfig } = require('vite');

module.exports = defineConfig({
  base: process.env.VITE_BASE || '/',
});
