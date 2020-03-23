const { generateIndex } = require('@baleada/prepare'),
      compile = require('./compile')

function prepare () {
  /* Index all */
  generateIndex('./src')
  generateIndex('./src/components')
  generateIndex('./src/symbols')
  generateIndex('./src/util')

  /* Top level index */
  generateIndex(
    ['src/components', 'src/symbols'],
    { outfile: 'src/index', extensions: ['js', 'vue'] }
  )

  /* Compile */
  compile()
}

prepare()
