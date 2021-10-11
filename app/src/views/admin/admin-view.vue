<template>
	<n-page-header>
		<n-divider />
		<slot />
		<template #title>
			<router-link to="/" style="text-decoration: none; color: inherit">
				<img class="logo" src="/supaflare.png" />
			</router-link>
		</template>
		<template #extra>
			<n-config-provider :theme-overrides="navThemeOverrides">
				<n-space item-style="padding-left:20px">
					<n-button
						:text-color="navActive(navLinks.create_link)"
						:bordered="false"
						style="padding: 0 4px"
						@click="navClicked(navLinks.create_link)"
					>
						<b>{{ navLinks.create_link }}</b>
					</n-button>
					<n-button
						:text-color="navActive(navLinks.manage_links)"
						:bordered="false"
						style="padding: 0 4px"
						@click="navClicked(navLinks.manage_links)"
					>
						<b>{{ navLinks.manage_links }}</b>
					</n-button>
					<n-button type="error" dashed @click="navClicked(navLinks.sign_out)">
						<b>{{ navLinks.sign_out }}</b>
					</n-button>
				</n-space>
			</n-config-provider>
		</template>
		<template #footer>
			<div class="footer">
				<a href="https://opensource.org/licenses/MIT">MIT Licensed</a>. &copy;
				{{ currentYear }}
				<b><n-a href="https://github.com/sponsors/licitdev" target="_blank">licitdev</n-a></b>
			</div>
		</template>
	</n-page-header>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { NPageHeader, NSpace, NButton, NA, NConfigProvider, NDivider } from 'naive-ui';
import { handleSignOut } from '@/services/auth';

export default defineComponent({
	components: {
		NPageHeader,
		NSpace,
		NButton,
		NA,
		NConfigProvider,
		NDivider,
	},
	setup() {
		const router = useRouter();
		const currentYear = new Date().getFullYear();
		const activeNav = ref('');
		const navLinks = {
			dashboard: 'Dashboard',
			create_link: 'Create Link',
			manage_links: 'Manage Links',
			settings: 'Settings',
			sign_out: 'Sign Out',
		};

		/**
		 * @type import('naive-ui').GlobalThemeOverrides
		 */
		const navThemeOverrides = {
			Button: {
				textColorHover: '#f48120',
				rippleColor: '#f48120',
			},
		};

		const navActive = (type: any) => {
			if (router.currentRoute.value.name === type) {
				return '#f48120';
			}
			return '';
		};

		const navClicked = (type: string) => {
			activeNav.value = type;
			switch (type) {
				case navLinks.create_link:
					router.push('/link/create');
					break;
				case navLinks.dashboard:
					router.push('/dashboard');
					break;
				case navLinks.manage_links:
					router.push('/links');
					break;
				case navLinks.settings:
					router.push('/settings');
					break;
				case navLinks.sign_out:
					handleSignOut();
					router.push('/');
					break;
				default:
					break;
			}
		};

		return {
			currentYear,
			navLinks,
			navActive,
			navClicked,
			navThemeOverrides,
			handleSignOut,
		};
	},
});
</script>

<style lang="scss" scoped>
.logo {
	height: 72px;
}

.footer {
	padding-top: 40px;
}
</style>
