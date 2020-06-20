<template>
  <div>
    <slot v-bind="{ status, completeable, complete }" />
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
          keycombos = inject(useSymbol('markdown', 'keycombos')),
          set = () => completeable.value.setString(inline.value.string).setSelection(inline.value.selection)

    // Inline segment wrappers
    const inline = useCompleteable(completeable.value.string, { segments: { from: 'divider', to: 'divider' }, divider: /\s/ }),
          bold = {
            complete: () => {
              inline.value.complete(`**${inline.value.segment}**`).string
              set()
            },
            keycombo: useListenable(keycombos.bold),
          },
          italic = {
            complete: () => {
              inline.value.complete(`_${inline.value.segment}_`).string
              set()
            },
            keycombo: useListenable(keycombos.italic),
          },
          superscript = {
            complete: () => {
              inline.value.complete(`^${inline.value.segment}^`).string
              set()
            },
            keycombo: useListenable(keycombos.superscript),
          },
          subscript = {
            complete: () => {
              inline.value.complete(`~${inline.value.segment}~`).string
              set()
            },
            keycombo: useListenable(keycombos.subscript),
          },
          strikethrough = {
            complete: () => {
              inline.value.complete(`~~${inline.value.segment}~~`).string
              set()
            },
            keycombo: useListenable(keycombos.strikethrough),
          },
          inlineCode = {
            complete: () => {
              inline.value.complete(`\`${inline.value.segment}\``).string
              set()
            },
            keycombo: useListenable(keycombos.inlineCode),
          },
          link = {
            complete: () => {
              inline.value.complete(`[${inline.value.segment}]()`).string
              set()
            },
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

    const complete = {
      bold: bold.complete,
      italic: italic.complete,
      superscript: superscript.complete,
      subscript: subscript.complete,
      strikethrough: strikethrough.complete,
      inlineCode: inlineCode.complete,
      link: link.complete,
    }

    provide(useSymbol('markdown', 'complete'), complete)

    return {
      status,
      completeable,
      complete,
    }
  }
}
</script>