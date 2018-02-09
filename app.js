const backup = require('mongodb-backup');
const fs = require('fs');
const BackUpFolder = require('./backupfolder');

const dbName = process.argv[2];
const backupFolder = process.argv[3];

if(process.argv.length < 4){
	console.log('Missing arguments: need database name and path to backup folder');
	return;
}

if(!fs.existsSync(backupFolder)){
	console.log('backup foler ' + backupFolder + ' does not exist');
	return;
}

// deleteOlderBackups

const buFolder = new BackUpFolder(backupFolder);

// Create Folder and Backup

const now = new Date();
const newFolderPath = backupFolder + '/' + dbName + '-' + now.getFullYear() + '-' + now.getMonth() + '-' + now.getDate() + '-' + now.getHours() + now.getMinutes();
fs.mkdirSync(newFolderPath);
if(!fs.existsSync(newFolderPath)){
	console.log('Folder ' + newFolderPath + ' does not exist');
	return;
}

backup({
	// uri: 'mongodb://<dbuser>:<dbpassword>@<dbdomain>.mongolab.com:<dbport>/<dbdatabase>',
	uri: 'mongodb://localhost:27017/' + dbName,
	root: newFolderPath // write files into this dir
});

buFolder.removeOldBackups(dbName, 30);