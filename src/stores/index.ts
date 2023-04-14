import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { parse, stringify } from 'zipson'

const pinia = createPinia()

// 持久化插件
pinia.use(
    createPersistedState({
        serializer: {
            deserialize: parse,
            serialize: stringify
        }
    })
)

export default pinia
