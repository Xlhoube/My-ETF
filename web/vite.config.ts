import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuração do Vite para compilação e build estático do projeto
export default defineConfig({
  plugins: [react()],
  base: './' // Garante que os caminhos dos ficheiros compilados sejam relativos, facilitando o deploy no Hostinger
});
