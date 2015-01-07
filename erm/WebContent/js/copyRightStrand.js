function copyRightStrand(){
	
	this.crs_paths = paths();
	this.crs_gridData = null;
	this.restrictionsToAdd = new Array();
	this.crs_MULTI_PRODUCT_RESPONSE = "multiProductResponse";
	this.crs_STRANDS_IDS = "strandsIds";
	this.crs_currentError = null;
	this.crs_startDateChanged = false;
	this.crs_endDateChanged = false;
	this.crs_overrideStartDateChanged = false;
	this.crs_overrideEndDateChanged = false;

	//override start and end date delete field
	this.crs_overrideStartDateDelete = false;
	this.crs_overrideEndDateDelete = false;
	
	
	
	this.commentsEditor = null;
	
	
	
	/**************************************************************************************************
	 *                                                                                                *
	 * Initialization section : This section of code is responsible for initializing all the elements *
	 *                                                                                                *
	 **************************************************************************************************/
	/**
	 * Main initialize method. The method is called from partials/rightsEdit.html where the template is loaded and 
	 * all the elements initialize.
	 */
	this.initializeElements = function(){
		this.initializeMTL();
		this.initializeTerms();
		this.initializeInfoCodes();
		this.initializeButtons();
		this.initializeCheckboxes();
		this.initializeRadioButton();
		this.initRightStrandCopyWindow();		
		this.initAddEditInfoCode();
		this.initializeStrandSet();
		this.initializeSubmitWindow();
		this.initializeCommentBox();
	};
	
	/**
	 * Initializes the copy right strand popup window
	 */
	this.initRightStrandCopyWindow = function (){
		var that = this;
		if (!$("#crs_rightStrandCopyPopupWindow").data("kendoWindow")) {
			$("#crs_rightStrandCopyPopupWindow").kendoWindow({
                width: "1125px;",
                height : "800px",
                minWidth : "1050px;",
                minHeight : "800px",
                title: "Copy Rights Strands / Info Codes",
                actions: [
                    "Maximize",
                    "Close"
                ],
                visible : false,
                close : function(){
                	that.closePartial();                	
                	var searchResultsScope = angular.element(document.getElementById("erm-product-search-results")).scope();
                	searchResultsScope.doClearResults();
                	searchResultsScope.doHideSearchResults();
           		    var productSearchScope = angular.element(document.getElementById("productSearchController")).scope();           		    
           		    productSearchScope.productSearch.searchOptionsChanged = true;
                }
            });
        }
		crs_rightStrandCopyWindow = $("#crs_rightStrandCopyPopupWindow").data("kendoWindow");
	};
	
	/**
	 * This function initializes the Media, Territory, and Language boxes and their accumulators
	 */
	this.initializeMTL = function(){
		
		initMTLSelectors = function initMTLSelectors() {
			if(!$("#crs_mediaSelector").data("kendoHierarchySelector")){
				$("#crs_mediaSelector").kendoHierarchySelector({
					dataSource : erm.dbvalues.mediaNodes,
					add : "crs_addMedia",
					remove : "crs_removeMedia",
					accumulator : "crs_mediaSelected",
					id : "id",
					text : "text"
				});
			}			
			
			if(!$("#crs_territorySelector").data("kendoHierarchySelector")){
				$("#crs_territorySelector").kendoHierarchySelector({
					dataSource : erm.dbvalues.territoryNodes,
					add : "crs_addTerritory",
					remove : "crs_removeTerritory",
					accumulator : "crs_territorySelected",
					id : "id",
					text : "text"
				});
			}
			
			if(!$("#crs_languageSelector").data("kendoHierarchySelector")){
				$("#crs_languageSelector").kendoHierarchySelector({
					dataSource : erm.dbvalues.languageNodes,
					add : "crs_addlanguage",
					remove : "crs_removelanguage",
					accumulator : "crs_languageSelected",
					id : "id",
					text : "text"
				});
			}
			
			
		};
		
		erm.dbvalues.afterInit(initMTLSelectors);
				
		
	};
	
	/**
	 * function to be called when the user changes the start date code
	 */
	var onStartDateCodeChange = function(){
    	var sdc = $("#crs_startDateCode").data("kendoDropDownList");
    	var sds = $("#crs_startDateStatus").data("kendoDropDownList");
		var cdp = $("#crs_startContractualDate").data("kendoDatePicker");
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
    	copyRightStrandObject.crs_startDateChanged = true;
    };
    
    /**
     * function to be called when the user changes the end date code
     */
    var onEndDateCodeChange = function(){
    	var sdc = $("#crs_endDateCode").data("kendoDropDownList");
    	var sds = $("#crs_endDateStatus").data("kendoDropDownList");
		var cdp = $("#crs_endContractualDate").data("kendoDatePicker");
    	var selectedValue = sdc.dataItem();
    	if(selectedValue){    		
    		if(selectedValue.id == 2){	        			
    			cdp.value("");
    			cdp.enable(false);
    			sds.value("-1");
    			sds.enable(false);
    		}
    		else if(selectedValue.id == 1){
    			sds.enable(true);
    			sds.value("1");
    			cdp.enable(false);	        			
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
    	copyRightStrandObject.crs_endDateChanged = true;
    };
    
    /**
     * function to be called when the user changes the term start date
     */
    var onStartContractualDateChange = function(){
    	var cdp = $("#crs_startContractualDate").data("kendoDatePicker");
    	var sds = $("#crs_startDateStatus").data("kendoDropDownList");
    	if(cdp.value != null){ 			        		
    		sds.value("1");
    	}
    	copyRightStrandObject.crs_startDateChanged = true;
    };
    
    /**
     * function to be called when the user changes the contractual end date
     */
    var onEndContractualDateChange = function(){
    	var cdp = $("#crs_endContractualDate").data("kendoDatePicker");
    	var sds = $("#crs_endDateStatus").data("kendoDropDownList");
    	if(cdp.value != null){  			        		
    		sds.value("1");
    	}
    	copyRightStrandObject.crs_endDateChanged = true;
    };
    
    var onStartOverrideDateChange = function(){
    	copyRightStrandObject.crs_overrideStartDateChanged = true;
    };
    
    var onEndOverrideDateChange = function(){
    	copyRightStrandObject.crs_overrideEndDateChanged = true;
    };
    
	this.disableDeleteOverride = function disableDeleteOverride() {
		//disable the delete override checkboxes and un check them
		$("#crs_startOverrideDelete").attr("disabled", true).attr('checked',false);
		$("#crs_endOverrideDelete").attr("disabled", true).attr('checked',false);		
	};
	
	this.enableDeleteOverride = function enableDeleteOverride() {
		$("#crs_startOverrideDelete").removeAttr("disabled");
		$("#crs_endOverrideDelete").removeAttr("disabled");		
	};
	
	this.showDeleteOverride = function showDeleteOverride() {
		$("#crs_endOverrideDeleteSection").show();
		$("#crs_startOverrideDeleteSection").show();
	};
	
	this.hideDeleteOverride = function hideDeleteOverride() {

		$("#crs_endOverrideDeleteSection").hide();
		$("#crs_startOverrideDeleteSection").hide();
		
		
		$("#crs_startOverrideDelete").attr('checked',false);
		$("#crs_endOverrideDelete").attr('checked',false);
	};

    
	
	/**
	 * Function responsible for initializing the terms (term start date, start date code, end date code, etc..).
	 * kendo objects are used for the various fields
	 */
	this.initializeTerms = function(){
		this.disableDeleteOverride();
		
		$.getJSON(this.crs_paths.getAllDateCodesRESTPath(), function(data){
	   		if(data){
	   			var partialData = new Array();
	   			for(var i = 0; i < data.length; i++){
	   				if(data[i].id != 1){
	   					partialData.push(data[i]);
	   				}
	   			}
	   			$("#crs_startDateCode").kendoDropDownList({
	   	            filter:"startswith",
	   	            autoBind : true,
	   	            dataTextField: "description",
	   	            dataValueField: "id",
	   	            template: "${ data.description }",
	   	            dataSource : partialData,
	   	            change : onStartDateCodeChange
	   	        });
	   			
	   			$("#crs_endDateCode").kendoDropDownList({
	   	            filter:"startswith",
	   	            autoBind : true,
	   	            dataTextField: "description",
	   	            dataValueField: "id",
	   	            template: "${ data.description }",
	   	            dataSource : data,
	   	            change : onEndDateCodeChange
	   	        });
	   		}	   		
	   	});	
		
		$.getJSON(this.crs_paths.getAllDateStatusRESTPath(), function(data){
			
			if(data){
				$("#crs_startDateStatus").kendoDropDownList({
					dataTextField : "description",
					dataValueField : "id", 
					template : "${ data.description }",
					dataSource : data
				});
				
				$("#crs_endDateStatus").kendoDropDownList({
					dataTextField : "description",
					dataValueField : "id", 
					template : "${ data.description }",
					dataSource : data
				});
			}
		});
		
		$("#crs_startContractualDate").kendoDatePicker({
       		footer: "Today - #=kendo.toString(data, 'd') #",
       		format : "MM/dd/yyyy",
       		parseFormats : ["yyyy-MM-dd", "EEE, d MMM yyyy", "EEE, MMM d, \'\'yy"],
       		start : "year",
       		change : onStartContractualDateChange
        });
		
		$("#crs_endContractualDate").kendoDatePicker({
       		footer: "Today - #=kendo.toString(data, 'd') #",
       		format : "MM/dd/yyyy",
       		parseFormats : ["yyyy-MM-dd", "EEE, d MMM yyyy", "EEE, MMM d, \'\'yy"],
       		start : "year",
       		change : onEndContractualDateChange
        });
		
		$("#crs_startOverrideDate").kendoDatePicker({
       		footer: "Today - #=kendo.toString(data, 'd') #",
       		format : "MM/dd/yyyy",
       		parseFormats : ["yyyy-MM-dd", "EEE, d MMM yyyy", "EEE, MMM d, \'\'yy"],
       		start : "year",
       		change : onStartOverrideDateChange
        });
		
		$("#crs_endOverrideDate").kendoDatePicker({
       		footer: "Today - #=kendo.toString(data, 'd') #",
       		format : "MM/dd/yyyy",
       		parseFormats : ["yyyy-MM-dd", "EEE, d MMM yyyy", "EEE, MMM d, \'\'yy"],
       		start : "year",
       		change : onEndOverrideDateChange
        });
	};
	
	/**
	 * Initialize the Info codes select box along with the add and remove accumulators
	 */
	this.initializeInfoCodes = function(){
		var that = this;
		this.toTitleCase = function(str) {
			return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		};
		erm.dbvalues.afterInit(function() {
			 var d = new Array();
			 $.each(erm.dbvalues.activeRestrictions, function(idx, element){
				 var ob = new Object();
				 ob = element;	
				 ob.description2 = ob.code.toUpperCase() + " - " +  that.toTitleCase(ob.description);
				 d.push(ob);
			 });				 	
			 
			 if(!$("#crs_infoCodeSelector").data("kendoInfoCodeSelector")){
				 $("#crs_infoCodeSelector").kendoInfoCodeSelector({
					dataSource : d,
					addToAdd : "crs_addInfoCodesAdd",
					removeFromAdd : "crs_removeInfoCodesAdd",
					addToRemove : "crs_addInfoCodesRemove",
					removeFromRemove : "crs_removeInfoCodesRemove",
					accumulatorAdd : "crs_restrictionAddSelected",
					accumulatorRemove : "crs_restrictionRemoveSelected",
					value : "id",
					text : "description2"
				 });
			 }
			
		});	
				
		$("#crs_addInfoCodesAdd").click(function(){
			that.processAddedRestrictionsWithTimeout();
		});
		
		$("#crs_removeInfoCodesAdd").click(function(){
			that.processAddedRestrictionsWithTimeout();
		});
		
		$("#crs_restrictionAddSelected").change(function(){
			setTimeout(function(){
				that.processInfoCodeAccumulatorChange($("#crs_infoCodeSelector").data("kendoInfoCodeSelector").getAccumulatedAdd());				
			}, 1000);
		});
	};
	
	/**
	 * Initialize the strand set section
	 */
	this.initializeStrandSet = function(){
		$("#crs_strandSetComboBox").kendoComboBox({
            filter:"startswith",
            dataTextField: "strandSetName",
            dataValueField: "rightStrandSetId",
            template: "${ data.strandSetName }"	                
        });
	};
	
	/**
	 * Initialize the addEdit info code button and the search button and attach the click event handler
	 */
	this.initializeButtons = function(){	
		
		var that = this;
		$("#crs_addEditButton").click(function(){
			var ics = $("#crs_infoCodeSelector").data("kendoInfoCodeSelector");
			var d = ics.getDataItemsFromDS(ics.getAccumulatedAdd());
			if(d && d.length > 0){
				var ds = that.buildInfoCodeDataSource(d);
				that.openInfoCodePopupWindow(ds, crs_infoCodePopup, that.processInfoCodeCustomDates);
			}
			else {
				errorPopup.showErrorPopupWindow(" You must first add some info code before you can modify their terms");
			}
		});
		
		$("#crs_copyRightStrand").click(function(){
			that.processCopyStrand(false);
		});
		
		$("#crs_convertRightStrand").click(function(){
			that.processCopyStrand(true);
		});
		
		$("#crs_cancelCopyRightStrand").click(function(){
			that.close();
		});
		
		$("#crs_searchForTargetProductsButton").unbind();
		$("#crs_searchForTargetProductsButton").click(function(event){
			$(".crossProductTargetsArea").empty();
			var mainScope = angular.element(document.getElementById("mainController")).scope();
			mainScope.setUpSearchButton(event);			
			that.resetSearchArea();
			var productSearchScope = erm.scopes.search();
			productSearchScope.setCopySearch();
			productSearchScope.$apply();			
		});
		
		this.clearTargetProducts = function clearTargetProducts() {
			$("#crs_targetProductList").empty();
			$("#crs_targetProductList option").remove();			
			
		};
		
		$("#crs_removeTargetProductsToCopy").unbind();
		$("#crs_removeTargetProductsToCopy").click(function(event){								
			event.preventDefault();			
			var options = $("#crs_targetProductList option:not(:selected)");						
			var op = new Array();
			$.each(options, function(id, elem){
				op.push(elem);
			});
			that.clearTargetProducts();
//			$("#crs_targetProductList").empty();
			$.each(op, function(id, elem){
				$("#crs_targetProductList").append($("<option></option>").attr("value", elem.value).text(elem.text));
			});		    		   
		});
		
		$("#crs_errorPanelClose").click(function(){
			that.hideErrorPanel();
		});
		
		$("#crs_populateActiveTerritories").click(function(){
			that.setupForInactiveTerritory(that);
		});
		this.resetRadioButtons();
	};
	
	
	
	/**
	 * This function build the data source for the info code popup window
	 */
	this.buildInfoCodeDataSource = function(){
		var gridDataSource =new Array();
		if(this.restrictionsToAdd){
			$.each(this.restrictionsToAdd, function(idx, element){
				var ob = new Object();
				ob.code = element.restrictionCdName;
				ob.id = element.restrictionCdId;
				ob.restrictionTypeId = element.restrictionTypeId;
				ob.restrictionTypeName = element.restrictionTypeName;
				ob.description = element.description;
				ob.startDate = element.getCorrectStartDateForDisplay();
				ob.endDate = element.getCorrectEndDateForDisplay();
				ob.allowStartDateFlag = element.allowStartDateFlag;
				ob.allowEndDateFlag = element.allowEndDateFlag;
				gridDataSource.push(ob);
			});
		}
		return gridDataSource;
	};
	
	/**
	 * Code that initialize the div window where the add/edit info codes window will appear
	 */
	this.initAddEditInfoCode = function initAddEditInfoCode(){
		//TODO change this name
		var infoCodesWindowId = "#test2_addEditInfoCodeWindow";
		if (!$(infoCodesWindowId).data("kendoWindow")) {
			$(infoCodesWindowId).kendoWindow({
                width : "750px",
                height : "550px",
                minWidth : "750px",
                minHeight : "550px",
                title : "Modify Rights Strands / Info Codes",
                actions : [                    
                    "Maximize",
                    "Close"
                ],
                visible : false               
            });
        }
		crs_infoCodePopup = $(infoCodesWindowId).data("kendoWindow");
	};
	
	/**
	 * Section initializing the checkboxes for the popup window
	 */
	this.initializeCheckboxes = function(){
		
		var that = this;
		
		$("#crs_mediaControlCheckbox").click(function(){
			if($(this)[0].checked){
				that.enableMedia();
			}
			else {
				that.disableMedia();
			}
		});
		
		$("#crs_territoryControlCheckbox").click(function(){
			if($(this)[0].checked){
				that.enableTerritory();
			}
			else {
				that.disableTerritory();
			}
		});
		
		$("#crs_languageControlCheckbox").click(function(){
			if($(this)[0].checked){
				that.enableLanguage();
			}
			else {
				that.disableLanguage();
			}
		});
		
		$("#crs_termControlCheckbox").click(function(){
			if($(this)[0].checked){
				that.enableTerms();
			}
			else {
				that.disableTerms();
			}
		});
		
		$("#crs_infoCodeControlCheckbox").click(function(){
			if($(this)[0].checked){
				that.enableInfoCodes();
				$("#crs_addEditButton").attr("disabled", true);
			}
			else {
				that.disableInfoCodes();
			}
		});
		
		$("#crs_strandSetControlCheckbox").click(function(){
			if($(this)[0].checked){
				that.enableStrandSet();
			}
			else {
				that.disableStrandSet();
			}
		});
		
		$("#crs_both").click(function(){
			$(this)[0].checked = true;
		});
	};
	
	/**
	 * Initialize the exclusion and inclusion radio buttons
	 */
	this.initializeRadioButton = function(){
		var that = this;
		$("#crs_inclusion").click(function(){
			if($(this)[0].checked){
				that.enableWhenInclusionChecked();
				that.disableWhenInclusionChecked();
			}
		});
		
		$("#crs_exclusion").click(function(){
			if($(this)[0].checked){
				that.disableWhenExclusionChecked();
				that.enableWhenExclusionChecked();
			}
		});
		
		$("#crs_both").click(function(){
			if($(this)[0].checked){
				that.disableAllElements();
				that.disableCheckboxes();
			}
		});
	};
	
	this.initializeSubmitWindow = function(){
		if (!$("#crs_submitPopupWindow").data("kendoWindow")) {
			$("#crs_submitPopupWindow").kendoWindow({
                width: "450px",
                height : "150px",
                minWidth : "450px",
                minHeight : "150px",
                title: "",
                actions: [],
                visible : false,
                close : function(){
                	//$("#errorParagraph").html("");
                }
            });
        }
		crs_submitPopupWindow = $("#crs_submitPopupWindow").data("kendoWindow");
	};
	
	this.initializeCommentBox = function() {		
	};
		
	this.initializeCopyRightStrandUnsuccessfulPopup = function(){
		var that = this;
		if (!$("#crs_copyRightStrandUnsuccessful").data("kendoWindow")) {
			$("#crs_copyRightStrandUnsuccessful").kendoWindow({
                width: "450px",
                height : "250px",
                minWidth : "450px",
                minHeight : "250px",
                title: "",
                actions: [],
                visible : false,
            });
        }
		
		$("#crs_reCopyRightStrand").unbind();
		$("#crs_reCopyRightStrand").click(function(){
		});
		
		$("#crs_cancelReCopyRightStrand").click(function(){
			that.close();
		});
	};
	
	/******************************************************************************************************
	 *                                                                                                    *
	 * END Initialization section : This section of code is responsible for initializing all the elements *
	 *                                                                                                    *
	 ******************************************************************************************************/
	
	/******************************************************************************************************
	 *                                                                                                    *
	 * START business logic section : This section of code is processing the result of the                * 
	 * user interactions                                                                                  *
	 *                                                                                                    *
	 ******************************************************************************************************/
	
	/**
	 * This function is responsible for loading the selected strands into the grid and 
	 * opening the popup window. It is called from the strandsGrid.js file.
	 */
	this.showRightStrandCopyWindow = function(data){
		//init comment section
		strandComments.init('crs_commentSection');
//		copyRightStrandObject.enableCommentBox();
		if(data && data.length > 0){
			copyRightStrandObject.crs_gridData = data;
			copyRightStrandObject.disableAllElements();
			$("#crs_targetProductListSuccess").hide();
			if(this.areStrandBothInclusionAndExclusion()){
				$("#crs_bothObption").show();
				this.selectedRadioButton(2);
			}
			else {
				$("#crs_bothObption").hide();
				
				var dataObject = data[0];
				if(dataObject.excludeFlag){
					$("#crs_exclusion")[0].checked = true;
					this.selectedRadioButton(1);
				}
				else {
					$("#crs_inclusion")[0].checked = true;
					this.selectedRadioButton(0);
				}
				
				
			}
			this.resetSearchBoxes();
			this.changeButtonToStartState();
			this.populateProductVersionInfo();
			
			//AMV
			this.clearRestrictionsToAddCustomData();
			
			crs_rightStrandCopyWindow = $("#crs_rightStrandCopyPopupWindow").data("kendoWindow");			
			crs_rightStrandCopyWindow.setOptions({
				visible : true,
				modal : true
			});
			crs_rightStrandCopyWindow.center();
			crs_rightStrandCopyWindow.open();
			
			$("#crs_infoCodeSelector").data("kendoInfoCodeSelector").populateSelectorAlt();
			$("#crs_mediaSelector").data("kendoHierarchySelector").populateSelectorAlt();
			$("#crs_territorySelector").data("kendoHierarchySelector").populateSelectorAlt();
			$("#crs_languageSelector").data("kendoHierarchySelector").populateSelectorAlt();																
			strands.showStrandsGrid(data, "crs_rightStrandGrid", "crs_parent_rightStrandGrid", false, "145px");
			copyRightStrandObject.showPopulateActiveTerritoryButton();
		}
		
	};
	
	/**
	 * This function is responsible for resetting all the fields to their initial state
	 */
	this.resetFields = function(){
		
		this.disableAllElements();
	};
	
	/**
	 * This method is to be used as a callback method. It will be passed to the 
	 * popup window to attach different dates to selected info codes. It will be
	 * called for the popup window with the selected results as a restriction Object
	 */
	this.processInfoCodeCustomDates = function(resObject){
		if(resObject){
			if(resObject.restrictions && resObject.restrictions.length > 0){
				$.each(resObject.restrictions, function(idx, elem){
					copyRightStrandObject.processCustomRestrictionsDate(elem);
				});
				
				copyRightStrandObject.buildCustomInfoDisplay();
			}
		}
	};
	
	this.clearRestrictionsToAddCustomData = function clearRestrictionsToAddCustomData() {
		var add = this.restrictionsToAdd;
		if (add) {
			add.forEach(function(restriction){
				restriction.changeStartDate = false;
				restriction.changeEndDate = false;
				restriction.startDate = undefined;
				restriction.endDate = undefined;
			});
			
		}
		
	};
	
	/**
	 * 
	 */
	this.processCustomRestrictionsDate = function(restriction){
		if(restriction){
			for(var i = 0; i < this.restrictionsToAdd.length; i++){
				if(restriction.restrictionCodeId == this.restrictionsToAdd[i].restrictionCdId){
					this.restrictionsToAdd[i].startDate = restriction.startDate;
					this.restrictionsToAdd[i].startDateCdId = restriction.startDateCodeId;
					this.restrictionsToAdd[i].endDate = restriction.endDate;
					this.restrictionsToAdd[i].endDateCdId = restriction.endDateCodeId;
					this.restrictionsToAdd[i].startDateCdName = restriction.startDateCodeText;
					this.restrictionsToAdd[i].endDateCdName = restriction.endDateCodeText;
					this.restrictionsToAdd[i].restrictionCdName = restriction.restrictionCode;
					this.restrictionsToAdd[i].commentId = restriction.commentId;
//					this.restrictionsToAdd[i].comment = restriction.comment;
//					this.restrictionsToAdd[i].commentTitle = restriction.commentTitle;
					this.restrictionsToAdd[i].commentTimestampId = restriction.commentTimestampId;
					this.restrictionsToAdd[i].changeStartDate = restriction.changeStartDate;
					this.restrictionsToAdd[i].changeEndDate = restriction.changeEndDate;
					break;
				}
			}
		}
	};
	
	/**
	 * 
	 */
	this.buildCustomInfoDisplay = function(){
		
		if(this.restrictionsToAdd && this.restrictionsToAdd.length > 0){
			var displayArray = new Array();
			$.each(this.restrictionsToAdd, function(idx, elem){
				var bool = ((elem.startDate && elem.startDate > 0) || (elem.startDateCdId && elem.startDateCdId > 0)) || ((elem.endDate && elem.endDate > 0) || (elem.endDateCdId && elem.endDateCdId > 0));
				
				if(bool){
					displayArray.push(elem.getCodeDateDisplayString());
				}
			});
			
			$("#crs_infoCodeCustomDateDisplay").html(displayArray.join("<br>"));
		} else {
			$("#crs_infoCodeCustomDateDisplay").html("");			
		}
	};
	
	/**
	 * 
	 */
	this.processInfoCodeAccumulatorChange = function(restrictionIds){
		var that = this;
		if(this.restrictionsToAdd && this.restrictionsToAdd.length > 0 && restrictionIds && restrictionIds.length > 0){
			var toRemove = new Array();
			var counter = 0;
			$.each(this.restrictionsToAdd, function(id, elem){
				var bool = false;
				for(var i = 0; i < restrictionIds.length; i++){
					
					if(elem.restrictionCdId == restrictionIds[i]){
						
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
					that.restrictionsToAdd.splice(elem, 1);
				});
			}
		}
		else if(!restrictionIds || restrictionIds.length <= 0){
			this.restrictionsToAdd = new Array();
		}
		this.buildCustomInfoDisplay();
	};
	
	/**
	 * function responsible for showing the popup add/edit info code window
	 */
	this.openInfoCodePopupWindow = function(dataSource, popupWindowReference, processInfoCodeSpecialDates){
		//init comment section
		strandComments.init('icp_commentSection');		
		infoCodePopupObject.setGridDataSource(dataSource, popupWindowReference, processInfoCodeSpecialDates);
		var d = $("#test2_addEditInfoCodeWindow").data("kendoWindow");
		d.setOptions({
			visible : true,
			modal : true
		});
		d.title("Modify Info Codes");
		d.center();
		d.open();
	};
	
	/**
	 * function responsible for processing the value added to the add accumulator.
	 * We use a function with a timeout to add a delay before getting the values
	 * in the accumulator, otherwise we will get inaccurate values from the accumulator
	 */
	this.processAddedRestrictionsWithTimeout = function(){
		var that = this;
		setTimeout(function(){
			var nodes = $("#crs_infoCodeSelector").data("kendoInfoCodeSelector").getDataItemsFromDS($("#crs_infoCodeSelector").data("kendoInfoCodeSelector").getAccumulatedAdd());
			if(!nodes || nodes.length <= 0){
				$("#crs_addEditButton").attr("disabled", true);
			}
			else {
				$("#crs_addEditButton").attr("disabled", false);
			}
//			that.processInfoCodeAccumulatorChange(nodes);			
			that.processAddedRestrictions(nodes);		
		}, 500);	
	};
	
	/**
	 * This is a method that will help with managing the info codes 
	 * custom dates
	 */
	this.processAddedRestrictions = function(nodes){
		var that = this;
//		if(nodes && nodes.length > 0){		
		if(nodes ){
			//Let us find which one of the new nodes 
			//are not already included in the restriction array
			var newNodes = new Array();
			$.each(nodes, function(idx, elem){
				var bool = false;
				for(var element=0; element < that.restrictionsToAdd.length; element++){
					if(that.restrictionsToAdd[element].restrictionCdId == elem.id){
						bool = true;
						break;
					}
				};
				if(!bool){
					newNodes.push(elem);
				}
			});
			
			//We add the new restriction values.
			$.each(newNodes, function(idx, element){
				var er = new ermRightRestriction();
				er.restrictionCdId = element.id;
				er.restrictionCdName = element.code;
				er.restrictionTypeName = element.restrictionTypeName;
				er.restrictionTypeId = element.restrictionTypeId;
				er.description = element.description;
				er.startDate = null;
				er.startDateCdId = null;
				er.startDateCdName = null;
				er.endDate = null;
				er.endDateCdId = null;
				er.endDateCdName = null;
				er.allowEndDateFlag = element.allowEndDateFlag;
				er.allowStartDateFlag = element.allowStartDateFlag;
				that.restrictionsToAdd.push(er);
			});
			
			//Now we will iterate through the restrictions array and remove the values
			//that are no longer part of the accumulator.
			var removedNodes = new Array();
			$.each(that.restrictionsToAdd, function(idx, elem){
				var shouldRetain = false;
				if (!nodes || nodes.length==0) {
					shouldRetain = false;
				} else {
					for(var r=0; r < nodes.length; r++){
						if(elem.restrictionCdId == nodes[r].id){
							shouldRetain = true;
							break;
						}
					}
				}
				if(!shouldRetain){
					removedNodes.push(elem);
				}				
			});
			
			//We now remove those values from the this.restrictionsToAdd array
			$.each(removedNodes, function(idx, elem){
				var index = -1;
				for(var r=0; r < that.restrictionsToAdd.length; r++){					
					if(that.restrictionsToAdd[r].restrictionCdId == elem.restrictionCdId){
						index = r;
						break;
					}					
				}
				if(index > -1){
					that.restrictionsToAdd.splice(index, 1);
				}
			});
			this.buildCustomInfoDisplay();
		}
		else {
			this.restrictionsToAdd = new Array();
		}
		
	};
	
	/**
	 * return an array of id's of the right strands being edited.
	 */
	this.getGridRightStrandIds = function(){
		var ids = new Array();
		$.each(this.crs_gridData, function(idx, element){
			if(ids.indexOf(element.rightStrandId) <= -1){
				ids.push(element.rightStrandId);
			}			
		});
		return ids;
	};
	
	this.processCopyStrand = function(bool){
		
		if(this.validate()){
			
			this.processCopyRightStrand(bool);
		}
	};
	
	/**
	 * 
	 */
	this.processCopyRightStrand = function(bool){
		this.crs_currentError = "";
		
		var rightStrand = new rightStrandElement();
		
		rightStrand.ids = this.getGridRightStrandIds();
		
		if($("#crs_mediaSelector").data("kendoHierarchySelector").getAccumulated() && $("#crs_mediaSelector").data("kendoHierarchySelector").getAccumulated().length > 0){
			rightStrand.mediaIds = $("#crs_mediaSelector").data("kendoHierarchySelector").getAccumulated();
		}
		else {
			rightStrand.mediaIds = null;
		}
		
		if($("#crs_territorySelector").data("kendoHierarchySelector").getAccumulated() && $("#crs_territorySelector").data("kendoHierarchySelector").getAccumulated().length > 0){
			rightStrand.territoryIds = $("#crs_territorySelector").data("kendoHierarchySelector").getAccumulated();
		}
		else {
			rightStrand.territoryIds = null;
		}
		
		if($("#crs_languageSelector").data("kendoHierarchySelector").getAccumulated() && $("#crs_languageSelector").data("kendoHierarchySelector").getAccumulated().length > 0){
			rightStrand.languageIds = $("#crs_languageSelector").data("kendoHierarchySelector").getAccumulated();
		}
		else {
			rightStrand.languageIds = null;
		}
		
		if($("#crs_strandSetControlCheckbox").is(':checked')){
			var st = new String($("#crs_strandSetComboBox").data("kendoComboBox").text());
			if(st){
				st = st.trim();
				if(st.length <= 0){
					rightStrand.strandSetName = null;
					rightStrand.strandSetId = -1;
				}
				else {
					rightStrand.strandSetName = $("#crs_strandSetComboBox").data("kendoComboBox").text();
					rightStrand.strandSetId = $("#crs_strandSetComboBox").data("kendoComboBox").value();
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
  		
  		
  		if(rightStrand.strandSetName == ""){
  			rightStrand.strandSetName = null;
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
  		rightStrand.deleteOverrideStartDate = false;
  		rightStrand.deleteOverrideEndDate = false;
  		
  		var inclusion = $("#crs_inclusion")[0].checked; 
  		var exclusion = $("#crs_exclusion")[0].checked;
  		var inclusionExclusion = $("#crs_both")[0].checked; 
  		
  		if(inclusion || inclusionExclusion){
  			if($("#crs_termControlCheckbox")[0].checked){
  				
  				if(this.crs_startDateChanged){
	  					rightStrand.changeStartDate = true;
  				}
  				
  				if(this.crs_endDateChanged){
  					rightStrand.changeEndDate = true;
  				}
  				
  				if(this.crs_overrideStartDateChanged){
  					rightStrand.changeOverrideStartDate = true;
  				}
  				
  				if(this.crs_overrideEndDateChanged){
  					rightStrand.changeOverrideEndDate = true;
  				}
  				
  				//override delete
  		  		//get the delete override start and end date
  		  		if ($("#crs_startOverrideDelete").prop('checked')) {
  		  			rightStrand.deleteOverrideStartDate = true;  			
  		  		}
  		  		
  		  		if ($("#crs_endOverrideDelete").prop('checked')) {
  		  			rightStrand.deleteOverrideEndDate = true;
  		  		}

  				
  				
  				rightStrand.startContractualDateString = getCorrectDateFromKendoDatePickerAsString("crs_startContractualDate");
  				/*if($("#crs_startContractualDate").data("kendoDatePicker").value()){
  	  	  			//rightStrand.startContractualDate = Date.parse($("#crs_startContractualDate").data("kendoDatePicker").value());
  	  	  			rightStrand.startContractualDate = getCorrectStrandDate(new Date(Date.parse($("#crs_startContractualDate").data("kendoDatePicker").value())));
  	  	  		}
  	  	  		*/ 	  		
  	  			if($("#crs_startDateCode").data("kendoDropDownList").value() > 0){
  	  				rightStrand.startDateCode = $("#crs_startDateCode").data("kendoDropDownList").value();
  	  			}
  	  			else {
  	  				rightStrand.startDateCode = null;
  	  			}
  	  			
  	  			if($("#crs_startDateStatus").data("kendoDropDownList").value() > 0){
  	  				rightStrand.startDateStatus = $("#crs_startDateStatus").data("kendoDropDownList").value();
  	  			}
  	  			else {
  	  				rightStrand.startDateStatus = null;
  	  			}
  	  			
  	  			rightStrand.startOverrideDateString = getCorrectDateFromKendoDatePickerAsString("crs_startOverrideDate");
  	  	  			
  	  			
  	  			rightStrand.endContractualDateString = getCorrectDateFromKendoDatePickerAsString("crs_endContractualDate");
  	  	  		
  	  	  		if($("#crs_endDateCode").data("kendoDropDownList").value() > 0){
  	  	  			rightStrand.endDateCode = $("#crs_endDateCode").data("kendoDropDownList").value();
  	  	  		}
  	  	  		else {
  	  	  			rightStrand.endDateCode = null;
  	  	  		}
  	  	  		
  	  	  		if($("#crs_endDateStatus").data("kendoDropDownList").value() > 0){
  	  	  			rightStrand.endDateStatus = $("#crs_endDateStatus").data("kendoDropDownList").value();
  	  	  		}
  	  	  		else {
  	  	  			rightStrand.endDateStatus = null;
  	  	  		}
  	  	  		
  	  	  		rightStrand.endOverrideDateString = getCorrectDateFromKendoDatePickerAsString("crs_endOverrideDate");
  			}
  			if (inclusion) {
  				rightStrand.inclusionExclusion = $("#crs_inclusion")[0].value;
  			}
  			if (inclusionExclusion) {
  				rightStrand.inclusionExclusion = $("#crs_both")[0].value;
  			}
  	  		
  		}else if (exclusion){
  			rightStrand.startContractualDate = null;
  			rightStrand.startDateCode = null;
  			rightStrand.startDateStatus = null;
  			rightStrand.startOverrideDate = null;
  			rightStrand.endContractualDate = null;
  			rightStrand.endDateCode = null;
  			rightStrand.endDateStatus = null;
  			rightStrand.endOverrideDate = null;
  			rightStrand.inclusionExclusion = $("#crs_exclusion")[0].value;
  			
  		} 
  		if($("#crs_infoCodeControlCheckbox")[0].checked){
			rightStrand.restrictionsToAdd = new Array();
			$.each(this.restrictionsToAdd, function(idx, elem){
  				rightStrand.restrictionsToAdd.push(elem.getRestrictionObjectForJSON());
  			});
  		}
  		
  		rightStrand.restrictionsToRemove = [];
  		if($("#crs_infoCodeSelector").data("kendoInfoCodeSelector") && $("#crs_infoCodeSelector").data("kendoInfoCodeSelector").getAccumulatedRemove){
  			var restrictionRemove = new restrictionObject(null);
  			infoCodeUtil.getRestrictionObject($("#crs_infoCodeSelector").data("kendoInfoCodeSelector").getDataItemsFromDS($("#crs_infoCodeSelector").data("kendoInfoCodeSelector").getAccumulatedRemove()), restrictionRemove);
	  		rightStrand.restrictionsToRemove = restrictionRemove.getShortRestrictionObjectForRightStrand();
  		}
  		
  		rightStrand.targetProductVersionIds = this.getSelectedProductVersionIds();
  		
  		rightStrand.fromProductVersionId = angular.element(document.getElementById("rightsController")).scope().foxVersionId;
  		
  		//TODO add comment id
  		var commentId = $("#crs_commentSection input[name='commentId']").val();
  		rightStrand.commentId = commentId;
  		
  		var ob = rightStrand.getCopyRightStrandObject();
  		if(bool){
  			ob.deleteOriginal = true;
  		}
  		console.log(" COPY RIGHT STRAND JSON OBJECT : %o", JSON.stringify(ob));
  		this.submitRightStrandToCopy(ob);  		
	};
	
	/**
	 * 
	 */
	this.close = function(){
		$("#crs_rightStrandCopyPopupWindow").data("kendoWindow").close();
		if($("#crs_copyRightStrandUnsuccessful").data("kendoWindow")){
			$("#crs_copyRightStrandUnsuccessful").data("kendoWindow").close();
			$("#crs_copyRightStrandUnsuccessful").data("kendoWindow").destroy();
		}
		this.closePartial();
	};
	
	this.closePartial = function(){
		var mainScope = angular.element(document.getElementById("mainController")).scope();
		mainScope.restoreSearch();
		setTimeout(function(){
			if(productsSearchPopUpWindow){
				//Unless this popup window is destroyed it keeps messing up the other windows
				//close function. We destroy it with a delay to allow time for the search pane
				//to be detach from this window and re-inserted into the index.html page.
				$("#productSearchController").data("kendoWindow").destroy();
				productsSearchPopUpWindow = null;
			}
		}, 1000);
					
		this.disableAllElements();
		this.resetCheckboxes();
		this.resetTargetListBox();
		this.crs_gridData = null;
		this.hideErrorPanel();
		this.resetButtons();		
	};
	
	this.resetButtons = function(){
		$("#crs_convertRightStrand").hide();
		$("#crs_copyRightStrand").show();
		$(".copyRightStrandPopupSearch").show();
	};
	
	/**
	 * (re-implementation)
	 * Function decide if the strands are both inclusion and exclusion
	 * if they are both the function returns true, otherwise it returns false
	 */
	this.areStrandBothInclusionAndExclusion = function(){
		 
		if(this.crs_gridData && this.crs_gridData.length > 0){
			var changed = true;
			var bool = this.crs_gridData[0].excludeFlag;
			for(var i = 0; i < this.crs_gridData.length; i++){
				if(bool != this.crs_gridData[i].excludeFlag){
					changed = false;
					break;
				}
			}
			if(!changed){
				return true;
			}
		}
		return false;
	};
	
	/**
	 * 
	 */
	this.selectedRadioButton = function(value){
		if(value == 0){
			$("#crs_inclusion")[0].checked = true;
			$("#crs_exclusion")[0].checked = false;
			$("#crs_both")[0].checked = false;
			
			$("#crs_inclusion").click();
		}
		
		else if(value == 1){
			$("#crs_inclusion")[0].checked = false;
			$("#crs_exclusion")[0].checked = true;
			$("#crs_both")[0].checked = false;
			
			
			$("#crs_exclusion").click();
		}
		else if(value == 2){
			$("#crs_inclusion")[0].checked = false;
			$("#crs_exclusion")[0].checked = false;
			$("#crs_both")[0].checked = true;
			
			$("#crs_both").click();
		}
		else {
			$("#crs_inclusion")[0].checked = false;
			$("#crs_exclusion")[0].checked = false;
			$("#crs_both")[0].checked = false;
			
		}
		
	};
	
	this.populateProductVersionInfo = function(){
		var ia = new Array();
		var angularScope = angular.element(document.getElementById("rightsController")).scope();
		var formatedReleaseDate = null;
		if(angularScope){
			 $("#crs_productTitlePopup").html(angularScope.currentProductArray.productTitle);
			   $("#crs_productCode").html(angularScope.currentProductArray.productCode);
			   $("#crs_productTypeCode").html(angularScope.currentProductArray.productTypeDesc);
			   formatedReleaseDate = erm.Dates.getFormatedReleaseDate(angularScope.currentProductArray.firstReleaseDate);
			   $("#crs_firstReleaseDate").html(formatedReleaseDate);
			   $("#crs_productionYear").html(angularScope.currentProductArray.productionYear);
			   $("#crs_currentFoxId").html(angularScope.currentProductArray.foxId);
			   $("#crs_currentFoxVersionId").html(angularScope.currentProductArray.foxVersionId);
			   $("#crs_currentFoxIdJDE").html(angularScope.currentProductArray.jdeId);
		}
		return ia;
	};
	
	/**
	 * 
	 */
	this.getSelectedProductVersionIds = function(){
		var ids = new Array();
		//TODO make an api to clear selected products
		var options = $("#crs_targetProductList option");
		if(options && options.length > 0){
			$.each(options, function(idx, elem){
				if(ids.indexOf(elem.value) <= -1){
					ids.push(elem.value);
				}
			});
		}
		else {
			var rightsScope = angular.element(document.getElementById("rightsController")).scope();
			ids.push(rightsScope.foxVersionId);
		}
		return ids;
	};
	
	/**
	 * 
	 */
	this.submitRightStrandToCopy = function(dataObject){
		var that = this;
		if(dataObject){
			
			var jsonObject = JSON.stringify(dataObject);
			var url = this.crs_paths.getCopyRightStrandRESTPath();
			this.showSubmitPopupWindow();
			$.post(url, {q:jsonObject}, function(data){
				crs_submitPopupWindow.close();
				//$("#crs_targetProductList").empty();
				$("#crs_targetProductListSuccess").empty();
				that.processSubmitRightStrandToCopyResult(data);
			}).fail(function(xhr,status,message){
				crs_submitPopupWindow.close();
				that.showErrorPanel(xhr.responseText);
			});
		}
	};
	
	/**
	 * 
	 */
	this.processSubmitRightStrandToCopyResult = function(data){
		var that = this;
		if(data && data.response){
			var type = data.type;
			if(type == rightStrandCopyResponseType.STRANDS_IDS){
				var rcscope = angular.element(document.getElementById("rightsController")).scope();
				var applyFilter = true;
				rcscope.viewStrandsGrid(rcscope.foxVersionId,data.response,undefined,applyFilter);
  				rcscope.setUpdatedStrands(eval(data.response.length));
  				rcscope.$apply();
				this.close();
			}
			else if(type == rightStrandCopyResponseType.MULTI_PRODUCT_RESPONSE){
				
				var success = data.response.success;
				var failures = data.response.failures;
				var failureId = new Array();
				var failureText = new Array();
				for(var x in failures){
					failureId.push(x);
					failureText.push(failures[x]);
				}
				
				var options = $("#crs_targetProductList option");
				
				var successOptions = new Array();
				
				if(success && success.length > 0){
					$.each(success, function(id, elem){
						for(var i = 0; i < options.length; i++){
							if(elem == options[i].value){
								successOptions.push(options[i]);
								break;
							}
						}
					});
				}
				
				var failureOptions = new Array();
				
				if(failureId && failureId.length > 0){
					$.each(failureId, function(id, elem){
						for(var i = 0; i < options.length; i++){
							if(elem == options[i].value){
								failureOptions.push(options[i]);
								break;
							}
						}
					});
				}
				
				var op = new Array();
				$.each(options, function(id, elem){
					op.push(elem);
				});
				
				$("#crs_targetProductListSuccess").empty();
				if(successOptions.length > 0){					
					$.each(successOptions, function(id, elem){
						$("#crs_targetProductListSuccess").append($("<option></option>").attr("value", elem.value).text(elem.text));
					});
					$("#crs_copyStrandSuccessText").html("Right strand copy successful for the product(s) below ");
					$("#crs_targetProductListSuccess").show();
				} else {
					$("#crs_copyStrandSuccessText").html('');					
				}
				
				
				$("#crs_targetProductList").empty();
				$("#crs_targetProductList option").remove();
				if(failureOptions.length > 0){					
					$.each(failureOptions, function(id,elem){
						$("#crs_targetProductList").append($("<option></option>").attr("value", elem.value).text(elem.text));
					});
				} 
				
				if(!failureOptions || failureOptions.length <= 0){
					this.changeButtonToCloseState();
					$("#crs_copyStrandFailureText").html('');					
				}
				else {
					if(failureText.length > 0){
						this.crs_currentError = "";
						$.each(failureText, function(id, elem){
							that.crs_currentError += elem+"<br><hr><br>";
						});
						$("#crs_copyStrandFailureText").html(" The copying process failed for the product(s) below  <a href='javascript:$.noop()' onClick='copyRightStrandObject.showCurrentError();'>Click here for more info</a>");
					}
				}
				
				$("#crs_copyStrandError").show();
				
			}
			
		}
	};
	
	
	
	this.changeButtonToCloseState = function(){
		$("#crs_copyRightStrand").hide();
		$("#crs_cancelCopyRightStrand").html("Close");
	};
	
	this.changeButtonToStartState = function(){
		$("#crs_copyRightStrand").show();
		$("#crs_cancelCopyRightStrand").html("Cancel");
		$("#crs_copyStrandError").hide();
	};
	/**
	 * 
	 */
	this.showErrorPanel = function(text){
		$("#crs_errorPanelInner").html(text);
		$("#crs_errorPanel").show();
		$("#crs_errorPanel").focus();
	};
	
	this.showCurrentError = function(){
		var txt = this.crs_currentError;
		errorPopup.showErrorPopupWindow(txt);
	};
	
	/**
	 * 
	 */
	this.hideErrorPanel = function(){
		$("#crs_errorPanelInner").html("");
		$("#crs_errorPanel").hide();
	};
	
	/**
	 * 
	 */
	this.showSubmitPopupWindow = function(){
		var d = $("#crs_submitPopupWindow").data("kendoWindow");
		d.setOptions({
			visible : true,
			modal : true
		});
		d.center();
		d.open();		
	};
	
	this.closeRightStrandReCopyPopup = function(){
		$("#crs_targetProductListError").empty();
		$("#crs_targetProductListSuccess").empty();
		$("#crs_copyRightStrandUnsuccessful").data("kendoWindow").close();
	};
	
	this.openRightStrandReCopyPopup = function(){
		$("#crs_copyRightStrandUnsuccessful").data("kendoWindow").setOptions({
			modal : true
		});
		$("#crs_copyRightStrandUnsuccessful").data("kendoWindow").center();
		$("#crs_copyRightStrandUnsuccessful").data("kendoWindow").open();
	};
	
	this.resetSearchBoxes = function(){
		$(".crossProductTargetsArea").empty();
		$("#crs_targetProductListSuccess").empty();
	};
	
	this.resetSearchArea = function(){
		$("#crs_targetProductListSuccess").empty();
		$("#crs_targetProductListSuccess").hide();
		this.changeButtonToStartState();
	};
	
	this.showPopulateActiveTerritoryButton = function(){
		var mappedSelectedStrands = gridStrandsConfigurator.getSelectedMap();
		var ts = allTerritorySame(mappedSelectedStrands);
		var active = allTerritoryActive(mappedSelectedStrands);
		if(((active & 2) == 0)  && ((active & 1) == 1) && ts){
			$("#crs_populateActiveTerritories").show();
		}
		else {
			$("#crs_populateActiveTerritories").hide();
		}
	};
	
	this.setupForInactiveTerritory = function(that){
		var data = that.crs_gridData;
				
		that.disableForInactiveTerritory();
		that.enableForInactiveTerritory();
		that.clearTargetProducts();

		if(data){
			var dataObject = data[0];
			var isBusiness = dataObject.legalInd ? false : dataObject.businessInd ? true : false;
			var url = that.crs_paths.getInactiveTerritoryRESTPath();
			url = url.replace(":territoryId", dataObject.territory.id);
			url = url.replace(":isBusiness", isBusiness);
			
			$.getJSON(url, function(data){
				if(data){
					$("#crs_territorySelector").data("kendoHierarchySelector").setSelected(data);
					setTimeout(function(){
						$("#crs_addTerritory").click();
					}, 500);
				}
			}).fail(function(xhr,status,message){
				that.showErrorPanel(xhr.responseText);
			});
		}	
	};
	
	/******************************************************************************************************
	 *                                                                                                    *
	 *                                END business logic section                                          *
	 *                                                                                                    *
	 ******************************************************************************************************/
	
	/*************************************************************************************
	 *                                                                                   *
	 *  Section to disable and enable individual elements as well as group of elements   *
	 *************************************************************************************/
	this.disableMedia = function(){
		$("#crs_mediaSelector").data("kendoHierarchySelector").clear();
		$("#crs_mediaSelector").attr("disabled", true);
		$("#crs_mediaSelected").attr("disabled", true);
		$("#crs_mediaText").addClass("disableTextClass");
		$("#crs_removeMedia").attr("disabled", true);
		$("#crs_removeMedia").addClass("disableTextClass");
		$("#crs_addMedia").attr("disabled", true);
		$("#crs_addMedia").addClass("disableTextClass");
		$("#crs_mediaTextSelected").addClass("disableTextClass");
	};
	
	this.enableMedia = function(){
		$("#crs_mediaSelector").attr("disabled", false);
		$("#crs_mediaSelected").attr("disabled", false);
		$("#crs_mediaText").removeClass("disableTextClass");
		$("#crs_removeMedia").attr('disabled', false);
		$("#crs_removeMedia").removeClass("disableTextClass");
		$("#crs_addMedia").attr('disabled', false);
		$("#crs_addMedia").removeClass("disableTextClass");
		$("#crs_mediaTextSelected").removeClass("disableTextClass");
	};
	
	this.disableTerritory = function(){
		$("#crs_territorySelector").data("kendoHierarchySelector").clear();
		$("#crs_territorySelector").attr("disabled", true);
		$("#crs_territorySelected").attr("disabled", true);
		$("#crs_territoryText").addClass("disableTextClass");
		$("#crs_removeTerritory").attr("disabled", true);
		$("#crs_removeTerritory").addClass("disableTextClass");
		$("#crs_addTerritory").attr("disabled", true);
		$("#crs_addTerritory").addClass("disableTextClass");
		$("#crs_territoryTextSelected").addClass("disableTextClass");
		
	};
	
	this.enableTerritory = function(){
		$("#crs_territorySelector").attr("disabled", false);
		$("#crs_territorySelected").attr("disabled", false);
		$("#crs_territoryText").removeClass("disableTextClass");
		$("#crs_removeTerritory").attr("disabled", false);
		$("#crs_removeTerritory").removeClass("disableTextClass");
		$("#crs_addTerritory").attr("disabled", false);
		$("#crs_addTerritory").removeClass("disableTextClass");
		$("#crs_territoryTextSelected").removeClass("disableTextClass");
	};
	
	this.disableLanguage = function(){
		$("#crs_languageSelector").data("kendoHierarchySelector").clear();
		$("#crs_languageSelector").attr("disabled", true);
		$("#crs_languageSelected").attr("disabled", true);
		$("#crs_languageText").addClass("disableTextClass");
		$("#crs_removelanguage").attr("disabled", true);
		$("#crs_removelanguage").addClass("disableTextClass");
		$("#crs_addlanguage").attr("disabled", true);
		$("#crs_addlanguage").addClass("disableTextClass");
		$("#crs_languageTextSelected").addClass("disableTextClass");
	};
	
	this.enableLanguage = function(){
		$("#crs_languageSelector").attr("disabled", false);
		$("#crs_languageSelected").attr("disabled", false);
		$("#crs_languageText").removeClass("disableTextClass");
		$("#crs_removelanguage").attr("disabled", false);
		$("#crs_removelanguage").removeClass("disableTextClass");
		$("#crs_addlanguage").attr("disabled", false);
		$("#crs_addlanguage").removeClass("disableTextClass");
		$("#crs_languageTextSelected").removeClass("disableTextClass");
	};
	
	this.disableTerms = function(){
		$("#crs_startContractualDate").data("kendoDatePicker").value("");
		$("#crs_startContractualDate").data("kendoDatePicker").enable(false);
		$("#crs_startOverrideDate").data("kendoDatePicker").value("");
		$("#crs_startOverrideDate").data("kendoDatePicker").enable(false);
		$("#crs_endContractualDate").data("kendoDatePicker").value("");
		$("#crs_endContractualDate").data("kendoDatePicker").enable(false);
		$("#crs_endOverrideDate").data("kendoDatePicker").value("");
		$("#crs_endOverrideDate").data("kendoDatePicker").enable(false);
		$("#crs_startDateCode").data("kendoDropDownList").value("-1");
		$("#crs_startDateCode").data("kendoDropDownList").enable(false);
		$("#crs_startDateStatus").data("kendoDropDownList").value("-1");
		$("#crs_startDateStatus").data("kendoDropDownList").enable(false);
		$("#crs_endDateCode").data("kendoDropDownList").value("-1");
		$("#crs_endDateCode").data("kendoDropDownList").enable(false);
		$("#crs_endDateStatus").data("kendoDropDownList").value("-1");
		$("#crs_endDateStatus").data("kendoDropDownList").enable(false);
		
		$("#crs_startContractualDateText").addClass("disableTextClass");
		$("#crs_startOverrideDateText").addClass("disableTextClass");
		$("#crs_endContractualDateText").addClass("disableTextClass");
		$("#crs_endOverrideDateText").addClass("disableTextClass");
		$("#crs_startDateCodeText").addClass("disableTextClass");
		$("#crs_startDateStatusText").addClass("disableTextClass");
		$("#crs_endDateCodeText").addClass("disableTextClass");
		$("#crs_endDateStatusText").addClass("disableTextClass");
		$("#crs_terms").addClass("disableTextClass");
		
		this.disableDeleteOverride();
	};
	
	this.enableTerms = function(){
		$("#crs_startContractualDate").data("kendoDatePicker").value("");
		$("#crs_startContractualDate").data("kendoDatePicker").enable(true);
		$("#crs_startOverrideDate").data("kendoDatePicker").value("");
		$("#crs_startOverrideDate").data("kendoDatePicker").enable(true);
		$("#crs_endContractualDate").data("kendoDatePicker").value("");
		$("#crs_endContractualDate").data("kendoDatePicker").enable(true);
		$("#crs_endOverrideDate").data("kendoDatePicker").value("");
		$("#crs_endOverrideDate").data("kendoDatePicker").enable(true);
		$("#crs_startDateCode").data("kendoDropDownList").value("-1");
		$("#crs_startDateCode").data("kendoDropDownList").enable(true);
		$("#crs_startDateStatus").data("kendoDropDownList").value("-1");
		$("#crs_startDateStatus").data("kendoDropDownList").enable(true);
		$("#crs_endDateCode").data("kendoDropDownList").value("-1");
		$("#crs_endDateCode").data("kendoDropDownList").enable(true);
		$("#crs_endDateStatus").data("kendoDropDownList").value("-1");
		$("#crs_endDateStatus").data("kendoDropDownList").enable(true);
		
		$("#crs_startContractualDateText").removeClass("disableTextClass");
		$("#crs_startOverrideDateText").removeClass("disableTextClass");
		$("#crs_endContractualDateText").removeClass("disableTextClass");
		$("#crs_endOverrideDateText").removeClass("disableTextClass");
		$("#crs_startDateCodeText").removeClass("disableTextClass");
		$("#crs_startDateStatusText").removeClass("disableTextClass");
		$("#crs_endDateCodeText").removeClass("disableTextClass");
		$("#crs_endDateStatusText").removeClass("disableTextClass");
		$("#crs_terms").removeClass("disableTextClass");
		
		this.enableDeleteOverride();
	};
	
	this.disableInfoCodes = function(){
		$("#crs_infoCodeSelector").data("kendoInfoCodeSelector").clear();
		$("#crs_infoCodeSelector").attr('disabled', true);
		$("#crs_restrictionAddSelected").attr('disabled', true);
		$("#crs_restrictionRemoveSelected").attr('disabled', true);
		$("#crs_infoCodeTreeViewMultiText").addClass("disableTextClass");
		$("#crs_infoCodeCustomDateDisplay").html('');
		$("#crs_infoCodeCustomDateDisplay").attr('disabled', true);
		$("#crs_infoCodeTerms").addClass('disableTextClass');
		$("#crs_addEditButton").attr("disabled", true);
		
		$("#crs_removeInfoCodesAdd").attr("disabled", true);
		$("#crs_removeInfoCodesAdd").addClass("disableTextClass");
		$("#crs_addInfoCodesAdd").attr("disabled", true);
		$("#crs_addInfoCodesAdd").addClass("disableTextClass");
		$("#crs_restrictionAddSelectedText").addClass("disableTextClass");
		
		$("#crs_removeInfoCodesRemove").attr("disabled", true);
		$("#crs_removeInfoCodesRemove").addClass("disableTextClass");
		$("#crs_addInfoCodesRemove").attr("disabled", true);
		$("#crs_addInfoCodesRemove").addClass("disableTextClass");
		$("#crs_restrictionRemoveSelectedText").addClass("disableTextClass");
	};
	
	this.enableInfoCodes = function(){
		$("#crs_infoCodeSelector").data("kendoInfoCodeSelector").clear();
		$("#crs_infoCodeSelector").attr('disabled', false);
		$("#crs_restrictionAddSelected").attr('disabled', false);
		$("#crs_restrictionRemoveSelected").attr('disabled', false);
		$("#crs_infoCodeTreeViewMultiText").removeClass("disableTextClass");
		$("#crs_infoCodeCustomDateDisplay").html('');
		$("#crs_infoCodeCustomDateDisplay").attr('disabled', false);
		$("#crs_infoCodeTerms").removeClass('disableTextClass');
		
		$("#crs_removeInfoCodesAdd").attr("disabled", false);
		$("#crs_removeInfoCodesAdd").removeClass("disableTextClass");
		$("#crs_addInfoCodesAdd").attr("disabled", false);
		$("#crs_addInfoCodesAdd").removeClass("disableTextClass");
		$("#crs_restrictionAddSelectedText").removeClass("disableTextClass");
		
		$("#crs_removeInfoCodesRemove").attr("disabled", false);
		$("#crs_removeInfoCodesRemove").removeClass("disableTextClass");
		$("#crs_addInfoCodesRemove").attr("disabled", false);
		$("#crs_addInfoCodesRemove").removeClass("disableTextClass");
		$("#crs_addEditButton").attr("disabled", false);
		$("#crs_restrictionRemoveSelectedText").removeClass("disableTextClass");
	};
	
	this.disableStrandSet = function(){
		$("#crs_strandSetComboBox").data("kendoComboBox").value("");
		$("#crs_strandSetComboBox").data("kendoComboBox").text("");
		$("#crs_strandSetComboBox").data("kendoComboBox").enable(false);
		$("#crs_strandSetText").addClass("disableTextClass");
	};
	
	this.enableStrandSet = function(){
		$("#crs_strandSetComboBox").data("kendoComboBox").value("");
		$("#crs_strandSetComboBox").data("kendoComboBox").text("");
		$("#crs_strandSetComboBox").data("kendoComboBox").enable(true);
		$("#crs_strandSetText").removeClass("disableTextClass");
	};
	
	this.disableAllElements = function(){
		this.disableMedia();
		this.disableTerritory();
		this.disableLanguage();
		this.disableTerms();
		this.disableInfoCodes();
		this.disableStrandSet();
		this.disableDeleteOverride();
	};
	
	this.disableWhenExclusionChecked = function(){
		$("#crs_termControlCheckbox")[0].checked = false;
		$("#crs_termControlCheckbox").attr("disabled", true);
		$("#crs_infoCodeControlCheckbox")[0].checked = false;
		$("#crs_infoCodeControlCheckbox").attr("disabled", true);
		this.disableInfoCodes();
		this.disableTerms();
		this.disableMedia();
		this.disableTerritory();
		this.disableLanguage();
		this.disableDeleteOverride();
	};
	
	this.enableWhenExclusionChecked = function(){
		this.resetCheckboxes();
		$("#crs_strandSetControlCheckbox").attr('disabled',false);
		$("#crs_mediaControlCheckbox").attr('disabled',false);
		$("#crs_territoryControlCheckbox").attr('disabled',false);
		$("#crs_languageControlCheckbox").attr('disabled',false);
	};
	
	
	this.enableWhenInclusionChecked = function(){
		this.enableCheckboxes();
	};
	
	this.disableWhenInclusionChecked = function(){
		this.disableMedia();
		this.disableTerritory();
		this.disableLanguage();
		this.disableTerms();
		this.disableInfoCodes();
		this.disableStrandSet();
		this.disableDeleteOverride();
	};
	
	this.disableCommentBox = function(){
	};
	
	this.enableCommentBox = function(){	    
	};
	
	this.resetCheckboxes = function(){
		$("#crs_strandSetControlCheckbox")[0].checked = false;
		$("#crs_mediaControlCheckbox")[0].checked = false;
		$("#crs_territoryControlCheckbox")[0].checked = false;
		$("#crs_languageControlCheckbox")[0].checked = false;
		$("#crs_termControlCheckbox")[0].checked = false;
		$("#crs_infoCodeControlCheckbox")[0].checked = false;
	};
	
	this.disableCheckboxesMTLTI = function disableCheckboxesMTLTI(options) {
		this.resetCheckboxes();
		options = options||{};
		if (options.disableStandSet) {
			$("#crs_strandSetControlCheckbox").attr('disabled',true);
		}
		if (options.disableMedia) {
			$("#crs_mediaControlCheckbox").attr('disabled',true);
		}
		if (options.disableTerritory) {
			$("#crs_territoryControlCheckbox").attr('disabled',true);
		}
		if (options.disableLanguage) {
			$("#crs_languageControlCheckbox").attr('disabled',true);
		}
		if (options.disableTerm) {
			$("#crs_termControlCheckbox").attr('disabled',true);
		}
		if (options.disableInfoCodes) {
			$("#crs_infoCodeControlCheckbox").attr('disabled',true);
		}
	};
	
	this.disableCheckboxes = function(){
		var options = {
				disableStandSet:true,
				disableMedia:true,
				disableTerritory:true,
				disableLanguage:true,
				disableTerm:true,
				disableInfoCodes:true				
		};
		this.disableCheckboxesMTLTI(options);
//		this.resetCheckboxes();
//		$("#crs_strandSetControlCheckbox").attr('disabled',true);
//		$("#crs_mediaControlCheckbox").attr('disabled',true);
//		$("#crs_territoryControlCheckbox").attr('disabled',true);
//		$("#crs_languageControlCheckbox").attr('disabled',true);
//		$("#crs_termControlCheckbox").attr('disabled',true);
//		$("#crs_infoCodeControlCheckbox").attr('disabled',true);
	};
	
	this.enableCheckboxes = function(){
		this.resetCheckboxes();
		$("#crs_strandSetControlCheckbox").attr('disabled',false);
		$("#crs_mediaControlCheckbox").attr('disabled',false);
		$("#crs_territoryControlCheckbox").attr('disabled',false);
		$("#crs_languageControlCheckbox").attr('disabled',false);
		$("#crs_termControlCheckbox").attr('disabled',false);
		$("#crs_infoCodeControlCheckbox").attr('disabled',false);
	};
	
	this.resetRadioButtons = function(){
		$("#crs_inclusion")[0].checked = false;
		$("#crs_exclusion")[0].checked = false;
		$("#crs_both")[0].checked = false;
	};
	
	this.resetTargetListBox = function(){
		$(".crossProductTargetsArea").empty();
	};
	
	this.disableAndEmptyCopyDestination = function disableAndEmptyCopyDestination() {
		$(".copyRightStrandPopupSearch").hide();		
	};
	
	this.disableForInactiveTerritory = function(){
		this.disableMedia();
		this.disableLanguage();
		//bug 29061 enable term
		//do not disable term
		//this.disableTerms();
		this.disableInfoCodes();
		var disableOptions = {
				disableStandSet:true,
				disableMedia:true,
				disableTerritory:true,
				disableLanguage:true,
				disableTerm:false,
				disableInfoCodes:true				
		};
		this.disableCheckboxesMTLTI(disableOptions);
		this.disableStrandSet();
		$("#crs_convertRightStrand").show();
		$("#crs_copyRightStrand").hide();
		this.disableAndEmptyCopyDestination();
	};
	
	this.enableForInactiveTerritory = function(){
		$("#crs_territoryControlCheckbox").attr('disabled', false);
		$("#crs_territoryControlCheckbox").click();	
		$("#crs_strandSetControlCheckbox").attr('disabled',false);
		
	};
	
	/*****************************************************************************************
	 *                                                                                       *
	 *  End section to disable and enable individual elements as well as group of elements   *
	 *****************************************************************************************/
	
	/*************************************************************************************
	 *                                                                                   *
	 *                           Start validation section                                *
	 *                                                                                   *
	 *************************************************************************************/
	
	this.validateMedia = function(){
		var sel = $("#crs_mediaSelector").data("kendoHierarchySelector");
		if($("#crs_mediaControlCheckbox")[0].checked && sel.getAccumulated() <= 0){
			errorPopup.showErrorPopupWindow("Since the media checkbox is checked you must make a media selection, or uncheck the media checkbox...");
			return false;
		}
		return true;
	};
	
	this.validateTerritory = function(){
		var sel = $("#crs_territorySelector").data("kendoHierarchySelector");
		if($("#crs_territoryControlCheckbox")[0].checked && sel.getAccumulated() <= 0){
			errorPopup.showErrorPopupWindow("Since the territory checkbox is checked you must make a territory selection, or uncheck the territory checkbox...");
			return false;
		} 
		return true;
	};
	
	this.validateLanguage = function(){
		var sel = $("#crs_languageSelector").data("kendoHierarchySelector");
		if($("#crs_languageControlCheckbox")[0].checked && sel.getAccumulated() <= 0){
			errorPopup.showErrorPopupWindow("Since the language checkbox is checked you must make a language selection, or uncheck the language checkbox...");
			return false;
		} 
		return true;
	};
	
	/**
	 * 
	 */
	this.validateTerm = function(){
		if($("#crs_termControlCheckbox")[0].checked){
			
			var startDateValue = getCorrectDateFromKendoDatePicker("crs_startContractualDate"); //$("#crs_startContractualDate").data("kendoDatePicker").value();
			var endDateValue = getCorrectDateFromKendoDatePicker("crs_endContractualDate"); //$("#crs_endContractualDate").data("kendoDatePicker").value();
			var startDateCodeValue = $("#crs_startDateCode").data("kendoDropDownList").value();
			var endDateCodeValue = $("#crs_endDateCode").data("kendoDropDownList").value();
			var startOverrideDateValue = getCorrectDateFromKendoDatePicker("crs_startOverrideDate"); //$("#crs_startOverrideDate").data("kendoDatePicker").value();
			var endOverrideDateValue = getCorrectDateFromKendoDatePicker("crs_endOverrideDate"); //$("#crs_endOverrideDate").data("kendoDatePicker").value();
			
			if(!startDateValue && !startDateCodeValue && (startDateCodeValue <= 0) && !startOverrideDateValue){
				errorPopup.showErrorPopupWindow(START_DATE_ERROR); //"You must select either a term start date, or a start date code, or an override start date, or uncheck the term checkbox...");
				return false;
			}
			
			if(!endDateValue && !endDateCodeValue && (endDateCodeValue <= 0) && !endOverrideDateValue){
				errorPopup.showErrorPopupWindow(END_DATE_ERROR); //"You must select either a contractual end date, or a end date code, or an override end date, or uncheck the term checkbox...");
				return false;
			}
			
			var sd = this.getStartDateForValidation();
			var ed = this.getEndDateForValidation();
			if(sd && ed){
				if(ed <= sd){
					errorPopup.showErrorPopupWindow(END_DATE_BEFORE_START_DATE_ERROR); //"The end date cannot be before the start date...");
					return false;
				}
			}
		}		
		return true;
	};
	
	this.getStartDateForValidation = function(){
		if($("#crs_startOverrideDate").data("kendoDatePicker").value()){
			return Date.parse($("#crs_startOverrideDate").data("kendoDatePicker").value());
		}
		if($("#crs_startContractualDate").data("kendoDatePicker").value()){
			return Date.parse($("#crs_startContractualDate").data("kendoDatePicker").value());
		}
		return null;
	};
	
	this.getEndDateForValidation = function(){
		if($("#crs_endOverrideDate").data("kendoDatePicker").value()){
			return Date.parse($("#crs_endOverrideDate").data("kendoDatePicker").value());
		}
		if($("#crs_endContractualDate").data("kendoDatePicker").value()){
			return Date.parse($("#crs_endContractualDate").data("kendoDatePicker").value());
		}
		return null;
	};
	
	this.validateInfoCodes = function(){
		if($("#crs_infoCodeControlCheckbox")[0].checked){
			var sel = $("#crs_infoCodeSelector").data("kendoInfoCodeSelector");
			if(sel.getAccumulatedAdd().length <= 0 && sel.getAccumulatedRemove().length <= 0){
				errorPopup.showErrorPopupWindow("Since the Info Codes checkbox is checked, you must make an info code selection, or uncheck the 'Info Codes' checkbox...");
				return false;
			}
		}
		return true;
	};
	
	/**
	 * Main validation method.
	 */
	this.validate = function(){
		
		if(!this.validateMedia()){
			return false;
		}
		if(!this.validateTerritory()){
			return false;
		}
		if(!this.validateLanguage()){
			return false;
		}
		if(!this.validateTerm()){
			return false;
		}
		if(!this.validateInfoCodes()){
			return false;
		}
		return true;
	};
	
	/*************************************************************************************
	 *                                                                                   *
	 *                           End validation section                                  *
	 *                                                                                   *
	 *************************************************************************************/
}

var copyRightStrandObject = new copyRightStrand();
var crs_rightStrandCopyWindow = null;
var crs_infoCodePopup = null;
var crs_submitPopupWindow = null;
