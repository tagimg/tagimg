tagImg_model = (function() {
	var _imgList = [];
	//var rectList = [];
	var __current_img_index = 0;
	clearImgs = function() {
		_imgList = [];
		_current_img_index = 0;
	};
	addImg = function(imgName, imgSrc, rectList,width,height,depth) {
		img = {};
		img.src = imgSrc;
		img.name = null == imgName ? imgSrc.substr(imgSrc.lastIndexOf("/")+1) : imgName;
		img.width=width;
		img.height=height;
		img.depth=depth;
		if(!rectList)
			rectList = [];
		img.rectList = rectList;
		_imgList.push(img);
	};
	addImgs = function(imgList) {
		if(null == imgList || imgList.length < 1)
			return;
		var img = null;

		for(var i = 0; i < imgList.length; i++) {
			img = imgList[i];
			if(null == img)
				continue;
			if(null == img.rectList)
				img.rectList = [];
			_imgList.push(img);
		}
	};
	prevImg = function() {
		if(_current_img_index > 0)
			_current_img_index -= 1;
	};
	nextImg = function() {
		if(_current_img_index < _imgList.length - 1)
			_current_img_index += 1;
	};
	gotoImg=function(index){
		if(index > 0&&index<_imgList.length)
			_current_img_index = index;
	};
	getCurrentImgIndex=function(){
		return _current_img_index;
	};
	getCurrentImg = function() {
		if(!_imgList || _imgList.length < 1)
			return null;
		return _imgList[_current_img_index];
	};
	getAllImgs = function() {
		return _imgList;
	};
	addRect = function(x, y, width, height, label) {
		if(_imgList.length < 1)
			return null;
		var img = _imgList[_current_img_index];
		var rectList = img.rectList;
		var rect = {};
		rect.x = x;
		rect.y = y;
		rect.width = width;
		rect.height = height;
		rect.label = label;
		rect.id = generateRectId();
		console.log("addRect:" + x + "," + y + "," + width + "," + height + "," + label + "," + rect.id);
		rectList.push(rect);
		return rect.id;
	};
	deleteRect = function(id) {
		if(_imgList.length < 1)
			return null;
		var img = _imgList[_current_img_index];
		var rectList = img.rectList;

		var newRectList = []
		var rect = null;

		for(var i in rectList) {
			rect = rectList[i];
			if(id != rect.id) {
				newRectList.push(rect);
			}
		}
		img.rectList = newRectList;
	};
	editRect = function(id, x, y, width, height, label) {

		var rect = getRect(id)
		if(null != rect) {
			if(null != x)
				rect.x = x;
			if(null != y)
				rect.y = y;
			if(null != width)
				rect.width = width;
			if(null != height)
				rect.height = height;
			if(null != label)
				rect.label = label;

			//deleteRect(id);
			//addRect(rect.x, rect.y, rect.width, rect.height, rect.label);
		}
	};
	getRect = function(id) {
		if(_imgList.length < 1)
			return null;
		var img = _imgList[_current_img_index];
		var rectList = img.rectList;

		var rect = null;
		for(var i in rectList) {
			rect = rectList[i];
			//debugger;
			if(id == rect.id) {
				return rect;
			}
		}
		return null;
	}
	getRects = function(id) {
		if(_imgList.length < 1)
			return null;
		var img = _imgList[_current_img_index];
		var rectList = img.rectList;
		return restList;
	};
	generateRectId = function() {
		var index = -1;
		var rectId = -1;
		var rect = null;
		if(_imgList.length < 1)
			return null;
		var img = _imgList[_current_img_index];
		var rectList = img.rectList;

		for(var i in rectList) {
			rect = rectList[i];

			rectIndex = parseInt(rect.id.replace("rect_", ""));
			if(index < rectIndex) {
				index = rectIndex;
			}
		}
		index += 1;
		console.log("generateRectId:i=" + index)
		console.log(rectList.length);
		return "rect_" + index;
	};
	return {
		clearImgs: clearImgs,
		addImg: addImg,
		/*addImgs: addImgs,*/
		prevImg: prevImg,
		nextImg: nextImg,
		gotoImg:gotoImg,
		getAllImgs: getAllImgs,
		getCurrentImgIndex:getCurrentImgIndex,
		getCurrentImg: getCurrentImg,
		addRect: addRect,
		deleteRect: deleteRect,
		editRect: editRect,
		getRects: getRects,
		getRect: getRect,
		generateRectId: generateRectId
	};
})();