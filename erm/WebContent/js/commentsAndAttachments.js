function commentsAndAttachments(){
	
	this.path = paths();
	this.callbackFunction = null;
	this.comment = new subrightComments();
	this.uploadedFiles = new Array();
	this.COMMENT_TYPE_ID = 6;
	this.foxVersionId = null;
	this.grantCodeId = null;	
	
	this.viewModel = kendo.observable({
		commentSubject : "",
		commentDescription : "",
		commentPublicInd : "",
		commentEntityKey : "",
		commentStatusId : "",
		commentProductGrantId : "",
		commentId : "",
		categoryId : "-1",
		entityCommentId : "-1",
		entityTypeId : "-1",		
		checkedStrandsAndCodesObj : "",
		categories : [{name:"test", value:"-2"}]
	});
	
	this.commentsEditor = null;
		
	this.initializeElements = function(){
		var that = this;		
		
		this.initAddCommentsAndAttachmentsWindow();
		this.initializeSubmitWindow();
		
		// Clearance Memo Editor Setup
		if (!$("#addCommentsAndAttachmentsDescription").data("kendoEditor")) {
			commentsEditor = $("#addCommentsAndAttachmentsDescription").kendoEditor({			
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
		
		$("#delete-attachment-confirm").click(function(event) {	
			// Add indicator to screen for user
			event.preventDefault();			
			$("#delete-attachment-confirm").removeClass("forceShow");
			deleteAttachmentFromDB();
		});
			
		$("#saveCommentsAndAttachments").unbind();			
		$("#saveCommentsAndAttachments").click(function(event){
			event.preventDefault();
			event.stopPropagation();				
			if (commentsAndAttachmentsObject.getSaveCommentObject().longDescription.trim() == "" && commentsAndAttachmentsObject.getSaveCommentObject().shortDescription.trim() == "") {				
				showErrorPopupWindow("You must enter a comment title or comment text.");	
			} else {
				console.log("saveCommentsAndAttachments clicked");
				if(that.callbackFunction && $.isFunction(that.callbackFunction)){
					console.log("that.viewModel.categoryId " + that.viewModel.categoryId);
					if(that.viewModel.categoryId > 0){
						that.callbackFunction(that.getSaveCommentObject(), that.viewModel.categoryId, that.foxVersionId, that.viewModel.commentEntityKey);
					}
					else {
						that.callbackFunction(that.getSaveCommentObject(), -1, that.foxVersionId, that.viewModel.commentEntityKey);
					}
				}
			}
		});
						
		var FirstLoad = false;
		$("#upload-attachment-button").unbind();
		$("#upload-attachment-button").click(function(event){			
			event.preventDefault();
			event.stopPropagation();						
			if (!FirstLoad) {
				FirstLoad = true;
				$("#upload-commentAttachment").unbind();
				console.log("Kendo Upload initializing");
				$("#upload-commentAttachment").kendoUpload({
			 		async: {
			 			saveUrl:that.path.getCommentsAttachFileRESTPath(),
			 			autoUpload:true
			 		},
			 		localization: {
			            statusFailed: "customStatusFailed"
			        },
			        multiple: false,
			 		select: onUploadSelect,
			 		upload: onUpload,
			 		success: onUploadSuccess,
			 		complete: onUploadComplete,
			 		error: onUploadError,
			 		cancel: onCancel
				});	 
			}			
			$("#upload-commentAttachment").click();	  						
		});
		
		function onUploadSelect(e) {
		  $("#commentsAndAttachmentForm .k-widget").addClass("forceShow");
		  console.log("onUploadSelect");
		  $("#saveCommentsAndAttachments").hide();		  
		}
		
		function onCancel(e) {
		  if (selectedCommentId == 0)			  
			$("#saveCommentsAndAttachments").show();			
		} 
		function onUpload(e) {
		  var sc = angular.element(document.getElementById("rightsController")).scope();
		  var jsonData = JSON.stringify(commentsAndAttachmentsObject.getSaveCommentObject());		  
		  var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();
		  var productInfoCodes = ermSidePanelScope.checkedStrandsAndCodesObj != null ? JSON.stringify(ermSidePanelScope.checkedStrandsAndCodesObj.productInfoCodeIds) : "";
		  var rightStrandIds = ermSidePanelScope.checkedStrandsAndCodesObj != null ? JSON.stringify(ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandIds) : "";
		  var rightStrandRestrictionIds = ermSidePanelScope.checkedStrandsAndCodesObj != null ? JSON.stringify(ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandRestrictionIds)  : ""; 
	 	  var isInStrandsPopup = commentsAndAttachmentsObject.viewModel.isStrandsPopup;
	 	  if (isInStrandsPopup) {
	 		productInfoCodes ="[]";
	 		rightStrandRestrictionIds = "[]";
	 		rightStrandIds = "[]";
	 	  }
	 	  
		  e.data = { 
		    'commentId': selectedCommentId,
		    'foxVersionId' : sc.foxVersionId,
		    'entityTypeId' : that.viewModel.entityTypeId, 		    
		    'entityKey' : that.viewModel.commentEntityKey,		    
		    'categoryId' : that.viewModel.categoryId,
		    'grantCodeId' : that.viewModel.commentEntityKey,
		    'entityCommentId' : that.viewModel.entityCommentId,
		    'fileName' : $("#upload-fileName").val(),
		    'productInfoCodeIds': productInfoCodes, 
			'rightStrandIds': rightStrandIds,
			'rightStrandRestrictionIds': rightStrandRestrictionIds, 
		    'q' : jsonData
		  };
		  console.log("Uploading e.data  : %o", e.data);
		}
		function onUploadSuccess(e) {
		  console.log("Upload Success e: %o", e);
		  var response = e.response;
		  console.log("Upload Success response: %o", response);
		  $("#commentsAndAttachmentsCommentId").value = response;
		  $("#commentsAndAttachmentsCommentId").data = response;
		  $("#commentsAndAttachmentsCommentId").val(response);	
			
	 	  $("#commentsAndAttachmentForm .k-widget").removeClass("forceShow");
	 	  console.log("onUploadSuccess");	 	  
	 	  console.log("commentsAndAttachmentsObject.viewModel.entityTypeId: " + commentsAndAttachmentsObject.viewModel.entityTypeId);
	 	  commentsAndAttachmentsObject.viewModel.commentId = response;
	 	  selectedCommentId = response;
	 	  var sc = null;
	 	  var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();
	 	  if (commentsAndAttachmentsObject.viewModel.entityTypeId == erm.dbvalues.entityType.PRODUCT_GRANT || 
	 			  commentsAndAttachmentsObject.viewModel.entityTypeId == erm.dbvalues.entityType.PRODUCT_PROMO_MTRL) {
	 		sc = angular.element(document.getElementById("rightsController")).scope();
	 		console.log("categoryId: " + commentsAndAttachmentsObject.viewModel.categoryId + " erm.dbvalues.entityCommentType.SUBRIGHTS: " + erm.dbvalues.entityCommentType.SUBRIGHTS);	 	  	 				 	
		 	sc.loadSubrightComments();			  		 	
  		    sc.loadSalesAndMarketingComments(sc.salesAndMarketingSubtab.grantCategory);	 	    
			if (sc.$root.$$phase != '$apply' && sc.$root.$$phase != '$digest')
			  sc.$apply();						
	 	  } else if (commentsAndAttachmentsObject.viewModel.entityTypeId == erm.dbvalues.entityType.CONTRACT_INFO) {
	 		var cpscope = angular.element(document.getElementById("contractualPartyController")).scope();
	 		cpscope.loadContractualParties();  
	 	  } else if (commentsAndAttachmentsObject.viewModel.entityTypeId == erm.dbvalues.entityType.PRODUCT_VERSION && commentsAndAttachmentsObject.viewModel.categoryId == erm.dbvalues.entityCommentType.CLEARANCE_MEMO_COMMENT) {
	 		console.log("loadClearanceMemoComments");
	 		clearanceMemoObject.loadClearanceMemoComments();
	 	  } else if (commentsAndAttachmentsObject.viewModel.entityTypeId == erm.dbvalues.entityType.PRODUCT_VERSION && commentsAndAttachmentsObject.viewModel.categoryId == erm.dbvalues.entityCommentType.PRODUCT_INFO) {
		 	console.log("loadProductComments");
		 	ermSidePanelScope.loadProductComments();
	 	  } else if (commentsAndAttachmentsObject.viewModel.entityTypeId == erm.dbvalues.entityType.PRODUCT_VERSION && commentsAndAttachmentsObject.viewModel.categoryId == erm.dbvalues.entityCommentType.CLEARANCE_MEMO) {
	 		that.closeTemplateAddCommentsAndAttachmentWindow();
			clearanceMemoKendoElementInit.getClearanceMemoFromDB();					 	
		  } else if (commentsAndAttachmentsObject.viewModel.entityTypeId == erm.dbvalues.entityType.STRAND) {
			var commentId = selectedCommentId;  
			productRestrictionsGridConfigurator.commentsInfoCodes(ermSidePanelScope.checkedStrandsAndCodesObj.productInfoCodeIds, true);
			gridStrandsConfigurator.commentsRightStrandRestriction(ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandIds, true, true);
			gridStrandsConfigurator.commentsRightStrandRestriction(ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandRestrictionIds, false, true);
			ermSidePanelScope.loadCommentsForRightStrandsAndCodes(false);
			ermSidePanelScope.loadStrandCommentCounts();
			if (commentId) {
				ermSidePanelScope.loadCommentById(commentId);				
			}
		  }
	 	  
	 	  $("#updateCommentsAndAttachments").show();
		  //if (selectedCommentId == 0) {			  
			//setTimeout(function() {
		      //that.resetFields();
		      //that.closeTemplateAddCommentsAndAttachmentWindow();
			//}, 500);
		  //} else {
			  setTimeout(function() {
				var comments = null;
				console.log("commentsAndAttachmentsObject.viewModel.entityTypeId: " + commentsAndAttachmentsObject.viewModel.entityTypeId);
				if (commentsAndAttachmentsObject.viewModel.entityTypeId == erm.dbvalues.entityType.PRODUCT_GRANT  || 
			 			  commentsAndAttachmentsObject.viewModel.entityTypeId == erm.dbvalues.entityType.PRODUCT_PROMO_MTRL) {
				  var cps = null;
				  console.log("commentsAndAttachmentsObject.viewModel %o ", commentsAndAttachmentsObject.viewModel);
				  if (commentsAndAttachmentsObject.viewModel.categoryId == erm.dbvalues.entityCommentType.SALES_AND_MARKETING_GNRL ||
							commentsAndAttachmentsObject.viewModel.categoryId == erm.dbvalues.entityCommentType.SALES_AND_MARKETING_SPECIAL) {
					cps = sc.salesAndMarketingSubtab;
					console.log("cps %o", cps);
					comments = cps.sortedComments;  
				  } else {				  					
					if (commentsAndAttachmentsObject.viewModel.entityTypeId == erm.dbvalues.entityType.PRODUCT_GRANT) {
					  cps = sc.productSubrightsCurrent;					  
					  comments = cps.comments;
					} else {
					  cps = sc.salesAndMarketingSubtab;
					  comments = cps.sortedComments;  
					}					
					console.log("cps %o", cps);
				  }
				} else if (commentsAndAttachmentsObject.viewModel.entityTypeId == erm.dbvalues.entityType.CONTRACT_INFO) {
				  sc = angular.element(document.getElementById("contractualPartyController")).scope();
				  console.log("sc.savedContractualParties: %o", sc.savedContractualParties);
				  for (var i = 0; i < sc.savedContractualParties.length; i++) {
					if (sc.savedContractualParties[i].comment != null && sc.savedContractualParties[i].comment.commentId == selectedCommentId) {
					  comments = new Array();
					  comments.push(sc.savedContractualParties[i].comment);
					  break;
					}
			      }
				} else if (commentsAndAttachmentsObject.viewModel.entityTypeId == erm.dbvalues.entityType.PRODUCT_VERSION && commentsAndAttachmentsObject.viewModel.categoryId == erm.dbvalues.entityCommentType.CLEARANCE_MEMO_COMMENT) {
				  comments = ermSidePanelScope.clearanceMemoComments;
				} else if (commentsAndAttachmentsObject.viewModel.entityTypeId == erm.dbvalues.entityType.PRODUCT_VERSION && commentsAndAttachmentsObject.viewModel.categoryId == erm.dbvalues.entityCommentType.PRODUCT_INFO) {
				  comments = ermSidePanelScope.productComments;
				} else if (commentsAndAttachmentsObject.viewModel.entityTypeId == erm.dbvalues.entityType.STRAND) {
				  comments = new Array();
				  comments =  $.merge(ermSidePanelScope.productInfoCodeComments, comments);
				  comments =  $.merge(ermSidePanelScope.rightStrandStrandComments, comments);
				  comments =  $.merge(ermSidePanelScope.rightStrandInfoCodeComments, comments);
				  comments =  $.merge(ermSidePanelScope.popupComments, comments);				  
				}
				console.log(" COMMENTS : %o", comments);
				if (commentsAndAttachmentsObject.viewModel.entityTypeId == erm.dbvalues.entityType.PRODUCT_PROMO_MTRL ||
						commentsAndAttachmentsObject.viewModel.categoryId == erm.dbvalues.entityCommentType.SALES_AND_MARKETING_GNRL ||
						commentsAndAttachmentsObject.viewModel.categoryId == erm.dbvalues.entityCommentType.SALES_AND_MARKETING_SPECIAL) {
				  var commentArray = comments;
				  for(var i = 0; i < commentArray.length; i++) {					  
					comments = commentArray[i].comments;
					for(var k = 0 ; k < comments.length; k++){
					  var currentComment =  comments[k];						
					  if(selectedCommentId == currentComment.comment.id) {						
						var numberOfAttachments = (currentComment.attachments && currentComment.attachments.length)  ? currentComment.attachments.length : 0;
						commentsAndAttachmentsObject.displayAttachmentsForComment(numberOfAttachments, currentComment);	
					  }
					}						
				  }
			  	} else {						  				
					for(var i = 0; i < comments.length; i++) {
					  if(selectedCommentId == comments[i].comment.id){			  
						var numberOfAttachments = comments[i].attachments.length > 0 ? comments[i].attachments.length : 0;					
						commentsAndAttachmentsObject.displayAttachmentsForComment(numberOfAttachments, comments[i]);
					  }
					}
			  	}				
			  }, 1000);	
		  
		}
		function onUploadComplete() {        
		  setTimeout(function() {
        	$(".k-widget.k-upload").find("ul").remove();
        	$("#upload-commentAttachment").value = null;
		  }, erm.statusIndicatorTime);
		}
        
		function onUploadError(e) {		
		  // Array with information about the uploaded files    
	      console.log("e: %o", e.XMLHttpRequest.responseText);
	      $(".k-upload-status").append("<span class=\"uploadError\">"+ e.XMLHttpRequest.responseText + "</span>");
	      $("#saveCommentsAndAttachments").show();
		}		
		
		$("#updateCommentsAndAttachments").unbind();
		$("#updateCommentsAndAttachments").click(function updateCommentsAndAttachmentsClick(event) {				
			event.preventDefault();
			event.stopPropagation();
			console.log("commentsAndAttachmentsObject.getSaveCommentObject() %o", commentsAndAttachmentsObject.getSaveCommentObject());
			if ((!commentsAndAttachmentsObject.getSaveCommentObject().longDescription && !commentsAndAttachmentsObject.getSaveCommentObject().shortDescription) || ((!commentsAndAttachmentsObject.getSaveCommentObject().longDescription||commentsAndAttachmentsObject.getSaveCommentObject().longDescription.trim() == "") && (!commentsAndAttachmentsObject.getSaveCommentObject().shortDescription ||commentsAndAttachmentsObject.getSaveCommentObject().shortDescription.trim() == ""))) {				
			  showErrorPopupWindow("You must enter a comment title or comment text.");	
			} else {
			  if(that.callbackFunction && $.isFunction(that.callbackFunction)){
				//order of parameters comment, categoryId, foxVersionId, grantCodeId
				that.callbackFunction(that.getSaveCommentObject(),null,that.foxVersionId,null);
			  }
			}
		});
		
		$("#cancelCommentsAndAttachments").click(function(){
			that.resetFields();
			that.closeTemplateAddCommentsAndAttachmentWindow();
		});
		
		kendo.bind($("#commentsAndAttachmentForm"), this.viewModel);
		
	};
	
	this.resetFields = function(){
		this.comment = new subrightComments();
		this.callbackFunction = null;
		this.uploadedFiles = new Array();
		this.viewModel.set("commentSubject","");
		this.viewModel.set("commentDescription","");
		this.viewModel.set("commentPublicInd",true);
		this.viewModel.set("commentEntityKey","");
		this.viewModel.set("commentStatusId","");
		this.viewModel.set("commentProductGrantId","");
		this.viewModel.set("commentId","");
		this.viewModel.set("categoryId", "-1");
		this.viewModel.set("checkedStrandsAndCodesObj", "");
		this.viewModel.set("entityCommentId", "-1");
		$(".k-widget.k-upload").find("ul").remove();
    	$("#upload-commentAttachment").value = null;    	    
    	$("#commentsAndAttachmentNumberOfAttachments").html("0");
    	$("#savedAttachments").html("");
    	selectedAttachmentId = null;
    	selectedCommentId = 0;
	};
	
	this.populateCommentsField = function(){
		this.comment.shortDescription = $("#addCommentsAndAttachmentsSubjectInput").val();
		this.comment.longDescription = $("#addCommentsAndAttachmentsDescription").val();
		this.comment.publicInd = $("#addCommentsAndAttachmentsPublicInd").val();
	};
	
	
	
	this.initAddCommentsAndAttachmentsWindow = function (){
		 var that = this;
		if (!$("#template_addCommentsAndAttachments").data("kendoWindow")) {
			$("#template_addCommentsAndAttachments").kendoWindow({
                width: "750px",
                height : "550px",
                minWidth : "750px",
                minHeight : "550px",
                title: "Add/Update Comments & Attachments",
                actions: [
                    "Maximize",
                    "Close"
                ],
                visible : false,
                close : function(){
                	that.resetFields();
                }
            });
        }
		templateAddCommentsAndAttachmentWindow = $("#template_addCommentsAndAttachments").data("kendoWindow");
	};
	
	this.closeTemplateAddCommentsAndAttachmentWindow = function(){
		if(templateAddCommentsAndAttachmentWindow){
			templateAddCommentsAndAttachmentWindow.close();
		}
	};
	
	this.displayCMAttachments = function(numberOfAttachments, attachments, commentid) {
		$("#commentsAndAttachmentNumberOfAttachments").html(numberOfAttachments);
		var stringBuilder = [];		
		if (attachments != null) {
		  for (var attNumber = 0; attNumber < attachments.length; attNumber++) {
			console.log("attachment " + attNumber + " is %o", attachments[attNumber]);
			stringBuilder.push("<div class=\"savedAttachment\"><a href=\"/erm/rest/Comments/getAttachment/" + attachments[attNumber].documentId + "/" + attachments[attNumber].attachmentName + "\" target=\"_blank\">");
			stringBuilder.push(attachments[attNumber].attachmentName);
			stringBuilder.push("</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
			stringBuilder.push("<span class=\"icon-remove removeSavedAttachment\" onClick=\"removeAttachment('" + attachments[attNumber].attachmentName + "', " + attachments[attNumber].documentId + "," + commentid + ")\">");
			stringBuilder.push("  remove</span>");
			stringBuilder.push("</div>");
		  }
		}
		$("#savedAttachments").html(stringBuilder.join(""));
	};
	
	this.displayAttachmentsForComment = function(numberOfAttachments, comment) {
		$("#commentsAndAttachmentNumberOfAttachments").html(numberOfAttachments);
		var stringBuilder = [];
		if (comment.attachments != null) {
			for (var attNumber = 0; attNumber < comment.attachments.length; attNumber++) {
				console.log("attachment " + attNumber + " is %o", comment.attachments[attNumber]);
				stringBuilder.push("<div class=\"savedAttachment\"><a href=\"/erm/rest/Comments/getAttachment/" + comment.attachments[attNumber].documentId + "/" + comment.attachments[attNumber].attachmentName + "\" target=\"_blank\">");
				stringBuilder.push(comment.attachments[attNumber].attachmentName);
				stringBuilder.push("</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
				stringBuilder.push("<span class=\"icon-remove removeSavedAttachment\" onClick=\"removeAttachment('" + comment.attachments[attNumber].attachmentName + "', " + comment.attachments[attNumber].documentId + "," + comment.comment.id + ")\">");
				stringBuilder.push("  remove</span>");
				stringBuilder.push("</div>");
			}
		}
		$("#savedAttachments").html(stringBuilder.join(""));
	};
	this.openCommentsAndAttachementsPopupWindow = function openCommentsAndAttachementsPopupWindow(callBackFunctionToCall, comment,isStrandsPopup) {
		$("#commentsPopSectionSubject").show();		
		$("#commentsPopSectionText").show();
		$("#commentsPopSectionDescription").show();
		this.resetFields();
		this.callbackFunction = callBackFunctionToCall;				
		var d = new Date();
		var u = erm.security.user.userId+" "+d.toLocaleString();
		$("#commentsAndAttachmentsUserId").html(u);
		console.log("openAddCommentsAndAttachmentsPopupWindow comment" , comment);
		currentEntityTypeId = erm.dbvalues.entityType.STRAND;
		this.viewModel.set("entityTypeId",erm.dbvalues.entityType.STRAND);
		this.viewModel.set("commentEntityKey",erm.dbvalues.entityType.STRAND);
		//this attribute lets the rest of the app know that we're adding a comment insiede the strands popoup
		this.viewModel.set("isStrandsPopup",isStrandsPopup);
		
		if(comment) {
			$("#updateCommentsAndAttachments").show();
			$("#saveCommentsAndAttachments").hide();
			this.viewModel.set("commentId",comment.comment.id);
			this.viewModel.set("commentSubject",comment.comment.shortDescription);
			this.viewModel.set("commentDescription",comment.comment.longDescription);
			this.viewModel.set("commentPublicInd", (comment.comment.publicInd == 1 || comment.comment.publicInd == null) ? true : false);									
			var numberOfAttachments =  comment.attachments && comment.attachments.length > 0 ? comment.attachments.length : 0;					
			this.displayAttachmentsForComment(numberOfAttachments, comment);			
		} else {
		  $("#updateCommentsAndAttachments").hide();
		  $("#saveCommentsAndAttachments").show();			
		}
		$("#showCategorySelectBox").hide();		
		var d = $("#template_addCommentsAndAttachments").data("kendoWindow");
		d.setOptions({
			visible : true,
			modal : true
		});
		d.center();
		d.open();		
	};
	
	this.openAddStrandCommentsAndAttachmentsPopupWindow = function(callBackFunctionToCall, commentId){
		$("#commentsPopSectionSubject").show();		
		$("#commentsPopSectionText").show();
		$("#commentsPopSectionDescription").show();
		var rcscope = angular.element(document.getElementById("rightsController")).scope();
		//AMV hide button when in strand comments
		//11/14/2014		
//		if (commentId && rcscope.currentProductArray.hasClearanceMemo && rcscope.security.canModifyClearanceMemos)
//		  $("#commentsPopCopyToClearance").show();	
//		else
//		  $("#commentsPopCopyToClearance").hide();		
		$("#commentsPopCopyToClearance").hide();		
		
		this.resetFields();
		this.callbackFunction = callBackFunctionToCall;				
		var d = new Date();
		var u = erm.security.user.userId+" "+d.toLocaleString();
		$("#commentsAndAttachmentsUserId").html(u);
		console.log("openAddCommentsAndAttachmentsPopupWindow commentId:" + commentId);
		var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();
		currentEntityTypeId = erm.dbvalues.entityType.STRAND;
		this.viewModel.set("entityTypeId",erm.dbvalues.entityType.STRAND);
		this.viewModel.set("commentEntityKey",erm.dbvalues.entityType.STRAND);
		this.viewModel.set("isStrandsPopup",false);
		if(commentId) {
			selectedCommentId = commentId;
			$("#updateCommentsAndAttachments").show();
			$("#saveCommentsAndAttachments").hide();
			this.viewModel.set("commentId",commentId);
			var comments = null;									
			comments = ermSidePanelScope.rightStrandComments;			
			console.log("comments: %o", comments);
			for(var i = 0; i < comments.length; i++){
				if(commentId == comments[i].comment.id){
					console.log("comments[i].comment: %o", comments[i].comment);
					this.viewModel.set("commentSubject",comments[i].comment.shortDescription);
					this.viewModel.set("commentDescription",comments[i].comment.longDescription);
					this.viewModel.set("commentPublicInd", (comments[i].comment.publicInd == 1 || comments[i].comment.publicInd == null) ? true : false);									
					var numberOfAttachments = comments[i].attachments != null && comments[i].attachments.length > 0 ? comments[i].attachments.length : 0;					
					this.displayAttachmentsForComment(numberOfAttachments, comments[i]);
				}
			}
		} else {
		  $("#updateCommentsAndAttachments").hide();
		  $("#saveCommentsAndAttachments").show();			
		}
		$("#showCategorySelectBox").hide();		
		var d = $("#template_addCommentsAndAttachments").data("kendoWindow");
		d.setOptions({
			visible : true,
			modal : true
		});
		d.center();
		d.open();
	};
	
	this.openCMAttachmentsPopupWindow = function(callBackFunctionToCall, commentId, attachments) {		
		$("#commentsPopSectionSubject").hide();		
		$("#commentsPopSectionText").hide();
		$("#commentsPopSectionDescription").hide();
		$("#updateCommentsAndAttachments").hide();
		$("#saveCommentsAndAttachments").hide();
		$("#commentsPopCopyToClearance").hide();
		this.resetFields();
		this.callbackFunction = callBackFunctionToCall;				
		var d = new Date();
		var u = erm.security.user.userId+" "+d.toLocaleString();
		$("#commentsAndAttachmentsUserId").html(u);
		console.log("openCMAttachmentsPopupWindow commentId:" + commentId);		
		this.viewModel.set("entityTypeId", erm.dbvalues.entityType.PRODUCT_VERSION);
		this.viewModel.set("commentEntityKey", erm.dbvalues.entityType.PRODUCT_VERSION);
		this.viewModel.set("categoryId", erm.dbvalues.entityCommentType.CLEARANCE_MEMO);
		if(commentId) {
			selectedCommentId = commentId;
			this.viewModel.set("commentId",commentId);												
			var numberOfAttachments = attachments != null && attachments.length > 0 ? attachments.length : 0;					
			this.displayCMAttachments(numberOfAttachments, attachments, commentId);						
		}
		$("#showCategorySelectBox").hide();		
		var d = $("#template_addCommentsAndAttachments").data("kendoWindow");
		d.setOptions({
			visible : true,
			modal : true
		});
		d.center();
		d.open();
	};
	
	this.openAddCommentsAndAttachmentsPopupWindow = function openAddCommentsAndAttachmentsPopupWindow(callBackFunctionToCall, commentId, showCategory, categoryId, entityTypeId,entityCommentId){
		$("#commentsPopSectionSubject").show();		
		$("#commentsPopSectionText").show();
		$("#commentsPopSectionDescription").show();
		var rcscope = angular.element(document.getElementById("rightsController")).scope();
		if (commentId && rcscope.currentProductArray.hasClearanceMemo && rcscope.security.canModifyClearanceMemos)
		  $("#commentsPopCopyToClearance").show();	
		else
		  $("#commentsPopCopyToClearance").hide();
				
		currentEntityTypeId = entityTypeId;
		this.resetFields();
		this.callbackFunction = callBackFunctionToCall;
		if (entityCommentId) {
			this.viewModel.set("entityCommentId",entityCommentId);			
		}
		
		if (entityTypeId) {
		  this.viewModel.set("entityTypeId",entityTypeId);
		}
		if (categoryId) {
		  this.viewModel.set("categoryId", categoryId);
		}
		var sc = null;		
		var cps = null;
		if (entityTypeId == erm.dbvalues.entityType.PRODUCT_GRANT) {
			sc = angular.element(document.getElementById("rightsController")).scope();
			cps = sc.productSubrightsCurrent;
			console.log(" CURRENT Entity Key ID : %o ", cps.productGrantId);
			console.log(" CURRENT GRANT CODE ID : %o ", cps.grantCodeId);
			if(cps.entityKey){
			    this.viewModel.set("commentEntityKey", cps.grantCodeId);
			}
			if(cps.grantCodeId){
			    this.viewModel.set("commentEntityKey", cps.grantCodeId);
			}
			if(cps.grantStatus){
				this.viewModel.set("commentStatusId",cps.grantStatus.grantStatusId);
			}		
			if(cps.productGrantId){
				this.viewModel.set("commentProductGrantId",cps.productGrantId);
			}
		} else if (entityTypeId == erm.dbvalues.entityType.CONTRACT_INFO) {
		  sc = angular.element(document.getElementById("contractualPartyController")).scope();				
		  commentsAndAttachmentsObject.entityKey = sc.selectedContractInfoId;
		  this.viewModel.set("commentEntityKey", sc.selectedContractInfoId);
		  console.log("commentsAndAttachmentsObject.entityKey: " + sc.selectedContractInfoId);
		} else if (entityTypeId == erm.dbvalues.entityType.PRODUCT_VERSION && categoryId == erm.dbvalues.entityCommentType.CLEARANCE_MEMO_COMMENT) {
		  sc = angular.element(document.getElementById("rightsController")).scope();
		  commentsAndAttachmentsObject.entityKey = sc.foxVersionId;
		  this.viewModel.set("commentEntityKey", sc.foxVersionId);
		} else if (entityTypeId == erm.dbvalues.entityType.PRODUCT_VERSION && categoryId == erm.dbvalues.entityCommentType.PRODUCT_INFO) {
		  sc = angular.element(document.getElementById("rightsController")).scope();
		  commentsAndAttachmentsObject.entityKey = sc.foxVersionId;
		  this.viewModel.set("commentEntityKey", sc.foxVersionId);
		  this.viewModel.set("commentPublicInd", false);
	    }
		var d = new Date();
		var u = erm.security.user.userId+" "+d.toLocaleString();
		$("#commentsAndAttachmentsUserId").html(u);
		console.log("openAddCommentsAndAttachmentsPopupWindow commentId:" + commentId);
		if(commentId){
			selectedCommentId = commentId;
			$("#updateCommentsAndAttachments").show();
			$("#saveCommentsAndAttachments").hide();
			this.viewModel.set("commentId",commentId);
			var comments = null;
			console.log("entityTypeId: %o", entityTypeId, " categoryId %o", categoryId);
			if (entityTypeId == erm.dbvalues.entityType.PRODUCT_GRANT) {
				comments = cps.comments;
			} else if (entityTypeId == erm.dbvalues.entityType.CONTRACT_INFO) {				
				for (var i = 0; i < sc.savedContractualParties.length; i++) {
				  if (sc.savedContractualParties[i].comment != null && sc.savedContractualParties[i].comment.commentId == commentId) {
					comments = new Array();
					comments.push(sc.savedContractualParties[i].comment);
					break;
				  }
				}
			} else if (entityTypeId == erm.dbvalues.entityType.PRODUCT_VERSION && categoryId == erm.dbvalues.entityCommentType.CLEARANCE_MEMO_COMMENT) {
			  var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();
			  comments = ermSidePanelScope.clearanceMemoComments;
			} else if (entityTypeId == erm.dbvalues.entityType.PRODUCT_VERSION && categoryId == erm.dbvalues.entityCommentType.PRODUCT_INFO) {
			  var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();
			  comments = ermSidePanelScope.productComments;
			}
			console.log("comments: %o", comments);
			for(var i = 0; i < comments.length; i++){
				if(commentId == comments[i].comment.id){
					console.log("comments[i].comment: %o", comments[i].comment);
					this.viewModel.set("commentSubject",comments[i].comment.shortDescription);
					this.viewModel.set("commentDescription",comments[i].comment.longDescription);
					this.viewModel.set("commentPublicInd", comments[i].comment.publicInd == 1 ? true : false);
					var numberOfAttachments = comments[i].attachments != null && comments[i].attachments.length > 0 ? comments[i].attachments.length : 0;					
					this.displayAttachmentsForComment(numberOfAttachments, comments[i]);
				}
			} 
		}
		else {
			this.viewModel.set("commentPublicInd", false);
			$("#updateCommentsAndAttachments").hide();
			$("#saveCommentsAndAttachments").show();			
		}
		
		$("#showCategorySelectBox").hide();
		
		var d = $("#template_addCommentsAndAttachments").data("kendoWindow");
		d.setOptions({
			visible : true,
			modal : true
		});
		d.center();
		d.open();
	};
	
	
	this.openAddSMCommentsAndAttachmentsPopupWindow = function openAddSMCommentsAndAttachmentsPopupWindow(callBackFunctionToCall, commentId, showCategory, code, entityTypeId,entityCommentId){
		$("#commentsPopSectionSubject").show();		
		$("#commentsPopSectionText").show();
		$("#commentsPopSectionDescription").show();		
		var rcscope = angular.element(document.getElementById("rightsController")).scope();
		if (commentId && rcscope.currentProductArray.hasClearanceMemo && rcscope.security.canModifyClearanceMemos)
		  $("#commentsPopCopyToClearance").show();	
		else
		  $("#commentsPopCopyToClearance").hide();
		
		currentEntityTypeId = entityTypeId;
		console.log("entityTypeId : %o", entityTypeId);		
		this.resetFields();
		this.callbackFunction = callBackFunctionToCall;
		if (entityTypeId) {
		  this.viewModel.set("entityTypeId",entityTypeId);
		}
		if (entityCommentId) {
		  this.viewModel.set("entityCommentId",entityCommentId);
		} else {
		  this.viewModel.set("entityCommentId",null);
		}
		
		
		var sc = angular.element(document.getElementById("rightsController")).scope();
		var cps = sc.salesAndMarketingSubtab;		
		console.log(" CURRENT GRANT CODE ID : %o", cps.grantCode.id);
		if(cps.grantCode.id){
			this.viewModel.set("commentEntityKey", cps.grantCode.id);
		}
		
		this.viewModel.set("commentStatusId",cps.grantCategorySelected.id);
				
		if(cps.productGrant){
			this.viewModel.set("commentProductGrantId",cps.productGrant.id);
		}
		var d = new Date();
		var u = erm.security.user.userId+" "+d.toLocaleString();
		$("#commentsAndAttachmentsUserId").html(u);
		
		if(commentId){
			selectedCommentId = commentId;
			$("#updateCommentsAndAttachments").show();
			$("#saveCommentsAndAttachments").hide();
			this.viewModel.set("commentId",commentId);
			var commentArray = cps.currentComments;
			console.log(" EDITED COMMENTS ARRAY : %o, %o", commentArray, code);
			var commentFromArray = null;
			for(var i = 0; i < commentArray.length; i++){
				commentFromArray = commentArray[i];				
				if(code == commentFromArray.id){

					var comments = commentFromArray.comments;

					console.log(" EDITED COMMENTS : %o", comments);
					for(var k = 0 ; k < comments.length; k++){						
						if(commentId == comments[k].comment.id){
							var currentComment =  comments[k];
							this.viewModel.set("commentSubject",currentComment.comment.shortDescription);
							this.viewModel.set("commentDescription",currentComment.comment.longDescription);
							this.viewModel.set("commentPublicInd", currentComment.comment.publicInd == 1 ? true : false);
//							if (comments[k].comment.categoryId) {
//								commentCategoryId = parseInt(comments[k].comment.categoryId);
//							}
//							this.viewModel.set("categoryId",commentCategoryId);
							var numberOfAttachments = (currentComment.attachments &&  currentComment.attachments.length) ? currentComment.attachments.length : 0;
							this.displayAttachmentsForComment(numberOfAttachments, comments[k]);	
						}
					}
				}
				
			}
		}
		else {
			$("#updateCommentsAndAttachments").hide();
			$("#saveCommentsAndAttachments").show();
			$("#commentsAndAttachmentNumberOfAttachments").html("");			
			$("#savedAttachments").html("");
		}
		
		if(showCategory){
			var co = sc.salesAndMarketingSubtab;
			console.log(" SM GRANT CATEGORY : %o", co.grantCategory);
			var cat = new Array();
			if(co.grantCategory && co.grantCategory.length){
				for(var i = 0; i < co.grantCategory.length; i++){
					cat.push(co.grantCategory[i]);
				}
			}
			if(cat[0].description == "All"){
				cat.splice(0, 1);
			}
			
			var options = new Array();
			for(var i = 0; i < cat.length; i++){	
				if(i == 0){
					this.viewModel.set("categoryId", cat[i].id);
				}
				var a = {"name":cat[i].description, "value":cat[i].id};
				options.push(a);				
			}
			//console.log(" OPTIONS (1) : %o", options);
			this.viewModel.set("categories", options);
			if (!code) {
				code = options[0].value;
			}
			
			this.viewModel.set("categoryId",code);

			$("#showCategorySelectBox").show();
		}
		else {
			$("#showCategorySelectBox").hide();
		}
		var d = $("#template_addCommentsAndAttachments").data("kendoWindow");
		d.setOptions({
			visible : true,
			modal : true
		});
		d.center();
		d.open();
	};
	
	this.getSaveCommentObject = function getSaveCommentObject(){
		var sc = angular.element(document.getElementById("rightsController")).scope();
		var c = new Object(); //new subrightComments();
		c.shortDescription = this.viewModel.commentSubject;
		c.longDescription = this.viewModel.commentDescription;
		c.publicInd = this.viewModel.commentPublicInd ? 1 : 0;
		//c.userId = erm.security.user.userId;
		c.commentTypeId = this.COMMENT_TYPE_ID;
		c.legalInd = erm.security.isBusiness() ? 0 : 1;
		c.businessInd = erm.security.isBusiness() ? 1 : 0;
		c.categoryId = this.viewModel.categoryId;
		c.entityCommentId = this.viewModel.entityCommentId;
		c.id = $("#commentsAndAttachmentsCommentId").val();		
		
		var so = c;
		this.foxVersionId = sc.foxVersionId;
		this.entityKey = $("#commentsAndAttachmentsEntityKeyId").val();
		return so;
	};
	
	this.showSubmitPopupWindow = function(){
		var d = $("#subrights_submitPopupWindow").data("kendoWindow");
		d.setOptions({
			visible : true,
			modal : true
		});
		d.center();
		d.open();		
	};
	
	this.initializeSubmitWindow = function(){
		if (!$("#subrights_submitPopupWindow").data("kendoWindow")) {
			$("#subrights_submitPopupWindow").kendoWindow({
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
		subrights_submitPopupWindow = $("#subrights_submitPopupWindow").data("kendoWindow");
	};

}

function removeAttachment(attachmentName, attachmentId, commentId) {
  clearDelConfirmButtons();
  selectedAttachmentId = attachmentId;
  selectedCommentId = commentId;
  $("#deleteConfirmDetails").html(attachmentName + "?");	     
  $("#strands-set-warning-div").addClass("forceShow");
  $("#strands-set-warning-div").html("<i class=\"icon-warning-sign\"></i>  Please note:  This action can not be reversed.");		 	
  showDeleteConfirmationWindow();	     	    
  $("#delete-attachment-confirm").addClass("forceShow");
};

function copyCommentToClearanceMemo() {
	var rcscope = angular.element(document.getElementById("rightsController")).scope();
	console.log("selectedCommentId: " + selectedCommentId);
	console.log("foxVersionId: " + rcscope.currentProductArray.foxVersionId);
	showSubmitPopupWindow();
	var url = this.path.getCopyCommentToCMRESTPath() + rcscope.currentProductArray.foxVersionId;
	console.log("Copy Comment to Clearance URL: " + url);		
	$.post(url, {
		  'commentId':selectedCommentId,
		  'entityTypeId':commentsAndAttachmentsObject.viewModel.entityTypeId,
		  'entityCommentTypeId':commentsAndAttachmentsObject.viewModel.categoryId
	    }, function(data) {		
	  console.log("Copied Comment to Clearance Memo");
	  closeSubmitPopupWindow();	   
	  clearanceMemoKendoElementInit.initCMKendoElements(rcscope);
	  clearanceMemoKendoElementInit.getClearanceMemoFromDB();
	}).fail(function(xhr,status,message,rcscope){
	  // failed  to update saveDoNotLicense
	  closeSubmitPopupWindow();
	  console.log("failed to copy comment");		  
	  var displayMessage = "Problem copying comment " + xhr.responseText;	  
	  showErrorPopupWindow(displayMessage.toString().replace(/\"/g, ''));
	});
}

function deleteAttachmentFromDB() {
  if (selectedAttachmentId != null) {
	  closeDeleteConfirmationWindow();
	  showSubmitPopupWindow();	
	  var url = this.path.getCommentsAttachFileDeleteRESTPath() + selectedAttachmentId;	  
	  console.log("Delete Attachment URL: " + url);
	  $.post(url, function(data) {		
	    console.log("deleted attachment ");
	    closeSubmitPopupWindow();
	    selectedAttachmentId = null;
	    var sc = null;	    
	    console.log("commentsAndAttachmentsObject.viewModel %o", commentsAndAttachmentsObject.viewModel);
	    var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();
	    if (commentsAndAttachmentsObject.viewModel.entityTypeId == erm.dbvalues.entityType.PRODUCT_GRANT  || 
	 			  commentsAndAttachmentsObject.viewModel.entityTypeId == erm.dbvalues.entityType.PRODUCT_PROMO_MTRL) {
	 	  sc = angular.element(document.getElementById("rightsController")).scope();	 	  
	 	  sc.loadSalesAndMarketingComments(sc.salesAndMarketingSubtab.grantCategory);		  
		  sc.loadSubrightComments();
		  if (sc.$root.$$phase != '$apply' && sc.$root.$$phase != '$digest') {
			sc.$apply();
		  }
	 	} else if (commentsAndAttachmentsObject.viewModel.entityTypeId == erm.dbvalues.entityType.CONTRACT_INFO) {
	 	  var cpscope = angular.element(document.getElementById("contractualPartyController")).scope();
	 	  cpscope.loadContractualParties();  
	 	} else if (commentsAndAttachmentsObject.viewModel.entityTypeId == erm.dbvalues.entityType.PRODUCT_VERSION && commentsAndAttachmentsObject.viewModel.categoryId == erm.dbvalues.entityCommentType.CLEARANCE_MEMO_COMMENT) {
	 	  clearanceMemoObject.loadClearanceMemoComments();
		} else if (commentsAndAttachmentsObject.viewModel.entityTypeId == erm.dbvalues.entityType.PRODUCT_VERSION && commentsAndAttachmentsObject.viewModel.categoryId == erm.dbvalues.entityCommentType.PRODUCT_INFO) {		  
		  ermSidePanelScope.loadProductComments();
		} else if (commentsAndAttachmentsObject.viewModel.entityTypeId == erm.dbvalues.entityType.PRODUCT_VERSION && commentsAndAttachmentsObject.viewModel.categoryId == erm.dbvalues.entityCommentType.CLEARANCE_MEMO) {
		  commentsAndAttachmentsObject.closeTemplateAddCommentsAndAttachmentWindow();
		  clearanceMemoKendoElementInit.getClearanceMemoFromDB();					 	
		} else if (commentsAndAttachmentsObject.viewModel.entityTypeId == erm.dbvalues.entityType.STRAND) {		  			
		  productRestrictionsGridConfigurator.commentsInfoCodes(ermSidePanelScope.checkedStrandsAndCodesObj.productInfoCodeIds, true);
		  gridStrandsConfigurator.commentsRightStrandRestriction(ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandIds, true, true);
		  gridStrandsConfigurator.commentsRightStrandRestriction(ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandRestrictionIds, false, true);
		  ermSidePanelScope.loadCommentsForRightStrandsAndCodes(false);
		  ermSidePanelScope.loadStrandCommentCounts();
		  //TODO check
		  var commentId = commentsAndAttachmentsObject.viewModel.commentId;
		  if (commentId) {
				ermSidePanelScope.loadCommentById(commentId);				
		  }
		  
		}
		var comments = null;		
		var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();
		setTimeout(function() {		 
		  if (commentsAndAttachmentsObject.viewModel.entityTypeId == erm.dbvalues.entityType.PRODUCT_GRANT  || 
	 			  commentsAndAttachmentsObject.viewModel.entityTypeId == erm.dbvalues.entityType.PRODUCT_PROMO_MTRL) {
			var cps = null;
			console.log("commentsAndAttachmentsObject.viewModel %o ", commentsAndAttachmentsObject.viewModel);					
			if (commentsAndAttachmentsObject.viewModel.categoryId == erm.dbvalues.entityCommentType.SALES_AND_MARKETING_GNRL ||
					commentsAndAttachmentsObject.viewModel.categoryId == erm.dbvalues.entityCommentType.SALES_AND_MARKETING_SPECIAL) {
				cps = sc.salesAndMarketingSubtab;
				console.log("cps %o", cps);
				comments = cps.sortedComments;  
			} else {				  
				console.log("cps %o", cps);
				if (commentsAndAttachmentsObject.viewModel.entityTypeId == erm.dbvalues.entityType.PRODUCT_GRANT) {
				  cps = sc.productSubrightsCurrent;					  
				  comments = cps.comments;
				} else {
				  cps = sc.salesAndMarketingSubtab;
				  comments = cps.sortedComments;  
				}
			}								
		  } else if (commentsAndAttachmentsObject.viewModel.entityTypeId == erm.dbvalues.entityType.CONTRACT_INFO) {
			sc = angular.element(document.getElementById("contractualPartyController")).scope();
			console.log("sc.savedContractualParties: %o", sc.savedContractualParties);
			for (var i = 0; i < sc.savedContractualParties.length; i++) {
			  if (sc.savedContractualParties[i].comment != null && sc.savedContractualParties[i].comment.commentId == selectedCommentId) {
				comments = new Array();
				comments.push(sc.savedContractualParties[i].comment);
				break;
			  }
		    }
		  } else if (commentsAndAttachmentsObject.viewModel.entityTypeId == erm.dbvalues.entityType.PRODUCT_VERSION && commentsAndAttachmentsObject.viewModel.categoryId == erm.dbvalues.entityCommentType.CLEARANCE_MEMO_COMMENT) {			
			comments = ermSidePanelScope.clearanceMemoComments;
		  } else if (commentsAndAttachmentsObject.viewModel.entityTypeId == erm.dbvalues.entityType.PRODUCT_VERSION && commentsAndAttachmentsObject.viewModel.categoryId == erm.dbvalues.entityCommentType.PRODUCT_INFO) {			
			comments = ermSidePanelScope.productComments;
		  } else if (commentsAndAttachmentsObject.viewModel.entityTypeId == erm.dbvalues.entityType.STRAND) {
		    comments = new Array();
		    comments =  $.merge(ermSidePanelScope.productInfoCodeComments, comments);
		    comments =  $.merge(ermSidePanelScope.rightStrandStrandComments, comments);
		    comments =  $.merge(ermSidePanelScope.rightStrandInfoCodeComments, comments);
		    comments =  $.merge(ermSidePanelScope.popupComments, comments);
		    console.log("merged comments %o", comments);		    
		  }
		  if (commentsAndAttachmentsObject.viewModel.entityTypeId == erm.dbvalues.entityType.PRODUCT_PROMO_MTRL || 
				  commentsAndAttachmentsObject.viewModel.categoryId == erm.dbvalues.entityCommentType.SALES_AND_MARKETING_GNRL ||
					commentsAndAttachmentsObject.viewModel.categoryId == erm.dbvalues.entityCommentType.SALES_AND_MARKETING_SPECIAL) {
			console.log("commentsAndAttachmentsObject.viewModel.commentEntityKey: %o", commentsAndAttachmentsObject.viewModel.commentEntityKey);
			console.log("comments: %o", comments);
			var commentArray = comments;
			if (commentArray != null) {
			  for(var i = 0; i < commentArray.length; i++) {				
			    comments = commentArray[i].comments;
			    for(var k = 0 ; k < comments.length; k++){
				  if(selectedCommentId == comments[k].comment.id) {						
				    var numberOfAttachments = comments[k].attachments.length > 0 ? comments[k].attachments.length : 0;
				    console.log("numberOfAttachments: %o", numberOfAttachments);				  
				    commentsAndAttachmentsObject.displayAttachmentsForComment(numberOfAttachments, comments[k]);	
				  }
			    }
			  }			
			}
		  } else {
			  console.log("comments: %o", comments);
			  if (comments != null) {
			    for(var i = 0; i < comments.length; i++) {
				  if(selectedCommentId == comments[i].comment.id){			  
				    var numberOfAttachments = comments[i].attachments != null && comments[i].attachments.length > 0 ? comments[i].attachments.length : 0;					
				    commentsAndAttachmentsObject.displayAttachmentsForComment(numberOfAttachments, comments[i]);
				  }
			    }
			  }
		  }		 		  	
		}, 1000);	  	 	    	
	  }).fail(function(xhr,status,message,rcscope){
		// failed  to update saveDoNotLicense		   
		console.log("failed to delete attachment");		  
		// Add indicator to screen for user
	    closeSubmitPopupWindow();
	    var displayMessage = xhr.responseText;
		showErrorPopupWindow(displayMessage.toString().replace(/\"/g, ''));
	  });
  } else {
	  closeDeleteConfirmationWindow();
	  showErrorPopupWindow("Sorry, there was a problem deleting that attachment, please try again.");
  };
}

var commentsAndAttachmentsObject = new commentsAndAttachments();
var templateAddCommentsAndAttachmentWindow = null;
var subrights_submitPopupWindow = null;
var selectedAttachmentId = null;
var selectedCommentId = 0;
var currentEntityTypeId = 0;
