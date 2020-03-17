<template>
  <svg 
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMinYMin meet"
    ref="circle"
    style="position: absolute; transform: scale(0);"
  >
    <circle cx="50" cy="50" r="50" />
  </svg>
</template>

<script>
import { ref, watch, inject, onMounted } from '@vue/composition-api'

import { useAnimateable } from '@baleada/composition/vue'

export default {
  props: {
    duration: {
      type: Number,
      default: 100,
    },
    timing: {
      type: Array,
      // Default to linear as per Animateable
    },
  },
  setup (props) {
    const circle = ref(null),
          grow = useAnimateable(
            [
              { progress: 0, data: { scale: 0 } },
              { progress: 1, data: { scale: 1 } },
            ],
            { duration: props.duration }
          ),
          eventPoint = inject('eventPoint')

    watch(eventPoint, () => {
      console.log(circle.value)
      if (circle.value !== null) {
        circle.value.style.left = `${eventPoint.value.x}px`
        circle.value.style.top = `${eventPoint.value.y}px`
        grow.value.play(handleFrame)
      }
    })

    onMounted(() => {
      circle.value.style.left = `${eventPoint.value.x}px`
      circle.value.style.top = `${eventPoint.value.y}px`
      grow.value.play(handleFrame)
    })

    function handleFrame (frame) {
      const { data: { scale } } = frame
      circle.value.transform = `scale(${scale})`
    }

    return {
      circle
    }
  }
}
</script>
