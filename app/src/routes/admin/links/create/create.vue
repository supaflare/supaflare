<template>
	<admin-view>
		<h1>Create Link</h1>
		<n-form ref="formRef" class="centered-form" :model="model" :rules="rules">
			<n-form-item path="url" label="URL">
				<n-input v-model:value="model.url" placeholder="Enter URL" />
			</n-form-item>
			<n-row>
				<n-form-item path="slug" label="Slug" style="flex-grow: 1">
					<n-input v-model:value="model.slug" placeholder="Enter Slug"/>
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
				<n-input v-model:value="model.android_url" placeholder="Enter Android URL"/>
			</n-form-item>
			<n-form-item path="ios_url" label="iOS URL" style="flex-grow: 1">
				<n-input v-model:value="model.ios_url" placeholder="Enter iOS URL"/>
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
import { defineComponent, ref } from 'vue';
import { addLink } from '@/services/links';
import { useAppStore } from '@/stores/appStore';
import { useLinksStore } from '@/stores/linksStore';
import { useMessage, NForm, NFormItem, NInput, NIcon, NButton, NRow } from 'naive-ui';
import { Plus, Sync } from '@vicons/fa';
import { customAlphabet } from 'nanoid';

export default defineComponent({
	components: { NForm, NFormItem, NInput, NIcon, NButton, NRow, Plus, Sync },
	setup() {
		const messageDuration = 5000;
		const appStore = useAppStore();
		const linksStore = useLinksStore();
		const message = useMessage();
		const modelRef = ref({
			url: '',
			slug: '',
			android_url: '',
			ios_url: '',
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
						if (value && value.length > 2083) {
							return new Error('Android URL has to be 2083 characters or below.');
						}
						return true;
					},
					trigger: ['input', 'blur'],
				},
			],
			ios_url: [
				{
					validator(rule: any, value: any) {
						if (value && value.length > 2083) {
							return new Error('iOS URL has to be 2083 characters or below.');
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
				message.success('Link successfully created!', {duration: messageDuration})
			} catch (error: any) {
				if (error.code == '23505') {
					message.error('Slug already exists. Please change the slug.', { duration: messageDuration });
				} else {
					message.error('Error creating link...', { duration: messageDuration });
				}
			}
		}

		function resetForm(){
			modelRef.value.url = '';
			modelRef.value.slug = '';
			modelRef.value.android_url = '';
			modelRef.value.ios_url = '';
		}

		return { model: modelRef, rules, handleGenerateSlug, handleCreateLink };
	},
});
</script>

<style scoped>
.centered-form {
	width: 500px;
	margin: 0 auto;
}
</style>
