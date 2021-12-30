import process from 'node:process';
import fs from 'node:fs';
import path from 'node:path';
import alfy from 'alfy';

export function createFolders() {
	let folder = alfy.input;
	const names = process.env.filenames?.split('\n').map(element => element.trim()).filter(element => Boolean(element));

	const stat = fs.lstatSync(folder);
	if (stat.isFile()) {
		folder = path.dirname(folder);
	}

	for (const name of names) {
		const dir = path.join(folder, name);
		console.log(`Creating: ${dir}`);
		try {
			if (fs.existsSync(dir)) {
				console.log(`Exists: ${dir}`);
			} else {
				fs.mkdirSync(dir);
				console.log(`Created: ${dir}`);
			}
		} catch (error) {
			console.log(error);
		}
	}
}
