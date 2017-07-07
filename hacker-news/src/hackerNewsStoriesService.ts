import request from '@dojo/core/request';
import Promise from '@dojo/shim/Promise';
import * as firebase from 'firebase';
import { Item, story_type, TypeCount } from "./interfaces";

const DB_NAME = 'dojo2HackerNewsPWA';
const STORY_TYPES: story_type[] = [ 'top', 'new', 'best', 'ask', 'show', 'jobs' ];
const HACKER_NEWS_API_BASE = 'https://hacker-news.firebaseio.com/';
const MAX_COUNTS: { [ key in story_type ]: number } = {
	top: 500,
	new: 500,
	best: 500,
	ask: 200,
	show: 200,
	jobs: 200
};
let hasData = false;

const database = firebase.initializeApp({ databaseURL: HACKER_NEWS_API_BASE }).database();

function getStoryRef(type: story_type) {
	return database.ref(`/v0/${type === 'jobs' ? type.slice(0, -1) : type}stories`);
}

function getItem(index: number, id: string): Promise<Item | null> {
	return request.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
		.then((response) => response.text())
		.then((text) => JSON.parse(text))
		.then((item) => {
			if (item) {
				item.order = index;
				item.updated = Date.now();
			}

			return item;
		});
}

export function getNumberOfStoriesForView(view: story_type): Promise<number> {
	return Promise.resolve(MAX_COUNTS[view]);
}

export function getStoriesForView(view: story_type, page: number, pageSize: number): Promise<Item[]> {
	const start = (page - 1) * pageSize;
	const end = start + pageSize;


	return new Promise<Item[]>((resolve, reject) => {
		getStoryRef(view).once(
			'value',
			(snapshot) => {
				const allIds: string[] = (snapshot.val() || []);
				MAX_COUNTS[view] = allIds.length;
				const ids: string[] = allIds.slice(start, end);
				Promise.all(ids.map((id, index) => getItem(index, id)))
					.then<Item[]>((items) => items.filter((item) => item) as Item[], reject)
					.then(resolve, reject);
			},
			reject
		);
	});
}

export function startUpdates() {
	database.ref(`/v0/updates/`).on('value', (snapshot) => {
		const value = snapshot && snapshot.val();
		value && value.items && value.items.forEach((id: string) => {
			request.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
		});
	});
}

