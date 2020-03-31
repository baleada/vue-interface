<template>
  <!-- Attrs and listeners fall through to the button automatically -->
  <button
    class="baleada-interface-button"
    :style="styles"
    @click="handleClick"
    @keydown.space="handleSpace"
    ref="baleada"
  >
    <HapticCircle
      v-if="hasHaptics"
      :maxOpacity="hapticsMaxOpacity"
      :maxScale="hapticsMaxScale"
      :duration="hapticsDuration"
      :timing="hapticsTiming"
      :class="descendant1Classes"
      :style="descendant1Styles"
    />
    <section
      class="contents"
      :class="descendant2Classes"
      :style="descendant2Styles"
    >
      <slot />
    </section>
  </button>
</template>

<script>
import { ref, provide, getCurrentInstance } from '@vue/composition-api'

import HapticCircle from '../util/HapticCircle.vue'
import { useSymbol } from '../symbols'

export default {
  name: 'InterfaceButton',
  components: {
    HapticCircle,
  },
  props: {
    hasHaptics: {
      type: Boolean,
      default: false,
    },
    hapticsMaxOpacity: {
      type: Number,
      default: 0.25,
    },
    hapticsMaxScale: {
      type: Number,
      default: 2,
    },
    hapticsDuration: {
      type: Number,
      default: 450,
    },
    hapticsTiming: {
      type: Array,
    },
    descendant1Classes: {
      type: String,
      default: '',
    },
    descendant1Styles: {
      type: Object,
      default: () => ({}),
    },
    descendant2Classes: {
      type: String,
      default: '',
    },
    descendant2Styles: {
      type: Object,
      default: () => ({}),
    },
  },
  setup (props, { attrs }) {
    const baleada = ref(null),
          onClick = getCurrentInstance().$listeners.click,
          eventPosition = ref({ x: 0, y: 0 })
    
    function handleClick (event) {
      const { clientX, clientY } = event,
            { x, y } = baleada.value.getBoundingClientRect(),
            left = clientX - x,
            top = clientY - y

      eventPosition.value = { left, top }
      
      // TODO: Extract this for use in checkbox and other stuff
      if (typeof onClick === 'function') {
        onClick(event)
      }
    }

    function handleSpace (evt) {
      eventPosition.value = {
        left: eventPosition.value.left === 0 ? 1 : 0, // ensure a change regardless of previous click position
        top: eventPosition.value.top === 0 ? 1 : 0,
      }
    }

    provide(useSymbol('button', 'eventPosition'), eventPosition)

    const styles = props.hasHaptics ? { position: 'relative' } : {}

    return {
      baleada,
      handleClick,
      handleSpace,
      styles,
    }
  }
}
</script>