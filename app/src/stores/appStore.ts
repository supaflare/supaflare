import { defineStore } from 'pinia';
import { Session } from '@supabase/gotrue-js/dist/main/lib/types';
import { ref } from 'vue';

export const useAppStore = defineStore('appStore', {
	state: () => {
		return {
			initialURL: ref(''),
			supabaseSession: ref<Session | null>(null),
		};
	},
});
