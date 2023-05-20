import { marked, Renderer } from 'marked'
import hljs from 'highlight.js'

const rule = /(?:http(?:s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+/

const renderer = new Renderer()

renderer.link = (href, title, text) => {
    const result = href?.match(rule)
    let link = href
    if (result && result.length > 0) {
        link = result[0]
    }
    return `<a href="${link}">${text}</a>`
}

renderer.code = (code, lang) => {
    let content = ''
    try {
        const result = hljs.highlightAuto(code, lang ? [lang] : undefined)
        lang = result.language ?? 'plaintext'
        content = result.value
    } catch (e) {
        console.error(e)
        lang = 'plaintext'
        content = code
    }

    return `<pre><div class="language">${lang}</div><code class="hljs language-${lang}">${content}</code></pre>`
}

marked.setOptions({
    renderer: renderer,
    breaks: true,
    headerIds: false,
    mangle: false
})

export default (s: string): string => {
    return marked(s)
}
