<template>
  <svg 
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    ref="circle"
    style="position: absolute; width: 100%; transform: translate(-50%, -50%) scale(0); transform-origin: center; pointer-events: none;"
  >
    <circle cx="50" cy="50" r="50" />
  </svg>
</template>

<script>
import { ref, watch, inject } from '@vue/composition-api'

import { useSymbol } from '../symbols'

import { useAnimateable } from '@baleada/composition-vue'

export default {
  props: {
    maxOpacity: {
      type: Number,
      default: 0,
    },
    maxScale: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
    },
    timing: {
      type: Array,
    },
  },
  setup (props) {
    const circle = ref(null),
          haptics = useAnimateable(
            [
              // Scale
              { progress: 0.0, data: { scale: 0 } },
              { progress: 0.50, data: { scale: props.maxScale } },

              // Opacity
              { progress: 0.00, data: { opacity: 0 } },
              { progress: 0.10, data: { opacity: 1 } },
              { progress: 0.60, data: { opacity: 1 } },
              { progress: 1.00, data: { opacity: 0 } },
            ],
            { duration: props.duration, timing: props.timing }
          ),
          eventPosition = inject(useSymbol('click', 'eventPosition')) // TODO: This makes HapticCircle too button-specific

    watch(() => eventPosition.value.left + eventPosition.value.top, () => {
      if (circle.value !== null) {
        circle.value.style.left = `${eventPosition.value.left}px`
        circle.value.style.top = `${eventPosition.value.top}px`
        haptics.value.stop()
        haptics.value.play(handleFrame)
      }
    })

    function handleFrame (frame) {
      const { data: { scale, opacity } } = frame
      circle.value.style.transform = `translate(-50%, -50%) scale(${scale})`
      circle.value.style.opacity = opacity * props.maxOpacity
    }

    return {
      circle
    }
  }
}
</script>
