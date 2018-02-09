const fs = require('fs');

var deleteFolderRecursive = function(path) {
  if( fs.existsSync(path) ) {
      fs.readdirSync(path).forEach(function(file) {
        var curPath = path + "/" + file;
          if(fs.statSync(curPath).isDirectory()) { // recurse
              deleteFolderRecursive(curPath);
          } else { // delete file
              fs.unlinkSync(curPath);
          }
      });
      fs.rmdirSync(path);
    }
};

function BackUpFolder(rootBuFolder){
	this.rootBuFolder = rootBuFolder;
}

BackUpFolder.prototype.getDbs = function() {

	const rFolder = this.rootBuFolder;
	let databaseList = [];

	var returnedFolders = fs.readdirSync(rFolder);
	returnedFolders.forEach(function(folder){
		const db = folder.substring(0, folder.indexOf('-'));
		if(databaseList.indexOf(db) == -1){
			databaseList.push(db);
		}
	});

	return databaseList;

};

BackUpFolder.prototype.removeOldBackups = function(db, noOfBackups) {
	
	const rFolder = this.rootBuFolder;
	let backups = [];

	fs.readdirSync(this.rootBuFolder).forEach(function(folder){
		if(db === folder.substring(0, folder.indexOf('-'))){
			backups.push({
				folder: folder,
				date: fs.statSync(rFolder + '/' + folder).ctime,
				path: rFolder + '/' + folder
			});
		}
	});

	backups.sort(function(a, b){
		if(a.date < b.date){
			return -1;
		}
		if(a.date > b.date){
			return 1;
		}
		return 0;
	});

	if(backups.length > noOfBackups){
		const size = backups.length - noOfBackups;
		for(i=0; i<size; i++){
			deleteFolderRecursive(backups[i].path);
		}	
	}

};

module.exports = BackUpFolder;