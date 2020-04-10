<template>
  <svg 
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    ref="hapticShape"
    style="position: absolute; width: 100%; translateX(-50%) scaleX(0); transform-origin: center; pointer-events: none;"
    :style="{ [align]: '0px' }"
    v-show="status === 'focused'"
  >
    <rect height="100" width="100" />
  </svg>
</template>

<script>
import { ref, watch, watchEffect, inject } from '@vue/composition-api'

import { useSymbol } from '../symbols'

import { useAnimateable } from '@baleada/vue-composition'

export default {
  props: {
    align: {
      type: String,
      default: 'bottom',
      validator: align => ['top', 'bottom'].includes(align)
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
    const hapticShape = ref(null),
          haptics = useAnimateable(
            [
              // Scale X
              { progress: 0.0, data: { scaleX: 0 } },
              { progress: 1.0, data: { scaleX: props.maxScale } },
            ],
            { duration: props.duration, timing: props.timing }
          ),
          eventPosition = inject(useSymbol('string', 'eventPosition')), // TODO: This makes Haptics too string-specific
          status = inject(useSymbol('string', 'status')) // TODO: This makes Haptics too string-specific

    watch(() => eventPosition.value.left + eventPosition.value.top, () => {
      if (hapticShape.value !== null) {
        haptics.value.stop()
        hapticShape.value.style.left = `${eventPosition.value.left}px`
        haptics.value.play(handleFrame)
      }
    })

    watchEffect(() => {
      if (status.value === 'blurred') {
        hapticShape.value.style.transform = 'translateX(-50%) scaleX(0)'
      }
    })

    function handleFrame (frame) {
      const { data: { scaleX } } = frame
      hapticShape.value.style.transform = `translateX(-50%) scaleX(${scaleX})`
    }

    return {
      hapticShape,
      status,
    }
  }
}
</script>
