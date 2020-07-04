<template>
  <InterfaceString
    class="baleada-interface-markdown"
    ref="baleada"
    v-bind="attrs"
    v-on="listeners"
  >
    <ExtendStringMarkdown v-slot="{ status, completeable, complete }">
      <slot v-bind="{ status, completeable, complete }" />
    </ExtendStringMarkdown>
  </InterfaceString>
</template>

<script>
import { ref, computed, getCurrentInstance, provide } from 'vue'

import InterfaceString from './InterfaceString.vue'
import ExtendStringMarkdown from './ExtendStringMarkdown.vue'
import { useSymbol } from '../symbols'

export default {
  components: {
    InterfaceString,
    ExtendStringMarkdown,
  },
  props: {
    keycombos: {
      type: Object,
      default: () => ({})
    },
  },
  inheritAttrs: false,
  setup (props) {
    const baleada = ref(null),
          attrs = computed(() => getCurrentInstance().$attrs),
          listeners = computed(() => getCurrentInstance().$listeners) // I don't actually want this to be reactive, but if it's just a normal reference you can't use this component as the root of another component.

    provide(useSymbol('markdown', 'keycombos'), props.keycombos)


    return {
      baleada,
      attrs,
      listeners,
    }
  }
}
</script>
