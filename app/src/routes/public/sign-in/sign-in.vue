<template>
	<public-view>
		<div id="content">
			<n-form ref="formRef" :model="model" :rules="rules">
				<img class="logo" src="/supaflare.png" />
				<h1>Sign In</h1>
				<n-form-item path="email" label="Email">
					<n-input v-model:value="model.email" placeholder="Enter Email" @keydown.enter="handleValidateButtonClick" />
				</n-form-item>
				<n-form-item path="password" label="Password">
					<n-input
						v-model:value="model.password"
						type="password"
						placeholder="Enter Password"
						@keydown.enter="handleValidateButtonClick"
					/>
				</n-form-item>
				<div style="display: flex; justify-content: flex-end">
					<n-button round type="primary" @click="handleValidateButtonClick">
						<span v-if="model.password">Sign In</span>
						<span v-else>Send Magic Link</span>
					</n-button>
				</div>
				<n-divider title-placement="left">Or continue with</n-divider>
				<n-space justify="space-around">
					<n-button @click="oauthLogin('github')">
						<template #icon>
							<n-icon>
								<github />
							</n-icon>
						</template>
						GitHub
					</n-button>
					<n-button @click="unactivatedOAuth">
						<template #icon>
							<n-icon>
								<google />
							</n-icon>
						</template>
						Google
					</n-button>
					<n-button @click="unactivatedOAuth">
						<template #icon>
							<n-icon>
								<twitter />
							</n-icon>
						</template>
						Twitter
					</n-button>
				</n-space>
			</n-form>
		</div>
	</public-view>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { handleSignIn, handleOAuthLogin } from '@/services/auth';
import { useMessage, NForm, NFormItem, NInput, NButton, NDivider, NSpace, NIcon } from 'naive-ui';
import { Github, Google, Twitter } from '@vicons/fa';
import { router } from '@/router';

export default defineComponent({
	name: 'Auth',
	components: {
		NForm,
		NFormItem,
		NInput,
		NButton,
		NDivider,
		NSpace,
		NIcon,
		Github,
		Google,
		Twitter,
	},
	setup() {
		const messageDuration = 5000;
		const formRef = ref();
		const rPasswordFormItemRef = ref();
		const message = useMessage();
		const modelRef = ref({
			email: '',
			password: '',
		});

		const email = ref('');
		const password = ref('');

		const rules = {
			email: [
				{
					required: true,
					validator(rule: any, value: any) {
						if (!value) {
							return new Error('Email is required');
						} else if (
							!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
								value
							)
						) {
							return new Error('Please enter a valid email address');
						}
						return true;
					},
					trigger: ['input', 'blur'],
				},
			],
			password: [
				{
					validator(rule: any, value: any) {
						if (value && value.length < 6) {
							return new Error('Invalid Password');
						}
						return true;
					},
					trigger: ['input', 'blur'],
				},
			],
		};

		async function oauthLogin(provider: any) {
			try {
				const { error } = await handleOAuthLogin(provider);
				if (error) throw error;
			} catch (error) {
				message.error('Error authenticating with ' + provider + '...', { duration: messageDuration });
			}
		}

		function unactivatedOAuth() {
			message.error('This OAuth method is not enabled. For display purposes only.', { duration: messageDuration });
		}

		function handleValidateButtonClick(e: any) {
			e.preventDefault();
			if (formRef.value) {
				formRef.value.validate(async (error: any) => {
					if (!error) {
						try {
							const { error, user } = await handleSignIn({
								email: modelRef.value.email,
								password: modelRef.value.password,
							});
							if (error) throw error;
							if (user) {
								router.push('/links');
							} else {
								message.success('Magic Link sent to your email!', { duration: messageDuration });
							}
						} catch (error) {
							message.error('Error signing in...', { duration: messageDuration });
						}
					} else {
						message.error('Please confirm your sign in details...', { duration: messageDuration });
					}
				});
			}
		}

		return {
			email,
			password,
			oauthLogin,
			unactivatedOAuth,
			formRef,
			rPasswordFormItemRef,
			model: modelRef,
			rules,
			handleValidateButtonClick,
		};
	},
});
</script>

<style scoped>
.logo {
	width: 300px;
	margin-bottom: 50px;
}
#content {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	text-align: center;
}

form {
	width: 400px;
}
input {
	text-align: center;
	font-size: 20px;
}
h1 {
	text-align: left;
}
</style>
