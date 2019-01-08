$ = function(id) {
	return document.getElementById(id);
};

tagImg_svg = (function() {
	var operationEnum = {
		DRAWING_RECT: "1",
		DRAGING_BORDER_NODE: "2"
	};
	var start_offsetX = 0;
	var start_offsetY = 0;
	var isShowRectBorder = false;
	var isCreatedRect = false;
	var current_rect_id = null;
	var current_node_type = null;
	var isMoveOverDeleteNode = false;
	var current_operation = null;
	var prev_operation = null;
	stopBubble = function(e) {
		//如果提供了事件对象，则这是一个非IE浏览器 
		if(e && e.stopPropagation)
			//因此它支持W3C的stopPropagation()方法 
			e.stopPropagation();
		else
			//否则，我们需要使用IE的方式来取消事件冒泡 
			window.event.cancelBubble = true;
	};
	setCurrentOperation = function(operation) {
		if(current_operation != operation) {
			if(null != current_operation) {
				prev_operation = current_operation;
			}
			current_operation = operation;
		}
	};
	/*drawBorderNodePointer = function(rectId, nodeType) {
		var pointer_id = rectId + "_pointer";

		var svgWrap = $("svg_wrap");

		var nodeId = rectId + "_" + nodeType;
		node_rect = svgWrap.getElementById(nodeId);
		if(null == node_rect) {
			return;
		}
		var x = parseInt(node_rect.getAttribute("x")) + parseInt(node_rect.getAttribute("width")) / 2;
		var y = parseInt(node_rect.getAttribute("y")) + parseInt(node_rect.getAttribute("height")) / 2;

		node_pointer = svgWrap.getElementById(pointer_id);
		if(null == node_pointer) {

			node_pointer = document.createElementNS("http://www.w3.org/2000/svg", 'line');
			node_pointer.setAttribute("id", pointer_id);
			node_pointer.setAttribute("marker-end", "url(#markerArrow)");

			g = svgWrap.getElementById(rectId + "_g");
			g.appendChild(node_pointer);
		}

		node_pointer.setAttribute("style", "stroke:rgb(99,99,99);stroke-width:2");
		node_pointer.setAttribute("x1", x);
		node_pointer.setAttribute("y1", y);
		node_pointer.setAttribute("x2", x + 10);
		node_pointer.setAttribute("y2", y);
		if("top_left" == nodeType) {
			node_pointer.setAttribute("transform", "rotate(225," + x + "," + y + ")");
		}

		if("middle_left" == nodeType) {
			node_pointer.setAttribute("transform", "rotate(180," + x + "," + y + ")");
		}

		if("bottom_left" == nodeType) {
			node_pointer.setAttribute("transform", "rotate(135," + x + "," + y + ")");
		}

		if("bottom_center" == nodeType) {
			node_pointer.setAttribute("transform", "rotate(90," + x + "," + y + ")");
		}

		if("bottom_right" == nodeType) {
			node_pointer.setAttribute("transform", "rotate(45," + x + "," + y + ")");
		}

		if("middle_right" == nodeType) {
			node_pointer.setAttribute("transform", "rotate(0," + x + "," + y + ")");
		}

		if("top_center" == nodeType) {
			node_pointer.setAttribute("transform", "rotate(270," + x + "," + y + ")");
		}

	};*/
	/*hiveBorderNodePointer = function(rectId) {
		var pointer_id = rectId + "_pointer";
		var svgWrap = $("svg_wrap");
		node_pointer = svgWrap.getElementById(pointer_id);
		if(null != node_pointer) {
			node_pointer.setAttribute("style", "display:none");
		}
	};*/
	/*onBorderNodeMouseOver = function(evt) {
		console.log("onBorderNodeMouseOver");
		var node_rect = evt.target;
		var rectId = node_rect.getAttribute("rectId");
		var nodeType = node_rect.getAttribute("nodeType");

		/*var x = parseInt(evt.offsetX);
		var y = parseInt(evt.offsetY);*/

		/*drawBorderNodePointer(rectId, nodeType);
		stopBubble(evt);
	};
	onBorderNodeMouseOut = function(evt) {
		var node_rect = evt.target;
		var rectId = node_rect.getAttribute("rectId");
		hiveBorderNodePointer(rectId);
		stopBubble(evt);
	};*/
	onBorderNodeMouseDown = function(evt) {
		console.log("onBorderNodeMouseDown");
		setCurrentOperation(operationEnum.DRAGING_BORDER_NODE);
		var node_rect = evt.target;
		var rectId = node_rect.getAttribute("rectId");
		var nodeType = node_rect.getAttribute("nodeType");
		current_rect_id = rectId;
		current_node_type = nodeType;
		var svgWrap = $("svg_wrap");
		var rect = svgWrap.getElementById(rectId);
		start_offsetX = evt.offsetX;
		start_offsetY = evt.offsetY;
		var x = rect.getAttribute("x");
		var y = rect.getAttribute("y");
		var width = rect.getAttribute("width");
		var height = rect.getAttribute("height");
		rect.setAttribute("oldX", x);
		rect.setAttribute("oldY", y);
		rect.setAttribute("oldWidth", width);
		rect.setAttribute("oldHeight", height);
		stopBubble(evt);
	};
	onBorderNodeMouseMove = function(evt) {
		console.log("onBorderNodeMouseMove");
		if(current_operation != operationEnum.DRAGING_BORDER_NODE) {
			return;
		}

		var rectId = current_rect_id;
		var nodeType = current_node_type;
		var svgWrap = $("svg_wrap");
		var rect = svgWrap.getElementById(rectId);
		var current_offsetX = evt.offsetX;
		var current_offsetY = evt.offsetY;
		var width_interval = current_offsetX - start_offsetX;
		var height_interval = current_offsetY - start_offsetY;
		var old_x = parseInt(rect.getAttribute("oldX"));
		var old_y = parseInt(rect.getAttribute("oldY"));
		var old_width = parseInt(rect.getAttribute("oldWidth"));
		var old_height = parseInt(rect.getAttribute("oldHeight"));
		var x = old_x;
		var y = old_y;
		var width = old_width;
		var height = old_height;

		/*****reset rect x , y,width,height******/
		if("top_left" == nodeType) {
			x = current_offsetX;
			y = current_offsetY;
			width = old_width - width_interval;
			height = old_height - height_interval;
		}

		if("middle_left" == nodeType) {
			x = current_offsetX;
			width = old_width - width_interval;
		}

		if("bottom_left" == nodeType) {
			x = current_offsetX;
			width = old_width - width_interval;
			height = old_height + height_interval;
		}

		if("bottom_center" == nodeType) {
			height = old_height + height_interval;
		}

		if("bottom_right" == nodeType) {
			width = old_width + width_interval;
			height = old_height + height_interval;
		}

		if("middle_right" == nodeType) {
			width = old_width + width_interval;

		}

		if("top_center" == nodeType) {
			y = current_offsetY;
			height = old_height - height_interval;
		}

		editRect(rectId, x, y, width, height, null);
		drawRectBorder(rectId);
		drawBorderNodePointer(rectId, nodeType);
		stopBubble(evt);
	};
	onBorderNodeMouseUp = function(evt) {
		console.log("onBorderNodeMouseUp");
		setCurrentOperation(null);
		stopBubble(evt);
	};
	drawRectBorderNode = function(rectId, nodeId, x, y, nodeType,cursor) {
		var rect = tagImg_model.getRect(rectId);
		if(null != rect) {
			var svgWrap = $("svg_wrap");
			node_rect = svgWrap.getElementById(nodeId);
			if(null == node_rect) {
				node_rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
				node_rect.setAttribute("width", 8);
				node_rect.setAttribute("height", 8);
				node_rect.setAttribute("id", nodeId);
				node_rect.setAttribute("rectId", rectId);
				node_rect.setAttribute("nodeType", nodeType);
				node_rect.setAttribute("style", "fill:blue;stroke:pink;stroke-width:2;fill-opacity:0.3;stroke-opacity:0.9;cursor:"+cursor+";");
				//node_rect.addEventListener('mouseover', onBorderNodeMouseOver, false);
				//node_rect.addEventListener('mouseout', onBorderNodeMouseOut, false);
				node_rect.addEventListener('mousedown', onBorderNodeMouseDown, false);
				/*node_rect.addEventListener('mousemove', onBorderNodeMouseMove, false);
				node_rect.addEventListener('mouseup', onBorderNodeMouseUp, false);*/

				g = svgWrap.getElementById(rectId + "_g");
				g.appendChild(node_rect);
			}
			node_rect.setAttribute("x", x);
			node_rect.setAttribute("y", y);

		}

	};
	onDeleteNodeMouseOver = function(evt) {
		isMoveOverDeleteNode = true;
	};
	onDeleteNodeMouseOut = function(evt) {
		isMoveOverDeleteNode = false;
	};
	drawRectDeleteNode = function(rectId, nodeId, x, y, nodeType) {
		var rect = tagImg_model.getRect(rectId);
		if(null != rect) {
			var svgWrap = $("svg_wrap");
			node_rect = svgWrap.getElementById(nodeId);
			if(null == node_rect) {
				node_rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
				node_rect.setAttribute("id", nodeId);
				node_rect.setAttribute("rectId", rectId);
				node_rect.setAttribute("nodeType", nodeType);
				node_rect.setAttribute("width", 12);
				node_rect.setAttribute("height", 12);
				node_rect.setAttribute("style", "fill:orangered;stroke:orangered;stroke-width:2;fill-opacity:0.5;stroke-opacity:0.9");
				node_rect.addEventListener('click', onRectClose, false);
				node_rect.addEventListener('mouseover', onDeleteNodeMouseOver, false);
				node_rect.addEventListener('mouseout', onDeleteNodeMouseOut, false);

				g = svgWrap.getElementById(rectId + "_g");
				g.appendChild(node_rect);
			}

			node_rect.setAttribute("x", x);
			node_rect.setAttribute("y", y);
		}

	};
	removeRectBorderNode = function(rectId, nodeId) {
		var svgWrap = $("svg_wrap");
		g = svgWrap.getElementById(rectId + "_g");
		node_rect = svgWrap.getElementById(nodeId);
		if(null != node_rect) {
			g.removeChild(node_rect);
		}
	};
	drawRectBorder = function(rectId) {
		var rect = tagImg_model.getRect(rectId);
		if(null != rect) {
			node_offset = 4;
			//左上节点
			top_left_x = rect.x - node_offset;
			top_left_y = rect.y - node_offset;
			nodeType = "top_left";
			nodeId = rectId + "_" + nodeType;
			drawRectBorderNode(rectId, nodeId, top_left_x, top_left_y, nodeType,"nw-resize");

			//左中节点
			middle_left_x = rect.x - node_offset;
			middle_left_y = rect.y + (rect.height / 2) - node_offset;
			nodeType = "middle_left";
			nodeId = rectId + "_" + nodeType;
			drawRectBorderNode(rectId, nodeId, middle_left_x, middle_left_y, nodeType,"col-resize");

			//左下节点
			bottom_left_x = rect.x - node_offset;
			bottom_left_y = rect.y + rect.height - node_offset;
			nodeType = "bottom_left";
			nodeId = rectId + "_" + nodeType;
			drawRectBorderNode(rectId, nodeId, bottom_left_x, bottom_left_y, nodeType,"sw-resize");

			//中下节点
			bottom_center_x = rect.x + (rect.width / 2) - node_offset;
			bottom_center_y = rect.y + rect.height - node_offset;
			nodeType = "bottom_center";
			nodeId = rectId + "_" + nodeType;
			drawRectBorderNode(rectId, nodeId, bottom_center_x, bottom_center_y, nodeType,"row-resize");

			//右下节点
			bottom_right_x = rect.x + rect.width - node_offset;
			bottom_right_y = rect.y + rect.height - node_offset;
			nodeType = "bottom_right";
			nodeId = rectId + "_" + nodeType;
			drawRectBorderNode(rectId, nodeId, bottom_right_x, bottom_right_y, nodeType,"se-resize");

			//右中节点
			middle_right_x = rect.x + rect.width - node_offset;
			middle_right_y = rect.y + (rect.height / 2) - node_offset;
			nodeType = "middle_right";
			nodeId = rectId + "_" + nodeType;
			drawRectBorderNode(rectId, nodeId, middle_right_x, middle_right_y, nodeType,"col-resize");

			//右上节点
			top_right_x = rect.x + rect.width - 7;
			top_right_y = rect.y - 5;
			nodeType = "top_right";
			nodeId = rectId + "_" + nodeType;
			drawRectDeleteNode(rectId, nodeId, top_right_x, top_right_y, nodeType);

			//中上节点
			top_center_x = rect.x + (rect.width / 2) - node_offset;
			top_center_y = rect.y - node_offset;
			nodeType = "top_center";
			nodeId = rectId + "_" + nodeType;
			drawRectBorderNode(rectId, nodeId, top_center_x, top_center_y, nodeType,"row-resize");

		}

	};
	hiveRectBorder = function(rectId) {
		if(null == rectId)
			return;
		var rect = tagImg_model.getRect(rectId);
		if(null != rect) {
			//左上节点
			nodeId = rectId + "_top_left";
			removeRectBorderNode(rectId, nodeId);

			//左中节点
			nodeId = rectId + "_middle_left";
			removeRectBorderNode(rectId, nodeId);

			//左下节点
			nodeId = rectId + "_bottom_left";
			removeRectBorderNode(rectId, nodeId);

			//中下节点
			nodeId = rectId + "_bottom_center";
			removeRectBorderNode(rectId, nodeId);

			//右下节点
			nodeId = rectId + "_bottom_right";
			removeRectBorderNode(rectId, nodeId);

			//右中节点
			nodeId = rectId + "_middle_right";
			removeRectBorderNode(rectId, nodeId);

			//右上节点
			nodeId = rectId + "_top_right";
			removeRectBorderNode(rectId, nodeId);

			//中上节点
			nodeId = rectId + "_top_center";
			removeRectBorderNode(rectId, nodeId);

			//隐藏节点指针图标
			//hiveBorderNodePointer(rectId);
		}
		tagImg_menu.onRectNotSelected();
	};
	onRectClose = function(evt) {
		console.log("onRectClose");
		var top_right_node = evt.target;
		var rectId = top_right_node.getAttribute("rectId");
		tagImg_model.deleteRect(rectId);
		var svgWrap = $("svg_wrap");
		g = svgWrap.getElementById(rectId + "_g");
		if(null != g) {
			svgWrap.removeChild(g);
		}
		stopBubble(evt);
	};
	onRectClick = function(evt) {
		console.log("onRectClick")
		var rect = evt.target;
		var rectId = rect.id
		if(true == isShowRectBorder && rectId == current_rect_id) {
			return false;
		}
		if(true == isShowRectBorder && rectId != current_rect_id) {
			hiveRectBorder(current_rect_id);
		}
		isShowRectBorder = true;
		current_rect_id = rectId;
		drawRectBorder(rectId);
		var rect = tagImg_model.getRect(rectId);
		if(null != rect) {
			tagImg_menu.onRectClick(rect);
		}
		stopBubble(evt);
	};
	/*onRectMouseOut = function(evt) {
		var rect = evt.target;
		var rectId = rect.id.replace("_back", "");
		hiveRectBorder(rectId);

	};*/
	drawRect = function(rectId, x, y, width, height, label) {
		if(null == rectId) {
			rectId = tagImg_model.addRect(start_offsetX, start_offsetY, width, height, label);
		}
		var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
		rect.setAttribute("x", x);
		rect.setAttribute("y", y);
		rect.setAttribute("width", width);
		rect.setAttribute("height", height);
		rect.setAttribute("id", rectId);
		rect.setAttribute("style", "fill:blue;stroke:pink;stroke-width:2;fill-opacity:0.3;stroke-opacity:0.9;margin:10px");
		rect.addEventListener('click', onRectClick, false);

		/*var rect_back = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
		rect_back.setAttribute("x", x - 5);
		rect_back.setAttribute("y", y - 5);
		rect_back.setAttribute("width", width + 10);
		rect_back.setAttribute("height", height + 10);
		rect_back.setAttribute("id", rectId + "_back");
		rect_back.setAttribute("style", "fill:blue;stroke:pink;stroke-width:2;fill-opacity:0;stroke-opacity:0;margin:10px");*/

		g = document.createElementNS("http://www.w3.org/2000/svg", 'g');
		g.id = rectId + "_g";
		//g.appendChild(rect_back);
		g.appendChild(rect);

		var svgWrap = $("svg_wrap");
		svgWrap.appendChild(g);
		return rectId;
	};
	editRect = function(rectId, x, y, width, height, label) {
		var svgWrap = $("svg_wrap");
		var rect = svgWrap.getElementById(rectId);
		if(null != x) {
			rect.setAttribute("x", x);
		}
		if(null != y) {
			rect.setAttribute("y", y);

		}
		if(null != width) {
			rect.setAttribute("width", width);

		}
		if(null != height) {
			rect.setAttribute("height", height);

		}

		tagImg_model.editRect(rectId, x, y, width, height, label);
	};
	onSvgClick = function(evt) {
		if(prev_operation == operationEnum.DRAGING_BORDER_NODE)
			return;
		if(true == isShowRectBorder) {
			isShowRectBorder = false;
			hiveRectBorder(current_rect_id);
			
			current_rect_id = null;
		}
		console.log("onSvgClick");
		stopBubble(evt);
	};
	onSvgMouseDown = function(evt) {
		console.log("onSvgMouseDown")
		if(true == isShowRectBorder && false == isMoveOverDeleteNode) {
			isShowRectBorder = false;
			hiveRectBorder(current_rect_id);
			current_rect_id = null;
		}

		start_offsetX = evt.offsetX;
		start_offsetY = evt.offsetY;

		setCurrentOperation(operationEnum.DRAWING_RECT)

	};
	onSvgMouseMove = function(evt) {
		console.log("onSvgMouseMove")

		if(current_operation != operationEnum.DRAWING_RECT) {
			return;
		}
		var current_offsetX = evt.offsetX;
		var current_offsetY = evt.offsetY;
		var width = current_offsetX - start_offsetX;
		var height = current_offsetY - start_offsetY;
		if(width < 0 || height < 0)
			return;
		console.log("onSvgMouseMove:current_rect_id=" + current_rect_id);
		if(false == isCreatedRect) {
			current_rect_id = drawRect(null,start_offsetX, start_offsetY, width, height, null);
			isCreatedRect = true;
		}
		if(null != current_rect_id) {
			editRect(current_rect_id, null, null, width, height, null);
		}

	};
	onSvgMouseUp = function(evt) {
		console.log("onSvgMouseUp")
		if(current_operation != operationEnum.DRAWING_RECT) {
			return;
		}
		/*current_offsetX = evt.offsetX;
		current_offsetY = evt.offsetY;
		var width = current_offsetX - start_offsetX;
		var height = current_offsetY - start_offsetY;
		if(true == isCreatedRect && current_rect_id != null && width > 0 && height > 0) {
			tagImg_model.editRect(current_rect_id, null, null, width, height, "");
		}*/

		isCreatedRect = false;
		setCurrentOperation(null);

	};
	onMouseMove = function(evt) {

		if(current_operation == operationEnum.DRAGING_BORDER_NODE) {
			onBorderNodeMouseMove(evt);
		}
		if(current_operation == operationEnum.DRAWING_RECT) {
			onSvgMouseMove(evt);
		}

	};
	onMouseUp = function(evt) {
		if(current_operation == operationEnum.DRAGING_BORDER_NODE) {
			onBorderNodeMouseUp(evt);
		}
		if(current_operation == operationEnum.DRAWING_RECT) {
			onSvgMouseUp(evt);
		}

	};
	onSvgLoad = function(evt) {
		svg_wrap = $("svg_wrap");
		svg_wrap.addEventListener('mousedown', onSvgMouseDown, false);
		svg_wrap.addEventListener('mousemove', onMouseMove, false);
		svg_wrap.addEventListener('mouseup', onMouseUp, false);
		svg_wrap.addEventListener('click', onSvgClick, false);

	};
	clearAllRects = function() {
		var svgWrap = $("svg_wrap");
		var gList = svgWrap.getElementsByTagName("g");
		var len = gList.length;
		var g = null;
		for(var i = 0; i < len; i++) {
			g = gList[0];
			svgWrap.removeChild(g);
		}
	};
	resizeCurrentRect = function(x, y, width, height) {
		if(false == isShowRectBorder) {
			return;
		}
		if(null != current_rect_id) {
			editRect(current_rect_id, x, y, width, height, null);
			drawRectBorder(current_rect_id);
		}

	};
	setCurrentRectLabel = function(label) {
		if(false == isShowRectBorder) {
			return;
		}
		if(null != current_rect_id) {
			editRect(current_rect_id, null, null, null, null, label);
		}
	};
	return {
		onSvgLoad: onSvgLoad,
		drawRect: drawRect,
		clearAllRects: clearAllRects,
		resizeCurrentRect: resizeCurrentRect,
		setCurrentRectLabel: setCurrentRectLabel
	};
})();