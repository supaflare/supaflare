import { supabase } from '@/services/supabase';
import { Link } from '@/types/global';

async function fetchLinks() {
	const { data, error } = await supabase.from('links').select('*').order('id');
	return { data, error };
}

async function addLink(link: Link) {
	const { data, error } = await supabase.from('links').insert(link).single();
	return { data, error };
}

async function editLink(link: Link, edits: any) {
	const { error } = await supabase.from('links').update(edits).eq('id', link.id).single();
	return { error };
}

async function deleteLink(link: Link) {
	await supabase.from('links').delete().eq('id', link.id);
}

export { fetchLinks, addLink, editLink, deleteLink };
