<template>
	<n-config-provider id="View" :theme-overrides="appThemeOverrides">
		<n-message-provider>
			<n-dialog-provider>
				<router-view />
			</n-dialog-provider>
		</n-message-provider>
	</n-config-provider>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { NConfigProvider, NMessageProvider, NDialogProvider } from 'naive-ui';

export default defineComponent({
	components: {
		NConfigProvider,
		NMessageProvider,
		NDialogProvider,
	},
	setup() {
		/**
		 * @type import('naive-ui').GlobalThemeOverrides
		 */
		const appThemeOverrides = {
			common: {
				primaryColor: '#3ecf8e',
				warningColor: '#f48120',
			},
		};

		return { appThemeOverrides };
	},
});
</script>

<style>
html,
body,
#app,
#View {
	margin: 0;
	height: 100%;
}

#View {
	min-width: 800px;
	max-width: 1280px;
	margin: 0 auto;
}

.n-page-header-wrapper {
	min-height: 100%;
	display: flex;
	flex-direction: column;
	margin: 0 30px;
}

.n-page-header {
	padding: 20px 0;
}

.n-page-header-wrapper {
	min-height: 100%;
	display: flex;
	flex-direction: column;
	margin: 0 30px;
}

.n-page-header {
	padding: 20px 0;
}

.n-page-header-footer {
	padding-bottom: 10px;
}

.n-page-header-content {
	flex-grow: 1;
}

.n-page-header-content,
.n-page-header-footer {
	margin-top: -20px;
}

.n-page-header-footer {
	padding-bottom: 10px;
}
x .n-page-header-content,
.n-page-header-footer {
	margin-top: -20px;
}
</style>
