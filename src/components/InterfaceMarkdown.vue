<template>
  <InterfaceString
    class="baleada-interface-markdown"
    ref="baleada"
    v-bind="attrs"
  >
    <ExtendStringAsMarkdown v-slot="{ status, completeable, complete }">
      <slot v-bind="{ status, completeable, complete }" />
    </ExtendStringAsMarkdown>
  </InterfaceString>
</template>

<script>
import { ref, computed, getCurrentInstance, provide } from 'vue'

import InterfaceString from './InterfaceString.vue'
import ExtendStringAsMarkdown from './ExtendStringAsMarkdown.vue'
import { useSymbol } from '../symbols'

export default {
  components: {
    InterfaceString,
    ExtendStringAsMarkdown,
  },
  props: {
    keycombos: {
      type: Object,
      default: () => ({})
    },
  },
  inheritAttrs: false,
  setup (props, { attrs }) {
    const baleada = ref(null)

    provide(useSymbol('markdown', 'keycombos'), props.keycombos)

    console.log(getCurrentInstance())


    return {
      baleada,
      attrs,
    }
  }
}
</script>
