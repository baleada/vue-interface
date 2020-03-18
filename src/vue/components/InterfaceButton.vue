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
      v-if="hasHapticShape"
      :maxOpacity="hapticShapeMaxOpacity"
      :maxScale="hapticShapeMaxScale"
    />
    <slot />
  </button>
</template>

<script>
import { ref, provide, getCurrentInstance } from '@vue/composition-api'

import HapticCircle from '../util/HapticCircle.vue'

export default {
  components: {
    HapticCircle,
  },
  props: {
    hasHapticShape: {
      type: Boolean,
      default: false,
    },
    hapticShapeMaxOpacity: {
      type: Number,
    },
    hapticShapeMaxScale: {
      type: Number,
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

    provide('eventPosition', eventPosition)

    const styles = props.hasHapticShape ? { position: 'relative' } : {}

    return {
      baleada,
      handleClick,
      styles,
    }
  }
}
</script>