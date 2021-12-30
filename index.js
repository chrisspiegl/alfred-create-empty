import hasFlag from 'has-flag';
import {createFolders} from './src/create-folders.js';
import {createFiles} from './src/create-files.js';

if (hasFlag('folders')) {
	createFolders();
} else if (hasFlag('files')) {
	createFiles();
}
