import { defineStore } from 'pinia';
import { Link } from '@/types/global';

export const useLinksStore = defineStore('linksStore', {
	state: () => {
		const links: Link[] = [];
		return {
			links,
		};
	},
	actions: {
		addLink(link: Link) {
			this.links.push(link as never);
		},
		updateLinks(links: Link[]) {
			this.links = links;
		},
		deleteLink(id: string) {
			this.links = this.links.filter(link => link.id !== id);
		},
	},
});
