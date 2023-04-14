import { createApp } from 'vue'
import i18n from './i18n'
import stores from "./stores";
import routes from "./routes";

import './styles/index.scss'
import App from './App.vue'

const app = createApp(App)

app.use(i18n)
app.use(stores)
app.use(routes)

app.mount('body')
