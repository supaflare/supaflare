import { createApp } from 'vue';
import App from '@/App.vue';
import { router } from '@/router';
import { loadViews } from '@/views/load';
import { createPinia } from 'pinia';


const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.use(router);
loadViews(app);
app.mount('#app');
