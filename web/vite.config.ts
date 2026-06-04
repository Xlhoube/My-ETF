import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Configuração do Vite para compilação e build estático do projeto
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  base: './' // Garante que os caminhos dos ficheiros compilados sejam relativos, facilitando o deploy no Hostinger
});
