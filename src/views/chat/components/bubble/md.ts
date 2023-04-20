import { marked } from 'marked'
import hljs from 'highlight.js'

const langs: Map<string, string> = new Map<string, string>()
langs.set('vue', 'html')
langs.set('react', 'html')
langs.set('solid', 'html')
langs.set('svelte', 'html')
langs.set('angular', 'html')
langs.set('preact', 'html')
langs.set('vuejs', 'html')
langs.set('reactjs', 'html')
langs.set('solidjs', 'html')
langs.set('sveltejs', 'html')
langs.set('angularjs', 'html')
langs.set('preactjs', 'html')

marked.setOptions({
    highlight: function (code: string, lang: string = '') {
        try {
            if (lang) {
                if (langs.has(lang)) {
                    lang = langs.get(lang) as string
                }
                return hljs.highlight(code, { language: lang }).value
            } else {
                return hljs.highlightAuto(code).value
            }
        } catch (error) {
            console.error(error)
            return code
        }
    },
    breaks: true
})

export default (s: string): string => {
    return marked(s)
}
