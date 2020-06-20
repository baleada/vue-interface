<template>
  <div>
    <slot v-bind="{ status, completeable, bold, italic, superscript, subscript, strikethrough, inlineCode, link }" />
  </div>
</template>

<script>
import { ref, watchEffect, onMounted, provide, inject } from '@vue/composition-api'
import { useCompleteable, useListenable } from '@baleada/vue-composition'
import { useSymbol } from '../symbols'

export default {
  setup () {
    const completeable = inject(useSymbol('string', 'completeable')),
          status = inject(useSymbol('string', 'status')),
          keycombos = inject(useSymbol('markdown', 'keycombos'))

    // Inline segment wrappers
    const inline = useCompleteable(completeable.value.string, { segments: { from: 'divider', to: 'divider' }, divider: /\s/ }),
          bold = {
            complete: () => {
              inline.value.complete(`**${inline.value.segment}**`).string
              completeable.value.setString(inline.value.string).setSelection(inline.value.selection)
            },
            keycombo: useListenable(keycombos.bold),
          },
          italic = {
            complete: () => (markdown.value = inline.value.complete(`_${inline.value.segment}_`).string),
            keycombo: useListenable(keycombos.italic),
          },
          superscript = {
            complete: () => (markdown.value = inline.value.complete(`^${inline.value.segment}^`).string),
            keycombo: useListenable(keycombos.superscript),
          },
          subscript = {
            complete: () => (markdown.value = inline.value.complete(`~${inline.value.segment}~`).string),
            keycombo: useListenable(keycombos.subscript),
          },
          strikethrough = {
            complete: () => (markdown.value = inline.value.complete(`~~${inline.value.segment}~~`).string),
            keycombo: useListenable(keycombos.strikethrough),
          },
          inlineCode = {
            complete: () => (markdown.value = inline.value.complete(`\`${inline.value.segment}\``).string),
            keycombo: useListenable(keycombos.inlineCode),
          },
          link = {
            complete: () => (markdown.value = inline.value.complete(`[${inline.value.segment}]()`).string),
            keycombo: useListenable(keycombos.link),
          }

    watchEffect(() => inline.value.setString(completeable.value.string).setSelection(completeable.value.selection))

    // onMounted(() => {
    //   [bold, italic, superscript, subscript, strikethrough, inlineCode].forEach(inlineSegmentWrapper => {
    //     inlineSegmentWrapper.keycombo.value.listen(event => inlineSegmentWrapper.complete(), { target: textarea.value })
    //   })
    // })

    // Block segment wrappers
    const block = useCompleteable('', { segments: { from: 'divider', to: 'divider' }, divider: /\n/ })
  
    // codeFence
    // blockquote
    // table
    // proseStuff
    // image

    provide(useSymbol('markdown', 'bold'), bold.complete)
    provide(useSymbol('markdown', 'italic'), italic.complete)
    provide(useSymbol('markdown', 'superscript'), superscript.complete)
    provide(useSymbol('markdown', 'subscript'), subscript.complete)
    provide(useSymbol('markdown', 'strikethrough'), strikethrough.complete)
    provide(useSymbol('markdown', 'inlineCode'), inlineCode.complete)
    provide(useSymbol('markdown', 'link'), link.complete)

    return {
      status,
      completeable,
      bold: ref(bold.complete),
      italic: ref(italic.complete),
      superscript: ref(superscript.complete),
      subscript: ref(subscript.complete),
      strikethrough: ref(strikethrough.complete),
      inlineCode: ref(inlineCode.complete),
      link: ref(link.complete),
    }
  }
}
</script>