import { configureable } from '@baleada/prepare'

const shared = configureable('rollup')
        .external([
          'vue',
          '@baleada/vue-composition',
          '@baleada/vue-features',
        ])
        .resolve()
        .vue()
        .virtual.index('src/index.js', { test: ({ id }) => /src\/(?:components\/|symbols\/|)[^\/]+.(?:js|vue)$/.test(id) })
        .virtual.index('src/components')
        .virtual.index('src/symbols')
        .virtual.index('src/util'),
      esm = shared
        .delete({ targets: 'lib/*', verbose: true })
        .input('src/index.js')
        .esm({ file: 'lib/index.js', target: 'browser' })
        .configure()

export default [
  esm,
]
