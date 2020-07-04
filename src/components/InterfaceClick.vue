<template>
  <!-- Attrs and listeners fall through to the root automatically -->
  <component :is="tag"
    class="baleada-interface-click"
    :style="styles"
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
import { ref, computed, provide, getCurrentInstance, onMounted } from 'vue'
import { useListenable } from '@baleada/vue-composition'
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
          eventPosition = ref({ x: 0, y: 0 })

    const mousedown = useListenable('mousedown'),
          mousedownHandle =  event => {
            const { clientX, clientY } = event,
                  { x, y } = baleada.value.getBoundingClientRect(),
                  left = clientX - x,
                  top = clientY - y

            eventPosition.value = { left, top }
          },
          mousedownStatus = ref('ready')
    
    // onMounted with ref shim
    // watch([baleada, mousedown], () => {
    //   if (baleada.value !== null) {
    //     switch (mousedown.value.status) {
    //     case 'listening':
    //       // do nothing
    //       break
    //     default:
    //       mousedown.value.listen(mousedownHandle, { target: baleada.value })
    //     }
    //   }
    // })
    onMounted(() => mousedown.value.listen(mousedownHandle, { target: baleada.value }))

    const space = useListenable('space'),
          spaceHandle = () => {
            eventPosition.value = {
              left: eventPosition.value.left === 0 ? 1 : 0, // ensure a change regardless of previous click position
              top: eventPosition.value.top === 0 ? 1 : 0,
            }
          }
    onMounted(() => space.value.listen(spaceHandle, { target: baleada.value }))

    provide(useSymbol('click', 'eventPosition'), eventPosition)

    const styles = props.hasHaptics ? { position: 'relative' } : {}

    return {
      baleada,
      styles,
    }
  }
}
</script>