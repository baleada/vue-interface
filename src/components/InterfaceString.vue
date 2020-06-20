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
      ref="inputElement"
      v-if="['text', 'email', 'password'].includes(type)"
      :type="type"
      v-on="exceptInputListener"
      v-bind="attrs"
      :class="descendant2Classes"
      :style="descendant2Styles"
    />
    <textarea
      ref="inputElement"
      v-if="type === 'textarea'"
      v-on="exceptInputListener"
      v-bind="attrs"
      :class="descendant2Classes"
      :style="descendant2Styles"
    />
    <section
      class="contents"
      :class="descendant3Classes"
      :style="descendant3Styles"
    >
      <slot v-bind="{ status, completeable }"></slot>
    </section>
  </section>
</template>

<script>
import { getCurrentInstance, ref, computed, onMounted, watchEffect, provide } from '@vue/composition-api'

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
  setup (props, { emit }) {
    const baleada = ref(null),
          inputElement = ref(null),
          attrs = computed(() => getCurrentInstance().$attrs),
          listeners = computed(() => getCurrentInstance().$listeners), // I don't actually want this to be reactive, but if it's just a normal reference you can't use this component as the root of another component.
          exceptInputListener = computed((({ input, ...rest }) => rest)(listeners.value)),
          onInput = listeners.value.input,
          eventPosition = ref({ x: 0, y: 0 }),
          { completeable, status, completeableChangeAgent } = useCompleteableInput({
            completeable: [attrs.value?.value || ''],
            input: inputElement,
          }),
          inputEventStatus = ref('ready')

    /* Intercept input */
    const input = useListenable('input'),
          inputHandle = event => {
            inputEventStatus.value = 'handling'
            event.target.value = completeable.value.string
            onInput?.(event)
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

    const styles = props.hasHaptics ? ({ position: 'relative' }) : ({})

    return {
      baleada,
      inputElement,
      attrs,
      exceptInputListener,
      styles,
      status,
      completeable,
    }
  }
}
</script>