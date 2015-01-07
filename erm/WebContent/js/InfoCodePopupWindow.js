function infoCodePopupWindow(){
		
	this.gridId = null;
	this.startCalendarId = null;
	this.endCalendarId = null;
	this.startCodeId = null;
	this.endCodeId= null;
	this.mainWindowId = null;
	this.saveButtonId = null;
	this.cancelButtonId = null;
	this.nodes = null;
	this.callBackfunction = null;
	this.icp_restrictionObject = null;
	this.infoCodePopupWindowCallBackFunction = null;
	this.popupWindowReference = null;
	this.path = paths();
	
	/***********************************************************************
	 * function used to initialize all the kendo element for the           *
	 * Add/Edit info code Dates (grid, start date, end date,               *
	 * date expressions                                                    *
	 ***********************************************************************/
	this.initInfoCodeWindowElements = function(){
		var that = this;
		$(this.startCalendarId).kendoDatePicker({
       		footer: "Today - #=kendo.toString(data, 'd') #",
       		format : "MM/dd/yyyy",
       		parseFormats : ["yyyy-MM-dd", "EEE, d MMM yyyy", "EEE, MMM d, ''yy"]
        });
		
		$(this.endCalendarId).kendoDatePicker({
       		footer: "Today - #=kendo.toString(data, 'd') #",
       		format : "MM/dd/yyyy",
       		parseFormats : ["yyyy-MM-dd", "EEE, d MMM yyyy", "EEE, MMM d, ''yy"]
        });
		
		var onStartInfoCodeDateCodeChange = function(){
			var value = infoCodePopupObject.startCodeId.data("kendoDropDownList").dataItem();
			if(value.id > -1){
				infoCodePopupObject.startCalendarId.data("kendoDatePicker").value("");
				infoCodePopupObject.startCalendarId.data("kendoDatePicker").enable(false);
			}
			else {
				infoCodePopupObject.startCalendarId.data("kendoDatePicker").enable(true);
			}
		};
		
		var onEndInfoCodeDateCodeChange = function(){
			var value = infoCodePopupObject.endCodeId.data("kendoDropDownList").dataItem();
			if(value.id > -1){
				infoCodePopupObject.endCalendarId.data("kendoDatePicker").value("");
				infoCodePopupObject.endCalendarId.data("kendoDatePicker").enable(false);
			}
			else {
				infoCodePopupObject.endCalendarId.data("kendoDatePicker").enable(true);
			}
		};
		
		//TODO use the static value from erm.dbvalues
		$.getJSON(this.path.getAllDateCodesRESTPath(), function(data){
	   		if(data){	   			
	   			var partialData = new Array();
	   			for(var i = 0; i < data.length; i++){
	   				if(data[i].id != 1){
	   					partialData.push(data[i]);
	   				}
	   			}
	   			$("#icp_startInfoCodeDateCode").kendoDropDownList({
	   	            filter:"startswith",
	   	            autoBind : false,
	   	            dataTextField: "description",
	   	            dataValueField: "id",
	   	            template: '<p>${ data.description }</p>',
	   	            dataSource: partialData,
	   	            change : onStartInfoCodeDateCodeChange
	   	        });
	   			
	   			$("#icp_endInfoCodeDateCode").kendoDropDownList({
	   	            filter:"startswith",
	   	            autoBind : false,
	   	            dataTextField: "description",
	   	            dataValueField: "id",
	   	            template: '<p>${ data.description }</p>',
	   	            dataSource: data,
	   	            change : onEndInfoCodeDateCodeChange
	   	        });
	   		}	   		
	   	});	
		
		
		/***********************************************************************
		 * Kend grid initialization code                                       *
		 ***********************************************************************/
		$("#icp_infoCodeGrid").kendoGrid({
			sortable: true,
			columns: [ 
                      { field: "checkboxValue", 
                    	title: "<label><input type='checkbox' id='selectAllPopupInfoCodes' class='selectAllPopupInfoCodesClass'></label>", 
                    	template : "<input type='checkbox' id='icp_checkbox_#: data.id#'  #: data.checkboxValue ? checked='checked' : '' #  class=\"check_row_infoCode_popup\">", 
                    	width : "5%", 
                    	sortable : false, 
                    	filterable : false},
                      { field: "id", title: "Id", width : "5%"},
                      { field: "infoCode", title: "Info Code", width : "45%", template : "#: data.code #, #: data.description#"},
                      { field: "type", title: "Type", width : "15%", template : "#: data.restrictionTypeName != null ? data.restrictionTypeName : ''#"},
                      { field: "startDate", title: "Start Date", width : "15%"},
                      { field: "endDate", title: "End Date", width : "15%"}
                  ],
			dataSource : {
				data : [{"checked":false,"id":"-1", "infoCode":"ABE,Abend","type":2,"startDate":"","endDate":""}]
			
			},
			selectable : "multiple",
			scrollable : false
			
        });
		
		/**
		 * Called when the checkbox in the info code grid menu is clicked.
		 * It selects/deselects all the checkboxes. Upon completion of this
		 * code an dataBound event will be generated which will highlight
		 * all the rows of the grid
		 */
		$(".selectAllPopupInfoCodesClass").click(function () {
			searchProductAllbound(this);			
		});
		
		var searchProductAllbound = function(that){
			var $cb = $(that);
			var checked = $cb.is(':checked');	
			var items = $("#icp_infoCodeGrid").data("kendoGrid").dataSource.data();
			for (var i = 0; i < items.length; i++) {
				var item = items[i];
				item.checkboxValue = checked;			
			}
			
			var checkboxes = $(".check_row_infoCode_popup");
			if(checkboxes){
				$.each(checkboxes, function(id, elem){
					elem.checked = checked;
				});
			}
			
			if (!checked)
			{
				$("#icp_infoCodeGrid").data("kendoGrid").clearSelection();
			}
			infoCodePopupObject.disableDates();
		};
		
		/***********************************************************************
		 * The function is responsible for saving the new dates for the info 
		 * codes. It clears and close the info popup window                         
		 ***********************************************************************/
		//NOTE it is important to unbind otherwise we'll get double clicks
		$(this.saveButtonId).off();
		$(this.saveButtonId).on('click',function(){
			if(that.validateInput()){
				infoCodePopupObject.saveInfoCodeWindowFromRightStrandPopup();
				infoCodePopupObject.popupWindowReference.close();
				infoCodePopupObject.clearInfoCodePopupWindow();
			}			
		});
		
		$(this.cancelButtonId).off();
		$(this.cancelButtonId).on('click',function(){
			infoCodePopupObject.clearInfoCodePopupWindow();
			infoCodePopupObject.popupWindowReference.close();			
		});	
		
		$("#icp_enableStartDate").unbind();
		$("#icp_enableStartDate").click(function(){
			if($(this)[0].checked){
				that.enableStartDate();
			}
			else {
				that.disableStartDate();
			}
		});
			
		$("#icp_enableEndDate").click(function(){
			if($(this)[0].checked){
				that.enableEndDate();
			}
			else {
				that.disableEndDate();
			}
		});
		
	};
	
	/**
	 * 
	 */
	this.buildPopupInfoCodeArray = function(nodes){
		   var retrictionTreeViewNodes = nodes;
		   var nodesAlreadySelected = this.icp_restrictionObject.getAllRestrictionIds();
		   var infoCodeDataSourceNodes = new Array();
		   if(retrictionTreeViewNodes != null && retrictionTreeViewNodes.length > 0){
			   for(var i = 0; i < retrictionTreeViewNodes.length; i++){
				   if(!retrictionTreeViewNodes[i].checked){
					   continue;
				   }
				   var nodeId = retrictionTreeViewNodes[i].id;
				   var infoCodeNode = new Object();
				   infoCodeNode.checkboxValue = false;
				   infoCodeNode.id = retrictionTreeViewNodes[i].id;
				   infoCodeNode.infoCode = retrictionTreeViewNodes[i].code + "," + retrictionTreeViewNodes[i].description;
				   infoCodeNode.type = retrictionTreeViewNodes[i].description;
				   infoCodeNode.startDate = "";
				   infoCodeNode.endDate = "";
				   if(nodesAlreadySelected.indexOf(nodeId) >= 0){				   				   
					   infoCodeNode.checkboxValue = true;	
					   var restriction =  this.icp_restrictionObject.getRestriction(nodeId);
					   if(restriction){
						   if(restriction.startDate){
							   infoCodeNode.startDate = restriction.getCustomDisplayDate(restriction.startDate);
						   }
						   else if(restriction.startDateCodeId){
							   infoCodeNode.startDate = restriction.startDateCodeText;
						   }
						   
						   if(restriction.endDate){
							   infoCodeNode.endDate = restriction.getCustomDisplayDate(restriction.endDate);
						   }
						   else if(restriction.endDateCodeId){
							   infoCodeNode.endDate = restriction.endDateCodeText;
						   }
					   }
				   }
				   infoCodeDataSourceNodes.push(infoCodeNode);
			   }
		   }
		   return infoCodeDataSourceNodes;
		   
	   };
	   
	   /**
	    * 
	    * @param infoCodePopupResults
	    */
	   this.processPopupWindowInfoCode = function(infoCodePopupResults){
		   var selectedCodes = this.processInfoCodesRightStrand(infoCodePopupResults, true);	
		   if(selectedCodes){
			   var resObject = new restrictionObject(null);
			   resObject.addRestriction(selectedCodes.selectedInfoCodeIds, selectedCodes.startDate, selectedCodes.endDate, selectedCodes.startInfoCodeDateCode, selectedCodes.endInfoCodeDateCode, selectedCodes.startCodeText, selectedCodes.endCodeText, selectedCodes.selectedInfoCodeTexts, selectedCodes.rightRestrictionIds);
			   return resObject;
		   }
	   };
	   
	   /**
	    * 
	    */
	   this.processPopupWindowInfoCodeNew = function(infoCodePopupResults){
		   var resObject = this.getSelectedRestrictions(infoCodePopupResults);
		   return resObject;
	   };
	
	   /**
	    * 
	    * @param infoCodePopupResults
	    * @param bool
	    * @returns {___selectedCodes8}
	    */
	   this.processInfoCodesRightStrand = function(infoCodePopupResults, bool){
		   var selectedCodes = this.addSelectedInfoCode(infoCodePopupResults);
		   var selCodes = this.getSelectedInfoCodeIds(infoCodePopupResults.grid.dataSource.data(), bool);
		   selectedCodes.selectedInfoCodeIds = selCodes.selectedIds;
		   selectedCodes.selectedInfoCodeTexts = selCodes.selectedInfoCodeTexts;
		   selectedCodes.rightRestrictionIds = selCodes.rightRestrictionIds;
		   return selectedCodes;
	   };
	   
	   /**
	    * 
	    */
	   this.getSelectedRestrictions = function(infoCodePopupResults){
		   var data = infoCodePopupResults.grid.dataSource.data();
		   var restrictions = [];
		   var startDate = null;
		   var startDateString = null;
		   if(infoCodePopupResults.startInfoCodeDateValue){
			   startDateString = infoCodePopupResults.startInfoCodeDateValueString;
			   startDate = Date.parse(infoCodePopupResults.startInfoCodeDateValue);
		   }
		   var endDate = null;
		   var endDateString = null;
		   if(infoCodePopupResults.endInfoCodeDateValue){
			   endDateString = infoCodePopupResults.endInfoCodeDateValueString;
			   endDate = Date.parse(infoCodePopupResults.endInfoCodeDateValue);
		   }
		   var timeId = (new Date()).getTime();
	  	   var commentId = $("#icp_commentSection input[name='commentId']").val();
		   
		   $.each(data, function(id, elem){
			   var infoCodeText = elem.code+","+elem.description;
			   if($("#icp_checkbox_"+elem.id)[0].checked){
				   var rest = new restriction(elem.id, startDate, infoCodePopupResults.startInfoCodeDateCode, endDate, infoCodePopupResults.endInfoCodeDateCode, infoCodeText, elem.productRestrictionId);
				   rest.endDateCodeText = infoCodePopupResults.endCodeText;
				   rest.startDateCodeText = infoCodePopupResults.startCodeText;
				   rest.rightRestrictionId = elem.rightRestrictionId;
				   rest.restrictionCode = elem.code;
				   
				   if(commentId){
					   rest.commentId = commentId;
					   rest.commentTimestampId = timeId;
				   }
				   rest.startDateString = startDateString;
				   rest.endDateString = endDateString;
				   rest.changeStartDate = infoCodePopupResults.changeStartDate;
				   rest.changeEndDate = infoCodePopupResults.changeEndDate;
				   restrictions.push(rest);
			   }
		   });
		   var resObject = new restrictionObject(null);
		   resObject.restrictions = restrictions;
		   return resObject;
	   };
	   
	   /**
	    * 
	    */
	   this.getSelectedInfoCodeIds = function(selectedRows, isCreate){
		   var selectedIds = [];
		   var selectedInfoCodeTexts = [];
		   var rightRestrictionIds = [];
		   var returnObject = new Object();
		   if(selectedRows && selectedRows.length > 0){
				for(var i = 0; i < selectedRows.length; i++){				
					if($("#icp_checkbox_"+selectedRows[i].id)[0].checked){
						var ob = new Object();
						if(isCreate){
							ob.restrictionId = selectedRows[i].id;
							ob.productRestrictionId = "";
						}
						else {
							
							ob.restrictionId = selectedRows[i].altRestrictionId;
							ob.productRestrictionId = selectedRows[i].id;
						} 
						rightRestrictionIds.push(selectedRows[i].rightRestrictionId);
						selectedIds.push(ob);
						selectedInfoCodeTexts.push(selectedRows[i].code+","+selectedRows[i].description);
					}				
				}			
			}
		   returnObject.selectedIds = selectedIds;
		   returnObject.selectedInfoCodeTexts = selectedInfoCodeTexts;
		   returnObject.rightRestrictionIds = rightRestrictionIds;
		   return returnObject;
	   };
	   
	   
	   /**
	    * Process the selected info codes from the info code popup window
	    */
	   this.addSelectedInfoCode = function(infoCodePopupResults){
		    var startInfoCodeDateValue = infoCodePopupResults.startInfoCodeDateValue; 
			var endInfoCodeDateValue = infoCodePopupResults.endInfoCodeDateValue; 
			var startInfoCodeDateCode = infoCodePopupResults.startInfoCodeDateCode; 
			var endInfoCodeDateCode = infoCodePopupResults.endInfoCodeDateCode; 
			
			var startDate = "";
			var endDate = "";
			var startCodeText = infoCodePopupResults.startCodeText; 
			var endCodeText = infoCodePopupResults.endCodeText; 
			
			if(startInfoCodeDateValue != null){
				startDate = Date.parse(startInfoCodeDateValue);
			}
			
			if(endInfoCodeDateValue != null){
				endDate = Date.parse(endInfoCodeDateValue);
			}
			
			var selectedInfoCodeTexts = [];
			
			var selectedInfoCodes = new Object();
			selectedInfoCodes.startDate = startDate;
			selectedInfoCodes.endDate = endDate;
			selectedInfoCodes.startInfoCodeDateCode = startInfoCodeDateCode;
			selectedInfoCodes.endInfoCodeDateCode = endInfoCodeDateCode;
			selectedInfoCodes.startCodeText = startCodeText;
			selectedInfoCodes.endCodeText = endCodeText;
			selectedInfoCodes.selectedInfoCodeTexts = selectedInfoCodeTexts;
			
			return selectedInfoCodes;		
	   };
	   
	   /**
	    * 
	    * @returns
	    */
	   this.builRestrictionDisplay = function(){
		   if(this.icp_restrictionObject.restrictions != null && this.icp_restrictionObject.restrictions.length > 0){
			   var displayArray = new Array();
			   for(var i = 0; i < this.icp_restrictionObject.restrictions.length; i++){
				   var r = this.icp_restrictionObject.restrictions[i];
				   var display = r.getCodeDateDisplayString();
				   if(display != null){
					   displayArray.push(r.getCodeDateDisplayString());
				   }
			   }
			   
			   return displayArray.join("<br>");
		   }	   
		   return "";
	   };
	   
	/**
	 * 
	 */   
	this.clearInfoCodePopupWindow = function(){
		$("#selectAllPopupInfoCodes").attr("checked", false);
		$("#icp_infoCodeGrid").data("kendoGrid").clearSelection();
		this.startCalendarId.data("kendoDatePicker").value("");
		this.startCalendarId.data("kendoDatePicker").enable(true);
		this.endCalendarId.data("kendoDatePicker").value("");
		this.endCalendarId.data("kendoDatePicker").enable(true);
		this.startCodeId.data("kendoDropDownList").value("-1");		
		this.endCodeId.data("kendoDropDownList").value("-1");
		$("#icp_informationCodeCommentTitle").val('');
		this.disableCommentBox();
		var a = $(".selectAllPopupInfoCodesClass");
		$.each(a, function(id, elem){
			elem.checked = false;
		});
		this.icp_restrictionObject.resetFields();
		
	};
	
	/**
	 * 
	 */
	this.saveInfoCodeWindowFromRightStrandPopup = function(){
		var infoCodePopupResults = new Object();
		infoCodePopupResults.grid = $("#icp_infoCodeGrid").data("kendoGrid");
		infoCodePopupResults.startInfoCodeDateValue = getCorrectDateFromKendoDatePicker("icp_startInfoCodeDate"); //this.startCalendarId.data("kendoDatePicker").value();		
		infoCodePopupResults.endInfoCodeDateValue = getCorrectDateFromKendoDatePicker("icp_endInfoCodeDate"); //this.endCalendarId.data("kendoDatePicker").value();		
		infoCodePopupResults.startInfoCodeDateCode = this.startCodeId.data("kendoDropDownList").value();
		infoCodePopupResults.endInfoCodeDateCode = this.endCodeId.data("kendoDropDownList").value();
		infoCodePopupResults.startCodeText = this.startCodeId.data("kendoDropDownList").text();
		infoCodePopupResults.endCodeText = this.endCodeId.data("kendoDropDownList").text();	
		infoCodePopupResults.changeStartDate = $("#icp_enableStartDate")[0].checked;
		infoCodePopupResults.changeEndDate = $("#icp_enableEndDate")[0].checked;
		infoCodePopupResults.startInfoCodeDateValueString = getCorrectDateFromKendoDatePickerAsString("icp_startInfoCodeDate");
		infoCodePopupResults.endInfoCodeDateValueString = getCorrectDateFromKendoDatePickerAsString("icp_endInfoCodeDate");
		
		//We use a callback function to process the result. This will give us flexibility
		//in using the popup window
		
		//var resObject = this.processPopupWindowInfoCode(infoCodePopupResults);
		var resObject = this.processPopupWindowInfoCodeNew(infoCodePopupResults);
  		var commentId = $("#icp_commentSection input[name='commentId']").val();
  		resObject.commentId = commentId;
		
		
		if(resObject.commentId){
			var l = new Date();
			resObject.commentTimestampId = l.getTime();
		}
		if($.isFunction(this.infoCodePopupWindowCallBackFunction)) {
			this.infoCodePopupWindowCallBackFunction(resObject);			
		}		
		this.infoCodePopupWindowCallBackFunction = null;
		
		var a = $(".selectAllPopupInfoCodesClass");
		$.each(a, function(id, elem){
			elem.checked = false;
		});
		
		this.disableCommentBox();
	};
	
	/**
	 * 
	 * 
	 */
	this.initializeInfoCodePopupWindow = function(){
		if(!this.gridId){
			this.gridId = $("#icp_infoCodeGrid");
		}
		if(!this.startCalendarId || !$("#icp_startInfoCodeDate").data("kendoDatePicker")){
			this.startCalendarId = $("#icp_startInfoCodeDate");
		}
		
		if(!this.endCalendarId || !$("#icp_endInfoCodeDate").data("kendoDatePicker")){
			this.endCalendarId = $("#icp_endInfoCodeDate");
		}
		if(!this.startCodeId || !$("#icp_startInfoCodeDateCode").data("kendoDropDownList")){
			this.startCodeId = $("#icp_startInfoCodeDateCode");
		}
		if(!this.endCodeId || !$("#icp_endInfoCodeDateCode").data("kendoDropDownList")){
			this.endCodeId= $("#icp_endInfoCodeDateCode");
		}
		this.saveButtonId = $("#icp_saveInfoCodeDate");
		this.cancelButtonId = $("#icp_cancelInfoCodeDate");
		
		this.icp_restrictionObject = new restrictionObject();
		
		this.initInfoCodeWindowElements();
		
		this.initializeCommentBox();
	};
	
	/**
	 * 
	 */
	this.setGridDataSource = function(ds, wReference, callbackFunction){
		this.popupWindowReference = wReference;
		this.infoCodePopupWindowCallBackFunction = callbackFunction;
		if($("#icp_infoCodeGrid") && ds){
			var dataSourceArray = new Array();
			dataSourceArray = ds;
			var dataSource = new kendo.data.DataSource({
				data : dataSourceArray,
				pageSize: 40
			});
			$("#icp_infoCodeGrid").data("kendoGrid").setDataSource(dataSource);
			$(".check_row_infoCode_popup").unbind();
			$(".check_row_infoCode_popup").click(function(){
				searchProductCheckboxEvent(this);
			});
		}
		this.enableCommentBox();
	};
	
	/**
	 * 
	 */
	var searchProductCheckboxEvent = function(that){
		var grid = $("#icp_infoCodeGrid").data('kendoGrid');
		var checked = $(that).is(":checked");
		var st = $(that).attr('id');
		var mark = "icp_checkbox_";
		var id = st.substring(st.indexOf(mark)+mark.length);
		var items = $("#icp_infoCodeGrid").data("kendoGrid").dataSource.data();
		for (var i = 0; i < items.length; i++) {
			var item = items[i];			
			if(item.id == id){
				item.checkboxValue = checked;
				var rows = grid.tbody.find("tr");
				$.each(rows, function(id, elem){
					var idString = $(elem).find("td:first input").attr("id");
					if(idString == st){
						if(checked){
							//$(elem).addClass("k-state-selected");
						}
						else {
							//$(elem).removeClass("k-state-selected");
						}
					}
				});
			}				
		}
		if(!checked) {
			var a = $(".selectAllPopupInfoCodesClass");
			$.each(a, function(id, elem){
				elem.checked = checked;
			});
		}
		infoCodePopupObject.disableDates();
	};
	
	this.disableDates = function(){
		this.resetDates();
		var items = $("#icp_infoCodeGrid").data("kendoGrid").dataSource.data();
		if(items && items.length > 0){
			for(var i = 0; i < items.length; i++){
				var item = items[i];
				if(item.checkboxValue && item.allowStartDateFlag && item.allowStartDateFlag == 'N'){
					this.disableStartDate();
					$("#icp_enableStartDate")[0].checked = false;
					$("#icp_enableStartDate").attr('disabled', true);
				}
				if(item.checkboxValue && item.allowEndDateFlag && item.allowEndDateFlag == 'N'){
					this.disableEndDate();
					$("#icp_enableEndDate")[0].checked = false;
					$("#icp_enableEndDate").attr('disabled', true);
				}
			}
		}
		if($("#icp_enableStartDate").prop('disabled') == true && $("#icp_enableEndDate").prop('disabled') == true){
			//Show error message
			var infoCodesDisallowStartDate = "";
			var inforCodesDisallowEndDate = "";
			$.each(items, function(id, elem){
				if(elem.allowStartDateFlag == 'N' && elem.checkboxValue){
					infoCodesDisallowStartDate += infoCodesDisallowStartDate+elem.code+", ";
				}
				if(elem.allowEndDateFlag == 'N'  && elem.checkboxValue){
					inforCodesDisallowEndDate += inforCodesDisallowEndDate+elem.code+", ";
				}
			});
			/*
			var error = ""; 
			if(infoCodesDisallowStartDate.length > 0){
				error = " Since the following code(s) : <br> "+infoCodesDisallowStartDate+"<br> cannot have a start date, the start date option has been disabled. <br><br>";
			}
			if(inforCodesDisallowEndDate.length > 0){
				error = error + " Since the following code : <br> "+infoCodesDisallowStartDate+"<br> cannot have an end date, the end date option has been disabled. ";
			}
			errorPopup.showErrorPopupWindow(error);
			*/
		}
	};
	
	this.resetDates = function(){
		this.disableStartDate();
		this.disableEndDate();		
		$("#icp_enableStartDate").attr('disabled', false);
		$("#icp_enableStartDate")[0].checked = false;		
		$("#icp_enableEndDate").attr('disabled', false);
		$("#icp_enableEndDate")[0].checked = false;
	};
	
	this.validateInput = function(){
		
		var grid = $("#icp_infoCodeGrid").data("kendoGrid");
		var selected =  this.getSelectedInfoCodeIds(grid.dataSource.data(), true);
		var startInfoCodeDateValue = getCorrectDateFromKendoDatePicker("icp_startInfoCodeDate"); 
		var endInfoCodeDateValue = getCorrectDateFromKendoDatePicker("icp_endInfoCodeDate"); 
		var startInfoCodeDateCode = this.startCodeId.data("kendoDropDownList").value();
		var endInfoCodeDateCode = this.endCodeId.data("kendoDropDownList").value();
//		var comment = $("#icp_informationCodeComment").val();
		
		var isDateValid = function isDateValid(d) {
			//if the date is empty return it as valid because what if we want to blank it
			if (!d) return true;
			return !isNaN(Date.parse(d));
		};
		
		var isInfoCode = function isInfoCode(infoCode) {
			if (!infoCode) return false;
			var code = parseInt(infoCode);
			if (code && code>0) return true;
			return false;
		};
		var startDateHasValue = $('#icp_enableStartDate').prop('checked');
		var endDateHasValue = $('#icp_enableEndDate').prop('checked');
		var startDate = startInfoCodeDateValue;
		var endDate = endInfoCodeDateValue;
		
		if(!selected.selectedIds || selected.selectedIds.length <= 0){
			errorPopup.showErrorPopupWindow("You must select at least one info code from the grid. If you want to close the popup just click the 'Cancel' button");
			return false;
		}
		if(startDateHasValue && !(isInfoCode(startInfoCodeDateCode) || isDateValid(startDate))){
			errorPopup.showErrorPopupWindow("Please enter a valid start date");
			return false;
		}
		
		if(endDateHasValue && !(isInfoCode(endInfoCodeDateCode) || isDateValid(endDate))){
			errorPopup.showErrorPopupWindow("Please enter a valid end date");
			return false;
		}
		
		return true;
	};
	
	/**
	 * 
	 */
	this.initializeCommentBox = function() {
		if (!$("#icp_informationCodeComment").data("kendoEditor")) {
			this.commentsEditor = $("#icp_informationCodeComment").kendoEditor({			
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
				]//,
				//stylesheets : ["/erm/css/kendoEditor.css"]
			});						
		}
	};
	
	this.disableCommentBox = function(){
	};
	
	this.enableCommentBox = function(){
		
	};
	
	this.enableStartDate = function(){
		$("#icp_startInfoCodeDate").data("kendoDatePicker").value('');
		$("#icp_startInfoCodeDate").data("kendoDatePicker").enable(true);
		$("#icp_startInfoCodeDateCode").data("kendoDropDownList").value('');
		$("#icp_startInfoCodeDateCode").data("kendoDropDownList").enable(true);		
	};
	
	this.disableStartDate = function(){
		$("#icp_startInfoCodeDate").data("kendoDatePicker").value('');
		$("#icp_startInfoCodeDate").data("kendoDatePicker").enable(false);
		$("#icp_startInfoCodeDateCode").data("kendoDropDownList").value('');
		$("#icp_startInfoCodeDateCode").data("kendoDropDownList").enable(false);		
	};
	
	this.enableEndDate = function(){
		$("#icp_endInfoCodeDate").data("kendoDatePicker").value('');
		$("#icp_endInfoCodeDate").data("kendoDatePicker").enable(true);
		$("#icp_endInfoCodeDateCode").data("kendoDropDownList").value('');
		$("#icp_endInfoCodeDateCode").data("kendoDropDownList").enable(true);		
	};
	
	this.disableEndDate = function(){
		$("#icp_endInfoCodeDate").data("kendoDatePicker").value('');
		$("#icp_endInfoCodeDate").data("kendoDatePicker").enable(false);
		$("#icp_endInfoCodeDateCode").data("kendoDropDownList").value('');
		$("#icp_endInfoCodeDateCode").data("kendoDropDownList").enable(false);		
	};
	
	this.resetDateSection = function(){
		this.disableStartDate();
		this.disableEndDate();
		$("#icp_enableStartDate")[0].checked = false;
		$("#icp_enableEndDate")[0].checked = false;
	};
}

var infoCodePopupObject = new infoCodePopupWindow();




