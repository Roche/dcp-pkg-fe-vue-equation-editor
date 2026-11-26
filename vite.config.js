import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      include: ['src/**/*.ts', 'src/**/*.vue'],
      exclude: ['src/stories/**', 'src/**/__tests__/**']
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'DcpVueEquationEditor',
      fileName: (format) => `dcp-vue-equation-editor.${format}.js`,
      formats: ['es']
    },
    rollupOptions: {
      external: [
        'vue',
        'vuetify',
        'rxjs',
        'vue-i18n',
        '@open-dcp/i18n',
        '@open-dcp/styles',
        '@open-dcp/charts',
        '@open-dcp/equation-editor',
        '@open-dcp/filter',
        '@open-dcp/form',
        '@open-dcp/grid',
        '@open-dcp/utilities',
        'date-fns',
        'date-fns-tz',
        'lodash-es',
        'uuid',
        '@mdi/font',
        /^vuetify(\/.*)?$/,
        /^@open-dcp\/.*/,
        /^date-fns(\/.*)?$/
      ],
      output: {
        exports: "named"
      }
    },
  },
});