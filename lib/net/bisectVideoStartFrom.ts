import { getLatestVideos } from "lib/net/getLatestVideos.ts";

export async function bisectVideoPageInNewList(timestamp: number): Promise<number | null> {
	const pageSize = 50;

	let lowPage = 1;
	let highPage = 1;
	let foundUpper = false;
	while (true) {
		const videos = await getLatestVideos(highPage * pageSize, 1, 250, false);
		if (!videos || videos.length === 0) {
			break;
		}
		const lastVideo = videos[0];
		if (!lastVideo || !lastVideo.published_at) {
			break;
		}
		const lastTime = Date.parse(lastVideo.published_at);
		if (lastTime <= timestamp) {
			foundUpper = true;
			break;
		} else {
			lowPage = highPage;
			highPage *= 2;
		}
	}

	if (!foundUpper) {
		return null;
	}

	let boundaryPage = highPage;
	let lo = lowPage;
	let hi = highPage;
	while (lo <= hi) {
		const mid = Math.floor((lo + hi) / 2);
		const videos = await getLatestVideos(mid * pageSize, 1, 250, false);
        if (!videos) {
            return null;
        }
		if (videos.length === 0) {
			hi = mid - 1;
			continue;
		}
		const lastVideo = videos[videos.length - 1];
		if (!lastVideo || !lastVideo.published_at) {
			hi = mid - 1;
			continue;
		}
		const lastTime = Date.parse(lastVideo.published_at);
		if (lastTime > timestamp) {
			lo = mid + 1;
		} else {
			boundaryPage = mid;
			hi = mid - 1;
		}
	}

    return boundaryPage * pageSize;
}
