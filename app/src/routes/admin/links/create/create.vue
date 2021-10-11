<template>
	<admin-view>
		<h1>Create Link</h1>
		<n-form ref="formRef" class="centered-form" :model="model" :rules="rules">
			<n-form-item path="url" label="URL">
				<n-input
					v-model:value="model.url_raw"
					class="url-input"
					pair
					separator="://"
					:placeholder="['Protocol', 'Web Address']"
				></n-input>
			</n-form-item>
			<n-row>
				<n-form-item path="slug" label="Slug" style="flex-grow: 1">
					<n-input v-model:value="model.slug" class="slug-input" placeholder="Enter Slug" />
				</n-form-item>
				<n-form-item>
					<n-button type="warning" style="margin-left: 20px" @click="handleGenerateSlug">
						<template #icon>
							<n-icon>
								<sync />
							</n-icon>
						</template>
						Generate Slug
					</n-button>
				</n-form-item>
			</n-row>
			<n-form-item path="android_url" label="Android URL" style="flex-grow: 1">
				<n-input
					v-model:value="model.android_url_raw"
					class="url-input"
					pair
					separator="://"
					:placeholder="['Protocol', 'Web Address']"
				></n-input>
			</n-form-item>
			<n-form-item path="ios_url" label="iOS URL" style="flex-grow: 1">
				<n-input
					v-model:value="model.ios_url_raw"
					class="url-input"
					pair
					separator="://"
					:placeholder="['Protocol', 'Web Address']"
				></n-input>
			</n-form-item>

			<div style="display: flex; justify-content: center">
				<n-button round type="primary" @click="handleCreateLink">
					<template #icon>
						<n-icon>
							<plus />
						</n-icon>
					</template>
					Create
				</n-button>
			</div>
		</n-form>
	</admin-view>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { addLink } from '@/services/links';
import { useAppStore } from '@/stores/appStore';
import { useLinksStore } from '@/stores/linksStore';
import { useMessage, NForm, NFormItem, NInput, NIcon, NButton, NRow } from 'naive-ui';
import { Plus, Sync } from '@vicons/fa';
import { customAlphabet } from 'nanoid';

export default defineComponent({
	components: { NForm, NFormItem, NInput, NIcon, NButton, NRow, Plus, Sync },
	setup() {
		const formRef = ref();
		const messageDuration = 5000;
		const appStore = useAppStore();
		const linksStore = useLinksStore();
		const message = useMessage();
		const modelRef: any = ref({
			url: computed(() => {
				if (!modelRef.value.url_raw[0] && !modelRef.value.url_raw[1]) return '';
				return modelRef.value.url_raw[0] + '://' + modelRef.value.url_raw[1];
			}),
			url_raw: ['', ''],
			slug: '',
			android_url: computed(() => {
				if (!modelRef.value.android_url_raw[0] && !modelRef.value.android_url_raw[1]) return '';
				return modelRef.value.android_url_raw[0] + '://' + modelRef.value.android_url_raw[1];
			}),
			android_url_raw: ['', ''],
			ios_url: computed(() => {
				if (!modelRef.value.ios_url_raw[0] && !modelRef.value.ios_url_raw[1]) return '';
				return modelRef.value.ios_url_raw[0] + '://' + modelRef.value.ios_url_raw[1];
			}),
			ios_url_raw: ['', ''],
		});

		const rules = {
			url: [
				{
					required: true,
					validator(rule: any, value: any) {
						if (!value) {
							return new Error('URL is required');
						} else if (value.length > 2083) {
							return new Error('URL has to be 2083 characters or below.');
						} else if (String(value).startsWith('://')) {
							return new Error('Please enter a protocol.');
						}
						return true;
					},
					trigger: ['input', 'blur'],
				},
			],
			slug: [
				{
					required: true,
					validator(rule: any, value: any) {
						if (!value) {
							return new Error('Slug is required');
						}
						return true;
					},
					trigger: ['input', 'blur'],
				},
			],
			android_url: [
				{
					validator(rule: any, value: any) {
						if (!value) {
							return true;
						}
						if (value.length > 2083) {
							return new Error('Android URL has to be 2083 characters or below.');
						} else if (String(value).startsWith('://')) {
							return new Error('Please enter a protocol.');
						}
						return true;
					},
					trigger: ['input', 'blur'],
				},
			],
			ios_url: [
				{
					validator(rule: any, value: any) {
						if (!value) {
							return true;
						}
						if (value.length > 2083) {
							return new Error('iOS URL has to be 2083 characters or below.');
						} else if (String(value).startsWith('://')) {
							return new Error('Please enter a protocol.');
						}
						return true;
					},
					trigger: ['input', 'blur'],
				},
			],
		};

		// Remove confusion with caps I caps O and l
		const nanoid = customAlphabet('1234567890abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ', 6);

		async function handleGenerateSlug() {
			modelRef.value.slug = nanoid();
		}

		async function handleCreateLink() {
			try {
				const { data, error } = await addLink({
					user_id: appStore.supabaseSession!.user!.id,
					url: modelRef.value.url,
					slug: modelRef.value.slug,
					meta: {
						android_url: modelRef.value.android_url,
						ios_url: modelRef.value.ios_url,
					},
				});
				if (error) throw error;

				linksStore.addLink(data);
				resetForm();
				message.success('Link successfully created!', { duration: messageDuration });
			} catch (error: any) {
				if (error.code == '23505') {
					message.error('Slug already exists. Please change the slug.', { duration: messageDuration });
				} else {
					message.error('Error creating link...', { duration: messageDuration });
				}
			}
		}

		function resetForm() {
			modelRef.value.url_raw = ['', ''];
			modelRef.value.slug = '';
			modelRef.value.android_url_raw = ['', ''];
			modelRef.value.ios_url_raw = ['', ''];
		}
		return {
			formRef,
			model: modelRef,
			rules,
			handleGenerateSlug,
			handleCreateLink,
		};
	},
});
</script>

<style scoped>
.centered-form {
	width: 500px;
	margin: 0 auto;
}

.slug-input {
	text-align: center;
}

.url-input :deep(.n-input-wrapper):first-child {
	flex-grow: 0;
	width: 80px;
}

.url-input :deep(.n-input-wrapper):first-child input {
	text-align: right;
}

.url-input :deep(.n-input-wrapper):nth-child(3) input {
	text-align: left;
}
</style>
