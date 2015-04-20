//var erm_user={"id":1046,"userId":"ANDREASM","name":"ANDREAS MOLINA","privileges":
//[
//{"userId":1046,"roleId":1048,"privilegeId":1047,"roleName":"ERM BUSINESS ADMIN","privilegeName":"ERM Business Data","functionPointId":1,"functionPointName":"Strands","create":true,"read":true,"update":true,"delete":true},
//{"userId":1046,"roleId":1048,"privilegeId":1047,"roleName":"ERM BUSINESS ADMIN","privilegeName":"ERM Business Data","functionPointId":2,"functionPointName":"Restrictions","create":true,"read":true,"update":true,"delete":true},
//{"userId":1046,"roleId":1045,"privilegeId":null,"roleName":"ERM","privilegeName":null,"functionPointId":null,"functionPointName":null,"create":false,"read":false,"update":false,"delete":false}],"legal":false,"business":true};

erm.Privilege = function(name,isCreate,isRead,isUpdate,isDelete) {
		this.name=name;
		this.isCreate=isCreate;
		this.isRead=isRead;
		this.isUpdate=isUpdate;
		this.isDelete = isDelete;
},

erm.Privilege.prototype.has=function(operation) {
	if ("C"===operation) return this.isCreate===true;
	if ("R"===operation) return this.isRead===true;	
	if ("U"===operation) return this.isUpdate===true;
	if ("D"===operation) return this.isDelete===true;
	return false;
};

erm.security = {
	BUSINESS_DATA: "ERM Business Data",
	LEGAL_DATA:"ERM Legal Data",
	PRODUCT_SEARCH: "Product Search",
	PRIVATE_CONTACTS: "Private Contacts",
	RS_CREATE:"RSADD",
	RS_REMOVE:"RSRM",
	RS_UPDATE:"RSMOD",
	RS_COPY:"RSCP",
	INFO_CODE:"INFOCD",
	ADOPT_RS:"ADPTRS",
	ADOPT_INFO_CODE:"ADPTPRODINFOCD",
	CLEARANCE_MEMO:"CLRNCMEMO",
	CLEARANCE_REPORT:"CLRNCRPT",
	SUBRIGHT_VIEW:"SUBRTTAB",
	GRANTS:"GRNTS",
	SALES_AND_MARKETING:"SNMTAB", 	
	BUSINESS_CONFIRMATION: "BSNSSTS",
	GENERAL_TAB:"GNRLTAB", 
	DO_NOT_LICENSE:"DNL",
	PRODUCT_COMMENTS:"PRODCMMNTS",
	CLEARANCE_MEMO_COMMENTS:"PRODCMMNTS",
	RIGHT_STRAND_COMMENTS:"RSCMMNTS",
	REPORT_PAGE:"RPTPG",
	FOX_PRODUCED:"FOXPRODCD",
	SYNC_RELEASE_DATE:"SYNCRLSDT",
	CENTRAL_FILE_NO : "CNTRLFLNO",
	X_PRODUCT_COPY: "CRSPRODCP",
	X_PRODUCT_DELETE: "CRSPRODDEL",
	ACK_CM_UPDATE: "ACKCMUP",
	CONTACTS_ADMIN:"CNTCTADM",
	CONTACTS_DETAIL:"CNTCTDTL",
	FUTURE_MEDIA:"FTRMEDIA",
	CM_MAP:"CMMAP",
	FILMS_AND_CLIPS : "FLMCLPS",
	REMAKES_AND_SEQUEL: "RMKSQL",
	LEGITIMATE_STAGE: "LGTMTSTG",
	PUBLIC_QUERY: "PUBQRY",
	PAID_ADD_MEMO: "ADMEMO",
	ANCILLARY_RIGHTS:"ANCRT",
	MERCHANDISING_COMMERCIAL_TIE_INS:"LNM",
	COMMERICAL_TIE_INS:"COMTIEINS",
	TITLE_CREDITS:"TTLCREDITS",
	BILLING_BLOCK:"BILLINGBLK",
	ARTWORK_RESTRICTIONS:"ARTWRK",
	PRIVATE_COMMENTS:"PRVCOMMNT",
	INQUIRYUSER:false,
	CONFIDENTIAL_TITLES: "CNFDLTTLSRCH",
	
	setUser:function(user) {
		this.user=user;
	},
	
	isBusiness: function() {
		if (!this.user) {
			console.log("Error: erm.security user is not set");
			return true;
		}
		return this.user.business;
	},
	
	isInquiryUser: function() {
		if (this.user && this.user.privileges != null ) {
			for (var i = 0; i <= this.user.privileges.length; i++) {
				if (this.user.privileges[i] == null)
				  continue;
				if (this.user.privileges[i].roleName == "ERM Inquiry User") {
					return true;
				}
			}
		}
		return false;
	},
	
	isBusinessAdmin: function isBusinessAdmin() {
		var privs = this.user.privileges;
		return privs.some(function(e) {return e.roleName === "ERM Business Admin";});
	},
	isLegalAdmin: function isLegalAdmin(){
		var privs = this.user.privileges;
		return privs.some(function(e) {return e.roleName === "ERM Legal Admin";});
		
	},
	isSubrightsAdmin: function isSubrightsAdmin(){
		var privs = this.user.privileges;
		return privs.some(function(e) {return e.roleName === "ERM Subrights Admin";});
		
	},
	isAdmin: function isAdmin() {
		return this.isBusinessAdmin() || this.isLegalAdmin();
	},
	
	userRole: function () {		
		var roleFound = "ERM";
		if (this.user && this.user.privileges != null ) {
			for (var i = 0; i <= this.user.privileges.length; i++) {
				if (this.user.privileges[i] == null)
				  continue;
				if (this.user.privileges[i].roleName == "ERM Legal Admin") {
					roleFound = "ERM Legal Admin";
					break;
				}
				if (this.user.privileges[i].roleName == "ERM Business Admin") {
					roleFound = "ERM Business Admin";
					break;
				}	
				if ((roleFound == "ERM" || roleFound == "ERM Inquiry User") && this.user.privileges[i].roleName == "ERM Sales and Marketing Admin") {
					roleFound = "ERM Sales and Marketing Admin";						
				}
				if ((roleFound == "ERM" || roleFound == "ERM Inquiry User") && this.user.privileges[i].roleName == "ERM Subrights Admin") {
					roleFound = "ERM Subrights Admin";						
				}
				if (roleFound == "ERM" && this.user.privileges[i].roleName == "ERM Inquiry User") {
					roleFound = "ERM Inquiry User";						
				}
			}							
		}		
		return roleFound;
	},

	getPrivileges:function(functionPointName,privilegeName) {
		var privileges= this.user.privileges;
		var privs=[];
		$.each(privileges,function(idx,privilege){
			add=false;
			if (privilege.privilegeName===privilegeName&&
				privilege.functionPointName===functionPointName) {
				privs.push(new erm.Privilege(privilegeName,privilege.create,privilege.read,privilege.update,privilege.del));
			}
		});
		return privs;
	},

	
	/**
	 *@param op The CRUD operation. Possible values are: "C","R","U","D"
	 */
	hasPrivilege:function(functionPoint,privilegeName,op) {
		var privileges = this.getPrivileges(functionPoint,privilegeName);
		var has= false;
		$.each(privileges,function(idx,element){
			if (element.has(op)) {
				has=true;
			}
		});
		return has;
	},
	hasRead:function(functionPointName,privilegeName) {
		return this.hasPrivilege(functionPointName,privilegeName,"R");
	},
	hasCreate:function(functionPointName,privilegeName) {
		return this.hasPrivilege(functionPointName,privilegeName,"C");
	},
	hasDelete:function(functionPointName,privilegeName) {
		return this.hasPrivilege(functionPointName,privilegeName,"D");
	},
	hasUpdate:function(functionPointName,privilegeName) {
		return this.hasPrivilege(functionPointName,privilegeName,"U");		
	},
	
	
	//specific methods to be used by the UI
	canCreateStrands: function() {
		return this.canCreateBusinessStrands()||
			   this.canCreateLegalStrands();
	},
	
	canCreateBusinessStrands: function() {
		return this.hasCreate(this.RS_CREATE, this.BUSINESS_DATA);		
	},
	canCreateLegalStrands: function() {
		return this.hasCreate(this.RS_CREATE, this.LEGAL_DATA);		
	},
	
	
	canDeleteBusinessStrands: function() {
		var can = this.hasDelete(this.RS_REMOVE, this.BUSINESS_DATA); 
		return can;
	},
	canDeleteLegalStrands: function() {
		var can = this.hasDelete(this.RS_REMOVE, this.LEGAL_DATA); 
		return can;
	},
	canDeleteStrands: function() {
		return this.canDeleteBusinessStrands() || this.canDeleteLegalStrands();
	},
	canCopyBusinessStrands: function() {
		return this.hasRead(this.RS_COPY, this.BUSINESS_DATA) &&
			   this.canCreateStrands();
	},
	canCopyLegalStrands: function() {
		return this.hasRead(this.RS_COPY, this.LEGAL_DATA)&&
		       this.canCreateStrands();
	},
	canCopyStrands: function() {
		return this.canCopyBusinessStrands()||this.canCopyLegalStrands();		
	},
	
	canUpdateBusinessStrands: function() {
		return this.hasUpdate(this.RS_UPDATE, this.BUSINESS_DATA);
	},
	canUpdateLegalStrands: function() {
		return this.hasUpdate(this.RS_UPDATE, this.LEGAL_DATA);
	},
	canUpdateStrands: function() {
		return this.canUpdateBusinessStrands()||this.canUpdateLegalStrands();
	},
	
	canUpdateConfirmationStatus: function() {
		return this.hasUpdate(this.GENERAL_TAB,this.LEGAL_DATA);
	},
	canUpdateBusinessConfirmationStatus: function() {		
		return this.hasUpdate(this.BUSINESS_CONFIRMATION,this.BUSINESS_DATA);
	},
	canViewBusinessConfirmationStatus: function() {		
		return this.hasRead(this.BUSINESS_CONFIRMATION,this.BUSINESS_DATA);
	},
	
		
	
	canUpdateDoNotLicense:function() {
		return this.hasUpdate(this.DO_NOT_LICENSE,this.BUSINESS_DATA);
	},
	canCreateProductRestrictions: function(){
		return this.hasCreate(this.INFO_CODE,this.BUSINESS_DATA)||
			   this.hasCreate(this.INFO_CODE,this.LEGAL_DATA);
	},
	canDeleteBusinessProductRestrictions: function() {
		return this.hasDelete(this.INFO_CODE, this.BUSINESS_DATA);
	},
	canDeleteLegalProductRestrictions: function() {
		return this.hasDelete(this.INFO_CODE, this.LEGAL_DATA);
	},
	canDeleteProductRestrictions:function() {
		return this.canDeleteBusinessProductRestrictions() ||
			   this.canDeleteLegalProductRestrictions();
	},
	
	canUpdateLegalProductRestrictions: function() {
		return this.hasUpdate(this.INFO_CODE, this.LEGAL_DATA);
	},
	canUpdateBusinessProductRestrictions: function() {
		return this.hasUpdate(this.INFO_CODE, this.BUSINESS_DATA);
	},
	canUpdateProductRestrictions:function() {
		return this.canUpdateBusinessProductRestrictions()||
			   this.canUpdateLegalProductRestrictions();
	},
	
	canReadBusinessProductRestrictions: function() {
		return this.hasRead(this.INFO_CODE, this.BUSINESS_DATA);
	},
	canReadLegalProductRestrictions: function() {
		return this.hasRead(this.INFO_CODE, this.BUSINESS_DATA);
	},
	canCopyBusinessProductRestrictions: function() {
		return this.canCreateProductRestrictions() &&
			   this.canReadBusinessProductRestrictions();
	},
	canCopyLegalProductRestrictions: function() {
		return this.canCreateProductRestrictions() &&
		   	   this.canReadLegalProductRestrictions();
	},
	canCopyProductRestrictions: function() {
		return this.canCopyBusinessProductRestrictions()||
			   this.canCopyLegalProductRestrictions();
	},
	canAdoptRightStrand : function(){
		return this.canAdoptLegalRightStrand() ||
			   this.canAdoptBusinessRightStrand();
	},
	canUploadOrCreateClearanceMemos: function() {
		return this.hasCreate(this.CLEARANCE_MEMO, this.LEGAL_DATA);
	},
	canModifyClearanceMemos: function() {
		return this.hasUpdate(this.CLEARANCE_MEMO, this.LEGAL_DATA);
	},
	canDeleteClearanceMemo: function() {
		return this.hasDelete(this.CLEARANCE_MEMO, this.LEGAL_DATA);		
	},
	canViewClearanceReport: function() {		
		return this.hasRead(this.CLEARANCE_REPORT, this.LEGAL_DATA);
	},
	canAdoptBusinessRightStrand: function() {
		return this.hasRead(this.ADOPT_RS, this.BUSINESS_DATA);
	},
	canAdoptLegalRightStrand: function() {
		return this.hasRead(this.ADOPT_RS, this.LEGAL_DATA);
	},
	canAdoptBusinessProductRestrictions: function(){
		return this.hasRead(this.ADOPT_INFO_CODE, this.BUSINESS_DATA);		
	},
	canAdoptLegalProductRestrictions: function(){
		return this.hasRead(this.ADOPT_INFO_CODE, this.LEGAL_DATA);
	},
	canAdpotProductRestrictions: function() {
		return this.canAdoptBusinessProductRestrictions()||
			   this.canAdoptLegalProductRestrictions();
	},
	canReadSubrights : function(){
		var can = this.hasRead(this.SUBRIGHT_VIEW, this.LEGAL_DATA); 
		return can;
	},
	canCreateSubrights: function(){
		return this.hasCreate(this.SUBRIGHT_VIEW, this.LEGAL_DATA);
	},
	canDeleteSubrights: function(){
		return this.hasDelete(this.SUBRIGHT_VIEW, this.LEGAL_DATA);
	},
	canReadSalesAndMarketing: function(){
		return this.hasRead(this.SALES_AND_MARKETING, this.LEGAL_DATA);
	},
	canCreateSalesAndMarketing:function(){
		var can = this.hasCreate(this.SALES_AND_MARKETING, this.LEGAL_DATA); 
		return can;
	},
	canUpdateSalesAndMarketing:function(){
		return this.hasUpdate(this.SALES_AND_MARKETING, this.LEGAL_DATA);
	},
	canDeleteSalesAndMarketing:function(){
		return this.hasDelete(this.SALES_AND_MARKETING, this.LEGAL_DATA);
	},
	canUpdateSubrights: function(){
		return this.hasUpdate(this.SUBRIGHT_VIEW, this.LEGAL_DATA);
	},	
	canViewFilmsAndClips: function canViewFilmsAndClips() {
		return this.hasRead(this.FILMS_AND_CLIPS,this.LEGAL_DATA);
	},
	canEditFilmsAndClips: function canEditFilmsAndClips() {
		return this.hasCreate(this.FILMS_AND_CLIPS,this.LEGAL_DATA);		
	},
	canViewRemakesAndSequels: function canViewRemakesAndSequels() {
		return this.hasRead(this.REMAKES_AND_SEQUEL,this.LEGAL_DATA);		
	},
	canEditRemakesAndSequels:function canEditRemakesAndSequels() {
		return this.hasCreate(this.REMAKES_AND_SEQUEL,this.LEGAL_DATA);				
	},
	canViewLegitimateStage: function canViewLegitimateStage() {
		return this.hasRead(this.LEGITIMATE_STAGE,this.LEGAL_DATA);				
	},
	canEditLegitimateStage: function canEditLegitimateStage() {
		return this.hasCreate(this.LEGITIMATE_STAGE,this.LEGAL_DATA);						
	},
	
	canAcknowledgeUpdates:function(){
		return this.hasCreate(this.ACK_CM_UPDATE, this.LEGAL_DATA);
	},
	canViewPrivateComments : function() {
		return this.hasRead(this.PRIVATE_COMMENTS,this.LEGAL_DATA)||this.hasRead(this.PRIVATE_COMMENTS,this.BUSINESS_DATA);
	},
	canViewBusinessProductComments:function(){
		return this.hasRead(this.PRODUCT_COMMENTS, this.BUSINESS_DATA);
	},	
	canEditBusinessProductComments:function(){
		return this.hasUpdate(this.PRODUCT_COMMENTS, this.BUSINESS_DATA);
	},
	canDeleteBusinessProductComments:function(){
		return this.hasDelete(this.PRODUCT_COMMENTS, this.BUSINESS_DATA);
	},
	canViewLegalClearanceMemoComments:function(){
		return this.hasRead(this.CLEARANCE_MEMO_COMMENTS, this.LEGAL_DATA);
	},
	canEditLegalClearanceMemoComments:function(){
		return this.hasUpdate(this.CLEARANCE_MEMO_COMMENTS, this.LEGAL_DATA);
	},
	canDeleteLegalClearanceMemoComments:function(){
		return this.hasDelete(this.CLEARANCE_MEMO_COMMENTS, this.LEGAL_DATA);
	},
	canViewLegalRightStrandComments:function(){
		return this.hasRead(this.RIGHT_STRAND_COMMENTS, this.LEGAL_DATA);
	},
	canEditLegalRightStrandComments:function(){
		return this.hasUpdate(this.RIGHT_STRAND_COMMENTS, this.LEGAL_DATA);
	},
	canDeleteLegalRightStrandComments:function(){
		return this.hasDelete(this.RIGHT_STRAND_COMMENTS, this.LEGAL_DATA);
	},	
	canViewBusinessRightStrandComments:function(){
		return this.hasRead(this.RIGHT_STRAND_COMMENTS, this.BUSINESS_DATA);
	},
	canEditBusinessRightStrandComments:function(){
		return this.hasUpdate(this.RIGHT_STRAND_COMMENTS, this.BUSINESS_DATA);
	},
	canDeleteBusinessRightStrandComments:function(){
		return this.hasDelete(this.RIGHT_STRAND_COMMENTS, this.BUSINESS_DATA);
	},	
	
	canViewRightStrandComments:function(){
		return this.canViewBusinessRightStrandComments() ||
			   this.canViewLegalRightStrandComments();
	},
	canEditRightStrandComments:function(){
		return this.canEditBusinessRightStrandComments()||
			   this.canEditLegalRightStrandComments();

	},
	canDeleteRightStrandComments:function(){
		return this.canDeleteBusinessRightStrandComments()||
			   this.canDeleteLegalRightStrandComments();
	},
	canDeleteComments:function() {
		return this.canDeleteBusinessProductComments() ||
		 	   this.canDeleteLegalClearanceMemoComments()||
		 	   this.canDeleteRightStrandComments();
	},
	
	/**
	 * Determines if strands can be selected from the grid
	 */
	canSelectStrands:function() {
		return  this.canCreateStrands() ||
				this.canUpdateStrands() ||
				this.canDeleteStrands() ||
				this.canCopyStrands() ||
				this.canAdoptRightStrand();
	},
	/**
	 * Determines if the restrictions can be selected from the grid
	 */
	canSelectProductRestrictions:function() {
		return this.canCreateProductRestrictions()||
			   this.canUpdateProductRestrictions()||
			   this.canDeleteProductRestrictions()||
			   this.canAdpotProductRestrictions();
	},
	
	canCrossProductCopy: function canCrossProductCopy() {
		return this.hasCreate(this.X_PRODUCT_COPY, this.BUSINESS_DATA) || this.hasCreate(this.X_PRODUCT_COPY, this.LEGAL_DATA);
	},
	
	canCrossProductDelete: function canCrossProductDelete(){
		return this.hasDelete(this.X_PRODUCT_DELETE, this.BUSINESS_DATA) || this.hasCreate(this.X_PRODUCT_DELETE, this.LEGAL_DATA);
	},
	
	
	canUseCrossProductSidePanel:function() {
		return this.canCrossProductCopy() || this.canCrossProductDelete();
	},
	

	canUseProductSidePanel:function() {
		//This is the function for comments pannel.
		//Everyone can see comments so just return true
		return true;
	},
	
	canUpdateFoxProduced: function() {
		var can = this.hasUpdate(this.FOX_PRODUCED,this.LEGAL_DATA);
		return can;
	},
	
	canViewJobs: function() {
		return this.canUseCrossProductSidePanel();
	},
	
	
	canViewQuery:function(){
		return (this.hasRead(this.REPORT_PAGE, this.BUSINESS_DATA) || this.hasRead(this.REPORT_PAGE, this.LEGAL_DATA));
	},
	
	canUpdateQuery:function(){
		return (this.hasUpdate(this.REPORT_PAGE, this.BUSINESS_DATA) || this.hasUpdate(this.REPORT_PAGE, this.LEGAL_DATA));
	},
	
	canDeleteQuery:function(){
		return (this.hasDelete(this.REPORT_PAGE, this.BUSINESS_DATA) || this.hasDelete(this.REPORT_PAGE, this.LEGAL_DATA));
	},
	canCreatePublicQuery:function(){
		return (this.hasCreate(this.PUBLIC_QUERY, this.BUSINESS_DATA) || this.hasCreate(this.PUBLIC_QUERY, this.LEGAL_DATA));
	},
	canSyncReleaseDate : function(){
		return this.hasRead(this.SYNC_RELEASE_DATE, this.BUSINESS_DATA);
	},
	canAddOrDeleteCentralFileNumber : function(){
		return (this.hasCreate(this.CENTRAL_FILE_NO, this.LEGAL_DATA) || this.hasUpdate(this.CENTRAL_FILE_NO, this.LEGAL_DATA) || this.hasDelete(this.CENTRAL_FILE_NO, this.LEGAL_DATA));
	},
	canViewPrivateContacts : function() {
		return this.hasRead(this.CONTACTS_DETAIL,this.PRIVATE_CONTACTS);
	},
	canAssignContact : function() {
		return this.hasCreate(this.CONTACTS_ADMIN,this.LEGAL_DATA)|| this.hasCreate(this.CONTACTS_ADMIN,this.BUSINESS_DATA);
	},
	canModifyContact : function() {
		return this.hasCreate(this.CONTACTS_DETAIL, this.LEGAL_DATA)||this.hasCreate(this.CONTACTS_DETAIL, this.BUSINESS_DATA);
	},
	canSearchRightConsumptionStatus: function canSearchRightConsumptionStatus() {
		return this.hasRead(this.BUSINESS_CONFIRMATION, this.PRODUCT_SEARCH);
	},
	canUpdateFutureMedia: function() {
		return this.hasUpdate(this.FUTURE_MEDIA, this.LEGAL_DATA);
	},
	canMapCM: function canMapCM() {
		return this.hasCreate(this.CM_MAP,this.LEGAL_DATA)||this.hasCreate(this.CM_MAP,this.BUSINESS_DATA);
	},
	canViewPaidAdMemo: function canViewPaidAdMemo() {
		return this.hasRead(this.PAID_ADD_MEMO,this.LEGAL_DATA);						
	},
	
	canUpdatePaidAdMemo: function canUpdatePaidAdMemo() {
		return this.hasUpdate(this.PAID_ADD_MEMO,this.LEGAL_DATA);						
	},
	canDeletePaidAdMemo: function canDeletePaidAdMemo() {
		return this.hasDelete(this.PAID_ADD_MEMO,this.LEGAL_DATA);						
	},
	canViewAncillaryRights: function canViewAncillaryRights() {
		return this.hasRead(this.PAID_ADD_MEMO,this.LEGAL_DATA);						
	},
	
	canUpdateAncillaryRights: function canUpdateAncillaryRights() {
		return this.hasUpdate(this.PAID_ADD_MEMO,this.LEGAL_DATA);						
	},
	canViewMerchandisingTieIns: function canViewMerchandisingTieIns() {
		return this.hasRead(this.MERCHANDISING_COMMERCIAL_TIE_INS,this.LEGAL_DATA);						
	},
	canViewMerchandisingTieIns: function canViewMerchandisingTieIns() {
		return this.hasRead(this.MERCHANDISING_COMMERCIAL_TIE_INS,this.LEGAL_DATA);						
	},
	
	canUpdateMerchandisingTieIns: function canUpdateMerchandisingTieIns() {
		return this.hasUpdate(this.MERCHANDISING_COMMERCIAL_TIE_INS,this.LEGAL_DATA);						
	},
	canViewCommercialTieIns: function canViewCommercialTieIns() {
		return this.hasRead(this.COMMERICAL_TIE_INS,this.LEGAL_DATA);						
	},
	
	canUpdateCommercialTieIns: function canUpdateCommercialTieIns() {
		return this.hasUpdate(this.COMMERICAL_TIE_INS,this.LEGAL_DATA);						
	},
	
	canViewBillingBlock: function canViewBillingBlock() {
		return this.hasRead(this.BILLING_BLOCK,this.LEGAL_DATA);						
	},
	
	canUpdateBillingBlock: function canUpdateBillingBlock() {
		return this.hasUpdate(this.BILLING_BLOCK,this.LEGAL_DATA);						
	},
	
	canViewTitleCredits: function canViewTitleCredits() {
		return this.hasRead(this.TITLE_CREDITS,this.LEGAL_DATA);						
	},
	
	canUpdateTitleCredits: function canUpdateTitleCredits() {
		return this.hasUpdate(this.TITLE_CREDITS,this.LEGAL_DATA);						
	},
	canViewArtworkRestrictions: function canViewArtworkRestrictions() {
		return this.hasRead(this.ARTWORK_RESTRICTIONS,this.LEGAL_DATA);						
	},
	
	canUpdateArtworkRestrictions: function canUpdateArtworkRestrictions() {
		return this.hasUpdate(this.ARTWORK_RESTRICTIONS,this.LEGAL_DATA);						
	},
	
	canViewConfidentialTitles: function canViewConfidentialTitles() {
		return this.hasRead(this.CONFIDENTIAL_TITLES,this.PRODUCT_SEARCH);
	},
	canViewPrivateStrands: function canViewPrivateStrands() {
		return this.isAdmin();
	}
	
	
	
	
};

erm.security.setUser(erm_user);