<template>
  <slot v-bind="{ status, completeable, complete }" />
</template>

<script>
import { ref, watchEffect, watch, onMounted, provide, inject } from 'vue'
import { useCompleteable, useListenable } from '@baleada/vue-composition'
import { useSymbol } from '../symbols'

export default {
  setup () {
    const completeable = inject(useSymbol('string', 'completeable')),
          status = inject(useSymbol('string', 'status')),
          keycombos = inject(useSymbol('markdown', 'keycombos')),
          propagate = c => completeable.value.setString(c.value.string).setSelection(c.value.selection)

    // Inline methods
    const inline = useCompleteable(completeable.value.string, { segment: { from: 'divider', to: 'divider' }, divider: /\s/ }),
          bold = {
            complete: () => {
              inline.value.complete(`**${inline.value.segment}**`)
              propagate(inline)
            },
            keycombo: useListenable(keycombos.bold),
          },
          italic = {
            complete: () => {
              inline.value.complete(`_${inline.value.segment}_`)
              propagate(inline)
            },
            keycombo: useListenable(keycombos.italic),
          },
          superscript = {
            complete: () => {
              inline.value.complete(`^${inline.value.segment}^`)
              propagate(inline)
            },
            keycombo: useListenable(keycombos.superscript),
          },
          subscript = {
            complete: () => {
              inline.value.complete(`~${inline.value.segment}~`)
              propagate(inline)
            },
            keycombo: useListenable(keycombos.subscript),
          },
          strikethrough = {
            complete: () => {
              inline.value.complete(`~~${inline.value.segment}~~`)
              propagate(inline)
            },
            keycombo: useListenable(keycombos.strikethrough),
          },
          code = {
            complete: () => {
              inline.value.complete(`\`${inline.value.segment}\``)
              propagate(inline)
            },
            keycombo: useListenable(keycombos.code),
          },
          link = {
            complete: () => {
              inline.value.complete(`[${inline.value.segment}]()`)
              propagate(inline)
            },
            keycombo: useListenable(keycombos.link),
          }

    watchEffect(() => inline.value.setString(completeable.value.string).setSelection(completeable.value.selection))

    // Block methods
    const block = useCompleteable(completeable.value.string, { segment: { from: 'divider', to: 'divider' }, divider: /\n/m }),
          codeblock = {
            complete: () => {
              block.value.complete(`\`\`\`\n${block.value.segment}\n\`\`\``)
              propagate(block)
            },
            keycombo: useListenable(keycombos.codeblock),
          },
          blockquote = {
            complete: () => {
              block.value.complete(block.value.segment.split('\n').map(line => `> ${line}`).join('\n'))
              propagate(block)
            },
            keycombo: useListenable(keycombos.blockquote),
          },
          orderedList = {
            complete: () => {
              block.value.complete(block.value.segment.split('\n').map((line, index) => `${index + 1}. ${line}`).join('\n'))
              propagate(block)
            },
            keycombo: useListenable(keycombos.orderedList),
          },
          unorderedList = {
            complete: () => {
              block.value.complete(block.value.segment.split('\n').map(line => `- ${line}`).join('\n'))
              propagate(block)
            },
            keycombo: useListenable(keycombos.unorderedList),
          },
          heading = {
            complete: (level = 1) => {
              let hashes = ''
              for (let i = 0; i < level && i < 6; i++) {
                hashes += '#'
              }
              block.value.complete(`${hashes} ${block.value.segment}`)
              propagate(block)
            },
            keycombo: useListenable(keycombos.heading),
          },
          horizontalRule = {
            complete: level => {
              block.value.complete(`${block.value.segment}${block.value.segment.length > 0 ? '\n' : ''}---\n`)
              propagate(block)
            },
            keycombo: useListenable(keycombos.horizontalRule),
          }

    watchEffect(() => block.value.setString(completeable.value.string).setSelection(completeable.value.selection))


    // Listen for keycombos
    const inputElement = inject(useSymbol('string', 'inputElement')),
          keycomboStatus = ref('ready')

    // onMounted alone wasn't working, but this workaround works
    watch([inputElement, keycomboStatus], () => {
      if (inputElement.value !== null) {
        if (keycomboStatus.value !== 'listening') {
          [bold, italic, superscript, subscript, strikethrough, code, link, codeblock, blockquote, orderedList, unorderedList, heading, horizontalRule].forEach(method => {
            method.keycombo.value.listen(event => {
              event.preventDefault()
              method.complete()
            }, { target: inputElement.value })
          })
        }
      }
    })

    const complete = {
      // inline
      bold: bold.complete,
      italic: italic.complete,
      superscript: superscript.complete,
      subscript: subscript.complete,
      strikethrough: strikethrough.complete,
      code: code.complete,
      link: link.complete,

      // block
      codeblock: codeblock.complete,
      blockquote: blockquote.complete,
      orderedList: orderedList.complete,
      unorderedList: unorderedList.complete,
      heading: heading.complete,
      horizontalRule: horizontalRule.complete,
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