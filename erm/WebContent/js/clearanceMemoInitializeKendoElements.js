this.clearanceMemoTreeView = null;
this.clearanceMemoEditor = null;
this.path = paths();

function openBaselineVersion(id) {
	if (eval(id) > 0) {
	  var versionTitle = "$('#baselineVersions option[value=" + id + "]').text()";
	  window.open('/erm/rest/pdfgen/getBaselinePDF/' + id + '/' + eval(versionTitle));
	}
}

function clearUploadError() {  
  $(".k-upload-files").html("");
}

function trimWhiteSpaces(value) {
   var temp = value;
   var obj = /[\s+\.]/;
   if (obj.test(temp)) { temp = temp.replace(obj, '$2'); }
   var obj = / +/g;
   temp = temp.replace(obj, " ");
   if (temp == " ") { temp = ""; }
   return temp;
}

function computeTOCLevel(childSequence, level, previousPosition) {
  if (level > 1)
    return previousPosition + "." + childSequence;
  else
	return childSequence;  
}

var treeObjectList = [];

function clearanceMemoKendoElementInit(clearanceMemoObject){
	var that = this;
	
	
	this.clearanceMemoObject = clearanceMemoObject;
	
	function generateTreeLoop(canModifyClearanceMemos, cmObject, previousPosition, clearanceMemoKendoElementInit, parentid) {		
		var treeObject = {
		  text : "",
		  treePosition : "",
		  parentid : 0,
		  dbid : 0,
		  tocID : 0,
		  ignoreTitle : false,
		  linked : false,
		  showPublic :  false,
		  attachments : "",
		  expanded : true,	
		  items : []
		};
		previousPosition = computeTOCLevel(cmObject.childSequence, cmObject.level, previousPosition);
		treeObject.text = cmObject.title != null ? cmObject.title.escapeToJSON() : "";			  			 			  			  
		treeObject.treePosition = previousPosition;		
		treeObject.parentid = parentid;			 			 
		treeObject.dbid = cmObject.id;
		treeObject.tocID = cmObject.tocID;
		treeObject.ignoreTitle = cmObject.ignoreTitle;
		if (cmObject.linked) {			
		  clearanceMemoKendoElementInit.clearanceMemoObject.linkedMap[eval(cmObject.id)] = cmObject.id;
		}
		treeObject.linked = cmObject.linked;			  
		treeObject.showPublic = cmObject.showPublic;
		treeObject.attachments = cmObject.attachments; 
		console.log("cmObject.nodes : %o", cmObject.nodes);
		if (cmObject.nodes == null || cmObject.nodes.length == 0 ) {
		  if (typeof treeObject.items !== "undefined")
			delete treeObject.items;
		}
		if (cmObject.nodes != null) {
	      for (var i = 0; i < cmObject.nodes.length; i++)  {
	        if (canModifyClearanceMemos || eval(cmObject.nodes[i].showPublic)) {
	          if (typeof treeObject.items !== "undefined")
	    	    treeObject.items.push(generateTreeLoop(canModifyClearanceMemos, cmObject.nodes[i], previousPosition, clearanceMemoKendoElementInit, treeObject.dbid));	          
	    	} else {
	    	  if (typeof treeObject.items !== "undefined" && i == cmObject.nodes.length)
	    		delete treeObject.items;	    	  
	    	}
	      }
		} 
		return treeObject;
	}
	function compileDataSourceJSON(canModifyClearanceMemos, clearanceMemo, clearanceMemoKendoElementInit){
	  for (var i = 0; i <  clearanceMemo.nodes.length; i++) {
		if (canModifyClearanceMemos || eval(clearanceMemo.nodes[i].showPublic)) {
	      treeObjectList.push(generateTreeLoop(canModifyClearanceMemos, clearanceMemo.nodes[i], "", clearanceMemoKendoElementInit, clearanceMemo.rootNodeId));
		}
	  }
	}
	
	this.getClearanceMemoFromDB =  function() {
	  showSubmitPopupWindow();
	  var path = paths("rest");
	  var rcscope = angular.element(document.getElementById("rightsController")).scope();
	  var url = path.getClearanceMemoRootRESTPath() + rcscope.currentProductArray.foxVersionId;	  
	  $.get(url, function(data) {		
	    //console.log("get clearance memo: %o" + data);		
	    clearanceMemo = data;
	    setUpClearanceMemo(rcscope);
	    var r = new restriction("", "", "", "", "", "");
		console.log("clearanceMemo %o", clearanceMemo);
		$("#memoCreatedDate").html(r.getCustomDisplayDate(clearanceMemo.entityComment.createDate));
		$("#memoCreatedBy").html(clearanceMemo.entityComment.createName);
		r = new restriction("", "", "", "", "", "");
		$("#memoLastUpdatedDate").html(r.getCustomDisplayDate(clearanceMemo.entityComment.updateDate));
		$("#memoLastUpdatedBy").html(clearanceMemo.entityComment.updateName);
	  }).fail(function(xhr,status,message,rcscope){
		// failed  to update saveDoNotLicense		   
		console.log("failed to get Clearance Memo");		  
		// Add indicator to screen for user	  
	  });	
	};
	
	function confirmDeleteClearanceMemo() {
		 clearDelConfirmButtons();
	     $("#deleteConfirmDetails").html("the Clearance Memo and Clearance Report for this product?");	     
		 $("#strands-set-warning-div").addClass("forceShow");
		 if (clearanceMemoKendoElementInit.clearanceMemoObject.isMapped)
		   $("#strands-set-warning-div").html("<i class=\"icon-warning-sign\"></i>  Please note:  There are strands/informational codes mapped to this clearance memo and this action can not be reversed.");
		 else
		   $("#strands-set-warning-div").html("<i class=\"icon-warning-sign\"></i>  Please note:  This action can not be reversed.");			 	 		 
	     showDeleteConfirmationWindow();	     	    
	     $("#delete-clearance-memo-confirm").addClass("forceShow");	    
	}
	
	function deleteClearanceMemoFromDB() {
	  closeDeleteConfirmationWindow();
	  showSubmitPopupWindow();
	  var rcscope = angular.element(document.getElementById("rightsController")).scope();		
	  var url = this.path.getClearanceMemoDeleteRESTPath();	   
	  console.log("url: " + url);
	  var jsonData = {
		'foxVersionId': rcscope.currentProductArray.foxVersionId		  
	  };						
	  console.log("Delete jsonData: %o", jsonData);	  	 
	  $.post(url, JSON.stringify(jsonData), function(data) {		
	    console.log("deleted clearance memo: ");
	    closeSubmitPopupWindow();
		var psscope = angular.element(document.getElementById("productSearchController")).scope();		
		psscope.productSearch.searchOptionsChanged = true;			
		rcscope.currentProductArray.hasClearanceMemo = false;
		rcscope.currentProductVersionLocal = rcscope.searchTree(rcscope.productVersionTree, rcscope.currentProductArray.foxVersionId);
		rcscope.currentProductVersionLocal.hasClearanceMemo = false;
		rcscope.updateRightsIndicator(rcscope.currentProductArray.foxVersionId);
		rcscope.displayConfirmationStatus();
		clearanceMemoKendoElementInit.clearanceMemoObject.loadClearenceMemoPreview();
		rcscope.currentProductArray.legalConfirmationStatusId = null;		
		$("#memoCreatedDate").html("");
		$("#memoCreatedBy").html("");		
		$("#memoLastUpdatedDate").html("");
		$("#memoLastUpdatedBy").html("");		
		$("#legalConfirmationStatusDescription").html("");
		if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest')
			rcscope.$apply();				
	  }).fail(function(xhr,status,message,rcscope){
		// failed  to update saveDoNotLicense		   
		console.log("failed to Delete Clearance Memo");		  
		// Add indicator to screen for user
	    closeSubmitPopupWindow();
	    var displayMessage = xhr.responseText;
		showErrorPopupWindow(displayMessage.toString().replace(/\"/g, ''));
	  });	  
	}
	
	//var FirstLoad = false;
	function uploadClearanceMemo() {
        $(".k-upload-files").empty();
		var rcscope = angular.element(document.getElementById("rightsController")).scope();
		var url = this.path.getClearanceMemoNodeUploadRESTPath() + rcscope.foxVersionId;
		//console.log("uploadClearanceMemo : FirstLoad " + FirstLoad + " url.indexOf(rcscope.foxVersionId) " + url.indexOf(rcscope.foxVersionId));
		//if (FirstLoad) {
			//FirstLoad = true;
			console.log("using new url");
			$("#upload-cm").unbind();
			$("#upload-cm").kendoUpload({
		 		async: {
		 			saveUrl:url,
		 			autoUpload:true
		 		},
		 		localization: {
		            statusFailed: "customStatusFailed"
		        },
		        multiple: false,
		 		select: onUploadSelect,
		 		success: onUploadSuccess,
		 		complete: onUploadComplete,
		 		error: onUploadError
		 	});	 
		//}
		$("#upload-cm").click();	    
	}
	
	function createClearanceMemoFromDB() {
	  showSubmitPopupWindow();
	  var rcscope = angular.element(document.getElementById("rightsController")).scope();		
	  var url = this.path.getClearanceMemoCreateRESTPath();	   
	  console.log("url: " + url);
	  var jsonData = {
		'foxVersionId': rcscope.currentProductArray.foxVersionId		  
	  };						
	  console.log("New jsonData: %o", jsonData);	  	 
	  $.post(url, JSON.stringify(jsonData), function(data) {		
	    console.log("created clearance memo: ");
	    closeSubmitPopupWindow();
		var psscope = angular.element(document.getElementById("productSearchController")).scope();
		psscope.productSearch.searchOptionsChanged = true;			   
		rcscope.currentProductArray.hasClearanceMemo = true;
		rcscope.currentProductVersionLocal = rcscope.searchTree(rcscope.productVersionTree, rcscope.currentProductArray.foxVersionId);
		rcscope.currentProductVersionLocal.hasClearanceMemo = true;
		rcscope.updateRightsIndicator(rcscope.currentProductArray.foxVersionId);
		rcscope.currentProductArray.legalConfirmationStatusId = 4; // set to draft
	    that.getClearanceMemoFromDB();
	    //closeSubmitPopupWindow();								
		$("#legalConfirmationStatusDescription").html(erm.dbvalues.legalConfirmationDescMap[rcscope.currentProductArray.legalConfirmationStatusId] != null ? 
						 erm.dbvalues.legalConfirmationDescMap[rcscope.currentProductArray.legalConfirmationStatusId] : "");
		if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest')
			rcscope.$apply();			
	  }).fail(function(xhr,status,message,rcscope){
		// failed  to update saveDoNotLicense		   
		console.log("failed to Create Clearance Memo");		  
		// Add indicator to screen for user
	    closeSubmitPopupWindow();
	    var displayMessage = xhr.responseText;
		showErrorPopupWindow(displayMessage.toString().replace(/\"/g, ''));
		//var rcscope = angular.element(document.getElementById("rightsController")).scope();
		//$("#urm1_" + rcscope.foxVersionId).click();		
	  });	  
	}	
	
	function setUpClearanceMemo(rcscope) {						
		rcscope.currentProductArray.clearanceMemoRootNodeId = clearanceMemo.rootNodeId;
		var canModifyClearanceMemos = (rcscope.security.canModifyClearanceMemos ? true : false);
		
		treeObjectList = [];
		// Set Values in treeObjectList
		
		compileDataSourceJSON(canModifyClearanceMemos, clearanceMemo, clearanceMemoKendoElementInit);														
		var generatedDataSource =  treeObjectList;
		
		//console.log("generatedDataSource %o, " + JSON.stringify(generatedDataSource));
		
		// Clearance Memo Editor Setup
		if (!$("#clearanceMemoEditor").data("kendoEditor")) {
			clearanceMemoEditor = $("#clearanceMemoEditor").kendoEditor({			
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
		              //console.log("Current Selection", $(selection.toString()).text());
		              //console.log("Current Body ", editor.body);
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
			            console.log("Current range %o", range);
			            range.selectNodeContents(editor.body);
				        editor.selectRange(range);
			          }	              		          		          
			          var selectedHTML = editor.selectedHtml();
			          console.log("Current Selection 1 %o", selectedHTML);
			          selectedHTML = selectedHTML.replace(/<p><\/p><p><\/p>/g, '<p><\/p>');		          		          		          
			          console.log("Current Selection 4 %o", selectedHTML);		          
			          editor.paste(selectedHTML);
			        }	
			      },
			      { 
				    name: "extractNumbers",
				    title: "Insert Extract Numbers",
			        exec: function(e) {
			          var editor = $(this).data("kendoEditor");			          	           			          	              		          		       
			          var selectedHTML = " (x&lt;extract number&gt;, x&lt;extract number&gt;)";			          			          		          		          		          			          		         
			          editor.paste(selectedHTML);
			        }	
			      },
			      {
			    	name: "tabIcon",
				    title: "Insert Tab",
			        exec: function(e) {
			          var editor = $("#clearanceMemoEditor").data("kendoEditor");			          	           			          	              		          		       				      
				      //var selection = editor.getSelection();	              
		              //if (selection.toString() == "") {	            	
		            	//selection = editor.body.innerHTML;
		            	//var range = editor.createRange();
		            	//range.selectNodeContents(editor.body);
			            //editor.selectRange(range);
		              //}
		              var selectedHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";	
				      editor.paste(selectedHTML);
			        }
			      },
			      {
			    	name: "pageBreak",
				    title: "Insert Page Break for Printing",
			        exec: function(e) {
			          var editor = $("#clearanceMemoEditor").data("kendoEditor");			          	           			          	              		          		       
				      var selectedHTML = "<p class='pageBreak'></p>";
				      editor.paste(selectedHTML);
			        }
			      }
				]
			});						
		}
        
		if (!$("#clearanceMemoTreeView").data("kendoTreeView")) {
			clearanceMemoTreeView = $("#clearanceMemoTreeView").kendoTreeView({			
				template: canModifyClearanceMemos ? "#= item.treePosition # " + "# if (!item.showPublic)  { # <span class=\"icon-eye-close\"></span># } #" + "# if (item.attachments != null && item.attachments.length > 0)  { # <span class=\"icon-paperclip\"></span># } #" + " #= item.text #" + "# if (item.linked)  { # <span onClick='clearanceMemoObject.showLinkedItems(#= item.dbid #)' class=\"icon-unlink\"></span># } #" : " #= item.text #", 			
	            dataSource: generatedDataSource,
	            checkboxes: {
	              template: "<input type='checkbox' linked='#= item.linked #' treePosition='#= item.treePosition #' parentid='#= item.parentid #' id='#= item.dbid #' checkboxid='#= item.dbid #' name='linkedEntry[#= item.dbid #]' value='true' />"
	            },
	            dragAndDrop: canModifyClearanceMemos, // rcscope.security.canModifyClearanceMemos                         
	            animation: {
	                collapse: {
	                  effects: "fadeOut collapseVertical"
	                }
	            },
	            select: function(e) {
	              console.log("Selecting", e.node);              
	              checkSelectedNode(e.node);
	            },
	            drag: function(e) {              
	              checkDraggedElement(e);
	            },            
	            dragend : function(e) {              
	              updateDroppedElement(e);
	            }
	        })
	        .on('dblclick', '.k-in', function(event){        	
	        	if (canModifyClearanceMemos) {
	        	  $target = $(event.target);		
	    		  var selectedDataItem = clearanceMemoTreeView.dataItem($target);
	    		  console.log("Handler for .dblclick() called tree position: " +  selectedDataItem.treePosition + " text: " + selectedDataItem.text);		
	    		  $("#tocTitleEditWindowTreePosition").html(selectedDataItem.treePosition);
	    		  if (selectedDataItem.ignoreTitle) {
	    			$("#tocIgnoreTitle").prop("checked", true);
	    		  } else {
	    			$("#tocIgnoreTitle").prop("checked", false);
	    		  }
	    		  if (selectedDataItem.text.indexOf("[") < 0) {
  	    		    $("#tocTitleEditWindowInput").val(selectedDataItem.text);
	    		  } else {
	    		    $("#tocTitleEditWindowInput").val("");
	    		  }
	    		  $("#tocTitleEditWindowInput").attr("placeholder", "Enter your title here");
	    		  console.log("edit window tree pos %o", $("#tocTitleEditWindowTreePosition"));
	    		  console.log("edit window input value %o", $("#tocTitleEditWindowInput"));
	    		  clearanceMemoKendoElementInit.clearanceMemoObject.showTOCTitleEditWindow(selectedDataItem.treePosition);
	        	}
	        }).on('click', 'input:checkbox', function(event){        	        	    	
	    		clearanceMemoKendoElementInit.clearanceMemoObject.updateLinkedItemsChecked();
	        }).on('click', '.memoInfoToolbar', function(event){        	        	    	    		
	    		clearanceMemoTreeView.select($());
	        }).data("kendoTreeView");	
		} else {		  
		  $("#clearanceMemoTreeView").data("kendoTreeView").setDataSource(generatedDataSource);		  
		}
		closeSubmitPopupWindow();
		clearanceMemoKendoElementInit.clearanceMemoObject.showClearanceMemoPopup();
		clearanceMemoKendoElementInit.clearanceMemoObject.loadClearenceMemoPreview();		
		var editor = $("#clearanceMemoEditor").data("kendoEditor");
		editor.body.contentEditable=false;
	}
	
	function checkDraggedElement(e) {		
		sourceTreePosition = clearanceMemoTreeView.dataItem(e.sourceNode).treePosition;
		if (clearanceMemoTreeView.dataItem(e.dropTarget) == null)
			e.setStatusClass("k-denied");
		dropTreePosition = clearanceMemoTreeView.dataItem(e.dropTarget).treePosition;
		//console.log("Dragging", sourceTreePosition, "over", dropTreePosition);
		//console.log("Drag Tree Position: ", sourceTreePosition.split("\.").length, " Over Tree Position: ", dropTreePosition.split("\.").length, " statusClass ", e.statusClass);
		if (sourceTreePosition.toString().split("\.").length != dropTreePosition.toString().split("\.").length)
	      e.setStatusClass("k-denied");
		if (e.statusClass.indexOf("add") >= 0 && eval(dropTreePosition.toString().split("\.").length) >= 4)
		  e.setStatusClass("k-denied");		
		console.log("$(e.sourceNode).find(li).length() " + $(e.sourceNode).find("li").length);				  
		if ($(e.sourceNode).find("li").length > 0 && dropTreePosition.toString().split("\.").length >= 3) {
		  e.setStatusClass("k-denied");		  			 		 
	    }
		$(e.sourceNode).find("li").each(function () {		  	
	      if ($(this).find("li").length > 0) {
	    	  e.setStatusClass("k-denied");  
		  }
		});
	}
	
	function updateDroppedElement(e) {
		droppedItem = clearanceMemoTreeView.dataItem(e.sourceNode);
		if (droppedItem != null)
			console.log("Dropped", droppedItem);
		else
			console.log("Dropped item is null", droppedItem);
		if (clearanceMemoTreeView.dataItem($(e.destinationNode).parent()) != null) {
		  clearanceMemoKendoElementInit.clearanceMemoObject.updateChildren($(e.destinationNode).parent());
		  setTimeout(function() {
		    clearanceMemoKendoElementInit.clearanceMemoObject.moveDBItem(droppedItem, clearanceMemoTreeView.dataItem($(e.destinationNode).parent()));		  
		  }, 200);	 		  
		  //clearanceMemoKendoElementInit.clearanceMemoObject.updateChildren($(e.destinationNode));
		} else {
		  console.log("Dropped with no parent");
		  var firstNode = $(e.destinationNode);		  
		  while (clearanceMemoTreeView.dataItem(firstNode) != null) {
			  currentTreePosition = clearanceMemoTreeView.dataItem(firstNode).treePosition;
			  console.log("currentTreePosition: ", currentTreePosition);
			  if (clearanceMemoTreeView.dataItem(firstNode.prev()) == null)
				  break;
			  firstNode = firstNode.prev();			
		  }
		  currentTreePosition = clearanceMemoTreeView.dataItem(firstNode).treePosition;
		  console.log("currentTreePosition: ", currentTreePosition);		  
		  clearanceMemoKendoElementInit.clearanceMemoObject.updateSiblings(firstNode);
		  setTimeout(function() {
			clearanceMemoKendoElementInit.clearanceMemoObject.moveDBItem(droppedItem, null);		  
		  }, 300);
		}
	}
	  
	function checkSelectedNode(selectedNode){	
      console.log("Inside checkSelectedNode %o", selectedNode);
	  console.log("Check linked attribute %o",  $(selectedNode).find("input").attr("linked"));	  
	  $("#cm-add-node").removeAttr("disabled");
	  $("#cm-add-node").removeClass("btn-disabled");
	  $("#cm-levelup-node").removeAttr("disabled");
	  $("#cm-levelup-node").removeClass("btn-disabled");
	  $("#cm-leveldown-node").removeAttr("disabled");
	  $("#cm-leveldown-node").removeClass("btn-disabled");
	  $("#cm-tableft-node").removeAttr("disabled");
	  $("#cm-tableft-node").removeClass("btn-disabled");
	  $("#cm-tabright-node").removeAttr("disabled");
	  $("#cm-tabright-node").removeClass("btn-disabled");
	  $("#cm-remove-node").removeAttr("disabled");
	  $("#cm-remove-node").removeClass("btn-disabled");
	  $("#cm-link-node").removeAttr("disabled");
	  $("#cm-link-node").removeClass("btn-disabled");
	  var currentTreePosition = null;	  
      var selectedDataItem = clearanceMemoTreeView.dataItem(selectedNode);
	  if (selectedNode != null && selectedDataItem != null) {		
		currentTreePosition = selectedDataItem.treePosition;
		//console.log("DB ID: %o, Tree position %o", clearanceMemoTreeView.dataItem(selectedNode).dbid, currentTreePosition);
		clearanceMemoKendoElementInit.clearanceMemoObject.loadClearenceMemoText(selectedDataItem.dbid);
	  }
	  if (selectedNode.previousSibling == null) {			  
		$("#cm-levelup-node").attr("disabled", "disabled");
		$("#cm-levelup-node").addClass("btn-disabled");
		$("#cm-tabright-node").attr("disabled", "disabled");
		$("#cm-tabright-node").addClass("btn-disabled");
	  }
	  if (eval($(selectedNode).find("input").attr("linked"))) {	
		$("#cm-tabright-node").attr("disabled", "disabled");
		$("#cm-tabright-node").addClass("btn-disabled");
	  }
	  if (selectedNode.nextSibling == null) {			  
		$("#cm-leveldown-node").attr("disabled", "disabled");
		$("#cm-leveldown-node").addClass("btn-disabled");
	  }
	  var treePositionString = JSON.stringify(currentTreePosition);
	  if (treePositionString.indexOf("\.") > 0) {
		var periodSplit = currentTreePosition.split("\.");	    
		console.log("periodSplit length: " + periodSplit.length);
		if (periodSplit.length == 4) {		  
		    $("#cm-tabright-node").attr("disabled", "disabled");
		    $("#cm-tabright-node").addClass("btn-disabled");
		    $("#cm-add-node").attr("disabled", "disabled");
			$("#cm-add-node").addClass("btn-disabled");
		}
		if (eval($(selectedNode).find("input").attr("linked"))) {
		  $("#cm-add-node").attr("disabled", "disabled");
		  $("#cm-add-node").addClass("btn-disabled");		
		}
		console.log("$(selectedNode).find(li).length() " + $(selectedNode).find("li").length);
		if ($(selectedNode).find("li").length > 0  || eval($(selectedNode).find("input").attr("linked"))) {
		  $("#cm-tabright-node").attr("disabled", "disabled");
	      $("#cm-tabright-node").addClass("btn-disabled");		  			 		 
		}
		if (eval($(selectedNode).find("input").attr("linked"))) {
		  $("#cm-tableft-node").attr("disabled", "disabled");
		  $("#cm-tableft-node").addClass("btn-disabled");
		}
	  } else {
		$("#cm-tableft-node").attr("disabled", "disabled");
		$("#cm-tableft-node").addClass("btn-disabled");
		$(selectedNode).find("li").each(function (firstChild) {		  	
		  if ($(this).find("li").length > 0  || eval($(selectedNode).find("input").attr("linked"))) {
		    $("#cm-tabright-node").attr("disabled", "disabled");
		    $("#cm-tabright-node").addClass("btn-disabled");		  			 		 
		  }
		});
	  }
	  
	  $(".tocAttachments").addClass("forceShow");	  
	  
	  // HIGHLIGHT SELECTED AREA IN PREVIEW WINDOW
	  if (clearanceMemoKendoElementInit.clearanceMemoObject.lastSelectedDivID != null)
	    $(".clearanceMemoEditPreview .memoPreviewContent .content_" + clearanceMemoKendoElementInit.clearanceMemoObject.lastSelectedDivID).removeClass("selectedContent");	  
	  clearanceMemoKendoElementInit.clearanceMemoObject.lastSelectedDivID = selectedDataItem.dbid;
	  $(".clearanceMemoEditPreview .memoPreviewContent .content_" + selectedDataItem.dbid).addClass("selectedContent");
	  // SCROLL TO SELECTED AREA
	  $('.clearanceMemoEditPreview .memoPreviewContent').scrollTop(0);
	  if ($(".clearanceMemoEditPreview .memoPreviewContent .memoPreviewContentData .content_" + selectedDataItem.dbid) != null && 
			  $(".clearanceMemoEditPreview .memoPreviewContent .memoPreviewContentData .content_" + selectedDataItem.dbid).position() != null) {		  	     
	      $(".clearanceMemoEditPreview .memoPreviewContent .content_" + selectedDataItem.dbid).addClass("selectedContent");
		  $('.clearanceMemoEditPreview .memoPreviewContent').animate( {
		    scrollTop: eval($(".clearanceMemoEditPreview .memoPreviewContent .content_"+ selectedDataItem.dbid).position().top - 200)
		  }, 'fast');
	  }
	  var editor = $("#clearanceMemoEditor").data("kendoEditor");
	  editor.body.contentEditable=true;
	}
	
	/** on right click
	*$("#myTree").on('mousedown', '.k-item', function (event) {
	*    if (event.which === 3) {
	*        event.stopPropagation(); // to avoid propagation of this event to the root of the treeview
	*        $('#myTree').data('kendoTreeView').select(this);                        
	*    }
	*})
	*/
	
	this.setupClearanceMemoInitButtons =  function setupClearanceMemoInitButtons() {
		$("#delete-clearance-memo-confirm").unbind();
		$("#delete-clearance-memo-confirm").click(function(event) {	
			// Add indicator to screen for user
			event.preventDefault();
			deleteClearanceMemoFromDB();
		});
		
		$("#upload-clearance-memo-button").unbind();
		$("#upload-clearance-memo-button").click(function(event) {	
			// Add indicator to screen for user
			event.preventDefault();
			uploadClearanceMemo();
		});
		
		$("#add-clearance-memo-button").unbind();
		$("#add-clearance-memo-button").click(function(event) {	
			// Add indicator to screen for user
			event.preventDefault();
			createClearanceMemoFromDB();
		});
		
		$("#delete-clearance-memo-button").unbind();
		$("#delete-clearance-memo-button").click(function(event) {	
			// Add indicator to screen for user
			event.preventDefault();
			confirmDeleteClearanceMemo();
		});
		
		$("#edit-clearance-memo-button").unbind();
		$("#edit-clearance-memo-button").click(function(event) {
		  console.log("edit-clearance-memo-button clicked");
		  event.preventDefault();
		  var rcscope = angular.element(document.getElementById("rightsController")).scope();
		  clearanceMemoKendoElementInit.initCMKendoElements(rcscope);
		  clearanceMemoKendoElementInit.getClearanceMemoFromDB();
 		  // clear editor		  
		});
		
		$("#print-clearance-memo-button").unbind();
		$("#print-clearance-memo-button").click(function(event) {
		  event.preventDefault();
		  var rcscope = angular.element(document.getElementById("rightsController")).scope();
		  var url = paths().getClearanceHTMLRESTPath() + rcscope.currentProductArray.foxVersionId;
		  if (currentView == "M") {
		    url = url + "/true/false/true" + "/" + rcscope.currentProductArray.productTitle.replace(/\s+/g, '').replace(/\W+/g, '') + ".html";
		  }  else {
			url = url + "/false/false/true" + "/" + rcscope.currentProductArray.productTitle.replace(/\s+/g, '').replace(/\W+/g, '') + ".html";
		  }
		  var isFoxipediaSearch = rcscope.isFoxipediaSearch;
		  if (isFoxipediaSearch) {
			  url = url + "?isFoxipediaSearch=true";
		  }
		  window.open(url);
		}
		);		
		
		$("#download-clearance-memo-button").unbind();
		$("#download-clearance-memo-button").click(function(event) {
		  event.preventDefault();
		  var rcscope = angular.element(document.getElementById("rightsController")).scope();
		  var url = paths().getClearancePDFRESTPath() + rcscope.currentProductArray.foxVersionId;
		  if (currentView == "M") {
			url = url + "/true" + "/" + rcscope.currentProductArray.productTitle.replace(/\s+/g, '').replace(/\W+/g, '') + ".pdf";
		  }
		  else {
			url = url + "/false" + "/" + rcscope.currentProductArray.productTitle.replace(/\s+/g, '').replace(/\W+/g, '') + ".pdf";
		  }
		  var isFoxipediaSearch = rcscope.isFoxipediaSearch;
		  if (isFoxipediaSearch) {
			  url = url + "?isFoxipediaSearch=true";
		  }
		  
		  window.open(url);
		});
		
		$("#systemx-clearance-memo-button").unbind();
		$("#systemx-clearance-memo-button").click(function(event) {
		  event.preventDefault();
		  var rcscope = angular.element(document.getElementById("rightsController")).scope();
		  var isFoxipediaSearch = rcscope.isFoxipediaSearch;
		  var url = paths().getSystemXClearanceRESTPath() + rcscope.currentProductArray.foxVersionId;
		  if (isFoxipediaSearch) {
			  url  = url + '?isFoxipediaSearch=true';
		  }		  
		  window.open(url);
		});			
		
		$(".modifyContractualPartyButton").unbind();
		$(".modifyContractualPartyButton").click(function(event){
	    	event.preventDefault();    	    	   
	    	console.log("modifyContractualPartyButton clicked");
	    	var cpscope = angular.element(document.getElementById("contractualPartyController")).scope();
	    	cpscope.showContractualPartyPopup();
		});
	};
	
	/**
	 * 
	 * We run this once the document is ready (document.ready)
	 */
	this.initCMKendoElements = function initCMKendoElements(rightsController){
		this.initializeAddEditWindow();	 
		this.initializeTOCTitleEntryWindow();
		this.initializeBaslineTitleEntryWindow();
		this.setupClearanceMemoInitButtons();
		rcscope = angular.element(document.getElementById("rightsController")).scope();		
	};		
	
	function onUploadComplete() {        
	  setTimeout(function() {
		  //$(".k-widget.k-upload").find("ul").remove();
		  $("#upload-cm").value = null;
	  }, erm.statusIndicatorTime);
	}	
	
	function onUploadSelect() {
 	  $(".clearanceMemoToolbar .k-widget").addClass("forceShow");
 	 showSubmitPopupWindow();
	}
	function onUploadSuccess() {	 
 	 $(".clearanceMemoToolbar .k-widget").removeClass("forceShow");
 	 var rcscope = angular.element(document.getElementById("rightsController")).scope();
	 var psscope = angular.element(document.getElementById("productSearchController")).scope();		
	 psscope.productSearch.searchOptionsChanged = true;	 
	 rcscope.currentProductArray.hasClearanceMemo = true;	 
	 rcscope.currentProductVersionLocal = rcscope.searchTree(rcscope.productVersionTree, rcscope.currentProductArray.foxVersionId);
	 rcscope.currentProductVersionLocal.hasClearanceMemo = true;
	 rcscope.updateRightsIndicator(rcscope.currentProductArray.foxVersionId);
	 rcscope.currentProductArray.legalConfirmationStatusId = 4; // set to draft
	 that.getClearanceMemoFromDB();	 
	 $("#legalConfirmationStatusDescription").html(rcscope.getLegalStatusDescription(rcscope.currentProductArray.legalConfirmationStatusId));
	 $("#legalConfirmationStatusDescription").html(erm.dbvalues.legalConfirmationDescMap[rcscope.currentProductArray.legalConfirmationStatusId] != null ? 
					 erm.dbvalues.legalConfirmationDescMap[rcscope.currentProductArray.legalConfirmationStatusId] : "");
	 if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest')
		rcscope.$apply();	 
	 closeSubmitPopupWindow();
	}
	function onUploadError(e) {		
      closeSubmitPopupWindow();
      console.log("e %o", e);
	  var text = e.XMLHttpRequest.responseText;
 	  // Array with information about the uploaded files          
      $(".k-upload-status").append("<span id=\"uploadError\"><i onClick='clearUploadError();' style='cursor: pointer;' class='icon-remove'>clear</i><br/></span>");
	  var displayMessage = text;
	  showErrorPopupWindow(displayMessage.toString().replace(/\"/g, ''));	  
	  //var rcscope = angular.element(document.getElementById("rightsController")).scope();
	  //$("#urm1_" + rcscope.foxVersionId).click();
	}
	
	this.initializeAddEditWindow = function initializeAddEditWindow(){
	  if (!$("#template_addEditClearanceMemo").data("kendoWindow")) {
		$("#template_addEditClearanceMemo").kendoWindow({
          width: "95%",
          height : "610px",
          minWidth : "750px",
          minHeight : "600px",
          title: "Clearance Memo",
          actions: ["Maximize","Close"],
          visible : false
         });				
      }
	  addEditClearanceMemoWindow = $("#template_addEditClearanceMemo").data("kendoWindow");	  
	};
	
	this.initializeTOCTitleEntryWindow = function initializeTOCTitleEntryWindow(){
		if (!$("#tocTitleEditWindow").data("kendoWindow")) {
			$("#tocTitleEditWindow").kendoWindow({
                width: "800px",
                height : "auto",
                minWidth : "450px",
                minHeight : "200px",
                title: "Memo Table of Contents - Title Edit",
                actions: [],
                visible : false,
                close : function(){
                	$("#errorParagraph").html("");
                }
            });
			console.log("Initialized TOC Title Edit Window");
        }
		clearanceMemoKendoElementInit.clearanceMemoObject.tocTitleEditWindow = $("#tocTitleEditWindow").data("kendoWindow");
	};
	
	this.initializeBaslineTitleEntryWindow = function initializeBaselineTitleEntryWindow(){
		if (!$("#baselineTitleEditWindow").data("kendoWindow")) {
			$("#baselineTitleEditWindow").kendoWindow({
                width: "800px",
                height : "auto",
                minWidth : "450px",
                minHeight : "200px",                
                actions: [],
                visible : false,
                close : function(){
                	$("#baselineErrorParagraph").html("");
                }
            });
        }
		clearanceMemoKendoElementInit.clearanceMemoObject.baselineTitleEditWindow = $("#baselineTitleEditWindow").data("kendoWindow");
	};
	
}

var rcscope = null;
var clearanceMemoKendoElementInit = new clearanceMemoKendoElementInit(clearanceMemoObject);
var addEditClearanceMemoWindow = null;
var contractualPartyWindow = null;
var convertToUpperCase = true;
var clearanceMemo = null;

