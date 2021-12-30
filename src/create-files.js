import process from 'node:process';
import fs from 'node:fs';
import path from 'node:path';
import alfy from 'alfy';

export function createFiles() {
	const time = new Date();
	let folder = alfy.input;
	const names = process.env.filenames?.split('\n').map(element => element.trim()).filter(element => Boolean(element));

	const stat = fs.lstatSync(folder);
	if (stat.isFile()) {
		folder = path.dirname(folder);
	}

	for (const name of names) {
		const filepath = path.join(folder, name);
		console.log(`Creating: ${filepath}`);
		try {
			fs.utimesSync(filepath, time, time);
		} catch {
			fs.closeSync(fs.openSync(filepath, 'w'));
		}
	}
}

