const symbols = {
  click: {
    eventPosition: Symbol('eventPosition'),
  },
  string: {
    eventPosition: Symbol('eventPosition'),
    status: Symbol('status'),
  },
}

export default function useSymbol (collection, name) {
  return symbols[collection][name]
}
