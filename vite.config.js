import { configureable } from '@baleada/prepare'

export default {
  ...configureable('vite')
    .alias({
      '/@src/': `/src`,
    })
    .koa(configureable => 
      configureable
        .virtualIndex('src/index.js', { test: ({ id }) => /src\/(?:components\/|symbols\/|)[^\/]+.(?:js|vue)$/.test(id) })
        .virtualIndex('src/components')
        .virtualIndex('src/symbols')
        .virtualIndex('src/util')
        .virtualRoutes(
          { path: 'pages/routes.js', router: 'vue' },
          { test: ({ id }) => id.endsWith('vue') }
        )
        .configure()
    )
    .configure(),
}
