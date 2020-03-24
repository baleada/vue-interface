const { generateIndex } = require('@baleada/prepare'),
      compile = require('./compile')

function prepare () {
  /* Index all */
  generateIndex('./src')
  generateIndex('./src/components', { extensions: ['vue'] })
  generateIndex('./src/symbols')
  generateIndex('./src/util', { extensions: ['js', 'vue'] })

  /* Top level index */
  generateIndex(
    ['src/components', 'src/symbols'],
    { outfile: 'src/index', extensions: ['js', 'vue'] }
  )

  /* Compile */
  compile()
}

prepare()
