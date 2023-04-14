import { marked } from 'marked'
import hljs from 'highlight.js'

marked.setOptions({
    highlight: function (code) {
        return hljs.highlightAuto(code).value
    }
})

export default (s: string, enable: boolean = true): string => {
    if (!enable) {
        return s
    }
    return marked(s)
}
