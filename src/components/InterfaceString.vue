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
      :class="hapticsClasses"
      :style="hapticsStyles"
    />
    <HapticCircle
      v-if="hasHaptics && type === 'textarea'"
      symbolCollection="string"
      :maxOpacity="hapticsMaxOpacity"
      :maxScale="hapticsMaxScale"
      :duration="hapticsDuration"
      :timing="hapticsTiming"
      :class="hapticsClasses"
      :style="hapticsStyles"
    />
    <input
      ref="inputElement"
      v-if="['text', 'email', 'password'].includes(type)"
      :type="type"
      v-bind="attrs"
      :class="interfaceClasses"
      :style="interfaceStyles"
    />
    <textarea
      ref="inputElement"
      v-if="type === 'textarea'"
      v-bind="attrs"
      :class="interfaceClasses"
      :style="interfaceStyles"
    />
    <section
      class="contents"
      :class="contentsClasses"
      :style="contentsStyles"
    >
      <slot v-bind="{ status, completeable }"></slot>
    </section>
  </section>
</template>

<script>
import { ref, onMounted, watchEffect, provide } from 'vue'

import { useListenable } from '@baleada/vue-composition'
import { useCompleteableInput } from '@baleada/vue-features'

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
    hapticsClasses: {
      type: String,
      default: '',
    },
    hapticsStyles: {
      type: Object,
      default: () => ({}),
    },
    interfaceClasses: {
      type: String,
      default: '',
    },
    interfaceStyles: {
      type: Object,
      default: () => ({}),
    },
    contentsClasses: {
      type: String,
      default: '',
    },
    contentsStyles: {
      type: Object,
      default: () => ({}),
    },
  },
  setup (props, { emit, attrs }) {
    const baleada = ref(null),
          inputElement = ref(null),
          eventPosition = ref({ x: 0, y: 0 }),
          { completeable, status, completeableChangeAgent } = useCompleteableInput({
            completeable: [attrs.value?.value || ''],
            input: inputElement,
          }),
          inputEventStatus = ref('ready')

    const input = useListenable('input'),
          inputHandle = event => {
            inputEventStatus.value = 'handling'
            event.target.value = completeable.value.string
            inputEventStatus.value = 'handled'
          }
    onMounted(() => input.value.listen(inputHandle, { target: inputElement.value }))

    watchEffect(() => {
      switch (completeableChangeAgent.value) {
      case 'event':
        // do nothing
        break
      case 'program':
        emit('input', { target: { value: completeable.value.string } })
        break
      }
    })


    /* Manage event position for haptics */ 
    const mousedown = useListenable('mousedown'),
          mousedownHandle = event => {
            const { clientX, clientY } = event,
                  { x, y } = baleada.value.getBoundingClientRect(),
                  left = clientX - x,
                  top = clientY - y

            eventPosition.value = { left, top }
          }
    onMounted(() => mousedown.value.listen(mousedownHandle, { target: inputElement.value }))

    const focus = useListenable('focus'),
          focusHandle = event => {
            if (status.value.input !== 'focused') {
              eventPosition.value = {
                left: eventPosition.value.left === 0 ? 1 : 0, // ensure a change when using keyboard to focus in and out
                top: eventPosition.value.top === 0 ? 1 : 0,
              }
            }
          }
    onMounted(() => focus.value.listen(focusHandle, { target: inputElement.value }))


    /* Provide stuff */
    provide(useSymbol('string', 'eventPosition'), eventPosition)
    provide(useSymbol('string', 'status'), status)
    provide(useSymbol('string', 'completeable'), completeable)
    provide(useSymbol('string', 'inputElement'), inputElement)

    const styles = props.hasHaptics ? ({ position: 'relative' }) : ({})

    return {
      baleada,
      inputElement,
      attrs,
      styles,
      status,
      completeable,
    }
  }
}
</script>
