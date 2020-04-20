<template>
  <section 
    class="baleada-interface-string"
    ref="baleada"
    :style="styles"
  >
    <HapticRectangle
      v-if="hasHaptics && ['text', 'email', 'password'].includes(type)"
      :align="hapticsAlign"
      :maxScale="hapticsMaxScale"
      :duration="hapticsDuration"
      :timing="hapticsTiming"
      :class="descendant1Classes"
      :style="descendant1Styles"
    />
    <HapticCircle
      v-if="hasHaptics && type === 'textarea'"
      symbolCollection="string"
      :maxOpacity="hapticsMaxOpacity"
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
import HapticCircle from '../util/HapticCircle.vue'
import { useSymbol } from '../symbols'

export default {
  name: 'InterfaceString',
  components: {
    HapticRectangle,
    HapticCircle,
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
    hapticsMaxOpacity: { // Circle only
      type: Number,
      default: 0.25,
    },
    hapticsAlign: { // Rectangle only
      type: String,
      default: 'bottom',
    },
    hapticsMaxScale: { // Both circle and rectangle
      type: Number,
      default: 2.1,
    },
    hapticsDuration: { // Both circle and rectangle
      type: Number,
      default: 400,
    },
    hapticsTiming: { // Both circle and rectangle
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
          onMousedown = listeners.value.mousedown,
          onFocus = listeners.value.focus,
          onBlur = listeners.value.blur,
          eventPosition = ref({ x: 0, y: 0 }),
          status = ref('ready')
    
    function handleMousedown (event) {
      status.value = 'focused'
      const { clientX, clientY } = event,
            { x, y } = baleada.value.getBoundingClientRect(),
            left = clientX - x,
            top = clientY - y

      eventPosition.value = { left, top }
      
      if (typeof onMousedown === 'function') {
        onMousedown(event)
      }
    }

    function handleFocus (event) {
      if (status.value !== 'focused') {
        status.value = 'focused'
        eventPosition.value = {
          left: eventPosition.value.left === 0 ? 1 : 0, // ensure a change when using keyboard to focus in and out
          top: eventPosition.value.top === 0 ? 1 : 0,
        }
      }

      if (typeof onFocus === 'function') {
        onFocus(event)
      }
    }

    function handleBlur (event) {
      status.value = 'blurred'

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