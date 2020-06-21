<template>
  <!-- Attrs and listeners fall through to the button automatically -->
  <component :is="tag"
    :class="`baleada-interface-${tag.toLowerCase()}`"
    :style="styles"
    v-bind="attrs"
    v-on="{
      ...listeners,
      mousedown: handleMousedown,
      ['keydown.space']: handleSpace,
    }"
    ref="baleada"
  >
    <HapticCircle
      v-if="hasHaptics"
      symbolCollection="click"
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
  </component>
</template>

<script>
import { ref, computed, provide, getCurrentInstance } from '@vue/composition-api'

import HapticCircle from '../util/HapticCircle.vue'
import { useSymbol } from '../symbols'

export default {
  name: 'InterfaceClick',
  components: {
    HapticCircle,
  },
  props: {
    tag: {
      type: String,
      default: 'button',
      validator: tag => ['button', 'a', 'NuxtLink', 'RouterLink'].includes(tag)
    },
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
  setup (props) {
    const baleada = ref(null),
          attrs = computed(() => getCurrentInstance().$attrs),
          listeners = computed(() => getCurrentInstance().$listeners), // I don't actually want this to be reactive, but if it's just a normal reference you can't use this component as the root of another component.
          onMousedown = listeners.mousedown,
          eventPosition = ref({ x: 0, y: 0 })
    
    function handleMousedown (event) {
      const { clientX, clientY } = event,
            { x, y } = baleada.value.getBoundingClientRect(),
            left = clientX - x,
            top = clientY - y

      eventPosition.value = { left, top }
      
      if (typeof onMousedown === 'function') {
        onMousedown(event)
      }
    }

    function handleSpace (evt) {
      eventPosition.value = {
        left: eventPosition.value.left === 0 ? 1 : 0, // ensure a change regardless of previous click position
        top: eventPosition.value.top === 0 ? 1 : 0,
      }
    }

    provide(useSymbol('click', 'eventPosition'), eventPosition)

    const styles = props.hasHaptics ? { position: 'relative' } : {}

    return {
      baleada,
      attrs,
      listeners,
      handleMousedown,
      handleSpace,
      styles,
    }
  }
}
</script>