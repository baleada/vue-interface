const symbols = {
  click: {
    eventPosition: Symbol('eventPosition'),
  },
  string: {
    eventPosition: Symbol('eventPosition'),
    status: Symbol('status'),
    completeable: Symbol('completeable'),
  },
  markdown: {
    keycombos: Symbol('keycombos'),
    bold: Symbol('bold'),
    italic: Symbol('italic'),
    superscript: Symbol('superscript'),
    subscript: Symbol('subscript'),
    strikethrough: Symbol('strikethrough'),
    inlineCode: Symbol('inlineCode'),
    link: Symbol('link'),
  }
}

export default function useSymbol (collection, name) {
  return symbols[collection][name]
}
