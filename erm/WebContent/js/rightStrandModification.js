
function RightStrandUpdate(){
	
	this.sse_inclusion = "";
	this.sse_exclusion = "";
	this.sse_strandSet = "";
	this.sse_strandSetText = "";
	this.sse_media = "";
	this.sse_mediaText = "";
	this.sse_territory = "";
	this.sse_territoryText = "";
	this.sse_language = "";
	this.sse_languageText = "";
	this.sse_infoCodeTreeView = "";
	this.sse_infoCodeTreeViewText = "";
	this.sse_startContractualDate = "";
	this.sse_startContractualDateText = "";
	this.sse_startDateCode = "";
	this.sse_startDateCodeText = "";
	this.sse_startDateStatus = "";
	this.sse_startDateStatusText = "";
	this.sse_startOverrideDate = "";
	this.sse_startOverrideDateText = "";
	this.sse_endContractualDate = "";
	this.sse_endContractualDateText = "";
	this.sse_endDateCode = "";
	this.sse_endDateCodeText = "";
	this.sse_endDateStatus = "";
	this.sse_endDateStatusText = "";
	this.sse_endOverrideDate = "";
	this.sse_endOverrideDateText = "";
	this.sse_infoCodeTermText = "";
	this.sse_rightStrandId = new Array();
	this.sse_infoCodeAlternateDateDisplay = "";
	this.sse_terms = "";
	this.sse_infoCodeTerms = "";
	this.sse_addEditButton = "";
	this.sse_restrictionObject = new restrictionObject(null);
	this.sse_kendoElementUtil = new kendoElementUtil();
	this.sse_path = paths();
	this.sse_restrictionTreeNodePanel = null;
	this.sse_isMultipleEdits = false;
	this.sse_checkboxLanguage = null;
	this.sse_checkboxMedia = null;
	this.sse_checkboxTerritory = null;
	this.sse_checkboxTerm = null;
	this.sse_checkboxInfoCodesMulti = null;
	this.sse_gridData = null;
	this.sse_checkboxStrandSetName = null;
	this.sse_infoCodeTreeMultiView = null;
	this.sse_standAloneInfoCodeArray = null;
	this.sse_startDateChanged = false;
	this.sse_endDateChanged = false;
	this.sse_overrideStartDateChanged = false;
	this.sse_overrideEndDateChanged = false;
	
	//override start and end date delete field
	this.sse_overrideStartDateDelete = false;
	this.sse_overrideEndDateDelete = false;
	this.isFoxipediaSearch=false;
		
	this.setStartDate = function(startContractualDate, startDateCode, startDateStatus, startOverrideDate){
		this.sse_startContractualDate = startContractualDate;
		this.sse_startDateCode = startDateCode;
		this.sse_startDateStatus = startDateStatus;
		this.sse_startOverrideDate = startOverrideDate;
	};
	
	this.setEndDate = function(endContractualDate, endDateCode, endDateStatus, endOverrideDate){
		this.sse_endContractualDate = endContractualDate;
		this.sse_endDateCode = endDateCode;
		this.sse_endDateStatus = endDateStatus;
		this.sse_endOverrideDate = endOverrideDate;
	};
	
	/***************************************************************************************
	 * 						Elements initialization section                                *
	 * 							                                                           *
	 ***************************************************************************************/
	
	/**
	 * Initialize the sse_standSetName kendo combo box.
	 */
	this.initStrandSetName = function(){
		var sseObject = this;
		
		if(!sseObject.sse_strandSet || !$("#sse_strandSetName").data("kendoComboBox")){
			sseObject.sse_strandSet = sseObject.sse_kendoElementUtil.getKendoComboBox("sse_strandSetName", "strandSetName", "rightStrandSetId", '<p>${ data.strandSetName }</p>', null);
		}
		
		var scop = angular.element(document.getElementById("rightsController")).scope();
		if(scop && scop.foxVersionId){
			var url = this.sse_path.getRightStrandSetRESTPath()+"/"+scop.foxVersionId;
			$.getJSON(url, function(data){
	    		if(data != null && data.length > 0){
	    			var item0 = new Object();
	    			item0.rightStrandSetId = "-1";
	    			item0.strandSetName = "";
	    			data.splice(0, 0, item0);
	    			sseObject.sse_strandSet.setDataSource(data);
	    			if(sseObject.strandSetId && sseObject.strandSetId > -1){
	    				sse_standSet.value(sseObject.strandSetId);
	    			}
	    		}
	    		else {
	    			var items = [{"rightStrandSetId":"", "strandSetName":""}];
	    			sseObject.sse_strandSet.setDataSource(items);
	    		}
	    	});
		}		
		this.sse_strandSetText = $("#sse_strandSetText");
	};
	
	/**
	 * Event handler for start date change
	 */
	this.onStartDateCodeChange = function(){
    	var sdc = rightStrandUpdateObject.sse_startDateCode;
    	var sds = rightStrandUpdateObject.sse_startDateStatus;
		var cdp = rightStrandUpdateObject.sse_startContractualDate;
    	var selectedValue = sdc.dataItem();
    	if(selectedValue){   		
    		if(selectedValue.code == 'TBA'){	        			
    			cdp.value("");
    			cdp.enable(false);
    			sds.value("-1");
    			sds.enable(false);
    		}
    		else {
    			cdp.enable(true);
    			sds.enable(true);
    		}
    	}
    	else {
    		cdp.enable(true);
    		sds.enable(true);
    	}
    	rightStrandUpdateObject.sse_startDateChanged = true;
    };
    
    /**
     * event handler for end date code change
     */
    this.onEndDateCodeChange = function(){
    	var sdc = rightStrandUpdateObject.sse_endDateCode;
    	var sds = rightStrandUpdateObject.sse_endDateStatus;
		var cdp = rightStrandUpdateObject.sse_endContractualDate;
    	var selectedValue = sdc.dataItem();
    	if(selectedValue){    		
    		if(selectedValue.id == 2){	        			
    			cdp.value("");
    			cdp.enable(false);
    			sds.value("-1");
    			sds.enable(false);
    		}
    		else if(selectedValue.id == 1){
    			cdp.value("");
    			cdp.enable(false);    			
    			sds.value("1");
    			sds.enable(true);	
    		}
    		else {
    			cdp.enable(true);
    			sds.enable(true);
    		}	
    	}
    	else {
    		cdp.enable(true);
    		sds.enable(true);
    	}
    	rightStrandUpdateObject.sse_endDateChanged = true;
    };
    
    /**
     * Event handler for start contractual date change
     */
   var onStartContractualDateChange = function(){
    	var cdp = rightStrandUpdateObject.sse_startContractualDate;
    	var sds = rightStrandUpdateObject.sse_startDateStatus;
    	if(cdp.value != null){ 			        		
    		sds.value("1");
    	}
    	
    	rightStrandUpdateObject.sse_startDateChanged = true;
    };
    
    /**
     * Event handler for end contractual date change
     */
    var onEndContractualDateChange = function(){
    	var cdp = rightStrandUpdateObject.sse_endContractualDate;
    	var sds = rightStrandUpdateObject.sse_endDateStatus;
    	if(cdp.value != null){  			        		
    		sds.value("1");
    	}
    	rightStrandUpdateObject.sse_endDateChanged = true;
    };
    
    /**
     * Event handler for override start date change
     */
    var onOverrideStartDateChange = function(){
    	rightStrandUpdateObject.sse_overrideStartDateChanged = true;
    };
    
    /**
     * Event handler for override end date change
     */
    var onOverrideEndDateChange = function(){
    	rightStrandUpdateObject.sse_overrideEndDateChanged = true;
    };
	
	/**
	 * Initialize the UI terms kendo elements
	 */
	this.initTerm = function(){
		var that = this;
		
		var dateStatusDatasource = new kendo.data.DataSource({
	   		transport: {read:{url: that.sse_path.getAllDateStatusRESTPath(),dataType: "json"}}
	   	});	
	   	
	   	var dateCodeDatasource = new kendo.data.DataSource({
	   		transport: {read:{url: that.sse_path.getAllDateCodesRESTPath(), dataType: "json"}}
	   	});
	   	
	   	var partialDateCodeDatasource = new kendo.data.DataSource({
	   		transport: {read:{url: "/erm/rest/date/partialCode",dataType: "json"}}
	   	});
	   	
	   	$.getJSON(that.sse_path.getAllDateCodesRESTPath(), function(data){
	   		if(data){
	   			rightStrandUpdateObject.dateCodeArray = data;
	   			rightStrandUpdateObject.sse_endDateCode = rightStrandUpdateObject.sse_kendoElementUtil.getKendoDropDownList("sse_endDateCode", "description", "id", "<p>${ data.description }</p>",  rightStrandUpdateObject.onEndDateCodeChange, data);
	   		}
	   	});
	   	
	   	$.getJSON(this.sse_path.getAllDateCodesRESTPath(), function(data){
	   		if(data){
	   			var partialData = new Array();
	   			for(var i = 0; i < data.length; i++){
	   				if(data[i].id != 1){
	   					partialData.push(data[i]);
	   				}
	   			}
	   			
	   			rightStrandUpdateObject.sse_startDateCode = rightStrandUpdateObject.sse_kendoElementUtil.getKendoDropDownList("sse_startDateCode", "description", "id", "<p>${ data.description }</p>",  rightStrandUpdateObject.onStartDateCodeChange, partialData);
	   			rightStrandUpdateObject.sse_startDateCode.value(-1);
	   		}
	   	});
	   	
	   	$.getJSON(that.sse_path.getAllDateStatusRESTPath(), function(data){
	   		if(data){
	   			rightStrandUpdateObject.sse_startDateStatus = rightStrandUpdateObject.sse_kendoElementUtil.getKendoDropDownList("sse_startDateStatus", "description", "id", "<p>${ data.description }</p>", null, data);
	   			rightStrandUpdateObject.sse_endDateStatus= rightStrandUpdateObject.sse_kendoElementUtil.getKendoDropDownList("sse_endDateStatus", "description", "id", "<p>${ data.description }</p>", null, data);
	   		}
	   	});
	   	
	   	$("#sse_startContractualDate").kendoDatePicker({
	   		footer: "Today - #=kendo.toString(data, 'd') #",
       		format : "MM/dd/yyyy",
       		parseFormats : ["yyyy-MM-dd", "EEE, d MMM yyyy", "EEE, MMM d, \'\'yy"],
       		start : "year",
       		change : onStartContractualDateChange
        });
	   	this.sse_startContractualDate = $("#sse_startContractualDate").data("kendoDatePicker");
		//this.sse_startContractualDate = this.sse_kendoElementUtil.getKendoDatePicker("sse_startContractualDate", "Today - #=kendo.toString(data, 'd') #", "MM/dd/yyyy", "year", '"yyyy-MM-dd", "EEE, d MMM yyyy", "EEE, MMM d, \'\'yy"', rightStrandUpdateObject.onStartContractualDateChange, null);
	   	$("#sse_startOverrideDate").kendoDatePicker({
	   		footer: "Today - #=kendo.toString(data, 'd') #",
       		format : "MM/dd/yyyy",
       		parseFormats : ["yyyy-MM-dd", "EEE, d MMM yyyy", "EEE, MMM d, \'\'yy"],
       		start : "year",
       		change : onOverrideStartDateChange
        });
	   	this.sse_startOverrideDate = $("#sse_startOverrideDate").data("kendoDatePicker");
	   	//this.sse_startOverrideDate = this.sse_kendoElementUtil.getKendoDatePicker("sse_startOverrideDate", "Today - #=kendo.toString(data, 'd') #", "MM/dd/yyyy", "year", '"yyyy-MM-dd", "EEE, d MMM yyyy", "EEE, MMM d, \'\'yy"', onOverrideStartDateChange, null);
	   	$("#sse_endContractualDate").kendoDatePicker({
	   		footer: "Today - #=kendo.toString(data, 'd') #",
       		format : "MM/dd/yyyy",
       		parseFormats : ["yyyy-MM-dd", "EEE, d MMM yyyy", "EEE, MMM d, \'\'yy"],
       		start : "year",
       		change : onEndContractualDateChange
        });
	   	this.sse_endContractualDate = $("#sse_endContractualDate").data("kendoDatePicker");
	   	//this.sse_endContractualDate = this.sse_kendoElementUtil.getKendoDatePicker("sse_endContractualDate", "Today - #=kendo.toString(data, 'd') #", "MM/dd/yyyy", "year", '"yyyy-MM-dd", "EEE, d MMM yyyy", "EEE, MMM d, \'\'yy"', onEndContractualDateChange, null);
	   	$("#sse_endOverrideDate").kendoDatePicker({
	   		footer: "Today - #=kendo.toString(data, 'd') #",
       		format : "MM/dd/yyyy",
       		parseFormats : ["yyyy-MM-dd", "EEE, d MMM yyyy", "EEE, MMM d, \'\'yy"],
       		start : "year",
       		change : onOverrideEndDateChange
        });
	   	this.sse_endOverrideDate = $("#sse_endOverrideDate").data("kendoDatePicker");
	   	//this.sse_endOverrideDate = this.sse_kendoElementUtil.getKendoDatePicker("sse_endOverrideDate", "Today - #=kendo.toString(data, 'd') #", "MM/dd/yyyy", "year", '"yyyy-MM-dd", "EEE, d MMM yyyy", "EEE, MMM d, \'\'yy"', onOverrideEndDateChange, null);
		
		this.sse_startContractualDateText = $("#sse_startContractualDateText");
		this.sse_startOverrideDateText = $("#sse_startOverrideDateText");
		this.sse_endContractualDateText = $("#sse_endContractualDateText");
		this.sse_endOverrideDateText = $("#sse_endOverrideDateText");
		this.sse_startDateCodeText = $("#sse_startDateCodeText");
		this.sse_startDateStatusText = $("#sse_startDateStatusText");
		this.sse_endDateCodeText = $("#sse_endDateCodeText");
		this.sse_endDateStatusText = $("#sse_endDateStatusText");
		this.sse_infoCodeAlternateDateDisplay = $("#sse_infoCodeAlternateDateDisplay");
		this.sse_terms = $("#sse_terms");
		this.sse_infoCodeTerms = $("#sse_infoCodeTerms");
		this.sse_addEditButton = $("#sse_addEditButton");
	};
	
	this.disableDeleteOverride = function disableDeleteOverride() {
		//disable the delete override checkboxes and un check them
		$("#sse_startOverrideDelete").attr("disabled", true).attr('checked',false);
		$("#sse_endOverrideDelete").attr("disabled", true).attr('checked',false);		
	};
	
	this.enableDeleteOverride = function enableDeleteOverride() {
		$("#sse_startOverrideDelete").removeAttr("disabled");
		$("#sse_endOverrideDelete").removeAttr("disabled");		
	};
	
	this.showDeleteOverride = function showDeleteOverride() {
		$("#sse_endOverrideDeleteSection").show();
		$("#sse_startOverrideDeleteSection").show();
	};
	
	this.hideDeleteOverride = function hideDeleteOverride() {

		$("#sse_endOverrideDeleteSection").hide();
		$("#sse_startOverrideDeleteSection").hide();
		
		
		$("#sse_startOverrideDelete").attr('checked',false);
		$("#sse_endOverrideDelete").attr('checked',false);
		
		
	};
	
	/**
	 * Enable/disable the term section of the single strand edit UI
	 */
	this.enableDisableTerm = function(bool){
		$("#sse_startContractualDate").data("kendoDatePicker").value("");
		$("#sse_startContractualDate").data("kendoDatePicker").enable(bool);
		$("#sse_startOverrideDate").data("kendoDatePicker").value("");
		$("#sse_startOverrideDate").data("kendoDatePicker").enable(bool);
		$("#sse_endContractualDate").data("kendoDatePicker").value("");
		$("#sse_endContractualDate").data("kendoDatePicker").enable(bool);
		$("#sse_endOverrideDate").data("kendoDatePicker").value("");
		$("#sse_endOverrideDate").data("kendoDatePicker").enable(bool);
		$("#sse_startDateCode").data("kendoDropDownList").value("-1");
		$("#sse_startDateCode").data("kendoDropDownList").enable(bool);
		$("#sse_startDateStatus").data("kendoDropDownList").value("-1");
		$("#sse_startDateStatus").data("kendoDropDownList").enable(bool);
		$("#sse_endDateCode").data("kendoDropDownList").value("-1");
		$("#sse_endDateCode").data("kendoDropDownList").enable(bool);
		$("#sse_endDateStatus").data("kendoDropDownList").value("-1");
		$("#sse_endDateStatus").data("kendoDropDownList").enable(bool);		
		
		
		if(!bool){
			$("#sse_startContractualDateText").addClass("disableTextClass");
			$("#sse_startOverrideDateText").addClass("disableTextClass");
			$("#sse_endContractualDateText").addClass("disableTextClass");
			$("#sse_endOverrideDateText").addClass("disableTextClass");
			$("#sse_startDateCodeText").addClass("disableTextClass");
			$("#sse_startDateStatusText").addClass("disableTextClass");
			$("#sse_endDateCodeText").addClass("disableTextClass");
			$("#sse_endDateStatusText").addClass("disableTextClass");
			$("#sse_infoCodeAlternateDateDisplay").addClass("disableTextClass");
			$("#sse_terms").addClass("disableTextClass");
			this.disableDeleteOverride();
			
			
		}
		else {
			$("#sse_startContractualDateText").removeClass("disableTextClass");
			$("#sse_startOverrideDateText").removeClass("disableTextClass");
			$("#sse_endContractualDateText").removeClass("disableTextClass");
			$("#sse_endOverrideDateText").removeClass("disableTextClass");
			$("#sse_startDateCodeText").removeClass("disableTextClass");
			$("#sse_startDateStatusText").removeClass("disableTextClass");
			$("#sse_endDateCodeText").removeClass("disableTextClass");
			$("#sse_endDateStatusText").removeClass("disableTextClass");
			$("#sse_infoCodeAlternateDateDisplay").removeClass("disableTextClass");
			$("#sse_terms").removeClass("disableTextClass");			
			this.enableDeleteOverride();
			
		}
		
	};
	
	/**
	 * Enable/disable the info code section of the UI.
	 */
	this.enableDisableInfoCodes = function(b){
		var bool = b;
		if($("#sse_exclusion")[0].checked){
			this.resetInfoCodeFields();
			bool = false;
		}
		if(!bool){			
			$("#sse_infoCodeTreeViewText").addClass("disableTextClass");			
			if($("#sse_infoCodeTreeView").data("kendoHierarchySelector")){
				$("#sse_infoCodeTreeView").data("kendoHierarchySelector").set([]);
			}
			this.sse_infoCodeTreeViewMultiText.addClass("disableTextClass");
			if($("#sse_infoCodeTreeMultiView").data("kendoInfoCodeSelector")){
				$("#sse_infoCodeTreeMultiView").data("kendoInfoCodeSelector").clear();
			}
			$("#sse_infoCodeAlternateDateDisplay").addClass("disableTextClass");
			$("#sse_infoCodeTerms").addClass("disableTextClass");
			$("#sse_removeInfoCodes").attr("color", "d1d1d1");	
			
			$("#sse_removeInfoCodesAdd").addClass("disableTextClass");
			$("#sse_addInfoCodesAdd").addClass("disableTextClass");
			$("#sse_removeInfoCodesRemove").addClass("disableTextClass");
			$("#sse_addInfoCodesRemove").addClass("disableTextClass");
			
		}
		else {
			$("#sse_infoCodeTreeViewText").removeClass("disableTextClass");
			this.sse_infoCodeTreeViewMultiText.removeClass("disableTextClass");
			$("#sse_infoCodeAlternateDateDisplay").removeClass("disableTextClass");
			$("#sse_infoCodeTerms").removeClass("disableTextClass");
			$("#sse_removeInfoCodes").attr("color", "5d935c");
			$("#sse_removeInfoCodesAdd").removeClass("disableTextClass");
			$("#sse_addInfoCodesAdd").removeClass("disableTextClass");
			$("#sse_removeInfoCodesRemove").removeClass("disableTextClass");
			$("#sse_addInfoCodesRemove").removeClass("disableTextClass");
		}
		$("#sse_addEditButton").attr("disabled", !bool);
		$("#sse_infoCodeTreeView").attr("disabled", !bool);
		$("#sse_restrictionTreeNodePanel").attr("disabled", !bool);
		$("#sse_removeInfoCodes").attr("disabled", !bool);
		$("#sse_addInfoCodes").attr("disabled", !bool);
		$("#sse_infoCodeTreeMultiView").attr("disabled", !bool);
		$("#sse_restrictionTreeNodePanelAdd").attr("disabled", !bool);
		$("#sse_restrictionTreeNodePanelRemove").attr("disabled", !bool);
		$("#sse_infoCodeTreeView").data("kendoHierarchySelector").set([]);
		$("#sse_infoCodeTreeMultiView").data("kendoInfoCodeSelector").clear();
		$("#sse_removeInfoCodesAdd").attr("disabled", !bool);
		$("#sse_addInfoCodesAdd").attr("disabled", !bool);
		$("#sse_removeInfoCodesRemove").attr("disabled", !bool);
		$("#sse_addInfoCodesRemove").attr("disabled", !bool);
	};
	
	/**
	 * Populate the territory data source
	 */
	this.getTerritoryDataSource = function(){
		var territoryDataSource = new kendo.data.DataSource({
		  transport: {
            read: "rest/Territories/territoryNodes"
          }
		});
		return territoryDataSource;
	};
	
	/**
	 * Language data source
	 */
	this.getLanguageDataSource = function(){
		var languageDataSource = new kendo.data.DataSource({
			transport: {
				read : "rest/Language/languageNodes"
			}
		});
		return languageDataSource;
	};
	
	/**
	 * Media data source
	 */
	this.getMediaDataSource = function(){
		var mediaDataSource = new kendo.data.DataSource({
			transport: {
				read : "rest/Media/mediaNodes"
			}
		});
		return mediaDataSource;
	};
	
	/**
	 * Info code data source
	 */
	this.getInfoCodeDataSource = function(){
		var infoCodeDataSource = new kendo.data.DataSource({
			transport: {
				read : "rest/Restrictions/sortedByCode"
			}
		});
		return infoCodeDataSource;
	};
	
	
	
	/**
	 * Utility function to capitalize the first letter of a string
	 */
	this.toTitleCase = function(str) {
		return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	};
	
	/**
	 * Initialize Media, territory, language and term
	 */
	this.initStrandMTLT = function(){
		var that = this;
		
		erm.dbvalues.afterInit(function initInfoCodes(){
			 var d = [];
			 $.each(erm.dbvalues.activeRestrictions, function(idx, element){
				 var ob = new Object();
				 ob = element;	
				 ob.description2 = ob.code.toUpperCase() + " - " + that.toTitleCase(ob.description);
				 d.push(ob);
			 });
			 if(!$("#sse_infoCodeTreeView").data("kendoHierarchySelector")){
				 $("#sse_infoCodeTreeView").kendoHierarchySelector({
						dataSource : d,
						add : "sse_addInfoCodes",
						remove : "sse_removeInfoCodes",
						accumulator : "sse_restrictionTreeNodePanel",
						id : "id",
						text : "description2"
				 });	
				 that.sse_infoCodeTreeView = $("#sse_infoCodeTreeView").data("kendoHierarchySelector");
				 that.sse_infoCodeTreeMultiView = that.sse_kendoElementUtil.getKendoInfoCodeTree("sse_infoCodeTreeMultiView", "sse_restrictionTreeNodePanelAdd", "sse_restrictionTreeNodePanelRemove", "sse_addInfoCodesAdd", "sse_removeInfoCodesAdd",  "sse_addInfoCodesRemove", "sse_removeInfoCodesRemove","description2", "id", d);
			 }					 			
		});
		
		 
		 $.getJSON("rest/Media/mediaNodes", function(data){
			 if(data){
				 if(!$("#sse_mediaTreeView").data("kendoHierarchySelector")){
					 $("#sse_mediaTreeView").kendoHierarchySelector({
							dataSource : data,
							id : "id",
							text : "text"
						});	
					 that.sse_media = $("#sse_mediaTreeView").data("kendoHierarchySelector");
				 }					  
			 }
		 });
		 
		 
		 $.getJSON("rest/Language/languageNodes", function(data){
			 if(data){
				 if(!$("#sse_languageTreeView").data("kendoHierarchySelector")){
					 $("#sse_languageTreeView").kendoHierarchySelector({
							dataSource : data,
							id : "id",
							text : "text"
						});	
					 that.sse_language = $("#sse_languageTreeView").data("kendoHierarchySelector");
				 }
				 
			 }
		 });
		 
		 $.getJSON("rest/Territories/territoryNodes", function(data){
			 if(data){
				 if(!$("#sse_territoryTreeView").data("kendoHierarchySelector")){
					 $("#sse_territoryTreeView").kendoHierarchySelector({
							dataSource : data,
							id : "id",
							text : "text"
					 });
					 that.sse_territory = $("#sse_territoryTreeView").data("kendoHierarchySelector");
				 }				 
			 }
		 });
		 
		 this.sse_mediaText = $("#sse_mediaText");
		 this.sse_languageText = $("#sse_languageText");
		 this.sse_territoryText = $("#sse_territoryText");
		 this.sse_restrictionTreeNodePanel = $("#sse_restrictionTreeNodePanel");
		 
		 $("#sse_restrictionTreeNodePanelAdd").change(function(){
			 setTimeout(function(){
				 that.processInfoCodeAccumulatorChange($("#sse_infoCodeTreeMultiView").data("kendoInfoCodeSelector").getAccumulatedAdd());
			 }, 1000);
		 });
		 
		 //This event was firing on $("#sse_restrictionTreeNodePanel").change
		 //which is WRONG. The change event fires when there's a selection change
		 //not when the contents of the select changed.
		 //As a path just fire when the remove button gets clicked.
		 //Ideally there would be a method on the info code selector 'onRemove'
		 $("#sse_removeInfoCodes").on('click',function(){
			 console.log('Info code remove button clicked....');
			 setTimeout(function(){
				 that.processInfoCodeAccumulatorChange($("#sse_infoCodeTreeView").data("kendoHierarchySelector").getAccumulated());			 
			 },200);
		 });
		 
		 
//		 $("#sse_restrictionTreeNodePanel").change(function(){
//			 console.log('Info code selection changed....');
//			 setTimeout(function(){
//				 that.processInfoCodeAccumulatorChange($("#sse_infoCodeTreeView").data("kendoHierarchySelector").getAccumulated());
//			 }, 1000);
//		 });
	};
	
	/**
	 * 
	 */
	this.initSingleStrandInfoCodes = function(){
		this.sse_infoCodeTreeViewText = $("#sse_infoCodeTreeViewText");
		this.sse_infoCodeTreeViewMultiText = $("#sse_infoCodeTreeViewMultiText");
	};
	
	/**
	 * Populate the mtlt dimension in the case of a single strand edit
	 */
	this.populateRightStrandPopup = function(dataArray){
		var data = dataArray[0];
		
		this.showCheckboxes(false);	
		this.showCorrectInfoCodePanel(true);
		
		if(data.excludeFlag){
			$("#sse_exclusion")[0].checked = true;
			this.enableDisableTerm(false);
			this.enableDisableInfoCodes(false);
		}
		else {
			$("#sse_inclusion")[0].checked = true;
			if($("#sse_startContractualDate").data("kendoDatePicker") && data.contractualStartDate){
				$("#sse_startContractualDate").val(getProperlyFormattedDate(new Date(data.contractualStartDate)));
				//$("#sse_startContractualDate").data("kendoDatePicker").value(new Date(data.contractualStartDate));
			}
			
			if($("#sse_startDateCode").data("kendoDropDownList") && data.contractualStartDateCodeId){
				$("#sse_startDateCode").data("kendoDropDownList").value(data.contractualStartDateCodeId);
				$("#sse_startContractualDate").data("kendoDatePicker").value('');
				$("#sse_startContractualDate").data("kendoDatePicker").enable(false);
			}
			
			if($("#sse_startDateStatus").data("kendoDropDownList") && data.contractualStartDateStatusId){
				$("#sse_startDateStatus").data("kendoDropDownList").value(data.contractualStartDateStatusId);
			}
			
			if($("#sse_startOverrideDate").data("kendoDatePicker") && data.overrideStartDate){
				$("#sse_startOverrideDate").val(getProperlyFormattedDate(new Date(data.overrideStartDate)));
				//$("#sse_startOverrideDate").data("kendoDatePicker").value(new Date(data.overrideStartDate));
			}
			
			if($("#sse_endContractualDate").data("kendoDatePicker") && data.contractualEndDate){
				$("#sse_endContractualDate").val(getProperlyFormattedDate(new Date(data.contractualEndDate)));
				//$("#sse_endContractualDate").data("kendoDatePicker").value(new Date(data.contractualEndDate));
			}
			
			if($("#sse_endDateCode").data("kendoDropDownList") && data.contractualEndDateCodeId){
				$("#sse_endDateCode").data("kendoDropDownList").value(data.contractualEndDateCodeId);
				$("#sse_endContractualDate").data("kendoDatePicker").value('');
				$("#sse_endContractualDate").data("kendoDatePicker").enable(false);
			}
			
			if($("#sse_endDateStatus").data("kendoDropDownList") && data.contractualEndDateStatusId){
				$("#sse_endDateStatus").data("kendoDropDownList").value(data.contractualEndDateStatusId);
			}
			
			if($("#sse_endOverrideDate").data("kendoDatePicker") && data.overrideEndDate){
				$("#sse_endOverrideDate").val(getProperlyFormattedDate(new Date(data.overrideEndDate)));
				//$("#sse_endOverrideDate").data("kendoDatePicker").value(new Date(data.overrideEndDate));
			}
		}
		
		if($("#sse_mediaTreeView").data("kendoHierarchySelector")){		
			var m = new Array();
			m.push(data.mediaId);
			$("#sse_mediaTreeView").data("kendoHierarchySelector").setSelected(m);
		}
		
		if($("#sse_territoryTreeView").data("kendoHierarchySelector")){
			var t = new Array();
			t.push(data.territoryId);
			$("#sse_territoryTreeView").data("kendoHierarchySelector").setSelected(t);
		}
		
		if($("#sse_languageTreeView").data("kendoHierarchySelector")){
			var l = new Array();
			l.push(data.languageId);
			$("#sse_languageTreeView").data("kendoHierarchySelector").setSelected(l);
		}
		
		
		
		if($("#sse_strandSetName").data("kendoComboBox") && data.strandSet){
			$("#sse_strandSetName").data("kendoComboBox").value(data.strandSet.rightStrandSetId);
		}
		
		this.populateSingleStrandStartingInfoCodes(data);
		
		infoCodeUtil.populateProductVersionInfo(angular.element(document.getElementById("rightsController")).scope());
	};
	
	/**
	 * Utility function 
	 */
	this.populateMultiRightStrandPopup = function(dataArray){
		
		$("#sse_exclusion").attr('checked', false);		
		$("#sse_inclusion").attr('checked', false);
		var data = dataArray[0];
		if(data.excludeFlag){
			$("#sse_exclusion")[0].checked = true;
		}
		else {
			$("#sse_inclusion")[0].checked = true;
		}
		this.showDeleteOverride();		
		this.showCorrectInfoCodePanel(false);
		this.showCheckboxes(true, data.excludeFlag);
		infoCodeUtil.populateProductVersionInfo(angular.element(document.getElementById("rightsController")).scope());
	};
	
	/**
	 * 
	 */
	this.populateSingleStrandStartingInfoCodes = function(data){
		var infoCodeIds = new Array();
		var that = this;
		this.hideDeleteOverride();		
		if(data && data.ermProductRightRestrictions){
			var ermRestrictions = data.ermProductRightRestrictions;
			$.each(ermRestrictions, function(idx, element){
				if((erm.security.isBusiness() && element.businessInd == 1) || (!erm.security.isBusiness() && element.legalInd == 1)){
					
					infoCodeIds.push(element.restriction.id);
					var startDate = element.startDate;
					var startDateCodeId = element.startDateCdId;
					var endDate = element.endDate;
					var endDateCodeId = element.endDateCdId;
					if(startDate || startDateCodeId || endDate || endDateCodeId){
						var s = element.restriction.code+","+element.restriction.description;
						var res = new restriction(element.restriction.id, startDate, startDateCodeId, endDate, endDateCodeId, s, element.restrictionCdId,element.rightRestrictionId);
						if(startDateCodeId){
							res.startDateCodeText = setDateCodeText(that.dateCodeArray, startDateCodeId);
						}
						if(endDateCodeId){
							res.endDateCodeText = setDateCodeText(that.dateCodeArray, endDateCodeId);
						}
						that.sse_restrictionObject.addNewRestriction(res);
					};
				};							
			});
			if(infoCodeIds.length > 0){
				$("#sse_infoCodeTreeView").data("kendoHierarchySelector").set(infoCodeIds);
			}
			var infoCodeAlternateDateDisplay = this.sse_restrictionObject.getRestrictionDisplay().join("<br>");
			$("#sse_infoCodeAlternateDateDisplay").html(infoCodeAlternateDateDisplay);
		};
	};
	
	/**
	 * 
	 */
	var setDateCodeText = function(dateCodeArray, dateCodeId){
		var d = "";
		if(dateCodeArray){
			$.each(dateCodeArray, function(idx, element){
				if(dateCodeId == element.id){
					d = element.description;
				}
			});
		}
		return d;
	};
	
	/**
	 * Method to get the current angular scope this object is running under.
	 */
	this.getCurrentAngularScope = function(){
		if(angular){
			return angular.element(document.getElementById("rightsController")).scope();
		}
		return "";
	};
	
	/**
	 * 
	 */
	this.getUTCDate = function(date){
		if(date){			
			
			var ms = date.getTime() - (date.getTimezoneOffset() * 60 * 1000);
			var d = new Date(ms);
			return d;
		}
		return date;
	};
	
	/**
	 * 
	 */
	this.processUpdateRightStrand = function(){
		
		var rightStrand = new rightStrandElement();
		
		rightStrand.ids = this.getGridRightStrandIds();
		
		if($("#sse_mediaTreeView").data("kendoHierarchySelector").getSelected() && $("#sse_mediaTreeView").data("kendoHierarchySelector").getSelected().length > 0){
			rightStrand.mediaId = $("#sse_mediaTreeView").data("kendoHierarchySelector").getSelected()[0].value;
		}
		else {
			rightStrand.mediaId = null;
		}
		
		if($("#sse_territoryTreeView").data("kendoHierarchySelector").getSelected() && $("#sse_territoryTreeView").data("kendoHierarchySelector").getSelected().length > 0){
			rightStrand.territoryId = $("#sse_territoryTreeView").data("kendoHierarchySelector").getSelected()[0].value;
		}
		else {
			rightStrand.territoryId = null;
		}
		
		if($("#sse_languageTreeView").data("kendoHierarchySelector").getSelected() && $("#sse_languageTreeView").data("kendoHierarchySelector").getSelected().length > 0){
			rightStrand.languageId = $("#sse_languageTreeView").data("kendoHierarchySelector").getSelected()[0].value;
		}
		else {
			rightStrand.languageId = null;
		}
		
		
  		
  		if(this.sse_isMultipleEdits){
  			if($("#sse_checkboxStrandSetName")[0].checked){
  				var st = new String($("#sse_strandSetName").data("kendoComboBox").text());
  				if(st){
  					st = st.trim().replace(/^\s\s*/, '_').replace(/\s\s*$/, '_');
  					if(st.length <= 0){
  						rightStrand.strandSetName = null;
  						rightStrand.strandSetId = -1;
  					}
  					else {
  						rightStrand.strandSetName = $("#sse_strandSetName").data("kendoComboBox").text().replace(/^\s\s*/, '_').replace(/\s\s*$/, '_');
  						rightStrand.strandSetId = $("#sse_strandSetName").data("kendoComboBox").value();
  					}
  				}
  				else {
  					rightStrand.strandSetId = -1;
  					rightStrand.strandSetName = null;
  				}
  			}
  			else {
  				rightStrand.strandSetId = null;
				rightStrand.strandSetName = null;
  			}
  		}
  		else {
  			rightStrand.strandSetName = $("#sse_strandSetName").data("kendoComboBox").text().replace(/^\s\s*/, '_').replace(/\s\s*$/, '_');
  	  		rightStrand.strandSetId = $("#sse_strandSetName").data("kendoComboBox").value();
  	  		
  		}
  		
  		if(rightStrand.strandSetName == ""){
  			rightStrand.strandSetName = null;
  		}

  		if ($("#sse_strandSetName").data("kendoComboBox").selectedIndex<0) {
  			rightStrand.strandSetId=null;  			
  		}  		
  		
  		if(isNaN(parseInt(rightStrand.strandSetId))){
			rightStrand.strandSetId = null;
		}
  		
  		rightStrand.startContractualDate = null;
  		rightStrand.startOverrideDate = null;
  		rightStrand.startDateCode = null;
  		rightStrand.startDateStatus = null;
  		rightStrand.endContractualDate = null;
  		rightStrand.endOverrideDate = null;
  		rightStrand.endDateCode = null;
  		rightStrand.endDateStatus = null;
  		rightStrand.changeStartDate = false;
  		rightStrand.changeEndDate = false;
  		rightStrand.changeOverrideStartDate = false;
  		rightStrand.changeOverrideEndDate = false;
  		rightStrand.deleteOverrideStartDate = false;
  		rightStrand.deleteOverrideEndDate = false;
  		
  		//get the delete override start and end date
  		if ($("#sse_startOverrideDelete").prop('checked')) {
  			rightStrand.deleteOverrideStartDate = true;  			
  		}
  		
  		if ($("#sse_endOverrideDelete").prop('checked')) {
  			rightStrand.deleteOverrideEndDate = true;
  		}
  		
  		
  		if($("#sse_inclusion")[0].checked){
  			if(this.sse_isMultipleEdits){
  				if($("#sse_checkboxTerm")[0].checked){
  	  				if(this.sse_startDateChanged){
  	  					rightStrand.changeStartDate = true;
  	  				}
  	  				
  	  				if(this.sse_endDateChanged){
  	  					rightStrand.changeEndDate = true;
  	  				}
  	  				
  	  				if(this.sse_overrideStartDateChanged){
  	  					rightStrand.changeOverrideStartDate = true;
  	  				}
  	  				
  	  				if(this.sse_overrideEndDateChanged){
  	  					rightStrand.changeOverrideEndDate = true;
  	  				}
  	  				

  	  				
  	  			}
  			}
  			else {
  				rightStrand.changeStartDate = true;
  				rightStrand.changeEndDate = true;
  				rightStrand.changeOverrideStartDate = true;
  				rightStrand.changeOverrideEndDate = true;
  			}
  			
  			rightStrand.startContractualDateString = getCorrectDateFromKendoDatePickerAsString("sse_startContractualDate");
  			if($("#sse_startDateCode").data("kendoDropDownList").value() > 0){
  				rightStrand.startDateCode = $("#sse_startDateCode").data("kendoDropDownList").value();
  			}
  			else {
  				rightStrand.startDateCode = null;
  			}
  			
  			if($("#sse_startDateStatus").data("kendoDropDownList").value() > 0){
  				rightStrand.startDateStatus = $("#sse_startDateStatus").data("kendoDropDownList").value();
  			}
  			else {
  				rightStrand.startDateStatus = null;
  			}
  			
  			rightStrand.startOverrideDateString = getCorrectDateFromKendoDatePickerAsString("sse_startOverrideDate");
  			
  			rightStrand.endContractualDateString = getCorrectDateFromKendoDatePickerAsString("sse_endContractualDate");
  	  		if($("#sse_endDateCode").data("kendoDropDownList").value() > 0){
  	  			rightStrand.endDateCode = $("#sse_endDateCode").data("kendoDropDownList").value();
  	  		}
  	  		else {
  	  			rightStrand.endDateCode = null;
  	  		}
  	  		
  	  		if($("#sse_endDateStatus").data("kendoDropDownList").value() > 0){
  	  			rightStrand.endDateStatus = $("#sse_endDateStatus").data("kendoDropDownList").value();
  	  		}
  	  		else {
  	  			rightStrand.endDateStatus = null;
  	  		}
  	  		
  	  		rightStrand.endOverrideDateString = getCorrectDateFromKendoDatePickerAsString("sse_endOverrideDate");
  	  		rightStrand.inclusionExclusion = $("#sse_inclusion")[0].value; 
  	  		
  		}else {
  			rightStrand.startContractualDate = null;
  			rightStrand.startDateCode = null;
  			rightStrand.startDateStatus = null;
  			rightStrand.startOverrideDate = null;
  			rightStrand.endContractualDate = null;
  			rightStrand.endDateCode = null;
  			rightStrand.endDateStatus = null;
  			rightStrand.endOverrideDate = null;
  			rightStrand.inclusionExclusion = $("#sse_exclusion")[0].value;
  			
  			
  		}
  		
  		if(this.sse_restrictionObject){
  			if(this.sse_isMultipleEdits){
  				infoCodeUtil.getRestrictionObject($("#sse_infoCodeTreeMultiView").data("kendoInfoCodeSelector").getDataItemsFromDS($("#sse_infoCodeTreeMultiView").data("kendoInfoCodeSelector").getAccumulatedAdd()), this.sse_restrictionObject);
  	  			rightStrand.restrictionsToAdd = this.sse_restrictionObject.getShortRestrictionObjectForRightStrand();
  			}
  			else {
  				infoCodeUtil.getRestrictionObject($("#sse_infoCodeTreeView").data("kendoHierarchySelector").getDataItemsFromDS($("#sse_infoCodeTreeView").data("kendoHierarchySelector").getAccumulated()), this.sse_restrictionObject);
  	  			rightStrand.restrictionsToAdd = this.sse_restrictionObject.getShortRestrictionObjectForRightStrand();
  			}
  		}
  		
  		rightStrand.restrictionsToRemove = [];
  		if($("#sse_infoCodeTreeMultiView").data("kendoInfoCodeSelector") && $("#sse_infoCodeTreeMultiView").data("kendoInfoCodeSelector").getAccumulatedRemove){
  			var restrictionRemove = new restrictionObject(null);
  			infoCodeUtil.getRestrictionObject($("#sse_infoCodeTreeMultiView").data("kendoInfoCodeSelector").getDataItemsFromDS($("#sse_infoCodeTreeMultiView").data("kendoInfoCodeSelector").getAccumulatedRemove()), restrictionRemove);
	  		rightStrand.restrictionsToRemove = restrictionRemove.getShortRestrictionObjectForRightStrand();
  		}
  		
  		var commentId = $("#sse_commentSection input[name='commentId']").val();
  		rightStrand.commentId = commentId;
  		
  		
  		rightStrand.processFlag = rightStrandProcessingOptions.UPDATE_RIGHT_STRAND;
  		rightStrand.commentTitle = $("#sse_rightStrandCommentTitle").val();
  		rightStrand.comment = $("#sse_rightStrandComment").val();
  		
  		var ob = rightStrand.getUpdateRightStrandObject();
  		console.log(" OBJECT : %o", JSON.stringify(ob));
  		this.submitRightStrandUpdate(ob);
	};
	
	/**
	 * 
	 */
	this.submitRightStrandUpdate = function(rightStrandObject){
		var that = this;
		var applyFilter = true;
		if(rightStrandObject){
			that.showSubmitPopupWindow();
			var jsonData = JSON.stringify(rightStrandObject);
			$.post(this.sse_path.getRightStrandUpdateRESTPath(), {q:jsonData}, function(data){				
				sse_submitPopupWindow.close();
				rightStrandEditWindow.close();
				var rcscope = angular.element(document.getElementById("rightsController")).scope();				
				rcscope.viewStrandsGrid(rcscope.currentProductArray.foxVersionId, data,undefined, applyFilter);
				rcscope.setUpdatedStrands(eval(data.length));
				rcscope.$apply();
				that.resetFields();
			}).fail(function(xhr,status,message){
				sse_submitPopupWindow.close();
				that.showErrorPanel(xhr.responseText);
			});
		}
	};
	
	/**
	 * function to validate the UI upon clicking the update button
	 */
	this.validateUpdateRightStrand = function(isMulti){
		
		if(isMulti){
			return this.validateUpdateMultipleRightStrand();
		}
		else {
			return this.validateUpdateSingleRightStrand();
		}
	};
	
	/**
	 * 
	 */
	this.validateUpdateMultipleRightStrand = function(){
		var mediaCheck = $("#sse_checkboxMedia")[0].checked;
		var territoryCheck = $("#sse_checkboxTerritory")[0].checked;
		var languageCheck = $("#sse_checkboxLanguage")[0].checked;
		var termCheck = $("#sse_checkboxTerm")[0].checked;
		var infoCodeCheck = $("#sse_checkboxInfoCodesMulti")[0].checked;
		var strandSetCheck = $("#sse_checkboxStrandSetName")[0].checked;
		var inclusionCheck = $("#sse_inclusion")[0].checked;
		var exclusionCheck = $("#sse_exclusion")[0].checked;
		var shouldSubmit = (mediaCheck || territoryCheck || languageCheck || termCheck || infoCodeCheck || strandSetCheck || inclusionCheck || exclusionCheck);
		var inclusionExclusion = (inclusionCheck || exclusionCheck);
		
		if(!inclusionExclusion){
			errorPopup.showErrorPopupWindow("You must indicate whether the strands should be inclusion or exclusion strands...");
			return false;
		}
		
		if(!shouldSubmit){
			errorPopup.showErrorPopupWindow("You must select at least one of the checkbox and make a selection...");
			return false;
		}
		
		
		if(!inclusionCheck && !exclusionCheck){
			errorPopup.showErrorPopupWindow("You must select one of the radio button, either inclusion or exclusion...");
			return false;
		}
		
		if(mediaCheck && $("#sse_mediaTreeView").data("kendoHierarchySelector").getSelected() && $("#sse_mediaTreeView").data("kendoHierarchySelector").getSelected().length <= 0){
			
			errorPopup.showErrorPopupWindow("You must select a media type...");
			return false;
		}
		
		if(territoryCheck && $("#sse_territoryTreeView").data("kendoHierarchySelector").getSelected() && $("#sse_territoryTreeView").data("kendoHierarchySelector").getSelected().length <= 0){
			errorPopup.showErrorPopupWindow("You must select a territory...");
			return false;
		}
		
		if(languageCheck && $("#sse_languageTreeView").data("kendoHierarchySelector").getSelected() && $("#sse_languageTreeView").data("kendoHierarchySelector").getSelected().length <= 0){
			errorPopup.showErrorPopupWindow("You must select a language...");
			return false;
		}
		
		if($("#sse_inclusion")[0].checked){
			if(termCheck){
				var bool =  this.validateTermMulti();
				if(!bool){
					return false;
				}
			}
			
		}
				
		return true;
	};
	
	/**
	 * 
	 */
	this.validateUpdateSingleRightStrand = function(){
		
		if(!$("#sse_inclusion")[0].checked && !$("#sse_exclusion")[0].checked){
			errorPopup.showErrorPopupWindow("You must select one of the radio button, either inclusion or exclusion...");
			return false;
		}
		
		if($("#sse_mediaTreeView").data("kendoHierarchySelector").getSelected() && $("#sse_mediaTreeView").data("kendoHierarchySelector").getSelected().length <= 0){
			
			errorPopup.showErrorPopupWindow("You must select a media type...");
			return false;
		}
		
		if($("#sse_mediaTreeView").data("kendoHierarchySelector").getSelected() && $("#sse_mediaTreeView").data("kendoHierarchySelector").getSelected().length > 1){
			
			errorPopup.showErrorPopupWindow("You must select at most one media type, (you cannot select multiple media)...");
			return false;
		}
		
		if($("#sse_territoryTreeView").data("kendoHierarchySelector").getSelected() && $("#sse_territoryTreeView").data("kendoHierarchySelector").getSelected().length <= 0){
			errorPopup.showErrorPopupWindow("You must select a territory...");
			return false;
		}
		
		if($("#sse_territoryTreeView").data("kendoHierarchySelector").getSelected() && $("#sse_territoryTreeView").data("kendoHierarchySelector").getSelected().length > 1){
			errorPopup.showErrorPopupWindow("You must select at most one territory, (you cannot select multiple territories)...");
			return false;
		}
		
		if($("#sse_languageTreeView").data("kendoHierarchySelector").getSelected() && $("#sse_languageTreeView").data("kendoHierarchySelector").getSelected().length <= 0){
			errorPopup.showErrorPopupWindow("You must select a language...");
			return false;
		}
		
		if($("#sse_languageTreeView").data("kendoHierarchySelector").getSelected() && $("#sse_languageTreeView").data("kendoHierarchySelector").getSelected().length > 1){
			errorPopup.showErrorPopupWindow("You must select at most one language, (you cannot select multiple languages)...");
			return false;
		}
						
		if($("#sse_inclusion")[0].checked){
			var bool =  this.validateTerm();
			if(!bool){
				return false;
			}
		}
				
		return true;
	};
	
	/**
	 * Validate the date entered before an attempt is made to submit.
	 */
	this.validateTerm = function(){
		//var startDateValue = getCorrectDateFromKendoDatePicker("sse_startContractualDate"); 
		var startDateValue = $("#sse_startContractualDate").data("kendoDatePicker").value();
		if(startDateValue == null || checkValidDateFormat($("#sse_startContractualDate").val(), "sse_startContractualDate")){
			startDateValue = $("#sse_startContractualDate").val();
		}
		
		//var endDateValue = getCorrectDateFromKendoDatePicker("sse_endContractualDate"); 
		var endDateValue = $("#sse_endContractualDate").data("kendoDatePicker").value();
		if(endDateValue == null || checkValidDateFormat($("#sse_endContractualDate").val(), "sse_endContractualDate")){
			endDateValue = $("#sse_endContractualDate").val();
		}
		
		var startDateCodeValue = $("#sse_startDateCode").data("kendoDropDownList").value();
		var endDateCodeValue = $("#sse_endDateCode").data("kendoDropDownList").value();
		
		//var startOverrideDateValue = getCorrectDateFromKendoDatePicker("sse_startOverrideDate"); 
		var startOverrideDateValue = $("#sse_startOverrideDate").data("kendoDatePicker").value();
		if(startOverrideDateValue == null || checkValidDateFormat($("#sse_startOverrideDate").val(), "sse_startOverrideDate")){
			startOverrideDateValue = $("#sse_startOverrideDate").val();
		}
		
		//var endOverrideDateValue = getCorrectDateFromKendoDatePicker("sse_endOverrideDate"); 
		var endOverrideDateValue = $("#sse_endOverrideDate").data("kendoDatePicker").value();
		if(endOverrideDateValue == null || checkValidDateFormat($("#sse_endOverrideDate").val(), "sse_endOverrideDate")){
			endOverrideDateValue = $("#sse_endOverrideDate").val();
		}
		
		if(!startDateValue && (!startDateCodeValue || parseInt(startDateCodeValue) < 0) && !startOverrideDateValue){
			errorPopup.showErrorPopupWindow("You must select either a term start date, or a start date code, or an override start date...");
			return false;
		}
		if(!endDateValue && (!endDateCodeValue || parseInt(endDateCodeValue) < 0) && !endOverrideDateValue){
			errorPopup.showErrorPopupWindow("You must select either a contractual end date, or a end date code, or an override end date...");
			return false;
		}
		
		var sd = this.getStartDateForValidation();
		var ed = this.getEndDateForValidation();
		if(sd && ed){
			if(ed <= sd){
				errorPopup.showErrorPopupWindow("The end date cannot be before or equal to the start date...");
				return false;
			}
		}
		return true;
	};
	
	this.validateTermMulti = function(){
		//var startDateValue = getCorrectDateFromKendoDatePicker("sse_startContractualDate");
		var startDateValue = $("#sse_startContractualDate").data("kendoDatePicker").value();
		if(startDateValue == null || checkValidDateFormat($("#sse_startContractualDate").val(), "sse_startContractualDate")){
			startDateValue = $("#sse_startContractualDate").val();
		}
		
		//var endDateValue = getCorrectDateFromKendoDatePicker("sse_endContractualDate");
		var endDateValue = $("#sse_endContractualDate").data("kendoDatePicker").value();
		if(endDateValue == null || checkValidDateFormat($("#sse_endContractualDate").val(), "sse_endContractualDate")){
			endDateValue = $("#sse_endContractualDate").val();
		}
		
		var startDateCodeValue = $("#sse_startDateCode").data("kendoDropDownList").value();
		var endDateCodeValue = $("#sse_endDateCode").data("kendoDropDownList").value();
		
		//var startOverrideDateValue = getCorrectDateFromKendoDatePicker("sse_startOverrideDate");
		var startOverrideDateValue = $("#sse_startOverrideDate").data("kendoDatePicker").value();
		if(startOverrideDateValue == null || checkValidDateFormat($("#sse_startOverrideDate").val(), "sse_startOverrideDate")){
			startOverrideDateValue = $("#sse_startOverrideDate").val();
		}
		
		//var endOverrideDateValue = getCorrectDateFromKendoDatePicker("sse_endOverrideDate");
		var endOverrideDateValue = $("#sse_endOverrideDate").data("kendoDatePicker").value();
		if(endOverrideDateValue == null || checkValidDateFormat($("#sse_endOverrideDate").val(), "sse_endOverrideDate")){
			endOverrideDateValue = $("#sse_endOverrideDate").val();
		}
		
		var bool = !startDateValue && (!startDateCodeValue || parseInt(startDateCodeValue) < 0) && !startOverrideDateValue;
		bool = bool && !endDateValue && (!endDateCodeValue || parseInt(endDateCodeValue) < 0) && !endOverrideDateValue;
		bool = bool && (startOverrideDateValue == null) && (endOverrideDateValue == null);
		if(bool){
			errorPopup.showErrorPopupWindow("You must select either a term start date, or a start date code, or an override start date, or contractual end date, or a end date code, or an override end date...");
			return false;
		}
		return true;
	};
	
	this.getStartDateForValidation = function(){
		if($("#sse_startOverrideDate").data("kendoDatePicker").value()){
			return Date.parse($("#sse_startOverrideDate").data("kendoDatePicker").value());
		}
		else if(checkValidDateFormat($("#sse_startOverrideDate").val(), "sse_startOverrideDate")){
			return Date.parse($("#sse_startOverrideDate").val());
		}
		if($("#sse_startContractualDate").data("kendoDatePicker").value()){
			return Date.parse($("#sse_startContractualDate").data("kendoDatePicker").value());
		}
		else if(checkValidDateFormat($("#sse_startContractualDate").val(), "sse_startContractualDate")){
			return Date.parse($("#sse_startContractualDate").val());
		}
		return null;
	};
	
	this.getEndDateForValidation = function(){
		if($("#sse_endOverrideDate").data("kendoDatePicker").value()){
			return Date.parse($("#sse_endOverrideDate").data("kendoDatePicker").value());
		}
		else if(checkValidDateFormat($("#sse_endOverrideDate").val(), "sse_endOverrideDate")){
			return Date.parse($("#sse_endOverrideDate").val());
		}
		if($("#sse_endContractualDate").data("kendoDatePicker").value()){
			return Date.parse($("#sse_endContractualDate").data("kendoDatePicker").value());
		}
		else if(checkValidDateFormat($("#sse_endContractualDate").val(), "sse_endContractualDate")){
			return Date.parse($("#sse_endContractualDate").val());
		}
		return null;
	};
	/*
	this.getStartDateForValidation = function(){
		if($("#sse_startOverrideDate").data("kendoDatePicker").value()){
			return Date.pase($("#sse_startOverrideDate").data("kendoDatePicker").value());
		}
		if($("#sse_startContractualDate").data("kendoDatePicker").value()){
			return Date.parse($("#sse_startContractualDate").data("kendoDatePicker").value());
		}
		return null;
	};
	*/
	/**
	 * This method initialize the radio buttons and it also bind the click events
	 */
	this.initializeRadioButtons = function(){
		
		var sseObject = this;
		this.sse_inclusion = $("#sse_inclusion");
		this.sse_exclusion = $("#sse_exclusion");
		$("#sse_inclusion").click(function(){
			if($(this)[0].checked){			
				if(!sseObject.sse_isMultipleEdits ){
					sseObject.enableDisableTerm(true);
					sseObject.enableDisableInfoCodes(true);						
				}
				else{
					sseObject.sse_checkboxTerm.show();
					sseObject.sse_checkboxTerm.attr('checked', false);
					sseObject.sse_checkboxInfoCodesMulti.show();
					sseObject.sse_checkboxInfoCodesMulti.attr('checked', false);
					$("#sse_checkboxInfoCodesMulti").unbind();
					$("#sse_checkboxInfoCodesMulti").click(function(){
						if($(this)[0].checked){
							sseObject.enableDisableInfoCodes(true);
						}
						else {
							sseObject.enableDisableInfoCodes(false);
						}
					});
				}
			}
			
		});
		
		$("#sse_exclusion").click(function(){
			if($(this)[0].checked){
				sseObject.enableDisableTerm(false);
				sseObject.enableDisableInfoCodes(false);
				if(sseObject.sse_checkboxTerm[0].checked){
					sseObject.sse_checkboxTerm.attr("checked", false);
				}
				if(sseObject.sse_checkboxInfoCodesMulti[0].checked){
					sseObject.sse_checkboxInfoCodesMulti.attr("checked", false);
				}
				sseObject.sse_checkboxTerm.hide();
				sseObject.sse_checkboxInfoCodesMulti.hide();
			}
		});
		
	};
	
	/**
	 * Initialize the UI buttons and bind the click events
	 */
	this.initializeButtons = function(){
		var that = this;
		
		$("#sse_updateRightStrand").click(function(){
			if(that.validateUpdateRightStrand(that.sse_isMultipleEdits)){
				that.processUpdateRightStrand();
			}
		});
		
		$("#sse_addEditButton").click(function(){
			var val = null;
			if(that.sse_isMultipleEdits){
				var d = that.sse_infoCodeTreeMultiView.getAccumulatedAdd();
				val = that.sse_infoCodeTreeMultiView.getDataItemsFromDS(d);
			}
			else {
				val = that.sse_infoCodeTreeView.getDataItemsFromDS(that.sse_infoCodeTreeView.getAccumulated());
			}
			
			if(val && val.length > 0){
				var ds = that.buildInfoCodeDataSource(val);
				//NOTE rightStrandUpdateObject is a global object.
				//TODO refactor so is not global
				ds = infoCodeUtil.addDatesToDataSource(ds, rightStrandUpdateObject.sse_restrictionObject);
				that.openInfoCodePopupWindow(ds, test2InfoCodePopup, that.processInfoCodeSpecialDates, false);
			}
			else {
				errorPopup.showErrorPopupWindow(" You must first select some info codes, before you can modify their dates...");
			}
		});
		
		$("#sse_cancelRightStrandEdit").click(function(){
			rightStrandEditWindow.close();
			that.resetFields();			
		});
		
		$("#errorPanelClose").click(function(){
			that.hideErrorPanel();
		});
	};
	
	this.buildInfoCodeDataSource = function(data){
		var gridDataSource =new Array();
		if(data){
			$.each(data, function(idx, element){
				var ob = new Object();
				ob.code = element.code;
				ob.id = element.id;
				ob.restrictionTypeId = element.restrictionTypeId;
				ob.restrictionTypeName = element.restrictionTypeName;
				ob.description = element.description;
				ob.startDate = "";
				ob.endDate = "";
				ob.allowEndDateFlag = element.allowEndDateFlag;
				ob.allowStartDateFlag = element.allowStartDateFlag;
				gridDataSource.push(ob);
			});
		}
		return gridDataSource;
	}
	
	/**
	 * Initialize all the UI checkboxes and bind the click events needed to 
	 * disable the various UI elements
	 */
	this.initCheckboxes = function(){
		var that = this;
		this.sse_checkboxLanguage = $("#sse_checkboxLanguage");
		$("#sse_checkboxLanguage").click(function(){
			if($(this)[0].checked){
				$("#sse_languageTreeView").attr("disabled", false);
				that.sse_languageText.removeClass("disableTextClass");				
			}
			else {
				$("#sse_languageTreeView").attr("disabled", true);
				that.sse_languageText.addClass("disableTextClass");
				$("#sse_languageTreeView").data("kendoHierarchySelector").set([]);
			}
		});
		$("#sse_checkboxLanguage").hide();
		
		this.sse_checkboxMedia = $("#sse_checkboxMedia");
		$("#sse_checkboxMedia").click(function(){
			if($(this)[0].checked){
				$("#sse_mediaTreeView").attr("disabled", false);
				that.sse_mediaText.removeClass("disableTextClass");
			}
			else {
				$("#sse_mediaTreeView").attr("disabled", true);
				that.sse_mediaText.addClass("disableTextClass");
				$("#sse_mediaTreeView").data("kendoHierarchySelector").set([]);
			}
		});
		$("#sse_checkboxMedia").hide();
		
		
		this.sse_checkboxTerritory = $("#sse_checkboxTerritory");
		$("#sse_checkboxTerritory").click(function(){
			if($(this)[0].checked){
				$("#sse_territoryTreeView").attr("disabled", false);
				that.sse_territoryText.removeClass("disableTextClass");
			}
			else {
				$("#sse_territoryTreeView").attr("disabled", true);
				that.sse_territoryText.addClass("disableTextClass");
				$("#sse_territoryTreeView").data("kendoHierarchySelector").set([]);
			}
		});
		$("#sse_checkboxTerritory").hide();
		
		this.sse_checkboxTerm = $("#sse_checkboxTerm");
		$("#sse_checkboxTerm").click(function(){
			if(!$("#sse_exclusion")[0].checked){
				if($(this)[0].checked){
					that.enableDisableTerm(true);
				}
				else {
					that.enableDisableTerm(false);
				}
			}			
		});
		$("#sse_checkboxTerm").hide();
		
		this.sse_checkboxInfoCodesMulti = $("#sse_checkboxInfoCodesMulti");
		$("#sse_checkboxInfoCodesMulti").click(function(){
			if($(this)[0].checked){
				that.enableDisableInfoCodes(true);
			}
			else {
				that.enableDisableInfoCodes(false);
			}
		});
		$("#sse_checkboxInfoCodesMulti").hide();
		
		this.sse_checkboxStrandSetName = $("#sse_checkboxStrandSetName");
		$("#sse_checkboxStrandSetName").click(function(){
			if($(this)[0].checked){
				that.enableDisableStrandSet(true);
			}
			else {
				that.enableDisableStrandSet(false);
			}
		});
		$("#sse_checkboxStrandSetName").hide();
	};
	
	/**
	 * 
	 */
	this.enableDisableTreeSelectors = function(bool){
		
		$("#sse_mediaTreeView").attr("disabled", bool);
		$("#sse_languageTreeView").attr("disabled", bool);
		$("#sse_territoryTreeView").attr("disabled", bool);
		
		if(bool){
			$("#sse_mediaText").addClass("disableTextClass");
			$("#sse_languageText").addClass("disableTextClass");
			$("#sse_territoryText").addClass("disableTextClass");
		}
		else {
			$("#sse_mediaText").removeClass("disableTextClass");
			$("#sse_languageText").removeClass("disableTextClass");
			$("#sse_territoryText").removeClass("disableTextClass");
		}
		
	};
	
	/**
	 * Enable/disable the stand set combo box and grays out the strand set label
	 */
	this.enableDisableStrandSet = function(bool){
		$("#sse_strandSetName").data("kendoComboBox").value("");
		$("#sse_strandSetName").data("kendoComboBox").enable(bool);
		
		if(bool){			
			$("#sse_strandSetText").removeClass("disableTextClass");
		}
		else {
			$("#sse_strandSetText").addClass("disableTextClass");
		}
	};
	
	/**
	 * Shows/hides the checkboxes and disables the required fields in the case where multiple 
	 * strands are being edited 
	 */
	this.showCheckboxes = function(bool, excludeFlag){
		var that = this;
		if(bool){
			$("#sse_checkboxLanguage").show();			
			$("#sse_checkboxMedia").show();
			$("#sse_checkboxTerritory").show();
			if(!excludeFlag){
				$("#sse_checkboxTerm").show();
				$("#sse_checkboxInfoCodesMulti").show();
				$("#sse_checkboxInfoCodesMulti").unbind();
				$("#sse_checkboxInfoCodesMulti").click(function(){
					if($(this)[0].checked){
						that.enableDisableInfoCodes(true);
					}
					else {
						that.enableDisableInfoCodes(false);
					}
				});
			}
			else {
				$("#sse_checkboxTerm").hide();
				$("#sse_checkboxInfoCodesMulti").hide();	
				$("#sse_checkboxInfoCodesMulti").off('click');
			}
			
			$("#sse_checkboxStrandSetName").show();
			
			this.enableDisableInfoCodes(!bool);
			this.enableDisableTerm(!bool);
			this.enableDisableTreeSelectors(bool);
			this.enableDisableStrandSet(!bool);			
		}
		else {
			
			$("#sse_checkboxLanguage").hide();
			$("#sse_checkboxMedia").hide();
			$("#sse_checkboxTerritory").hide();
			$("#sse_checkboxTerm").hide();
			$("#sse_checkboxInfoCodesMulti").hide();	
			$("#sse_checkboxInfoCodesMulti").off('click');
			$("#sse_checkboxStrandSetName").hide();
		}
	};
	
	/**
	 * Main method responsible for initializing all the elements on the page
	 */
	this.initializeElements = function(data){
		
		this.initStrandSetName(rightStrandUpdateObject);
		
		this.initTerm();
		
		this.initSingleStrandInfoCodes();
		
		this.initStrandMTLT();
		
		this.initializeRadioButtons();
		
		this.initializeButtons();
		
		this.initAddEditInfoCode();
		
		this.initCheckboxes();
		
		this.initRightStrandEditWindow();
		
		this.initializeSubmitWindow();
		
		this.hideErrorPanel();
		
		this.initializeCommentBox();
		
	};
	


	
	/**
	 * function responsible for showing the popup add/edit info code window
	 */
	this.openInfoCodePopupWindow = function(dataSource, popupWindowReference, processInfoCodeSpecialDates){
		strandComments.init('icp_commentSection');		
		infoCodePopupObject.setGridDataSource(dataSource, popupWindowReference, processInfoCodeSpecialDates);
		var d = $("#test2_addEditInfoCodeWindow").data("kendoWindow");
		d.setOptions({
			visible : true,
			modal : true,			
		});
		$("#icp_enableStartDate").attr('checked', false);
		$("#icp_enableEndDate").attr('checked', false);		

		infoCodePopupObject.disableEndDate();
		infoCodePopupObject.disableStartDate();
		
		
		d.title("Modify Info Codes");
		d.center();
		d.open();
	};
	
	/**
	 * 
	 */
	this.openInfoCodePopupWindowStandAlone = function(selectedRestriction){
		var dataSource = selectedRestriction;
		var gridDataSource =new Array();
		strandComments.init('icp_commentSection');
		if(dataSource){
			this.sse_standAloneInfoCodeArray = dataSource;
			$.each(dataSource, function(idx, element){
				var ob = new Object();
				ob.code = element.restriction.code;
				ob.id = element.restriction.id; //element.rightRestrictionId;
				ob.restrictionTypeId = element.restriction.restrictionTypeId;
				ob.restrictionTypeName = element.restriction.restrictionTypeName;
				ob.description = element.restriction.description;
				var startDate = element.startDate == null ? null : new Date(element.startDate);
				ob.startDate = strands.getDate(startDate, erm.dbvalues.getDateCodeById(element.startDateCdId));
				var endDate = element.endDate == null ? null : new Date(element.endDate);
				ob.endDate = strands.getDate(endDate, erm.dbvalues.getDateCodeById(element.endDateCdId));
				ob.restrictionId = element.restriction.id;
				ob.rightRestrictionId = element.rightRestrictionId;
				ob.allowStartDateFlag = element.restriction.allowStartDateFlag;
				ob.allowEndDateFlag = element.restriction.allowEndDateFlag;
				gridDataSource.push(ob);
			});
		}
		this.openInfoCodePopupWindow(gridDataSource, test2InfoCodePopup, rightStrandUpdateObject.processStandAloneRestrictionEdit);
	};
	
	/**
	 * 
	 */
	this.closeInfoCodePopupWindow = function(){
		test2InfoCodePopup.close();
	};
	
	/**
	 * 
	 */
	this.showCorrectInfoCodePanel = function(bool){
		
		if(bool){
			$("#sse_singlePanelInfoCodes").show();
			$("#sse_multiPanelInfoCodes").hide();
		}
		else {
			$("#sse_singlePanelInfoCodes").hide();
			$("#sse_multiPanelInfoCodes").show();
		}
	};
	
	/**
	 * function responsible for taking incoming data and passing it to the grid building function
	 * 
	 */
	this.loadGrid = function(data){
		if(data){
			var containInactiveTerritory = ((allTerritoryActive(gridStrandsConfigurator.getSelectedMap()) & 1) == 1);
			var containInactiveMedia = ((allMediaActive(gridStrandsConfigurator.getSelectedMap()) & 1) == 1);
			this.sse_gridData = data;
			
			if((this.sse_gridData.length > 1) || containInactiveTerritory || containInactiveMedia){
				this.sse_isMultipleEdits = true;			
			}
		}
		
		
		
		
	};
	
	/**
	 * Code that initialize the div window where the add/edit info codes window will appear
	 */
	this.initAddEditInfoCode = function initAddEditInfoCode(){
		if (!$("#test2_addEditInfoCodeWindow").data("kendoWindow")) {
			$("#test2_addEditInfoCodeWindow").kendoWindow({
                width: "1125px",
                height : "550px",
                minWidth : "1125px",
                minHeight : "550px",
                title: "Modify Rights Strands / Info Codes",
                actions: [                    
                    "Maximize",
                    "Close"
                ],
                visible : false               
            });
        }
		test2InfoCodePopup = $("#test2_addEditInfoCodeWindow").data("kendoWindow");		
	};
	
	/**
	 * Initialiaze the Right strand edit popup window
	 */
	this.initRightStrandEditWindow = function (){
		var that = this;
		if (!$("#sse_rightStrandPopupWindow").data("kendoWindow")) {
			$("#sse_rightStrandPopupWindow").kendoWindow({
                width: "1125px;",
                height : "750px",
                minWidth : "1125px;",
                minHeight : "750px",
                title: "Modify Rights Strands / Info Codes",
                actions: [
                    "Maximize",
                    "Close"
                ],
                visible : false,
                close : function(){
                	$("#errorParagraph").html("");
                	that.resetFields();
                }
            });
        }
		rightStrandEditWindow = $("#sse_rightStrandPopupWindow").data("kendoWindow");
	};
	
	/**
	 * 
	 */
	this.openRightStrandEditWindow = function(data){
		sse_showAddComment = false;
		if(!this.indicatorCheckForMultipleEdit(data, businessUser)){
			if(businessUser){
				errorPopup.showErrorPopupWindow("As a business user you cannot edit legal only strand");
			}
			else {
				errorPopup.showErrorPopupWindow("As a legal user you cannot edit business only strand");
			}
		}
		else if(data && data.length > 0){
			
			this.sse_gridData = data;
			var d = $("#sse_rightStrandPopupWindow").data("kendoWindow");
			d.setOptions({
				visible : true,
				modal : true
			});
			d.center();
			d.open();
			this.loadGrid(this.sse_gridData);
			if(this.sse_isMultipleEdits){
				this.populateMultiRightStrandPopup(this.sse_gridData);	
				$("#sse_infoCodeTreeMultiView").data("kendoInfoCodeSelector").populateSelectorAlt();
			}	
			else {
				this.populateRightStrandPopup(this.sse_gridData);
				$("#sse_infoCodeTreeView").data("kendoHierarchySelector").populateSelectorAlt();
			}
			this.initStrandSetName();
			strands.showStrandsGrid(this.sse_gridData, "sse_rightStrandGrid", "sse_parent_rightStrandGrid", false);
			this.enableCommentBox();
			
			strandComments.init('sse_commentSection');
			
		}
		else {
			errorPopup.showErrorPopupWindow("No strands were selected so there is noting to edit");
		}
	};
	
	/**
	 * This method is to be used as a callback method. It will be passed to the 
	 * popup window to attach different dates to selected info codes. It will be
	 * called from the popup window with the selected results as a restriction Object
	 */
	this.processInfoCodeSpecialDates = function(resObject){
		if(resObject){
			if(rightStrandUpdateObject.sse_restrictionObject){
				$.each(resObject.restrictions, function(idx, element){
					rightStrandUpdateObject.sse_restrictionObject.addNewRestrictionAlt(element);
				});
			}
			else {
				rightStrandUpdateObject.sse_restrictionObject = resObject;
			}
			var displayStringArray = rightStrandUpdateObject.sse_restrictionObject.getRestrictionDisplay();
			if(displayStringArray){
				$("#sse_infoCodeAlternateDateDisplay").html(displayStringArray.join("<br>"));
			}
		}
	};
	
	/**
	 * 
	 */
	this.processInfoCodeAccumulatorChange = function(restrictionIds){
		var restrictionsToAdd = rightStrandUpdateObject.sse_restrictionObject.restrictions;
		if(restrictionsToAdd && restrictionsToAdd.length > 0 && restrictionIds && restrictionIds.length > 0){
			var toRemove = new Array();
			var counter = 0;
			$.each(restrictionsToAdd, function(id, elem){
				var bool = false;
				for(var i = 0; i < restrictionIds.length; i++){					
					if(elem.restrictionCodeId == restrictionIds[i]){						
						bool = true;
						break;
					}
				}
				if(!bool){
					toRemove.push(counter);
				}
				counter++;
			});
			if(toRemove.length > 0){
				$.each(toRemove, function(id, elem){
					rightStrandUpdateObject.sse_restrictionObject.restrictions.splice(elem, 1);
				});
			}
		}
		else if(!restrictionIds || restrictionIds.length <= 0){
			rightStrandUpdateObject.sse_restrictionObject.restrictions = new Array();
		}
		var displayStringArray = rightStrandUpdateObject.sse_restrictionObject.getRestrictionDisplay();
		if(displayStringArray){
			$("#sse_infoCodeAlternateDateDisplay").html(displayStringArray.join("<br>"));
		}
	};
	
	/**
	 * return an array of id's of the right strands being edited.
	 */
	this.getGridRightStrandIds = function(){
		var ids = new Array();
		$.each(this.sse_gridData, function(idx, element){
			ids.push(element.rightStrandId);
		});
		return ids;
	};
	
	this.resetTitleFields = function(){
	   $("#sse_productTitlePopup").html("");
	   $("#ssse_productCode").html("");
	   $("#ssse_productTypeCode").html("");
	   $("#ssse_firstReleaseDate").html("");
	   $("#ssse_productionYear").html("");
	   $("#ssse_currentFoxId").html("");
	   $("#ssse_currentFoxVersionId").html("");
	   $("#ssse_currentFoxIdJDE").html("");
	};
	
	this.resetRadioButtons = function(){
		if($("#sse_inclusion")){
			$("#sse_inclusion").attr('checked', false);
		}
		if($("#sse_exclusion")){
			$("#sse_exclusion").attr('checked', false);
		}
	};
	
	this.resetMTLTFields = function(){
		if($("#sse_checkboxMedia")){
			$("#sse_checkboxMedia").attr('checked', false);
		}
		if($("#sse_checkboxLanguage")){
			$("#sse_checkboxLanguage").attr('checked', false);
		}
		if($("#sse_checkboxTerritory")){
			$("#sse_checkboxTerritory").attr('checked', false);
		}
		
		$("#sse_mediaText").removeClass('disableTextClass');
		$("#sse_languageText").removeClass('disableTextClass');
		$("#sse_territoryText").removeClass('disableTextClass');
		
		$("#sse_mediaTreeView").data("kendoHierarchySelector").set([]);
		$("#sse_mediaTreeView").attr('disabled', false);
		if($("#sse_mediaText").hasClass('disableTextClass')){
			$("#sse_mediaText").removeClass('disableTextClass');
		}
		$("#sse_languageTreeView").data("kendoHierarchySelector").set([]);
		$("#sse_languageTreeView").attr('disabled', false);
		if($("#sse_languageText").hasClass('disableTextClass')){
			$("#sse_languageText").removeClass('disableTextClass');
		}
		$("#sse_territoryTreeView").data("kendoHierarchySelector").set([]);
		$("#sse_territoryTreeView").attr('disabled', false);
		if($("#sse_territoryText").hasClass('disableTextClass')){
			$("#sse_territoryText").removeClass('disableTextClass');
		}
		
	};
	
	this.resetStrandSetFields = function(){
		if($("#sse_strandSetText").hasClass('disableTextClass')){
			$("#sse_strandSetText").removeClass('disableTextClass');
		}
		$("#sse_strandSetName").data("kendoComboBox").value('');
		$("#sse_strandSetName").data("kendoComboBox").enable(true);
		
		$("#sse_checkboxStrandSetName").attr('checked', false);
	};
	
	/**
	 * 
	 */
	this.resetInfoCodeFields = function(){
		
		$("#sse_infoCodeTreeView").data("kendoHierarchySelector").set([]);		
		$("#sse_infoCodeTreeView").attr('disabled', false);		
		$("#sse_infoCodeTreeMultiView").data("kendoInfoCodeSelector").clear();
		$("#sse_infoCodeTreeMultiView").attr('disabled', false);		
		$("#sse_checkboxInfoCodesMulti").attr('checked', false);		
		$("#sse_restrictionTreeNodePanel").attr('disabled', false);
		$("#sse_restrictionTreeNodePanelAdd").attr('disabled', false);
		$("#sse_restrictionTreeNodePanelRemove").attr('disabled', false);		
		if($("#sse_infoCodeTreeViewText").hasClass('disableTextClass')){
			$("#sse_infoCodeTreeViewText").removeClass('disableTextClass');
		}				
		$("#sse_checkboxInfoCodesMulti").attr('checked', false);		
		if($("#sse_infoCodeTerms").hasClass('disableTextClass')){
			$("#sse_infoCodeTerms").removeClass('disableTextClass');
		}		
		$("#sse_addEditButton").attr('disabled', false);
		$("#sse_infoCodeAlternateDateDisplay").html("");
		$("#sse_infoCodeAlternateDateDisplay").attr('disabled', false);
		
	};
	
	this.resetFields = function(){
		this.resetTitleFields();
		this.resetMTLTFields();
		this.resetStrandSetFields();
		this.resetInfoCodeFields();
		this.enableDisableTerm(true);
		$("#sse_checkboxTerm").attr('checked', false);
		this.sse_isMultipleEdits = false;
		this.sse_restrictionObject.resetFields();
		$("#errorPanel").hide();
		this.disableCommentBox();
		this.sse_startDateChanged = false;
		this.sse_endDateChanged = false;
		this.sse_overrideStartDateChanged = false;
		this.sse_overrideEndDateChanged = false;
	};
	
	this.showSubmitPopupWindow = function(){
		var d = $("#sse_submitPopupWindow").data("kendoWindow");
		d.setOptions({
			visible : true,
			modal : true
		});
		d.center();
		d.open();		
	};
	
	this.initializeSubmitWindow = function(){
		if (!$("#sse_submitPopupWindow").data("kendoWindow")) {
			$("#sse_submitPopupWindow").kendoWindow({
                width: "450px",
                height : "150px",
                minWidth : "450px",
                minHeight : "150px",
                title: "",
                actions: [],
                visible : false,
                close : function(){
                	$("#errorParagraph").html("");
                }
            });
        }
		sse_submitPopupWindow = $("#sse_submitPopupWindow").data("kendoWindow");
	};
	
	/**
	 * 
	 */
	this.showErrorPanel = function(text){
		$("#errorPanelInner").html(text);
		$("#errorPanel").show();
		$("#errorPanel").focus();
	};
	
	/**
	 * 
	 */
	this.hideErrorPanel = function(){
		$("#errorPanelInner").html("");
		$("#errorPanel").hide();
	};
	
	/**
	 * 
	 */
	this.validateAdoptRightStrand = function(data){
		var result = false;
		
		if(data && data.length > 0){
			$.each(data, function(index, element){
				if(businessUser){
					if(element.businessInd){
						errorPopup.showErrorPopupWindow(" As a business user you cannot adopt a  business strand...");						
						result = true;
					}
				}
				else{
					if(element.legalInd){
						errorPopup.showErrorPopupWindow(" As a legal user you cannot adopt a  legal strand...");
						result = true;
					}
				}
			});
			
		}
		else {
			result = true;
		}
		return result;
	};
	
	
	
	/**
	 * 
	 */
	this.validateAdoptRestrictions = function(data, rightStrandIds){
		var errorString = null;
		var result = false;
		
		if(data && data.length > 0){
			for(var i = 0; i < data.length; i++){
				if(businessUser){
					if(data[i].businessInd){
						errorString = " As a business user you cannot adopt a business informational codes";
						result = true;
						break;
					}
					else if(!(data[i].parentBusinessInd || !rightStrandIds[data.rightStrandId])){
						errorString = " You cannot adopt this legal informational code without having adopted the right strand to which this informational code belongs ";
						result = true;
						break;
					}
				}
				else {
					if(data[i].legalInd){
						errorString = " As a legal user you cannot adopt a legal informational code";
						result = true;
						break;
					}
					else if(!(!data[i].parentBusinessInd || !rightStrandIds[data.rightStrandId])){
						errorString = " You cannot adopt this business informational code without having adopted the right strand to which this informational codes belongs ";
						result = true;
						break;
					}
				}
			}
		}
		else {
			result = true;
		}
		if(errorString != null){
			errorPopup.showErrorPopupWindow(errorString);
		}
		return result;
	};
	
	/**
	 * 
	 */
	this.processStandAloneRestrictionEdit = function(resObject){
		if(resObject != null){
			var rightStrand = new rightStrandElement();
			var d = new Array();
			
			$.each(resObject.restrictions, function(id, elem){
				var ob = new Object();
				ob.restrictionCodeId = null;
				ob.startDateCodeId = elem.startDateCodeId;
				ob.endDateCodeId = elem.endDateCodeId;
				ob.startDate = elem.startDate;
				ob.startDateString = elem.startDateString; 
				ob.endDate = elem.endDate;
				ob.endDateString = elem.endDateString; 
				ob.restrictionId = elem.rightRestrictionId; 
				ob.productRestrictionId = null;
				ob.endDateExprInstncId = null;
				ob.startDateExprInstncId = null;
				var commentId = resObject.commentId;
				if (commentId&&parseInt(commentId)) {
					ob.commentId = parseInt(commentId);
					ob.commentTimestampId = resObject.commentTimestampId;
				}
				ob.changeStartDate = elem.changeStartDate;
				ob.changeEndDate = elem.changeEndDate;
				d.push(ob);
			});
			
			rightStrand.restrictionsToAdd = d;
			var ob = rightStrand.getEditRightStrandRestrictionsObject();
			console.log(" STAND ALONE RESTRICTION JSON OBJECT : %o", JSON.stringify(ob));			
			var url = rightStrandUpdateObject.sse_path.getUpdateRestrictionsRESTPath();
			rightStrandUpdateObject.submitRightStandAlternate(ob, url);
		}
		else {
			errorPopup.showErrorPopupWindow("Invalid restrictions seletion");
		}
	};
	
	/**
	 * 
	 */
	this.processAdoptRightStrand = function(data, selectedRestrictions){
		//TODO change to RightStrandElement(). Classes should start with Uppercase
		var rightStrand = new rightStrandElement();
		this.sse_gridData = data;
		rightStrand.ids = this.getGridRightStrandIds();
		var res = new restrictionObject(null);
		if(selectedRestrictions && selectedRestrictions.length > 0){
			
			$.each(selectedRestrictions, function(index, element){
				var restrict = new restriction(element.restriction.id, null, null, null, null, null, null);
				restrict.rightRestrictionId = element.rightRestrictionId;
				res.addNewRestrictionAlt(restrict);
			});	
			
			rightStrand.restrictionsToAdd = res.getShortRestrictionObjectForRightStrand();
		}
		
		var ob = rightStrand.getAdoptRightStrandObject(rightStrandProcessingOptions.ADOPT_RIGHT_STRAND);		
		
		this.showSubmitPopupWindow();
		var jsonData = JSON.stringify(ob);	
		
		var jqxhr = $.post(this.sse_path.getRightStrandAdoptRESTPath(), {q:jsonData}, function(data){
			var applyFilter = true;			
			var isStrandRestrictions = data && data.ermRestrictions && data.ermRestrictions.length>0;
			sse_submitPopupWindow.close();
			var rsArray = ob.ids;
			if (isStrandRestrictions) {
				rsArray = data.ermRestrictions;
			}
			
			rcscope = angular.element(document.getElementById("rightsController")).scope();
			if(rsArray && rsArray.length > 0){
			  rcscope.setUpdatedStrands(eval(rsArray.length));				
			}
			rcscope.viewStrandsGrid(rcscope.currentProductArray.foxVersionId, rsArray,isStrandRestrictions,applyFilter);
			rcscope.$apply();
		}).fail(function(xhr,status,message){
			sse_submitPopupWindow.close();
			var st = new String(xhr.responseText);
			st = st.replace(/\n/g, "<br>").replace(/"/g, "");		
			var ex = "Exception:";
			while(st.indexOf(ex) > -1){
				st = st.substring(st.indexOf(ex)+ex.length);
			}
			// remove extra error message
			if (st.indexOf("\\n") > 0){
			  st = st.substring(0, st.indexOf("\\n"));
			}
			errorPopup.showErrorPopupWindow(st);
		});
		
		this.sse_gridData = null;
	};
	
	/**
	 * 
	 */
	this.submitRightStandAlternate = function(ob, url){
		
		
		var jsonData = JSON.stringify(ob);	
		
		rightStrandUpdateObject.showSubmitPopupWindow();
		var jqxhr = $.post(url, {q:jsonData}, function(data){				
			sse_submitPopupWindow.close();
			var rsArray = data;
			rcscope = angular.element(document.getElementById("rightsController")).scope();
			rcscope.viewStrandsGrid(rcscope.currentProductArray.foxVersionId, rsArray, true);
			rcscope.$apply();			
		}).fail(function(xhr,status,message){
			sse_submitPopupWindow.close();
			var st = new String(xhr.responseText);
			st = st.replace(/\n/g, "<br>");
			var ex = "Exception:";
			while(st.indexOf(ex) > -1){
				st = st.substring(st.indexOf(ex)+ex.length);
			}
			// remove extra error message
			if (st.indexOf("\\n") > 0){
			  st = st.substring(0, st.indexOf("\\n"));
			}
			errorPopup.showErrorPopupWindow(st);
		});
	};
	
	/**
	 * 
	 * @param data
	 */
	this.validateAdoptProductRestrictions = function(data){
		var errorString = null;
		var result = false;
		if(data && data.length > 0){
			for(var i = 0; i < data.length; i++){
				if(businessUser){
					if(data[i].businessInd){
						errorString = " As a business user you cannot adopt a business product restriction";
						result = true;
						break;
					}
				}
				else {
					if(data[i].legalInd){
						errorString = " As a legal user you cannot adopt a legal product restriction";
						result = true;
						break;
					}
				}
			}
		}
		else {
			errorString = " You must first select some info codes to adopt ";
			result = true;
		}
		if(errorString != null){
			errorPopup.showErrorPopupWindow(errorString);
		}
		
		return result;
	};
	
	/**
	 * 
	 */
	this.processAdoptProductInfoCodes = function(data){
		
		var productRestriction = new productRestrictionObject();
		
		if(data && data.length > 0){
			var res = new restrictionObject(null);
			$.each(data, function(index, element){
				var restrict = new restriction(element.restriction.id, null, null, null, null, null, null);
				restrict.productRestrictionId = element.productRestrictionId;
				res.addNewRestrictionAlt(restrict);
			});	
			
			productRestriction.restrictions = res.getShortRestrictionObjectForRightStrand();
			var ob = productRestriction.getRestrictionObject();
			var jsonData = JSON.stringify(ob);
			
			
			this.showSubmitPopupWindow();
			var jqxhr = $.post(this.sse_path.getProductInfoCodeAdoptRESTPath(), {q:jsonData}, function(data){				
				sse_submitPopupWindow.close();
				rcscope = angular.element(document.getElementById("rightsController")).scope();
				if(data && data.length > 0){
					var arr = new Array();
					$.each(data, function(index, element){
						arr.push(data.productRestrictionId);
					});
					rcscope.setUpdatedProductCodeRestrictions(eval(data.length));	
					rcscope.viewProductRestrictionsGrid(rcscope.currentProductArray.foxVersionId, arr);
					rcscope.showHideRightStrandSection(true);
					rcscope.$apply();
				}
			}).fail(function(xhr,status,message){
				sse_submitPopupWindow.close();
				errorPopup.showErrorPopupWindow(xhr.responseText);
			});
			
		}
	};
	
	/**
	 * Determine, in the case of multiple strands or info codes edit, whether or not the user can edit those strands
	 */
	this.indicatorCheckForMultipleEdit = function(data, isBusiness){
		var canEdit = true;
		
		if(data && data.length > 0){
			
			if(isBusiness){
				for(var i = 0; i < data.length; i++){
					if(!data[i].businessInd){
						canEdit = false;
						break;
					}
				}
			}
			else {
				for(var i = 0; i < data.length; i++){
					if(!data[i].legalInd){
						canEdit = false;
						break;
					}
				}
			}
		}
		return canEdit;
	};
	
	/**
	 * 
	 */
	this.initializeCommentBox = function() {
		if (!$("#sse_rightStrandComment").data("kendoEditor")) {
			this.commentsEditor = $("#sse_rightStrandComment").kendoEditor({			
				tools: [
				  { name: "bold" },
				  { name: "italic" },
				  { name: "underline" },
				  { name: "strikethrough" },
				  { name: "justifyLeft" },
				  { name: "justifyCenter" }, 
				  { name: "justifyRight" }, 
				  { name: "justifyFull" },
				  { name: "insertUnorderedList" }, 
				  { name: "insertOrderedList" },
				  { name: "indent" },
				  { name: "outdent" }, 
				  { name: "createLink" },
				  { name: "insertImage" }, 
				  { name: "formatting" },
				  { name: "fontName" }, 
				  { name: "fontSize" },
				  { name: "foreColor" },
				  { name: "backColor" },
				  { name: "subscript" },
				  { name: "superscript" },
				  { name: "createTable" },
				  { name: "viewHtml" },			  
				  { 
					name: "upperLowerCase",
					title: "Upper Case / Lower Case",
		            exec: function(e) {	              
		              var editor = $(this).data("kendoEditor");	              	              	             
		              var selection = editor.getSelection();
		              var formatEntire = false;
		              if (selection.toString() == "") {
		            	formatEntire = true;
		            	selection = editor.body.innerHTML;
		            	var range = editor.createRange();
		            	range.selectNodeContents(editor.body);
			            editor.selectRange(range);
		              }
		              if (formatEntire) {
		            	if (convertToUpperCase)
		            	  editor.exec("inserthtml", { value: selection.toString().toUpperCase()  });
			            else
			              editor.exec("inserthtml", { value: selection.toString().toLowerCase()  });
		            	convertToUpperCase = !convertToUpperCase;
		              } else {
		                if (selection.toString() != selection.toString().toUpperCase())
		                  editor.exec("inserthtml", { value: selection.toString().toUpperCase()  });
		                else
		            	  editor.exec("inserthtml", { value: selection.toString().toLowerCase()  });
		              }
		            }
				  },
				  { 
			        name: "extraSpaces",
			        title: "Remove extra spaces between words",
			        exec: function(e) {	              
		              var editor = $(this).data("kendoEditor");	              	              	             
		              var selection = editor.getSelection();	              
		              if (selection.toString() == "") {	            	
		            	selection = editor.body.innerHTML;
		            	var range = editor.createRange();
		            	range.selectNodeContents(editor.body);
			            editor.selectRange(range);
		              }
		              var selectedHTML = editor.selectedHtml();	              	              
		              selectedHTML = selectedHTML.replace(/\s*(&nbsp\;)+\s*/g, '&nbsp\;');				          
		              selectedHTML = selectedHTML.replace(/(\.)&nbsp\;\s*/g, '$1&nbsp\;&nbsp\;');
			          editor.paste(selectedHTML);
			        }	
				  },
				  { 
				    name: "extraParagraphSpaces",
				    title: "Remove extra spaces between paragraphs",
			        exec: function(e) {
			          var editor = $(this).data("kendoEditor");	              	              	             
			          var selection = editor.getSelection();	              
			          if (selection.toString() == "") {	            	
			            selection = editor.body.innerHTML;
			            var range = editor.createRange();
			            range.selectNodeContents(editor.body);
				        editor.selectRange(range);
			          }	              		          		          
			          var selectedHTML = editor.selectedHtml();
			          selectedHTML = selectedHTML.replace(/<p><\/p><p><\/p>/g, '<p><\/p>');		          		          		          
			          editor.paste(selectedHTML);
			        }	
			      },			      
			      {
			    	name: "tabIcon",
				    title: "Insert Tab",
			        exec: function(e) {
			          var editor = $(this).data("kendoEditor");			          	           			          	              		          		       				      
		              var selectedHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";	
				      editor.paste(selectedHTML);
			        }
			      }			      
				]
			});						
		}
	};
	
	this.disableCommentBox = function(){
	};
	
	this.enableCommentBox = function(){
		
	};
}

var rightStrandUpdateObject = new RightStrandUpdate();
var test2InfoCodePopup = null;
var rightStrandEditWindow = null;
var sse_submitPopupWindow = null;
var businessUser = erm.security.isBusiness();
var sse_showAddComment = false;
