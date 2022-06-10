import { createApp } from 'vue'
import App from './App.vue'
import '@layui/layui-vue/lib/index.css'
import Layui from '@layui/layui-vue'

const app = createApp(App)

app.use(Layui).mount('#app')
