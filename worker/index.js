import { createClient } from '@supabase/supabase-js';
import jwt from '@tsndr/cloudflare-worker-jwt';

addEventListener('fetch', async (event) => {
	const { request } = event;
	const { url } = request;

	if (request.method === 'OPTIONS') {
		return event.respondWith(handleOptions(request));
	} else if (request.method === 'POST' && url.includes('/supaflare_cfw_admin_update')) {
		return event.respondWith(processUpdateAdmin(request));
	} else if (request.method === 'POST' && url.includes('/supaflare_cfw_update')) {
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
			const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);
			supabase.auth.setAuth(requestData.token);
			const { data, error } = await supabase.from('links').select('*').eq('id', requestData.link_id);
			if (error) throw error;
			await updateKV(requestData, data);
			const response = new Response('OK');
			response.headers.set('Access-Control-Allow-Origin', new URL(request.headers.get('origin')));
			return response;
		} catch (error) {
			const response = new Response('Server Error.', {
				status: 500,
			});
			response.headers.set('Access-Control-Allow-Origin', new URL(request.headers.get('origin')));
			return response;
		}
	}
	return new Response('Forbidden.', {
		status: 403,
	});
}

async function processUpdateAdmin(request) {
	const { headers } = request;
	const contentType = headers.get('content-type') || '';
	if (contentType.includes('application/json')) {
		try {
			const requestData = await request.json();
			if (
				!requestData.admin_key ||
				requestData.admin_key !== SUPAFLARE_ADMIN_KEY ||
				!requestData.token ||
				!requestData.link_id ||
				!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(requestData.link_id)
			) {
				throw Error;
			}
			const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);
			if (!(await jwt.verify(requestData.token, SUPABASE_JWT_SECRET))) throw Error;
			let decodedToken = jwt.decode(requestData.token);
			decodedToken.role = 'service_role';
			const serviceRoleToken = await jwt.sign(decodedToken, SUPABASE_JWT_SECRET);
			supabase.auth.setAuth(serviceRoleToken);
			const { data, error } = await supabase.from('links').select('*').eq('id', requestData.link_id);
			if (error) throw error;
			await updateKV(requestData, data);
			const response = new Response('OK');
			response.headers.set('Access-Control-Allow-Origin', new URL(request.headers.get('origin')));
			return response;
		} catch (error) {
			const response = new Response('Server Error.', {
				status: 500,
			});
			response.headers.set('Access-Control-Allow-Origin', new URL(request.headers.get('origin')));
			return response;
		}
	}
	return new Response('Forbidden.', {
		status: 403,
	});
}

async function updateKV(requestData, data) {
	if (data.length === 0) {
		const currentSlug = await SUPAFLARE.get('links:id/' + requestData.link_id, { type: 'text' });
		const linkData = await SUPAFLARE.get('links:slug/' + currentSlug, { type: 'json' });
		if (linkData && linkData.id === requestData.link_id) {
			await SUPAFLARE.delete('links:slug/' + linkData.slug);
			await SUPAFLARE.delete('links:id/' + linkData.id);
		}
	} else {
		const currentSlug = await SUPAFLARE.get('links:id/' + requestData.link_id, { type: 'text' });
		await SUPAFLARE.put('links:slug/' + data[0].slug, JSON.stringify(data[0]));
		if (data[0].slug !== currentSlug) {
			await SUPAFLARE.put('links:id/' + requestData.link_id, data[0].slug);
			await SUPAFLARE.delete('links:slug/' + currentSlug);
		}
	}
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

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
	'Access-Control-Max-Age': '86400',
};

function handleOptions(request) {
	let headers = request.headers;
	if (
		headers.get('Origin') !== null &&
		headers.get('Access-Control-Request-Method') !== null &&
		headers.get('Access-Control-Request-Headers') !== null
	) {
		let respHeaders = {
			...corsHeaders,
			'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers'),
		};
		return new Response(null, {
			headers: respHeaders,
		});
	} else {
		return new Response(null, {
			headers: {
				Allow: 'GET, HEAD, POST, OPTIONS',
			},
		});
	}
}
