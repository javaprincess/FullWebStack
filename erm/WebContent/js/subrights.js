
function subrightHandler(){
	this.remakesSequels = new subrightsElement();
	this.legitimateStage = new subrightsElement();
	this.subrightkendoElementUtil = new kendoElementUtil();
	this.subrightComments = new subrightComments();
	this.subrightsPaths = paths();
	
	
	this.initializeRemakesSequels = function(foxVersionId){
		var that = this;
		$("#addCommentsAndAttachments").click(function addCommentsAndAttachmentsClick(){
			commentsAndAttachmentsObject.openAddCommentsAndAttachmentsPopupWindow(that.processSubrightsAddComments, null, false, erm.dbvalues.entityCommentType.SUBRIGHTS, erm.dbvalues.entityType.PRODUCT_GRANT);
		});
		$("#addSalesMarketingCommentsAndAttachments").unbind('click');
		$("#addSalesMarketingCommentsAndAttachments").on('click',function addSalesMarketingCommentsAndAttachmentsClick(e){
			e.preventDefault();
			commentsAndAttachmentsObject.openAddSMCommentsAndAttachmentsPopupWindow(that.processSalesAndMarketingAddEditComments, null, true, null, erm.dbvalues.entityType.PRODUCT_PROMO_MTRL, -1);
		});
		
	};
	
	this.processSubrightsAddComments = function processSubrightsAddComments(comment, categoryId, foxVersionId, grantCodeId){
		var that = this;
		if(comment){		
			
			var jsonData = JSON.stringify(comment);
			console.log(" SUBRIGHTS JSON : %o", jsonData);
			var url = subrightObject.subrightsPaths.getProductGrantsAddCommentRESTPath()+"/"+foxVersionId;
			if(!isNaN(comment.id) && comment.id > 0){
				url = subrightObject.subrightsPaths.getProductGrantsEditCommentRESTPath()+"/"+foxVersionId;
			}
			that.showSubmitPopupWindow();
			var jqxhr = $.post(url, {q:jsonData,'categoryId':categoryId,'grantCodeId':grantCodeId}, function(data){				
				subrights_submitPopupWindow.close();
				commentsAndAttachmentsObject.closeTemplateAddCommentsAndAttachmentWindow();
				commentsAndAttachmentsObject.resetFields();
				var rcscope = angular.element(document.getElementById("rightsController")).scope();
				rcscope.loadSubrightComments();				
				rcscope.$apply();
			}).fail(function(xhr,status,message){
				subrights_submitPopupWindow.close();
				errorPopup.showErrorPopupWindow(xhr.responseText);
			});			
		}
	};
	
	this.processDeleteComment = function(commentId){
		var that = this;
		if(commentId){
			var rcscope = angular.element(document.getElementById("rightsController")).scope();
			var c = new Object();
			c.id = commentId;			
			//c.foxVersionId = rcscope.foxVersionId;
			var jsonData = JSON.stringify(c);
			console.log(" COMMENT TO BE DELETED : %o", jsonData);
			var url = subrightObject.subrightsPaths.getProductGrantsDeleteCommentRESTPath()+"/"+rcscope.foxVersionId+"?categoryId=-1";
			//that.showSubmitPopupWindow();
			var jqxhr = $.post(url, {q:jsonData}, function(data){	
				//subrights_submitPopupWindow.close();
				rcscope.loadSubrightComments();
				rcscope.loadSalesAndMarketingComments(rcscope.salesAndMarketingSubtab.grantCategory);
				rcscope.$apply();
			}).fail(function(xhr,status,message){
				//subrights_submitPopupWindow.close();
				errorPopup.showErrorPopupWindow(xhr.responseText);
			});
		}
	};
	
	this.processSalesAndMarketingAddEditComments = function(comment, categoryId, foxVersionId, grantCodeId){ //AMV
		var that = this;
		if(comment){		
			
			var jsonData = JSON.stringify(comment);
			console.log(" SUBRIGHTS JSON (1) : %o", jsonData);
			var url = subrightObject.subrightsPaths.getProductGrantsAddCommentRESTPath()+"/"+foxVersionId;
			if(!isNaN(comment.id) && comment.id > 0){
				//AMV need to include the fox version id because we need to link to CM
				url = subrightObject.subrightsPaths.getProductGrantsEditCommentRESTPath()+"/"+foxVersionId;
			}
			that.showSubmitPopupWindow();
			var jqxhr = $.post(url, {q:jsonData,'categoryId':categoryId,'grantCodeId':grantCodeId}, function(data){				
				subrights_submitPopupWindow.close();
				commentsAndAttachmentsObject.closeTemplateAddCommentsAndAttachmentWindow();
				commentsAndAttachmentsObject.resetFields();
				var rcscope = angular.element(document.getElementById("rightsController")).scope();
				//rcscope.loadSubrights(comment.foxVersionId);	
				rcscope.loadSalesAndMarketingComments(rcscope.salesAndMarketingSubtab.grantCategory);
				rcscope.$apply();
			}).fail(function(xhr,status,message){
				subrights_submitPopupWindow.close();
				errorPopup.showErrorPopupWindow(xhr.responseText);
			});
			
		}
	};
	
	/**
	 * 
	 */
	this.openAddCommentsAndAttachmentsPopupWindow = function openAddCommentsAndAttachmentsPopupWindow(commentId,entityCommentId){
		commentsAndAttachmentsObject.openAddCommentsAndAttachmentsPopupWindow(this.processSubrightsAddComments, commentId, false, erm.dbvalues.entityCommentType.SUBRIGHTS, erm.dbvalues.entityType.PRODUCT_GRANT,entityCommentId);
	};
	
	this.openAddSMCommentsAndAttachmentsPopupWindow = function(commentId, code, entityTypeId,entityCommentId){		
		commentsAndAttachmentsObject.openAddSMCommentsAndAttachmentsPopupWindow(this.processSalesAndMarketingAddEditComments, commentId, true, code, entityTypeId,entityCommentId);
	};
	
	this.initializeElements = function(){
		
		this.initializeRemakesSequels();
	};
	
	this.getCurrentAngularScope = function(){
		return angular.element(document.getElementById("rightsController")).scope();
	};
	
	this.openDeleteCommentsAndAttachmentsPopopWindow = function openDeleteCommentsAndAttachmentsPopopWindow(commentId){
		var cf = new confirmationPopup();
		cf.initializeElement();
		var confirmationText = "You are about to delete a comment (ID : "+commentId+") . Are you sure?";
		var confirmationButtonText = "Confirm Delete";
		cf.openConfirmationWindow("#commentsAndAttachmentPopupWindow", confirmationText, confirmationButtonText, commentId, this.processDeleteComment);
	};
	
}

var subrightObject = new subrightHandler();
var commentsAndAttachmentConfirmationPopup = null;

