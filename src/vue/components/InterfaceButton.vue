<template>
  <!-- Attributes like name etc. will fall through to this root element -->
  <!-- TODO: support anchor elements -->
  <button
    class="baleada-baleada-button"
    :style="styles"
    @click="setPositionAndHandleClick"
    ref="baleada"
  >
    <HapticCircle
      v-if="hasHapticShape"
      :baseOpacity="hapticShapeBaseOpacity"
      :maxScale="hapticShapeMaxScale"
    />
    <slot />
  </button>
</template>

<script>
import { ref, provide } from '@vue/composition-api'

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
    hapticShapeBaseOpacity: {
      type: Number,
    },
    hapticShapeMaxScale: {
      type: Number,
    },
    handleClick: {
      type: Function,
      required: true,
    },
  },
  setup (props) {
    const baleada = ref(null),
          eventPosition = ref({ x: 0, y: 0 })
    
    function setPositionAndHandleClick (event) {
      const { clientX, clientY } = event,
            { x, y } = baleada.value.getBoundingClientRect(),
            left = clientX - x,
            top = clientY - y

      eventPosition.value = { left, top }
      props.handleClick(event)
    }

    provide('eventPosition', eventPosition)

    const styles = props.hasHapticShape ? { position: 'relative' } : {}

    return {
      baleada,
      setPositionAndHandleClick,
      styles,
    }
  }
}
</script>