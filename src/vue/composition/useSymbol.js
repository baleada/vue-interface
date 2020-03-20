const symbols = {
  button: {
    eventPosition: Symbol('eventPosition'),
  },
}

export default function useSymbol (collection, name) {
  return symbols[collection][name]
}
