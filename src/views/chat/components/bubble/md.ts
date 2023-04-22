import { marked, Renderer } from 'marked'
import hljs from 'highlight.js'

const langs = new Map<string, string | undefined>()
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

const rule = /(?:http(?:s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+/

const renderer = new Renderer()

renderer.link = (href,  title, text) => {
    const result = href?.match(rule)
    let link = href
    if (result && result.length > 0) {
        link = result[0]
    }
    return `<a href="${link}">${text}</a>`
}

renderer.code = (code, lang) => {
    if (!lang || !hljs.getLanguage(lang)) {
        lang = langs.get(lang ?? '') || 'plaintext'
    }
    const content = hljs.highlightAuto(code, [lang]).value

    return `<div class="code-container">
                <div class="code-header">
                    <div class="controls">
                        <svg xmlns="http://www.w3.org/2000/svg" width="54" height="14" viewBox="0 0 54 14">
                            <g fill="none" fill-rule="evenodd" transform="translate(1 1)">
                                <circle cx="6" cy="6" r="6" fill="#FF5F56" stroke="#E0443E" stroke-width=".5"></circle>
                                <circle cx="26" cy="6" r="6" fill="#FFBD2E" stroke="#DEA123" stroke-width=".5"></circle>
                                <circle cx="46" cy="6" r="6" fill="#27C93F" stroke="#1AAB29" stroke-width=".5"></circle>
                            </g>
                        </svg> 
                    </div>
                    <div class="title">${lang}</div>
                    <div class="action">
                        <span class="button copy-button" data-copy-content="${encodeURIComponent(code)}">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 512 512">
                                <path fill="currentColor" d="M408 432h-32v32H112V136h32v-32H80v392h328v-64z"/>
                                <path fill="currentColor" d="M176 16v384h320V153.373L358.627 16Zm288 352H208V48h104v152h152Zm0-200H344V48h1.372L464 166.627Z"/>
                            </svg>
                        </span>
                    </div>
                </div>
                <pre class="code-body"><code class="hljs language-${lang}">${content}</code></pre>
            </div>`
}

marked.setOptions({
    renderer: renderer,
    breaks: true
})

export default (s: string): string => {
    return marked(s)
}
