import { marked } from 'marked'
import hljs from 'highlight.js'

marked.setOptions({
    highlight: function (code, lang) {
        try {
            if (lang) {
                return hljs.highlight(code, {language: lang}).value
            } else {
                return hljs.highlightAuto(code).value
            }
        } catch (error) {
            return code
        }
    },
    breaks: true
})

export default (s: string): string => {
    return marked(s)
}
