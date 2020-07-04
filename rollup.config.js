import vue from 'rollup-plugin-vue'
import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'

export default {
  external: [
    '@baleada/vue-composition',
    '@baleada/vue-features',
    'vue',
  ],
  input: [
    'src/index.js',
    'src/plugin.js',
  ],
  output: {
    dir: 'lib',
    format: 'esm',
  },
  plugins: [
    vue(),
    babel({
      exclude: 'node_modules/**'
    }),
    resolve(),
  ]
}
