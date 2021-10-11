import { ref } from 'vue';
import { supabase } from '@/services/supabase';
import { Session, Provider, UserCredentials } from '@supabase/gotrue-js/dist/main/lib/types';

async function handleSignIn(credentials: UserCredentials) {
	const { error, user } = await supabase.auth.signIn({
		email: credentials.email,
		password: credentials.password,
	});
	return { error, user };
}

async function handleSignup(credentials: UserCredentials) {
	const { email, password } = credentials;
	const { error } = await supabase.auth.signUp({ email, password });
	return { error };
}

async function handleOAuthLogin(provider: Provider) {
	const { error } = await supabase.auth.signIn({ provider });
	return { error };
}

async function handlePasswordReset(credentials: UserCredentials) {
	const { email } = credentials;
	const { error } = await supabase.auth.api.resetPasswordForEmail(String(email));
	return { error };
}

async function handleUpdateUser(credentials: UserCredentials) {
	const { error } = await supabase.auth.update(credentials);

	return { error };
}

async function handleSignOut() {
	const { error } = await supabase.auth.signOut();
	return { error };
}

export {
	handleSignIn,
	handleOAuthLogin,
	handleSignup,
	handleSignOut,
	handlePasswordReset,
	handleUpdateUser,
};
