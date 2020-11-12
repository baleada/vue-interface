import * as components from './components'

export default function plugin (app) {
  Object
    .values(components)
    .forEach(component => app.component(component.name, component))
}
