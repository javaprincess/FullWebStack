function ReportManagement(){
	
	this.rep_path = paths();
	this.showSearchQueryParameters = true;
	this.rep_territoryGroupsTracker = null;
	this.rep_languageGroupsTracker = null;
	this.rep_infoCodeGroupsTracker = null;
	this.rep_rightsGroupSource = new Array();
	this.rep_recentReportQueries = new Array();
	this.rep_savingReportSuccessText = " Query successfully saved ";
	this.rep_runningReportSuccessText = " Query successfully processed ";
	this.rep_updatingReportSuccessText = " Query successfully updated ";
	this.rep_userName = erm.security.user.userId;
	
	this.reports = {
			1 : "Rights As Entered Report",
			5 : "Avails Report",
			6 : "Product Inquiry Report"
	};
	
	this.reportIndexes = {
			RIGHTS_AS_ENTERED_REPORT : 1,
			AVAILS_REPORT : 5,
			PRODUCT_INQUIRY_REPORT : 6
	};
	
	this.reportName = {
			1 : "RER",
			5 : "DRR",
			6 : "PIR"
	};
	
	this.reportSource = ["Avails Report", "Rights As Entered Report", "Product Inquiry Report"];
	this.savedQuerySearchResult = null;
	this.rep_redirectUrlWindow = null;
	this.rep_redirectUrlDocument = null;
	this.processFlagArray = {
		SAVE : "SAVE",
		UPDATE : "UPDATE",
		RUN : "RUN"
	};
	
	this.rtfArray = [{"id":1, "text":"Excel"}, {"id":2, "text":"Pdf"}, {"id":3, "text":"Preview"}];
	this.processFlag = this.processFlagArray.SAVE;
	this.saveQueryViewModel = kendo.observable({
		queryName : "",
		personalTag : "",
		commentForQueryToBeSaved : "",
		publicPrivateStatus : ""				
	});
	
	this.queryViewModel = new kendo.data.ObservableObject({
		userFullName : "",
		reportName : "",
		queryId : "",
		reportCreateDate : "",
		timePeriod : "W",
		infoCodeRadio : "1",
		reportTypeValue : 1,
		reportQueryName : "",
		reportFormat : "1",
		openMotValue : "",
		closeMotValue : "",
		fromIncludeTBA : false,
		toIncludeTBA : false,
		reportTypeFormat : 1,
		reportId : "",
		rightsCheckType : "LEGAL"
	});
	
	this.querySourcesObject = new kendo.data.ObservableObject({
		querySourceId : null,
		querySources : [
		                {name : "", value : ""},
		                {name : "Rights As Entered Report", value : "1"},
		                {name : "DRC Product Detail Report", value : "5"},
		                {name : "Product Inquiry Report", value : "6"}
		                ]
	});

	
	
	this.disabledForMOTFlag = false; //Use to check if we already disabled the elements for MOT, in which case we do not run the disable code again
	this.worldwideTerritoryId = null;
	this.allMediaId = null;
	this.allLanguageId = null;
	this.successfullSubmitObject = null;
	this.maximumParameterStringSize = 3500;
	this.querySuffixName = 'Report Query Management';
	this.infoCodeSourceForDRC = null;
	this.infoCodeSource = null;
	this.displayWindowWith = "95.5%";
	this.dateOptionDataArray = [{id:-1, text:""}, {id:1, text:"Term"}, {id:2, text:"Start Date"}, {id:3, text:"End Date"}];
	this.dateOptionDataArrayWithInfoCode = [{id:-1, text:""}, {id:1, text:"Term"}, {id:2, text:"Start Date"}, {id:3, text:"End Date"}, {id:4, text:"Info Code Start Date"}, {id:5, text:"Info Code End Date"}];
	this.productTypeName = "Product Type";
	this.productTypeNameInternational = "International Product Type";
	/**************************************************************************************************
	 *                                                                                                *
	 * Initialization section : This section of code is responsible for initializing all the elements *
	 *                                                                                                *
	 **************************************************************************************************/
	this.initializeElements = function(){
		
		this.rep_initializeMTL();		
		this.initializeInfoCodes();
		this.initGroupBoxes();
		this.initializeProductTypes();
		this.initializeDatePicker();
		this.initializeButtons();
		this.initializeHeaders();
		this.initializeSearchResultGrid();
		
		this.initializeRightsGroupGrid();
		
		this.initializeQuerySearchDropDown();
		
		this.initReportCreateWindow();	
		
		this.initSaveQueryWindow();
		this.initSearchQueryWindow();
		this.initializeSubmitWindow();
		
		this.initializeSearchSavedQueriesWindow();
		this.initializeRightsInquiryElements();
		this.initializeCheckboxes();
		
		kendo.bind($("#rep_saveQueryForm"), this.saveQueryViewModel);
		kendo.bind($("#rep_rightManagementPopup"), this.queryViewModel);
		kendo.bind($("#rep_searchQuerySource"), this.querySourcesObject);
	};
	
	/**
	 * Initializes the report management popup window. 
	 */
	this.initReportCreateWindow = function (){
		var that = this;
		console.log(" INITIALIZING REPORT QUERY MANAGEMENT POPUP WINDOW ");
		if (!$("#rep_reportQueryManagementPopupWindow").data("kendoWindow")) {
			$("#rep_reportQueryManagementPopupWindow").kendoWindow({
                width: this.displayWindowWith,
                minWidth : this.displayWindowWith,
                minHeight : "800px",
                title: "Report Query Management",
                actions: [
                    "Maximize",
                    "Close"
                ],
                visible : false,
                close : function(){
                	that.closeSearchProductPopup();
                	that.resetSaveQueryWindow();
                	that.resetReportManagementFields();
                	
                }
            });
        }
		rep_reportQueryManagementPopupWindow = $("#rep_reportQueryManagementPopupWindow").data("kendoWindow");
	};
	
	/**
	 * Initializes the save query window popup
	 */
	this.initSaveQueryWindow = function(){
		var that = this;
		
		if (!$("#rep_saveReportPopupWindow").data("kendoWindow")) {
			$("#rep_saveReportPopupWindow").kendoWindow({
                width: "525px;",
                height : "380px",
                minWidth : "525px;",
                minHeight : "380px",
                title: "Save Query",
                actions: [
                    "Close"
                ],
                visible : false,
                close : function(){
                	that.resetSaveQueryWindow();
                }
            });
        }
	};
	
	/**
	 * Initializes the search saved query popup window
	 */
	this.initSearchQueryWindow = function(){
		var that = this;
		
		if (!$("#rep_searchReportPopupWindow").data("kendoWindow")) {
			$("#rep_searchReportPopupWindow").kendoWindow({
                width: "800px;",
                height : "550px",
                minWidth : "800px;",
                minHeight : "550px",
                title: "Search Saved Query",
                actions: [
                    "Maximize",
                    "Close"                    
                ],
                visible : false,
                close : function(){
                	that.resetSearchSavedQueryParam();
                },
                resize : function(){
                	$("#rep_searchQueryResultGrid").data("kendoGrid").refresh();
                }
            });
        }
	};
	
	/**
	 * handle event generated by the product grid checkboxes
	 */
	var searchProductCheckboxEvent = function(that){
		var grid = $("#rep_searchProductResultGrid").data('kendoGrid');
		var checked = $(that).is(":checked");
		var st = $(that).attr('id');
		var mark = "rep_checkbox_";
		var id = st.substring(st.indexOf(mark)+mark.length);
		var items = $("#rep_searchProductResultGrid").data("kendoGrid").dataSource.data();
		for (var i = 0; i < items.length; i++) {
			var item = items[i];			
			if(item.foxVersionId == id){
				item.rep_checkboxValue = checked;
				var rows = grid.tbody.find("tr");
				$.each(rows, function(id, elem){
					var idString = $(elem).find("td:first input").attr("id");
					if(idString == st){
						if(checked){
							$(elem).addClass("k-state-selected");
						}
						else {
							$(elem).removeClass("k-state-selected");
						}
					}
				});
			}				
		}
		
		if(!checked) {
			$("#rep_selectAllSearchProductResults").attr('checked', false);
		}
	};
	
	/**
	 * Handles the 'Select All' checkbox from the product grid
	 */
	var searchProductAllbound = function(e, that){
		var $cb = $(that);
		var checked = $cb.is(':checked');
		var grid = $("#rep_searchProductResultGrid").data('kendoGrid');		
		//This code update the underlying data in the dataSource. In particular
		//it updates the checkboxValue field.		
		var items = $("#rep_searchProductResultGrid").data("kendoGrid").dataSource.data();
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			item.rep_checkboxValue = checked;			
		}
		
		if(checked){
			grid.table.find("tr").addClass("k-state-selected");
		}
		else {
			grid.table.find("tr").removeClass("k-state-selected");
		}
		
		var checkboxes = $(".check_search_product_row");
		if(checkboxes){
			$.each(checkboxes, function(id, elem){
				elem.checked = checked;
			});
		}
		
		//If checkbox is unchecked them clear all rows
		//Removes all selection from the grid.
		if (!checked)
		{
			$("#rep_searchProductResultGrid").data("kendoGrid").clearSelection();
		}
	};
	
	/**
	 * Initializes the product grid. The product grid is populated from the search product popup window
	 */
	this.initializeSearchResultGrid = function(){		
		
		$("#rep_searchProductResultGrid").kendoGrid({
			sortable: true,
			autoBind: false,
			columns: [ 
                      { field: "rep_checkboxValue", title: "<label><input type='checkbox' id='rep_selectAllSearchProductResults'   class='selectAllSearchProductResultsClass'></label>", template : "<input type='checkbox' id='rep_checkbox_#: data.foxVersionId#' #: data.rep_checkboxValue ? checked='checked' : '' #  class=\"check_search_product_row\">", width : "5%", sortable : false, filterable : false},
                      { field: "rep_rights", title: "Rights", template : "# if(data.rep_rights == null){#&nbsp; #}else {#<img title='#=data.rep_rightsTitle #' src='img/#=data.rep_rights #'> #}#", width : "5%"},
                      { field: "rep_title", title: "Title", width : "25%"},
                       //TMA BUG: 46849
                      //{ field: "rep_wprId", title: "FIN PROD ID", width : "10%"},
                      { field: "rep_wprId", title: "Financial Title ID (WPR ID)", width : "10%"},
                      { field: "rep_type", title: "Type", width : "10%"},
                      { field: "rep_productionYear", title: "Production Year", width : "15%"},
                      { field: "rep_productionCompany", title: "Production Company", width : "20%"},
                      { field: "rep_firstReleaseDate", title: "US Release Date", width : "15%"}//, format:"{0:MM/dd/yyyy}"}
                  ],
			dataSource : [],
			selectable : "multiple",
			scrollable : true			
        });
		
		
		$("#rep_selectAllSearchProductResults").click(function (e) {		
			searchProductAllbound(e, this);
		});
		
				
	};
	
	/**
	 * Handle events from the search saved query checkboxes
	 */
	this.searchSavedQueryCheckboxEvent = function(that, id){
		try {
			var grid = $("#rep_searchQueryResultGrid").data('kendoGrid');
			var checked = $(that).is(":checked");
			var st = $(that).attr('id');
			var items = $("#rep_searchQueryResultGrid").data("kendoGrid").dataSource.data();
			for (var i = 0; i < items.length; i++) {
				var item = items[i];			
				if(item.rep_queryId == id){
					item.rep_queryCheckboxValue = checked;
					var rows = grid.tbody.find("tr");
					$.each(rows, function(id, elem){
						var idString = $(elem).find("td:first input").attr("id");
						if(idString == st){
							if(checked){
								$(elem).addClass("k-state-selected");
							}
							else {
								$(elem).removeClass("k-state-selected");
							}
						}
					});
				}				
			}
			
			if(!checked) {
				$("#rep_selectAllSearchQueryResults").attr('checked', false);
			}
		}
		catch(e){
			console.log(" ERROR  : %o", e);
		}
		
	};
	
	/**
	 * Handles the 'Select All' checkbox from the search saved query grid
	 */
	var searchSavedQueryAllBound = function(e, that){
		var $cb = $(that);
		var checked = $cb.is(':checked');
		var grid = $("#rep_searchQueryResultGrid").data('kendoGrid');
		
		grid.table.find("tr").find("td:first input").attr("checked", checked);
		
		var items = $("#rep_searchQueryResultGrid").data("kendoGrid").dataSource.data();
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			item.rep_queryCheckboxValue = checked;
		}
		
		if(checked){
			grid.table.find("tr").addClass("k-state-selected");
		}
		else {
			grid.table.find("tr").removeClass("k-state-selected");
		}
		
		if (!checked)
		{
			$("#rep_searchQueryResultGrid").data("kendoGrid").clearSelection();
		}
	};
	
	/**
	 * Initialize the search saved query grid in the 'Search Saved Query' popup window
	 */
	this.initializeSearchQueryResultGrid = function(dataSource, queryName, publicPrivate, reportSource, createdBySource){
		console.log(" INITIALIZE SEARCH QUERY RESULT CALLED...");
		$("#rep_searchQueryResultGrid").kendoGrid({
			sortable: true,
			filterable : {
				extra : false,
				operators : {
					string: {
						startswith: "Starts With",
						eq: "Is equal to",
						neq: "Is not equal to",
						contains: "Contains"
					}
				}
			},
			pageable : {
				pageSize : 50
			},
			columns: [ 
                      { 
                    	  field: "rep_queryCheckboxValue", 
                    	  title: "<label><input type='checkbox' id='rep_selectAllSearchQueryResults'></label>", 
                    	  template : "# if(rep_reportManagementObject.checkUserName(data.rep_queryCreatedBy)){#<input type='checkbox' id='rep_queryResultCheckbox_#: data.rep_queryId#' #: data.rep_queryCheckboxValue ? checked='checked' : '' #  class=\"check_search_query_row\" onClick='rep_reportManagementObject.searchSavedQueryCheckboxEvent(this, #=data.rep_queryId #)'>#}else{ #&nbsp;#}#", 
                    	  width : "5%", 
                    	  sortable : false, 
                    	  filterable : false
                      },
                      { 
                    	  field: "rep_queryName", title: "Name", 
                    	  width : "20%", template: '<a href="javascript:$.noop()" onclick="rep_reportManagementObject.populateQueryFromSearchSavedQueries(#=data.rep_sourceReportId#, #=data.rep_queryId#, \'#=data.rep_queryCreatedBy#\')">#: data.rep_queryName#</a>',
                    	  filterable : {
                    		  ui : queryNameFilter
                    	  }
                      },
                      { 
                    	  field: "rep_queryComment", 
                    	  title: "Comment", width : "25%",
                    	  filterable : false,
                    	  template : "#= truncateStringSize(data.rep_queryComment, 75) #"
                      },
                      { 
                    	  field: "rep_queryPublic", 
                    	  title: "Type", width : "10%",
                    	  filterable : {
                    		  ui: pp
                    	  }
            		  },
                      { 
            			  field: "rep_querySource", 
            			  title: "Source", width : "20%",
                    	  filterable : {
                    		  ui: reportSources
                    	  }
    				  },
                      { 
    					  field: "rep_queryCreatedBy", 
    					  title: "Created By", width : "15%",
                    	  filterable : {
                    		  ui: createdBySources
                    	  }
					  }                     
                  ],
			dataSource : {
				data : dataSource			
			},
			selectable : false,
			scrollable : true
			
        });
		
		$("#rep_selectAllSearchQueryResults").click(function(e){
			searchSavedQueryAllBound(e, this);			
		});
		
		function queryNameFilter(element){
			element.kendoAutoComplete({
				dataSource: queryName
			});
		};
		
		function pp(element){
			element.kendoAutoComplete({
				dataSource: publicPrivate
			});
		}
		
		function reportSources(element){
			element.kendoAutoComplete({
				dataSource: reportSource
			});
		}
		
		function createdBySources(element){
			element.kendoAutoComplete({
				dataSource: createdBySource
			});
		}		
	};
	
	/**
	 * Initializes the 'Right in the DRC (Avails) report.
	 */
	this.initializeRightsGroupGrid = function(){
		
		var onDataBound = function(){	
			var grid = $("#rep_rightsPanelGrid").data('kendoGrid');
			grid.table.find("tr").find("td:first input").change(function(e){
				
				var checked = $(this).is(":checked");
				var st = $(this).attr('id');
				var mark = "rep_checkboxRights_";
				var id = st.substring(st.indexOf(mark)+mark.length);
				var items = $("#rep_rightsPanelGrid").data("kendoGrid").dataSource.data();
				for (var i = 0; i < items.length; i++) {
					var item = items[i];
					if(item.id == id){
						item.set('rep_checkboxRightsValue', checked);
						$("#"+st).attr('checked', checked);
						var rows = grid.tbody.find("tr");
						$.each(rows, function(id, elem){
							var idString = $(elem).find("td:first input").attr("id");
							if(idString == st){
								if(checked){
									$(elem).addClass("k-state-selected");
								}
								else {
									$(elem).removeClass("k-state-selected");
								}
							}
						});
					}				
				}
				
				if(!checked) {
					$("#rep_selectAllRightsGroup").attr('checked', false);
				}
			});
		};
		
		$("#rep_rightsPanelGrid").kendoGrid({
			sortable: true,
			columns: [ 
                      { field: "rep_checkboxRightsValue", title: "<label><input type='checkbox' id='rep_selectAllRightsGroup' class='selectAllRightsGroupClass'></label>", template : "<input type='checkbox' id='rep_checkboxRights_#=data.id#'   class=\"check_row\">", width : "5%", sortable : false, filterable : false},
                      { field: "rep_rightsGroupId", title: "Rights Group ID", width : "5%"},
                      { field: "rep_Media", title: "Media", width : "23%"},
                      { field: "rep_territory", title: "Territory", width : "23%"},
                      { field: "rep_language", title: "Language", width : "23%"},
                      { field: "rep_action", title: "Action", template:"<a href='javascript:$.noop()' onclick='rep_reportManagementObject.loadGroup(#=data.rep_rightsGroupId #)'>Load Group</a>", width : "20%"}
                  ],
			selectable : "multiple",
			scrollable : false,
			dataBound : onDataBound
			
        });
		
		$("#rep_selectAllRightsGroup").click(function (e) {
			
			var $cb = $(this);
			var checked = $cb.is(':checked');
			var grid = $("#rep_rightsPanelGrid").data('kendoGrid');
			var rows = grid.tbody.find("tr");
			
			var data = grid.dataSource.data();
			$.each(data, function(id, elem){
				elem.set('rep_checkboxRightsValue', checked);			
			});
			
			$.each(rows, function(id, elem){
				var idString = $(elem).find("td:first input").attr("id");
				$("#"+idString).attr('checked', checked);
			});
			
			
			if(checked){
				grid.table.find("tr").addClass("k-state-selected");
			}
			else {
				grid.table.find("tr").removeClass("k-state-selected");
			}
			
			
			if (!checked)
			{
				$("#rep_rightsPanelGrid").data("kendoGrid").clearSelection();
			}
		});
	};
	
	/**
	 * Initializes the Media, Territory, and Language sections
	 */
	this.rep_initializeMTL = function(){
		
		var rep_initMTLSelectors = function initMTLSelectors() {			
			$("#rep_mediaSelector").kendoHierarchySelector({
				dataSource : [],
				add : "rep_addMedia",
				remove : "rep_removeMedia",
				accumulator : "rep_mediaSelected",
				id : "id",
				text : "text"
			});			
			
			$("#rep_territorySelector").kendoHierarchySelector({
				dataSource : [],
				add : "rep_addTerritory",
				remove : "rep_removeTerritory",
				accumulator : "rep_territorySelected",
				id : "id",
				text : "text"
			});
			
			$("#rep_languageSelector").kendoHierarchySelector({
				dataSource : [], //erm.dbvalues.languageNodes,
				add : "rep_addLanguage",
				remove : "rep_removeLanguage",
				accumulator : "rep_languageSelected",
				id : "id",
				text : "text"
			});
			
		};
		
		erm.dbvalues.afterInit(rep_initMTLSelectors);

	};
	
	/*
	 * these array are used to hold the values of the open internet and close internet checkboxes.
	 */
	var oia = new Array();
	var oin = new Array();
	var cia = new Array();
	var cin = new Array();
	
	/**
	 * Initializes the Info code section
	 */
	this.initializeInfoCodes = function(){
		var that = this;
		
		this.toTitleCase = function(str) {
			return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		};
		
		//Initializes the data sources for hte info codes selector
		var initInfoCodes = function initInfoCodes() {
			var data = erm.dbvalues.activeRestrictions;
			var openInternetAny = ['STR', 'INV'];
			var openInternetNone = ['INX', 'INR', 'INM', 'INP', 'IRA'];
			var closedInternetAny = ['STR', 'INR', 'INM', 'INV', 'INP'];
			var closedInternetNone = ['INX', 'IRA'];
			if(data){
				 var d = new Array();
				 var r = new Array();
				 $.each(data, function(idx, element){
					 var ob = new Object();
					 ob = element;
					 ob.description2 = ob.code.toUpperCase() + " - " + that.toTitleCase(ob.description);
					 if((element.restrictionTypeId != 1 && element.defaultBusinessSeverity != 1 && element.defaultLegalSeverity != 1) || element.code == 'HOL'){						
						 d.push(ob);
						 
						 if(openInternetAny.indexOf(element.code) > -1){
							 oia.push(element.id);
						 }
						 
						 if(openInternetNone.indexOf(element.code) > -1){
							 oin.push(element.id);
						 }
						 
						 if(closedInternetAny.indexOf(element.code) > -1){
							 cia.push(element.id);
						 }
						 
						 if(closedInternetNone.indexOf(element.code) > -1){
							 cin.push(element.id);
						 }						 
					 }	
					 r.push(ob);
				 });
				 
				 that.infoCodeSourceForDRC = new kendo.data.DataSource({
					 data : d
				 });
				 
				 that.infoCodeSource = new kendo.data.DataSource({
					 data : r
				 });
				 
				 $("#rep_infoCodeSelector").kendoInfoCodeSelector({
					addToAdd : "rep_addInfoCodeAdd",
					removeFromAdd : "rep_removeInfoCodeAdd",
					addToRemove : "rep_addInfoCodeRemove",
					removeFromRemove : "rep_removeInfoCodeRemove",
					accumulatorAdd : "rep_infoCodeAddSelected",
					accumulatorRemove : "rep_infoCodeRemoveSelected",
					value : "id",
					text : "description2"
				 });
				 
				 var picData = new Array();
				 var obj = new Object();
				 obj.id = -1;
				 obj.description2 = "";
				 picData.push(obj);
				 picData = picData.concat(r);
				 
				 var productInformationCodeDataSource = new kendo.data.DataSource({
					 data : picData
				 });
				 
				 if(!$("#rep_productInformationCode").data("kendoDropDownList")){
					$("#rep_productInformationCode").kendoDropDownList({
						dataTextField: "description2",
			            dataValueField: "id",
			            template: "${ data.description2 }",
			            dataSource : productInformationCodeDataSource
					});
				}
				 
				if(!$("#rep_infoCodeSeverity").data("kendoDropDownList")){
					var dataArray = [{id:-1, text:""}, {id:1, text:"Critical"}, {id:2, text:"Warning"}];
					var onDataChange = function(){
						var value = $("#rep_infoCodeSeverity").data("kendoDropDownList").value();
						if(value && value > 0){
							var ds = $("#rep_infoCodeSelector").data("kendoInfoCodeSelector").getAllDataItemsFromDS();
							if(ds && ds.length > 0){
								var selection = new Array();
								$.each(ds, function(id, elem){
									if(elem.defaultBusinessSeverity == value || elem.defaultLegalSeverity == value){
										selection.push(elem.id);
									}
								});
								
								if(selection.length > 0){
									$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").setSelected(selection);
								}
							}
						}
						else {
							$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").clearSelected();
						}
					};
					
					$("#rep_infoCodeSeverity").kendoDropDownList({
						dataTextField: "text",
			            dataValueField: "id",
			            template: "${ data.text }",
			            dataSource : dataArray,
			            change : onDataChange
					});
				}
			 }			
		};
		
		erm.dbvalues.afterInit(initInfoCodes);
		
		//Event handling for open internet checkbox
		$("#rep_motOpenInternet").click(function(){
			if($(this)[0].checked){
				that.removeClosedInternet();
				that.addOpenInternet();
			}
		});
		
		//Event handling for close internet checkbox
		$("#rep_motClosedInternet").click(function(){
			if($(this)[0].checked){
				that.removeOpenInternet();
				that.addCloseInternet();
			}
		});
		
		$("#rep_motClearInfoCodes").click(function(){			
			$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").clear();
			$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").populateSelectorAlt();
			$("#rep_infoCodeAny")[0].checked = true;
			$("#rep_infoCodeAll")[0].checked = false;	
			$("#rep_motOpenInternet")[0].checked = false;
			$("#rep_motClosedInternet")[0].checked = false;
		});
		
	};
	
	/**
	 * Initializes the territory group and language group sections
	 */
	this.initGroupBoxes = function(){
		
		var that = this;
		
		//Utility method to process group event handling
		var processNewValues = function(newGroupIds, obj){
			var ts = obj.selector.data("kendoHierarchySelector");
			if(newGroupIds.length < 0){
				var accuIds = ts.getAccumulated();
				$.each(obj.tracker, function(id, elem){
					if($.inArray(elem, accuIds) > -1){
						accuIds.splice($.inArray(elem, accuIds), 1);
					}							
				});
				
				ts.clearSelected();
				ts.clearAccumulated();
				ts.setSelected(accuIds);
				setTimeout(function(){
					resetAccumulator(obj.addToElement);
				}, 1000);
				
			}
			else if(obj.tracker && (obj.tracker.length > 0) && (obj.tracker.length >= newGroupIds.length)){	
				var accuIds = ts.getAccumulated();
				var tempArr = new Array();
				$.each(obj.tracker, function(id, elem){
					
					if(newGroupIds.indexOf(elem) < 0){
						tempArr.push(elem);
					}
				});
				
				if(tempArr.length > 0){
					$.each(tempArr, function(id, elem){
						accuIds.splice($.inArray(elem, accuIds), 1);
					});
					ts.clearSelected();
					ts.clearAccumulated();
					ts.setSelected(accuIds);
					setTimeout(function(){
						resetAccumulator(obj.addToElement);
					}, 1000);
					
					
				}
			}
			else {
				ts.clearSelected();
				ts.setSelected(newGroupIds);
				setTimeout(function(){
					resetAccumulator(obj.addToElement);
				}, 1000);
								
			}
		};
		
		var resetAccumulator = function(selector){
			selector.click();
		};
		
		if(!$("#rep_territoryGroups").data("kendoMultiSelect")){
			//Handler method for territory group change
			var onTerritoryGroupChange = function(){
				var tgm = $("#rep_territoryGroups").data("kendoMultiSelect");
				if(tgm){
					var dataItems = tgm.dataItems();
					var ids = new Array();
					$.each(dataItems, function(id, elem){
						$.each(elem.territoryIds, function(idx, element){
							if(ids.indexOf(element) < 0){								
								ids.push(element);
							}
						});
					});
					
					var selector = $("#rep_territorySelector").data("kendoHierarchySelector");
					selector.setSelected(ids);
					/*
					var obj = new Object();
					obj.selector = $("#rep_territorySelector");
					obj.addToElement = $("#rep_addTerritory");
					obj.tracker = this.rep_territoryGroupsTracker;
					processNewValues(ids, obj);
					this.rep_territoryGroupsTracker = ids;
					*/
				}
			};
						
			$("#rep_territoryGroups").kendoMultiSelect({
	            filter:"startswith",
	            maxSelectedItems : 4,
	            dataTextField: "name",
	            dataValueField: "id",
	            change : onTerritoryGroupChange,
	            dataSource: {
		    		transport: {
		                   read: {
		                       dataType: "json",
		                       url: this.rep_path.getTerritoryGroupRESTPath() 
		                   }
		             }
		    	}               
	        });
			
		}
		
		if(!$("#rep_languageGroups").data("kendoMultiSelect")){
			//Handler method for language group value change event
			var onLanguageGroupChange = function(){	
				
				var tgm = $("#rep_languageGroups").data("kendoMultiSelect");
				if(tgm){
					var dataItems = tgm.dataItems();
					var ids = new Array();
					$.each(dataItems, function(id, elem){
						$.each(elem.languageIds, function(idx, element){
							if(ids.indexOf(element) < 0){								
								ids.push(element);
							}
						});
					});
					
					var selector = $("#rep_languageSelector").data("kendoHierarchySelector");
					selector.setSelected(ids);
					/*
					var obj = new Object();
					obj.selector = $("#rep_languageSelector");
					obj.addToElement = $("#rep_addLanguage");
					obj.tracker = this.rep_languageGroupsTracker;
					processNewValues(ids, obj);
					this.rep_languageGroupsTracker = ids;	
					*/				
				}
			};
			
			$("#rep_languageGroups").kendoMultiSelect({
	            filter:"startswith",
	            maxSelectedItems : 4,
	            dataTextField: "languageGroupName",
	            dataValueField: "languageGroupId",
	            change : onLanguageGroupChange, 
	            dataSource: {
	                transport: {
	                    read: {
	                        dataType: "json",
	                        url: that.rep_path.getLanguageGroupRESTPath() 
	                    }
	                }
	            }
	        });
			
		}
		
		if(!$("#rep_infoCodeGroups").data("kendoMultiSelect")){
			
			var processNewInfoCodeValues = function(newGroupIds, obj){
				var ts = obj.selector.data("kendoInfoCodeSelector");
				if(newGroupIds.length > 0){
					ts.clearSelected();
					ts.setSelected(newGroupIds);
				}
				else {
					ts.clearSelected();
				}
			};
			
			this.toTitleCase = function(str) {
				return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
			};
			
	    	var onInfoCodeGroupChange = function(){
	    		
	    		var tgm = $("#rep_infoCodeGroups").data("kendoMultiSelect");
				if(tgm){
					var d = $("#rep_infoCodeSelector").data("kendoInfoCodeSelector").getAllDataItemsFromDS();
					var dataItems = tgm.dataItems();
					var ids = new Array();
					$.each(dataItems, function(id, elem){
						$.each(d, function(id, element){
							if(element.restrictionTypeId == elem.restrictionTypeId){
								ids.push(element.id);
							}
						});
					});
					var selector = $("#rep_infoCodeSelector").data("kendoInfoCodeSelector");
					selector.setSelected(ids);
					/*
					var obj = new Object();
					obj.selector = $("#rep_infoCodeSelector");
					obj.addToElement = $("#rep_addInfoCodeAdd");
					obj.tracker = this.rep_infoCodeGroupsTracker;
					processNewInfoCodeValues(ids, obj);
					this.rep_infoCodeGroupsTracker = ids;
					*/					
				}
	    	};
    	
	        $("#rep_infoCodeGroups").kendoMultiSelect({
	            filter:"startswith",
	            dataTextField: "restrictionTypeDescription",
	            dataValueField: "restrictionTypeId",
	            template: '${ data.restrictionTypeDescription }',
	            dataSource: {
		    		transport: {
		                   read: {
		                       dataType: "json",
		                       url: that.rep_path.getAllRestrictionGroupRESTPath()
		                   }
		            }
	            },
	            change : onInfoCodeGroupChange
	        });
		};
		
	};
	
	
	
	/**
	 * Initializes product type section
	 */
	this.initializeProductTypes = function(){
		var initProductTypes = function(){
			var pt = new Array();
			var ob = new Object();
			ob.id = -1;
			ob.code = '';
			ob.name = '';
			pt.push(ob);
			var e = erm.dbvalues.productTypes;
			if(e != null && e.length > 0){
				var i = 0;
				$.each(e, function(id, elem){
					var ob = new Object();
					ob.code = elem.code;
					ob.name = elem.name;
					ob.id = (i+1);
					pt.push(ob);
					i++;
				});
				
				var dataSource = new kendo.data.DataSource({
					data : pt
				});
				$("#rep_productType").kendoHierarchySelector({
					dataSource : dataSource,
					id : "id",
					text : "name"
				});
			}
			
		};
		erm.dbvalues.afterInit(initProductTypes);
	};
	
	/**
	 * Initialize date kendo date pickers
	 */
	this.initializeDatePicker = function(){
		
		$("#rep_fromTimePeriod").kendoDatePicker({
       		footer: "Today - #=kendo.toString(data, 'd') #",
       		format : "MM/dd/yyyy",
       		parseFormats : ["yyyy-MM-dd", "EEE, d MMM yyyy", "EEE, MMM d, \'\'yy"],
       		start : "year"
        });
		
		$("#rep_toTimePeriod").kendoDatePicker({
       		footer: "Today - #=kendo.toString(data, 'd') #",
       		format : "MM/dd/yyyy",
       		parseFormats : ["yyyy-MM-dd", "EEE, d MMM yyyy", "EEE, MMM d, \'\'yy"],
       		start : "year"
        });
	};
	
	/**
	 * This section of the code initializes various buttons in the app
	 */
	this.initializeButtons = function(){
		var that = this;
		$("#rep_searchProductsForReport").click(function(event){
			var allCheckbox = $(".selectAllSearchProductResultsClass");
			if(allCheckbox){
				$.each(allCheckbox, function(id, elem){
					elem.checked = false;
				});
			}
			$("#rep_selectAllRightsGroup")[0].checked = false;
			$(".crossProductTargetsArea").empty();
			$(".closeModalProductsForReport").show();
			$(".crossProductErrorParagraph").html("");
		    $(".crossProductErrorDiv").removeClass("displayInline");
//			var mainScope = angular.element(document.getElementById("mainController")).scope();
		    var mainScope = erm.scopes.main();
		    //
			var productSearchScope = erm.scopes.search();
			//always switch to copy as copy has the submit and close button
			productSearchScope.switchCrossProductTabs('copy');			
			mainScope.setUpSearchButton(event);	
			//note this needs to be after setUpSearchButton as that calls clear criteria
			productSearchScope.setReportSearch();
			productSearchScope.$apply();
		});
		
		$("#rep_deleteSearchResultProducts").click(function(){
			that.deleteFromProductSearch();
		});
		
		$("#rep_saveQuery").click(function(){
			that.processFlag = that.processFlagArray.SAVE;
			$("#rep_updateQueryFromPopupParent").hide();
			$("#rep_saveQueryFromPopupParent").show();
			if(that.validateReport()){
				that.openSaveQueryWindow();
			}			
		});
		
		$("#rep_saveQueryFromPopup").click(function(){
			that.validateQueryName();			
		});
		
		$("#rep_cancelSaveQueryFromPopup").click(function(){
			that.closeSaveQueryWindow();
		});
		
		$("#rep_searchForSavedQuery").click(function(){
			var allCheckbox = $(".selectAllSearchQueryResultsClass");
			if(allCheckbox){
				$.each(allCheckbox, function(id, elem){
					elem.checked = false;
				});
			}
			var txt = $("#rep_reportSearch").data("kendoComboBox").text();
			if(txt && txt.length > 0){
				$("#rep_searchQueryName").val(txt);
			}
			that.openSearchQueryWindow();
		});
		
		$("#rep_addToRightsGroup").click(function(){
			that.addToRightsGroup(that);
		});
		
		$("#rep_removeFromRightsGroup").click(function(){
			that.deleteRightGroup(that);
		});
		
		$("#rep_runQuery").click(function(){
			
			that.openRedirectWindow();
			
		});
		
		/**
		 * Populate the product grid with the product coming from the search result
		 */
		$(".crossProductTargetsArea").unbind();
		$(".crossProductTargetsArea").unbind("click").on("click", function(){
			
			var productSearchScope = angular.element(document.getElementById("productSearchController")).scope();
			if(productSearchScope.crossProduct && productSearchScope.crossProduct.targets && productSearchScope.crossProduct.targets.length){				
				var dataSourceArray = $("#rep_searchProductResultGrid").data('kendoGrid').dataSource != null ? 
						$("#rep_searchProductResultGrid").data('kendoGrid').dataSource.data() : new Array();
				var dataSourceArrayClone = new Array();
								
				$.each(dataSourceArray, function(id, elem){
					var obj = new Object();
					obj.rep_rights = elem.rep_rights;					
					obj.rep_rightsTitle = elem.rep_rightsTitle;
					obj.rep_title = elem.rep_title;
					obj.rep_wprId = elem.rep_wprId;
					obj.rep_type = elem.rep_type;
					obj.rep_productionYear = elem.rep_productionYear;
					obj.rep_productionCompany = elem.rep_productionCompany;
					obj.rep_firstReleaseDate = elem.rep_firstReleaseDate; 
					obj.foxVersionId = elem.foxVersionId;
					obj.rep_checkboxValue = elem.rep_checkboxValue;
					dataSourceArrayClone.push(obj);
				});
				dataSourceArray = dataSourceArrayClone;
				
				var foxVersionArray = new Array();
				$.each(dataSourceArray, function(id, elem){
				  foxVersionArray[elem.foxVersionId] = elem.foxVersionId;
				});
				
				var v = null;
				
				for(var i = 0; i < productSearchScope.crossProduct.targets.length; i++){
					
					try {
						v = productSearchScope.crossProduct.WPRMap[productSearchScope.crossProduct.targets[i]]; //elem];	
						var obj = new Object();					
						
						var rightsIndicator = (v.ermProductVersionHeader !=  null) ? v.ermProductVersionHeader.rightsIndicator : 'N';					
						obj.rep_rights = strands.getIndicator(rightsIndicator);					
						obj.rep_rights = (rightsIndicator == 'N' || rightsIndicator == '' || (obj.rep_rights.indexOf('null') > -1)) ? null : obj.rep_rights;
						obj.rep_rightsTitle = strands.getIndicatorTitle(rightsIndicator);
						obj.rep_title = v.title + (v.versionTitle != null ? " / " + v.versionTitle : "");
						obj.rep_wprId = v.financialProductId;
						obj.rep_type = v.productTypeDesc;
						obj.rep_productionYear = (v.productionYear == null) ? "" : v.productionYear;
						obj.rep_productionCompany = v.financialDivisionCode;
						obj.rep_firstReleaseDate = (v.releaseDate == null) ? "" : that.getFormattedDate(new Date(v.releaseDate)); //new Date(v.releaseDate); //that.getFormattedDate(new Date(v.releaseDate));
						if(v.defaultVersionId != null){
							obj.foxVersionId = v.defaultVersionId;
						}
						else if(v.foxVersionId != null){
							obj.foxVersionId = v.foxVersionId;
						}
						else if(v.ermProductVersionHeader != null && v.ermProductVersionHeader.foxVersionId != null){
							obj.foxVersionId = v.ermProductVersionHeader.foxVersionId;
						}
						else if(v.product != null && v.product.defaultVersionId != null){
							obj.foxVersionId = v.product.defaultVersionId;
						}
						else {
							obj.foxVersionId = null;
						}
						
						obj.rep_checkboxValue = false;
					
						if (!foxVersionArray[obj.foxVersionId]){
							dataSourceArray.push(obj);
						}
						  														
						obj = null;
					}
					catch(e){
						console.log("ERROR : %o", e);
					}
					
				}
				
				
				$("#rep_searchProductCount").html("Number of products included : "+dataSourceArray.length);
				var dataSource = new kendo.data.DataSource({
					data : dataSourceArray
				});	
			
				$("#rep_searchProductResultGrid").data('kendoGrid').setDataSource(dataSource);
				$("#rep_searchProductResultGrid").data("kendoGrid").dataSource.read();
				$(".check_search_product_row").unbind();
				$(".check_search_product_row").click(function(){
					searchProductCheckboxEvent(this);
				});
			}
						
		});	
		
		
		$("#rep_cancelQuery").click(function(){
			that.resetReportManagementFields();
		});
		
		$("#rep_exitPopup").click(function(){
			that.resetReportManagementFields();
			that.closeReportManagementPopupWindow();
		});
		
		$("#rep_searchSearchButton").click(function(){
			that.processSavedQuerySearch();
		});
		
		$("#rep_clearParameters").click(function(){
			that.resetReportManagementFields();
		});
		
		$("#rep_searchSavedQueryClear").click(function(){
			that.resetSearchSavedQueryParam();
		});
		
		$("#rep_deleteQueryResultEntry").click(function(){
			that.processSavedQueryDelete();
		});
		
		$("#rep_updateQuery").click(function(){
			that.processFlag = that.processFlagArray.UPDATE;
			$("#rep_updateQueryFromPopupParent").show();
			$("#rep_saveQueryFromPopupParent").hide();
			if(that.validateReport()){
				var txt = $("#rep_reportSearch").data("kendoComboBox").text();
				if(txt && txt.length > 0){
					$("#rep_queryName").val(txt);
				}
				that.openSaveQueryWindow();
			}
		});
		
		$("#rep_updateQueryFromPopup").click(function(){
			that.validateQueryNameForUpdate();
		});
		
		$("#rep_openSearchSavedQuery").click(function(){
			that.loadSavedSearchQueryPopup();
		});
		
		$("input").keypress(function(e){
			if(e.which == 13){
				e.preventDefault();
			}
		});
		
		$("#rep_reportTypeFormat").change(function(){
			
			$(this).find("option").each(function(id, element){				
				if($(element).selected){					
					that.queryViewModel.set("reportTypeFormat", $(element).val());
				}
			});
		});
	};
	
	/**
	 * Opens the runReport.html to run the report
	 */
	this.openRedirectWindow = function(){
		
		if(this.validateAndSubmitReport()){
			if(this.rep_redirectUrlWindow){
				this.rep_redirectUrlWindow = null;
			}
			if(!this.rep_runReportWindow){
				this.rep_runReportWindow = window.self;
			}
			//We open the report window here to prevent it from being blocked by the popup blockers
			//Since the opening of a popup window must occur as soon as the click is registered by 
			//the system, this way we can fool the popup blockers into believing that the popup window
			//opening is a direct result of the user's action.
			/*var w = this.rep_runReportWindow.open('runReport.html', '_blank');
			this.rep_redirectUrlWindow = w; */
			this.processFlag = this.processFlagArray.RUN;
			this.runReport();
		}
	};
	
	
	/**
	 * Hide the product grid panel
	 */
	this.initializeHeaders = function(){
		var that = this;
		$("#rep_showHideQueryPanel").click(function(){
			that.showHideSearchParametersPanel();
		});
		
		$("#rep_showHideRightsPanel").click(function(){
			that.showHideRightsPanel();
		});
	};
	
	this.initializeSubmitWindow = function(){
		if (!$("#rep_submitPopupWindow").data("kendoWindow")) {
			$("#rep_submitPopupWindow").kendoWindow({
                width: "450px",
                height : "150px",
                minWidth : "450px",
                minHeight : "150px",
                title: "",
                actions: [],
                visible : false
            });
        }
	};
	
	this.initializeSearchSavedQueriesWindow = function(){
		if (!$("#rep_searchSavedQueriesPopupWindow").data("kendoWindow")) {
			$("#rep_searchSavedQueriesPopupWindow").kendoWindow({
                width: "450px",
                height : "150px",
                minWidth : "450px",
                minHeight : "150px",
                title: "",
                actions: [],
                visible : false
            });
        }
	};
	
	/**
	 * Initializes the query search drop down
	 */
	this.initializeQuerySearchDropDown = function(){
		var that = this;
		var loadQueries = function(){
			var onDataChange = function(){
				
				var value = $("#rep_reportSearch").data("kendoComboBox").value();
				if(value){
					var data = $("#rep_reportSearch").data("kendoComboBox").dataSource.data();
					for(var i = 0; i < data.length; i++){
						if(data[i].id == value){
							that.resetReportManagementFields();
							that.populateQueryFromSearchSavedQueries(data[i].sourceReportId, value, erm.security.user.userId);
							break;
						}
					}
				}
			};
			var scope = angular.element(document.getElementById("reportController")).scope();
			var sq = scope.reportData;
			if(sq){
				var savedQueries = sq.savedReportQueries;
				if(savedQueries == null){
					savedQueries = [];
				}
				var dataSource = new kendo.data.DataSource({
					data : savedQueries
				});
				$("#rep_searchForQuery").kendoComboBox({
		            filter:"contains",
		            dataTextField: "name",
		            dataValueField: "id",
		            template: "${ data.name }",
		            dataSource : dataSource
		        });
				
				if(!$("#rep_reportSearch").data("kendoComboBox")){
					$("#rep_reportSearch").kendoComboBox({
			            filter:"contains",
			            dataTextField: "name",
			            dataValueField: "id",
			            template: "${ data.name }",
			            dataSource : dataSource,
			            change : onDataChange
			        });
				}
				var queryNameList = new Array();
				var queryIds = new Array();
				var createdBy = new Array();
				var ds = new Array();
				$.each(savedQueries, function(id, elem){
					var ob = new Object();
					ob.rep_queryId = elem.id;
					ob.rep_queryName = elem.name;
					ob.rep_queryComment = elem.queryComment;
					ob.rep_queryPublic = (elem.publicFlag == 'N') ? 'private' : 'public';					
					ob.rep_querySource = that.reports[elem.sourceReportId];
					ob.rep_queryCreatedBy = elem.createName;
					ob.rep_queryCheckboxValue = false;
					ob.rep_sourceReportId = elem.sourceReportId;
					ds.push(ob);
					if(createdBy.indexOf(elem.createName) < 0){
						createdBy.push(elem.createName);
					}
					queryNameList.push(elem.name);
					queryIds.push(elem.id);
				});
				
				var publicPrivate = new Array();
				publicPrivate.push("private");
				publicPrivate.push("public");
				
				that.initializeSearchQueryResultGrid(ds, queryNameList, publicPrivate, that.reportSource, createdBy);
			}
			else {
				setTimeout(function(){
					loadQueries();
				}, 500);
				
			}
		};
		
		loadQueries();
		
	};
	
	/**
	 * Initializes additional elements for the Rights Inquiry Report
	 */
	this.initializeRightsInquiryElements = function(){
		
		var that = this;
		
		var dateOptionChange = function(){
			var dov = $("#rep_dateOption").data("kendoDropDownList").value();
			var dateOptionValue = parseInt(dov);
			if(dateOptionValue > 0){
				that.enableDateOption();
				if(dateOptionValue == 1){
					$("#rep_dateOptionFromTBA")[0].checked = false;
       				$("#rep_dateOptionFromTBA").attr("disabled", false);
       				$("#rep_dateOptionToTBA")[0].checked = false;
       				$("#rep_dateOptionToTBA").attr("disabled", false);
				}
				else if(dateOptionValue == 2 || dateOptionValue == 3 || dateOptionValue == 4 || dateOptionValue == 5){
					
					if(dateOptionValue == 2 || dateOptionValue == 4){
						$("#rep_dateOptionFrom").data("kendoDatePicker").value(new Date());
						$("#rep_dateOptionTo").data("kendoDatePicker").value(null);
					}
					else if(dateOptionValue == 3 || dateOptionValue == 5){
						$("#rep_dateOptionTo").data("kendoDatePicker").value(new Date());
						$("#rep_dateOptionFrom").data("kendoDatePicker").value(null);
					}
										
       				$("#rep_dateOptionFromTBA")[0].checked = false;
       				$("#rep_dateOptionFromTBA").attr("disabled", true);
       				$("#rep_dateOptionToTBA")[0].checked = false;
       				$("#rep_dateOptionToTBA").attr("disabled", true);
				}
				
			}
			else {
				that.disableDateOption();
			}
		};
		
		if(!$("#rep_dateOption").data("kendoDropDownList")){
			
			//var dateOptionDataArray = [{id:-1, text:""}, {id:1, text:"Term"}, {id:2, text:"Start Date"}, {id:3, text:"End Date"}];
			//var dateOptionDataArrayWithInfoCode = [{id:-1, text:""}, {id:1, text:"Term"}, {id:2, text:"Start Date"}, {id:3, text:"End Date"}, {id:4, text:"Info Code Start Date"}, {id:4, text:"Info Code End Date"}];
			
			$("#rep_dateOption").kendoDropDownList({
				dataTextField: "text",
	            dataValueField: "id",
	            template: "${ data.text }",
	            dataSource : that.dateOptionDataArrayWithInfoCode,
	            change : dateOptionChange
			});
		}
		
		$("#rep_dateOptionFrom").kendoDatePicker({
       		footer: "Today - #=kendo.toString(data, 'd') #",
       		format : "MM/dd/yyyy",
       		parseFormats : ["yyyy-MM-dd", "EEE, d MMM yyyy", "EEE, MMM d, \'\'yy"],
       		start : "year"
        });
		
		$("#rep_dateOptionTo").kendoDatePicker({
       		footer: "Today - #=kendo.toString(data, 'd') #",
       		format : "MM/dd/yyyy",
       		parseFormats : ["yyyy-MM-dd", "EEE, d MMM yyyy", "EEE, MMM d, \'\'yy"],
       		start : "year"
        });
		
		if(!$("#rep_legalConfirmationStatus").data("kendoHierarchySelector")){
			$.getJSON(that.rep_path.getLegalConfirmationStatusRESTPath(), function(data){
				
				if(data){
					var dataArray = new Array();
					var obj = new Object();
					obj.confirmationStatusId = -1;
					obj.confirmationStatusCode = "";
					obj.description = "";
					dataArray.push(obj);
					$.each(data, function(id, elem){
						elem.description = elem.confirmationStatusCode+", "+elem.confirmationStatusDescription;
						dataArray.push(elem);
					});
					
					var legalConfirmationStatusDataSource = new kendo.data.DataSource({
						data : dataArray
					});
					
					$("#rep_legalConfirmationStatus").kendoHierarchySelector({
						text: "confirmationStatusCode",
			            id: "confirmationStatusId",
			            //template: "${ data.description }",
			            dataSource : legalConfirmationStatusDataSource 
					});
				}
				
				
			});
			
		}
		
		var yesNoArray = new Array();
		
		var ynObj0 = new Object();
		ynObj0.id = -1;
		ynObj0.text = '';
		yesNoArray.push(ynObj0);
		
		var ynObj1 = new Object();
		ynObj1.id = 1;
		ynObj1.text = 'YES';
		yesNoArray.push(ynObj1);
		
		var ynObj2 = new Object();
		ynObj2.id = 0;
		ynObj2.text = 'NO';
		yesNoArray.push(ynObj2);
		
		var futureMediaArray = new Array();
		
		var ynObject0 = new Object();
		ynObject0.id = -2;
		ynObject0.text = '';
		futureMediaArray.push(ynObject0);
		
		var ynObject1 = new Object();
		ynObject1.id = 1;
		ynObject1.text = 'YES';
		futureMediaArray.push(ynObject1);
		
		var ynObject2 = new Object();
		ynObject2.id = 0;
		ynObject2.text = 'NO';
		futureMediaArray.push(ynObject2);
		
		var ynObject3 = new Object();
		ynObject3.id = -1;
		ynObject3.text = 'Undetermined';
		futureMediaArray.push(ynObject3);
		
		var doNotLicenseDataSource = new kendo.data.DataSource({
			data : yesNoArray
		});
		
		var futureMediaDataSource = new kendo.data.DataSource({
			data : futureMediaArray
		});
		
		if(!$("#rep_doNotLicense").data("kendoDropDownList")){
			$("#rep_doNotLicense").kendoDropDownList({
				dataTextField: "text",
	            dataValueField: "id",
	            template: "${ data.text }",
	            dataSource : doNotLicenseDataSource
			});
		}
		
		if(!$("#rep_futureMedia").data("kendoDropDownList")){
			$("#rep_futureMedia").kendoDropDownList({
				dataTextField: "text",
	            dataValueField: "id",
	            template: "${ data.text }",
	            dataSource : futureMediaDataSource
			});
		}
		
		if(!$("#rep_contacts").data("kendoHierarchySelector")){
			$.getJSON(that.rep_path.getAllContactsFromProductsRESTPath(), function(data){
				if(data){
					var scope = angular.element(document.getElementById("mainController")).scope();
					var partyTypesMap = scope.partyTypesMap;
					var dataArray = new Array();
					var ob = new Object();
					ob.partyId = -1;
					ob.displayName = '';
					dataArray.push(ob);
					$.each(data, function(id, elem){
						elem.displayName = elem.displayName+"&nbsp;&nbsp;&nbsp;&nbsp;(<b>"+partyTypesMap[elem.partyTypeCode]+"</b>)";
						dataArray.push(elem);
					});
					var contactDataSource = new kendo.data.DataSource({
						data : dataArray
					});
					
					$("#rep_contacts").kendoHierarchySelector({
						dataSource : contactDataSource,
						id : "partyId",
						text : "displayName"
					});
				}
			});
		}
		
		if(!$("#rep_subrightsSalesAndMarketing").data("kendoHierarchySelector")){
			$.getJSON(that.rep_path.getAllActiveGrantCodeRESTPath(), function(data){
				if(data){
					var dataArray = new Array();
					var ob = new Object();
					ob.id = -1;
					ob.description = '';
					dataArray.push(ob);
					dataArray = dataArray.concat(data);
					var dataSource = new kendo.data.DataSource({
						data : dataArray
					});
					
					$("#rep_subrightsSalesAndMarketing").kendoHierarchySelector({
						dataSource : dataSource,
						id : "id",
						text : "description"
					});
				}
				
			});
		}
		
		if(!$("#rep_methodOfTransmission").data("kendoHierarchySelector")){
			var motDataSource = [
			                     {mediaId:-1, mediaCode:'', mediaDescription:'' },
			                     {mediaId:37, mediaCode:'BOD', mediaDescription:'Basic On Demand'},
			                     {mediaId:36, mediaCode:'EST', mediaDescription:'Electronic Sell-Through'},
			                     {mediaId:38, mediaCode:'FOD', mediaDescription:'Free On Demand'},
			                     {mediaId:35, mediaCode:'INTN', mediaDescription:'Internet'},
			                     {mediaId:32, mediaCode:'NVOD', mediaDescription:'Near Video On Demand'},
			                     {mediaId:34, mediaCode:'SVOD', mediaDescription:'Subscription Video On Demand'},
			                     {mediaId:30, mediaCode:'VOD', mediaDescription:'Video On Demand'}			                     			                     			                     			                     			                     
			                     ];
			$("#rep_methodOfTransmission").kendoHierarchySelector({
				dataSource : motDataSource,
				id : "mediaId",
				text : "mediaDescription"
			});
		}
		
		if(!$("#rep_contractualPartyType").data("kendoHierarchySelector")){
			var initializeContractualPartyType = function(){
				var pt = new Array();
				
				console.log("-------------CONTRACTUAL PARTY TYPES: %o", erm.dbvalues.contractualPartyTypes);
				var e = erm.dbvalues.contractualPartyTypes;
				if(e != null && e.length > 0){
					var ob1 = new Object();
					ob1.id = -1;
					ob1.name = "";
					pt.push(ob1);
					$.each(e, function(id, elem){
						var ob = new Object();
						ob.id = elem.contractualPartyTypeId;
						ob.name = elem.contractualPartyTypeDesc;
						pt.push(ob);
					});
					
					var cpDataSource = new kendo.data.DataSource({
						data : pt
					});
					
					$("#rep_contractualPartyType").kendoHierarchySelector({
						//dataTextField: "name",
			            //dataValueField: "id",
						id: "id",
						text: "name",
			            //template: "${ data.name }",
			            dataSource : cpDataSource
					});
					
				}
			};
			erm.dbvalues.afterInit(initializeContractualPartyType);
		}
		
		if(!$("#rep_contractualParty").data("kendoHierarchySelector")){
			var initializeContractualParty = function(){
				var pt = new Array();
				var e = erm.dbvalues.contractualParties;
				if(e != null && e.length > 0){
					var ob1 = new Object();
					ob1.id = -1;
					ob1.name = "";
					pt.push(ob1);
					$.each(e, function(id, elem){
						var ob = new Object();
						ob.id = elem.partyId;
						ob.name = elem.organizationName;
						pt.push(ob);
					});
					
					var cpDataSource = new kendo.data.DataSource({
						data : pt
					});
					
					$("#rep_contractualParty").kendoHierarchySelector({
						//filter : "startswith",
						id: "id",
						text: "name",
			            //template: "${ data.name }",
			            dataSource : cpDataSource
					});
					
				}
			};
			erm.dbvalues.afterInit(initializeContractualParty);
		}
		
		if(!$("#rep_foxEntity").data("kendoHierarchySelector")){
			var initializeContractualParty = function(){
				var pt = new Array();
				var e = erm.dbvalues.foxEntities;
				if(e != null && e.length > 0){
					var ob1 = new Object();
					ob1.id = -1;
					ob1.name = "";
					pt.push(ob1);
					$.each(e, function(id, elem){
						var ob = new Object();
						ob.id = elem.partyId;
						ob.name = elem.displayName;
						pt.push(ob);
					});
					
					var feDataSource = new kendo.data.DataSource({
						data : pt
					});
					
					$("#rep_foxEntity").kendoHierarchySelector({
						//filter : "startswith",
						text: "name",
			            id: "id",
			            //template: "${ data.name }",
			            dataSource : feDataSource
					});
					
				}
			};
			erm.dbvalues.afterInit(initializeContractualParty);
			
		}
		
		$("#rep_methodOfTransmissionLink").click(function(){
			$("#rep_methodOfTransmission").data("kendoHierarchySelector").setSelected([]);
			that.enableWithoutMOT();
		});
		
		$("#rep_methodOfTransmission").click(function(){
			var ids = $("#rep_methodOfTransmission").data("kendoHierarchySelector").getSelected();
			if(!that.disabledForMOTFlag && ids && ids.length > 0){
				that.disableForMOT();
			}
		});
		
	};
	
	/**
	 * Binds the hide/show method of transmission event to the business and legal checkboxes
	 */
	this.initializeCheckboxes = function(){
		var that = this;
		$("#rep_rightCheckBusiness").click(function(){
			if(that.queryViewModel.get("reportId") == that.reportIndexes.PRODUCT_INQUIRY_REPORT){
				that.resetFromMOT();
				that.disableMethodOfTransmission();
				$(".methodOfTransmissionClass").hide();
			}
			changeDateOptionDataSource(that, 'BUSINESS');
		});
		
		$("#rep_rightCheckLegal").click(function(){
			if(that.queryViewModel.get("reportId") == that.reportIndexes.PRODUCT_INQUIRY_REPORT){
				$(".methodOfTransmissionClass").show();
				that.enableMethodOfTransmission();
			}
			changeDateOptionDataSource(that, 'LEGAL');
		});
		
	};
	
	/**
	 * Method used to change the data source of the date option dropdown
	 */
	var changeDateOptionDataSource = function(obj, type){
		if(type == 'LEGAL'){			
			var newDataSource = new kendo.data.DataSource({
				data : obj.dateOptionDataArrayWithInfoCode
			});
			$("#rep_dateOption").data("kendoDropDownList").setDataSource(newDataSource);
		}
		else if(type == 'BUSINESS'){			
			var newDataSource = new kendo.data.DataSource({
				data : obj.dateOptionDataArray
			});
			$("#rep_dateOption").data("kendoDropDownList").setDataSource(newDataSource);
		}
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
	 * Open the Report management window popup from the main listing on the first report popup window
	 */
	this.openReportManagementWindowMain = function(reportId, queryId, closeFlag){
		//TFS #13584
		if (reportId == 1) {
			console.log("I should be in the RSAE Report");
		} else if (reportId == 6) {
			console.log("I should be in the PIR Report");
		} else if (reportId == 5) {
			console.log("I should be in the DRR Report");
		}
			
		this.openReportManagementWindow(reportId, queryId, closeFlag, erm.security.user.userId);
	
	};
	
	/**
	 * Actual method responsible for the opening of the Report popup window
	 */
	this.openReportManagementWindow = function(reportId, queryId, closeFlag, userName){
		console.log("I am in the openReportManagementWindow: " + userName + ":" + erm.security.isLegalAdmin());
		console.log("reportID: " + reportId);
		
		if(erm.security.canViewQuery()){
			$("#rep_runQuery").show();
		}
		else {
			$("#rep_runQuery").hide();
		}
		
		if(erm.security.canCreatePublicQuery()){
			$(".canCreatePublicQueryClass").show();
		}
		else {
			$(".canCreatePublicQueryClass").hide();
		}
		$("#rep_deleteSearchResultIcon").hide();
		var that = this;
		this.queryViewModel.set("rightsCheckType","BUSINESS");
		this.queryViewModel.set("reportId",reportId);
		this.queryViewModel.set("reportTypeFormat", "1");
		
		if(closeFlag){
			that.resetReportManagementFields();
			that.closeReportManagementPopupWindow();
			that.closeSearchQueryWindow();
		}
		
		this.worldwideTerritoryId = erm.dbvalues.territoryNodes[0].id;
		this.allMediaId = erm.dbvalues.mediaNodes[0].id;
		this.allLanguageId = erm.dbvalues.languageNodes[0].id;
		
		if(reportId == this.reportIndexes.AVAILS_REPORT){
			$("#rep_productTypeLabel").html(this.productTypeNameInternational);
			$("#rep_selectedMediaRequired").html("*");
			$("#rep_selectedLanguageRequired").html("*");
			$("#rep_selectedTerritoryRequired").html("*");	
			$("#rep_selectedProductsForReport").html("");
			$("#rep_mediaSelector").data("kendoHierarchySelector").setDataSource(erm.dbvalues.mediaNodes[0].items);
			$("#rep_languageSelector").data("kendoHierarchySelector").setDataSource(erm.dbvalues.languageNodes[0].items);
			$("#rep_territorySelector").data("kendoHierarchySelector").setDataSource(erm.dbvalues.territoryNodes[0].items);						
			this.enableDisableAddRightsGroup();
			$("#rep_rightCheckLegal").hide();
			$(".legalRadioCheckClass").hide();
			$("#rep_rightCheckBusiness")[0].checked = true;
			$(".rightsAsEnteredClass").hide();
			$(".methodOfTransmissionClass").hide();
			var allCheckbox = $(".selectAllRightsGroupClass");
			if(allCheckbox){
				$.each(allCheckbox, function(id, elem){
					elem.checked = false;
				});
			}
			$(".productInquiryReportClass").hide();
			$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").setDataSource(this.infoCodeSourceForDRC);
		}
		else if(reportId == this.reportIndexes.RIGHTS_AS_ENTERED_REPORT || reportId == this.reportIndexes.PRODUCT_INQUIRY_REPORT){
			$("#rep_selectedMediaRequired").html("");
			$("#rep_selectedLanguageRequired").html("");
			$("#rep_mediaSelector").data("kendoHierarchySelector").setDataSource(erm.dbvalues.mediaNodes);
			$("#rep_languageSelector").data("kendoHierarchySelector").setDataSource(erm.dbvalues.languageNodes);
			$("#rep_rightCheckLegal").show();
			$(".legalRadioCheckClass").show();
			$("#rep_rightCheckBusiness")[0].checked = true;
			
			if(reportId == this.reportIndexes.RIGHTS_AS_ENTERED_REPORT){
				$("#rep_territorySelector").data("kendoHierarchySelector").setDataSource(erm.dbvalues.territoryNodes);
				$("#rep_productTypeLabel").html(this.productTypeNameInternational);
				$(".rightsAsEnteredClass").show();
				$("#rep_selectedTerritoryRequired").html("*");
				$(".productInquiryReportClass").hide();
				$("#rep_selectedProductsForReport").html("*");
			}
			if(reportId == this.reportIndexes.PRODUCT_INQUIRY_REPORT){
				var productInquiryTerritories = erm.dbvalues.territoryNodes;
				if(erm.security.isAdmin()){
					productInquiryTerritories = productInquiryTerritories.concat(erm.dbvalues.inactiveTerritories);
				}
				$("#rep_territorySelector").data("kendoHierarchySelector").setDataSource(productInquiryTerritories);
				$("#rep_productTypeLabel").html(this.productTypeName);
				$("#rep_rightCheckLegal")[0].checked = true;
				if($("#rep_rightCheckLegal")[0].checked){
					$(".methodOfTransmissionClass").show();
					that.enableMethodOfTransmission();
				}
				else {
					that.disableMethodOfTransmission();
					$(".methodOfTransmissionClass").hide();
				}
				$(".rightsAsEnteredClass").hide();				
				$(".productInquiryReportClass").show();
				$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").setDataSource(this.infoCodeSource);
				$("#rep_selectedTerritoryRequired").html("");
				$("#rep_selectedProductsForReport").html("");
				
			}
			
		}
		
		this.enableWithoutMOT();
		this.bindChangeEvent(reportId);
		//this.disableDateOption();	
		this.setProductInquiryDefaultDateOption();
		
		if(queryId){
			
			//load saved query, and populate the popup
			var url = this.rep_path.getSavedQueryRESTPath();
			var index = url.indexOf(":queryId");
			url = url.substring(0, index)+queryId;
			
			$.post(url, {q:""}, function(data){
				if(data){
					if(userName && userName.length > 0){
						
						if(userName == erm.security.user.userId){
							//that.populatePopupWithSavedQuery(data, true);
							//This saved query belong to the currently logged-in user, the options should be
							// - Update query
							// - Run query
							var scope = angular.element(document.getElementById("reportController")).scope();
							var sq = scope.reportData.reports.reportsList;
							
							for(var i = 0 ; i < sq.length; i++){
								var r = sq[i];
								if(r.id == reportId){
									that.queryViewModel.set("reportCreateDate",r.createDate);
									that.queryViewModel.set("reportName",r.description);
									var windowTitle = r.description+" - "+that.querySuffixName;
									if(reportId == that.reportIndexes.RIGHTS_AS_ENTERED_REPORT){
										that.openRightsAsEnteredReport(windowTitle);
									}
									else if(reportId == that.reportIndexes.AVAILS_REPORT){
										that.openAvailsReport(windowTitle);
									}
									else if(reportId == that.reportIndexes.PRODUCT_INQUIRY_REPORT){
										that.openRightsInquiryReport(windowTitle);
									}
									if(erm.security.canUpdateQuery()){
										$("#rep_saveQuery").hide();
										$("#rep_cancelQuery").hide();
										$("#rep_updateQuery").show();
									}
									else {
										$("#rep_saveQuery").hide();
										$("#rep_updateQuery").hide();
										$("#rep_cancelQuery").hide();
									}
									
									break;
								}
							}
							
						}
						else {
							//that.populatePopupWithSavedQuery(data, false);
							//This query saved by another user, in this case the options should be 
							// - Save query
							// - Run query
							var url = that.rep_path.getReportByReportIdRESTPath() + "/" + reportId; 
							$.post(url, {q:""}, function(data){
								that.queryViewModel.set("userFullName",data.userFullName);
								that.queryViewModel.set("reportCreateDate",data.reportCreateDate);
								that.queryViewModel.set("reportName",data.reportName);
								that.queryViewModel.set("queryId",-1);
								var windowTitle = data.reportName+" - "+that.querySuffixName;
								if(reportId == that.reportIndexes.RIGHTS_AS_ENTERED_REPORT){
									that.openRightsAsEnteredReport(windowTitle);
								}
								else if(reportId = that.reportIndexes.AVAILS_REPORT){
									that.openAvailsReport(windowTitle);
								}
								else if(reportId == that.reportIndexes.PRODUCT_INQUIRY_REPORT){
									that.openRightsInquiryReport(windowTitle);
								}
								if(erm.security.canUpdateQuery()){
									that.showSaveButtons();
								}
								else {
									that.hideAllButtons();
								}
								
								
							}).fail(function(xhr,status,message){
								errorPopup.showErrorPopupWindow(xhr.responseText);
							});
						}
					}
					that.populatePopupWithSavedQuery(data, true);
				}
				else {
					var errorString = " Unable to retrieve a valid query id from the backend services...";
					errorPopup.showErrorPopupWindow(errorString);
				}
			}).fail(function(xhr,status,message){
				errorPopup.showErrorPopupWindow(xhr.responseText);
			});
						
			
		}
		else {
			if(reportId == this.reportIndexes.AVAILS_REPORT){
				var d = new Date();
				$("#rep_fromTimePeriod").data("kendoDatePicker").value(d);
			}
			var that = this;
			this.queryViewModel.set("reportId",reportId);
			$("#rep_fromIncludeTBA")[0].checked = true;
			$("#rep_toIncludeTBA")[0].checked = true;
			
			var url = this.rep_path.getReportByReportIdRESTPath() +"/"+ reportId;			
			$.post(url, {q:""}, function(data){
				that.queryViewModel.set("userFullName",data.userFullName);
				that.queryViewModel.set("reportCreateDate",data.reportCreateDate);
				that.queryViewModel.set("reportName",data.reportName);
				that.queryViewModel.set("queryId",-1);  
				
				
				//Let reset the search product grid
				var dataSource = new kendo.data.DataSource({
					data : []
				});
				$("#rep_searchProductResultGrid").data('kendoGrid').setDataSource(dataSource);
				$("#rep_searchProductResultGrid").data('kendoGrid').refresh();
				var windowTitle = data.reportName; //+" - "+that.querySuffixName;
				if(reportId == that.reportIndexes.RIGHTS_AS_ENTERED_REPORT){
					that.openRightsAsEnteredReport(windowTitle);
				}
				else if(reportId == that.reportIndexes.AVAILS_REPORT){
					that.openAvailsReport(windowTitle);
				}
				else if(reportId == that.reportIndexes.PRODUCT_INQUIRY_REPORT){
					that.openRightsInquiryReport(windowTitle);
				}
				
				if(erm.security.canUpdateQuery()){
					that.showSaveButtons();
				}
				else {
					that.hideAllButtons();
				}
				
			}).fail(function(xhr,status,message){
				errorPopup.showErrorPopupWindow(xhr.responseText);
			});
		}
		this.enableDisableRightsGroupDeleteButton();
		this.setReportTypeFormat();
		//this.setProductInquiryDefaultDateOption();
	};
	
	
	/**
	 * Open the popup window the Rights As Entered elements loaded
	 */
	this.openRightsAsEnteredReport = function(windowTitle){
		$(".rightInquiryReportClass").hide();
		$(".rightsGroupClass").hide();
		$(".reportDateType").show();
		$(".showInfoCodesMarker").hide();
		$(".showTimePeriod").show();
		rep_reportQueryManagementPopupWindow = $("#rep_reportQueryManagementPopupWindow").data("kendoWindow");
		rep_reportQueryManagementPopupWindow.setOptions({
			modal : true,
			visible : true,
			width : this.displayWindowWith,
			height : 800,
			title : windowTitle
		});
		
		rep_reportQueryManagementPopupWindow.center();
		rep_reportQueryManagementPopupWindow.open();
	};
	
	/**
	 * Open the popup window with the DRC Report elements loaded.
	 */
	this.openAvailsReport = function(windowTitle){
		$(".rightInquiryReportClass").hide();
		$(".showInfoCodesMarker").show();
		$(".rightsGroupClass").show();
		$(".showTimePeriod").show();
		rep_reportQueryManagementPopupWindow = $("#rep_reportQueryManagementPopupWindow").data("kendoWindow");
		rep_reportQueryManagementPopupWindow.setOptions({
			modal : true,
			visible : true,
			width : this.displayWindowWith,
			height : 800,
			title : windowTitle
		});
		
		rep_reportQueryManagementPopupWindow.center();
		rep_reportQueryManagementPopupWindow.open();
	};
	
	/**
	 * Open the popup window with the Rights Inquiry Report elements loaded.
	 */
	this.openRightsInquiryReport = function(windowTitle){
		$(".showInfoCodesMarker").hide();
		$(".rightsGroupClass").hide();
		$(".reportDateType").hide();
		$(".showTimePeriod").hide();
		$(".rightInquiryReportClass").show();
		rep_reportQueryManagementPopupWindow = $("#rep_reportQueryManagementPopupWindow").data("kendoWindow");
		rep_reportQueryManagementPopupWindow.setOptions({
			modal : true,
			visible : true,
			width : this.displayWindowWith,
			height : 800,
			title : windowTitle
		});
		
		rep_reportQueryManagementPopupWindow.center();
		rep_reportQueryManagementPopupWindow.open();
	};
	
	/**
	 * Callback method used by the successPopup window for some data post processing 
	 */
	this.processCallback = function(){
		var data = this.successfullSubmitObject.data;
		var processFlag = this.successfullSubmitObject.processFlag;
		var queryId = this.successfullSubmitObject.queryId;
		var reportScope = angular.element(document.getElementById("reportController")).scope();
		var userSavedQueries = reportScope.reportData.savedReportQueries;
		var reportTypeFormat = this.successfullSubmitObject.reportTypeFormat;
		this.refreshQueryNameDropDown(userSavedQueries, queryId);
		if(processFlag == this.processFlagArray.SAVE){
			if(data.length > 0){
				this.openReportManagementWindowMain(this.queryViewModel.get("reportId"), data[0], true);
			}						
		}
		setTimeout(function(){
			$("#rep_reportTypeFormat").find("option").each(function(id, element){
				if(parseInt(element.value) == parseInt(reportTypeFormat)){
					$(element).selected = true;
				}
			});
		}, 1500);
		
		this.successfullSubmitObject = null;
	};
	
	/**
	 * This method closes the search product popup
	 */
	this.closeSearchProductPopup = function(){
		
		var mainScope = angular.element(document.getElementById("mainController")).scope();
		mainScope.restoreSearch();
		setTimeout(function(){
			if(productsSearchPopUpWindow){
				//Unless this popup window is destroyed it keeps messing up the other windows
				//close function. We destroy it with a delay to allow time for the search pane
				//to be detached from this window and re-inserted into the index.html page.
				$("#productSearchController").data("kendoWindow").destroy();
				productsSearchPopUpWindow = null;
			}
		}, 1000);
	};
	
	/**
	 * Show/hide parameters panel
	 */
	this.showHideSearchParametersPanel = function(){
		
		var v = $(".searchProductDiv").css("display");
		if(v == 'none'){
			$(".searchProductDiv").show();
			$("#rep_showHideQueryPanel").html('<i class="icon-collapse-top iconCollapseAttributes"></i>');
		}
		else {
			$(".searchProductDiv").hide();
			$("#rep_showHideQueryPanel").html('<i class="icon-collapse iconCollapseAttributes"></i>');
		}
		
	};
	
	/**
	 * 
	 */
	this.showHideRightsPanel = function(){
		var v = $("#rep_rightsPanel").css("display");
		if(v == 'none'){			
			$("#rep_rightsPanel").show();
			$("#rep_showHideRightsPanel").html('<i class="icon-collapse-top iconCollapseAttributes"></i>');
		}
		else {
			$("#rep_rightsPanel").hide();
			$("#rep_showHideRightsPanel").html('<i class="icon-collapse iconCollapseAttributes"></i>');
		}
		
	};
	
	/**
	 * 
	 */
	this.resetSaveQueryWindow = function(){
		this.saveQueryViewModel.queryName = "";
		this.saveQueryViewModel.personalTag = "";
		this.saveQueryViewModel.commentForQueryToBeSaved = "";
		this.saveQueryViewModel.publicPrivateStatus = 1;

		this.resetSaveQueryFields();
	};
	
	/**
	 * 
	 */
	this.closeSaveQueryWindow = function(){
		this.resetSaveQueryWindow();
		$("#rep_saveReportPopupWindow").data("kendoWindow").close();
	};
	
	/**
	 * 
	 */
	this.closeReportManagementPopupWindow = function(){
		$("#rep_reportQueryManagementPopupWindow").data("kendoWindow").close();
	};
	
	/**
	 * 
	 */
	this.resetSaveQueryFields = function(){
		$("#rep_queryName").val("");
		$("#rep_personalTag").val("");
		$("#rep_publicPrivateStatus")[0].checked = false;
		$("#rep_commentForSaveQuery").val("");
	};
	
	/**
	 * 
	 */
	this.resetReportManagementFields = function(){
		
		$("#rep_reportType").find("option:first").attr("selected", true);
		this.queryViewModel.set("reportQueryName","");
		$("#rep_reportSearch").data("kendoComboBox").value(null);
		$("#rep_reportSearch").data("kendoComboBox").text('');
		var dataSource = new kendo.data.DataSource({
			data : []
		});
		$("#rep_searchProductResultGrid").data('kendoGrid').setDataSource(dataSource);
		$("#rep_searchProductResultGrid").data('kendoGrid').refresh();
		$("#rep_productType").data("kendoHierarchySelector").clearSelected();
		$("#rep_mediaSelector").data("kendoHierarchySelector").clear();
		$("#rep_territorySelector").data("kendoHierarchySelector").clear();
		$("#rep_languageSelector").data("kendoHierarchySelector").clear();
		$("#rep_territoryGroups").data("kendoMultiSelect").value([]);
		$("#rep_languageGroups").data("kendoMultiSelect").value([]);
		$("#rep_timePeriodAnytime")[0].checked = true;
		$("#rep_timePeriodThroughout")[0].checked = false;
		this.queryViewModel.set("timePeriod",1);
		$("#rep_fromTimePeriod").data("kendoDatePicker").value('');
		$("#rep_toTimePeriod").data("kendoDatePicker").value('');
		$("#rep_fromIncludeTBA")[0].checked = true;
		$("#rep_toIncludeTBA")[0].checked = true;
		$("#rep_motOpenInternet")[0].checked = false;
		$("#rep_motClosedInternet")[0].checked = false;
		$("#rep_infoCodeGroups").data("kendoMultiSelect").value([]);
		$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").clear();
		$("#rep_infoCodeAny")[0].checked = true;
		$("#rep_infoCodeAll")[0].checked = false;
		this.queryViewModel.set("infoCodeRadio","1");
		$("#rep_rightsPanelGrid").data("kendoGrid").setDataSource(dataSource);
		$("#rep_rightsPanelGrid").data("kendoGrid").refresh();
		
		this.rep_rightsGroupSource = new Array();
		
		$("#rep_mediaSelector").data("kendoHierarchySelector").populateSelectorAlt();
		$("#rep_territorySelector").data("kendoHierarchySelector").populateSelectorAlt();
		$("#rep_languageSelector").data("kendoHierarchySelector").populateSelectorAlt();
		$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").populateSelectorAlt();
		$("#rep_selectAllSearchProductResults")[0].checked = false;
		$("#rep_searchProductCount").html("Number of products included : 0");
		$("#rep_selectAllRightsGroup")[0].checked = false;
		
		$("#rep_infoCodeSeverity").data("kendoDropDownList").value(-1);
		$("#rep_dateOption").data("kendoDropDownList").value(-1);
		$("#rep_dateOptionFrom").data("kendoDatePicker").value(null);
		$("#rep_dateOptionFrom").data("kendoDatePicker").enable(false);
		$("#rep_dateOptionFromTBA")[0].checked = false;
		$("#rep_dateOptionTo").data("kendoDatePicker").value(null);
		$("#rep_dateOptionTo").data("kendoDatePicker").enable(false);
		$("#rep_dateOptionToTBA")[0].checked = false;
		$("#rep_legalConfirmationStatus").data("kendoDropDownList").value(-1);
		$("#rep_productInformationCode").data("kendoDropDownList").value(-1);		
		$("#rep_subrightsSalesAndMarketing").data("kendoHierarchySelector").clear();
		$("#rep_doNotLicense").data("kendoDropDownList").value(-1);
		$("#rep_futureMedia").data("kendoDropDownList").value(-2);
		$("#rep_contractualPartyType").data("kendoHierarchySelector").clear();
		$("#rep_contractualParty").data("kendoComboBox").value(-1);
		$("#rep_foxEntity").data("kendoComboBox").value(-1);
		$("#rep_contacts").data("kendoHierarchySelector").clear();
		$("#rep_methodOfTransmission").data("kendoHierarchySelector").clear();
		setValidDateFromat("rep_dateOptionFrom");
		setValidDateFromat("rep_dateOptionTo");
		setValidDateFromat("rep_fromTimePeriod");
		setValidDateFromat("rep_toTimePeriod");
		
		changeDateOptionDataSource(this, 'LEGAL');
		
		
		if(this.queryViewModel.get("reportId") == this.reportIndexes.PRODUCT_INQUIRY_REPORT){
			//$("#rep_rightCheckBusiness")[0].checked = false;
			//$("#rep_rightCheckLegal")[0].checked = true;
			//$(".methodOfTransmissionClass").show();
			//this.enableMethodOfTransmission();
			$("#rep_rightCheckLegal").click();			
		}
		else {
			$("#rep_rightCheckBusiness").click();
			//$("#rep_rightCheckBusiness")[0].checked = true;
			//$("#rep_rightCheckLegal")[0].checked = false;
		}
		this.setProductInquiryDefaultDateOption();
	};
	
	/**
	 * 
	 */
	this.openSaveQueryWindow = function(){
		this.populateSavedQueryPopupFromSavedQueries(this.queryViewModel.get("queryId"));
		var d = $("#rep_saveReportPopupWindow").data("kendoWindow");
		d.setOptions({
			modal : true,
			visible : true
		});
		d.center();
		d.open();
	};
	
	/**
	 * 
	 */
	this.openSearchQueryWindow = function(reportId){
		
		$("#rep_searchResultInformation").hide();
		var d = $("#rep_searchReportPopupWindow").data("kendoWindow");
		d.setOptions({
			modal : true,
			visible : true
		});
		d.center();
		d.open();
	};
	
	/**
	 * 
	 */
	this.closeSearchQueryWindow = function(){
		$("#rep_searchReportPopupWindow").data("kendoWindow").close();
		this.savedQuerySearchResult = null;
	};
	
	this.processReport = function(){
		var url = this.rep_path.getSaveQueryRESTPath();
		var txt = this.rep_savingReportSuccessText;
		if(this.processFlag == this.processFlagArray.UPDATE){
			url = this.rep_path.getSavedQueryUpdateRESTPath();
			txt = this.rep_updatingReportSuccessText;
		}
		if(this.queryViewModel.get("reportId") == this.reportIndexes.RIGHTS_AS_ENTERED_REPORT){
			this.processRightsAsEnteredReport(url, txt);
		}
		else if(this.queryViewModel.get("reportId") == this.reportIndexes.AVAILS_REPORT){
			this.processAvailsReport(url, txt);
		}
		else if(this.queryViewModel.get("reportId") == this.reportIndexes.PRODUCT_INQUIRY_REPORT){
			this.processRightsInquiryReport(url, txt);
		}
	};
	
	/**
	 * 
	 */
	this.runReport = function(){
		var url = this.rep_path.getRunQueryRESTPath();
		
		console.log("url: " + url);
		
		if(this.queryViewModel.get("reportId") == this.reportIndexes.RIGHTS_AS_ENTERED_REPORT){
			this.processRightsAsEnteredReport(url, this.rep_runningReportSuccessText);
		}
		else if(this.queryViewModel.get("reportId") == this.reportIndexes.AVAILS_REPORT){
			this.processAvailsReport(url, this.rep_runningReportSuccessText);
		}
		else if(this.queryViewModel.get("reportId") == this.reportIndexes.PRODUCT_INQUIRY_REPORT){
			this.processRightsInquiryReport(url, this.rep_runningReportSuccessText);
		}
		
	};
	
	/**
	 * Takes a QueryParameterWrapper
	 */
	this.processTimePeriod = function(qpw){
		
		var rep_timePeriod = null;
		var rep_timePeriodText = null;
		var rep_tp = $("#rep_timePeriodAnytime")[0].checked;
		if(rep_tp){
			rep_timePeriod = 'W';
			rep_timePeriodText = "Anytime during the time period";
		}
		else {
			rep_tp = $("#rep_timePeriodThroughout")[0].checked;
			if(rep_tp){
				rep_timePeriod = 'T';
				rep_timePeriodText = "Throughout the entire time period";
			}
		}
		
		var rep_fromTimePeriod = $("#rep_fromTimePeriod").data("kendoDatePicker").value();
		var rep_toTimePeriod = $("#rep_toTimePeriod").data("kendoDatePicker").value();
		var rep_fromIncludeTBA = $("#rep_fromIncludeTBA")[0].checked ? "1" : null; 
		var rep_toIncludeTBA = $("#rep_toIncludeTBA")[0].checked ? "1" : null; 
		
		if(rep_timePeriod && rep_timePeriod.trim().length > 0){
			var tp = new QueryParameter();
			tp.name = "WithinThroughoutFlag";
			tp.value = rep_timePeriod;
			tp.text = rep_timePeriodText;
			tp.queryId = this.queryViewModel.get("queryId");
			qpw.queryParametersList.push(tp);
		}
		
		if(rep_fromTimePeriod){
			var rftp = new QueryParameter();
			rftp.name = "FromDate";			
			rftp.value = this.getFormattedDate(rep_fromTimePeriod);
			rftp.text = this.getFormattedDate(rep_fromTimePeriod);;
			rftp.queryId = this.queryViewModel.get("queryId");
			qpw.queryParametersList.push(rftp);
		}
		
		if(rep_toTimePeriod){
			var rttp = new QueryParameter();
			rttp.name = "ToDate";
			rttp.value = this.getFormattedDate(rep_toTimePeriod);
			rttp.text = this.getFormattedDate(rep_toTimePeriod);
			rttp.queryId = this.queryViewModel.get("queryId");
			qpw.queryParametersList.push(rttp);
		}
		
		if(rep_fromIncludeTBA && rep_fromIncludeTBA.trim().length > 0){
			var rfTBA = new QueryParameter();
			rfTBA.name = "FromDateInclTBA";
			rfTBA.value = rep_fromIncludeTBA;
			rfTBA.text = "Include TBA";
			rfTBA.queryId = this.queryViewModel.get("queryId");
			qpw.queryParametersList.push(rfTBA);
		}
		
		if(rep_toIncludeTBA && rep_toIncludeTBA.trim().length > 0){
			var rtTBA = new QueryParameter();
			rtTBA.name = "ToDateInclTBA";
			rtTBA.value = rep_toIncludeTBA;
			rtTBA.text = "Include TBA";
			rtTBA.queryId = this.queryViewModel.get("queryId");
			qpw.queryParametersList.push(rtTBA);
		} 
	};
	
	
	/**
	 * 
	 */
	this.processRightsAsEnteredReport = function(url, successTxt){
		var qpw = this.processCommonElements();
		this.processTimePeriod(qpw);
		this.processMTL(qpw);
		
		var queryObject = qpw.getObjectForJSON();
		this.submitReport(queryObject, url, successTxt);
	};
	
	/**
	 * PROCESSING AVAILS REPORT
	 */
	this.processAvailsReport = function(url, successText){
		
		var qpw = this.processCommonElements();
		this.processSelectedInfoCodes(qpw);
		this.processTimePeriod(qpw);
		
		if(this.processFlag == this.processFlagArray.RUN){
			this.processRightsGroupForRunning(qpw);
		}
		else {
			this.processRightsGroupForSaving(qpw);
		}
		
		var queryObject = qpw.getObjectForJSON();
		this.submitReport(queryObject, url, successText);
	};
	
	/**
	 * 
	 */
	this.processRightsGroupForSaving = function(qpw){
		var that = this;
		if(this.rep_rightsGroupSource && this.rep_rightsGroupSource.length > 0){
			$.each(this.rep_rightsGroupSource, function(id, elem){
				that.addGroupToParameterList(qpw, elem);
			});
		}
	};
	
	/**
	 * 
	 */
	this.processRightsGroupForRunning = function(qpw){
		var that = this;
		var ids = this.getSelectedRightsGroupIds();
		if(ids.length > 0){
			if(this.rep_rightsGroupSource && this.rep_rightsGroupSource.length > 0){
				$.each(this.rep_rightsGroupSource, function(id, elem){
					if(ids.indexOf(elem.groupId) > -1){
						that.addGroupToParameterList(qpw, elem);
					}					
				});
			}
		}
		else {
			if(this.rep_rightsGroupSource && this.rep_rightsGroupSource.length > 0){
				$.each(this.rep_rightsGroupSource, function(id, elem){					
					that.addGroupToParameterList(qpw, elem);										
				});
			}
		}
	};
	
	/**
	 * 
	 */
	this.addGroupToParameterList = function(qpw, group){
		var that = this;
		var qp0 = new QueryParameter();
		qp0.name = "Media";
		qp0.queryId = that.queryViewModel.get("queryId");
		qp0.value = "";
		qp0.text = "";
		qp0.partId = group.groupId;
		for(var i = 0; i < group.media.length; i++){
			if(i < (group.media.length - 1)){
				qp0.value += group.media[i].value+",";
				qp0.text += group.media[i].text+",";
			}
			else {
				qp0.value += group.media[i].value;
				qp0.text += group.media[i].text;
			}
		}
		qpw.queryParametersList.push(qp0);
		
		var qp1 = new QueryParameter();
		qp1.name = "Territory";
		qp1.queryId = that.queryViewModel.get("queryId");
		qp1.value = "";
		qp1.text = "";
		qp1.partId = group.groupId;
		for(var i = 0; i < group.territories.length; i++){
			if(i < (group.territories.length - 1)){
				qp1.value += group.territories[i].value+",";
				qp1.text += group.territories[i].text+",";
			}
			else {
				qp1.value += group.territories[i].value;
				qp1.text += group.territories[i].text;
			}
		}
		qpw.queryParametersList.push(qp1);
		
		var qp2 = new QueryParameter();
		qp2.name = "Language";
		qp2.queryId = that.queryViewModel.get("queryId");
		qp2.value = "";
		qp2.text = "";
		qp2.partId = group.groupId;
		for(var i = 0; i < group.languages.length; i++){
			if(i < (group.languages.length - 1)){
				qp2.value += group.languages[i].value+",";
				qp2.text += group.languages[i].text+",";
			}
			else {
				qp2.value += group.languages[i].value;
				qp2.text += group.languages[i].text;
			}
		}
		qpw.queryParametersList.push(qp2);
	};
	
	/**
	 * 
	 */
	this.getSelectedRightsGroupIds = function(){
		
		var grid = $("#rep_rightsPanelGrid").data("kendoGrid");
		var rows = grid.tbody.find("tr");
		var mark = "rep_checkboxRights_";
		var ids = new Array();
		$.each(rows, function(id, elem){
			var idString = $(elem).find("td:first input").attr("id");
			var id = idString.substring(idString.indexOf(mark)+mark.length);
			if($("#"+idString).attr('checked')){
				
				ids.push(new Number(id).valueOf());
			}
		});
		return ids;
	};
	
	/**
	 * 
	 */
	this.saveQueryProcess = function(){
		this.processReport();
	};
	
	/**
	 * 
	 */
	this.addToRightsGroup = function(that){
		var selectedMedia = $("#rep_mediaSelector").data("kendoHierarchySelector").getDataItemsFromDS($("#rep_mediaSelector").data("kendoHierarchySelector").getAccumulated());
		var selectedTerritory = $("#rep_territorySelector").data("kendoHierarchySelector").getDataItemsFromDS($("#rep_territorySelector").data("kendoHierarchySelector").getAccumulated());
		var selectedLanguages = $("#rep_languageSelector").data("kendoHierarchySelector").getDataItemsFromDS($("#rep_languageSelector").data("kendoHierarchySelector").getAccumulated());
		
		var group = new RightGroup();
		
		if(selectedMedia && selectedMedia.length > 0 && selectedTerritory && selectedTerritory.length > 0 && selectedLanguages && selectedLanguages.length > 0){
			$.each(selectedMedia, function(id, elem){
				var qp = new QueryParameter();
				qp.name = "MediaPAN";
				qp.value = elem.id;
				qp.text = elem.text;
				qp.queryId = that.queryViewModel.get("queryId");
				
				group.media.push(qp);
			});
			
			$.each(selectedTerritory, function(id, elem){
				var qp = new QueryParameter();
				qp.name = "TerritoryPAN";
				qp.value = elem.id;
				qp.text = elem.text;
				qp.queryId = that.queryViewModel.get("queryId");
				
				group.territories.push(qp);
			});
			
			$.each(selectedLanguages, function(id, elem){
				var qp = new QueryParameter();
				qp.name = "LanguagePAN";
				qp.value = elem.id;
				qp.text = elem.text;
				qp.queryId = that.queryViewModel.get("queryId");
				
				group.languages.push(qp);
			});
			
			if(!this.checkForDuplicateRightsGroup(group)){
				group.groupId = that.getMaxRightGroupId() + 1;
				that.rep_rightsGroupSource.push(group);
				
				that.buildRightGroupView();
				
				$("#rep_mediaSelector").data("kendoHierarchySelector").clear();
				$("#rep_territorySelector").data("kendoHierarchySelector").clear();
				$("#rep_languageSelector").data("kendoHierarchySelector").clear();
				
				$("#rep_mediaSelector").data("kendoHierarchySelector").populateSelectorAlt();
				$("#rep_territorySelector").data("kendoHierarchySelector").populateSelectorAlt();
				$("#rep_languageSelector").data("kendoHierarchySelector").populateSelectorAlt();
			}
			else {
				var st = " The chosen MTL combination is a duplicate of an already existing MTL combination";
				errorPopup.showErrorPopupWindow(st);				
			}
			
		}
		else {
			errorPopup.showErrorPopupWindow("One or more of the following fields: Media, Territory, Language do not have a valid selection");
		}
		var allCheckbox = $(".selectAllRightsGroupClass");
		if(allCheckbox){
			$.each(allCheckbox, function(id, elem){
				elem.checked = false;
			});
		}
		that.enableDisableRightsGroupDeleteButton();
		that.enableDisableAddRightsGroup();
	};
	
	/**
	 * 
	 */
	this.enableDisableRightsGroupDeleteButton = function(){
		if(this.rep_rightsGroupSource && this.rep_rightsGroupSource.length > 0){
			$("#rep_removeFromRightsGroup").attr('disabled', false);
		}
		else {
			$("#rep_removeFromRightsGroup").attr('disabled', true);
			var allCheckbox = $(".selectAllRightsGroupClass");
			if(allCheckbox){
				$.each(allCheckbox, function(id, elem){
					elem.checked = false;
				});
			}
		}
		
	};
	
	/**
	 * 
	 */
	this.checkForDuplicateRightsGroup = function(rightGroup){
		for(var i = 0; i < this.rep_rightsGroupSource.length; i++){
			if(this.rep_rightsGroupSource[i].equals(rightGroup)){
				return true;
			}
		}
		return false;
	};
	
	/**
	 * 
	 */
	this.getMaxRightGroupId = function(){
		if(this.rep_rightsGroupSource && this.rep_rightsGroupSource.length > 0){
			var maxId = 0;
			$.each(this.rep_rightsGroupSource, function(id, elem){
				var groupId = elem.groupId;
				if(groupId > maxId){
					maxId = groupId;
				}
			});
			return maxId;
		}
		else {
			return 0;
		}
	};
	
	/**
	 * 
	 */
	this.deleteRightGroup = function(that){
		
		var grid = $("#rep_rightsPanelGrid").data("kendoGrid");
		var items = grid.dataSource.data();
		if(items && items.length > 0){
			var rows = grid.tbody.find("tr");
			var mark = "rep_checkboxRights_";
			var ids = new Array();
			$.each(rows, function(id, elem){
				var idString = $(elem).find("td:first input").attr("id");
				var id = idString.substring(idString.indexOf(mark)+mark.length);
				if($("#"+idString).attr('checked')){
					
					ids.push(new Number(id).valueOf());
				}
			});
			
			var rowsArray = new Array();
			if(ids.length > 0){
				$.each(items, function(id, elem){
					if(ids.indexOf(elem.id) > -1){
						rowsArray.push(elem);
					}
				});
				
				if(rowsArray.length > 0){
					$.each(rowsArray, function(id, elem){
						if($.inArray(elem, items) > -1){
							items.splice($.inArray(elem, items), 1);
						}
					});
				}
				
				var groupArray = new Array();
				$.each(this.rep_rightsGroupSource, function(id, elem){
					if(ids.indexOf(elem.groupId) > -1){
						groupArray.push(elem);
					}
				});
				
				if(groupArray.length > 0){
					$.each(groupArray, function(id, elem){
						for(var i = 0; i < that.rep_rightsGroupSource.length; i++){
							if(that.rep_rightsGroupSource[i].groupId == elem.groupId){
								that.rep_rightsGroupSource.splice(i, 1);
								break;
							}
						}				
					});
				}
				
				var dataSource = new kendo.data.DataSource({
					data : items
				});
				$("#rep_rightsPanelGrid").data('kendoGrid').setDataSource(dataSource);
				$("#rep_rightsPanelGrid").data('kendoGrid').refresh();
			}
			else {
				var error = " You must first select a rights group before you can delete";
				errorPopup.showErrorPopupWindow(error);
			}
			
		}
		else {
			var error = " You must first create a rights group before you can delete";
			errorPopup.showErrorPopupWindow(error);
		}
		that.enableDisableRightsGroupDeleteButton();
	};
	
	/**
	 * 
	 */
	this.deleteFromProductSearch = function(){
		$("#rep_deleteSearchResultIcon").show();
		var data = $("#rep_searchProductResultGrid").data("kendoGrid").dataSource.data();
		var l = data.length;
		var i = 0;
		var deleteMethod = function(){
			$("#rep_deletingFont").html(i);
			setTimeout(function(){					
				if(i < (l - 1)){
					deleteMethod();
				}
			}, 100);
		};
		deleteMethod();
		
		setTimeout(function(){
			var dataSourceArrayClone = new Array();
			var tobeDeleted = new Array();
			var checkboxes = $(".check_search_product_row");
			var param = "rep_checkbox_";
			if(checkboxes){
				$.each(checkboxes, function(id, elem){
					if(elem.checked){
						var foxVersionId = elem.id.substring(elem.id.indexOf(param) + param.length);
						tobeDeleted.push(foxVersionId);
					}
				});
			}
						
			
			if(tobeDeleted.length > 0){
				
				for(i = 0; i < l; i++){
					var elem = data[i];
					var obj = new Object();
					obj.rep_rights = elem.rep_rights;					
					obj.rep_rightsTitle = elem.rep_rightsTitle;
					obj.rep_title = elem.rep_title;
					obj.rep_wprId = elem.rep_wprId;
					obj.rep_type = elem.rep_type;
					obj.rep_productionYear = elem.rep_productionYear;
					obj.rep_productionCompany = elem.rep_productionCompany;
					obj.rep_firstReleaseDate = elem.rep_firstReleaseDate;
					obj.foxVersionId = elem.foxVersionId;
					obj.rep_checkboxValue = elem.rep_checkboxValue;
					dataSourceArrayClone.push(obj);
				}
								
				$.each(tobeDeleted, function(id, element){
					for(var k = 0; k < dataSourceArrayClone.length; k++){
						if(element == dataSourceArrayClone[k].foxVersionId){
							dataSourceArrayClone.splice(k, 1);
							break;
						}
					}
				});				
			}
			var dataSource = new kendo.data.DataSource({
				data : dataSourceArrayClone
			});
			
			$("#rep_selectAllSearchProductResults").unbind();
			$("#rep_selectAllSearchProductResults").click(function(e){
				searchProductAllbound(e, this);
			});
			$("#rep_searchProductResultGrid").data('kendoGrid').setDataSource(dataSource);
			$("#rep_searchProductResultGrid").data("kendoGrid").dataSource.read();
			$(".check_search_product_row").unbind();
			$(".check_search_product_row").click(function(){
				searchProductCheckboxEvent(this);
			});
			$("#rep_searchProductCount").html("Number of products included : "+dataSourceArrayClone.length);
			$("#rep_deleteSearchResultIcon").hide();
		}, 50);
		
	};
	
	/**
	 * 
	 */
	this.buildRightGroupView = function(){
		if(this.rep_rightsGroupSource && this.rep_rightsGroupSource.length > 0){
			var dataArray = new Array();
			$.each(this.rep_rightsGroupSource, function(id, elem){
				var ob = new Object();
				ob.id = elem.groupId;
				ob.rep_rightsGroupId = elem.groupId;
				ob.rep_Media = elem.getMediaEntry();
				ob.rep_territory = elem.getTerritoryEntry();
				ob.rep_language = elem.getLanguageEntry();
				ob.rep_action = "";
				ob.rep_checkboxRightsValue = false;
				dataArray.push(ob);				
			});
			if(dataArray.length > 0){
				var dataSource = new kendo.data.DataSource({
					data : dataArray
				});
				$("#rep_rightsPanelGrid").data('kendoGrid').setDataSource(dataSource);
				$("#rep_rightsPanelGrid").data('kendoGrid').refresh();
			}
			$("#rep_removeFromRightsGroup").attr('disabled', false);
		}
	};
	
	/**
	 * VALIDATE REPORT
	 */
	this.validateReport = function(){
		
		if(this.queryViewModel.get("reportId") == this.reportIndexes.RIGHTS_AS_ENTERED_REPORT){
			return this.validateRightsAsEntered();
		}
		else if(this.queryViewModel.get("reportId") == this.reportIndexes.AVAILS_REPORT){
			return this.validateAvailsReport();
		}
		else if(this.queryViewModel.get("reportId") == this.reportIndexes.PRODUCT_INQUIRY_REPORT){
			if(this.productRightsInquiryReportMOTCheck()){
				return true;
			}
			else {
				return this.validateRightsInquiryReport();
			}			
		}
	};
	
	/**
	 * 
	 */
	this.validateTimePeriod = function(){
		var rep_tp = $("#rep_timePeriodThroughout")[0].checked;
		if(rep_tp){
			if(!$("#rep_fromTimePeriod").data("kendoDatePicker").value() || !$("#rep_toTimePeriod").data("kendoDatePicker").value()){
				var st = " Since you selected the 'Throughout the entire time period' radio button, you must enter a start and end time period ";
				errorPopup.showErrorPopupWindow(st);
				return false;
			}
		}
		return true;
	};
	
	
	
	/**
	 *  VALIDATION FOR THE RIGHTS AS ENTERED REPORT
	 */
	this.validateRightsAsEntered = function(){
		
		var selectedTerritory = $("#rep_territorySelector").data("kendoHierarchySelector").getAccumulated();
		var items = $("#rep_searchProductResultGrid").data("kendoGrid").dataSource.data();
		var error = this.validateDates();
		if(error){
			errorPopup.showErrorPopupWindow(error);
			return false;
		}
		error = "You must select at least one territory or one product";
		var productCheck = false;
		if(items && items.length > 0){
			productCheck = true;
		}
		var b = ((selectedTerritory && selectedTerritory.length > 0) || productCheck);
		
		if(selectedTerritory && selectedTerritory.length > 0){
			for(var i = 0; i < selectedTerritory.length ; i++){
				if(this.worldwideTerritoryId != null && selectedTerritory[i] == this.worldwideTerritoryId && !productCheck){
					error = "Since you selected Worldwide as a territory you must also select a product.";	
					b = false;
					break;
				}
			}
		}
		
		
		if(!b && error != null){
			errorPopup.showErrorPopupWindow(error);
			return false;
		}
		else {
			return true; 
		}
	};
	
	/**
	 *  VALIDATION FOR THE AVAILS REPORT
	 */
	this.validateAvailsReport = function(){
		var error = "";
		error = this.validateDates();
		if(error){
			errorPopup.showErrorPopupWindow(error);
			return false;
		}
		if(this.rep_rightsGroupSource.length <= 0){
			error = "You must create a rights group. Select a combination of media, territory and language, then click the 'Add Rights Group' button";
		}
		else {
			error = null;
			for(var i = 0; i < this.rep_rightsGroupSource.length; i++){				
				var group = this.rep_rightsGroupSource[i];
				error = this.validateGroup(group);
				if(error != null){
					break;
				}
				
			}
		}
		if(error != null){
			errorPopup.showErrorPopupWindow(error);
			return false;
		}
		else {
			return true; 
		}
	};
	
	/**
	 * Used for validating and running a query without saving it first
	 */
	this.validateAndSubmitReport = function(){
		if(this.queryViewModel.get("reportId") == this.reportIndexes.AVAILS_REPORT){
			return this.validateAvailsForRun();
		}
		else if(this.queryViewModel.get("reportId") == this.reportIndexes.PRODUCT_INQUIRY_REPORT){
			if(this.productRightsInquiryReportMOTCheck()){
				return true;
			}
			else {
				return this.validateRightsInquiryReport();
			}			
		}
		else if(this.queryViewModel.get("reportId") == this.reportIndexes.RIGHTS_AS_ENTERED_REPORT){
			return this.validateRightsAsEntered();
		}
		
	};
	
	/**
	 * 
	 */
	this.validateAvailsForRun = function(){		
		var items = $("#rep_rightsPanelGrid").data("kendoGrid").dataSource.data();
		var error = this.validateDates();
		if(error){
			errorPopup.showErrorPopupWindow(error);
			return false;
		}
		if(items.length > 0){
			return true;
		}
		else {
			errorPopup.showErrorPopupWindow("You must create at least one Rights Group before running a DRC:Product Details Report");
			return false;
		}		
	};
	
	/**
	 * 
	 */
	this.validateGroup = function(group){
		if(!group){
			return "Invalid group detected,please re-enter";
		}
		else {
			var error = null;
			if(!group.media || group.media.length <= 0){
				error = " Rights Group with id : "+group.id+" is missing the media field please delete the group and re-enter a new group.";
			}
			else if(!group.territories || group.territories.length <= 0){
				error = " Rights Group with id : "+group.id+" is missing the territory field please delete the group and re-enter a new group.";
			}
			else if(!group.languages || group.languages.length <= 0){
				error = " Rights Group with id : "+group.id+" is missing the language field please delete the group and re-enter a new group.";
			}
			
			return error;
		}
	};
	
	/**
	 * 
	 */
	this.validateQueryName = function(){
		
		var queryName = $("#rep_queryName").val();
		if(queryName == null || queryName.trim().length < 1){
			errorPopup.showErrorPopupWindow("You must enter a query name");
		}
		else {
			var reportScope = angular.element(document.getElementById("reportController")).scope();
			var userSavedQueries = reportScope.reportData.savedReportQueries;
			var bool = true;
			for(var i = 0; i < userSavedQueries.length; i++){
				if(userSavedQueries[i].name && queryName.trim().toLowerCase() == userSavedQueries[i].name.toLowerCase()){
					bool = false;
					break;
				}
			}
			if(!bool){
				errorPopup.showErrorPopupWindow("A saved query with the name '"+queryName+"' already exists in your saved queries, please choose a different name");
			}
			else {
				this.saveQueryProcess();
			}
			
		}
	};
	
	/**
	 * 
	 */
	this.validateQueryNameForUpdate = function(){
		
		var queryName = $("#rep_queryName").val();
		if(queryName == null || queryName.trim().length < 1){
			errorPopup.showErrorPopupWindow("You must enter a query name");
		}
		else {
			var reportScope = angular.element(document.getElementById("reportController")).scope();
			var userSavedQueries = reportScope.reportData.savedReportQueries;
			var bool = true;
			var currentQueryId = this.queryViewModel.get("queryId");
			for(var i = 0; i < userSavedQueries.length; i++){
				if(userSavedQueries[i].name && queryName.trim().toLowerCase() == userSavedQueries[i].name.toLowerCase() && userSavedQueries[i].id != currentQueryId){
					bool = false;
					break;
				}
			}
			if(!bool){
				errorPopup.showErrorPopupWindow("A saved query with the name '"+queryName+"' already exists in your saved queries, please choose a different name");
			}
			else {
				this.saveQueryProcess();
			}
			
		}
	};
	
	/**
	 * 
	 */
	this.validateDates = function(){
		var error = null;
		var check = false;
		var timePeriodFromDate = getCorrectDateFromKendoDatePicker("rep_fromTimePeriod");
		if(timePeriodFromDate){
			check = checkValidDateFormat($("#rep_fromTimePeriod").val(), "rep_fromTimePeriod");
			if(!check){
				error = " Invalid Time Period 'From' date, either remove the date or enter a valid date";
			}
			else {
				setValidDateFromat("rep_fromTimePeriod");
			}
		}
		else {
			setValidDateFromat("rep_fromTimePeriod");
		}
		var timePeriodToDate = getCorrectDateFromKendoDatePicker("rep_toTimePeriod");
		if(timePeriodToDate){
			check = checkValidDateFormat($("#rep_toTimePeriod").val(), "rep_toTimePeriod");
			if(!check){
				error = " Invalid Time Period 'To' date, either remove the date or enter a valid date";
			}
			else {
				setValidDateFromat("rep_toTimePeriod");
			}
		}
		else {
			setValidDateFromat("rep_toTimePeriod");
		}
		
		var dateOptionFormDate = getCorrectDateFromKendoDatePicker("rep_dateOptionFrom");
		if(dateOptionFormDate){
			check = checkValidDateFormat($("#rep_dateOptionFrom").val(), "rep_dateOptionFrom");
			if(!check){
				error = " Invalid Date Option 'From' date, either remove the date or enter a valid date";
			}
			else {
				setValidDateFromat("rep_dateOptionFrom");
			}
		}
		else {
			setValidDateFromat("rep_dateOptionFrom");
		}
		
		var dateOptionToDate = getCorrectDateFromKendoDatePicker("rep_dateOptionTo");
		if(dateOptionToDate){
			check = checkValidDateFormat($("#rep_dateOptionTo").val(), "rep_dateOptionTo");
			if(!check){
				error = " Invalid Date Option 'To' date, either remove the date or enter a valid date";
			}
			else {
				setValidDateFromat("rep_dateOptionTo");
			}
		}
		else {
			setValidDateFromat("rep_dateOptionTo");
		}
		
		if(this.queryViewModel.get("reportId") == this.reportIndexes.PRODUCT_INQUIRY_REPORT){
			var dateOption = $("#rep_dateOption").data("kendoDropDownList").value();
			var dateFrom = ($("#rep_dateOptionFrom").val() == null) || ($("#rep_dateOptionFrom").val() == '');
			var dateTo = ($("#rep_dateOptionTo").val() == null) || ($("#rep_dateOptionTo").val() == '');
			if(dateOption == 4 || dateOption == 5){
				var infoCodeAdd = $("#rep_infoCodeSelector").data("kendoInfoCodeSelector").getAccumulatedAdd();
				var infoCodeRemove = $("#rep_infoCodeSelector").data("kendoInfoCodeSelector").getAccumulatedRemove();
				if(infoCodeAdd.length <= 0 && infoCodeRemove.length <=  0){
					
					if(dateOption == 4){
						error = " Since you selected the date option 'Info Code Start Date' you must select some info codes.";
					}
					else if(dateOption == 5){
						error = " Since you selected the date option 'Info Code End Date' you must select some info codes.";
					}
				}
				else if(dateFrom && dateTo){
					if(dateOption == 4){
						error = " Since you selected the date option 'Info Code Start Date' you must select a 'From' date and/or a 'To' date.";
					}
					else if(dateOption == 5){
						error = " Since you selected the date option 'Info Code End Date' you must select a 'From' date and/or a 'To' date.";
					}
				}
			}
			/* BUG 25095 else if(dateOption > 0 &&  dateFrom && dateTo){
				error = " Since you selected a date option, you must enter either a 'From' date or a 'To' date";
			} BUG 25095*/
		}
		
		return error;
	};
	
	/**
	 * 
	 */
	this.submitReport = function(report, url, successTxt){
		var that = this;
		var reportJson = JSON.stringify(report);
		that.showSubmitPopupWindow();
		
		console.log("submitReport url: " + url);
		
		$.post(url, {q:reportJson}, function(data){
			
			console.log("data.reportURL: %o ", data.reportURL);
			console.log("data.queryId: %o ", data.queryId);
			console.log("data.userName: %o", data.userName);
			console.log("data.reportNameFormat: %o", data.reportNameFormat);
			console.log("data.reportNameStr: %o", data.reportNameStr);
			console.log("data.reportNameType: %o", data.reportNameType);
			console.log("REPORTJSON: %o ", reportJson);
			
			
			
			that.closeSubmitPopupWindow();
			that.closeSaveQueryWindow();
			var reportScope = angular.element(document.getElementById("reportController")).scope();
			if(that.processFlag == that.processFlagArray.RUN){
				that.openReportDisplayWindow(data.reportURL);
				that.populateRecentQueries(that.queryViewModel.get("queryId"));				
				reportScope.$apply();
				
				//TFS #13567 ERM/MS reports integration
				that.dynamicReport(data);
			}
			else if(that.processFlag == that.processFlagArray.UPDATE){
				reportScope.loadReports();
				reportScope.$apply();				
				setTimeout(function(){
					that.rebuildSearchSavedQueryGrid(reportScope.reportData.savedReportQueries);
					that.populateRecentQueries(that.queryViewModel.get("queryId"));				
					reportScope.$apply();
				}, 1000);
				that.successfullSubmitObject = new Object();
				that.successfullSubmitObject.data = data;
				that.successfullSubmitObject.processFlag = that.processFlag;
				that.successfullSubmitObject.queryId = that.queryViewModel.get("queryId");

				that.successfullSubmitObject.reportTypeFormat = that.queryViewModel.get("reportTypeFormat");
				
				console.log("reportTypeFormat: " + that.successfullSubmitObject.reportTypeFormat);
				console.log("queryId: " + that.successfullSubmitObject.queryId);
				
				successPopup.showSuccessWithCallbackPopupWindow(successTxt, rep_reportManagementObject);
				
			}
			else{				
				reportScope.loadReports();
				reportScope.$apply();
				that.successfullSubmitObject = new Object();
				that.successfullSubmitObject.data = data;
				that.successfullSubmitObject.processFlag = that.processFlag;
				that.successfullSubmitObject.queryId = that.queryViewModel.get("queryId");

				that.successfullSubmitObject.reportTypeFormat = that.queryViewModel.get("reportTypeFormat");
				
				console.log("reportTypeFormat: " + that.successfullSubmitObject.reportTypeFormat);
				console.log("queryId: " + that.successfullSubmitObject.queryId);
				
				successPopup.showSuccessWithCallbackPopupWindow(successTxt, rep_reportManagementObject);
				
				
			}
			
		}).fail(function(xhr,status,message){
			that.closeSubmitPopupWindow();
			errorPopup.showErrorPopupWindow(xhr.responseText);
		});
	};
	
	
	/**
	 * 
	 */
	this.showSubmitPopupWindow = function(){
		var d = $("#rep_submitPopupWindow").data("kendoWindow");
		d.setOptions({
			visible : true,
			modal : true
		});
		d.center();
		d.open();		
	};
	
	/**
	 * 
	 */
	this.showSearchSavedQueriesPopupWindow = function(){
		var d = $("#rep_searchSavedQueriesPopupWindow").data("kendoWindow");
		d.setOptions({
			visible : true,
			modal : true
		});
		d.center();
		d.open();		
	};
	
	/**
	 * 
	 */
	this.closeSubmitPopupWindow = function(){
		$("#rep_submitPopupWindow").data("kendoWindow").close();
	};
	
	this.closeSearchSavedQueriesPopupWindow = function(){
		$("#rep_searchSavedQueriesPopupWindow").data("kendoWindow").close();
	};
	
	/**
	 * 
	 */
	this.getFormattedDate = function(d){
		var months = {
				1 : "Jan",
				2 : "Feb",
				3 : "Mar",
				4 : "Apr",
				5 : "May",
				6 : "Jun",
				7 : "Jul",
				8 : "Aug",
				9 : "Sep",
				10 : "Oct",
				11 : "Nov",
				12 : "Dec"
		};
		if(d){			
			var date = (d.getDate() < 10 ? "0"+d.getDate() : d.getDate())+"-"+months[d.getMonth()+1]+"-"+d.getFullYear();		
			return date;
		}
		else {
			return d;
		}
	};
	
	this.getUnFormattedDate = function(d){
		var months = new Array();
		//months[0] = "";
		months[0] = "Jan";
		months[1] = "Feb";
        months[2] = "Mar";
        months[3] = "Apr";
        months[4] = "May";
        months[5] = "Jun";
        months[6] = "Jul";
		months[7] = "Aug";
		months[8] = "Sep";
		months[9] = "Oct";
		months[10] = "Nov";
		months[11] = "Dec";
		
		if(d.indexOf("-") > -1){
			var ds = d.split("-");
			var dayS = ds[0];
			var monthS = ds[1];
			var yearS = ds[2];
			if(dayS.charAt(0) == '0'){
				dayS = dayS.substring(1);
			}
			
			for(var i = 0; i < months.length; i++){
				if(monthS == months[i]){
					monthS = i;
					break;
				}
			}
			var date =  new Date();
			date.setDate(dayS);
			date.setMonth(monthS);
			date.setFullYear(yearS);
			
			return date;
		}
		return null;
	};
	
	/**
	 * 
	 */
	this.addOpenInternet = function(){
		$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").clearSelected();
		$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").setSelected(oia);
		$("#rep_addInfoCodeAdd").click();
		$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").setSelected(oin);
		$("#rep_addInfoCodeRemove").click();
	};
	
	/**
	 * 
	 */
	this.removeOpenInternet = function(){
		$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").clearSelectedAccumulatorAdd();
		$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").setSelectedAccumulatorAdd(oia);
		$("#rep_removeInfoCodeAdd").click();
		$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").clearSelectedAccumulatorRemove();
		$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").setSelectedAccumulatorRemove(oin);
		$("#rep_removeInfoCodeRemove").click();
	};
	
	/**
	 * 
	 */
	this.addCloseInternet = function(){
		$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").clearSelected();
		$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").setSelected(cia);
		$("#rep_addInfoCodeAdd").click();
		$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").clearSelected();
		$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").setSelected(cin);
		$("#rep_addInfoCodeRemove").click();
		$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").clearSelected();
	};
	
	/**
	 * 
	 */
	this.removeClosedInternet = function(){
		$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").clearSelectedAccumulatorAdd();
		$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").setSelectedAccumulatorAdd(cia);
		$("#rep_removeInfoCodeAdd").click();
		$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").clearSelectedAccumulatorRemove();
		$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").setSelectedAccumulatorRemove(cin);
		$("#rep_removeInfoCodeRemove").click();
	};
	
	/**
	 * 
	 */
	this.loadGroup = function(groupId){
		if(groupId){
			this.resetMTLFields();
			for(var i = 0; i < this.rep_rightsGroupSource.length; i++){
				var group = this.rep_rightsGroupSource[i];
				if(group.groupId == groupId){
					var mediaIds = new Array();
					var territoryIds = new Array();
					var languageIds = new Array();
					
					$.each(group.media, function(id, elem){
						mediaIds.push(elem.value);
					});
					
					$.each(group.territories, function(id, elem){
						territoryIds.push(elem.value);
					});
					
					$.each(group.languages, function(id, elem){
						languageIds.push(elem.value);
					});
					
					$("#rep_mediaSelector").data("kendoHierarchySelector").clear();
					$("#rep_mediaSelector").data("kendoHierarchySelector").setSelected(mediaIds);
					$("#rep_addMedia").click();
					
					$("#rep_territorySelector").data("kendoHierarchySelector").clear();
					$("#rep_territorySelector").data("kendoHierarchySelector").setSelected(territoryIds);
					$("#rep_addTerritory").click();
					
					$("#rep_languageSelector").data("kendoHierarchySelector").clear();
					$("#rep_languageSelector").data("kendoHierarchySelector").setSelected(languageIds);
					$("#rep_addLanguage").click();
				}
			}
		}
		this.enableDisableAddRightsGroup();
	};
	
	/**
	 * 
	 */
	this.populateRecentQueries = function(queryId){
		var reportScope = angular.element(document.getElementById("reportController")).scope();
		var savedQueries = reportScope.reportData.savedReportQueries;
		if(savedQueries && savedQueries.length > 0){
			var savedQuery = null;
			for(var i = 0; i < savedQueries.length; i++){
				var sq = savedQueries[i];
				if(sq.id == queryId){
					savedQuery = sq;
					break;
				}
			}
			
			if(savedQuery && savedQuery.name != null){
				if(!reportScope.reportData.recentReportQueries){
					reportScope.reportData.recentReportQueries = new Array();					
				}
				
				var userRecentQueries = reportScope.reportData.recentReportQueries;
				var index = -1;
				for(var i = 0; i < userRecentQueries.length; i++){
					if(userRecentQueries[i].id == queryId){
						index = i;
						break;
					}
				}
								
				if(index > -1){
					if(this.processFlag == this.processFlagArray.RUN){
						reportScope.reportData.recentReportQueries.splice(index, 1);
						reportScope.reportData.recentReportQueries.unshift(savedQuery);
					}
					else if(this.processFlag == this.processFlagArray.UPDATE){
						reportScope.reportData.recentReportQueries.splice(index, 1, savedQuery);
					}
				}
								
				if(reportScope.reportData.recentReportQueries.length > 5){
					reportScope.reportData.recentReportQueries.pop();
				}												
			}	
		}
	};
	
	/**
	 * 
	 */
	this.setReportTypeFormat = function(){
		var elem = this.queryViewModel.get("reportTypeFormat");
		$("#rep_reportTypeFormat").find("option").each(function(id, element){
			
			if(element.value == 2){
				$(element).hide();			
			}			
			
			if(parseInt(element.value) == elem){
				$(element)[0].selected = true;								
			}
		});
	};
	
	/**
	 * 
	 */
	this.populatePopupWithSavedQuery = function(queryParameterWrapper, bool){
		var b = false;
		var date = null;
		if(queryParameterWrapper){
			if(!b){
				this.showSubmitPopupWindow();
				b = true;
			}
			var that = this;
			var savedQuery = queryParameterWrapper.savedQuery;
			try {
				this.queryViewModel.set("queryId",savedQuery.id);
				this.saveQueryViewModel.queryName = savedQuery.name;
				$("#rep_queryName").val(savedQuery.name);
				this.saveQueryViewModel.personalTag = savedQuery.prsnlTag;
				$("#rep_personalTag").val(savedQuery.prsnlTag);
				this.saveQueryViewModel.commentForQueryToBeSaved = savedQuery.queryComment;
				$("#rep_commentForSaveQuery").val(savedQuery.queryComment);
				this.saveQueryViewModel.publicPrivateStatus = savedQuery.publicFlag;
				if(savedQuery.publicFlag == 'N'){
					$("#rep_publicPrivateStatus")[0].checked = true;
				}
				if(bool){
					$("#rep_reportSearch").data("kendoComboBox").value(this.queryViewModel.get("queryId"));
				}
				else {
					$("#rep_reportSearch").data("kendoComboBox").value(null);
				}
				var queryParametersList = queryParameterWrapper.queryParametersList;
				var productParametersList = queryParameterWrapper.productParametersList;
				
				var queryParameterPartArray = new Array();
				
				
				if(queryParametersList && queryParametersList.length > 0){
					
					$.each(queryParametersList, function(id, elem){
						
						var name = elem.name;
						
						if(name == 'ReportFormat'){
							
							$("#rep_reportTypeFormat").find("option").each(function(id, element){
								if(parseInt(element.value) == elem.value){
									that.queryViewModel.set("reportTypeFormat", parseInt(element.value));								
								}
							});
							
						}
						
						if(name == 'RightsCheckType'){
							var value = elem.value;
							if(value == 'BUSINESS'){
								$("#rep_rightCheckBusiness")[0].checked = true;
							}
							else if(value == 'LEGAL'){
								$("#rep_rightCheckLegal")[0].checked = true;
							}
							else if(value == 'BOTH'){
								$("#rep_rightCheckBoth")[0].checked = true;
							}
						}
						
						if(name == 'ProductType'){
							var productCodes = elem.value;
							var pc = new Array();
							if(productCodes){
								if(productCodes.indexOf(",") > -1){
									pc = productCodes.split(",");
								}
								else {
									pc = [productCodes];
								}
								
								var ids = new Array();
								var productData = $("#rep_productType").data("kendoHierarchySelector").getAllDataItemsFromDS();
								$.each(productData, function(id, elem){
									for(var i = 0; i < pc.length; i++){
										if(elem.code == pc[i]){
											ids.push(elem.id);
											break;
										}
									}
								});
								
								if(ids.length > 0){
									$("#rep_productType").data("kendoHierarchySelector").setSelected(ids);
								}
							}
						}
						
						if(that.queryViewModel.get("reportId") == that.reportIndexes.RIGHTS_AS_ENTERED_REPORT || that.queryViewModel.get("reportId") == that.reportIndexes.PRODUCT_INQUIRY_REPORT){
							
							if(name == 'MediaPAN' || name == 'Media'){
								if(elem.value){
									var mediaIds = elem.value.split(",");
									var m = new Array();
									$.each(mediaIds, function(id, e){
										m.push(parseInt(e));
									});
									$("#rep_mediaSelector").data("kendoHierarchySelector").clear();
									$("#rep_mediaSelector").data("kendoHierarchySelector").setSelected(m);
									$("#rep_addMedia").click();
								}					
							}
							
							if(name == 'TerritoryPAN' || name == 'Territory'){
								if(elem.value){
									var territoryIds = elem.value.split(",");
									var m = new Array();
									$.each(territoryIds, function(id, e){
										m.push(parseInt(e));
									});
									$("#rep_territorySelector").data("kendoHierarchySelector").clear();
									$("#rep_territorySelector").data("kendoHierarchySelector").setSelected(m);
									$("#rep_addTerritory").click();
								}					
							}
							
							if(name == 'LanguagePAN' || name == 'Language'){
								if(elem.value){
									var languageIds = elem.value.split(",");
									var m = new Array();
									$.each(languageIds, function(id, e){
										m.push(parseInt(e));
									});
									$("#rep_languageSelector").data("kendoHierarchySelector").clear();
									$("#rep_languageSelector").data("kendoHierarchySelector").setSelected(m);
									$("#rep_addLanguage").click();
								}					
							}
						}
						else if(that.queryViewModel.get("reportId") == that.reportIndexes.AVAILS_REPORT){
							if(name == 'LanguagePAN' || name == 'Language' || name == 'TerritoryPAN' || name == 'Territory' || name == 'MediaPAN' || name == 'Media'){
								if(queryParameterPartArray.indexOf(elem.partId) < 0){
									queryParameterPartArray.push(elem.partId);
								}
							}					
						}
						
						
						if(name == 'WithinThroughoutFlag'){
							if(elem.value == 'W'){
								$("#rep_timePeriodAnytime")[0].checked = true;
							}
							if(elem.value == 'T'){
								$("#rep_timePeriodThroughout")[0].checked = true;
							}
						}
						
						if(name == 'FromDate'){
							date = that.getUnFormattedDate(elem.value);
							//AMV the date fields are named differentely on Product Inquiry Report
							//but this function is invoked for each report. 
							//as a result set the value in the two fields. This is a hack idially we should name the fields the same in all the windows
							$("#rep_fromTimePeriod").data("kendoDatePicker").value(date);
							$("#rep_dateOptionFrom").data("kendoDatePicker").value(date);
						}
						
						if(name == 'ToDate'){
							date = that.getUnFormattedDate(elem.value);
							//AMV the date fields are named differentely on Product Inquiry Report
							//but this function is invoked for each report. 
							//as a result set the value in the two fields. This is a hack idially we should name the fields the same in all the windows							
							$("#rep_dateOptionTo").data("kendoDatePicker").value(date);
							$("#rep_toTimePeriod").data("kendoDatePicker").value(date);
						}
						
						if(name == 'FromDateInclTBA'){
							$("#rep_fromIncludeTBA")[0].checked = true;
						}
						
						if(name == 'ToDateInclTBA'){
							$("#rep_toIncludeTBA")[0].checked = true;
						}
						
						if(name == 'InternetOpenCheck'){
							$("#rep_motOpenInternet")[0].checked = true;
						}
						
						if(name == 'InternetClosedCheck'){
							$("#rep_motClosedInternet")[0].checked = true;
						}
						
						if(name == 'RestrictionCodeAnyList' || name == 'RestrictionCodeAllList'){
							try {
								var codes = elem.value.split(",");
								var codeIds = new Array();
								$.each(codes, function(id, e){
									codeIds.push(parseInt(e));
								});
								
								if(codeIds.length > 0){
									$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").clearSelected();
									$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").setSelected(codeIds);
									$("#rep_addInfoCodeAdd").click();
									$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").clearSelected();
								}	
								
								if(name == 'RestrictionCodeAnyList'){
									$("#rep_infoCodeAny")[0].checked = true;
								}
								
								if(name == 'RestrictionCodeAllList'){
									$("#rep_infoCodeAll")[0].checked = true;
								}
							}
							catch(e){
								console.log(" EXCEPTION GENERATED : %o", e);
							}
							
						}
						
						if(name == 'RestrictionCodeNoneList'){
							try{
								var codes = elem.value.split(",");						
								var codeIds = new Array();
								$.each(codes, function(id, e){
									codeIds.push(parseInt(e));
								});
								
								if(codeIds.length > 0){
									$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").clearSelected();
									$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").setSelected(codeIds);
									$("#rep_addInfoCodeRemove").click();
									$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").clearSelected();
								}
							}
							catch(e){
								console.log(" EXCEPTION GENERATED : %o", e);
							}																	
						}
						
					});
					
					if((that.queryViewModel.get("reportId") == that.reportIndexes.AVAILS_REPORT) && (queryParameterPartArray.length > 0)){
						
						var groups = new Array();
						//var counter = 1; //used for new group id for the rights group so that we do not have duplicate rights group id
						$.each(queryParameterPartArray, function(id, e){
							var group = new RightGroup();
							$.each(queryParametersList, function(id, elem){
								if(e == elem.partId){
									var name = elem.name;
									if(name == 'LanguagePAN' || name == 'Language'){
										var languages = new Array();
										var l = elem.value.split(",");
										$.each(l, function(idx, elem){
											try{
												languages.push(parseInt(elem));
											}
											catch(e){
												
											}
										});	
										if(languages.length > 0){
											var languageArray = new Array();
											var lds = $("#rep_languageSelector").data("kendoHierarchySelector").getDataItemsFromDS(languages);
											if(lds && lds.length > 0){
												$.each(lds, function(i, element){
													var qp = new QueryParameter();
													qp.name = "Language";
													qp.value = element.id;
													qp.text = element.text;
													qp.queryId = that.queryViewModel.get("queryId");
													languageArray.push(qp);
												});
											}
											
											if(languageArray.length > 0){
												group.languages = languageArray;
											}
										}
									}
									if(name == 'MediaPAN' || name == 'Media'){
										var mediaIds = new Array();
										var l = elem.value.split(",");
										$.each(l, function(idx, elem){
											try{
												mediaIds.push(parseInt(elem));
											}
											catch(e){
												
											}
										});	
										if(mediaIds.length > 0){
											var mediaArray = new Array();
											var lds = $("#rep_mediaSelector").data("kendoHierarchySelector").getDataItemsFromDS(mediaIds);
											if(lds && lds.length > 0){
												$.each(lds, function(i, element){
													var qp = new QueryParameter();
													qp.name = "Media";
													qp.value = element.id;
													qp.text = element.text;
													qp.queryId = that.queryViewModel.get("queryId");
													mediaArray.push(qp);
												});
											}
											
											if(mediaArray.length > 0){
												group.media = mediaArray;
											}
										}
									}
									
									if(name == 'TerritoryPAN' || name == 'Territory'){
										var territoryIds = new Array();
										var l = elem.value.split(",");
										$.each(l, function(idx, elem){
											try{
												territoryIds.push(parseInt(elem));
											}
											catch(e){
												
											}
										});	
										if(territoryIds.length > 0){
											var territoryArray = new Array();
											var lds = $("#rep_territorySelector").data("kendoHierarchySelector").getDataItemsFromDS(territoryIds);
											if(lds && lds.length > 0){
												$.each(lds, function(i, element){
													var qp = new QueryParameter();
													qp.name = "Territory";
													qp.value = element.id;
													qp.text = element.text;
													qp.queryId = that.queryViewModel.get("queryId");
													territoryArray.push(qp);
												});
											}
											
											if(territoryArray.length > 0){
												group.territories = territoryArray;
											}
										}
									}
									
									
								}
								
							});
							group.groupId = parseInt(e);
							groups.push(group);
						});
						this.rep_rightsGroupSource = new Array();
						if(groups.length > 0){
							this.rep_rightsGroupSource = groups;
							this.buildRightGroupView();
						}
					}
					
				}
				
				if(that.queryViewModel.get("reportId") == that.reportIndexes.PRODUCT_INQUIRY_REPORT){
					if(!$("#rep_rightCheckLegal")[0].checked){
						$(".methodOfTransmissionClass").hide();
					}
					that.populateRightsInquirySpecificFields(queryParametersList);
				}
				
				
				if(productParametersList && productParametersList.length > 0){
					var that = this;
					var idString = "";
					for(var i = 0; i < productParametersList.length; i++){
						
						if(i < (productParametersList.length - 1)){
							idString += productParametersList[i].foxVersionId + ",";
						}
						else {
							idString += productParametersList[i].foxVersionId;
						}
					}
					
					if(idString.length > 0){
						var url = this.rep_path.getProductVersionsByFoxVersionIds();
						var value = idString;
						
						var onSuccess = function(data){
							if(b){
								that.closeSubmitPopupWindow();
								b = false;
							}
							if(data && data.length > 0){
								var dataSourceArray = new Array();
								
								$.each(data, function(id, v){
									try{
										var obj = new Object();
										if(v.ermProductVersionHeader){
											obj.rep_rights = strands.getIndicator(v.ermProductVersionHeader.rightsIconType);
											obj.rep_rights = (v.ermProductVersionHeader.rightsIconType == 'N' || v.ermProductVersionHeader.rightsIconType == '' || (obj.rep_rights.indexOf('null') > -1)) ? null : obj.rep_rights;
											obj.rep_rightsTitle = strands.getIndicatorTitle(v.ermProductVersionHeader.rightsIconType);
										}
										else {
											obj.rep_rights = null;
											obj.rep_rightsTitle = '';
										}
																		
										obj.rep_title = v.title + (v.versionTitle != null ? " / " + v.versionTitle : "");								
										obj.rep_wprId = v.product.financialProductId;
										obj.rep_type = v.product.productTypeDesc;
										obj.rep_productionYear = (v.product.productionYear == null) ? "" : v.product.productionYear;
										obj.rep_productionCompany = v.product.financialDivisionCode;
										obj.rep_firstReleaseDate = (v.product.releaseDate == null) ? "" : that.getFormattedDate(new Date(v.product.releaseDate));//new Date(v.product.releaseDate); //that.getFormattedDate(new Date(v.product.releaseDate));
										obj.foxVersionId = v.foxVersionId;
										obj.rep_checkboxValue = false;
										dataSourceArray.push(obj);
									}
									catch(e){
										console.log(" ERROR : %o", e.message);
									}
									
								});
								
								var dataSource = new kendo.data.DataSource({
									data : dataSourceArray
								});	
								
								that.rebuildSearchProductGrid(dataSource);
								$("#rep_searchProductResultGrid").data("kendoGrid").refresh();
								$("#rep_searchProductCount").html("Number of products included : "+dataSourceArray.length);
							
							}
						};
						
						//We do a synchronous call here, since we do not want the user to start
						//working with the query before all the saved products are loaded.
						setTimeout(function(){
							$.ajax({
								url : url,
								type : "POST",
								success : onSuccess,
								data : {q:value},
								async : false							
							}).fail(function(xhr, status, message){
								errorShowPopup(xhr.responseText);
							});
						}, 1000);
												
						/*
						$.post(url, {q:value}, function(data){
							if(b){
								that.closeSubmitPopupWindow();
								b = false;
							}
							if(data && data.length > 0){
								var dataSourceArray = new Array();
								
								$.each(data, function(id, v){
									try{
										var obj = new Object();
										if(v.ermProductVersionHeader){
											obj.rep_rights = strands.getIndicator(v.ermProductVersionHeader.rightsIconType);
											obj.rep_rights = (v.ermProductVersionHeader.rightsIconType == 'N' || v.ermProductVersionHeader.rightsIconType == '' || (obj.rep_rights.indexOf('null') > -1)) ? null : obj.rep_rights;
											obj.rep_rightsTitle = strands.getIndicatorTitle(v.ermProductVersionHeader.rightsIconType);
										}
										else {
											obj.rep_rights = null;
											obj.rep_rightsTitle = '';
										}
																		
										obj.rep_title = v.title + (v.versionTitle != null ? " / " + v.versionTitle : "");								
										obj.rep_wprId = v.product.financialProductId;
										obj.rep_type = v.product.productTypeDesc;
										obj.rep_productionYear = (v.product.productionYear == null) ? "" : v.product.productionYear;
										obj.rep_productionCompany = v.product.financialDivisionCode;
										obj.rep_firstReleaseDate = (v.product.releaseDate == null) ? "" : that.getFormattedDate(new Date(v.product.releaseDate));//new Date(v.product.releaseDate); //that.getFormattedDate(new Date(v.product.releaseDate));
										obj.foxVersionId = v.foxVersionId;
										obj.rep_checkboxValue = false;
										dataSourceArray.push(obj);
									}
									catch(e){
										console.log(" ERROR : %o", e.message);
									}
									
								});
								
								var dataSource = new kendo.data.DataSource({
									data : dataSourceArray
								});	
								
								that.rebuildSearchProductGrid(dataSource);
								$("#rep_searchProductResultGrid").data("kendoGrid").refresh();
								$("#rep_searchProductCount").html("Number of products included : "+dataSourceArray.length);
							
							}
						}).fail(function(xhr, status, message){
							errorShowPopup(xhr.responseText);
						});
						*/
					}
				}
				else {
					if(b){
						this.closeSubmitPopupWindow();
						b = false;
					}
				}
			}
			catch(e){
				console.log(" ERROR : %o", e);
			}			
		};
		if(!b){
			this.closeSubmitPopupWindow();
		}
	};
	
	/**
	 * 
	 */
	this.processSavedQuerySearch = function(){
		var that = this;
		var qso = new QuerySearchObject();
		qso.queryName = $("#rep_searchQueryName").val();
		qso.personalTag = $("#rep_searchPersonalTag").val();
		var sourceSelected = $("#rep_searchQuerySource").find(":selected");
		if(sourceSelected && sourceSelected.length > 0){
			qso.sourceReportId = parseInt(sourceSelected[0].value);
		}
		qso.comment = $("#rep_searchComment").val();
		qso.publicFlag = 'Y';
		qso.createName = $("#rep_searchCreatedBy").val();
		
		
		var obj = qso.getObjectForJson();
		
		if(qso.validate()){
			var jsonObject = JSON.stringify(obj);
			var url = this.rep_path.getSearchSavedQueryRESTPath();
			this.showSearchSavedQueriesPopupWindow();
			$.post(url, {q:jsonObject}, function(data){
				that.closeSearchSavedQueriesPopupWindow();
				that.savedQuerySearchResult = data;
				that.rebuildSearchSavedQueryGrid(data);
			}).fail(function(xhr,status,message){
				that.closeSearchSavedQueriesPopupWindow();
				errorPopup.showErrorPopupWindow(xhr.responseText);
			});
		}
		else {
			var st = " You must make a valid selection before clicking the search button.";
			errorPopup.showErrorPopupWindow(st);
		}
	};
	
	/**
	 * 
	 */
	this.rebuildSearchSavedQueryGrid = function(searchSavedQueries){	
		var that = this;
		if($("#rep_searchQueryResultGrid").data("kendoGrid")){
			$("#rep_searchQueryResultGrid").data("kendoGrid").destroy();
		}
		$("#rep_searchQueryResultGridParent").empty();
		$("#rep_searchQueryResultGridParent").html('<div id="rep_searchQueryResultGrid" style="height : 95%;"></div>');
		var s = ''+ 0 +" result(s) found";
		$("#rep_searchSavedQueriesNumber").html(s);
		
		var scope = angular.element(document.getElementById("reportController")).scope();
		var sq = scope.reportData;
		
		var queryNameList = new Array();
		var queryIds = new Array();
		var createdBy = new Array();
		var ds = new Array();
		
		if((searchSavedQueries && searchSavedQueries.length > 0)){
			
			
			if(searchSavedQueries && searchSavedQueries.length > 0){
				$.each(searchSavedQueries, function(id, elem){
					var ob = new Object();
					ob.rep_queryId = elem.id;
					ob.rep_queryName = elem.name;
					ob.rep_queryComment = elem.queryComment;
					ob.rep_queryPublic = (elem.publicFlag == 'N') ? 'private' : 'public';					
					ob.rep_querySource = that.reports[elem.sourceReportId];
					ob.rep_queryCreatedBy = elem.createName;
					ob.rep_queryCheckboxValue = false;
					ob.rep_sourceReportId = elem.sourceReportId;
					ds.push(ob);
					if(createdBy.indexOf(elem.createName) < 0){
						createdBy.push(elem.createName);
					}
					queryNameList.push(elem.name);
					queryIds.push(elem.id);
				});
			}
			if(ds.length > 0){
				var publicPrivate = new Array();
				publicPrivate.push("private");
				publicPrivate.push("public");
				
				this.initializeSearchQueryResultGrid(ds, queryNameList, publicPrivate, this.reportSource, createdBy);				
				var s = ''+ds.length +" result(s) found";
				$("#rep_searchSavedQueriesNumber").html(s);
			}
			else {
				var s = " 0 result(s) found";
				$("#rep_searchSavedQueriesNumber").html(s);
			}
			
		}
		else if(sq && sq.savedReportQueries){
			
		}
	};
	
	/**
	 * 
	 */
	this.rebuildSearchSavedQueryGridFromLocalCache = function(){
		this.rebuildSearchSavedQueryGrid(this.savedQuerySearchResult);
	};
	
	this.rebuildSearchSavedQueryGridFromLocalCacheArg = function(savedQueries){
		this.rebuildSearchSavedQueryGrid(savedQueries);
	};
	
	this.checkUserName = function(userId){
		
		if(this.rep_userName == userId){
			return true;
		}
		return false;
	};
	
	this.populateQueryFromSearchSavedQueries = function(reportId, queryId, userName){
		
		this.openReportManagementWindow(reportId, queryId, true, userName);
	};
	
	/**
	 * 
	 */
	this.reInitializeSearchResultGrid = function(dataSource){		
		$("#rep_searchProductResultGrid").kendoGrid({
			sortable: true,
			autoBind: true,
			columns: [ 
                      { field: "rep_checkboxValue", title: "<label><input type='checkbox' id='rep_selectAllSearchProductResults'  class='selectAllSearchQueryResultsClass'></label>", template : "<input type='checkbox' id='rep_checkbox_#: data.foxVersionId#' #: data.rep_checkboxValue ? checked='checked' : '' #  class=\"check_search_product_row\">", width : "5%", sortable : false, filterable : false},
                      { field: "rep_rights", title: "Rights", template : "# if(data.rep_rights == null){#&nbsp; #}else {#<img title='#=data.rep_rightsTitle #' src='img/#=data.rep_rights #'> #}#", width : "5%"},
                      { field: "rep_title", title: "Title", width : "25%"},
                      //TMA BUG: 46849
                      //{ field: "rep_wprId", title: "FIN PROD ID", width : "10%"},
                      { field: "rep_wprId", title: "Financial Title ID (WPR ID) : ", width : "10%"},
                      { field: "rep_type", title: "Type", width : "10%"},
                      { field: "rep_productionYear", title: "Production Year", width : "15%"},
                      { field: "rep_productionCompany", title: "Production Company", width : "20%"},
                      { field: "rep_firstReleaseDate", title: "US Release Date", width : "15%"}
                  ],
			dataSource : dataSource,
			selectable : "multiple",
			scrollable : true
        });
		
		
		$("#rep_selectAllSearchProductResults").click(function (e) {		
			searchProductAllbound(e, this);
		});
		
		$(".check_search_product_row").unbind();
		$(".check_search_product_row").click(function(){
			searchProductCheckboxEvent(this);
		});		
	};
	
	/**
	 * 
	 */
	this.rebuildSearchProductGrid = function(dataSource){
		
		$("#rep_searchProductResultGrid").data("kendoGrid").destroy();
		$("#rep_searchProductResultGridParent").empty();
		$("#rep_searchProductResultGridParent").html('<div id="rep_searchProductResultGrid" style="height : 160px;  overflow-y : hidden;"></div>');
		
		if(dataSource){
			this.reInitializeSearchResultGrid(dataSource);
		}
	};
	
	/**
	 * 
	 */
	this.resetSearchSavedQueryParam = function(){
		$("#rep_searchQueryName").val('');
		$("#rep_searchQuerySource").find(":selected").each(function(id, elem){
			$(elem).removeAttr("selected");
		});
		$("#rep_searchPersonalTag").val('');
		$("#rep_searchCreatedBy").val('');
		$("#rep_searchComment").val('');
	};
	
	/**
	 * 
	 */
	this.processSavedQueryDelete = function(){
		var that = this;
		var items = $("#rep_searchQueryResultGrid").data("kendoGrid").dataSource.data();
		if(items && items.length > 0){
			var idArray = new Array();
			$.each(items, function(id, elem){
				if(elem.rep_queryCheckboxValue == true){
					idArray.push(elem.rep_queryId);
				}
			});
			
			if(idArray.length > 0){
				var obj = new Object();
				obj.queryIds = idArray;
				var jsonObject = JSON.stringify(obj);
				var url = this.rep_path.getSavedQueryDeleteRESTPath();
				$.post(url, {q:jsonObject}, function(data){
					if(data){	
						var scope = angular.element(document.getElementById("reportController")).scope();
						scope.loadReports();
						scope.$apply();
						setTimeout(function(){
							that.rebuildSearchSavedQueryGridFromLocalCacheArg(scope.reportData.savedReportQueries);
							var st = data.length + " saved " + (data.length > 1 ? "queries were" : "query was") + " successfully deleted";
							that.showSavedQueryDeleteMessage(st);
						}, 2000);
						
					}
				}).fail(function(xhr, status, message){
					errorPopup.showErrorPopupWindow(xhr.responseText);
					console.log(" ERROR : %o", xhr.responseText);
				});
			}
			else {
				that.rebuildSearchSavedQueryGridFromLocalCache();
			}
		}
	};
	
	/**
	 * 
	 */
	this.showSavedQueryDeleteMessage = function(message){
		$("#rep_searchResultInformation").html(message);
		$("#rep_searchResultInformationParent").addClass("successBackgroundColor");
		$("#rep_searchResultInformation").show();
		
		setTimeout(function(){
			$("#rep_searchResultInformation").hide();
			$("#rep_searchResultInformationParent").removeClass("successBackgroundColor");
			$("#rep_searchResultInformation").html('');
		}, 7000);
	};
	
	/**
	 * 
	 */
	this.refreshQueryNameDropDown = function(savedQueryArray, queryId){
		var dataSource = new kendo.data.DataSource({
			data : savedQueryArray
		});
		$("#rep_reportSearch").data("kendoComboBox").value('');
		$("#rep_reportSearch").data("kendoComboBox").setDataSource(dataSource);
		$("#rep_reportSearch").data("kendoComboBox").refresh();
		$("#rep_reportSearch").data("kendoComboBox").value(queryId);
		this.rebuildSearchSavedQueryGridFromLocalCache();
	};
	
	this.loadSavedSearchQueryPopup = function(){
		var value = $("#rep_searchForQuery").data("kendoComboBox").text();
		if(value && value.length > 0){
			$("#rep_searchQueryName").val(value);
			this.processSavedQuerySearch();			
		}
		this.openSearchQueryWindow();
	};
	
	/**
	 * 
	 */
	this.openReportDisplayWindow = function(url){
		if(url){
			
			var doc = this.rep_redirectUrlWindow.document;
			var count = 0;
			var runDiv = function(doc){
				if(doc != null){
					count++;
					var div = doc.getElementById('run_submitReport');
					if(div == null && count < 10){
						setTimeout(function(){
							runDiv(doc);
						});
					}
					else if(div != null){
						processDiv(div);
					}
					else {
						this.rep_redirectUrlWindow.close();
						errorShowPopup(" Unable to get the necessary information from the Run Report window, in order to run the query...");
					}
				}
			};
			
			var processDiv = function(div){
				var childNodes = div.childNodes;
				if(childNodes && childNodes.length > 0){				
					for(var i = 0; i < childNodes.length; i++){
						div.removeChild(childNodes[i]);
					}
				}
				
				var formUrl = url.substring(0, url.indexOf("?"));
				var parameters = url.substring(url.indexOf("?")+1);
				var params = parameters.split("&");
				
				var form = doc.createElement('form');
				form.method = 'POST';
				form.action = formUrl;
				
				$.each(params, function(id, elem){
					var ob = elem.split("=");
					var input = doc.createElement('input');
					input.type = "text";
					input.name = ob[0];
					input.defaultValue = ob[1];
					form.appendChild(input);
				});
				
				var submit = doc.createElement("input");
				submit.type = 'submit';
				submit.defaultValue = 'submit';
				form.appendChild(submit);
				div.appendChild(form);
				
				console.log("CREATED FORM : %o", form);
				setTimeout(function(){
					form.submit();
				}, 1000);
			};
			
			if(doc){
				$(doc).ready(function(){					
					runDiv(doc);
				});
			}
			else {
				errorShowPopup(" The page runReport.html seems to be missing, please contact tech support...");
			}			
		}
	};
	
	/**
	 * 
	 */
	this.getSavedQuery = function(){
		
		var savedQuery = new SavedQuery();
		savedQuery.id = this.queryViewModel.get("queryId");
		savedQuery.sourceReportId = this.queryViewModel.get("reportId");
		if(this.processFlag == this.processFlagArray.RUN){
			savedQuery.name = "";
			savedQuery.publicFlag = "";
			savedQuery.publicFlag = "";
			savedQuery.queryComment = "";
			savedQuery.id = -1;
		}
		else {
			if(this.processFlag == this.processFlagArray.SAVE){
				savedQuery.id = -1;
			}
			savedQuery.name = $("#rep_queryName").val(); 
			savedQuery.prsnlTag = $("#rep_personalTag").val(); 
			
			if(erm.security.canCreatePublicQuery()){
				var ch = $("#rep_publicPrivateStatus")[0].checked; 
				if(ch){
					savedQuery.publicFlag = 'Y';
				}
				else {
					savedQuery.publicFlag = 'N';
				}
			}
			else {
				savedQuery.publicFlag = 'N';
			}
							
			var rep_comment = $("#rep_commentForSaveQuery").val(); 
			if(rep_comment && rep_comment.trim().length > 0){
				savedQuery.queryComment = rep_comment;
			}
		}
		return savedQuery;
	};
	
	/**
	 * 
	 */
	this.processMTL = function(qpw){
		var selectedMedia = $("#rep_mediaSelector").data("kendoHierarchySelector").getDataItemsFromDS($("#rep_mediaSelector").data("kendoHierarchySelector").getAccumulated());
		var selectedTerritory = $("#rep_territorySelector").data("kendoHierarchySelector").getDataItemsFromDS($("#rep_territorySelector").data("kendoHierarchySelector").getAccumulated());
		var selectedLanguages = $("#rep_languageSelector").data("kendoHierarchySelector").getDataItemsFromDS($("#rep_languageSelector").data("kendoHierarchySelector").getAccumulated());
		
		if(selectedMedia && selectedMedia.length > 0){
			var qp = new QueryParameter();
			qp.name = "Media";
			qp.queryId = this.queryViewModel.get("queryId");
			qp.value = "";
			qp.text = "";
			for(var elem = 0; elem < selectedMedia.length; elem++){	
				
				if(elem < (selectedMedia.length - 1)){
					qp.value += selectedMedia[elem].id+",";
					qp.text += selectedMedia[elem].text+",";
				}
				else {
					qp.value += selectedMedia[elem].id;
					qp.text += selectedMedia[elem].text;
				}
								
			};
			qpw.queryParametersList.push(qp);
		}
		
		if(selectedTerritory && selectedTerritory.length > 0){
			var qp = new QueryParameter();
			qp.name = "Territory";
			qp.queryId = this.queryViewModel.get("queryId");
			qp.value = "";
			qp.text = "";
			for(var elem = 0; elem < selectedTerritory.length; elem++){
				if(elem < (selectedTerritory.length - 1)){
					qp.value += selectedTerritory[elem].id+",";
					qp.text += selectedTerritory[elem].text+",";
				}
				else {
					qp.value += selectedTerritory[elem].id;
					qp.text += selectedTerritory[elem].text;
				}
				
			};
			qp.text = truncateStringSize(qp.text, this.maximumParameterStringSize);
			qpw.queryParametersList.push(qp);
		}
		
		if(selectedLanguages && selectedLanguages.length > 0){
			var qp = new QueryParameter();
			qp.name = "Language";
			qp.queryId = this.queryViewModel.get("queryId");
			qp.value = "";
			qp.text = "";
			for(var elem = 0; elem < selectedLanguages.length; elem++){
				if(elem < (selectedLanguages.length - 1)){
					qp.value += selectedLanguages[elem].id+",";
					qp.text += selectedLanguages[elem].text+",";
				}
				else {
					qp.value += selectedLanguages[elem].id;
					qp.text += selectedLanguages[elem].text;
				}
				
			};
			qp.text = truncateStringSize(qp.text, this.maximumParameterStringSize);
			qpw.queryParametersList.push(qp);
		}
	};
	
	/**
	 * 
	 */
	this.processCommonElements = function(){
		var that = this;
		
		var savedQuery = this.getSavedQuery();
		var qpw = new QueryParametersWrapper();
		var queryParametersList = new Array();
		
		if(this.queryViewModel.get("reportId")){
			
			var ps = new QueryParameter();
			ps.name = "ReportName";
			ps.value = this.reportName[this.queryViewModel.get("reportId")];
			var reportScope = angular.element(document.getElementById("reportController")).scope();
			ps.text = reportScope.getReportName(this.queryViewModel.get("reportId"));;
			ps.queryId = this.queryViewModel.get("queryId");
			queryParametersList.push(ps);
		}

		var rep_rtf = $("#rep_reportTypeFormat").find(":selected");
		if(rep_rtf && rep_rtf.length > 0){
			var r = rep_rtf[0];
			var ps = new QueryParameter();
			ps.name = "ReportFormat";
			ps.value = r.value;
			ps.text = r.text;
			ps.queryId = this.queryViewModel.get("queryId");
			queryParametersList.push(ps);
		}
		
		var rep_rightsCheckType = "";
		var rep_rightsCheckTypeText = "";
		var rep_rct = $("#rep_rightCheckBusiness")[0].checked; 
		if(rep_rct){
			rep_rightsCheckType = "BUSINESS";
			rep_rightsCheckTypeText = "Business";
		}
		else {
			rep_rct = $("#rep_rightCheckLegal")[0].checked;
			if(rep_rct){
				rep_rightsCheckType = "LEGAL";
				rep_rightsCheckTypeText = "Legal";
			}
			else {
				rep_rct = $("#rep_rightCheckBoth")[0].checked;
				if(rep_rct){
					rep_rightsCheckType = "BOTH";
					rep_rightsCheckTypeText = "Both Business And Legal";
				}
			}
		}
		
		if(rep_rightsCheckType && rep_rightsCheckType.trim().length > 0){
			var ps = new QueryParameter();
			ps.name = "RightsCheckType";
			ps.value = rep_rightsCheckType;
			ps.text = rep_rightsCheckTypeText;
			ps.queryId = this.queryViewModel.get("queryId");
			queryParametersList.push(ps);
		}
		
		var productTypeSelected = $("#rep_productType").data("kendoHierarchySelector").getSelected();
		if(productTypeSelected && productTypeSelected.length > 0){	
			var ids = new Array();
			$.each(productTypeSelected, function(id, elem){
				ids.push(elem.value);
			});
			var pts = $("#rep_productType").data("kendoHierarchySelector").getDataItemsFromDS(ids);
			rep_productType = new Array();
			var ps = new QueryParameter();
			ps.name = "ProductType";
			ps.queryId = that.queryViewModel.get("queryId");
			ps.value = "";
			ps.text = "";
			for(var elem = 0; elem < pts.length; elem++){
				if(pts[elem].id <= 0){
					continue;
				}
				if(elem < (pts.length - 1)){
					ps.value += pts[elem].code+",";
					ps.text += pts[elem].name+",";
				}
				else {
					ps.value += pts[elem].code;
					ps.text += pts[elem].name;
				}
				
			};
			if(ps.value != '' && ps.value.length > 0){
				queryParametersList.push(ps);
			}
			
		}
		
		var items = $("#rep_searchProductResultGrid").data("kendoGrid").dataSource.data();
		if(items && items.length > 0){
			var pArray = new Array();
			var qp0 = new QueryParameter();
			qp0.name = "ProductSelected";
			qp0.queryId = this.queryViewModel.get("queryId");
			qp0.value = this.queryViewModel.get("queryId");
			qp0.text = "";
			for (var i = 0; i < items.length; i++) {		
				var item = items[i];			
				var pp = new ProductParameters();
				pp.foxVersionId = item.foxVersionId;
				pp.queryId = this.queryViewModel.get("queryId");
				pArray.push(pp);
				
				if(i < (items.length - 1)){
					qp0.text += item.rep_title+", ";
				}
				else {
					qp0.text += item.rep_title;
				}			
			}
			
			if(pArray.length > 0){
				qp0.text = truncateStringSize(qp0.text, this.maximumParameterStringSize);
				queryParametersList.push(qp0);
				qpw.productParametersList = pArray;
			}
		}
		
		qpw.savedQuery = savedQuery;
		qpw.queryParametersList = queryParametersList;
		
		return qpw;
	};
	
	/**
	 * Take a QueryParameterList
	 */
	this.processSelectedInfoCodes = function(qpw){
		
		var rep_infoCodeAddSelected = $("#rep_infoCodeSelector").data("kendoInfoCodeSelector").getDataItemsFromDS($("#rep_infoCodeSelector").data("kendoInfoCodeSelector").getAccumulatedAdd());
		var rep_infoCodeRemoveSelected = $("#rep_infoCodeSelector").data("kendoInfoCodeSelector").getDataItemsFromDS($("#rep_infoCodeSelector").data("kendoInfoCodeSelector").getAccumulatedRemove());
		var queryParameterText = null;
		if($("#rep_infoCodeAny")[0].checked){
			queryParameterText = "RestrictionCodeAnyList";
		}
		if($("#rep_infoCodeAll")[0].checked){
			queryParameterText = "RestrictionCodeAllList";
		}
		if(queryParameterText == "" || queryParameterText == null){
			queryParameterText = "RestrictionCodeAnyList";
		}
		if(rep_infoCodeAddSelected && rep_infoCodeAddSelected.length > 0){
			var qp = new QueryParameter();
			qp.name = queryParameterText;
			qp.queryId = this.queryViewModel.get("queryId");
			qp.value = "";
			qp.text = "";
			
			for(var i = 0; i < rep_infoCodeAddSelected.length; i++){
				var item = rep_infoCodeAddSelected[i];
				if(i < (rep_infoCodeAddSelected.length - 1)){
					qp.value += item.id+",";
					qp.text += item.code+", "; 
				}
				else {
					qp.value += item.id;
					qp.text += item.code; 
				}
			}
			qpw.queryParametersList.push(qp);
		}
		
		if(rep_infoCodeRemoveSelected && rep_infoCodeRemoveSelected.length > 0){
			var qp = new QueryParameter();
			qp.name = "RestrictionCodeNoneList";
			qp.queryId = this.queryViewModel.get("queryId");
			qp.value = "";
			qp.text = "";
			
			for(var i = 0; i < rep_infoCodeRemoveSelected.length; i++){
				var item = rep_infoCodeRemoveSelected[i];
				if(i < (rep_infoCodeRemoveSelected.length - 1)){
					qp.value += item.id+",";
					qp.text += item.code+", ";
				}
				else {
					qp.value += item.id;
					qp.text += item.code;
				}
			}
			qpw.queryParametersList.push(qp);
		}
		return qpw;
	};
	
	/**
	 * 
	 */
	this.processRightsInquiryReportMOT = function(url, successText){
		
		var qpw = new QueryParametersWrapper();
		var queryParametersList = new Array();
		var savedQuery = this.getSavedQuery();

		
		if(rep_rightsCheckType && rep_rightsCheckType.trim().length > 0){
			var ps = new QueryParameter();
			ps.name = "RightsCheckType";
			ps.value = "LEGAL";
			ps.text = "Legal";
			ps.queryId = this.queryViewModel.get("queryId");
			queryParametersList.push(ps);
		}
		
		var productTypeSelected = $("#rep_productType").data("kendoHierarchySelector").getSelected();
		if(productTypeSelected && productTypeSelected.length > 0){	
			var ids = new Array();
			$.each(productTypeSelected, function(id, elem){
				ids.push(elem.value);
			});
			var pts = $("#rep_productType").data("kendoHierarchySelector").getDataItemsFromDS(ids);
			rep_productType = new Array();
			var ps = new QueryParameter();
			ps.name = "ProductType";
			ps.queryId = that.queryViewModel.get("queryId");
			ps.value = "";
			ps.text = "";
			for(var elem = 0; elem < pts.length; elem++){
				if(pts[elem].id <= 0){
					continue;
				}
				if(elem < (pts.length - 1)){
					ps.value += pts[elem].code+",";
					ps.text += pts[elem].name+",";
				}
				else {
					ps.value += pts[elem].code;
					ps.text += pts[elem].name;
				}
				
			};
			if(ps.value != '' && ps.value.length > 0){
				queryParametersList.push(ps);
			}
			
		}
		
		var items = $("#rep_searchProductResultGrid").data("kendoGrid").dataSource.data();
		if(items && items.length > 0){
			var pArray = new Array();
			var qp0 = new QueryParameter();
			qp0.name = "ProductSelected";
			qp0.queryId = this.queryViewModel.get("queryId");
			qp0.value = this.queryViewModel.get("queryId");
			qp0.text = "";
			for (var i = 0; i < items.length; i++) {		
				var item = items[i];			
				var pp = new ProductParameters();
				pp.foxVersionId = item.foxVersionId;
				pp.queryId = this.queryViewModel.get("queryId");
				pArray.push(pp);
				
				if(i < (items.length - 1)){
					qp0.text += item.rep_title+",";
				}
				else {
					qp0.text += item.rep_title;
				}			
			}
			
			if(pArray.length > 0){
				queryParametersList.push(qp0);
				qpw.productParametersList = pArray;
			}
		}
		
		var mots = $("#rep_productType").data("kendoHierarchySelector").getSelected();
		if(mots && mots.length > 0){
			var ps = new QueryParameter();
			ps.name = "MethodOfTransmission";
			ps.queryId = that.queryViewModel.get("queryId");
			ps.value = "";
			ps.text = "";
			for(var i = 0; i < mots.length; i++){
				if(i < (mots.length -1)){
					ps.value += mots[i].value+",";
					ps.text += mots[i].text+",";
				}
				else {
					ps.value += mots[i].value;
					ps.text += mots[i].text;
				}
			}
			
			queryParameterList.push(ps);
		}		
		qpw.savedQuery = savedQuery;
		qpw.queryParametersList = queryParametersList;
		
		var queryObject = qpw.getObjectForJSON();
		console.log(" RIGHTS INQUIRY OBJECT : %o", queryObject);
		this.submitReport(queryObject, url, successText);
	};
	
	/**
	 * 
	 */
	this.productRightsInquiryReportMOTCheck = function(){
		var mots = $("#rep_methodOfTransmission").data("kendoHierarchySelector").getSelected();
		if(mots && mots.length > 0){
			return true;
		}
		else {
			return false;
		}
	};
	
	/**
	 * 
	 */
	this.processRightsInquiryReport = function(url, successText){
		
		var qpw = this.processCommonElements();
		this.processSelectedInfoCodes(qpw);
		this.processMTL(qpw);
		
		var ssm = $("#rep_subrightsSalesAndMarketing").data("kendoHierarchySelector").getSelected();
		if(ssm && (ssm.length > 0)){
			var subrightsSalesAndMarketing = "";
			var subrightsSalesAndMarketingText = "";
			for(var i = 0; i < ssm.length; i++){
				if(ssm[i].value <= 0){
					continue;
				}
				if(i < (ssm.length - 1)){
					subrightsSalesAndMarketing += ssm[i].value+",";
					subrightsSalesAndMarketingText += ssm[i].text+",";
				}
				else {
					subrightsSalesAndMarketing += ssm[i].value;
					subrightsSalesAndMarketingText += ssm[i].text;
				}
			}
			
			if(subrightsSalesAndMarketing.length > 0){
				var ps = new QueryParameter();
				ps.name = "SubrightsSalesAndMarketing";
				ps.value = subrightsSalesAndMarketing;
				ps.text = subrightsSalesAndMarketingText;
				ps.queryId = this.queryViewModel.get("queryId");
				qpw.queryParametersList.push(ps);
			}			
		}
		
		var mot = $("#rep_methodOfTransmission").data("kendoHierarchySelector").getSelected();
		if(mot && (mot.length > 0)){
			var methodOfTransmission = "";
			var methodOfTransmissionText = "";
			for(var i = 0; i < mot.length; i++){
				if(mot[i].value <= 0){
					continue;
				}
				if(i < (mot.length - 1)){
					methodOfTransmission += mot[i].value+",";
					methodOfTransmissionText += mot[i].text+", ";
				}
				else {
					methodOfTransmission += mot[i].value;
					methodOfTransmissionText += mot[i].text;
				}
			}
			
			var ps = new QueryParameter();
			ps.name = "MethodOfTransmission";
			ps.value = methodOfTransmission;
			ps.text = methodOfTransmissionText;
			ps.queryId = this.queryViewModel.get("queryId");
			qpw.queryParametersList.push(ps);
		}
		
		var dateOption = $("#rep_dateOption").data("kendoDropDownList").value();
		if(dateOption && dateOption > 0){
			var ps = new QueryParameter();
			ps.name = "DateOption";
			ps.value = dateOption;
			ps.text = $("#rep_dateOption").data("kendoDropDownList").text();
			ps.queryId = this.queryViewModel.get("queryId");
			qpw.queryParametersList.push(ps);
		}
		
		var dateOptionFrom = $("#rep_dateOptionFrom").data("kendoDatePicker").value();
		if(dateOptionFrom && dateOptionFrom > 0){
			var d = this.getFormattedDate(dateOptionFrom);
			var ps = new QueryParameter();
			ps.name = "FromDate";
			ps.value = d;
			ps.text = d;
			ps.queryId = this.queryViewModel.get("queryId");
			qpw.queryParametersList.push(ps);
		}
		
		var dateOptionFromTBA = $("#rep_dateOptionFromTBA")[0].checked;
		if(dateOptionFromTBA){
			var ps = new QueryParameter();
			ps.name = "FromDateInclTBA";
			ps.value = 1;
			ps.text = "Include TBA";
			ps.queryId = this.queryViewModel.get("queryId");
			qpw.queryParametersList.push(ps);
		}
		
		var dateOptionTo = $("#rep_dateOptionTo").data("kendoDatePicker").value();
		if(dateOptionTo && dateOptionTo > 0){
			var d = this.getFormattedDate(dateOptionTo);
			var ps = new QueryParameter();
			ps.name = "ToDate";
			ps.value = d;
			ps.text = d;
			ps.queryId = this.queryViewModel.get("queryId");
			qpw.queryParametersList.push(ps);
		}
		
		var dateOptionToTBA = $("#rep_dateOptionToTBA")[0].checked;
		if(dateOptionToTBA){
			var ps = new QueryParameter();
			ps.name = "ToDateInclTBA";
			ps.value = 1;
			ps.text = "IncludeTBA";
			ps.queryId = this.queryViewModel.get("queryId");
			qpw.queryParametersList.push(ps);
		}
		
		var legalConfirmationStatus = $("#rep_legalConfirmationStatus").data("kendoDropDownList").value();
		if(legalConfirmationStatus && legalConfirmationStatus > 0){
			var ps = new QueryParameter();
			ps.name = "LegalConfirmationStatus";
			ps.value = legalConfirmationStatus;
			ps.text = $("#rep_legalConfirmationStatus").data("kendoDropDownList").text();
			ps.queryId = this.queryViewModel.get("queryId");
			qpw.queryParametersList.push(ps);
		}
		
		var productInformationCode = $("#rep_productInformationCode").data("kendoDropDownList").value();
		if(productInformationCode && productInformationCode > -1){
			var ps = new QueryParameter();
			ps.name = "ProductInformationCode";
			ps.value = productInformationCode;
			ps.text = $("#rep_productInformationCode").data("kendoDropDownList").text();
			ps.queryId = this.queryViewModel.get("queryId");
			qpw.queryParametersList.push(ps);
		}
		
		var doNotLicense = $("#rep_doNotLicense").data("kendoDropDownList").value();
		if(doNotLicense && doNotLicense >= 0){
			var ps = new QueryParameter();
			ps.name = "DoNotLicense";
			ps.value = doNotLicense; 
			ps.text = $("#rep_doNotLicense").data("kendoDropDownList").text();
			ps.queryId = this.queryViewModel.get("queryId");
			qpw.queryParametersList.push(ps);
		}
		
		var futureMedia = $("#rep_futureMedia").data("kendoDropDownList").value();
		if(futureMedia && futureMedia >= 0){
			var ps = new QueryParameter();
			ps.name = "FutureMedia";
			ps.value = futureMedia; 
			ps.text = $("#rep_futureMedia").data("kendoDropDownList").text();
			ps.queryId = this.queryViewModel.get("queryId");
			qpw.queryParametersList.push(ps);
		}
		

			
		var cpt = $("#rep_contractualPartyType").data("kendoHierarchySelector").getSelected();
		//if(contractualPartyType && contractualPartyType > -1){
		if(cpt && (cpt.length > 0)){
				var contractualPartyType = "";
				var contractualPartyTypeText = "";
				for(var i = 0; i < cpt.length; i++){
					if(cpt[i].value <= 0){
						continue;
					}
					if(i < (cpt.length - 1)){
						contractualPartyType  += cpt[i].value+",";
						contractualPartyTypeText += cpt[i].text+", ";
					}
					else {
						contractualPartyType += cpt[i].value;
						contractualPartyTypeText += cpt[i].text;
					}
				}
			
			var ps = new QueryParameter();
			ps.name = "ContractualPartyType";
			ps.value = contractualPartyType;
			ps.text = contractualPartyTypeText;
			ps.queryId = this.queryViewModel.get("queryId");
			qpw.queryParametersList.push(ps);
		}
		
		var contractualParty = $("#rep_contractualParty").data("kendoComboBox").value();
		if(contractualParty && contractualParty > 0){
			var ps = new QueryParameter();
			ps.name = "ContractualParty";
			ps.value = contractualParty;
			ps.text = $("#rep_contractualParty").data("kendoComboBox").text();
			ps.queryId = this.queryViewModel.get("queryId");
			qpw.queryParametersList.push(ps);
		}
		
		var foxEntity = $("#rep_foxEntity").data("kendoComboBox").value();
		if(foxEntity && foxEntity > 0){
			var ps = new QueryParameter();
			ps.name = "FoxEntity";
			ps.value = foxEntity;
			ps.text = $("#rep_foxEntity").data("kendoComboBox").text();
			ps.queryId = this.queryViewModel.get("queryId");
			qpw.queryParametersList.push(ps);
		}
		
		var contacts = $("#rep_contacts").data("kendoHierarchySelector").getSelected();
		if(contacts && (contacts.length > 0)){
			var cs = "";
			var csText = "";
			for(var i = 0; i < contacts.length; i++){
				if(parseInt(contacts[i].value) <= 0){
					continue;
				}
				if(i < (contacts.length - 1)){
					cs += contacts[i].value+",";
					csText += contacts[i].text+",";
				}
				else {
					cs += contacts[i].value;
					csText += contacts[i].text;
				}
			}
			
			if(cs.length > 0){
				var ps = new QueryParameter();
				ps.name = "Contacts";
				ps.value = cs;
				ps.text = csText;
				ps.queryId = this.queryViewModel.get("queryId");
				qpw.queryParametersList.push(ps);
			}
			
		}
		
		var queryObject = qpw.getObjectForJSON();
		console.log(" RIGHTS INQUIRY OBJECT : %o", queryObject);
		this.submitReport(queryObject, url, successText);
	};
	
	/**
	 * 
	 */
	this.validateRightsInquiryReport = function(){
		var error = " You must select at least one field to run the report";
		var sm = $("#rep_mediaSelector").data("kendoHierarchySelector").getAccumulated();
		var st = $("#rep_territorySelector").data("kendoHierarchySelector").getAccumulated();
		var sl = $("#rep_languageSelector").data("kendoHierarchySelector").getAccumulated();
		var items = $("#rep_searchProductResultGrid").data("kendoGrid").dataSource.data();
		var fromDate = checkValidDateFormat($("#rep_dateOptionFrom").val(), "rep_dateOptionFrom");
		if(fromDate){
			setValidDateFromat("rep_dateOptionFrom");
		}
		fromDate = fromDate && $("#rep_dateOptionFrom").val() != null && $("#rep_dateOptionFrom").val() != '';
		var fromDateInvalid = !fromDate && $("#rep_dateOptionFrom").val() != null && $("#rep_dateOptionFrom").val() != '';
		
		var toDate = checkValidDateFormat($("#rep_dateOptionTo").val(), "rep_dateOptionTo"); 
		if(toDate){
			setValidDateFromat("rep_dateOptionTo");
		}
		toDate = toDate && $("#rep_dateOptionTo").val() != null && $("#rep_dateOptionTo").val() != '';
		var toDateInvalid = !toDate && $("#rep_dateOptionTo").val() != null && $("#rep_dateOptionTo").val() != '';
		
		var infoCodesAdd = $("#rep_infoCodeSelector").data("kendoInfoCodeSelector").getAccumulatedAdd();
		var infoCodesRemove = $("#rep_infoCodeSelector").data("kendoInfoCodeSelector").getAccumulatedRemove();
		
		var isBusinessData = $("#rep_rightCheckBusiness")[0].checked;
		
		/*
		if(!isBusinessData){			
			if((!fromDateInvalid || !toDateInvalid) && ((infoCodesAdd && infoCodesAdd.length > 0) || (infoCodesRemove && infoCodesRemove.length > 0))){
				return true;
			}
		}
		*/
		error = this.validateDates();
		if(error != null){
			errorPopup.showErrorPopupWindow(error);
			return false;
		}
		
		if(items && items.length > 0){
			return true;
		}
		
		var productTypes = $("#rep_productType").data("kendoHierarchySelector").getSelected();
		if(productTypes.length > 0){
			return true;
		}
		
		var ssm = $("#rep_subrightsSalesAndMarketing").data("kendoHierarchySelector").getSelected();
		if(ssm && ssm.length > 0){
			return true;
		}
		
						
		var lcs = $("#rep_legalConfirmationStatus").data("kendoDropDownList").value();
		if(lcs && lcs > 0){
			return true;
		}
		
		var pic = $("#rep_productInformationCode").data("kendoDropDownList").value();
		if(pic && pic > 0){
			return true;
		}
		
		var dnl = $("#rep_doNotLicense").data("kendoDropDownList").value();
		if(dnl && dnl > -1){
			return true;
		}
		
		var fm = $("#rep_futureMedia").data("kendoDropDownList").value();
		if(fm && fm > -2){
			return true;
		}
		
		var cpt = $("#rep_contractualPartyType").data("kendoHierarchySelector").getSelected();
		if(cpt && cpt > 0){
			return true;
		}
		
		var cp = $("#rep_contractualParty").data("kendoComboBox").value();
		if(cp && cp > 0){
			return true;
		}
		
		var fe = $("#rep_foxEntity").data("kendoComboBox").value();
		if(fe && fe > 0){
			return true;
		}
		
		var co = $("#rep_contacts").data("kendoHierarchySelector").getSelected();
		if(co && co.length > 0){
			return true;
		}
		
		if(sm && sm.length > 1){
			return true;
		}
		
		if(st && st.length > 1){
			return true;
		}
		
		if(sl && sl.length > 1){
			return true;
		}
		
		if(sm.length > 0 && sm.indexOf(this.allMediaId) <= -1){
			return true;
		}
		
		if(st.length > 0 && st.indexOf(this.worldwideTerritoryId) <= -1){
			return true;
		}
		
		if(sl.length > 0 && sl.indexOf(this.allLanguageId) < -1){
			return true;
		}
		
		//To re-enable the check on info codes comment out this section
		if(infoCodesAdd && infoCodesAdd.length > 0){
			return true;
		}
		
		//To re-enable the check on info codes comment out this section
		if(infoCodesRemove && infoCodesRemove.length > 0){
			return true;
		}
		
		var b = true;
		
		/**
		 * 
		media value = 64
		territory value = 32
		language value = 16
		fromDate value = 8
		toDate value = 4
		infoCodesAdd value = 2
		infoCodesRemove value = 1
		 */
		if(isBusinessData){
			var v = 0;
			if(sm.length == 1 && sm.indexOf(this.allMediaId) > -1){
				v = 64 | v;
			}
			
			if(st.length == 1 && st.indexOf(this.worldwideTerritoryId) > -1){
				v = 32 | v;
			}
			if(sl.length == 1 && sl.indexOf(this.allLanguageId) > -1){
				v = 16 | v;
			}
			if(fromDate){
				v = 8 | v;
			}
			if(toDate){
				v = 4 | v;
			}
			if(infoCodesAdd && infoCodesAdd.length > 0){
				v = 2 | v;
			}
			if(infoCodesRemove && infoCodesRemove.length > 0){
				v = 1 | v;
			}
			
			var vo = v & 127;
			if(vo <= 0){
				error = " A report parameter is required to execute the report ()";
				b = false;
			}
			else if((vo & 116) == 116){
				error = " Since you selected all media, worldwide, and all languages and no other field, An additional report parameter is required to execute the report. ";
				b = false;
			}
			else if((vo & 96) == 96){
				error = " Since you selected all media, worldwide and no other field, An additional report parameter is required to execute the report. ";
				b = false;
			}
			else if((vo & 80) == 80){
				error = " Since you selected all media, and all languages and no other field, An additional report parameter is required to execute the report. ";
				b = false;
			}
			else if((vo & 48) == 48){
				error = " Since you selected worldwide, and all languages and no other field, An additional report parameter is required to execute the report. ";
				b = false;
			}
			else if((vo & 64) == 64){
				error = " Since you selected all media only, An additional report parameter is required to execute the report. ";
				b = false;
			}
			else if((vo & 32) == 32){
				error = " Since you selected worldwide only, An additional report parameter is required to execute the report. ";
				b = false;
			}
			else if((vo & 16) == 16){
				error = " Since you selected all Languages only, An additional report parameter is required to execute the report. ";
				b = false;
			}
			else if(((vo & 8) == 8) || ((vo & 4) == 4) || ((vo & 12) == 12)){
				if(fromDateInvalid){
					error = " Invalid 'From' date option";
				}
				else if(toDateInvalid){
					error = " Invalid 'To' date option";
				}
				else {
					error = " Since you selected the date option and the 'From' date and/or the 'To' date only, An additional report parameter is required to execute the report. ";
				}				
				b = false;
			}
			//To re-enable the check on info codes uncomment this section
			/*
			else if(((vo & 2) == 2) || ((vo & 1) == 1) || ((vo & 3) == 3)){
				error = " Since you selected Info codes only, An additional report parameter is required to execute the report. ";
				b = false;
			}
			*/
		}
		else {
			if(sm && sm.length > 0){
				return true;
			}
			if(st && st.length > 0){
				return true;
			}
			if(sl && sl.length > 0){
				return true;
			}
			if(infoCodesAdd && infoCodesAdd.length > 0){
				return true;
			}
			if(infoCodesRemove && infoCodesRemove.length > 0){
				return true;
			}
			if($("#rep_dateOptionFromTBA")[0].checked){
				return true;
			}
			if($("#rep_dateOptionToTBA")[0].checked){
				return true;
			}
			if($("#rep_dateOptionFrom").val() != null && $("#rep_dateOptionFrom").val() != ''){
				return true;
			}
			if($("#rep_dateOptionTo").val() != null && $("#rep_dateOptionTo").val() != ''){
				return true;
			}
			
			b = false;
			error = " You must select at least one parameter to run the report.";
		}
		if(b){
			return true;
		}
		else {
			errorPopup.showErrorPopupWindow(error);
			return false;
		}	
	};
	
	
	/**
	 * 
	 */
	this.populateRightsInquirySpecificFields = function(queryParametersList){
		var that = this;
		$.each(queryParametersList, function(id, elem){
			var name = elem.name;
			if(name == 'DateOption'){
				var value = parseInt(elem.value);
				$("#rep_dateOption").data("kendoDropDownList").value(value);
			}
			
			if(name == 'DateOptionFrom'){
				var date = that.getUnFormattedDate(elem.value);
				$("#rep_dateOptionFrom").data("kendoDatePicker").value(date);
			}
			
			if(name == 'DateOptionFromTBA'){
				$("#rep_dateOptionFromTBA")[0].checked = true;
			}
			
			if(name == 'DateOptionTo'){
				$("#rep_dateOptionTo").data("kendoDatePicker").value(that.getUnFormattedDate(elem.value));
			}
			
			if(name == 'DateOptionToTBA'){
				$("#rep_dateOptionToTBA")[0].checked = true;
			}
			
			if(name == 'LegalConfirmationStatus'){
				$("#rep_legalConfirmationStatus").data("kendoDropDownList").value(parseInt(elem.value));
			}
			
			if(name == 'ProductInformationCode'){
				$("#rep_productInformationCode").data("kendoDropDownList").value(parseInt(elem.value));
			}
			
			if(name == 'DoNotLicense'){
				$("#rep_doNotLicense").data("kendoDropDownList").value(parseInt(elem.value));
			}
			
			if(name == 'FutureMedia'){
				$("#rep_futureMedia").data("kendoDropDownList").value(parseInt(elem.value));
			}
			
			//if(name == 'ContractualPartyType'){
			//	$("#rep_contractualPartyType").data("kendoHierarchySelector").value(parseInt(elem.value));
			//}
			if(name == 'ContractualPartyType'){
				var ids = new Array();
				if(elem.value.indexOf(",") > -1){
					var idsString = elem.value.split(",");
					$.each(idsString, function(id, element){
						ids.push(parseInt(element));
					});
				}
				else {
					ids.push(parseInt(elem.value));
				}
				if(ids.length > 0){
					$("rep_contractualPartyType").data("kendoHierarchySelector").setSelected(ids);
				}
			}
			
			if(name == 'ContractualParty'){
				$("#rep_contractualParty").data("kendoComboBox").value(parseInt(elem.value));
			}
			
			if(name == 'FoxEntity'){
				$("#rep_foxEntity").data("kendoComboBox").value(parseInt(elem.value));
			}
			
			if(name == 'Contacts'){
				var ids = new Array();
				if(elem.value.indexOf(",") > -1){
					var idsString = elem.value.split(",");
					$.each(idsString, function(id, element){
						ids.push(parseInt(element));
					});
				}
				else {
					ids.push(parseInt(elem.value));
				}
				if(ids.length > 0){
					$("#rep_contacts").data("kendoHierarchySelector").setSelected(ids);
				}
			}
			
			if(name == 'SubrightsSalesAndMarketing'){
				var ids = new Array();
				if(elem.value.indexOf(",") > -1){
					var idsString = elem.value.split(",");
					$.each(idsString, function(id, element){
						ids.push(parseInt(element));
					});
				}
				else {
					ids.push(parseInt(elem.value));
				}
				if(ids.length > 0){
					$("#rep_subrightsSalesAndMarketing").data("kendoHierarchySelector").setSelected(ids);
				}
			}
			
			if(name == 'MethodOfTransmission'){
				var ids = new Array();
				if(elem.value.indexOf(",") > -1){
					var idsString = elem.value.split(",");
					$.each(idsString, function(id, element){
						ids.push(parseInt(element));
					});
				}
				else {
					ids.push(parseInt(elem.value));
				}
				if(ids.length > 0){
					$("#rep_methodOfTransmission").data("kendoHierarchySelector").setSelected(ids);
					$(".methodOfTransmissionClass").show();
					that.enableMethodOfTransmission();
					that.disableForMOT();
				}
			}
		});
	};
	
	/**
	 * 
	 */
	this.populateSavedQueryPopupFromSavedQueries = function(queryId){
		var reportScope = angular.element(document.getElementById("reportController")).scope();
		
		$("#rep_savedQueryUserName").html(erm.security.user.userId);
		$("#rep_savedQueryReportName").html(reportScope.getReportName(this.queryViewModel.get("reportId")));
		$("#rep_savedQueryDateSaved").html(this.getFormattedDate(new Date()));
		
		var savedQueries = reportScope.reportData.savedReportQueries;
		if(savedQueries && savedQueries.length > 0){
			var savedQuery = null;
			for(var i = 0; i < savedQueries.length; i++){
				var sq = savedQueries[i];
				if(sq.id == queryId){
					savedQuery = sq;
					break;
				}
			}
			
			if(savedQuery){
				var txt = $("#rep_reportSearch").data("kendoComboBox").text();
				if(txt && txt.length > 0){
					$("#rep_queryName").val(txt);
				}else {
					$("#rep_queryName").val(savedQuery.name);
				}				
				this.saveQueryViewModel.personalTag = savedQuery.prsnlTag;
				$("#rep_personalTag").val(savedQuery.prsnlTag);
				this.saveQueryViewModel.commentForQueryToBeSaved = savedQuery.queryComment;
				$("#rep_commentForSaveQuery").val(savedQuery.queryComment);
				this.saveQueryViewModel.publicPrivateStatus = savedQuery.publicFlag;
				if(savedQuery.publicFlag == 'N'){
					$("#rep_publicPrivateStatus")[0].checked = true;
				}
			}
		}
	};
	
	/**
	 * 
	 */
	this.applySecurity = function(){
		
		if(erm.security.canUpdateQuery()){
			$("#rep_updateQuery").show();			
		}
	};
	
	/**
	 * 
	 */
	this.validateProductSearchPopup = function(){
		var productSearchScope = angular.element(document.getElementById("productSearchController")).scope();
		if(!productSearchScope.crossProduct || !productSearchScope.crossProduct.targets || productSearchScope.crossProduct.targets.length <= 0){
			
		}
	};
	
	/**
	 * 
	 */
	this.showUpdateButtons = function(){
		$("#rep_saveQuery").hide();
		$("#rep_cancelQuery").hide();
		$("#rep_updateQuery").show();
	};
	
	/**
	 * 
	 */
	this.showSaveButtons = function(){
		$("#rep_updateQuery").hide();
		$("#rep_saveQuery").show();
		$("#rep_cancelQuery").show();
	};
	
	/**
	 * 
	 */
	this.hideAllButtons = function(){
		$("#rep_updateQuery").hide();
		$("#rep_saveQuery").hide();
		$("#rep_cancelQuery").hide();
	};
	
	/**
	 * 
	 */
	this.disableForMOT = function(){
		this.disabledForMOTFlag = true;
		$("#rep_mediaSelector").data("kendoHierarchySelector").clear();
		$("#rep_mediaSelector").attr("disabled", true);
		$("#rep_mediaSelected").attr("disabled", true);
		$("#rep_removeMedia").attr("disabled", true);
		$("#rep_addMedia").attr("disabled", true);
		$("#rep_mediaText").addClass("disableTextClass");
		$("#rep_mediaSelectedText").addClass("disableTextClass");
		$("#rep_removeMedia").attr("disabled", true);
		$("#rep_removeMedia").addClass("disableTextClass");
		$("#rep_addMedia").attr("disabled", true);
		$("#rep_addMedia").addClass("disableTextClass");
		
		$("#rep_territorySelector").data("kendoHierarchySelector").clear();
		$("#rep_territorySelector").attr("disabled", true);
		$("#rep_territorySelected").attr("disabled", true);
		$("#rep_removeTerritory").attr("disabled", true);
		$("#rep_addTerritory").attr("disabled", true);
		$("#rep_territoryText").addClass("disableTextClass");
		$("#rep_territoryGroups").data("kendoMultiSelect").value([]);
		$("#rep_territoryGroups").data("kendoMultiSelect").enable(false);
		$("#rep_territoryGroupsText").addClass("disableTextClass");
		$("#rep_territorySelectedText").addClass("disableTextClass");
		$("#rep_removeTerritory").attr("disabled", true);
		$("#rep_removeTerritory").addClass("disableTextClass");
		$("#rep_addTerritory").attr("disabled", true);
		$("#rep_addTerritory").addClass("disableTextClass");
		
		$("#rep_languageSelector").data("kendoHierarchySelector").clear();
		$("#rep_languageSelector").attr("disabled", true);
		$("#rep_languageSelected").attr("disabled", true);
		$("#rep_removeLanguage").attr("disabled", true);
		$("#rep_addLanguage").attr("disabled", true);
		$("#rep_languageText").addClass("disableTextClass");
		$("#rep_languageGroups").data("kendoMultiSelect").value([]);
		$("#rep_languageGroups").data("kendoMultiSelect").enable(false);
		$("#rep_languageGroupsText").addClass("disableTextClass");
		$("#rep_languageSelectedText").addClass("disableTextClass");
		$("#rep_removeLanguage").attr("disabled", true);
		$("#rep_removeLanguage").addClass("disableTextClass");
		$("#rep_addLanguage").attr("disabled", true);
		$("#rep_addLanguage").addClass("disableTextClass");
		
		$("#rep_timePeriodText").addClass("disableTextClass");
		$("#rep_timePeriodAnytime")[0].checked = false;
		$("#rep_timePeriodAnytime").attr("disabled", true);
		$("#rep_timePeriodThroughout")[0].checked = false;
		$("#rep_timePeriodThroughout").attr("disabled", true);
		$("#rep_fromTimePeriod").data("kendoDatePicker").value("");
		$("#rep_fromTimePeriod").data("kendoDatePicker").enable(false);		
		$("#rep_fromIncludeTBA")[0].checked = false;
		$("#rep_fromIncludeTBA").attr("disabled", true);
		$("#rep_toTimePeriod").data("kendoDatePicker").value("");
		$("#rep_toTimePeriod").data("kendoDatePicker").enable(false);
		$("#rep_toIncludeTBA")[0].checked = false;
		$("#rep_toIncludeTBA").attr("disabled", true);
		
		$("#rep_infoCodeTypesText").addClass("disableTextClass");
		$("#rep_infoCodeGroups").data("kendoMultiSelect").value([]);
		$("#rep_infoCodeGroups").data("kendoMultiSelect").enable(false);
		$("#rep_infoCodeSeverityText").addClass("disableTextClass");
		$("#rep_infoCodeSeverity").data("kendoDropDownList").value([]);
		$("#rep_infoCodeSeverity").data("kendoDropDownList").enable(false);
		$("#rep_infoCodesText").addClass("disableTextClass");
		$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").clear();
		$("#rep_infoCodeSelector").attr("disabled", true);
		$("#rep_removeInfoCodeAdd").attr("disabled", true);
		$("#rep_removeInfoCodeAdd").addClass("disableTextClass");
		$("#rep_addInfoCodeAdd").attr("disabled", true);
		$("#rep_addInfoCodeAdd").addClass("disableTextClass");
		$("#rep_removeInfoCodeRemove").addClass("disableTextClass");
		$("#rep_addInfoCodeRemove").addClass("disableTextClass");
		$("#rep_infoCodeAny")[0].checked = false;
		$("#rep_infoCodeAny").attr("disabled", true);
		$("#rep_infoCodeAll")[0].checked = false;
		$("#rep_infoCodeAll").attr("disabled", true);
		$("#rep_infoCodeAddSelectedAnyText").addClass("disableTextClass");
		$("#rep_infoCodeAddSelectedNoneText").addClass("disableTextClass");
		$("#rep_infoCodeAddSelectedAllText").addClass("disableTextClass");
		$("#rep_infoCodeAddSelectedNoneText").addClass("disableTextClass");
		$("#rep_infoCodeRemoveSelectedText").addClass("disableTextClass");
		$("#rep_infoCodeRemoveSelectedText").css("color", "#cfcfcf"); //"#a95250");
		$("#rep_infoCodeAddSelected").attr("disabled", true);
		$("#rep_infoCodeRemoveSelected").attr("disabled", true);
		
		$("#rep_subrightsSalesAndMarketingText").addClass("disableTextClass");
		$("#rep_subrightsSalesAndMarketing").data("kendoHierarchySelector").clear();
		$("#rep_subrightsSalesAndMarketing").attr("disabled", true);
		
		$("#rep_dateOptionText").addClass("disableTextClass");
		$("#rep_dateOption").data("kendoDropDownList").value([]);
		$("#rep_dateOption").attr("disabled", true);
		
		$("#rep_dateOptionFromText").addClass("disableTextClass");
		$("#rep_dateOptionFrom").data("kendoDatePicker").value("");
		$("#rep_dateOptionFrom").data("kendoDatePicker").enable(false);
		$("#rep_dateOptionFromTBAText").addClass("disableTextClass");
		$("#rep_dateOptionFromTBA")[0].checked = false;
		$("#rep_dateOptionFromTBA").attr("disabled" , true);
		
		$("#rep_dateOptionToText").addClass("disableTextClass");
		$("#rep_dateOptionTo").data("kendoDatePicker").value("");
		$("#rep_dateOptionTo").data("kendoDatePicker").enable(false);
		$("#rep_dateOptionToText").addClass("disableTextClass");
		$("#rep_dateOptionToTBAText").addClass("disableTextClass");
		$("#rep_dateOptionToTBA")[0].checked = false;
		$("#rep_dateOptionToTBA").attr("disabled" , true);
		
		$("#rep_legalConfirmationStatusText").addClass("disableTextClass");
		$("#rep_legalConfirmationStatus").data("kendoDropDownList").value([]);
		$("#rep_legalConfirmationStatus").data("kendoDropDownList").enable(false);
		
		$("#rep_productInformationCodeText").addClass("disableTextClass");
		$("#rep_productInformationCode").data("kendoDropDownList").value([]);
		$("#rep_productInformationCode").data("kendoDropDownList").enable(false);
		
		$("#rep_doNotLicenseText").addClass("disableTextClass");
		$("#rep_doNotLicense").data("kendoDropDownList").value(-1);
		$("#rep_doNotLicense").data("kendoDropDownList").enable(false);
		
		$("#rep_futureMediaText").addClass("disableTextClass");
		$("#rep_futureMedia").data("kendoDropDownList").value(-2);
		$("#rep_futureMedia").data("kendoDropDownList").enable(false);
		
		//$("#rep_contractualPartyTypeText").addClass("disableTextClass");
		//$("#rep_contractualPartyType").data("kendoDropDownList").value([]);
		//$("#rep_contractualPartyType").data("kendoDropDownList").enable(false);
		$("#rep_contractualPartyType").data("kendoHierarchySelector").clear();
		$("#rep_contractualPartyTypeText").attr("disabled", true);
		$("#rep_contractualPartyType").attr("disabled", true);
		
		$("#rep_contractualPartyText").addClass("disableTextClass");
		$("#rep_contractualParty").data("kendoComboBox").value([]);
		$("#rep_contractualParty").data("kendoComboBox").enable(false);
		
		$("#rep_foxEntityText").addClass("disableTextClass");
		$("#rep_foxEntity").data("kendoComboBox").value([]);
		$("#rep_foxEntity").data("kendoComboBox").enable(false);
		
		$("#rep_contactsText").addClass("disableTextClass");
		$("#rep_contacts").data("kendoHierarchySelector").clear();
		$("#rep_contacts").attr("disabled", true);
		
		$("#rep_mediaSelector").data("kendoHierarchySelector").populateSelectorAlt();
		$("#rep_territorySelector").data("kendoHierarchySelector").populateSelectorAlt();
		$("#rep_languageSelector").data("kendoHierarchySelector").populateSelectorAlt();
		$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").populateSelectorAlt();
	};
	
	/**
	 * 
	 */
	this.enableWithoutMOT = function(){
	  this.disabledForMOTFlag = false;
	  try {
		$("#rep_mediaSelector").attr("disabled", false);
		$("#rep_mediaSelected").attr("disabled", false);
		$("#rep_removeMedia").attr("disabled", false);
		$("#rep_addMedia").attr("disabled", false);
		$("#rep_mediaText").removeClass("disableTextClass");
		$("#rep_mediaSelectedText").removeClass("disableTextClass");
		$("#rep_removeMedia").attr("disabled", false);
		$("#rep_removeMedia").removeClass("disableTextClass");
		$("#rep_addMedia").attr("disabled", false);
		$("#rep_addMedia").removeClass("disableTextClass");
		
		$("#rep_territorySelector").attr("disabled", false);
		$("#rep_territorySelected").attr("disabled", false);
		$("#rep_removeTerritory").attr("disabled", false);
		$("#rep_addTerritory").attr("disabled", false);
		$("#rep_territoryText").removeClass("disableTextClass");
		$("#rep_territoryGroups").data("kendoMultiSelect").enable(true);
		$("#rep_territoryGroups").data("kendoMultiSelect").value([]);
		$("#rep_territoryGroupsText").removeClass("disableTextClass");
		$("#rep_territorySelectedText").removeClass("disableTextClass");
		$("#rep_removeTerritory").attr("disabled", false);
		$("#rep_removeTerritory").removeClass("disableTextClass");
		$("#rep_addTerritory").attr("disabled", false);
		$("#rep_addTerritory").removeClass("disableTextClass");
		
		$("#rep_languageSelector").attr("disabled", false);
		$("#rep_languageSelected").attr("disabled", false);
		$("#rep_removeLanguage").attr("disabled", false);
		$("#rep_addLanguage").attr("disabled", false);
		$("#rep_languageText").removeClass("disableTextClass");	
		$("#rep_languageGroups").data("kendoMultiSelect").enable(true);
		$("#rep_languageGroups").data("kendoMultiSelect").value([]);
		$("#rep_languageGroupsText").removeClass("disableTextClass");
		$("#rep_languageSelectedText").removeClass("disableTextClass");
		$("#rep_removeLanguage").attr("disabled", false);
		$("#rep_removeLanguage").removeClass("disableTextClass");
		$("#rep_addLanguage").attr("disabled", false);
		$("#rep_addLanguage").removeClass("disableTextClass");
		
		$("#rep_timePeriodText").removeClass("disableTextClass");		
		$("#rep_timePeriodAnytime").attr("disabled", false);
		$("#rep_timePeriodAnytime")[0].checked = true;		
		$("#rep_timePeriodThroughout").attr("disabled", false);
		$("#rep_timePeriodThroughout")[0].checked = false;
		$("#rep_fromTimePeriod").data("kendoDatePicker").enable(true);
		$("#rep_fromTimePeriod").data("kendoDatePicker").value("");		
		$("#rep_fromIncludeTBA").attr("disabled", false);
		$("#rep_fromIncludeTBA")[0].checked = false;
		$("#rep_toTimePeriod").data("kendoDatePicker").enable(true);
		$("#rep_toTimePeriod").data("kendoDatePicker").value("");
		$("#rep_toIncludeTBA")[0].checked = false;
		$("#rep_toIncludeTBA").attr("disabled", false);
		
		$("#rep_infoCodeTypesText").removeClass("disableTextClass");
		$("#rep_infoCodeGroups").data("kendoMultiSelect").enable(true);
		$("#rep_infoCodeGroups").data("kendoMultiSelect").value([]);
		$("#rep_infoCodeSeverityText").removeClass("disableTextClass");
		$("#rep_infoCodeSeverity").data("kendoDropDownList").enable(true);
		$("#rep_infoCodeSeverity").data("kendoDropDownList").value([]);
		$("#rep_infoCodesText").removeClass("disableTextClass");		
		$("#rep_infoCodeSelector").attr("disabled", false);
		$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").clear();
		$("#rep_removeInfoCodeAdd").attr("disabled", false);
		$("#rep_removeInfoCodeAdd").removeClass("disableTextClass");
		$("#rep_addInfoCodeAdd").attr("disabled", false);
		$("#rep_addInfoCodeAdd").removeClass("disableTextClass");
		$("#rep_removeInfoCodeRemove").removeClass("disableTextClass");
		$("#rep_addInfoCodeRemove").removeClass("disableTextClass");		
		$("#rep_infoCodeAny").attr("disabled", false);
		$("#rep_infoCodeAny")[0].checked = true;		
		$("#rep_infoCodeAll").attr("disabled", false);
		$("#rep_infoCodeAll")[0].checked = false;
		$("#rep_infoCodeAddSelectedAnyText").removeClass("disableTextClass");
		$("#rep_infoCodeAddSelectedAllText").removeClass("disableTextClass");
		$("#rep_infoCodeAddSelectedNoneText").removeClass("disableTextClass");
		$("#rep_infoCodeRemoveSelectedText").removeClass("disableTextClass");
		$("#rep_infoCodeRemoveSelectedText").css("color", "#a95250");
		$("#rep_infoCodeAddSelected").attr("disabled", false);
		$("#rep_infoCodeRemoveSelected").attr("disabled", false);
		
		$("#rep_subrightsSalesAndMarketingText").removeClass("disableTextClass");		
		$("#rep_subrightsSalesAndMarketing").attr("disabled", false);
		$("#rep_subrightsSalesAndMarketing").data("kendoHierarchySelector").clear();
		
		$("#rep_dateOptionText").removeClass("disableTextClass");		
		$("#rep_dateOption").attr("disabled", false);
		$("#rep_dateOption").data("kendoDropDownList").value([]);
		
		$("#rep_dateOptionFromText").removeClass("disableTextClass");		
		$("#rep_dateOptionFrom").data("kendoDatePicker").enable(true);
		$("#rep_dateOptionFrom").data("kendoDatePicker").value("");
		$("#rep_dateOptionFromTBAText").removeClass("disableTextClass");		
		$("#rep_dateOptionFromTBA").attr("disabled" , false);
		$("#rep_dateOptionFromTBA")[0].checked = false;
		
		$("#rep_dateOptionToText").removeClass("disableTextClass");		
		$("#rep_dateOptionTo").data("kendoDatePicker").enable(true);
		$("#rep_dateOptionTo").data("kendoDatePicker").value("");
		$("#rep_dateOptionToTBAText").removeClass("disableTextClass");		
		$("#rep_dateOptionToTBA").attr("disabled" , false);
		$("#rep_dateOptionToTBA")[0].checked = false;
		
		$("#rep_legalConfirmationStatusText").removeClass("disableTextClass");		
		$("#rep_legalConfirmationStatus").data("kendoDropDownList").enable(true);
		$("#rep_legalConfirmationStatus").data("kendoDropDownList").value([]);
		
		$("#rep_productInformationCodeText").removeClass("disableTextClass");		
		$("#rep_productInformationCode").data("kendoDropDownList").enable(true);
		$("#rep_productInformationCode").data("kendoDropDownList").value([]);
		
		$("#rep_doNotLicenseText").removeClass("disableTextClass");		
		$("#rep_doNotLicense").data("kendoDropDownList").enable(true);
		$("#rep_doNotLicense").data("kendoDropDownList").value(-1);
		
		$("#rep_futureMediaText").removeClass("disableTextClass");		
		$("#rep_futureMedia").data("kendoDropDownList").enable(true);
		$("#rep_futureMedia").data("kendoDropDownList").value(-2);
		
		$("#rep_contractualPartyTypeText").removeClass("disableTextClass");		
		$("#rep_contractualPartyType").data("kendoDropDownList").enable(true);
		$("#rep_contractualPartyType").data("kendoDropDownList").value([]);
		
		$("#rep_contractualPartyText").removeClass("disableTextClass");		
		$("#rep_contractualParty").data("kendoComboBox").enable(true);
		$("#rep_contractualParty").data("kendoComboBox").value([]);
		
		$("#rep_foxEntityText").removeClass("disableTextClass");		
		$("#rep_foxEntity").data("kendoComboBox").enable(true);
		$("#rep_foxEntity").data("kendoComboBox").value([]);
		
		$("#rep_contactsText").removeClass("disableTextClass");		
		$("#rep_contacts").attr("disabled", false);
		if($("#rep_contacts").data("kendoHierarchySelector")){
			$("#rep_contacts").data("kendoHierarchySelector").clear();
		}
		
		$("#rep_mediaSelector").data("kendoHierarchySelector").populateSelectorAlt();
		$("#rep_territorySelector").data("kendoHierarchySelector").populateSelectorAlt();
		$("#rep_languageSelector").data("kendoHierarchySelector").populateSelectorAlt();
		$("#rep_infoCodeSelector").data("kendoInfoCodeSelector").populateSelectorAlt();
	  } catch(ex) {}
	};
	
	/**
	 * 
	 */
	this.disableMethodOfTransmission = function(){
		$("#rep_methodOfTransmissionText").addClass("disableTextClass");
		if($("#rep_methodOfTransmission").data("kendoHierarchySelector")){
			$("#rep_methodOfTransmission").data("kendoHierarchySelector").clear();
		}
		$("#rep_methodOfTransmission").attr("disabled", true);
	};
	
	/**
	 * 
	 */
	this.enableMethodOfTransmission = function(){
		$("#rep_methodOfTransmissionText").removeClass("disableTextClass");
		$("#rep_methodOfTransmission").attr("disabled", false);
	};
	
	/**
	 * 
	 */
	this.resetFromMOT = function(){
		if($("#rep_methodOfTransmission").data("kendoHierarchySelector").getSelected().length > 0){
			$("#rep_methodOfTransmission").data("kendoHierarchySelector").setSelected([]);
			this.enableWithoutMOT();
		}		
	};
	
	/**
	 * 
	 */
	this.enableDisableAddRightsGroup = function(){
		if(this.queryViewModel.get("reportId") == this.reportIndexes.AVAILS_REPORT){
			var mediaSelected = $("#rep_mediaSelector").data("kendoHierarchySelector").getAccumulated();
			var territorySelected = $("#rep_territorySelector").data("kendoHierarchySelector").getAccumulated();
			var languageSelected = $("#rep_languageSelector").data("kendoHierarchySelector").getAccumulated();
			b = mediaSelected && territorySelected && languageSelected;
			b = b && (mediaSelected.length > 0) && (territorySelected.length > 0) && (languageSelected.length > 0);
			if(b){
				//We enable the Add Rights Group button
				$("#rep_addToRightsGroup").attr('disabled', false);
			}
			else {
				$("#rep_addToRightsGroup").attr('disabled', true);
			}			
		}		
	};
	
	/**
	 * 
	 */
	this.bindChangeEvent = function(reportId){
		var that = this;
		$("#rep_addToRightsGroup").attr('disabled', true);
		$("#rep_mediaSelector").unbind("change");		
		$("#rep_territorySelector").unbind("change");		
		$("#rep_languageSelector").unbind("change");
		
		
		if(reportId == this.reportIndexes.AVAILS_REPORT){
			var onChange = function(){
				setTimeout(function(){
					that.enableDisableAddRightsGroup();
				}, 500);
				
			};
			$("#rep_mediaSelector").bind("change", onChange);
			
			$("#rep_territorySelector").bind("change", onChange);
			
			$("#rep_languageSelector").bind("change", onChange);
			
			$("#rep_addMedia").bind("click", onChange);
			$("#rep_addTerritory").bind("click", onChange);
			$("#rep_addLanguage").bind("click", onChange);
		}
	};
	
	/**
	 * 
	 */
	this.resetMTLFields = function(){
		$("#rep_mediaSelector").data("kendoHierarchySelector").clear();
		$("#rep_territorySelector").data("kendoHierarchySelector").clear();
		$("#rep_languageSelector").data("kendoHierarchySelector").clear();
		
		$("#rep_mediaSelector").data("kendoHierarchySelector").populateSelectorAlt();
		$("#rep_territorySelector").data("kendoHierarchySelector").populateSelectorAlt();
		$("#rep_languageSelector").data("kendoHierarchySelector").populateSelectorAlt();
	};
	
	/**
	 * 
	 */
	this.disableDateOption = function(){
		$("#rep_dateOptionFrom").data("kendoDatePicker").value(null);
		$("#rep_dateOptionFrom").data("kendoDatePicker").enable(false);
		$("#rep_dateOptionTo").data("kendoDatePicker").value(null);
		$("#rep_dateOptionTo").data("kendoDatePicker").enable(false);
		$("#rep_dateOptionFromTBA")[0].checked = false;
		$("#rep_dateOptionFromTBA").attr('disabled', true);
		$("#rep_dateOptionToTBA")[0].checked = false;
		$("#rep_dateOptionToTBA").attr('disabled', true);
	};
	
	/**
	 * 
	 */
	this.enableDateOption = function(){
		$("#rep_dateOptionFrom").data("kendoDatePicker").value(null);
		$("#rep_dateOptionFrom").data("kendoDatePicker").enable(true);
		$("#rep_dateOptionTo").data("kendoDatePicker").value(null);
		$("#rep_dateOptionTo").data("kendoDatePicker").enable(true);
		$("#rep_dateOptionFromTBA")[0].checked = false;
		$("#rep_dateOptionFromTBA").attr('disabled', false);
		$("#rep_dateOptionToTBA")[0].checked = false;
		$("#rep_dateOptionToTBA").attr('disabled', false);
	};
	
	this.setProductInquiryDefaultDateOption = function(){
		$("#rep_dateOption").data("kendoDropDownList").value(1);
		$("#rep_dateOptionFrom").data("kendoDatePicker").value(null);
		$("#rep_dateOptionFrom").data("kendoDatePicker").enable(true);
		$("#rep_dateOptionTo").data("kendoDatePicker").value(null);
		$("#rep_dateOptionTo").data("kendoDatePicker").enable(true);
		$("#rep_dateOptionFromTBA")[0].checked = true;
		$("#rep_dateOptionFromTBA").attr('disabled', false);
		$("#rep_dateOptionToTBA")[0].checked = true;
		$("#rep_dateOptionToTBA").attr('disabled', false);
	};
	
	/* Microstrategy/ERM Reports Integration: BEGIN */
	this.dynamicReport = function(reportData){
		$.getJSON("rest/report/reportsIntegration?reportName="+reportData.reportNameStr +"&reportFormat="+reportData.reportNameType, function(data) {
			console.log("data: %o", data);
			console.log("reportData: %o", reportData);
			console.log("format: " + reportData.reportNameFormat);
			console.log("name: " + reportData.reportNameStr);
			console.log("type: " + reportData.reportNameType);
			console.log("evt: " + data.evt);
		
			
			console.log(this.documentID);
	     	console.log(this.server);
	     
	     	var valuePromptAnswers = reportData.queryId + "^'" + reportData.userName + "'";
	     	
	     	console.log("valuePromptAnswer: " + valuePromptAnswers);
	     	
	     	var evt=data.evt; 
			var executionMode=data.executionMode;
	    	var src=data.src;
	    	var project=data.project;
	     	var documentID = data.documentID; 
			var server = data.serverName; 
			var msUrl = data.microStrategyUrl;
			
			console.log(valuePromptAnswers);
			console.log(documentID);
	     	console.log(server);
	     	console.log(msUrl);
	     	
	     	
	    	$('body')
	        .append('<form name="mstr", target="_blank", id="mstr"></form>'); 
	    	//.append('<form name="mstr", formtarget="'+this.rep_redirectUrlWindow+'", id="mstr"></form>'); 
	    	$('#mstr') 
	        	.attr("action", msUrl) .attr("method","post")
	        	.append('<input type="hidden" name="valuePromptAnswers" id="valuePromptAnswers" value=""/>')
	        	.append('<input type="hidden" name="evt" id="evt" value=""/>')
	        	.append('<input type="hidden" name="executionMode" id="executionMode" value=""/>')
	        	.append('<input type="hidden" name="src" id="src" value=""/>')
	        	.append('<input type="hidden" name="documentID" id="documentID" value=""/>')
	        	.append('<input type="hidden" name="server" id="server" value=""/>')
	        	.append('<input type="hidden" name="project" id="project" value=""/>');
	        	
	    	
	     	  $('#valuePromptAnswers').val(valuePromptAnswers);
	     	  $('#evt').val(evt);
	     	  $('#src').val(src);
	     	  $('#executionMode').val(executionMode);
	     	  $('#documentID').val(documentID);
	     	  $('#server').val(server);
	     	  $('#project').val(project);
	     	
	     	  window.document.forms[0].submit();
	     	  
	     	 $('#mstr').remove();
	     	
		}).done(function(){
			
		});
		
					
	};
	/* Microstrategy/ERM Reports Integration: END */
	/******************************************************************************************************
	 *                                                                                                    *
	 *                                END business logic section                                          *
	 *                                                                                                    *
	 ******************************************************************************************************/
}

var rep_reportManagementObject = new ReportManagement();
var rep_reportQueryManagementPopupWindow = null;
var rep_runReportWindow = null;



