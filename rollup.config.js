import { configureable } from '@baleada/prepare'

const shared = configureable('rollup')
        .external([
          'vue',
          '@baleada/vue-composition',
          '@baleada/vue-features',
        ])
        .resolve()
        .vue()
        .virtualIndex('src/index.js', { test: ({ id }) => /src\/(?:components\/|symbols\/|)[^\/]+.(?:js|vue)$/.test(id) })
        .virtualIndex('src/components')
        .virtualIndex('src/symbols')
        .virtualIndex('src/util'),
      esm = shared
        .delete({ targets: 'lib/*', verbose: true })
        .input('src/index.js')
        .esm({ file: 'lib/index.js', target: 'browser' })
        .configure(),
      pluginEsm = shared
        .delete({ targets: 'plugin/*', verbose: true })
        .input('src/plugin.js')
        .esm({ file: 'plugin/index.js', target: 'browser' })
        .configure()

export default [
  esm,
  pluginEsm,
]
