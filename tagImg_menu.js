$ = function(id) {
	return document.getElementById(id);
};
tagImg_menu = (function() {
	var fileList = null;
	var toSaveLocalLocation = "";
	config = {
		maxSvgWidth: 1000,
		maxSvgHeight: 1000
	};
	onRectClick = function(rect) {
		enableRectPropertyPanel();
		var rect_x_text = $("rect_x_text");
		var rect_y_text = $("rect_y_text");
		var rect_width_text = $("rect_width_text");
		var rect_height_text = $("rect_height_text");

		rect_x_text.value = rect.x;
		rect_y_text.value = rect.y;
		rect_width_text.value = rect.width;
		rect_height_text.value = rect.height;

		var label = rect.label;
		if(null == label) {
			label = "";
		}
		var rectLabelsSelectet = $("rect_labels");
		var objOption = null;
		for(var i = rectLabelsSelectet.options.length - 1; i >= 0; i--) {
			objOption = rectLabelsSelectet.options[i];

			if(label == objOption.value) {
				objOption.selected = true;
			} else {
				objOption.selected = false;
			}
		}

	};
	onRectNotSelected = function() {
		disableRectPropertyPanel();
	};
	onclickFileListItem = function(evt) {
		var li = evt.target;
		var id = li.id;
		var index = parseInt(id.replace("fileName_", ""));
		if(index == tagImg_model.getCurrentImgIndex()) {
			return;
		}
		tagImg_model.gotoImg(index);
		//显示图片
		var img = tagImg_model.getCurrentImg();
		if(null != img)
			reloadImg(img);
		selectFileListItem(index);
	};
	selectFileListItem = function(index) {
		var ul = document.getElementById('fileNameList');
		var liList = ul.getElementsByTagName('li');
		var li = null;
		for(var i = 0; i < liList.length; i++) {
			li = liList[i];
			if(index == i) {
				li.setAttribute("class", "file_list_item_selected");
			} else {
				li.setAttribute("class", "file_list_item_unselected");
			}

		}

	};
	showFileNameList = function(nameList) {
		var fileListUl = $("fileNameList");
		fileListUl.innerHTML = "";
		var li, name;

		for(var i = 0; i < nameList.length; i++) {
			name = nameList[i];
			li = document.createElement("li");
			li.innerText = name;
			li.id = "fileName_" + i
			li.onclick = onclickFileListItem;
			if(0 == i) {
				li.setAttribute("class", "file_list_item_selected");
			} else {
				li.setAttribute("class", "file_list_item_unselected");
			}

			fileListUl.appendChild(li);
		}
	};
	reloadImg = function(modelImg) {
		var img = $("img");
		img.src = modelImg.src;

		img.onload = function() {
			imgWidth = img.naturalWidth;
			imgHeight = img.naturalHeight;

			svgWidth = imgWidth;
			svgHeight = imgHeight;
			svgWrap = $("svg_wrap");
			svgWrap.setAttribute("width", svgWidth);
			svgWrap.setAttribute("height", svgHeight);
			tagImg_svg.onSvgLoad();

			img.setAttribute("width", svgWidth);
			img.setAttribute("height", svgHeight);

		};
		tagImg_svg.clearAllRects();
		var rectList = modelImg.rectList;
		if(null == rectList)
			return;
		var rect = null;
		for(var i = 0; i < rectList.length; i++) {
			rect = rectList[i];
			tagImg_svg.drawRect(rect.id, rect.x, rect.y, rect.width, rect.height, rect.label);
		}
		$("image_width").innerText = modelImg.width;
		$("image_height").innerText = modelImg.height;
		$("image_depth").innerText = modelImg.depth;
	};
	reloadInputDataSet = function(inputList) {
		var fileNameList = [];
		var rectList = null;
		var rect = null;
		var imgSrc = null;
		tagImg_model.clearImgs();
		var hasReloadedImg = false;
		for(var i = 0; i < inputList.length; i++) {
			item = inputList[i];
			//
			fileNameList.push(item.name);
			if(null == item.rectList)
				item.rectList = [];
			rectList = item.rectList;
			for(var j = 0; j < rectList.length; j++) {
				rect = rectList[j];
				rect.id = "rect_" + j;
			}

			var imgSrcBase64Promise = tagImg_image_handler.getImageBase64DataAndSize(item);
			imgSrcBase64Promise.then(function(modelImg) {

				tagImg_model.addImg(modelImg.name, modelImg.src, modelImg.rectList, modelImg.width, modelImg.height, modelImg.depth);
				if(false == hasReloadedImg) {
					hasReloadedImg = true;
					//显示图片
					var img = tagImg_model.getCurrentImg();
					if(null != img)
						reloadImg(img);
				}
			});

		}
		showFileNameList(fileNameList);
	};
	selectFiles = function(e) {
		fileList = this.files;

		var inputList = [];
		var item = null;
		var imgAddCount = 0;
		for(var i = 0; i < fileList.length; i++) {
			f = fileList[i];

			var reader = new FileReader();
			reader.onload = (function(file) {
				return function(e) {
					item = {};
					item.name = file.name;
					item.src = this.result;
					item.rectList = [];
					inputList.push(item);
					imgAddCount += 1;

					//显示图片
					if(imgAddCount >= fileList.length) {
						reloadInputDataSet(inputList);
					};
				}

			})(f);
			reader.readAsDataURL(f);
		} //for
	};

	var openFiles = function(evt) {
		$("open_files_file").click();
		$("open_files_file").onchange = selectFiles;
	};
	var manualSetting = function(evt) {
		var manual_setting_panel = document.getElementById("manual_setting_panel");
		manual_setting_panel.setAttribute("style", "display:block;");
	};
	var remoteInterface = function(evt) {
		var remote_interface_panel = document.getElementById("remote_interface_panel");
		remote_interface_panel.setAttribute("style", "display:block;");
		var remote_interface_panel_script = document.getElementById("remote_interface_panel_script");
		var script = inputScriptSample1.toString(); //JSON.stringify(inputScriptSample1);
		remote_interface_panel_script.value = script;
	};
	var checkScriptType = function(script) {
		var scriptType = "string";
		if(script.indexOf("[") > 0 || script.indexOf("{") > 0) {
			scriptType = "object";
		}
		return scriptType;
	};
	var checkManualSettingScriptFormat = function(script) {

		var scriptType = checkScriptType(script);
		if("string" == scriptType) {
			var Regx = /^[A-Za-z0-9,:./?=&]*$/;
			if(Regx.test(script)) {
				return true;
			} else {
				return false;
			}
		} else {
			var inputList = null;
			try {
				inputList = JSON.parse(script);
			} catch(err) {
				return false;
			}
			if(!(inputList instanceof Array)) {
				return false;
			}
			var item = null;
			for(var i = 0; i < inputList.length; i++) {
				item = inputList[i];
				if(null == item.src) {
					return false;
				}
			}

		}
		return true;
	};
	var clickManualSettingOK = function(evt) {
		var file_text = $("manual_setting_panel_text")
		if(null != file_text) {
			var content = file_text.value;
			if(null != content && "" != content) {
				//回车换行 转换为 逗号       
				content = content.replace(/[\r\n]/g, "");
				//去掉空格
				content = content.replace(/\ +/g, "");
				if("" == content)
					return;
				if(false == checkManualSettingScriptFormat(content)) {
					alert("Script format is invalid.");
					return;
				}
				var inputList = [];
				var scriptType = checkScriptType(content);
				if("string" == scriptType) {
					var imgUrlList = content.split(",");
					var imgUrl = null;
					for(var i = 0; i < imgUrlList.length; i++) {
						imgUrl = imgUrlList[i];
						item = {};
						item.name = imgUrl.substr(imgSrc.lastIndexOf("/") + 1);
						item.src = imgUrl;
						item.rectList = [];
						inputList.push(item);
					}
				} else {

					inputList = JSON.parse(content);
				}

				//
				reloadInputDataSet(inputList);
			} //if(null != content && "" != content)
		} //if(null != file_text) 

		var manual_setting_panel = $("manual_setting_panel");
		manual_setting_panel.setAttribute("style", "display:none;");
	};
	var clickManualSettingCheck = function(evt) {
		var file_text = $("manual_setting_panel_text")
		if(null != file_text) {
			var content = file_text.value;
			if(null != content && "" != content) {
				//回车换行 转换为 逗号       
				content = content.replace(/[\r\n]/g, "");
				//去掉空格
				content = content.replace(/\ +/g, "");
				if("" != content) {
					if(false == checkManualSettingScriptFormat(content)) {
						alert("Script format is invalid.");
					} else {
						alert("Script format is ok.");
					}
				}
			}
		}
	};
	var clickManualSettingCancel = function(evt) {
		var manual_setting_panel = $("manual_setting_panel");
		manual_setting_panel.setAttribute("style", "display:none;");
	}
	var clickManualSettingExample1 = function(evt) {
		var file_text = $("manual_setting_panel_text")
		if(null == file_text) {
			return;
		}
		var returnStr = "";
		returnStr += "[{\n";
		returnStr += "  \"src\":\"http://127.0.0.1:8080/common/img/P81009-110055.jpg\",\n";
		returnStr += "  \"name\":\"P81009-110055.jpg\",\n";
		returnStr += "  \"rectList\":[{\n";
		returnStr += "    \"x\":100,\n";
		returnStr += "    \"y\":100,\n";
		returnStr += "    \"width\":150,\n";
		returnStr += "    \"height\":150,\n";
		returnStr += "    \"label\":\"dog\"\n";
		returnStr += "  }]\n";
		returnStr += "}]\n";
		file_text.value = returnStr;
	};
	var clickManualSettingExample2 = function(evt) {
		var file_text = $("manual_setting_panel_text")
		if(null == file_text) {
			return;
		}
		var returnStr = "http://127.0.0.1:8080/common/img/P81009-110054.jpg,http://127.0.0.1:8080/common/img/P81009-110055.jpg";
		file_text.value = returnStr;
	};
	var inputScriptSample1 = function() {
		return function(callback, errorFunc) {
			axios.get('http://127.0.0.1:9090/tagimg/input/data')
				.then(function(response) {
					console.log(response);
					callback(response.data);
				})
				.catch(function(error) {
					/*console.log("error:"+error);*/
					errorFunc(error);
				});
		};

	}
	var clickRemoteInterfaceOK = function(evt) {
		var remote_interface_panel_script = $("remote_interface_panel_script");
		var script = remote_interface_panel_script.value
		var callback = function(responseData) {
			console.log("responseData:" + JSON.stringify(responseData));
			reloadInputDataSet(responseData);
			var remote_interface_panel = document.getElementById("remote_interface_panel");
			remote_interface_panel.setAttribute("style", "display:none;");

		};
		var errorFunc = function(error) {
			var remote_interface_panel_test_return = document.getElementById("remote_interface_panel_test_return");
			remote_interface_panel_test_return.value = error.message;
		};

		var func = eval("(" + script + ")();");
		func(callback, errorFunc);

	};
	var clickRemoteInterfaceTest = function(evt) {
		var remote_interface_panel_script = $("remote_interface_panel_script");
		var script = remote_interface_panel_script.value
		var callback = function(responseData) {
			var responseDataStr = JSON.stringify(responseData);
			console.log("responseData:" + responseDataStr);
			var remote_interface_panel_test_return = document.getElementById("remote_interface_panel_test_return");
			remote_interface_panel_test_return.value = responseDataStr;
		};
		var errorFunc = function(error) {
			var remote_interface_panel_test_return = document.getElementById("remote_interface_panel_test_return");
			remote_interface_panel_test_return.value = error.message;
		};

		var func = eval("(" + script + ")();");
		func(callback, errorFunc);

	};
	var clickRemoteInterfaceCancel = function(evt) {
		var remote_interface_panel = document.getElementById("remote_interface_panel");
		remote_interface_panel.setAttribute("style", "display:none;");
	};

	var saveFilesToRemoteScriptSample1 = function() {
		return function(callback, errorFunc) {
			var saveToRemote = function(zipFileName, zipData) {

				var formData = new FormData();
				formData.append("file", zipData);
				let config = {
					headers: {
						"Content-Type": "multipart/form-data"
					}
				};
				axios.post('http://127.0.0.1:9090/upload', formData, config).then(function(response) {
						console.log(response);
						callback(response.data);
					})
					.catch(function(error) {
						/*console.log("error:"+error);*/
						errorFunc(error);
					});

			};
			var dataSetFileList = tagImg_dataset_voc.generateDataSet();
			tagImg_jszip.generateZip("VOC2007.zip", dataSetFileList, saveToRemote);
		};

	}
	var clickSaveFilesToRemoteOK = function(evt) {
		var save_files_to_remote_panel_script = $("save_files_to_remote_panel_script");
		var script = save_files_to_remote_panel_script.value
		var callback = function(responseData) {
			console.log("responseData:" + JSON.stringify(responseData));
			var remote_interface_panel = document.getElementById("save_files_to_remote_panel");
			remote_interface_panel.setAttribute("style", "display:none;");

		};
		var errorFunc = function(error) {
			var save_files_to_remote_panel_test_return = document.getElementById("save_files_to_remote_panel_test_return");
			save_files_to_remote_panel_test_return.value = error.message;
		};

		var func = eval("(" + script + ")();");
		func(callback, errorFunc);

	};
	var clickSaveFilesToRemoteTest = function(evt) {
		var save_files_to_remote_panel_script = $("save_files_to_remote_panel_script");
		var script = save_files_to_remote_panel_script.value
		var callback = function(responseData) {
			var responseDataStr = JSON.stringify(responseData);
			console.log("responseData:" + responseDataStr);
			var save_files_to_remote_panel_test_return = document.getElementById("save_files_to_remote_panel_test_return");
			save_files_to_remote_panel_test_return.value = responseDataStr;
		};
		var errorFunc = function(error) {
			var save_files_to_remote_panel_test_return = document.getElementById("save_files_to_remote_panel_test_return");
			save_files_to_remote_panel_test_return.value = error.message;
		};

		var func = eval("(" + script + ")();");
		func(callback, errorFunc);

	};
	var clickSaveFilesToRemoteCancel = function(evt) {
		var remote_interface_panel = document.getElementById("save_files_to_remote_panel");
		remote_interface_panel.setAttribute("style", "display:none;");
	};

	var resizeRectSize = function(rectList, newWidth, newHeight, oldWidth, oldHeight) {
		if(null == rectList) {
			return;
		}
		var rect = null;
		for(var i = 0; i < rectList.length; i++) {
			rect = rectList[i];
			rect.x = Math.round((rect.x / oldWidth) * newWidth);
			rect.y = Math.round((rect.y / oldHeight) * newHeight);
			rect.width = Math.round((rect.width / oldWidth) * newWidth);
			rect.height = Math.round((rect.height / oldHeight) * newHeight);

		}
		return rectList;
	};
	var clickImagePropertyResizeBtn = function(evt) {

		var newWidth = $("image_resize_width_text").value;
		var newHeight = $("image_resize_height_text").value;
		if(null == newWidth || null == newHeight) {
			alert("Please input width or height.");
			return;
		}

		var modelImg = tagImg_model.getCurrentImg();
		if(null != modelImg) {
			newWidth = parseInt(newWidth);
			newHeight = parseInt(newHeight);
			modelImg.rectList = resizeRectSize(modelImg.rectList, newWidth, newHeight, modelImg.width, modelImg.height);
			var newImageBase64DataPromise = tagImg_image_handler.getResizeImageBase64Data(modelImg, newWidth, newHeight);
			newImageBase64DataPromise.then(function(newImageBase64Data) {
				modelImg.width = newWidth;
				modelImg.height = newHeight;
				modelImg.src = newImageBase64Data;
				reloadImg(modelImg);
			});

		}

	};
	clickRectPropertySetBtn = function(evt) {
		var rect_x_text = $("rect_x_text");
		var rect_y_text = $("rect_y_text");
		var rect_width_text = $("rect_width_text");
		var rect_height_text = $("rect_height_text");
		var rect_label = $("rect_label");

		var x = parseInt(rect_x_text.value);
		var y = parseInt(rect_y_text.value);
		var width = parseInt(rect_width_text.value);
		var height = parseInt(rect_height_text.value);
		tagImg_svg.resizeCurrentRect(x, y, width, height);
	};
	onloadRectLabels = function(evt) {
		var rectLabelsSelectet = $("rect_labels");
		for(var i = rectLabelsSelectet.options.length - 1; i >= 0; i--) {
			rectLabelsSelectet.options[i] = null;
		}

		var objOption = document.createElement("OPTION");
		objOption.text = "";
		objOption.value = "";
		rectLabelsSelectet.options.add(objOption);

		var label = null;
		for(var i = 0; i < tagImg_labels.length; i++) {
			label = tagImg_labels[i];
			objOption = document.createElement("OPTION");
			objOption.text = label;
			objOption.value = label;
			rectLabelsSelectet.options.add(objOption);
		}
	};
	onchangeRectLabels = function(evt) {
		var rectLabelsSelectet = $("rect_labels");
		var index = rectLabelsSelectet.selectedIndex;
		var label = rectLabelsSelectet.options[index].value;
		tagImg_svg.setCurrentRectLabel(label);
	};
	clickPrevImageBtn = function(evt) {

		tagImg_model.prevImg();
		var img = tagImg_model.getCurrentImg();
		if(null != img)
			reloadImg(img);
		var currentImageIndex = tagImg_model.getCurrentImgIndex();
		selectFileListItem(currentImageIndex);
	};
	clickNextImageBtn = function(evt) {

		tagImg_model.nextImg();
		var img = tagImg_model.getCurrentImg();
		if(null != img)
			reloadImg(img);
		var currentImageIndex = tagImg_model.getCurrentImgIndex();
		selectFileListItem(currentImageIndex);
	};
	var saveAs = function(zipFileName, blob) {
		var a = document.createElement('a'); // 转换完成，创建一个a标签用于下载
		a.download = zipFileName;
		a.href = window.URL.createObjectURL(blob);
		var body = document.getElementsByTagName("body")[0];
		body.append(a); // 修复firefox中无法触发click
		a.click();
		a.remove();
	};
	exportFiles = function(evt) {
		var dataSetFileList = tagImg_dataset_voc.generateDataSet();
		tagImg_jszip.generateZip("VOC2007.zip", dataSetFileList, saveAs);
	};
	saveFilesToRemote = function(evt) {
		var save_files_to_remote_panel = document.getElementById("save_files_to_remote_panel");
		save_files_to_remote_panel.setAttribute("style", "display:block;");
		var save_files_to_remote_panel_script = document.getElementById("save_files_to_remote_panel_script");
		var script = saveFilesToRemoteScriptSample1.toString(); //JSON.stringify(inputScriptSample1);
		save_files_to_remote_panel_script.value = script;
	};
	enableRectPropertyPanel = function() {
		var rectProperty = $("rect_property");
		rectProperty.setAttribute("style", "opacity:1;");
		$("rect_labels").removeAttribute("disabled");
		$("rect_x_text").removeAttribute("disabled");
		$("rect_y_text").removeAttribute("disabled");
		$("rect_width_text").removeAttribute("disabled");
		$("rect_height_text").removeAttribute("disabled");
		$("rect_property_save_btn").removeAttribute("disabled");

	};
	disableRectPropertyPanel = function() {
		var rectProperty = $("rect_property");
		rectProperty.setAttribute("style", "opacity:0.5;");
		var rectLabels = $("rect_labels");
		var rectXText = $("rect_x_text");
		var rectYText = $("rect_y_text");
		var rectWidthText = $("rect_width_text");
		var rectHeightText = $("rect_height_text");
		rectLabels.setAttribute("disabled", true);
		rectXText.setAttribute("disabled", true);
		rectYText.setAttribute("disabled", true);
		rectWidthText.setAttribute("disabled", true);
		rectHeightText.setAttribute("disabled", true);
		$("rect_property_save_btn").setAttribute("disabled", true);
		//rectLabels.value="";
		rectXText.value = "";
		rectYText.value = "";
		rectWidthText.value = "";
		rectHeightText.value = "";

	};
	onchangeI18nSelect = function(evt) {
		var i18nSelectet = $("i18n_select");
		var index = i18nSelectet.selectedIndex;
		var lang = i18nSelectet.options[index].value;
		tagImg_i18n.changeAllI18nTextToLanguage(lang);

	};
	onloadBody = function(evt) {
		onloadRectLabels(evt);
		disableRectPropertyPanel();
		onchangeI18nSelect(evt);
	};
	var startOffsetX = null;
	var startOffsetY = null;
	var dragTarget = null;
	ondragstartWindow = function(evt) {
		dragTarget = evt.target;
		evt.dataTransfer.effectAllowed = "move"; //移动效果
		evt.dataTransfer.setData("text", ''); //附加数据，　没有这一项，firefox中无法移动
		startOffsetX = evt.offsetX || evt.layerX;
		startOffsetY = evt.offsetY || evt.layerY;
		return true;
	};
	document.addEventListener('dragover', function(evt) { //取消冒泡 ,不取消则不能触发 drop事件
		evt.preventDefault() || evt.stopPropagation();
	}, false);

	document.addEventListener('drop', function(evt) {
		dragTarget.style.left = (evt.pageX - startOffsetX) + 'px';
		dragTarget.style.top = (evt.pageY - startOffsetY) + 'px';
		startOffsetX = null;
		startOffsetY = null;
		dragTarget = null;
		evt.preventDefault() || evt.stopPropagation(); //不取消，firefox中会触发网页跳转到查找setData中的内容
	}, false);

	return {
		onRectClick: onRectClick,
		onRectNotSelected: onRectNotSelected,
		openFiles: openFiles,
		manualSetting: manualSetting,
		remoteInterface: remoteInterface,
		clickManualSettingOK: clickManualSettingOK,
		clickManualSettingCheck: clickManualSettingCheck,
		clickManualSettingCancel: clickManualSettingCancel,
		clickManualSettingExample1: clickManualSettingExample1,
		clickManualSettingExample2: clickManualSettingExample2,
		clickRemoteInterfaceOK: clickRemoteInterfaceOK,
		clickRemoteInterfaceTest: clickRemoteInterfaceTest,
		clickRemoteInterfaceCancel: clickRemoteInterfaceCancel,
		clickImagePropertyResizeBtn: clickImagePropertyResizeBtn,
		clickRectPropertySetBtn: clickRectPropertySetBtn,
		onchangeRectLabels: onchangeRectLabels,
		clickPrevImageBtn: clickPrevImageBtn,
		clickNextImageBtn: clickNextImageBtn,
		exportFiles: exportFiles,
		saveFilesToRemote: saveFilesToRemote,
		disableRectPropertyPanel: disableRectPropertyPanel,
		enableRectPropertyPanel: enableRectPropertyPanel,
		clickSaveFilesToRemoteOK: clickSaveFilesToRemoteOK,
		clickSaveFilesToRemoteTest: clickSaveFilesToRemoteTest,
		clickSaveFilesToRemoteCancel: clickSaveFilesToRemoteCancel,
		onchangeI18nSelect: onchangeI18nSelect,
		onloadBody: onloadBody,
		ondragstartWindow,
		ondragstartWindow
	};
})();