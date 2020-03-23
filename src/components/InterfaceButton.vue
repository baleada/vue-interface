<template>
  <!-- Attributes like name etc. will fall through to this root element -->
  <!-- TODO: support anchor elements -->
  <button
    class="baleada-baleada-button"
    :style="styles"
    @click="handleClick"
    ref="baleada"
  >
    <HapticCircle
      v-if="hasHaptics"
      :maxOpacity="hapticsMaxOpacity"
      :maxScale="hapticsMaxScale"
      :duration="hapticsDuration"
      :timing="hapticsTiming"
    />
    <slot />
  </button>
</template>

<script>
import { ref, provide, getCurrentInstance } from '@vue/composition-api'

import HapticCircle from '../util/HapticCircle.vue'
import { useSymbol } from '../symbols'

export default {
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
      default: 350,
    },
    hapticsTiming: {
      type: Array,
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

    provide(useSymbol('button', 'eventPosition'), eventPosition)

    const styles = props.hasHaptics ? { position: 'relative' } : {}

    return {
      baleada,
      handleClick,
      styles,
    }
  }
}
</script>