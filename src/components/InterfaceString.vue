

<template>
  <section class="baleada-interface-string">
    <input
      v-if="['text', 'email', 'password'].includes(type)"
      :type="type"
      v-on="listeners"
      v-bind="attrs"
      :class="descendant1Classes"
      :style="descendant1Styles"
    />
    <textarea
      v-if="type === 'textarea'"
      v-on="listeners"
      v-bind="attrs"
      :class="descendant1Classes"
      :style="descendant1Styles"
    />
    <section
      class="contents"
      :class="descendant2Classes"
      :style="descendant2Styles"
    >
      <slot></slot>
    </section>
  </section>
</template>

<script>
import { getCurrentInstance, computed } from '@vue/composition-api'

export default {
  props: {
    type: {
      type: String,
      default: 'text',
      validator: type => ['text', 'textarea', 'email', 'password'].includes(type),
    },
    descendant1Classes: {
      type: String,
      default: '',
    },
    descendant1Styles: {
      type: String,
      default: () => ({}),
    },
    descendant2Classes: {
      type: String,
      default: '',
    },
    descendant2Styles: {
      type: String,
      default: () => ({}),
    },
  },
  setup () {
    const attrs = computed(() => getCurrentInstance().$attrs),
          listeners = computed(() => getCurrentInstance().$listeners)

    return {
      attrs,
      listeners,
    }
  }
}
</script>