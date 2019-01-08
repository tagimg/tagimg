tagImg_dataset_voc = (function() {
	generateAnnotationXmlObjectsStr = function(rectList) {
		var returnStr = "";
		var rect=null;
		var label = null;
		var xmin, ymin, xmax, ymax;
		for(var i = 0; i < rectList.length; i++) {
			rect=rectList[i];
			label=rect.label;
			xmin=rect.x;
			ymin=rect.y;
			xmax=xmin+rect.width;
			ymax=ymin+rect.height;
			
			returnStr += "    <object>\n";
			returnStr += "        <name>"+label+"</name>\n";
			returnStr += "        <pose>Left</pose>\n";
			returnStr += "        <truncated>1</truncated>\n";
			returnStr += "        <difficult>0</difficult>\n";
			returnStr += "        <bndbox>\n";
			returnStr += "            <xmin>"+xmin+"</xmin>\n";
			returnStr += "            <ymin>"+ymin+"</ymin>\n";
			returnStr += "            <xmax>"+xmax+"</xmax>\n";
			returnStr += "            <ymax>"+ymax+"</ymax>\n";
			returnStr += "        </bndbox>\n";
			returnStr += "    </object>\n";
		}
        return returnStr;
	};
	generateAnnotationXml = function(img) {
		var imgName = img.name;
		var imgWidth = img.width;
		var imgHeight = img.height;
		var imgDepth = img.depth;
		var objectsStr = generateAnnotationXmlObjectsStr(img.rectList);

		var returnStr = "<annotation>\n";
		returnStr += "    <folder>VOC2007</folder>\n";
		returnStr += "    <filename>" + imgName + "</filename>\n";
		returnStr += "    <source>\n";
		returnStr += "        <database></database>\n";
		returnStr += "        <annotation></annotation>\n";
		returnStr += "        <image></image>\n";
		returnStr += "    </source>\n";
		returnStr += "    <size>\n";
		returnStr += "        <width>" + imgWidth + "</width>\n";
		returnStr += "        <height>" + imgHeight + "</height>\n";
		returnStr += "        <depth>" + imgDepth + "</depth>\n";
		returnStr += "    </size>\n";
		returnStr += "    <segmented>0</segmented>\n";
		returnStr += objectsStr;
		returnStr += "</annotation>\n";
		return returnStr;
	};
	generateAnnotationXmlName = function(imgName) {
		var index = imgName.lastIndexOf(".");
		var xmlName = imgName + ".xml";
		if(index >= 0) {
			xmlName = imgName.substring(0, index);
			xmlName += ".xml";
		}
		return xmlName;
	};
	generateAnnotationXmls = function() {
		var fileList = [];
		var imgList = tagImg_model.getAllImgs();
		var img = null;
		var xmlFile = null;
		for(var i = 0; i < imgList.length; i++) {
			img = imgList[i];
			xmlFile = {};
			xmlFile.type = "xml";
			xmlFile.name = generateAnnotationXmlName(img.name);
			xmlFile.content = generateAnnotationXml(img);
			fileList.push(xmlFile);
		}

		return fileList;
	};
	generateImageSetsSubFolders = function() {
		var fileList = [];
		var folder = {}
		folder.type = "folder";
		folder.name = "Layout";
		folder.subFileList = [];
		fileList.push(folder);

		folder = {}
		folder.type = "folder";
		folder.name = "Main";
		folder.subFileList = [];
		fileList.push(folder);

		folder = {}
		folder.type = "folder";
		folder.name = "Segmentation";
		folder.subFileList = [];
		fileList.push(folder);
		return fileList;

	};
	generateJPEGImages = function() {
		var fileList = [];
		var imgList = tagImg_model.getAllImgs();
		var img = null;
		var image = null;
		for(var i = 0; i < imgList.length; i++) {
			img = imgList[i];
			image = {};
			image.type = "image";
			image.name = img.name;
			image.content = img.src;
			fileList.push(image);
		}

		return fileList;
	};
	generateDataSet = function() {
		var dataSetFileList = [];
		var vocdevkitFolder = {}
		vocdevkitFolder.type = "folder";
		vocdevkitFolder.name = "VOCdevkit";
		vocdevkitFolder.subFileList = [];
		dataSetFileList.push(vocdevkitFolder);

		var voc2007Folder = {}
		voc2007Folder.type = "folder";
		voc2007Folder.name = "VOC2007";
		voc2007Folder.subFileList = [];
		vocdevkitFolder.subFileList.push(voc2007Folder);

		var folder = {}
		folder.type = "folder";
		folder.name = "Annotations";
		folder.subFileList = generateAnnotationXmls();
		voc2007Folder.subFileList.push(folder);

		folder = {}
		folder.type = "folder";
		folder.name = "ImageSets";
		folder.subFileList = generateImageSetsSubFolders();
		voc2007Folder.subFileList.push(folder);

		folder = {}
		folder.type = "folder";
		folder.name = "JPEGImages";
		folder.subFileList = generateJPEGImages();
		voc2007Folder.subFileList.push(folder);

		folder = {}
		folder.type = "folder";
		folder.name = "SegmentationClass";
		folder.subFileList = [];
		voc2007Folder.subFileList.push(folder);

		folder = {}
		folder.type = "folder";
		folder.name = "SegmentationObject";
		folder.subFileList = [];
		voc2007Folder.subFileList.push(folder);

		return dataSetFileList;

	}
	return {
		generateDataSet: generateDataSet
	}

})();