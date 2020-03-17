<template>
  <!-- Attributes like name etc. will fall through to this root element -->
  <!-- TODO: support anchor elements -->
  <button
    class="baleada-interface-button"
    style="position: relative;"
    @click="setPointAndHandleClick"
  >
    <HapticCircle />
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
    // hapticDuration: {
    //   type: Number,
    // },
    // hapticTiming: {
    //   type: Array,
    // },
    handleClick: {
      type: Function,
      required: true,
    },
  },
  setup (props) {
    const eventPoint = ref({ x: 0, y: 0 })
    
    function setPointAndHandleClick (event) {
      const { x, y } = event
      eventPoint.value = { x, y }
      props.handleClick(event)
    }

    provide('eventPoint', eventPoint)

    return {
      setPointAndHandleClick,
      // hapticDuration: props.hapticDuration,
      // hapticTiming: props.hapticTiming,
    }
  }
}
</script>