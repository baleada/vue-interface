<template>
  <section 
    class="baleada-interface-string"
    ref="baleada"
    :style="styles"
  >
    <HapticRectangle
      v-if="hasHaptics"
      :align="hapticsAlign"
      :maxScale="hapticsMaxScale"
      :duration="hapticsDuration"
      :timing="hapticsTiming"
      :class="descendant1Classes"
      :style="descendant1Styles"
    />
    <input
      v-if="['text', 'email', 'password'].includes(type)"
      :type="type"
      v-on="{
        ...listeners,
        mousedown: handleMousedown,
        focus: handleFocus,
        blur: handleBlur,
      }"
      v-bind="attrs"
      :class="descendant2Classes"
      :style="descendant2Styles"
    />
    <textarea
      v-if="type === 'textarea'"
      v-on="{
        ...listeners,
        mousedown: handleMousedown,
        focus: handleFocus,
        blur: handleBlur,
      }"
      v-bind="attrs"
      :class="descendant2Classes"
      :style="descendant2Styles"
    />
    <section
      class="contents"
      :class="descendant3Classes"
      :style="descendant3Styles"
    >
      <slot v-bind="{ status }"></slot>
    </section>
  </section>
</template>

<script>
import { getCurrentInstance, ref, computed, provide } from '@vue/composition-api'

import HapticRectangle from '../util/HapticRectangle.vue'
import { useSymbol } from '../symbols'

export default {
  name: 'InterfaceString',
  components: {
    HapticRectangle,
  },
  inheritAttrs: false,
  props: {
    type: {
      type: String,
      default: 'text',
      validator: type => ['text', 'textarea', 'email', 'password'].includes(type),
    },
    hasHaptics: {
      type: Boolean,
      default: false,
    },
    hapticsAlign: {
      type: String,
      default: 'bottom',
    },
    hapticsMaxScale: {
      type: Number,
      default: 2.1,
    },
    hapticsDuration: {
      type: Number,
      default: 400,
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
    descendant3Classes: {
      type: String,
      default: '',
    },
    descendant3Styles: {
      type: Object,
      default: () => ({}),
    },
  },
  setup (props) {
    const baleada = ref(null),
          attrs = computed(() => getCurrentInstance().$attrs),
          listeners = computed(() => getCurrentInstance().$listeners), // I don't actually want this to be reactive, but if it's just a normal reference you can't use this component as the root of another component.
          onClick = listeners.value.click,
          onFocus = listeners.value.focus,
          onBlur = listeners.value.blur,
          eventPosition = ref({ x: 0, y: 0 }),
          status = ref('ready')
    
    function handleMousedown (event) {
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

    function handleFocus (event) {
      status.value = 'focused'
      eventPosition.value = {
        left: eventPosition.value.left === 0 ? 1 : 0, // ensure a change when using keyboard to focus in and out
        top: eventPosition.value.top === 0 ? 1 : 0,
      }

      // TODO: Extract this for use in checkbox and other stuff
      if (typeof onFocus === 'function') {
        onFocus(event)
      }
    }

    function handleBlur (event) {
      status.value = 'blurred'

      // TODO: Extract this for use in checkbox and other stuff
      if (typeof onFocus === 'function') {
        onBlur(event)
      }
    }

    provide(useSymbol('string', 'eventPosition'), eventPosition)
    provide(useSymbol('string', 'status'), status)

    const styles = props.hasHaptics ? ({ position: 'relative' }) : ({})

    return {
      baleada,
      attrs,
      listeners,
      styles,
      handleMousedown,
      handleFocus,
      handleBlur,
      status,
    }
  }
}
</script>