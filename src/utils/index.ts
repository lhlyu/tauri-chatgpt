import { writeText } from '@tauri-apps/api/clipboard'

export const copyContent = async (content: string) => {
    try {
        await writeText(content)
    } catch (e) {
        await navigator.clipboard.writeText(content)
    }
}
