function rightStrandElement(){
	
	this.ids = new Array();
	this.mediaId = null;
	this.mediaIds = null; //hold an array of media ids
	this.territoryId = null;
	this.territoryIds = null; //hold an array of territory ids;
	this.languageId = null;
	this.languageIds = null; //hold an array of language ids
	this.strandSetName = null;
	this.strandSetId = null;
	this.startContractualDate = null;
	this.startContractualDateString = null;
	this.startOverrideDate = null;
	this.startOverrideDateString = null;
	this.startDateCode = null;
	this.startDateStatus = null;
	this.endContractualDate = null;
	this.endContractualDateString = null;
	this.endOverrideDate = null;
	this.endOverrideDateString = null;
	this.endDateCode = null;
	this.endDateStatus = null;
	this.inclusionExclusion = null;
	this.restrictionsToAdd = null; //hold an array of restriction(s) to be added to a right strand;
	this.restrictionsToRemove = null; //hold an array of restriction(s) to be removed from a right strand;
	this.processFlag = null;
	this.productVersionIds = null;
	this.targetProductVersionIds = null;
	this.fromProductVersionId = null;
	this.comment = null;
	this.commentTitle = null;
	this.changeStartDate = false;
	this.changeEndDate = false;
	this.changeOverrideStartDate = false;
	this.changeOverrideEndDate = false;
	this.restrictionComment = null;
	this.restrictionCommentTitle = null;
	this.isFoxipediaSearch=false;
	
	
	this.getUpdateRightStrandObject = function(){
		
		var ob = new Object();
		ob.ids = this.ids;
		ob.mediaId = this.mediaId;
		ob.territoryId = this.territoryId;
		ob.languageId = this.languageId;
		ob.strandSetName = this.strandSetName;
		ob.strandSetId = this.strandSetId;
		ob.startContractualDate = this.startContractualDate;
		ob.startOverrideDate = this.startOverrideDate;
		ob.startContractualDateString = this.startContractualDateString;
		ob.startOverrideDateString = this.startOverrideDateString;
		ob.startDateCode = this.startDateCode;
		if(ob.startDateCode <= 0){
			ob.startDateCode = null;
		}
				
		ob.startDateStatus = this.startDateStatus;
		if(ob.startDateStatus <= 0){
			ob.startDateStatus = null;
		}
		ob.endContractualDate = this.endContractualDate;
		ob.endOverrideDate = this.endOverrideDate;
		ob.endContractualDateString = this.endContractualDateString;
		ob.endOverrideDateString = this.endOverrideDateString;
		ob.endDateCode = this.endDateCode;
		if(ob.endDateCode <= 0){
			ob.endDateCode = null;
		}
		ob.endDateStatus = this.endDateStatus;
		if(ob.endDateStatus <= 0){
			ob.endDateStatus = null;
		}
		ob.inclusionExclusion = this.inclusionExclusion;
		ob.restrictionsToAdd = this.restrictionsToAdd;
		ob.restrictionsToRemove = this.restrictionsToRemove;
		ob.processFlag = this.processFlag;
		ob.comment = this.comment;
		ob.commentTitle = this.commentTitle;
		ob.changeStartDate = this.changeStartDate;
		ob.changeEndDate = this.changeEndDate;
		ob.changeOverrideStartDate = this.changeOverrideStartDate;
		ob.changeOverrideEndDate = this.changeOverrideEndDate;
		ob.restrictionComment = this.restrictionComment;
		ob.restrictionCommentTitle = this.restrictionCommentTitle;
		if (this.deleteOverrideStartDate) {
			ob.deleteOverrideStartDate = this.deleteOverrideStartDate;
		}
		if (this.deleteOverrideEndDate) {
			ob.deleteOverrideEndDate = this.deleteOverrideEndDate;
		}
		var commentId = this.commentId;
		if (commentId&&parseInt(commentId)) {
			ob.commentId = parseInt(commentId);
		}
		


		return ob;
		
	};
	
	
	this.getAdoptRightStrandObject = function(pFlag){
		
		var ob = new Object();
		
		ob.ids = this.ids;
		ob.mediaIds = null;
		ob.territoryId = null;
		ob.languageId = null;
		ob.strandSetName = null;
		ob.strandSetId = null;
		ob.startContractualDate = null;
		ob.startOverrideDate = null;
		ob.startDateCode = null;		
		ob.startDateStatus = null;		
		ob.endContractualDate = null;
		ob.endOverrideDate = null;
		ob.endDateCode = null;
		ob.endDateStatus = null;
		ob.inclusionExclusion = null;
		ob.restrictionsToRemove = null;
		ob.restrictionsToAdd = this.restrictionsToAdd;
		ob.processFlag = this.processFlag;
		return ob;
		
	};
	
	this.adoptRightStrandObject = function(){
		return this.getAdoptRightStrandObject(rightStrandProcessingOptions.ADOPT_RIGHT_STRAND);
	};
	
	this.getCopyRightStrandObject = function(){
		
		var ob = new Object();
		
		ob.ids = this.ids; //ids of strands to be copied
		ob.mediaIds = (this.mediaIds != null && this.mediaIds.length > 0) ? this.mediaIds : null;
		ob.territoryIds = (this.territoryIds != null && this.territoryIds.length > 0) ? this.territoryIds : null;;
		ob.languageIds = (this.languageIds != null && this.languageIds.length > 0) ? this.languageIds : null;
		ob.strandSetName = (this.strandSetName == null || this.strandSetName.trim() == '') ? null : this.strandSetName;
		ob.strandSetId = (this.strandSetId != null && this.strandSetId > 0) ? this.strandSetId : null;
		ob.startContractualDate = this.startContractualDate;
		ob.startOverrideDate = this.startOverrideDate;
		ob.startDateCode = this.startDateCode;
		if(ob.startDateCode == "" || ob.startDateCode <= 0){
			ob.startDateCode = null;
		}
				
		ob.startDateStatus = this.startDateStatus;
		if(ob.startDateStatus == "" || ob.startDateStatus <= 0){
			ob.startDateStatus = null;
		}
		ob.endContractualDate = this.endContractualDate;
		ob.endOverrideDate = this.endOverrideDate;
		ob.endDateCode = this.endDateCode;
		if(ob.endDateCode == "" || ob.endDateCode <= 0){
			ob.endDateCode = null;
		}
		ob.endDateStatus = this.endDateStatus;
		if(ob.endDateStatus == "" || ob.endDateStatus <= 0){
			ob.endDateStatus = null;
		}
		ob.inclusionExclusion = this.inclusionExclusion;
		ob.restrictionsToAdd = this.restrictionsToAdd;
		ob.restrictionsToRemove = this.restrictionsToRemove;
		ob.targetProductVersionIds = this.targetProductVersionIds;
		ob.fromProductVersionId = this.fromProductVersionId;
		ob.comment = this.comment;		
		ob.startContractualDateString = this.startContractualDateString;
		ob.startOverrideDateString = this.startOverrideDateString;
		ob.endContractualDateString = this.endContractualDateString;
		ob.endOverrideDateString = this.endOverrideDateString;
		ob.commentTitle = this.commentTitle;
		ob.changeStartDate = this.changeStartDate;
		ob.changeEndDate = this.changeEndDate;
		ob.changeOverrideStartDate = this.changeOverrideStartDate;
		ob.changeOverrideEndDate = this.changeOverrideEndDate;
		if (this.deleteOverrideStartDate) {
			ob.deleteOverrideStartDate = this.deleteOverrideStartDate;
		}
		if (this.deleteOverrideEndDate) {
			ob.deleteOverrideEndDate = this.deleteOverrideEndDate;
		}
		var commentId = this.commentId;
		if (commentId && parseInt(commentId)) {
			ob.commentId = parseInt(commentId);
		}
		
		return ob;
		
	};
	
	this.getCreateRightStrandObject = function(){
		
		var cro = new Object();
		
		cro.endContractualDate = this.endContractualDate;
		cro.endContractualDateString = this.endContractualDateString;
		cro.endDateCode = this.endDateCode;
		cro.endDateStatus = this.endDateStatus;
		cro.endOverrideDate = this.endOverrideDate;
		cro.endOverrideDateString = this.endOverrideDateString;
		cro.inclusionExclusionProduct = this.inclusionExclusion;
		cro.languages = this.languageIds;
		cro.media = this.mediaIds;
		cro.startContractualDate = this.startContractualDate;
		cro.startContractualDateString = this.startContractualDateString;
		cro.startDateCode = this.startDateCode;
		cro.startDateStatus = this.startDateStatus;
		cro.startOverrideDate = this.startOverrideDate;
		cro.startOverrideDateString = this.startOverrideDateString;
		cro.strandSetName = this.strandSetName;
		cro.strandSetId = this.strandSetId;
		cro.foxVersionId = this.fromProductVersionId;
		cro.territories = this.territoryIds;
		cro.restrictions = this.restrictionsToAdd;
		cro.comment = this.comment; 
		cro.commentTitle = this.commentTitle;
		cro.restrictionComment = this.restrictionComment;
		cro.restrictionCommentTitle = this.restrictionCommentTitle;
		cro.isFoxipediaSearch=this.isFoxipediaSearch;		
		var commentId = this.commentId;
		if (commentId&&parseInt(commentId)) {
			cro.commentId = parseInt(commentId);
		}
		
		return cro;
	};
	
	this.getEditRightStrandRestrictionsObject = function(){
		
		var ob = new Object();
		
		ob.ids = this.ids;
		ob.mediaIds = null;
		ob.territoryId = null;
		ob.languageId = null;
		ob.strandSetName = null;
		ob.strandSetId = null;
		ob.startContractualDate = null;
		ob.startOverrideDate = null;
		ob.startDateCode = null;		
		ob.startDateStatus = null;		
		ob.endContractualDate = null;
		ob.endOverrideDate = null;
		ob.endDateCode = null;
		ob.endDateStatus = null;
		ob.inclusionExclusion = null;
		ob.restrictionsToRemove = null;
		ob.restrictionsToAdd = this.restrictionsToAdd;
		ob.processFlag = this.processFlag;
		ob.comment = this.comment;
		ob.commentTitle = this.commentTitle;
		ob.restrictionComment = this.restrictionComment;
		ob.restrictionCommentTitle = this.restrictionCommentTitle;
		return ob;
		
	};
}

function productRestrictionObject(){
	
	this.foxVersionId = null;
	this.restrictions = null;
	
	this.getRestrictionObject = function(){
		var ob = new Object();
		ob.foxVersionId = this.foxVersionId;
		ob.restrictions = this.restrictions;
		return ob;
	};
}

function subrightsElement(){
	
	this.status = null;
	this.statusId = null;
	this.comments = null;
	this.statusDataSource = null;
	
}

function subrightComments(){
	this.id = null;
	this.shortDescription = null;
	this.longDescription = null;
	this.commentTypeId = 6;
	this.extractNumber = null;
	this.publicInd = 1;
	this.legalInd = erm.security.isBusiness() ? 0 : 1;
	this.businessInd = erm.security.isBusiness() ? 1 : 0;
	
	//TMA memory leak -- same pattern of using object.getPrototypeOf();
	//this.commentAttachments = object.getPrototypeOf(Array());
	this.commentAttachments = new Array();
	this.createName = null;
	this.userId = null;
	this.foxVersionId = null;
	this.commentStatus = null;
	this.grantCodeId = null;
	this.productGrandId = null;
	this.grantStatusId = null;
	this.categoryId = null;
	this.updateName = null;
	this.updateDate = null;
	
	this.setComment = function(id, sd, ld, ctId, publicInd, catId){
		this.id = id;
		this.shortDescription = sd;
		this.longDescription = ld;
		this.commentTypeId = ctId;
		this.publicInd = publicInd;
		this.categoryId = catId;
	};
	
	this.getCommentObject = function(){
		//TMA memory leak -- same pattern of using object.getPrototypeOf();
		//var ob = object.getPrototypeOf(Object());
		var ob = new Object();
		
		ob.id = (this.commentId == null ? "" : this.commentId);
		ob.shortDescription = (this.shortDescription == null ? "" : this.shortDescription);
		ob.longDescription = (this.longDescription == null ? "" : this.longDescription);
		ob.commentTypeId = (this.commentTypeId == null ? "" : this.commentTypeId);
		//ob.extractNumber = (this.extractNumber == null ? "" : this.extractNumber);
		ob.publicInd = (this.publicInd == null ? "" : this.publicInd);
		ob.legalInd = (this.legalInd == null ? "" : this.legalInd);
		ob.businessInd = (this.businessInd == null ? "" : this.businessInd);
		ob.commentTypeId = (this.commentTypeId == null ? "" : this.commentTypeId);
		ob.userId = this.userId;
		ob.foxVersionId = this.foxVersionId;
		ob.createName = this.createName;
		ob.commentStatus = (this.commentStatus == null ? "" : this.commentStatus);
		ob.grantCodeId = (this.grantCodeId == null ? "" : this.grantCodeId);
		ob.productGrantId = (this.productGrandId == null ? "" : this.productGrandId);
		ob.grantStatusId = (this.grantStatusId == null ? "" : this.grantStatusId);
		
		return ob;
	};
	
	this.addCommentAttachement = function(subAttachement){
		this.commentAttachments.push(subAttachement);
	};
	
	this.removeCommentAttachment = function(subAttachment){
		var index = null;
		for(var i = 0; i < this.commentAttachments.length; i++){
			var sa = this.commentAttachments[i];
			if(sa.documentId == subAttachment.documentId || sa.documentName ==  subAttachment.subAttachment){
				index = i;
				break;
			}
		}
		
		if(!isNaN(index) && parseInt(index) > 0){
			this.commentAttachments.splice(index, 1);
		}
	};
	
	this.getShortCommentObject = function(){
		var ob = new Object();
		ob.id = this.id;
		ob.shortDescription = this.shortDescription;
		ob.longDescription = this.longDescription;
		ob.commentTypeId = this.commentTypeId;
		ob.publicInd = this.publicInd;
		ob.categoryId = this.categoryId;
		return ob;
	};
	
	this.getShortCommentArray = function(){
		var ob = new Array();
		ob.id = this.id;
		ob.shortDescription = this.shortDescription;
		ob.longDescription = this.longDescription;
		ob.commentTypeId = this.commentTypeId;
		ob.publicInd = this.publicInd;
		ob.categoryId = this.categoryId;
		ob.updateName = this.updateName;
		ob.updateDate = this.updateDate;
		return ob;
	};
}

function subrightAttachement(){
	this.documentId = null;
	this.documentType = null; //can be link or doc
	this.documentContent = null; //can be url or full text in case where the document is not stored in DM 
	this.documentLength = null;
	this.documentName = null;
	
	this.getAttachmentObject = function(){
		var ob = new Object();
		
		ob.documentId = (this.documentId == null ? "" : this.documentId);
		ob.documentType = (this.documentType == null ? "" : this.documentType);
		ob.documentContent = (this.documentContent == null ? "" : this.documentContent);
		ob.documentLength = (this.documentLength == null ? "" : this.documentLength);
		ob.documentName = (this.documentName == null ? "" : this.documentName);
		
		return ob;		
	};
}

function productGrant(){
	this.productGrantId = null;
	this.grantCodeId = null;
	this.status = new Array();
}

function subrightGrantCode(){
	this.grantCodeId = null;
	this.grantCodeDescription = null;
	this.grantTypeId = null;	
}

function subrightStatus(){
	this.grantStatusId = null;
	this.grandStatusDescription = null;
	this.grantStatusCode = null;
}

var rightStrandProcessingOptions = {
		CREATE_RIGHT_STRAND : 1,
		UPDATE_RIGHT_STRAND : 2,
		ADOPT_RIGHT_STRAND : 3,
		ADOPT_RESTRICTION : 5	
};


var START_DATE_ERROR = 'Either the date entered for the term start date is invalid or you failed to select a valid term start date, or a start date code, or a valid override start date';
var END_DATE_ERROR = 'Either the date entered for the contractual end date is invalid or you failed to select a valid contractual end date, or an end date code, or a valid override end date';
var END_DATE_BEFORE_START_DATE_ERROR = 'The "Contractual End Date" cannot be the same as or before the "Term Start Date"...';


