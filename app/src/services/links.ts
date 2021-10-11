import { supabase } from '@/services/supabase';
import { Link } from '@/types/global';
import axios, { Axios } from 'axios';
import { useAppStore } from '@/stores/appStore';

const supaflareWorkerUpdateURL = import.meta.env.VITE_SUPAFLARE_WORKER_URL + '/supaflare_cfw_update';
const appStore = useAppStore();

const options = {
	headers: {
		'content-type': 'application/json',
	},
};

async function fetchLinks() {
	const { data, error } = await supabase.from('links').select('*').order('inserted_at', { ascending: false });
	return { data, error };
}

async function addLink(link: Link) {
	const { data, error } = await supabase.from('links').insert(link).single();
	await axios.post(
		supaflareWorkerUpdateURL,
		{ token: appStore.supabaseSession!.access_token, link_id: data.id },
		options
	);
	return { data, error };
}

async function editLink(link: Link, edits: any) {
	const { error } = await supabase.from('links').update(edits).eq('id', link.id).single();
	await axios.post(
		supaflareWorkerUpdateURL,
		{ token: appStore.supabaseSession!.access_token, link_id: link.id },
		options
	);
	return { error };
}

async function deleteLink(link: Link) {
	await supabase.from('links').delete().eq('id', link.id);
	await axios.post(
		supaflareWorkerUpdateURL,
		{ token: appStore.supabaseSession!.access_token, link_id: link.id, slug: link.slug },
		options
	);
}

export { fetchLinks, addLink, editLink, deleteLink };
