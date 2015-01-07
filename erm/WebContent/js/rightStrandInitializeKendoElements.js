function kendoElementInit(rightStrandObject, rcscope){
	
	this.rightStrandObject = rightStrandObject;
	this.rcscope = null;
	this.path = paths();
	this.infoCodePopupWindowCallBackFunction = null;
	this.mediaBool = false;
	this.characterAccumulator = new String();
	this.timeKeeper = new Date().getTime();
	this.keyPressTimer = new Date().getTime();
	
	
	/**
	 * Kendo media tree view initialization
	 */
	/*
	this.initMediaTreeView = function initMediaTreeView(){
		console.log(" INITIALIZING MEDIA TREE ");
		var mediaDataSource = new kendo.data.HierarchicalDataSource({
            transport: {
                read: 
               {
                    url: this.path.getFoxMediaNodesRESTPath(),
                    dataType: "json"
               }
            },
            schema: {
            	model: {
                    id: "id",
                    children: "items"
                }
            }
            
        });
        
        $("#mediaTreeView").kendoTreeView({
            checkboxes: {
                checkChildren: true
            },
			
            dataSource: mediaDataSource,
            dataTextField: ["text"],
            dataValueField : "id"
        });
        
        $("#mediaTreeView").focusin(function(){
        	this.characterAccumulator = new String("");
        	this.mediaBool = true;
        });
        
        $("#mediaTreeView").focusout(function(){
        	this.mediaBool = false;
        });
        
        $("#mediaTreeView").keypress(function(evt){       	
        	if(this.mediaBool){
        		kendoElementInit.searchTreeForNameMatch($("#mediaTreeView").data("kendoTreeView"), evt);        		       		
        	}
        });
        
        $("#mediaTreeView").data("kendoTreeView").dataSource.bind("change", function() {
            var treeView = $("#mediaTreeView").data("kendoTreeView"),
                message,
                checkedName = [];

            kendoElementInit.rightStrandObject.processMessage(treeView.dataSource.view(), checkedName);

            if (checkedName.length > 0) {
                message = checkedName.join("<br>");
            } else {
                message = "No media selected";
            }

            $("#mediaTreeNodePanel").html(message);
        });
        
	};
	*/
	/**
	 * Language tree view initialization
	 */
	/*
	this.initLanguageTreeView = function initLanguageTreeView(){
		console.log(" INITIALIZING LANGUAGE TREE ");
		var languageDataSource = new kendo.data.HierarchicalDataSource({
            transport: {
                read: 
               {
                    url: this.path.getFoxLanguageNodesRESTPath(), //"/erm/rest/Language/languageNodes",
                    dataType: "json"
               }
            },
            schema: {
            	model: {
                    id: "id",
                    children: "items"
                }
            }
            
        });
        
        $("#languageTreeView").kendoTreeView({
            checkboxes: {
                checkChildren: true
            },
			
            dataSource: languageDataSource,
            dataTextField: ["text"]
        });

        // show checked node IDs on datasource change
        $("#languageTreeView").data("kendoTreeView").dataSource.bind("change", function() {
            var treeView = $("#languageTreeView").data("kendoTreeView"),
                message,
                checkedName = [];

            kendoElementInit.rightStrandObject.processMessage(treeView.dataSource.view(), checkedName);

            if (checkedName.length > 0) {
                message = checkedName.join("<br>");
            } else {
                message = "No language selected";
            }

            $("#languageTreeNodePanel").html(message);
        });
	};
	*/
	/**
	 * Territory tree view initialization
	 */
	/*
	this.initTerritoryTreeView = function initTerritoryTreeView(){
		console.log(" INITIALIZING TERRITORY TREE ");
        var territoryDataSource = new kendo.data.HierarchicalDataSource({
            transport: {
                read: 
               {
                    url: this.path.getFoxTerritoryNodesRESTPath(),
                    dataType: "json"
               }
            },
            schema: {
            	model: {
                    id: "id",
                    children: "items"
                }
            }
            
        });
        
        $("#territoryTreeView").kendoTreeView({
            checkboxes: {
                checkChildren: true
            },
			
            dataSource: territoryDataSource,
            dataTextField: ["text"]
        });
        
        // show checked node IDs on datasource change
        $("#territoryTreeView").data("kendoTreeView").dataSource.bind("change", function() {
            var treeView = $("#territoryTreeView").data("kendoTreeView"),
                message,
                checkedName = [];

            kendoElementInit.rightStrandObject.processMessage(treeView.dataSource.view(), checkedName);

            if (checkedName.length > 0) {
                message = checkedName.join("<br>");
            } else {
                message = "No territory selected";
            }

            $("#territoryTreeNodePanel").html(message);
        });
	};
	*/
	/**
	 * Restriction tree view initialization
	 */
	/*
	this.initRestrictionTreeView = function initRestrictionTreeView(){
		console.log(" INITIALIZING RESTRICTION TREE ");
		var restrictionDataSource = new kendo.data.HierarchicalDataSource({
            transport: {
                read: 
               {
                    url: kendoElementInit.path.getRestrictionCodeSortedRESTPath(), //"/erm/rest/Restrictions/sortedByCode",
                    dataType: "json"
               }
            },
            schema: {
            	model: {
                    id: "id",
                    children: false
                }
            }
            
        });
		
		$("#restrictionTreeView").kendoTreeView({
            checkboxes: {
                checkChildren: false
            },
			
            dataSource: restrictionDataSource,
            dataTextField: ["description", "code"],
            template : "#= item.code#, #= item.description#"
            
        });
                
        // show checked node IDs on datasource change
        $("#restrictionTreeView").data("kendoTreeView").dataSource.bind("change", function() {
            var treeView = $("#restrictionTreeView").data("kendoTreeView"),
                message,
                checkedName = [],
                nodeIds = [];
                
            kendoElementInit.rightStrandObject.processRestrictionMessage(treeView.dataSource.view(), checkedName, nodeIds);
            kendoElementInit.rightStrandObject.clearNonIncludedSelectedRestriction(nodeIds);
			
            if (checkedName.length > 0) {
                message = checkedName.join("<br>");
                $("#addEditButton").removeClass('disabled');
            } else {
                message = "No restriction selected";
                $("#addEditButton").addClass('disabled');
            }
            $("#restrictionTreeNodePanel").html(message);
            $("#infoCodeAlternateDateDisplay").html(kendoElementInit.rightStrandObject.builRestrictionDisplay(kendoElementInit.rightStrandObject));
        });
	};
	*/
	/**
	 * Territory group multiselect box initialization
	 */
	/*
	this.initTerritoryGroupBox = function initTerritoryGroupBox(){
		if(!$("#territoryGroups").data("kendoMultiSelect")){
			console.log(" INITIALIZING TERRITORY GROUP TREE ");
			var territoryGroupDatasource = new kendo.data.DataSource({
	    		transport: {
	                   read: {
	                       dataType: "json",
	                       url: kendoElementInit.path.getTerritoryGroupRESTPath() 
	                   }
	             }
	    	});
			
			var onTerritoryGroupChange = function(){			
				var tgm = $("#territoryGroups").data("kendoMultiSelect");
	    		var ttv = $("#territoryTreeView").data("kendoTreeView");
	    		if(tgm && ttv){
	    			
	    			
	    			var dataItems = tgm.dataItems();
	    			
	    			if(dataItems && dataItems.length > 0){		    				
	    				
	    				var checkedNodes = [];	    
	    				var territoryIds = [];
	    				for(var i = 0; i < dataItems.length; i++){
	    					territoryIds[i] = dataItems[i].territoryIds;		    					
	    				}	
	    				
	    				var treeViewData = ttv.dataSource.view();
	    				kendoElementInit.rightStrandObject.deselectAllNodes(treeViewData);		    						    						    							
	    				kendoElementInit.rightStrandObject.checkNodeOnGroupChange(treeViewData, checkedNodes, territoryIds);	
	    			}
	    			else {		    					    				
	    				var treeViewData = ttv.dataSource.view();		    				
	    				kendoElementInit.rightStrandObject.deselectAllNodes(treeViewData);		    				
	    				$("#territoryTreeNodePanel").html("No territory selected");		    						    				
	    			}
	    		}
			};
			
			if(!$("#territoryGroups").data("kendoMultiSelect")){
				$("#territoryGroups").kendoMultiSelect({
		            filter:"startswith",
		            maxSelectedItems : 4,
		            dataTextField: "name",
		            dataValueField: "id",
		            change : onTerritoryGroupChange,
		            dataSource: territoryGroupDatasource               
		        });
			}
		}
		
	};
	*/
	/**
	 * Language group box initialization
	 */
	/*
	this.initLanguageGroupBox = function initLanguageGroupBox(){
		if(!$("#languageGroups").data("kendoMultiSelect")){
			console.log(" INITIALIZING LANGUAGE GROUP TREE ");
			var onLanguageGroupChange = function(){
				
				var tgm = $("#languageGroups").data("kendoMultiSelect");
	    		var ttv = $("#languageTreeView").data("kendoTreeView");
	    		if(tgm && ttv){
	    			
	    			var dataItems = tgm.dataItems();
	    			
	    			if(dataItems && dataItems.length > 0){		    				
	    				
	    				var checkedNodes = [];	    
	    				var languageIds = [];
	    				for(var i = 0; i < dataItems.length; i++){
	    					languageIds[i] = dataItems[i].languageIds;		    					
	    				}	
	    						    				
	    				var treeViewData = ttv.dataSource.view();
	    				kendoElementInit.rightStrandObject.deselectAllNodes(treeViewData);		    							
	    				kendoElementInit.rightStrandObject.checkNodeOnGroupChange(treeViewData, checkedNodes, languageIds);		    				
	    			}
	    			else {		    					    				
	    				var treeViewData = ttv.dataSource.view();		    				
	    				kendoElementInit.rightStrandObject.deselectAllNodes(treeViewData);		    				
	    				$("#languageTreeNodePanel").html("No language selected");		    						    				
	    			}
	    		}
			};
			
			$("#languageGroups").kendoMultiSelect({
	            filter:"startswith",
	            maxSelectedItems : 4,
	            dataTextField: "languageGroupName",
	            dataValueField: "languageGroupId",
	            change : onLanguageGroupChange, 
	            dataSource: {
	                transport: {
	                    read: {
	                        dataType: "json",
	                        url: kendoElementInit.path.getLanguageGroupRESTPath() 
	                    }
	                }
	            }
	        });
			
		}
	
	};
	*/
	/**
	 * Rights strand kendo date picker initialization
	 */
	/*
	this.initDatePicker = function initDatePicker(){
		console.log(" INITIALIZING DATE PICKER ");
		var onStartContractualDateChange = function(){
        	var cdp = $("#startContractualDate").data("kendoDatePicker");
        	if(cdp.value != null){
        		var sds = $("#startDateStatus").data("kendoDropDownList");	        		
        		sds.value("1");
        	}
        	kendoElementInit.rightStrandObject.displayTermDate();
        };
        
        $("#startContractualDate").kendoDatePicker({
       		footer: "Today - #=kendo.toString(data, 'd') #",
       		change : onStartContractualDateChange,
       		format : "MM/dd/yyyy",
       		parseFormats : ["yyyy-MM-dd", "EEE, d MMM yyyy", "EEE, MMM d, ''yy"],
       		start : "year"
        });
        
        var onStartOverrideDateChange = function(){
        	kendoElementInit.rightStrandObject.displayTermDate();
        };
        $("#startOverrideDate").kendoDatePicker({
       		footer: "Today - #=kendo.toString(data, 'd') #",
       		change : onStartOverrideDateChange
        });
        
        var onEndContractualDateChange = function(){
        	var cdp = $("#endContractualDate").data("kendoDatePicker");
        	if(cdp.value != null){
        		var sds = $("#endDateStatus").data("kendoDropDownList");	        		
        		sds.value("1");
        	}
        	kendoElementInit.rightStrandObject.displayTermDate();
        };
        
        
        $("#endContractualDate").kendoDatePicker({
       		footer: "Today - #=kendo.toString(data, 'd') #",
       		change : onEndContractualDateChange,
       		format : "MM/dd/yyyy",
       		parseFormats : ["yyyy-MM-dd", "EEE, d MMM yyyy", "EEE, MMM d, ''yy"]
        });
       
        var onEndOverrideDateChange = function(){
        	kendoElementInit.rightStrandObject.displayTermDate();
        };
        
        $("#endOverrideDate").kendoDatePicker({
       		footer: "Today - #=kendo.toString(data, 'd') #",
       		change : onEndOverrideDateChange
        });
		
	};
	*/
	/**
	 * Rights strand date code initialization
	 */
	/*
	this.initDateCodeAndStatus = function initDateCodeAndStatus(){
		console.log(" INITIALIZING CODE AND STATUS ");
		/********************************************************************************************
	   	*                         START DATASOURCE DEFINITION FOR DATE CODE                         *
	   	*********************************************************************************************
	    var dateStatusDatasource = new kendo.data.DataSource({
	   		transport: {
	               read: 
	              {
	                   url: this.path.getAllDateStatusRESTPath(), //"/erm/rest/date/status",
	                   dataType: "json"
	              }
	           }
	   	});	
	   	
	   	var dateCodeDatasource = new kendo.data.DataSource({
	   		transport: {
	               read: 
	              {
	                   url: this.path.getAllDateCodesRESTPath(), //"/erm/rest/date/code",
	                   dataType: "json"
	              }
	           }
	   	});
	   	
	   	var partialDateCodeDatasource = new kendo.data.DataSource({
	   		transport: {
	               read: 
	              {
	                   url: "/erm/rest/date/partialCode",
	                   dataType: "json"
	              }
	           }
	   	});
	   	/********************************************************************************************
	   	*                         END DATASOURCE DEFINITION FOR DATE CODE                           *
	   	********************************************************************************************* 
		
		var onStartDateCodeChange = function(){
        	var sdc = $("#startDateCode").data("kendoDropDownList");
        	var selectedValue = sdc.dataItem();
        	if(selectedValue){
        		var sds = $("#startDateStatus").data("kendoDropDownList");
        		var cdp = $("#startContractualDate").data("kendoDatePicker");
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
        		kendoElementInit.rightStrandObject.displayTermDate();
        	}
        	else {
        		$("#startContractualDate").data("kendoDatePicker").enable(true);
        		$("#startDateStatus").data("kendoDropDownList").enable(true);
        	}
        };
         
        $("#startDateCode").kendoDropDownList({
            filter:"startswith",
            autoBind : true,
            dataTextField: "description",
            dataValueField: "id",
            // define custom template
            template: '<p>${ data.description }</p>',
            dataSource: partialDateCodeDatasource,
            change : onStartDateCodeChange
        });

        $("#startDateStatus").kendoDropDownList({
        	autoBind : false,
            filter:"startswith",
            dataTextField: "description",
            dataValueField: "id",
            // define custom template
            template: '<p>${ data.description }</p>',
            dataSource: dateStatusDatasource
        });
        
        var onEndDateCodeChange = function(){
        	var sdc = $("#endDateCode").data("kendoDropDownList");
        	var selectedValue = sdc.dataItem();
        	if(selectedValue){
        		var sds = $("#endDateStatus").data("kendoDropDownList");
        		var cdp = $("#endContractualDate").data("kendoDatePicker");
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
        		kendoElementInit.rightStrandObject.displayTermDate();
        	}
        	else {
        		$("#endContractualDate").data("kendoDatePicker").enable(true);
        		$("#endDateStatus").data("kendoDropDownList").enable(true);
        	}
        };
        
        $("#endDateCode").kendoDropDownList({
            filter:"startswith",
            dataTextField: "description",
            dataValueField: "id",
            // define custom template
            template: '<p>${ data.description }</p>',
            dataSource: dateCodeDatasource,
            change : onEndDateCodeChange
            
        });

        $("#endDateStatus").kendoDropDownList({
            filter:"startswith",
            dataTextField: "description",
            dataValueField: "id",
            // define custom template
            template: '<p>${ data.description }</p>',
            dataSource:dateStatusDatasource
        });
	};
	
	/**
	 * Rights strand kendo info code group initialization
	 *
	this.initInfoCodeGroup = function initInfoCodeGroup(){
		console.log(" INITIALIZING INFO CODE GROUP ");
		var infoGroupDataSource = new kendo.data.DataSource({
    		transport: {
                   read: {
                       dataType: "json",
                       url: this.path.getAllRestrictionGroupRESTPath() //"/erm/rest/Restrictions/group"
                   }
            }
    	});
    	
    	var onInfoCodeGroupChange = function(){
    		var icg = $("#infoCodeGroup").data("kendoMultiSelect");
    		var ictv = $("#restrictionTreeView").data("kendoTreeView");
    		if(icg && ictv){
    			
    			var icgSelected = icg.dataItems();
    			if(icgSelected && icgSelected.length > 0){
    				var ictvView = ictv.dataSource.view();
    				kendoElementInit.rightStrandObject.deselectAllNodes(ictvView);
    				kendoElementInit.rightStrandObject.processRestrictionGroupSelectionChange(ictvView, icgSelected);
    			}
    			else {
    				var ictvView = ictv.dataSource.view();
    				kendoElementInit.rightStrandObject.deselectAllNodes(ictvView);
    				kendoElementInit.rightStrandObject.clearNonIncludedSelectedRestriction(new Array());
    				$("#restrictionTreeNodePanel").html("No restriction selected");
    			}
    			$("#infoCodeAlternateDateDisplay").html(kendoElementInit.rightStrandObject.builRestrictionDisplay(kendoElementInit.rightStrandObject));
    		}
    		
    	};
    	
        $("#infoCodeGroup").kendoMultiSelect({
            filter:"startswith",
            dataTextField: "restrictionTypeCode",
            dataValueField: "restrictionTypeId",
            // define custom template
            template: '<p>${ data.restrictionTypeCode }</p>',
            dataSource: infoGroupDataSource,
            change : onInfoCodeGroupChange
        });
        
        var onCloseWindow = function(){
        	//kendoElementInit.rightStrandObject.cancel();
			kendoElementInit.rightStrandObject.resetFields();
        };
        
        if (!$("#rightStrandPopupWindow").data("kendoWindow")) {
			$("#rightStrandPopupWindow").kendoWindow({
                width: "1020px",
                height : "650px",
                minWidth : "1020px",
                minHeight : "650px",
                title: "",
                actions: [                    
                    "Maximize",
                    "Close"
                ],
                visible : false,
                close : onCloseWindow
            });
        }
		rightStrandPopupWindow = $("#rightStrandPopupWindow").data("kendoWindow");
		
	};
	*/
	/**
	 * Here we initialize the various bindings for elements on the right strand page.
	 */
	/*
	this.initElementBinding = function initElementBinding(){
		console.log(" INITIALIZING BINDING ELEMENTS ");
		$("#exclusion").bind("click", function(){
			if($(this)[0].checked){
				$("#infoCodeGroup").data("kendoMultiSelect").value("");
				$("#infoCodeGroup").data("kendoMultiSelect").enable(false);
				var rt = $("#restrictionTreeView").data("kendoTreeView");
				$("#strandSetName").data("kendoComboBox").enable(true);
				$("#territoryGroups").data("kendoMultiSelect").enable(true);
				$("#languageGroups").data("kendoMultiSelect").enable(true);
				kendoElementInit.rightStrandObject.deselectAllNodes(rt.dataSource.view());
				rt.enable(".k-item", false);
				kendoElementInit.rightStrandObject.disableTerm();
				kendoElementInit.rightStrandObject.enableDisableMTL(true);
				$("#addEditButton")[0].disabled = true;				
				$("#termDisplayDate").html("");
			}
		});
		
		$("#inclusion").bind("click", function(){
			if($(this)[0].checked){
				$("#infoCodeGroup").data("kendoMultiSelect").enable(true);
				$("#restrictionTreeView").data("kendoTreeView").enable(".k-item", true);
				$("#strandSetName").data("kendoComboBox").enable(true);
				kendoElementInit.rightStrandObject.enableTerm();
				kendoElementInit.rightStrandObject.enableDisableMTL(true);
				$("#territoryGroups").data("kendoMultiSelect").enable(true);
				$("#languageGroups").data("kendoMultiSelect").enable(true);
				$("#addEditButton")[0].disabled = false;
			}
		});
		
		$("#productInfoCodeType").bind("click", function(){
			if($(this)[0].checked){
				$("#infoCodeGroup").data("kendoMultiSelect").enable(true);
				$("#restrictionTreeView").data("kendoTreeView").enable(".k-item", true);
				$("#strandSetName").data("kendoComboBox").enable(false);
				$("#territoryGroups").data("kendoMultiSelect").enable(false);
				$("#languageGroups").data("kendoMultiSelect").enable(false);
				kendoElementInit.rightStrandObject.enableTerm();
				kendoElementInit.rightStrandObject.enableDisableMTL(false);
				$("#addEditButton")[0].disabled = false;
			}
		});
		
		$("#save").bind("click", function(){
			if($("#productInfoCodeType")[0].checked){
				kendoElementInit.rightStrandObject.createOrUpdateProductLevelRestrictions($("#restrictionTreeView").data("kendoTreeView").dataSource.view());
				$("#product-restrictions-grid").data("kendoGrid").refresh();
			}
			else {
				kendoElementInit.rightStrandObject.createRightStrandSubmit();
			}
			
		});
		
		$("#cancel").bind("click", function(){
			kendoElementInit.rightStrandObject.cancel();
			kendoElementInit.rightStrandObject.resetFields();
		});
		
		$("#termCheckbox").click(function(){			
			if(this.checked){
				$("#infoCodeTermAddEdit").css("visibility", "hidden");
				$("#infoCodeAlternateDateDisplay").css("visibility", "hidden");
			}
			else {
				$("#infoCodeTermAddEdit").css("visibility", "visible");
				$("#infoCodeAlternateDateDisplay").css("visibility", "visible");
				$("#infoCodeAlternateDateDisplay").html("");
				kendoElementInit.rightStrandObject.restrictionObject.resetFields();
			}
		});
		
	};
	*/
	/**
	 * Rights strand kendo strand set box initialization
	 */
	/*
	this.initStrandSet = function initStrandSet(){
		$("#strandSetName").kendoComboBox({
            filter:"startswith",
            dataTextField: "strandSetName",
            dataValueField: "rightStrandSetId",
            template: '<p>${ data.strandSetName }</p>',	                
        });
	};
	
	this.openInfoCodePopupWindow = function openInfoCodePopupWindow(dataSource){
		if(dataSource){
			var dataSourceArray = new Array();
			dataSourceArray = dataSource;
			var dataSource = new kendo.data.DataSource({
				data : dataSourceArray,
				pageSize: 40
			});
			$("#infoCodeGrid").data("kendoGrid").setDataSource(dataSource);
			var d = $("#addEditWindow").data("kendoWindow");
			d.setOptions({
				visible : true,
				modal : true
			});
			d.title("Modify Info Codes");
			d.center();
			d.open();
		}
	};
	
	var onInfoCodeSaveButtonClick = function(){
		kendoElementInit.saveInfoCodeWindowFromRightStrandPopup();
	};
	
	/**
	 * Setup for the restrictions coming from the Rights Strands creation popup window
	 * @param callbackFunction
	 *
	this.setupInfoCodeWindowFromRightStrandPopup = function setupInfoCodeWindowFromRightStrandPopup(callbackFunction){		
		//Setup the callback function
		this.infoCodePopupWindowCallBackFunction = callbackFunction; 
		
		//Get the source nodes for display in the grid
		var nodes = $("#restrictionTreeView").data("kendoTreeView").dataSource.view();
		
		//Underlying data source used by the grid.
		var infoCodePopupWindowDataSource = kendoElementInit.rightStrandObject.buildPopupInfoCodeArray(nodes);
		
		//We open the info code popup window
		this.openInfoCodePopupWindow(infoCodePopupWindowDataSource);
		
		this.clearInfoCodeCheckboxes();

	};
	
	
	
	this.setupInfoCodeWindowFromProductInfoCodeGrid = function setupInfoCodeWindowFromProductInfoCodeGrid(callbackFunction){
		//Setup the callback function
		this.infoCodePopupWindowCallBackFunction = callbackFunction;
		
		//Get the source nodes for display in the info code popup grid
		var nodes = $("#product-restrictions-grid").data("kendoGrid").dataSource.view();
		
		//dataSource used by the info grid
		var infoCodePopupWindowDataSource = kendoElementInit.rightStrandObject.buildPopupInfoCodeArrayForEdit(nodes);
		
		//We open the info code popup window
		this.openInfoCodePopupWindow(infoCodePopupWindowDataSource);
		
		this.clearInfoCodeCheckboxes();				
		
	};
	*/
	/**
	 * Rights strand kendo Info Code popup element initialization
	 */
	/*
	this.initInfoCodeWindowElements = function initInfoCodeWindowElements(){
		//console.log(" INITIALIZING INFO CODE POPUP WINDOW ");
		$("#addEditButton").click(function(){
			kendoElementInit.setupInfoCodeWindowFromRightStrandPopup(kendoElementInit.rightStrandObject.processPopupWindowInfoCode);			
		});			
		
		$("#startInfoCodeDate").kendoDatePicker({
       		footer: "Today - #=kendo.toString(data, 'd') #",
       		format : "MM/dd/yyyy",
       		parseFormats : ["yyyy-MM-dd", "EEE, d MMM yyyy", "EEE, MMM d, ''yy"]
        });
		
		$("#endInfoCodeDate").kendoDatePicker({
       		footer: "Today - #=kendo.toString(data, 'd') #",
       		format : "MM/dd/yyyy",
       		parseFormats : ["yyyy-MM-dd", "EEE, d MMM yyyy", "EEE, MMM d, ''yy"]
        });
		
		var dateCodeDatasource = new kendo.data.DataSource({
	   		transport: {
	               read: 
	              {
	                   url: this.path.getAllDateCodesRESTPath(), 
	                   dataType: "json"
	              }
	           }
	   	});
		
		/**
		 * Data source for the date code for the info code popup
		 *
		var partialDateCodeDatasource = new kendo.data.DataSource({
	   		transport: {
	               read: 
	              {
	                   url: "/erm/rest/date/partialCode",
	                   dataType: "json"
	              }
	           }
	   	});
		
		var onStartInfoCodeDateCodeChange = function(){
			var value = $("#startInfoCodeDateCode").data("kendoDropDownList").dataItem();
			if(value.id > -1){
				$("#startInfoCodeDate").data("kendoDatePicker").value("");
				$("#startInfoCodeDate").data("kendoDatePicker").enable(false);
			}
			else {
				$("#startInfoCodeDate").data("kendoDatePicker").enable(true);
			}
		};
		
		var onEndInfoCodeDateCodeChange = function(){
			var value = $("#endInfoCodeDateCode").data("kendoDropDownList").dataItem();
			if(value.id > -1){
				$("#endInfoCodeDate").data("kendoDatePicker").value("");
				$("#endInfoCodeDate").data("kendoDatePicker").enable(false);
			}
			else {
				$("#endInfoCodeDate").data("kendoDatePicker").enable(true);
			}
		};
		
		$("#startInfoCodeDateCode").kendoDropDownList({
            filter:"startswith",
            autoBind : false,
            dataTextField: "description",
            dataValueField: "id",
            // define custom template
            template: '<p>${ data.description }</p>',
            dataSource: partialDateCodeDatasource,
            change : onStartInfoCodeDateCodeChange
        });
		
		$("#endInfoCodeDateCode").kendoDropDownList({
            filter:"startswith",
            autoBind : false,
            dataTextField: "description",
            dataValueField: "id",
            // define custom template
            template: '<p>${ data.description }</p>',
            dataSource: dateCodeDatasource,
            change : onEndInfoCodeDateCodeChange
        });
		
				
		
		/**
		 * 
		 *
		var onDataBound = function(){
			var grid = this;
			var selectedIds = [];
			var checked = true;
			
			//handle checkbox change event
			grid.table.find("tr").find("td:first input").change(function(e){
				//console.log(" CHANGE EVENT FIRED UP : %o", e);
				var checkbox = $(this);				
				
				//We retrieve all the selected input
				var selected = grid.table.find("tr").find("td:first input:checked").closest("tr");								
				
				//We clear the old selections
				grid.clearSelection();
				
				//persist selection per page; We declare an array to hold the selected uid's in memory
		        var ids = selectedIds[grid.dataSource.page()] = [];
				
		        //We highlight all the selected rows and save the uid's in memory
				if (selected.length) {
		            grid.select(selected);
		            selected.each(function(idx, item) {
		               //Adding ids to buffer so that it can memorize the changes
		                ids.push($(item).data("uid"));
		            });
		        }
				
				//If the selectAll checkbox is checked we deselect it since one the checkbox 
				//has in fact been deselected.
				var c = checkbox.is(':checked');
				if(!c){
					$("#selectAllPopupInfoCodes").attr('checked', c);
				}
				
			});
			
			
			//select persisted rows (Occurs once when the data binding occurs)
			//Again only useful in the case where we have pagination
		    var ids = selectedIds[grid.dataSource.page()] || [];
		    
		    //Adding css to buffered rows
		    for (var idx = 0, length = ids.length; idx < length; idx++) {
		        var tr = grid.tbody.find("tr[data-uid='" + ids[idx] + "']");
		        tr.addClass("k-state-selected");
		        tr.find("td:first input").attr("checked", checked);
		    }
		    
		    //If header is checked then make all rows selected 
		    if($("#selectAllPopupInfoCodes").is(':checked') == true)
		    {
		        $('#infoCodeGrid').data('kendoGrid').tbody.find("tr").addClass('k-state-selected');
		        $('#infoCodeGrid').data('kendoGrid').tbody.find("tr").find("td:first input").attr("checked", checked);
		    }
		    
		    // Outside of change event; it will fire on page change
		    //if check box is checked then adding css to checked row
		    grid.table.find("tr").find("td:first input:checked").closest("tr").addClass('k-state-selected');
		    
		};
		
		$("#infoCodeGrid").kendoGrid({
			sortable: true,
			columns: [ 
                      { field: "checkboxValue", title: "<label><input type='checkbox' id='selectAllPopupInfoCodes'></label>", template : "<input type='checkbox' id='checkbox_#: data.id#' #: data.checkboxValue ? checked='checked' : '' #  class=\"check_row\">", width : "5%", sortable : false, filterable : false},
                      { field: "id", title: "Id", width : "5%"},
                      { field: "infoCode", title: "Info Code", width : "45%"},
                      { field: "type", title: "Type", width : "15%"},
                      { field: "startDate", title: "Start Date", width : "15%"},
                      { field: "endDate", title: "End Date", width : "15%"}
                  ],
			dataSource : {
				data : [{"checked":false,"id":"-1", "infoCode":"ABE,Abend","type":2,"startDate":"","endDate":""}]
			
			},
			height : 260,
			selectable : "multiple",
			dataBound : onDataBound,
			scrollable : true,
			pageable: {
                input: true,
                numeric: false
            }
        });
		
		/**
		 * Called when the checbox in the info code grid menu is clicked.
		 * It selects/deselects all the checkboxes. Upon completion of this
		 * code an dataBound event will be generated which will highlight
		 * all the rows of the grid
		 *
		$("#selectAllPopupInfoCodes").click(function (e) {

			var $cb = $(this);
			//console.log(" CB FUNCTION : %o", $(this);
			var checked = $cb.is(':checked');
			var grid = $('#infoCodeGrid').data('kendoGrid');
			
			//this portion of the code check/uncheck all the checkboxes
			grid.table.find("tr").find("td:first input").attr("checked", checked);

			//This code update the underlying data in the dataSource. In particular
			//it updates the checkboxValue field.
			var items = grid.dataSource.data();
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				item.set('checkboxValue', checked);
			}

			//If checkbox is unchecked them clear all rows
			//Removes all selection from the grid.
			if (!checked)
			{
				$("#infoCodeGrid").data("kendoGrid").clearSelection();
			}
			
		});
		
		
		$("#saveInfoCodeDate").click(function(){
			if(kendoElementInit.rightStrandObject.validateInfoCodePopup()){
				kendoElementInit.saveInfoCodeWindowFromRightStrandPopup();
			}			
		});
		
		$("#cancelInfoCodeDate").click(function(){
			kendoElementInit.clearInfoCodePopupWindow();
			infoCodePopupWindow.close();
			kendoElementInit.infoCodePopupWindowCallBackFunction = null;
			$("#saveInfoCodeDate").off("click", onInfoCodeSaveButtonClick);
		});
				
	};
	*/
	/**
	 * 
	 * @returns {Array}
	 */
	/*
	this.getSelectedInfoCodeIds = function getSelectedInfoCodeIds(){
		var selectedIds = [];
		var items = $("#infoCodeGrid").data("kendoGrid").dataSource.data();
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			
			if($("#checkbox_"+item.id)[0].checked){
				selectedIds.push(item);
			}
		}
		return selectedIds;
	};
	
	this.clearInfoCodeCheckboxes = function clearInfoCodeCheckboxes(){
		var items = $("#infoCodeGrid").data("kendoGrid").dataSource.data();
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			$("#checkbox_"+item.id)[0].checked = false;
		}
	};
	*/
	/**
	 * 
	 */
	/*
	this.clearInfoCodePopupWindow = function clearInfoCodePopupWindow(){
		$("#selectAllPopupInfoCodes").attr("checked", false);
		$("#infoCodeGrid").data("kendoGrid").clearSelection();
		$("#startInfoCodeDate").data("kendoDatePicker").value("");
		$("#startInfoCodeDate").data("kendoDatePicker").enable(true);
		$("#endInfoCodeDate").data("kendoDatePicker").value("");
		$("#endInfoCodeDate").data("kendoDatePicker").enable(true);
		$("#startInfoCodeDateCode").data("kendoDropDownList").value("-1");		
		$("#endInfoCodeDateCode").data("kendoDropDownList").value("-1");
		
	};
	*/
	/**
	 * 
	 */
	/*
	this.saveInfoCodeWindowFromRightStrandPopup = function saveInfoCodeWindowFromRightStrandPopup(){
		var infoCodePopupResults = new Object();
		infoCodePopupResults.grid = $("#infoCodeGrid").data("kendoGrid");
		infoCodePopupResults.startInfoCodeDateValue = $("#startInfoCodeDate").data("kendoDatePicker").value();
		infoCodePopupResults.endInfoCodeDateValue = $("#endInfoCodeDate").data("kendoDatePicker").value();
		infoCodePopupResults.startInfoCodeDateCode = $("#startInfoCodeDateCode").data("kendoDropDownList").value();
		infoCodePopupResults.endInfoCodeDateCode = $("#endInfoCodeDateCode").data("kendoDropDownList").value();
		infoCodePopupResults.startCodeText = $("#startInfoCodeDateCode").data("kendoDropDownList").text();
		infoCodePopupResults.endCodeText = $("#endInfoCodeDateCode").data("kendoDropDownList").text();
		
		//We use a callback function to process the result. This will give us flexibility
		//in using the popup window
		if($.isFunction(this.infoCodePopupWindowCallBackFunction)) {
			this.infoCodePopupWindowCallBackFunction(infoCodePopupResults);
			this.clearInfoCodePopupWindow();
			infoCodePopupWindow.close();
		}
		kendoElementInit.infoCodePopupWindowCallBackFunction = null;
	};
	*/
	/**
	 * Add/Edit info code popup
	 */
	/*
	this.initAddEditInfoCode = function initAddEditInfoCode(){
		if (!$("#addEditWindow").data("kendoWindow")) {
			$("#addEditWindow").kendoWindow({
                width: "750px",
                height : "570px",
                minWidth : "750px",
                minHeight : "570px",
                title: "",
                actions: [
                    "Maximize",
                    "Close"
                ],
                visible : false               
            });
        }
		infoCodePopupWindow = $("#addEditWindow").data("kendoWindow");
	};
	*/
	
	this.initializeSubmitWindow = function initializeSubmitWindow(){
		if (!$("#submitPopupWindow").data("kendoWindow")) {
			$("#submitPopupWindow").kendoWindow({
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
		submitPopupWindow = $("#submitPopupWindow").data("kendoWindow");
	};
	
		this.initializeDeleteWindow = function initializeDeleteWindow(){
		if (!$("#deletePopupWindow").data("kendoWindow")) {
			$("#deletePopupWindow").kendoWindow({
                width: "800px",
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
		deletePopupWindow = $("#deletePopupWindow").data("kendoWindow");
	};
	
	this.initializeDeleteConfirmationWindow = function initializeDeleteConfirmationWindow(){
		if (!$("#deleteConfirmationWindow").data("kendoWindow")) {
			$("#deleteConfirmationWindow").kendoWindow({
                width: "800px",
                height : "auto",
                minWidth : "450px",
                minHeight : "200px",
                title: "",
                actions: [],
                visible : false,
                close : function(){
                	$("#errorParagraph").html("");
                }
            });
        }
		deleteConfirmationWindow = $("#deleteConfirmationWindow").data("kendoWindow");
	};	
	
	this.initializeDoNotLicenseConfirmationWindow = function initializeDoNotLicenseConfirmationWindow(){
		if (!$("#doNotLicenseConfirmationWindow").data("kendoWindow")) {
			$("#doNotLicenseConfirmationWindow").kendoWindow({
                width: "800px",
                height : "auto",
                minWidth : "450px",
                minHeight : "200px",
                title: "",
                actions: [],
                visible : false,
                close : function(){
                	$("#errorParagraph").html("");
                }
            });
        }
		doNotLicenseConfirmationWindow = $("#doNotLicenseConfirmationWindow").data("kendoWindow");
	};	
	
	
	this.getCurrentAngularScope = function(){
		return angular.element(document.getElementById("rightsController")).scope();
	};
	
	/**
	 * 
	 */
	this.searchTreeForNameMatch = function(kendoTree, evt){
		
		var d = new Date().getTime();
		if((d - kendoElementInit.timeKeeper) > 3000){
			kendoElementInit.characterAccumulator = new String(String.fromCharCode(evt.which));       			
		}
		else {
			kendoElementInit.characterAccumulator = kendoElementInit.characterAccumulator.concat(String.fromCharCode(evt.which));
		}
		kendoElementInit.timeKeeper = d;
		kendoElementInit.rightStrandObject.kendoTreeKeySearch(kendoTree, kendoElementInit.characterAccumulator);  
	};
	
	/**
	 * We run this once the document is ready (document.ready)
	 */
	this.initKendoElements = function initKendoElements(rcscope){
		this.initializeDeleteWindow();
		this.initializeDeleteConfirmationWindow();	
		this.initializeDoNotLicenseConfirmationWindow();
	};
}

var kendoElementInit = new kendoElementInit(rightStrandObject);
var rightStrandPopupWindow = null;
var infoCodePopupWindow = null;
var mediaSource = null;
var languageSource = null;
var territorySource = null;





