tagImg_i18n = (function() {
	var englishI18nDictionary = {
		"i18n_zn": "Chinese",
		"i18n_en": "English",
		"open_local_files": "Open Local Files",
		"manual_setting": "Manual Setting",
		"remote_interface": "Remote Interface",
		"image_property": "Image Property",
		"width": "width",
		"height": "height",
		"depth": "depth",
		"label": "label",
		"resize": "Resize",
		"save": "Save",
		"prev_image": "Prev Image",
		"next_image": "Next Image",
		"dataset_type": "Dataset Type",
		"export_files": "Export Files",
		"save_files_to_remote": "Save Files To Remote",
		"file_list": "file list",
		"ok": "OK",
		"cancel": "Cancel",
		"test": "Test",
		"check": "Check",
		"example1": "example1",
		"example2": "example2"
	};
	var chineseI18nDictionary = {
		"i18n_zn": "中文",
		"i18n_en": "英文",
		"open_local_files": "打开本地文件",
		"manual_setting": "人工录入",
		"remote_interface": "远程接口",
		"image_property": "图片属性",
		"width": "宽",
		"height": "高",
		"depth": "深",
		"label": "标签",
		"resize": "重设",
		"save": "保存",
		"prev_image": "前一图片",
		"next_image": "后一图片",
		"dataset_type": "数据集类型",
		"export_files": "导出文件",
		"save_files_to_remote": "保存文件至远程",
		"file_list": "文件列表",
		"ok": "确定",
		"cancel": "取消",
		"test": "测试",
		"check": "检查",
		"example1": "样例1",
		"example2": "样例2"
	};
	var changeAllI18nTextToLanguage = function(lang) {
		var elements = document.getElementsByTagName("i18n");
		var element = null;
		var name = null;
		var value = null;
		var i18nDict = null;
		if("en" == lang) {
			i18nDict = englishI18nDictionary;
		} else {
			i18nDict = chineseI18nDictionary;
		}
		
		for(var i = 0; i < elements.length; i++) {
			element = elements[i];
			name = element.getAttribute("name");
			value = i18nDict[name];
			element.innerText = value;
		} //for
		
		var i18nSelectet = $("i18n_select");
		var objOption = null;
		var name = null;
		for(var i = i18nSelectet.options.length - 1; i >= 0; i--) {
			objOption = i18nSelectet.options[i];
			name = objOption.getAttribute("name");
			objOption.innerText =i18nDict[name];
		}

	};

	return {
		changeAllI18nTextToLanguage: changeAllI18nTextToLanguage
	};

})();