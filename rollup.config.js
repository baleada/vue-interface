import vue from 'rollup-plugin-vue'
import babel from '@rollup/plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
import virtual from '@baleada/rollup-plugin-virtual'
import createFilesToIndex from '@baleada/source-transform-files-to-index'

const srcIndexTest = ({ id }) => /src\/(?:components\/|symbols\/|)[^\/]+.(?:js|vue)$/.test(id),
      srcFilesToIndex = createFilesToIndex({ test: srcIndexTest }),
      componentsIndexTest = ({ id }) => /src\/components\/[^\/]+.vue$/.test(id),
      componentsFilesToIndex = createFilesToIndex({ test: componentsIndexTest }),
      symbolsIndexTest = ({ id }) => /src\/symbols\/[^\/]+.js$/.test(id),
      symbolsFilesToIndex = createFilesToIndex({ test: symbolsIndexTest }),
      utilIndexTest = ({ id }) => /src\/util\/[^\/]+.(?:js|vue)$/.test(id),
      utilFilesToIndex = createFilesToIndex({ test: utilIndexTest })

const external = [
        '@baleada/vue-composition',
        '@baleada/vue-features',
        'vue',
        /@babel\/runtime/,
      ],
      plugins = [
        resolve(),
        vue(),
        virtual({
          test: ({ id }) => id.endsWith('src/index.js'),
          transform: srcFilesToIndex,
        }),
        virtual({
          test: ({ id }) => id.endsWith('src/components'),
          transform: componentsFilesToIndex,
        }),
        virtual({
          test: ({ id }) => id.endsWith('src/symbols'),
          transform: symbolsFilesToIndex,
        }),
        virtual({
          test: ({ id }) => id.endsWith('src/util'),
          transform: utilFilesToIndex,
        }),
        babel({
          exclude: 'node_modules/**',
          babelHelpers: 'runtime',
        }),
      ]

export default [
  {
    external,
    input: 'src/index.js',
    output: { file: 'lib/index.js', format: 'esm' },
    plugins,
  },
  {
    external,
    input: 'src/plugin.js',
    output: { file: 'plugin/index.js', format: 'esm' },
    plugins,
  },
]
