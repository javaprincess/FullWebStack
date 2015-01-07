var strandComments= {
	init: function init(divId) {
		this.enableAdd(true,divId);
		this.clearComment(divId);
	},
	addStrandComment : function addStrandComment(divId) {
		console.log("Add comment clicked");
		this.openAddRightStrandCommentsAndAttachments(undefined,divId);						
	},
	editStrandComment: function editStrandComment(commentId,divId) {
		var url = paths().getCommentByIdRESTPath()+ commentId;
		var that = this;
		$.get(url,function(comment){
			that.openAddRightStrandCommentsAndAttachments(comment,divId);			
		});
		
	},
	enableAdd: function enableAdd(enable,divId) {
		var btn = $("#" + divId + " " + "button[name='adCommentButton']");
		if (enable) {
			btn.show();
		} else {
			btn.hide();
		}
		
	},
	clearComment: function clearComment(divId) {
		var commentDivId = divId;
		var commentDiv = $("#" + commentDivId);
		commentDiv.find("span[name=title]").html('');
		commentDiv.find("span[name=text]").html('');
		commentDiv.find("div[name='comment']").hide();
		var editLink = commentDiv.find("a[name=edit]");
		editLink.attr('href',undefined);
		var removeLink = commentDiv.find("a[name=remove]");
		removeLink.attr('href',undefined);	
		this.removeFromModel(undefined,divId);
	},
	removeFromModel: function removeFromModel(commentId,divId) {
		var commentDivId = divId;
		var commentDiv = $("#" + commentDivId);
		var commentHidden = commentDiv.find("input[name='commentId']");
		commentHidden.val(undefined);		
	},
	
	
	removeStrandComment: function removeStrandComment(commentId,divId) {
		this.removeFromModel(commentId,divId);
		this.clearComment(divId);
		this.enableAdd(true,divId);
	},
	setCommentInModel: function setCommentInModel(comment, divId) {
		var commentId = comment.id;
		var commentDivId = divId;
		var commentDiv = $("#" + commentDivId);
		var commentHidden = commentDiv.find("input[name='commentId']");
		commentHidden.val(commentId);		
	},
	showComment: function showComment(divId,show) {
		var commentDivId = divId;
		show = (show===undefined?true:show);
		var div = $("#" + commentDivId + " " + "div[name='comment']" );
		if (show) {
			div.show();			
			this.enableAdd(false,divId);
		} else {
			div.hide();
			this.enableAdd(true,divId);			
		}
	},
	showAttachments: function showAttachments(attachments,divId) {
		var commentDivId = divId;
		var attachmentsHtml = '';
		var attachmentName;
		if (attachments) {
			attachments.forEach(function(elem) {
				attachmentName = elem.attachmentName;
				attachmentsHtml+=attachmentName+'<br>';
			});				
		}
		var div = $("#" + commentDivId + " " + "div[name='attachments']" );
		div.html(attachmentsHtml);
		
	},

	displayAndSetInModel: function displayAndSetInModel(comment, divId) {
		var that = this;
		var commentId = comment.id;
		this.displayComment(comment,divId);
		this.setCommentInModel(comment,divId);
		var displayAndSetInModel = function displayAndSetInModel(comment) {
			if (comment) {
				that.showAttachments(comment.attachments,divId);
			};
			
		};
		
		//get the comment again with attachments to display.
		//not this is not ideal as the comment should already had the attachment, but it doesn't, in order to not break the return signature we just invoke a new
		//ajax call to get all the info from the comment
		if (commentId) {
			var url = paths().getCommentByIdRESTPath()+ commentId;
			$.get(url,displayAndSetInModel);
		};
		
	},
	displayComment: function displayComment(comment,divId) {
		var commentDivId = divId;
		var commentDiv = $("#" + commentDivId);
		commentDiv.show();
		commentDiv.find("span[name=title]").html(comment.shortDescription);
		commentDiv.find("span[name=text]").html(comment.longDescription);
		var editLink = commentDiv.find("a[name=edit]");
		var commentId = comment.id||""; 
		editLink.attr('href','javascript:strandComments.editStrandComment(' + commentId + ', \'' + divId+'\');');
		var removeLink = commentDiv.find("a[name=remove]");
		removeLink.attr('href','javascript:strandComments.removeStrandComment(' + commentId + ', \'' + divId+'\');');		
		this.showComment(divId);
	},
	getSaveFunction: function getSaveFunction(divId) {
		var saveComment = function saveComment(comment, categoryId, foxVersionId, entityKey) {
			productInfoCodeIds =  [];
			rightStrandIds =[];
			rightStrandRestrictionIds = [];
			console.log("Saving comments for strands");			
			if(comment){
				var jsonData = JSON.stringify(comment);			
				console.log(" STRAND COMMENT JSON : %o", jsonData);
				var path = paths("rest");
				var url = path.getCommentsSaveRightStrandRESTPath();
				commentsAndAttachmentsObject.showSubmitPopupWindow();
				$.post(url, {
					q:jsonData,
					'productInfoCodeIds':JSON.stringify(productInfoCodeIds),
					'rightStrandIds':JSON.stringify(rightStrandIds),
					'rightStrandRestrictionIds':JSON.stringify(rightStrandRestrictionIds)}, 
					function(data){				
						subrights_submitPopupWindow.close();
						commentsAndAttachmentsObject.closeTemplateAddCommentsAndAttachmentWindow();
						commentsAndAttachmentsObject.resetFields();
						strandComments.displayAndSetInModel(data,divId);
					}).fail(function(xhr,status,message){
					subrights_submitPopupWindow.close();
					errorPopup.showErrorPopupWindow(xhr.responseText);
				});			
			}					
		};
		return saveComment;
	},
	
	
	/*AMV
	 * 
	 * Add Comments
	 */
	openAddRightStrandCommentsAndAttachments: function openAddRightStrandCommentsAndAttachments(comment,divId) {
		var f = this.getSaveFunction(divId);
		//TODO clear selected ids
		$("#commentsPopCopyToClearance").hide();
		var isInStrandsPopup = true;
		commentsAndAttachmentsObject.openCommentsAndAttachementsPopupWindow(f,comment,isInStrandsPopup);	
	}	
		
};

function createRightStrand(){
	
	this.cre_paths = paths();
	this.cre_gridData = null;
	this.restrictionsToAdd = new Array();
	this.rep_territoryGroupsTracker = null;
	this.rep_infoCodeGroupsTracker = null;
	
	this.commentsEditor = null;
	
	/**************************************************************************************************
	 *                                                                                                *
	 * Initialization section : This section of code is responsible for initializing all the elements *
	 *                                                                                                *
	 **************************************************************************************************/
	
	this.initializeElements = function(){
		this.initializeMTL();
		this.initializeTerms();
		this.initializeInfoCodes();
		this.initializeButtons();
		this.initializeRadioButton();
		this.initRightStrandCreateWindow();		
		this.initAddEditInfoCode();
		this.initializeStrandSet();
		this.initGroupBoxes();
		this.initializeSubmitWindow();
		this.initializeCommentBox();
	};
	
	/**
	 * Initializes the copy right strand popup window
	 */
	this.initRightStrandCreateWindow = function (){
		var that = this;
		if (!$("#cre_rightStrandCreatePopupWindow").data("kendoWindow")) {
			$("#cre_rightStrandCreatePopupWindow").kendoWindow({
                width: "1125px;",
                height : "780px",
                minWidth : "1050px;",
                minHeight : "750px",
                title: "Create Rights Strands",
                actions: [
                    "Maximize",
                    "Close"
                ],
                visible : false,
                close : function(){
                	that.closePartial();
                }
            });
        }
		cre_rightStrandCreateWindow = $("#cre_rightStrandCreatePopupWindow").data("kendoWindow");				
	};
	
	this.initializeCommentBox = function() {
		// Clearance Memo Editor Setup		
		if (!$("#cre_rightStrandComment").data("kendoEditor")) {
			this.commentsEditor = $("#cre_rightStrandComment").kendoEditor({			
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
	
	/**
	 * This function initializes the Media, Territory, and Language boxes and their accumulators
	 */
	this.initializeMTL = function(){
		var initMTLSelectors = function initMTLSelectors() {
			if(!$("#cre_mediaSelector").data("kendoHierarchySelector")){
				$("#cre_mediaSelector").kendoHierarchySelector({
					dataSource : erm.dbvalues.mediaNodes,
					add : "cre_addMedia",
					remove : "cre_removeMedia",
					accumulator : "cre_mediaSelected",
					id : "id",
					text : "text"
				});
			}
			
			if(!$("#cre_territorySelector").data("kendoHierarchySelector")){
				$("#cre_territorySelector").kendoHierarchySelector({
					dataSource : erm.dbvalues.territoryNodes,
					add : "cre_addTerritory",
					remove : "cre_removeTerritory",
					accumulator : "cre_territorySelected",
					id : "id",
					text : "text"
				});
			}
			
			if(!$("#cre_languageSelector").data("kendoHierarchySelector")){
				$("#cre_languageSelector").kendoHierarchySelector({
					dataSource : erm.dbvalues.languageNodes,
					add : "cre_addlanguage",
					remove : "cre_removelanguage",
					accumulator : "cre_languageSelected",
					id : "id",
					text : "text"
				});
			}
			
		};
		
		erm.dbvalues.afterInit(initMTLSelectors);

	};
	
	this.initGroupBoxes = function(){
		
		var that = this;
		
		/**
		 * Method reponsible for processing the group functionality. It is responsible for adding the group info codes
		 * to the selected box, and from removing the group info codes from the selected info code box, once the a selectd 
		 * group is removed.
		 */
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
					//Calls the resetAccumulator method with a time out to give 
					//the selected box enough time to populate properly
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
		
		if(!$("#cre_territoryGroups").data("kendoMultiSelect")){
			
			var onTerritoryGroupChange = function(){
				var tgm = $("#cre_territoryGroups").data("kendoMultiSelect");
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
					var selector = $("#cre_territorySelector").data("kendoHierarchySelector");
					selector.setSelected(ids);
					/*
					var obj = new Object();
					obj.selector = $("#cre_territorySelector");
					obj.addToElement = $("#cre_addTerritory");
					obj.tracker = this.rep_territoryGroupsTracker;
					processNewValues(ids, obj);
					this.rep_territoryGroupsTracker = ids;
					*/
				}
			};
						
			$("#cre_territoryGroups").kendoMultiSelect({
	            filter:"startswith",
	            maxSelectedItems : 4,
	            dataTextField: "name",
	            dataValueField: "id",
	            change : onTerritoryGroupChange,
	            dataSource: {
		    		transport: {
		                   read: {
		                       dataType: "json",
		                       url: this.cre_paths.getTerritoryGroupRESTPath() 
		                   }
		             }
		    	}               
	        });
			
		}
		
		if(!$("#cre_languageGroups").data("kendoMultiSelect")){
			var onLanguageGroupChange = function(){	
				
				var tgm = $("#cre_languageGroups").data("kendoMultiSelect");
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
					var selector = $("#cre_languageSelector").data("kendoHierarchySelector");
					selector.setSelected(ids);
					/*
					var obj = new Object();
					obj.selector = $("#cre_languageSelector");
					obj.addToElement = $("#cre_addlanguage");
					obj.tracker = this.rep_languageGroupsTracker;
					processNewValues(ids, obj);
					this.rep_languageGroupsTracker = ids;					
					*/
				}
			};
			
			$("#cre_languageGroups").kendoMultiSelect({
	            filter:"startswith",
	            maxSelectedItems : 4,
	            dataTextField: "languageGroupName",
	            dataValueField: "languageGroupId",
	            change : onLanguageGroupChange, 
	            dataSource: {
	                transport: {
	                    read: {
	                        dataType: "json",
	                        url: that.cre_paths.getLanguageGroupRESTPath() 
	                    }
	                }
	            }
	        });
			
		}
		
		if(!$("#cre_infoCodeGroups").data("kendoMultiSelect")){
			
			var processNewInfoCodeValues = function(newGroupIds, obj){
				var ts = obj.selector.data("kendoHierarchySelector");
				if(newGroupIds.length > 0){
					ts.clearSelected();
					ts.setSelected(newGroupIds);
				}
				else {
					ts.clearSelected();
				}
			};
			
			
	    	var onInfoCodeGroupChange = function(){
	    		
	    		var tgm = $("#cre_infoCodeGroups").data("kendoMultiSelect");
				if(tgm){
					var d = $("#cre_infoCodeSelector").data("kendoHierarchySelector").getAllDataItemsFromDS();
					var dataItems = tgm.dataItems();
					var ids = new Array();
					$.each(dataItems, function(id, elem){
						$.each(d, function(id, element){
							if(element.restrictionTypeId == elem.restrictionTypeId){
								ids.push(element.id);
							}
						});
					});
					var selector = $("#cre_infoCodeSelector").data("kendoHierarchySelector");
					selector.setSelected(ids);
					/*
					var obj = new Object();
					obj.selector = $("#cre_infoCodeSelector");
					obj.addToElement = $("#cre_addInfoCodesAdd");
					obj.tracker = this.rep_infoCodeGroupsTracker;
					//processNewInfoCodeValues(ids, obj);
					processNewValues(ids, obj);
					this.rep_infoCodeGroupsTracker = ids;	
					*/				
				}
	    	};
    	
	        $("#cre_infoCodeGroups").kendoMultiSelect({
	            filter:"startswith",
	            dataTextField: "restrictionTypeDescription",
	            dataValueField: "restrictionTypeId",
	            // define custom template
	            template: '${ data.restrictionTypeDescription }',
	            dataSource: {
		    		transport: {
		                   read: {
		                       dataType: "json",
		                       url: that.cre_paths.getAllRestrictionGroupRESTPath()
		                   }
		            }
	            },
	            change : onInfoCodeGroupChange
	        });
		};
		
	};
	
	/**
	 * function to be called when the use changes the start date code
	 */
	var onStartDateCodeChange = function(){
    	var sdc = $("#cre_startDateCode").data("kendoDropDownList");
    	var sds = $("#cre_startDateStatus").data("kendoDropDownList");
		var cdp = $("#cre_startContractualDate").data("kendoDatePicker");
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
    };
    
    /**
     * function to be called when the user changes the end date code
     */
    var onEndDateCodeChange = function(){
    	var sdc = $("#cre_endDateCode").data("kendoDropDownList");
    	var sds = $("#cre_endDateStatus").data("kendoDropDownList");
		var cdp = $("#cre_endContractualDate").data("kendoDatePicker");
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
    			sds.enable(true);
    			sds.value("1");    				        		
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
    };
    
    /**
     * function to be called when the use changes the term start date
     */
    var onStartContractualDateChange = function(){
    	var cdp = $("#cre_startContractualDate").data("kendoDatePicker");
    	var sds = $("#cre_startDateStatus").data("kendoDropDownList");
    	if(cdp.value != null){    		
    		sds.value("1");
    	}
    };
    
    /**
     * function to be called when the use changes the contractual end date
     */
    var onEndContractualDateChange = function(){
    	var cdp = $("#cre_endContractualDate").data("kendoDatePicker");
    	var sds = $("#cre_endDateStatus").data("kendoDropDownList");
    	if(cdp.value != null){  			        		
    		sds.value("1");
    	}
    };
	
	/**
	 * Function responsible for initializing the terms (term start date, start date code, end date code, etc..).
	 * kendo objects are used for the various fields
	 */
	this.initializeTerms = function(){
		
		$.getJSON(this.cre_paths.getAllDateCodesRESTPath(), function(data){
	   		if(data){	   			
	   			var partialData = new Array();
	   			for(var i = 0; i < data.length; i++){
	   				if(data[i].id != 1){
	   					partialData.push(data[i]);
	   				}
	   			}
	   			$("#cre_startDateCode").kendoDropDownList({
	   	            filter:"startswith",
	   	            autoBind : true,
	   	            dataTextField: "description",
	   	            dataValueField: "id",
	   	            template: "${ data.description }",
	   	            dataSource : partialData,
	   	            change : onStartDateCodeChange
	   	        });
	   			
	   			$("#cre_endDateCode").kendoDropDownList({
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
		
		$.getJSON(this.cre_paths.getAllDateStatusRESTPath(), function(data){
			
			if(data){
				$("#cre_startDateStatus").kendoDropDownList({
					dataTextField : "description",
					dataValueField : "id", 
					template : "${ data.description }",
					dataSource : data
				});
				
				$("#cre_endDateStatus").kendoDropDownList({
					dataTextField : "description",
					dataValueField : "id", 
					template : "${ data.description }",
					dataSource : data
				});
			}
		});
		
		$("#cre_startContractualDate").kendoDatePicker({
       		footer: "Today - #=kendo.toString(data, 'd') #",
       		format : "MM/dd/yyyy",
       		parseFormats : ["yyyy-MM-dd", "EEE, d MMM yyyy", "EEE, MMM d, \'\'yy"],
       		start : "year",
       		change : onStartContractualDateChange
        });
		
		$("#cre_endContractualDate").kendoDatePicker({
       		footer: "Today - #=kendo.toString(data, 'd') #",
       		format : "MM/dd/yyyy",
       		parseFormats : ["yyyy-MM-dd", "EEE, d MMM yyyy", "EEE, MMM d, \'\'yy"],
       		start : "year",
       		change : onEndContractualDateChange,
       		depth : "century"
        });
		
		$("#cre_startOverrideDate").kendoDatePicker({
       		footer: "Today - #=kendo.toString(data, 'd') #",
       		format : "MM/dd/yyyy",
       		parseFormats : ["yyyy-MM-dd", "EEE, d MMM yyyy", "EEE, MMM d, \'\'yy"],
       		start : "year"
        });
		
		$("#cre_endOverrideDate").kendoDatePicker({
       		footer: "Today - #=kendo.toString(data, 'd') #",
       		format : "MM/dd/yyyy",
       		parseFormats : ["yyyy-MM-dd", "EEE, d MMM yyyy", "EEE, MMM d, \'\'yy"],
       		start : "year"
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
		
		var initInfoCodes = function() {
			var data = erm.dbvalues.activeRestrictions;
			if(data){
				 var d = new Array();
				 $.each(data, function(idx, element){
					 var ob = new Object();
					 ob = element;						 
					 ob.description2 = ob.code.toUpperCase() + " - " + that.toTitleCase(ob.description);
					 d.push(ob);
				 });				 	
				 
				 if(!$("#cre_infoCodeSelector").data("kendoHierarchySelector")){
					 $("#cre_infoCodeSelector").kendoHierarchySelector({
						dataSource : d, 
						add : "cre_addInfoCodesAdd",
						remove : "cre_removeInfoCodesAdd",
						accumulator : "cre_restrictionAddSelected",
						id : "id",
						text : "description2"
					 });
				 }				 
			 }			
		};
		
		erm.dbvalues.afterInit(initInfoCodes);		 
		
		$("#cre_addInfoCodesAdd").click(function(){
			that.processAddedRestrictionsWithTimeout();
		});
		
		$("#cre_removeInfoCodesAdd").click(function(){
			that.processAddedRestrictionsWithTimeout();
		});
		
		$("#cre_restrictionAddSelected").change(function(){
			setTimeout(function(){
				that.processInfoCodeAccumulatorChange($("#cre_infoCodeSelector").data("kendoHierarchySelector").getAccumulated());				
			}, 1000);
		});
	};
	
	/**
	 * Initialize the strand set section
	 */
	this.initializeStrandSet = function(){
		$("#cre_strandSetComboBox").kendoComboBox({
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
		$("#cre_addEditButton").click(function(){
			var ics = $("#cre_infoCodeSelector").data("kendoHierarchySelector");
			var d = ics.getDataItemsFromDS(ics.getAccumulated());
			if(d && d.length > 0){
				var ds = that.buildInfoCodeDataSource(d);
				that.openInfoCodePopupWindow(ds, cre_infoCodePopup, that.processInfoCodeCustomDates);
			}
		});
		
		$("#cre_createRightStrand").click(function(){
			that.processCreateStrand();
		});
		
		$("#cre_cancelCreateRightStrand").click(function(){
			that.close();
		});					
		
		$("#cre_errorPanelClose").click(function(){
			that.hideErrorPanel();
		});
				
		$("#cre_addCommentPlus").click(function(){
			if (!cre_showAddComment) {
			  $(".cre_displayAddComment").show();
			  $("#cre_addCommentPlus_icon").attr("class", "icon-minus-sign");			  
			} else {
			  $(".cre_displayAddComment").hide();
			  $("#cre_addCommentPlus_icon").attr("class", "icon-plus-sign");
			}
			cre_showAddComment = !cre_showAddComment;
		});	
		
		
		
		
		//AMV 9/11/2014
//		$("#cre_addRightStrandCommentsAndAttachments").click(function() {
//			strandComments.addStrandComment();
//		});
		
		$("#icp_addCommentPlus").click(function(){
			if (!icp_showAddComment) {
			  $(".icp_displayAddComment").show();
			  $("#icp_addCommentPlus_icon").attr("class", "icon-minus-sign");			  
			} else {
			  $(".icp_displayAddComment").hide();
			  $("#icp_addCommentPlus_icon").attr("class", "icon-plus-sign");
			}
			icp_showAddComment = !icp_showAddComment;
		});		
		
		$("#addRightStrand").click(function(){
			productDetailObject.checkSessionHeartBeat();
			$(".cre_displayAddComment").hide();
			$("#cre_addCommentPlus_icon").attr("class", "icon-plus-sign");
			cre_showAddComment = false;			
			var combobox = $("#cre_strandSetComboBox").data("kendoComboBox");
			$("#cre_addCommentPlus").removeClass("hideControls");
			var url = that.cre_paths.getRightStrandSetRESTPath()+"/"+that.getCurrentAngularScope().foxVersionId;
			$.getJSON(url, function(data){
        		if(data != null && data.length > 0){
        			var item0 = new Object();
        			item0.rightStrandSetId = "";
        			item0.strandSetName = "";
        			data.splice(0, 0, item0);
        			combobox.setDataSource(data);
        		}
        		else {
        			var items = [{"rightStrandSetId":"", "strandSetName":""}];
        			combobox.setDataSource(items);
        		}
        	});
			
			that.showRightStrandCreateWindow(1, "Create Rights Strands");
        	
		 });
		
		$("#addInfoCodesButton").click(function(){
			$(".icp_displayAddComment").hide();
			$("#icp_addCommentPlus_icon").attr("class", "icon-plus-sign");
			icp_showAddComment = false;
			$(".cre_displayAddComment").hide();
			$("#cre_addCommentPlus_icon").attr("class", "icon-plus-sign");
			cre_showAddComment = true;
			$("#cre_addCommentPlus").click();
			that.enableCommentBox();
			productDetailObject.checkSessionHeartBeat();
			var combobox = $("#cre_strandSetComboBox").data("kendoComboBox");
			//$("#cre_addCommentPlus").addClass("hideControls");						
			var url = kendoElementInit.path.getRightStrandSetRESTPath()+"/"+kendoElementInit.getCurrentAngularScope().foxVersionId;
			$.getJSON(url, function(data){
        		if(data != null && data.length > 0){
        			var item0 = new Object();
        			item0.rightStrandSetId = "";
        			item0.strandSetName = "";
        			data.splice(0, 0, item0);
        			combobox.setDataSource(data);
        		}
        		else {
        			var items = [{"rightStrandSetId":"", "strandSetName":""}];
        			combobox.setDataSource(items);
        		}
        	});
			that.showRightStrandCreateWindow(3, "Create Product Info Codes");
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
		cre_infoCodePopup = $(infoCodesWindowId).data("kendoWindow");
	};
	
	/**
	 * Initialize the exclusion and inclusion radio buttons
	 */
	this.initializeRadioButton = function(){
		var that = this;
		$("#cre_inclusion").click(function(){
			if($(this)[0].checked){
				that.enableForInclusion();
			}
		});
		
		$("#cre_exclusion").click(function(){
			if($(this)[0].checked){
				that.disableForExclusion();
				that.enableForExclusion();
			}
		});
		
		$("#cre_productInfoCodeType").click(function(){
			if($(this)[0].checked){
				that.enableElementsForProductInfoType();
				that.disableElementsForProductInfoType();				
			}
		});
	};
	
	this.initializeSubmitWindow = function(){
		if (!$("#cre_submitPopupWindow").data("kendoWindow")) {
			$("#cre_submitPopupWindow").kendoWindow({
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
		cre_submitPopupWindow = $("#cre_submitPopupWindow").data("kendoWindow");
	};
	
	this.initializeCreateRightStrandUnsuccessfulPopup = function(){
		var that = this;
		if (!$("#cre_createRightStrandUnsuccessful").data("kendoWindow")) {
			$("#cre_createRightStrandUnsuccessful").kendoWindow({
                width: "450px",
                height : "250px",
                minWidth : "450px",
                minHeight : "250px",
                title: "",
                actions: [],
                visible : false,
            });
        }
		
		$("#cre_reCreateRightStrand").unbind();
		$("#cre_reCreateRightStrand").click(function(){
			console.log(" cre_RE_Create_RIGHT_STRAND ");
		});
		
		$("#cre_cancelReCreateRightStrand").click(function(){
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
	this.showRightStrandCreateWindow = function(value, title){
		strandComments.init('cre_commentSection');
		this.selectedRadioButton(value); //1);
		this.populateProductVersionInfo();
		$("#cre_mediaSelector").data("kendoHierarchySelector").populateSelector();
		$("#cre_territorySelector").data("kendoHierarchySelector").populateSelector();
		$("#cre_languageSelector").data("kendoHierarchySelector").populateSelector();
		$("#cre_infoCodeSelector").data("kendoHierarchySelector").populateSelector();
		cre_rightStrandCreateWindow = $("#cre_rightStrandCreatePopupWindow").data("kendoWindow");			
		cre_rightStrandCreateWindow.setOptions({
			visible : true,
			modal : true
		});
		cre_rightStrandCreateWindow.center();
		cre_rightStrandCreateWindow.open();
		cre_rightStrandCreateWindow.title(title);		
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
					createRightStrandObject.processCustomRestrictionsDate(elem);
				});
				
				createRightStrandObject.buildCustomInfoDisplay();
			}
		}
	};
	
	/**
	 * 
	 */
	this.processCustomRestrictionsDate = function processCustomRestrictionsDate(restriction){
		if(restriction){
			for(var i = 0; i < this.restrictionsToAdd.length; i++){
				var currentRestriction = this.restrictionsToAdd[i];
				if(restriction.restrictionCodeId == currentRestriction.restrictionCdId){
					if (restriction.changeStartDate) {
						currentRestriction.startDate = restriction.startDate;
						currentRestriction.startDateCdId = restriction.startDateCodeId;
					}
					if (restriction.changeEndDate) {
						currentRestriction.endDate = restriction.endDate;
						currentRestriction.endDateCdId = restriction.endDateCodeId;
					}
					currentRestriction.startDateCdName = restriction.startDateCodeText;
					currentRestriction.endDateCdName = restriction.endDateCodeText;
					currentRestriction.restrictionCdName = restriction.restrictionCode;
					currentRestriction.commentId = restriction.commentId;
					currentRestriction.commentTimestampId = restriction.commentTimestampId;
					currentRestriction.changeStartDate = restriction.changeStartDate;
					currentRestriction.changeEndDate = restriction.changeEndDate;
					currentRestriction.allowEndDateFlag = restriction.allowEndDateFlag;
					currentRestriction.allowStartDateFlag = restriction.allowStartDateFlag;

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
				var bool = ((elem.startDate != null && !isNaN(parseInt(elem.startDate))) || (elem.startDateCdId != null && !isNaN(parseInt(elem.startDateCdId))));
				bool = bool || ((elem.endDate != null && !isNaN(parseInt(elem.endDate))) || (elem.endDateCdId != null && !isNaN(parseInt(elem.endDateCdId))));
				var st = elem.getCodeDateDisplayString();				
				displayArray.push(st);

			});
			
			$("#cre_infoCodeCustomDateDisplay").html(displayArray.join("<br>"));
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
		strandComments.init('icp_commentSection');		
		infoCodePopupObject.setGridDataSource(dataSource, popupWindowReference, processInfoCodeSpecialDates);
		var d = $("#test2_addEditInfoCodeWindow").data("kendoWindow");
		d.setOptions({
			visible : true,
			modal : true
		});
		infoCodePopupObject.resetDateSection();
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
			var nodes = $("#cre_infoCodeSelector").data("kendoHierarchySelector").getDataItemsFromDS($("#cre_infoCodeSelector").data("kendoHierarchySelector").getAccumulated());
			if(!nodes || nodes.length <= 0 || $("#cre_productInfoCodeType")[0].checked){
				$("#cre_addEditButton").attr("disabled", true);
			}
			else {
				$("#cre_addEditButton").attr("disabled", false);
			}
			that.processAddedRestrictions(nodes);		
		}, 50);	
		//TODO set this as a variable
	};
	
	/**
	 * This is a method that will help with managing the info codes 
	 * custom dates
	 */
	this.processAddedRestrictions = function(nodes){
		var that = this;
		if(nodes && nodes.length > 0){
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
				er.description = that.toTitleCase(element.description);
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
				var bool = false;
				
				for(var r=0; r < nodes.length; r++){
					if(elem.restrictionCdId == nodes[r].id){
						bool = true;
						break;
					}
				}
				if(!bool){
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
		$.each(this.cre_gridData, function(idx, element){
			ids.push(element.rightStrandId);
		});
		return ids;
	};
	

		
	this.processCreateStrand = function(){
		if($("#cre_productInfoCodeType")[0].checked){
			if(this.restrictionsToAdd && this.restrictionsToAdd.length > 0){
				this.processProductInfoCode();
				 
				/**
				 * TMA product restrictions Bug Fixes: 
				 * 	46009: Product level info code list in General tab is not refreshed after add, adopt and delete of product info codes (medium)
					46011: Only one product info code is displayed in the General tab regardless of how many a product has (Critical)
					46013: Deleted Product level info code is not removed from General tab even after refreshing title (high)
				 */
				//console.log("TMA debug: calling updateProductRestrictions from processCreateStrand");
				//updateProductRestrictions(foxVersionId);
			}
		}
		else {
			if(this.validate()){
				
				this.processCreateRightStrand();
			}
		}
		
	};
	
	/**
	 * 
	 */
	this.processCreateRightStrand = function(){
		
		var rightStrand = new rightStrandElement();
		
		rightStrand.ids = null;
		
		if($("#cre_mediaSelector").data("kendoHierarchySelector").getAccumulated() && $("#cre_mediaSelector").data("kendoHierarchySelector").getAccumulated().length > 0){
			rightStrand.mediaIds = $("#cre_mediaSelector").data("kendoHierarchySelector").getAccumulated();
		}
		else {
			rightStrand.mediaIds = null;
		}
		
		if($("#cre_territorySelector").data("kendoHierarchySelector").getAccumulated() && $("#cre_territorySelector").data("kendoHierarchySelector").getAccumulated().length > 0){
			rightStrand.territoryIds = $("#cre_territorySelector").data("kendoHierarchySelector").getAccumulated();
		}
		else {
			rightStrand.territoryIds = null;
		}
		
		if($("#cre_languageSelector").data("kendoHierarchySelector").getAccumulated() && $("#cre_languageSelector").data("kendoHierarchySelector").getAccumulated().length > 0){
			rightStrand.languageIds = $("#cre_languageSelector").data("kendoHierarchySelector").getAccumulated();
		}
		else {
			rightStrand.languageIds = null;
		}
  		
		var strandSetCombo = $("#cre_strandSetComboBox").data("kendoComboBox");
  		rightStrand.strandSetName = strandSetCombo.text().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  		rightStrand.strandSetId = strandSetCombo.value();
  		//if the selected valud is less than 0, it means that the user has not selected any value and we must ignore the value as strand set id
  		if (strandSetCombo.selectedIndex<0) {
  			rightStrand.strandSetId=null;  			
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
  		
  		
  		if($("#cre_inclusion")[0].checked){
  			rightStrand.startContractualDate = getCorrectDateFromKendoDatePicker("cre_startContractualDate");
  			
  			rightStrand.startContractualDateString = getCorrectDateFromKendoDatePickerAsString("cre_startContractualDate");
  			
  			if($("#cre_startDateCode").data("kendoDropDownList").value() > 0){
  				rightStrand.startDateCode = $("#cre_startDateCode").data("kendoDropDownList").value();
  			}
  			else {
  				rightStrand.startDateCode = null;
  			}
  			
  			if($("#cre_startDateStatus").data("kendoDropDownList").value() > 0){
  				rightStrand.startDateStatus = $("#cre_startDateStatus").data("kendoDropDownList").value();
  			}
  			else {
  				rightStrand.startDateStatus = null;
  			}
  			
  			rightStrand.startOverrideDate = getCorrectDateFromKendoDatePicker("cre_startOverrideDate");
  			
  			rightStrand.startOverrideDateString = getCorrectDateFromKendoDatePickerAsString("cre_startOverrideDate");
  	  		 	
  			rightStrand.endContractualDate = getCorrectDateFromKendoDatePicker("cre_endContractualDate");
  			
  			rightStrand.endContractualDateString = getCorrectDateFromKendoDatePickerAsString("cre_endContractualDate");
  			
  	  		if($("#cre_endDateCode").data("kendoDropDownList").value() > 0){
  	  			rightStrand.endDateCode = $("#cre_endDateCode").data("kendoDropDownList").value();
  	  		}
  	  		else {
  	  			rightStrand.endDateCode = null;
  	  		}
  	  		
  	  		if($("#cre_endDateStatus").data("kendoDropDownList").value() > 0){
  	  			rightStrand.endDateStatus = $("#cre_endDateStatus").data("kendoDropDownList").value();
  	  		}
  	  		else {
  	  			rightStrand.endDateStatus = null;
  	  		}
  	  		
  	  		rightStrand.endOverrideDate = getCorrectDateFromKendoDatePicker("cre_endOverrideDate");
  	  		
  	  		rightStrand.endOverrideDateString = getCorrectDateFromKendoDatePickerAsString("cre_endOverrideDate");
  	  		
  	  		rightStrand.inclusionExclusion = $("#cre_inclusion")[0].value; 
  	  		
	  	  	if(this.restrictionsToAdd && this.restrictionsToAdd.length > 0){
				rightStrand.restrictionsToAdd = new Array();
	  			$.each(this.restrictionsToAdd, function(idx, elem){
	  				rightStrand.restrictionsToAdd.push(elem.getRestrictionObjectForJSON());
	  			});
	  		}
  	  		
  		}else {
  			rightStrand.startContractualDate = null;
  			rightStrand.startDateCode = null;
  			rightStrand.startDateStatus = null;
  			rightStrand.startOverrideDate = null;
  			rightStrand.endContractualDate = null;
  			rightStrand.endDateCode = null;
  			rightStrand.endDateStatus = null;
  			rightStrand.endOverrideDate = null;
  			rightStrand.inclusionExclusion = $("#cre_exclusion")[0].value;
  			
  		}
  		var rightsScope = erm.scopes.rights();
  		rightStrand.fromProductVersionId = rightsScope.foxVersionId;
  		var isFoxipediaSearch = rightsScope.isFoxipediaSearch;
  		var commentId = $("#cre_commentSection input[name='commentId']").val();
  		rightStrand.isFoxipediaSearch = isFoxipediaSearch;
  		rightStrand.commentId = commentId;
//  		rightStrand.comment = $("#cre_rightStrandComment").val();
//  		rightStrand.commentTitle = $("#cre_rightStrandCommentTitle").val();
  		
  		var ob = rightStrand.getCreateRightStrandObject();
  		console.log(" OBJECT : %o", JSON.stringify(ob));
  		
  		this.submitRightStrandToCreate(ob);		
	};
	
	/**
	 * 
	 */
	this.processProductInfoCode = function(){
		var rightStrand = new Object();
		
		if(this.restrictionsToAdd && this.restrictionsToAdd.length > 0){
			rightStrand.restrictions = new Array();
  			$.each(this.restrictionsToAdd, function(idx, elem){
  				rightStrand.restrictions.push(elem.getRestrictionObjectForJSON());
  			});
  		}
  		var commentId = $("#cre_commentSection input[name='commentId']").val();
		if (commentId&&parseInt(commentId)) {
			rightStrand.commentId = parseInt(commentId);
		}
		
		rightStrand.foxVersionId = angular.element(document.getElementById("rightsController")).scope().foxVersionId;
		console.log(" PRODUCT LEVEL INFO CODES SUBMIT : %o", JSON.stringify(rightStrand));
		this.submitProductLevelInfoCodeToCreate(rightStrand);
	};
	
	/**
	 * 
	 */
	this.close = function(){
		$("#cre_rightStrandCreatePopupWindow").data("kendoWindow").close();
		this.closePartial();
	};
	
	this.closePartial = function(){					
		this.disableAllElements();
		this.resetTargetListBox();
		this.cre_gridData = null;
		this.hideErrorPanel();		
	};
	
	/**
	 * Function decide if the strands are both inclusion and exclusion
	 * if they are both the function returns true, otherwise it returns false
	 */
	this.areStrandBothInclusionAndExclusion = function(){
		 
		if(this.cre_gridData && this.cre_gridData.length > 0){
			var changed = this.cre_gridData[0].excludeFlag;
			var bool = this.cre_gridData[0].excludeFlag;
			for(var i = 0; i < this.cre_gridData.length; i++){
				if(bool != this.cre_gridData[i].excludeFlag){
					changed = this.cre_gridData[i].excludeFlag;
					break;
				}
			}
			if(changed != bool){
				return true;
			}
		}
		return false;
	};
	
	/**
	 * 
	 */
	this.selectedRadioButton = function(value){
		if(value == 1){
			$(".inclusionExclusionClass").show();
			$("#cre_inclusion")[0].checked = true;
			$("#cre_exclusion")[0].checked = false;
			$("#cre_productInfoCodeType")[0].checked = false;
			
			$("#cre_inclusion").click();
		}
		
		else if(value == 2){
			$(".inclusionExclusionClass").show();
			$("#cre_inclusion")[0].checked = false;
			$("#cre_exclusion")[0].checked = true;
			$("#cre_productInfoCodeType")[0].checked = false;
			
			
			$("#cre_exclusion").click();
		}
		else if(value == 3){
			
			$("#cre_inclusion")[0].checked = false;
			$("#cre_exclusion")[0].checked = false;
			$("#cre_productInfoCodeType")[0].checked = true;
			$(".inclusionExclusionClass").hide();
			$("#cre_productInfoCodeType").click();
		}
		else {
			$(".inclusionExclusionClass").show();
			$("#cre_inclusion")[0].checked = false;
			$("#cre_exclusion")[0].checked = false;
			$("#cre_productInfoCodeType")[0].checked = false;
			
		}
		
	};
	
	this.populateProductVersionInfo = function(){
		var ia = new Array();
		var formattedReleaseDate = null;
		var angularScope = angular.element(document.getElementById("rightsController")).scope();
		if(angularScope){
			 $("#cre_productTitlePopup").html(angularScope.currentProductArray.productTitle);
			   $("#cre_productCode").html(angularScope.currentProductArray.productCode);
			   $("#cre_productTypeCode").html(angularScope.currentProductArray.productTypeDesc);			   
			   formattedReleaseDate = erm.Dates.getFormatedReleaseDate(angularScope.currentProductArray.firstReleaseDate);
			   $("#cre_firstReleaseDate").html(formattedReleaseDate);
			   $("#cre_productionYear").html(angularScope.currentProductArray.productionYear);
			   $("#cre_currentFoxId").html(angularScope.currentProductArray.foxId);
			   $("#cre_currentFoxVersionId").html(angularScope.currentProductArray.foxVersionId);
			   $("#cre_currentFoxIdJDE").html(angularScope.currentProductArray.jdeId);
		}
		return ia;
	};
	
	this.getSelectedProductVersionIds = function(){
		var ids = new Array();
		var options = $("#cre_targetProductList option");
		if(options && options.length > 0){
			$.each(options, function(idx, elem){
				ids.push(elem.value);
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
	this.submitRightStrandToCreate = function(dataObject){
		var that = this;
		if(dataObject){
			
			var jsonObject = JSON.stringify(dataObject);
			var url = this.cre_paths.getRightStrandsRESTPath();
			this.showSubmitPopupWindow();
			$.post(url, {q:jsonObject}, function(data){
				var applyFilter = true;
				cre_submitPopupWindow.close();
				var rcscope = angular.element(document.getElementById("rightsController")).scope();
				rcscope.viewStrandsGrid(rcscope.foxVersionId,data,undefined,applyFilter);
  				rcscope.setUpdatedStrands(eval(data.length));
  				rcscope.$apply();
				that.close();
			}).fail(function(xhr,status,message){
				cre_submitPopupWindow.close();
				that.showErrorPanel(xhr.responseText);
			});
		}
	};
	
	/**
	 * 
	 */
	this.submitProductLevelInfoCodeToCreate = function(dataObject){
		var that = this;
		if(dataObject){
			
			var jsonObject = JSON.stringify(dataObject);
			var url = this.cre_paths.getProductRestrictionSaveRESTPath();
			this.showSubmitPopupWindow();
			$.post(url, {q:jsonObject}, function(data){
				cre_submitPopupWindow.close();
				var rcscope = angular.element(document.getElementById("rightsController")).scope();
				rcscope.viewProductRestrictionsGrid(rcscope.foxVersionId,data);
			    rcscope.$apply();
			    rcscope.setUpdatedProductCodeRestrictions(eval(data.length));				
				that.close();
			}).fail(function(xhr,status,message){
				cre_submitPopupWindow.close();
				that.showErrorPanel(xhr.responseText);
			});
		}
	};
	
	/**
	 * 
	 */
	this.showErrorPanel = function(text){
		$("#cre_errorPanelInner").html(text);
		$("#cre_errorPanel").show();
		$("#cre_errorPanel").focus();
	};
	
	/**
	 * 
	 */
	this.hideErrorPanel = function(){
		$("#cre_errorPanelInner").html("");
		$("#cre_errorPanel").hide();
	};
	
	/**
	 * 
	 */
	this.showSubmitPopupWindow = function(){
		var d = $("#cre_submitPopupWindow").data("kendoWindow");
		d.setOptions({
			visible : true,
			modal : true
		});
		d.center();
		d.open();		
	};
	
	this.closeRightStrandReCreatePopup = function(){
		$("#cre_targetProductListError").empty();
		$("#cre_copyRightStrandUnsuccessful").data("kendoWindow").close();
	};
	
	this.openRightStrandReCreatePopup = function(){
		$("#cre_copyRightStrandUnsuccessful").data("kendoWindow").setOptions({
			modal : true
		});
		$("#cre_copyRightStrandUnsuccessful").data("kendoWindow").center();
		$("#cre_copyRightStrandUnsuccessful").data("kendoWindow").open();
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
		$("#cre_mediaSelector").data("kendoHierarchySelector").clear();
		$("#cre_mediaSelector").attr("disabled", true);
		$("#cre_mediaSelected").attr("disabled", true);
		$("#cre_mediaText").addClass("disableTextClass");
		$("#cre_removeMedia").attr("disabled", true);
		$("#cre_removeMedia").addClass("disableTextClass");
		$("#cre_addMedia").attr("disabled", true);
		$("#cre_addMedia").addClass("disableTextClass");
		$("#cre_mediaTextSelected").addClass("disableTextClass");
	};
	
	this.enableMedia = function(){
		$("#cre_mediaSelector").attr("disabled", false);
		$("#cre_mediaSelected").attr("disabled", false);
		$("#cre_mediaText").removeClass("disableTextClass");
		$("#cre_removeMedia").attr('disabled', false);
		$("#cre_removeMedia").removeClass("disableTextClass");
		$("#cre_addMedia").attr('disabled', false);
		$("#cre_addMedia").removeClass("disableTextClass");
		$("#cre_mediaTextSelected").removeClass("disableTextClass");
	};
	
	this.disableTerritory = function(){
		$("#cre_territorySelector").data("kendoHierarchySelector").clear();
		$("#cre_territorySelector").attr("disabled", true);
		$("#cre_territorySelected").attr("disabled", true);
		$("#cre_territoryText").addClass("disableTextClass");
		$("#cre_removeTerritory").attr("disabled", true);
		$("#cre_removeTerritory").addClass("disableTextClass");
		$("#cre_addTerritory").attr("disabled", true);
		$("#cre_addTerritory").addClass("disableTextClass");
		$("#cre_territoryTextSelected").addClass("disableTextClass");
		$("#cre_territoryGroups").data("kendoMultiSelect").value([]);
		$("#cre_territoryGroups").data("kendoMultiSelect").enable(false);
		$("#cre_territoryGroupText").addClass("disableTextClass");
		
	};
	
	this.enableTerritory = function(){
		$("#cre_territorySelector").attr("disabled", false);
		$("#cre_territorySelected").attr("disabled", false);
		$("#cre_territoryText").removeClass("disableTextClass");
		$("#cre_removeTerritory").attr("disabled", false);
		$("#cre_removeTerritory").removeClass("disableTextClass");
		$("#cre_addTerritory").attr("disabled", false);
		$("#cre_addTerritory").removeClass("disableTextClass");
		$("#cre_territoryTextSelected").removeClass("disableTextClass");
		$("#cre_territoryGroups").data("kendoMultiSelect").enable(true);
		$("#cre_territoryGroupText").removeClass("disableTextClass");
	};
	
	this.disableLanguage = function(){
		$("#cre_languageSelector").data("kendoHierarchySelector").clear();
		$("#cre_languageSelector").attr("disabled", true);
		$("#cre_languageSelected").attr("disabled", true);
		$("#cre_languageText").addClass("disableTextClass");
		$("#cre_removelanguage").attr("disabled", true);
		$("#cre_removelanguage").addClass("disableTextClass");
		$("#cre_addlanguage").attr("disabled", true);
		$("#cre_addlanguage").addClass("disableTextClass");
		$("#cre_languageTextSelected").addClass("disableTextClass");
		$("#cre_languageGroups").data("kendoMultiSelect").value([]);
		$("#cre_languageGroups").data("kendoMultiSelect").enable(false);
		$("#cre_languageGroupText").addClass("disableTextClass");
	};
	
	this.enableLanguage = function(){
		$("#cre_languageSelector").attr("disabled", false);
		$("#cre_languageSelected").attr("disabled", false);
		$("#cre_languageText").removeClass("disableTextClass");
		$("#cre_removelanguage").attr("disabled", false);
		$("#cre_removelanguage").removeClass("disableTextClass");
		$("#cre_addlanguage").attr("disabled", false);
		$("#cre_addlanguage").removeClass("disableTextClass");
		$("#cre_languageTextSelected").removeClass("disableTextClass");
		$("#cre_languageGroups").data("kendoMultiSelect").enable(true);
		$("#cre_languageGroupText").removeClass("disableTextClass");
	};
	
	this.disableTerms = function(){
		$("#cre_startContractualDate").data("kendoDatePicker").value("");
		$("#cre_startContractualDate").data("kendoDatePicker").enable(false);
		$("#cre_startOverrideDate").data("kendoDatePicker").value("");
		$("#cre_startOverrideDate").data("kendoDatePicker").enable(false);
		$("#cre_endContractualDate").data("kendoDatePicker").value("");
		$("#cre_endContractualDate").data("kendoDatePicker").enable(false);
		$("#cre_endOverrideDate").data("kendoDatePicker").value("");
		$("#cre_endOverrideDate").data("kendoDatePicker").enable(false);
		$("#cre_startDateCode").data("kendoDropDownList").value("-1");
		$("#cre_startDateCode").data("kendoDropDownList").enable(false);
		$("#cre_startDateStatus").data("kendoDropDownList").value("-1");
		$("#cre_startDateStatus").data("kendoDropDownList").enable(false);
		$("#cre_endDateCode").data("kendoDropDownList").value("-1");
		$("#cre_endDateCode").data("kendoDropDownList").enable(false);
		$("#cre_endDateStatus").data("kendoDropDownList").value("-1");
		$("#cre_endDateStatus").data("kendoDropDownList").enable(false);
		
		$("#cre_startContractualDateText").addClass("disableTextClass");
		$("#cre_startOverrideDateText").addClass("disableTextClass");
		$("#cre_endContractualDateText").addClass("disableTextClass");
		$("#cre_endOverrideDateText").addClass("disableTextClass");
		$("#cre_startDateCodeText").addClass("disableTextClass");
		$("#cre_startDateStatusText").addClass("disableTextClass");
		$("#cre_endDateCodeText").addClass("disableTextClass");
		$("#cre_endDateStatusText").addClass("disableTextClass");
		$("#cre_terms").addClass("disableTextClass");
	};
	
	this.enableTerms = function(){
		$("#cre_startContractualDate").data("kendoDatePicker").value("");
		$("#cre_startContractualDate").data("kendoDatePicker").enable(true);
		$("#cre_startOverrideDate").data("kendoDatePicker").value("");
		$("#cre_startOverrideDate").data("kendoDatePicker").enable(true);
		$("#cre_endContractualDate").data("kendoDatePicker").value("");
		$("#cre_endContractualDate").data("kendoDatePicker").enable(true);
		$("#cre_endOverrideDate").data("kendoDatePicker").value("");
		$("#cre_endOverrideDate").data("kendoDatePicker").enable(true);
		$("#cre_startDateCode").data("kendoDropDownList").value("-1");
		$("#cre_startDateCode").data("kendoDropDownList").enable(true);
		$("#cre_startDateStatus").data("kendoDropDownList").value("-1");
		$("#cre_startDateStatus").data("kendoDropDownList").enable(true);
		$("#cre_endDateCode").data("kendoDropDownList").value("-1");
		$("#cre_endDateCode").data("kendoDropDownList").enable(true);
		$("#cre_endDateStatus").data("kendoDropDownList").value("-1");
		$("#cre_endDateStatus").data("kendoDropDownList").enable(true);
		
		$("#cre_startContractualDateText").removeClass("disableTextClass");
		$("#cre_startOverrideDateText").removeClass("disableTextClass");
		$("#cre_endContractualDateText").removeClass("disableTextClass");
		$("#cre_endOverrideDateText").removeClass("disableTextClass");
		$("#cre_startDateCodeText").removeClass("disableTextClass");
		$("#cre_startDateStatusText").removeClass("disableTextClass");
		$("#cre_endDateCodeText").removeClass("disableTextClass");
		$("#cre_endDateStatusText").removeClass("disableTextClass");
		$("#cre_terms").removeClass("disableTextClass");
	};
	
	this.disableInfoCodes = function(){
		$("#cre_infoCodeSelector").data("kendoHierarchySelector").clear();
		$("#cre_infoCodeSelector").attr('disabled', true);
		$("#cre_restrictionAddSelected").attr('disabled', true);
		$("#cre_restrictionRemoveSelected").attr('disabled', true);
		$("#cre_infoCodeTreeViewMultiText").addClass("disableTextClass");
		$("#cre_infoCodeCustomDateDisplay").html('');
		$("#cre_infoCodeCustomDateDisplay").attr('disabled', true);
		$("#cre_infoCodeTerms").addClass('disableTextClass');
		$("#cre_addEditButton").attr("disabled", true);
		
		$("#cre_removeInfoCodesAdd").attr("disabled", true);
		$("#cre_removeInfoCodesAdd").addClass("disableTextClass");
		$("#cre_addInfoCodesAdd").attr("disabled", true);
		$("#cre_addInfoCodesAdd").addClass("disableTextClass");
		$("#cre_restrictionAddSelectedText").addClass("disableTextClass");
		
		$("#cre_removeInfoCodesRemove").attr("disabled", true);
		$("#cre_removeInfoCodesRemove").addClass("disableTextClass");
		$("#cre_addInfoCodesRemove").attr("disabled", true);
		$("#cre_addInfoCodesRemove").addClass("disableTextClass");
		$("#cre_restrictionRemoveSelectedText").addClass("disableTextClass");
		$("#cre_infoCodeGroups").data("kendoMultiSelect").value([]);
		$("#cre_infoCodeGroups").data("kendoMultiSelect").enable(false);
		this.restrictionsToAdd = new Array();
	};
	
	this.enableInfoCodes = function(){
		$("#cre_infoCodeSelector").data("kendoHierarchySelector").clear();
		$("#cre_infoCodeSelector").attr('disabled', false);
		$("#cre_restrictionAddSelected").attr('disabled', false);
		$("#cre_restrictionRemoveSelected").attr('disabled', false);
		$("#cre_infoCodeTreeViewMultiText").removeClass("disableTextClass");
		$("#cre_infoCodeCustomDateDisplay").html('');
		$("#cre_infoCodeCustomDateDisplay").attr('disabled', false);
		$("#cre_infoCodeTerms").removeClass('disableTextClass');
		
		$("#cre_removeInfoCodesAdd").attr("disabled", false);
		$("#cre_removeInfoCodesAdd").removeClass("disableTextClass");
		$("#cre_addInfoCodesAdd").attr("disabled", false);
		$("#cre_addInfoCodesAdd").removeClass("disableTextClass");
		$("#cre_restrictionAddSelectedText").removeClass("disableTextClass");
		
		$("#cre_removeInfoCodesRemove").attr("disabled", false);
		$("#cre_removeInfoCodesRemove").removeClass("disableTextClass");
		$("#cre_addInfoCodesRemove").attr("disabled", false);
		$("#cre_addInfoCodesRemove").removeClass("disableTextClass");
		$("#cre_addEditButton").attr("disabled", false);
		$("#cre_restrictionRemoveSelectedText").removeClass("disableTextClass");
		$("#cre_infoCodeGroups").data("kendoMultiSelect").enable(true);
	};
	
	this.disableStrandSet = function(){
		$("#cre_strandSetComboBox").data("kendoComboBox").value("");
		$("#cre_strandSetComboBox").data("kendoComboBox").text("");
		$("#cre_strandSetComboBox").data("kendoComboBox").enable(false);
		$("#cre_strandSetText").addClass("disableTextClass");
	};
	
	this.enableStrandSet = function(){
		$("#cre_strandSetComboBox").data("kendoComboBox").value("");
		$("#cre_strandSetComboBox").data("kendoComboBox").text("");
		$("#cre_strandSetComboBox").data("kendoComboBox").enable(true);
		$("#cre_strandSetText").removeClass("disableTextClass");
	};
	
	this.disableAllElements = function(){
		this.disableMedia();
		this.disableTerritory();
		this.disableLanguage();
		this.disableTerms();
		this.disableInfoCodes();
		this.disableStrandSet();
		this.disableCommentBox();
	};
	
	this.disableElementsForProductInfoType = function(){
		this.disableMedia();
		this.disableTerritory();
		this.disableLanguage();
		this.disableTerms();
		this.disableStrandSet();
		this.disableCustomInfoCodeDate();
		//this.disableCommentBox();
	};
	
	this.enableElementsForProductInfoType = function(){
		this.enableInfoCodes();		
	};
	
	this.disableWhenExclusionChecked = function(){
		this.disableInfoCodes();
		this.disableTerms();
	};
	
	this.resetRadioButtons = function(){
		$("#cre_inclusion")[0].checked = false;
		$("#cre_exclusion")[0].checked = false;
		$("#cre_productInfoCodeType")[0].checked = false;
	};
	
	this.resetTargetListBox = function(){
		$(".crossProductTargetsArea").empty();
	};
	
	this.enableTermsAndInfoCodesElements = function(){
		this.enableTerms();
		this.enableInfoCodes();
	};
	
	this.disableTermsAndInfoCodesElements = function(){
		this.disableTerms();
		this.disableInfoCodes();		
	};
	
	this.enableMTL = function(){
		this.enableMedia();
		this.enableTerritory();
		this.enableLanguage();
	};
	
	this.enableForInclusion = function(){
		this.enableTermsAndInfoCodesElements();
		this.enableMedia();
		this.enableTerritory();
		this.enableLanguage();
		this.enableTerms();
		this.enableStrandSet();
		this.enableCommentBox();
	};
	
	this.disableForExclusion = function(){
		this.disableTermsAndInfoCodesElements();
	};
	
	this.enableForExclusion = function(){
		this.enableMTL();
		this.enableStrandSet();
		this.enableCommentBox();
	};
	
	this.disableCustomInfoCodeDate = function(){
		
		$("#cre_infoCodeCustomDateDisplay").html('');
		$("#cre_infoCodeCustomDateDisplay").attr('disabled', true);
		$("#cre_infoCodeTerms").addClass('disableTextClass');
		$("#cre_addEditButton").attr("disabled", true);
	};
	
	this.enableCustomInfoCodeDate = function(){
		
		$("#cre_infoCodeCustomDateDisplay").html('');
		$("#cre_infoCodeCustomDateDisplay").attr('disabled', false);
		$("#cre_infoCodeTerms").removeClass('disableTextClass');
		$("#cre_addEditButton").attr("disabled", false);
	};
	
	this.disableCommentBox = function(){
	};
	
	this.enableCommentBox = function(){
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
		var sel = $("#cre_mediaSelector").data("kendoHierarchySelector");
		if(sel.getAccumulated() <= 0){
			errorPopup.showErrorPopupWindow("You must make a media selection...");
			return false;
		}
		return true;
	};
	
	this.validateTerritory = function(){
		var sel = $("#cre_territorySelector").data("kendoHierarchySelector");
		if(sel.getAccumulated() <= 0){
			errorPopup.showErrorPopupWindow("You must make a territory selection...");
			return false;
		} 
		return true;
	};
	
	this.validateLanguage = function(){
		var sel = $("#cre_languageSelector").data("kendoHierarchySelector");
		if(sel.getAccumulated() <= 0){
			errorPopup.showErrorPopupWindow("You must make a language selection...");
			return false;
		} 
		return true;
	};
	
	/**
	 * 
	 */
	this.validateTerm = function(){	
		
		var startDateValue = getCorrectDateFromKendoDatePicker("cre_startContractualDate"); //$("#cre_startContractualDate").data("kendoDatePicker").value();
		
		var endDateValue = getCorrectDateFromKendoDatePicker("cre_endContractualDate"); //$("#cre_endContractualDate").data("kendoDatePicker").value();
		
		var startDateCodeValue = $("#cre_startDateCode").data("kendoDropDownList").value();
		var endDateCodeValue = $("#cre_endDateCode").data("kendoDropDownList").value();
		
		var startOverrideDateValue = getCorrectDateFromKendoDatePicker("cre_startOverrideDate"); //$("#cre_startOverrideDate").data("kendoDatePicker").value();
		
		var endOverrideDateValue = getCorrectDateFromKendoDatePicker("cre_endOverrideDate"); //$("#cre_endOverrideDate").data("kendoDatePicker").value();
		
		var startDateStatus = $("#cre_startDateStatus").data("kendoDropDownList").value();
		var endDateStatus = $("#cre_endDateStatus").data("kendoDropDownList").value();
		var sdcv = (isNaN(startDateCodeValue)) ? null : parseInt(startDateCodeValue);
		
		if(!startDateValue && (!sdcv || (sdcv <= 0)) && !startOverrideDateValue){
			errorPopup.showErrorPopupWindow(START_DATE_ERROR); //"You must select/enter either a term start date, or a start date code, or an override start date...");
			return false;
		}
		
		if(startDateValue && isNaN(Date.parse(startDateValue))){
			errorPopup.showErrorPopupWindow("Invalid term start date...");
			return false;
		}
		
		if(!endDateValue && (!endDateCodeValue || (parseInt(endDateCodeValue)) <= 0) && !endOverrideDateValue){
			errorPopup.showErrorPopupWindow(END_DATE_ERROR); //"You must select/enter either a contractual end date, or a end date code, or an override end date...");
			return false;
		}
		
		if(endDateValue && isNaN(Date.parse(endDateValue))){
			errorPopup.showErrorPopupWindow("Invalid contractual end date...");
			return false;
		}
		
		if(startDateValue && parseInt(startDateStatus) == -1){
			errorPopup.showErrorPopupWindow("Since you selected a term start date you must select a start date status...");
			return false;
		}
		
		if((endDateValue || (parseInt(endDateCodeValue) == 1)) && parseInt(endDateStatus) == -1){
			errorPopup.showErrorPopupWindow("Since you selected a contractual end date or you set end date code to Perpetuity you must select a end date status...");
			return false;
		}
		
		var sd = this.getStartDateForValidation();
		var ed = this.getEndDateForValidation();
		if(sd && ed){
			if(ed <= sd){
				errorPopup.showErrorPopupWindow(END_DATE_BEFORE_START_DATE_ERROR); //"The end date cannot be the same or before the start date...");
				return false;
			}
		}				
		return true;
	};
	
	this.getStartDateForValidation = function(){
		if($("#cre_startOverrideDate").data("kendoDatePicker").value()){
			return Date.parse($("#cre_startOverrideDate").data("kendoDatePicker").value());
		}
		if($("#cre_startContractualDate").data("kendoDatePicker").value()){
			return Date.parse($("#cre_startContractualDate").data("kendoDatePicker").value());
		}
		return null;
	};
	
	this.getEndDateForValidation = function(){
		if($("#cre_endOverrideDate").data("kendoDatePicker").value()){
			return Date.parse($("#cre_endOverrideDate").data("kendoDatePicker").value());
		}
		if($("#cre_endContractualDate").data("kendoDatePicker").value()){
			return Date.parse($("#cre_endContractualDate").data("kendoDatePicker").value());
		}
		return null;
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
		if($("#cre_inclusion")[0].checked){
			if(!this.validateTerm()){
				return false;
			}
		}
		
		
		return true;
	};
	
	this.getCurrentAngularScope = function(){
		return angular.element(document.getElementById("rightsController")).scope();
	};
	
	/*************************************************************************************
	 *                                                                                   *
	 *                           End validation section                                  *
	 *                                                                                   *
	 *************************************************************************************/
}

var createRightStrandObject = new createRightStrand();
var cre_rightStrandCreateWindow = null;
var cre_infoCodePopup = null;
var cre_submitPopupWindow = null;
var cre_showAddComment = false;
var icp_showAddComment = false;
