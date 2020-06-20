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
    complete: Symbol('complete'),
  }
}

export default function useSymbol (collection, name) {
  return symbols[collection][name]
}
