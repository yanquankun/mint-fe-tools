import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import { createHtmlPlugin } from 'vite-plugin-html';

// https://vite.dev/config/
const defineConfig = ({ mode }) => {
  const isProd = mode === 'production';

  return {
    base: '/static/',
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
      createHtmlPlugin({
        minify: true, // 开启 HTML 压缩
      }),
    ],
    build: {
      outDir: resolve(__dirname, '../cli/static'),
      assetsDir: 'vender',
      assetsInlineLimit: 8192,
      cssCodeSplit: false,
      sourcemap: !isProd,
      emptyOutDir: true,
      minify: 'terser',
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
          target: 'http://10.253.79.55:3000',
          changeOrigin: true,
          prependPath: false,
          rewrite: (path) => {
            !isProd &&
              console.log(
                '\x1b[32m%s\x1b[0m',
                `proxy rewrite: ${path} -> 10.253.79.55:3000${path}`,
              );
            return path.replace(/^\/api/, '/api');
          },
        },
      },
    },
  };
};

export default defineConfig;
