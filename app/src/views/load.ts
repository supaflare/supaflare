import { App, defineAsyncComponent } from 'vue';
import PublicView from './public';

const AdminView = defineAsyncComponent(() => import('./admin'));

export function loadViews(app: App): void {
	app.component('AdminView', AdminView);
	app.component('PublicView', PublicView);
}
