<template>
	<admin-view>
		<h1>Manage Links</h1>
		<n-data-table
			ref="tableRef"
			class="centered-view"
			:row-key="rowKey"
			:loading="loadingRef"
			:columns="columns"
			:data="links"
			:pagination="pagination"
		/>

		<n-modal
			v-model:show="showEditModal"
			preset="card"
			:style="{ width: '600px' }"
			title="Modal"
			:bordered="false"
			size="huge"
			:segmented="{
				content: 'soft',
				footer: 'soft',
			}"
			:closable="false"
			:mask-closable="false"
		>
			<template #header>
				<div>Edit Link</div>
			</template>
			<div>
				<n-spin :show="showLoadingSpinner">
					<n-form ref="formRef" class="centered-form" :model="model" :rules="rules">
						<n-form-item path="url" label="URL">
							<n-input
								v-model:value="model.url_raw"
								class="url-input"
								pair
								clearable
								separator="://"
								:placeholder="['Protocol', 'Web Address']"
								@change="handleUrlUpdate"
								@update:value="handleUrlUpdate"
							></n-input>
						</n-form-item>
						<n-row>
							<n-form-item ref="slugRef" path="slug" label="Slug" style="flex-grow: 1">
								<n-input-group>
									<n-input-group-label class="slug-input-inline">/</n-input-group-label>
									<n-input v-model:value="model.slug" class="slug-input" placeholder="Enter Slug" />
								</n-input-group>
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
								clearable
								separator="://"
								:placeholder="['Protocol', 'Web Address']"
								@change="handleAndroidUrlUpdate"
								@update:value="handleAndroidUrlUpdate"
							></n-input>
						</n-form-item>
						<n-form-item path="ios_url" label="iOS URL" style="flex-grow: 1">
							<n-input
								v-model:value="model.ios_url_raw"
								class="url-input"
								pair
								clearable
								separator="://"
								:placeholder="['Protocol', 'Web Address']"
								@change="handleIosUrlUpdate"
								@update:value="handleIosUrlUpdate"
							></n-input>
						</n-form-item>
					</n-form>
				</n-spin>
			</div>
			<template #footer>
				<div>
					<n-button type="primary" :disabled="showLoadingSpinner" @click="handleSaveEdits">Update</n-button
					><n-button style="margin-left: 20px" :disabled="showLoadingSpinner" @click="showEditModal = false"
						>Cancel</n-button
					>
				</div>
			</template>
		</n-modal>
	</admin-view>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted, h, computed } from 'vue';
import { fetchLinks, editLink, deleteLink } from '@/services/links';
import {
	useMessage,
	useDialog,
	NDataTable,
	NButton,
	NModal,
	NSpin,
	NForm,
	NFormItem,
	NInput,
	NInputGroup,
	NInputGroupLabel,
	NIcon,
	NRow,
} from 'naive-ui';
import { Sync } from '@vicons/fa';
import { useLinksStore } from '@/stores/linksStore';
import { Link } from '@/types/global';
import { customAlphabet } from 'nanoid';

export default defineComponent({
	components: {
		NDataTable,
		NModal,
		NSpin,
		NButton,
		NForm,
		NFormItem,
		NInput,
		NInputGroup,
		NInputGroupLabel,
		NIcon,
		NRow,
		Sync,
	},
	setup() {
		const slugRef = ref();
		const messageDuration = 5000;
		const linksStore = useLinksStore();
		const message = useMessage();
		const dialog = useDialog();
		const formRef = ref();
		const tableRef = ref();
		const loadingRef = ref(true);
		const links = ref<Link[] | []>([]);
		const showEditModal = ref(false);
		const showLoadingSpinner = ref(false);

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
		const editRowRef = ref();

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
						if (value.length > 50) {
							return new Error('Slug has to be 50 characters or below.');
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
			try {
				await slugRef.value.validate();
			} catch (error) {
				return;
			}
		}

		async function handleSaveEdits() {
			try {
				await formRef.value.validate();
			} catch (error) {
				return;
			}
			try {
				showLoadingSpinner.value = true;
				const { error } = await editLink(editRowRef.value, {
					url: modelRef.value.url,
					slug: modelRef.value.slug,
					meta: {
						android_url: modelRef.value.android_url,
						ios_url: modelRef.value.ios_url,
					},
				});
				if (error) throw error;

				for (let link of links.value) {
					if (link.id === editRowRef.value.id) {
						link.url = modelRef.value.url;
						link.slug = modelRef.value.slug;
						link.meta = {
							android_url: modelRef.value.android_url,
							ios_url: modelRef.value.ios_url,
						};
					}
				}

				message.success('Link successfully updated!', { duration: messageDuration });
				showEditModal.value = false;
			} catch (error: any) {
				if (error.code == '23505') {
					message.error('Slug already exists. Please change the slug.', { duration: messageDuration });
				} else {
					message.error('Error updating link...', { duration: messageDuration });
				}
			} finally {
				showLoadingSpinner.value = false;
			}
		}

		const columns: any = [
			{
				title: 'URL',
				key: 'url',
				render(row: any) {
					return h(
						'a',
						{
							href: row.url,
							target: '_blank',
						},
						{ default: () => row.url }
					);
				},
			},
			{
				title: 'Slug',
				key: 'slug',
				render(row: any) {
					return h('b', {}, { default: () => '/' + row.slug });
				},
			},
			{
				title: 'Android URL',
				key: 'meta.android_url',
				render(row: any) {
					return h(
						'a',
						{
							href: row.meta.android_url,
							target: '_blank',
						},
						{ default: () => row.meta.android_url }
					);
				},
			},
			{
				title: 'iOS URL',
				key: 'meta.ios_url',
				render(row: any) {
					return h(
						'a',
						{
							href: row.meta.ios_url,
							target: '_blank',
						},
						{ default: () => row.meta.ios_url }
					);
				},
			},
			{
				title: 'Action',
				key: 'actions',
				width: '150px',
				render(row: any) {
					return h('div', [
						h(
							NButton,
							{
								size: 'small',
								onClick: () => handleEditLink(row),
							},
							{ default: () => 'Edit' }
						),
						h(
							NButton,
							{
								size: 'small',
								type: 'error',
								style: 'margin-left: 10px',
								onClick: () => handleDeleteLink(row),
							},
							{ default: () => 'Delete' }
						),
					]);
				},
			},
		];

		const rowKey = () => {
			return 'id';
		};

		const paginationReactive = reactive({
			page: 1,
			pageSize: 10,
			showSizePicker: true,
			pageSizes: [10, 20, 30],
			onChange: (page: any) => {
				paginationReactive.page = page;
			},
			onPageSizeChange: (pageSize: any) => {
				paginationReactive.pageSize = pageSize;
				paginationReactive.page = 1;
			},
		});

		getLatestLinks();

		async function getLatestLinks() {
			try {
				const { data, error } = await fetchLinks();
				if (error) throw error;
				linksStore.updateLinks(data || []);
			} catch (error) {
				message.error('Error fetching links...', { duration: messageDuration });
			}
		}

		function query() {
			return new Promise((resolve) => {
				(async () => {
					await getLatestLinks();
					resolve({});
				})();
			});
		}

		onMounted(() => {
			query().then(() => {
				links.value = linksStore.links;
				loadingRef.value = false;
			});
		});

		function handleEditLink(row: any) {
			editRowRef.value = row;
			modelRef.value.id = row.id;
			modelRef.value.slug = row.slug;

			if (row.url) {
				const fields = String(row.url).split('://');
				modelRef.value.url_raw = [fields[0], fields.slice(1).join('://')];
			} else {
				modelRef.value.url_raw = ['', ''];
			}
			if (row.meta.android_url) {
				const fields = String(row.meta.android_url).split('://');
				modelRef.value.android_url_raw = [fields[0], fields.slice(1).join('://')];
			} else {
				modelRef.value.android_url_raw = ['', ''];
			}
			if (row.meta.ios_url) {
				const fields = String(row.meta.ios_url).split('://');
				modelRef.value.ios_url_raw = [fields[0], fields.slice(1).join('://')];
			} else {
				modelRef.value.ios_url_raw = ['', ''];
			}

			showEditModal.value = true;
		}

		function handleDeleteLink(row: any) {
			dialog.warning({
				title: 'Confirm Delete Link',
				content: 'Are you sure you want to delete this link with slug of "' + row.slug + '"?',
				positiveText: 'Confirm',
				negativeText: 'Cancel',
				onPositiveClick: async () => {
					performDeleteLink(row);
				},
				onNegativeClick: () => {
					return;
				},
			});
		}

		async function performDeleteLink(row: any) {
			try {
				loadingRef.value = true;
				await deleteLink(row);
				linksStore.deleteLink(row);
				links.value = links.value.filter((link) => link.id !== row.id);
			} catch (error) {
				message.error('Error deleting link...', { duration: messageDuration });
			} finally {
				loadingRef.value = false;
				message.success('Link successfully deleted!');
			}
		}

		function handleUrlUpdate(val: any) {
			if (String(val[0]).includes('://')) {
				const splits = String(val[0]).split('://');
				if (splits.length > 1) {
					modelRef.value.url_raw[0] = splits[0];
					modelRef.value.url_raw[1] = splits.slice(1).join('://');
				}
			} else if (String(val[1]).includes('://')) {
				const splits = String(val[1]).split('://');
				if (splits.length > 1) {
					if (!val[0] || val[0] === splits[0]) {
						modelRef.value.url_raw[0] = splits[0];
						modelRef.value.url_raw[1] = splits.slice(1).join('://');
					}
				}
			}
		}

		function handleAndroidUrlUpdate(val: any) {
			if (String(val[0]).includes('://')) {
				const splits = String(val[0]).split('://');
				if (splits.length > 1) {
					modelRef.value.android_url_raw[0] = splits[0];
					modelRef.value.android_url_raw[1] = splits.slice(1).join('://');
				}
			} else if (String(val[1]).includes('://')) {
				const splits = String(val[1]).split('://');
				if (splits.length > 1) {
					if (!val[0] || val[0] === splits[0]) {
						modelRef.value.android_url_raw[0] = splits[0];
						modelRef.value.android_url_raw[1] = splits.slice(1).join('://');
					}
				}
			}
		}

		function handleIosUrlUpdate(val: any) {
			if (String(val[0]).includes('://')) {
				const splits = String(val[0]).split('://');
				if (splits.length > 1) {
					modelRef.value.ios_url_raw[0] = splits[0];
					modelRef.value.ios_url_raw[1] = splits.slice(1).join('://');
				}
			} else if (String(val[1]).includes('://')) {
				const splits = String(val[1]).split('://');
				if (splits.length > 1) {
					if (!val[0] || val[0] === splits[0]) {
						modelRef.value.ios_url_raw[0] = splits[0];
						modelRef.value.ios_url_raw[1] = splits.slice(1).join('://');
					}
				}
			}
		}

		return {
			slugRef,
			formRef,
			tableRef,
			loadingRef,
			rowKey,
			columns,
			links,
			pagination: paginationReactive,
			showEditModal,
			model: modelRef,
			rules,
			showLoadingSpinner,
			handleGenerateSlug,
			handleEditLink,
			handleSaveEdits,
			handleUrlUpdate,
			handleAndroidUrlUpdate,
			handleIosUrlUpdate,
		};
	},
});
</script>

<style scoped>
.centered-view {
	margin: 0 auto;
}

.centered-form {
	width: 500px;
	margin: 0 auto;
}

.slug-input {
	text-align: center;
}

.slug-input-inline {
	width: '33%';
	text-align: 'right';
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
