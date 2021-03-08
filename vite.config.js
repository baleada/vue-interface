import { configureable } from '@baleada/prepare'

export default configureable('vite')
  .alias({
    '@src': `/src`,
  })
  .vue()
  .virtual.index('src/index.js', { test: ({ id }) => /src\/(?:components\/|symbols\/|)[^\/]+.(?:js|vue)$/.test(id) })
  .virtual.index('src/components')
  .virtual.index('src/symbols')
  .virtual.index('src/util')
  .virtual.routes(
    { path: 'tests/stubs/app/src/pages/routes.js', router: 'vue' },
    { test: ({ id }) => id.endsWith('vue') }
  )
  .configure()
