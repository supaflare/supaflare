import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = self['SUPABASE_URL'];
const SUPABASE_API_KEY = self['SUPABASE_API_KEY'];

const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);

addEventListener('fetch', async (event) => {
	const { request } = event;
	const { url } = request;

	if (request.method === 'POST' && url.includes('/supaflare_cfw_update')) {
		return event.respondWith(processUpdate(request));
	} else {
		return event.respondWith(processRedirect(request));
	}
});

async function processUpdate(request) {
	const { headers } = request;
	const contentType = headers.get('content-type') || '';
	if (contentType.includes('application/json')) {
		try {
			const requestData = await request.json();
			if (
				!requestData.token ||
				!requestData.link_id ||
				!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(requestData.link_id)
			) {
				throw Error;
			}
			supabase.auth.setAuth(requestData.token);
			const { data, error } = await supabase.from('links').select('*').eq('id', requestData.link_id);
			if (error) throw error;
			if (data.length === 0) {
				await SUPAFLARE.delete(requestData.link_id);
			} else {
				await SUPAFLARE.put('links:slug/' + data[0].slug, JSON.stringify(data[0]));
			}
			return new Response('OK');
		} catch (error) {
			return new Response('Server Error.', {
				status: 500,
			});
		}
	}
	return new Response('Forbidden.', {
		status: 403,
	});
}

async function processRedirect(request) {
	const url = new URL(request.url);
	let linkData = await SUPAFLARE.get('links:slug' + url.pathname, { type: 'json' });
	if (!linkData) {
		return new Response('Not Found.', {
			status: 404,
		});
	} else {
		const userAgent = request.headers.get('User-Agent') || '';
		if (/android/i.test(userAgent) && linkData.meta.android_url) {
			return Response.redirect(linkData.meta.android_url, 302);
		} else if (/iPad|iPhone|iPod/.test(userAgent) && linkData.meta.ios_url) {
			return Response.redirect(linkData.meta.ios_url, 302);
		} else {
			return Response.redirect(linkData.url, 302);
		}
	}
}
