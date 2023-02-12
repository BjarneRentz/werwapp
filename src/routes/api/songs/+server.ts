import type { RequestEvent } from '@sveltejs/kit';

export async function GET({ url }: RequestEvent) {
	const songUrl = url.searchParams.get('url') ?? '';

	const songData = await fetch(songUrl);
	const blob = await songData.blob();

	return new Response(blob, {
		headers: {
			'cache-control': `public, max-age=${60 * 60 * 24 * 365}`
		}
	});
}
