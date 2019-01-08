tagImg_jszip = (function() {
	writeFileToZip = function(parentFolder, toZipFile) {
		var type = toZipFile.type;
		if("folder" == toZipFile.type) {
			var name = toZipFile.name;
			var subFileList = toZipFile.subFileList;
			var subFile = null;
			var folder = parentFolder.folder(name);
			for(var i = 0; i < subFileList.length; i++) {
				subFile = subFileList[i];
				writeFileToZip(folder, subFile);
			}
		} else {
			var name = toZipFile.name;
			var content = toZipFile.content;
			if("image" == type) {
				if(content.indexOf("base64,")>=0){
					content = content.split('base64,')[1];
				}				
				parentFolder.file(name, content, {
					base64: true
				});
			} else {
				parentFolder.file(name, content);
			}

		}
	};
	generateZip = function(zipFileName, toZipFileList,callback) {
		var zip = new JSZip();

		var toZipFile = null;
		for(var i = 0; i < toZipFileList.length; i++) {
			toZipFile = toZipFileList[i];
			writeFileToZip(zip, toZipFile);
		}

		zip.generateAsync({
				type: "blob"
			})
			.then(function(content) {
                callback(zipFileName,content);
				//saveAs(zipFileName, content);
			});
	}
	return {
		generateZip: generateZip
	}

})();