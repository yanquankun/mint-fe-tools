import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';

// https://vite.dev/config/
const defineConfig = ({ mode }) => {
  const isProd = mode === 'production';

  return {
    base: '/',
    plugins: [
      vue(),
      //====== ele comp 按需引入 ======
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      //====== end ======
    ],
    build: {
      outDir: resolve(__dirname, 'dist'),
      assetsDir: 'vender',
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

            return isProd ? '[name]-[hash][extname]' : '[name][extname]';
          },
          manualChunks: (id) => {
            if (id.indexOf('element-plus') > -1) {
              return 'element-plus';
            }
            if (id.includes('node_modules')) {
              return 'third_party';
            }
          },
        },
      },
    },
    resolve: {
      alias: [{ find: /^@\//, replacement: resolve(__dirname, 'src') + '/' }],
      extensions: ['.ts', '.tsx', '.js', '.mjs', '.vue', '.json', '.less', '.css', '.ico'],
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
