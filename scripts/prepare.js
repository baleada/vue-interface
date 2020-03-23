const { generateIndex } = require('@baleada/prepare'),
      generatePropsInterfaces = require('./generatePropsInterfaces')
      compile = require('./compile')

function prepare () {
  /* Index all */
  generateIndex('./src')
  generateIndex('./src/util')

  /* Compile */
  compile()
}

prepare()
