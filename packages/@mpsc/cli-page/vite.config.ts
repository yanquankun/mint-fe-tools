import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vite.dev/config/
const defineConfig = ({ mode }) => {
  const isProd = mode === 'production';
  return {
    base: '/',
    plugins: [vue()],
    build: {
      outDir: resolve(__dirname, 'dist'),
      assetsDir: 'assets',
      assetsInlineLimit: 8192,
      cssCodeSplit: false,
      // sourcemap: !isProd,
      emptyOutDir: true,
      rollupOptions: {
        input: resolve(__dirname, 'index.html'),
        output: {
          entryFileNames: isProd ? 'js/[name]-[hash].js' : 'js/[name].js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name.indexOf('css') > -1) {
              return isProd ? 'css/[name]-[hash:10][extname]' : 'css/[name]-[extname]';
            }

            return isProd ? 'assets/[name]-[hash][extname]' : 'assets/[name][extname]';
          },
        },
      },
    },
    resolve: {
      alias: [{ find: /^@\//, replacement: resolve(__dirname, 'src') + '/' }],
      extensions: ['.ts', '.tsx', '.js', '.mjs', '.vue', '.json', '.less', '.css'],
    },
    server: {
      port: 8010,
      host: '127.0.0.1',
      open: true,
      proxy: {
        '/api': {
          target: '',
          changeOrigin: true,
          prependPath: false,
        },
      },
    },
  };
};

export default defineConfig;
