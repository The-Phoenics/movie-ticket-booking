import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()], // This injects your tsconfig mappings automatically
  test: {
    // Your other Vitest configurations
  },
});