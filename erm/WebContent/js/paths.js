 var paths=function(path) {
	
 	var BASE_PATH = "rest";
 	if (path) {
 		BASE_PATH = path;
 	}
 	
 	var TERRITORY = "Territories";
 	var PRODUCTS ="Products";
 	var PRODUCT_TYPES="productTypes";
 	var PRODDUCT_VERSION = "versions/:foxId";
 	var FOXIPEDIA_GROUPS="foxipediaGroups";
 	var MEDIA = "Media";
 	var LANGUAGE = "Language";
 	var RIGHTS = "Rights";
 	var PRODUCT_RIGHTS = "Rights/:foxVersionId";
 	var COMMENTS="Comments";
 	var COMMENTS_PRODUCT_VERSION = "comments/:foxVersionId";
 	var COMMENTS_RIGHT_STRANDS = "findCommentsForRightStrands";
	var COMMENTS_ATTACH_FILE = "attach";
	var COMMENTS_ATTACH_DELETE_FILE = "deleteAttachment/";
	var COMMENT_BY_ID="comment/";
	var COMMENTS_SAVE_CONTRACTUAL = "saveContractualComment/";	
	var COMMENTS_SAVE_CLEARANCEMEMO = "saveClearanceMemoComment/";
	var COMMENTS_SAVE_RIGHTSTRANDS = "saveRightStrandComments";
	var COMMENTS_LOAD_CM_COMMENTS = "findClearanceMemoComments/";
	var COMMENTS_LOAD_PRODUCT_COMMENTS = "findProductComments/";
	var COMMENTS_LOAD_STRAND_COMMENT_COUNT = "commentCount/";
	var COMMENTS_SAVE_PRODUCT = "saveProductComment/";
	var COMMENTS_COPY_TO_CLEARANCE = "copyCommentToCM/";
	
 	var PRODUCT_RESTRICTIONS = "restrictions/:foxVersionId";
 	var PRODUCT_DUMMY = "Rights/dummyObject";
 	var PRODUCT_VERSION_SINGLE = "Products/productVersion/:foxVersionId";
 	var PRODUCT_VERSION_TREE = "Rights/tree";
 	var PRODUCT_FROM_FOX_ID = ":foxId";
 	var PRODUCT_RIGHTS_INDICATOR = 'Products/contains/:foxVersionId';
 	var MEDIA_NODES = "mediaNodes";
 	var CODES_SERVICE="Codes";
 	var LEGAL_CONFIRMATION_STATUS = "Codes/legalConfirmationStatus";
 	var LEGAL_CONFIRMATION_STATUS_MAP = "Codes/legalConfirmationStatusMap";
 	var RIGHTS_CONSUMPTION_STATUS = "Codes/BusinessConfirmationStatus";
 	var COMMENT_STATUS = "Codes/CommentStatus"; 	 	
 	var TERRITORY_NODES = "territoryNodes";
 	var LANGUAGE_NODES = "languageNodes";
 	var RIGHT_STRAND = "rightStrand";
 	var PRODUCT_RIGHT_STRAND = ":foxVersionId";
 	var RESTRICTION_CODES = "Restrictions";
 	var RESTRICTION_CODES_SORTED_BY_CODE = "sortedByCode";
 	var TERRITORY_GROUPS = "TerritoryGroups";
 	var LANGUAGE_GROUPS = "LanguageGroup";
 	var DATE_CODE_STATUS = "date";
 	var ALL_DATE_CODES = "code";
 	var ALL_DATE_STATUS = "status";
 	var ALL_RESTRICTION_GROUPS = "group";
 	var RIGHT_STRAND_SET = "set";
 	var RIGHT_STRAND_UPDATE = "updaterightstrand";
 	var RIGHT_STRAND_ADOPT = "adoptrightstrand";
 	var PRODUCT_INFO_CODE_ADOPT = "adoptproductrestriction";
 	var CLEARANCE_MEMO_ROOT = "ClearanceMemo/";
 	var CLEARANCE_MEMO = ":foxVersionId";
 	var CLEARANCE_MEMO_PREVIEW = "preview/";
 	var CLEARANCE_MEMO_CREATE = "create/";
 	var CLEARANCE_MEMO_DELETE = "delete/";
 	var CLEARANCE_MEMO_NODE_COMMENT = "nodecomment/";
 	var CLEARANCE_MEMO_NODE_COMMENT_VERSIONS = "nodecommentVersions/";
 	var CLEARANCE_MEMO_NODE_COMMENT_ACKNOWLEDGE = "acknowledgeCommentChange";
 	
 	var CLEARANCE_MEMO_NODE_TITLE = "nodetitle/";
 	var CLEARANCE_MEMO_NODE_CREATE = "createnode/"; 	
 	var CLEARANCE_MEMO_NODE_DELETE = "deletenode/";
 	var CLEARANCE_MEMO_NODE_UPLOAD = "upload/";
 	var CLEARANCE_MEMO_NODE_MOVE = "movenode/";
 	var CLEARANCE_MEMO_NODE_LINK = "linknodes/";
 	var CLEARANCE_MEMO_MAP = "map";
 	var CLEARANCE_MEMO_UNMAP = "unMap";
 	var LAST_MODIFIED_CLASS_MAPPING = "lastModified/classMapping"; 	 	
 	var CONTRACTUAL_PARTIES = "ContractualParty/parties"; 	 
 	var FOX_ENTITIES = "ContractualParty/foxEntities";
 	var CONTACTS = "ContractualParty/contacts/";
 	var CONTACTS_PRODUCTS="ContractualParty/contactsproducts";
 	var CONTACT = "ContractualParty/contact/";
 	var SAVE_CONTACT = "ContractualParty/saveContact/";
 	var SEARCH_CONTACTS = "ContractualParty/searchContacts/";
 	var ASSIGN_CONTACT = "ContractualParty/assignContact/";
 	var SWITCH_ACCESS_OR_CONTACT_TYPE = "ContractualParty/switchAccessOrContactType/";
 	var DELETE_PRODUCT_CONTACT = "ContractualParty/deleteProductContact/";
 	var PRODUCT_CONTACTS = "ContractualParty/productContacts/";
 	var CONTRACTUAL_PARTY_TYPES = "ContractualParty/contractualPartyTypes";
 	var PARTY_TYPES = "ContractualParty/partyTypes"; 	
 	var CONTACT_TYPES = "ContractualParty/contactType";
 	var ACCESS_TYPES = "ContractualParty/accessType";
 	var ORGANIZATION_TYPES = "ContractualParty/organizationType";
 	var COUNTRIES = "ContractualParty/countries"; 	
 	var ERM_CONTRACT_LIST = "ContractualParty/ermContractList";
 	var ERM_CONTRACT_LIST_SAVE = "ContractualParty/saveErmContractList";
 	var ERM_CONTRACT_LIST_DELETE = "ContractualParty/deleteErmContractList";
 	var PRODUCT_GRANTS = "grants";
 	var PRODUCT_GRANTS_LIST = "grants/:foxVersionId";
 	var PRODUCT_GRANTS_SAVE_COMMENT = "grants/save/comment"; 	
 	var PRODUCT_GRANTS_REMOVE_COMMENT = "grants/remove/comment";
 	var PRODUCT_GRANTS_REMOVE_MULTIPLE_COMMENT = "grants/remove/multiplecomments";
 	var PRODUCT_GRANTS_GET_COMMENT = "grants/comments/:foxVersionId";
 	var PRODUCT_GRANTS_STATUS_ADD = "grants/add/status";
 	var PRODUCT_GRANTS_STATUS_EDIT = "grants/edit/status";
 	var PRODUCT_GRANTS_CODES = "codes";
 	var JOBS_ROOT = "Jobs";
 	var JOBS = "jobs";
 	var JOB_DETAILS = "detail";
 	var STOP = "stop";
 	var DELETE = "delete";
 	var ALL_JOBS_FOR_USER = "all"; 	
 	var HAS_PENDING_JOBS = "haspending";
 	var RIGHT_STRAND_COPY = "copyrightstrand";
 	var RESTRICTION_SAVE = "restrictions"; 	 	
 	var PDF_BASE = "pdfgen/";
 	var CREATE_BASELINE_PDF = "createBaselinePDF/";
 	var GET_BASELINE_VERSIONS = "getBaselineVersions/";
 	var GET_SYSTEM_X_VIEW = "SystemXClearanceMemo/";
 	var CLEARANCE_HTML = "clearanceHTML/";
 	var COMMENTS_HTML = "SystemXComments/";
 	var COMMENTS_PDF = "commentsPDF/";
 	var CLEARANCE_PDF = "clearancePDF/";
 	var REPORT = "report";
 	var REPORT_GET_ALL_REPORT_BY_USER_ID = "reports";
 	var REPORT_SAVE_QUERY_PARAMS = "query/params/save";
 	var REPORT_SAVE_QUERY = "query/save";
 	var REPORT_RUN_QUERY = "runQuery";
 	var REPORT_LOAD_SAVED_QUERY = "query/:queryId";
 	var REPORT_SEARCH_SAVED_QUERY = "query/search";
 	var REPORT_RETRIEVE_REPORT = "query/params/retrieve";
 	var REPORT_SAVED_QUERY_DELETE = "query/delete";
 	var REPORT_SAVED_QUERY_UPDATE = "query/update";
 	var UPDATE_PRODUCT="Rights/updateproduct";
 	var UPDATE_BUSINESS_CONF_STATUS="bsnsconfstatus";
 	
 	var COPYRIGHT_NOTICE = "copyright/:foxVersionId";
 	
 	var XPRODUCT_COPY = "XProduct";
 	var XPRODUCT_COPY_VALIDATE = "validate";
 	var XPRODUCT_VALIDATE_AND_COPY = "copy";
 	var XPRODUCT_DELETE = "delete";
 	
 	var SYNC_RELEASE_DATE = "sync"; ///:foxVersionId
 	var ENUM = "Enum";
 	var ENUM_ENTITIES = "getEnumEntities";
 	
 	var PRODUCT_VERSIONS_BY_FOX_VERSION_IDS = "findByFoxVersionIds";
 	var PRODUCT_METHOD_OF_TRANSMISSION = "prodMot";
 	var DATE_CODES_AND_STATUS = "dateCodesAndStatus";
 	var SAVE_PRODUCT_FILE_NUMBER = "saveProductFileNumber";
 	var DELETE_PRODUCT_FILE_NUMBER = "deleteProductFileNumber";
 	var SESSION_HEARTBEAT_CHECK = "heartbeat/check";
 	var UPDATE_RESTRICTIONS = "update";
 	var INACTIVE_TERRITORIES = "inactive/:territoryId/:isBusiness";

 	var JS = "js";
 	
 	
 	return {
 		getBase: function() {
 			if (this.base===undefined) {
 				this.base=BASE_PATH;
 			}
 			return this.base;
 		},
		getTerritoryRESTPath: function() {
			return this.getBase() + "/" + TERRITORY;
 		},
 		getProductRESTPath: function() {
 			return this.getBase() + "/" + PRODUCTS;
 		},
 		getProductVersionRESTPath: function() {
 			return this.getProductRESTPath() + "/" + PRODDUCT_VERSION;
 		},
 		getMediaRESTPath: function() {
 			return this.getBase() + "/" + MEDIA;
 		},
 		getLanguageRESTPath: function() {
 			return this.getBase() + "/" + LANGUAGE;
 		},
 		getRightsRESTPath: function() {
 			return this.getBase() + "/" + RIGHTS;
 		},
 		getProductTypesRESTPath: function() {
 			return this.getProductRESTPath() + "/" + PRODUCT_TYPES; 			
 		},
 		getProductRights: function() {
 			return this.getBase() + "/" + PRODUCT_RIGHTS;
 		},
 		getCommentsRESTPath: function() {
 			return this.getBase() + "/" + COMMENTS;
 		},
 		getCommentsProductVersionRESTPath: function() {
 			return this.getBase() + "/" + COMMENTS_PRODUCT_VERSION;
 		},
 		getCommentsRightStrandsRESTPath: function() {
 			return this.getCommentsRESTPath() + "/" + COMMENTS_RIGHT_STRANDS;
 		},
 		getCommentByIdRESTPath: function() {
 			return this.getCommentsRESTPath() + "/" + COMMENT_BY_ID; 			
 		},
 		
 		getCommentsAttachFileRESTPath: function() {
 			return this.getCommentsRESTPath() + "/" + COMMENTS_ATTACH_FILE;
 		},
 		getCommentsAttachFileDeleteRESTPath: function() {
 			return this.getCommentsRESTPath() + "/" + COMMENTS_ATTACH_DELETE_FILE;
 		},
 		getCommentsAddContractualRESTPath: function() {
 			return this.getCommentsRESTPath() + "/" + COMMENTS_SAVE_CONTRACTUAL;
 		},
 		getCommentsSaveClearanceMemoRESTPath: function() {
 			return this.getCommentsRESTPath() + "/" + COMMENTS_SAVE_CLEARANCEMEMO;
 		},
 		getCommentsSaveProductRESTPath: function() {
 			return this.getCommentsRESTPath() + "/" + COMMENTS_SAVE_PRODUCT;
 		},
 		getCopyCommentToCMRESTPath: function() {
 			return this.getCommentsRESTPath() + "/" + COMMENTS_COPY_TO_CLEARANCE;
 		}, 		
 		getCommentsSaveRightStrandRESTPath: function() {
 			return this.getCommentsRESTPath() + "/" + COMMENTS_SAVE_RIGHTSTRANDS;
 		},
 		getCommentsLoadCMCommentsRESTPath: function() {
 			return this.getCommentsRESTPath() + "/" + COMMENTS_LOAD_CM_COMMENTS;
 		},
 		getCommentsLoadProductCommentsRESTPath: function() {
 			return this.getCommentsRESTPath() + "/" + COMMENTS_LOAD_PRODUCT_COMMENTS;
 		}, 
 		getCommentsLoadStrandCommentCountRESTPath: function() {
 			return this.getCommentsRESTPath() + "/" + COMMENTS_LOAD_STRAND_COMMENT_COUNT;
 		},
 		getProductRestrictionSaveRESTPath : function(){
 			return this.getRightsRESTPath() + "/" + RESTRICTION_SAVE;
 		},
 		getProductRestrictionsRESTPath : function(){
 			return this.getRightsRESTPath() + "/" + PRODUCT_RESTRICTIONS;
 		},
 		getProductDummyRestrictions : function(){
 			return this.getBase() + "/" + PRODUCT_DUMMY;
 		},
 		getProductVersionSingleRESTPath : function(){
 			return this.getBase() + "/" + PRODUCT_VERSION_SINGLE;
 		},
 		getProductRightsIndicatorRESTPath : function(){
 			return this.getBase() + "/" + PRODUCT_RIGHTS_INDICATOR;
 		}, 		
 		getProductVersionTreeRESTPath : function(){
 			return this.getBase() + "/" + PRODUCT_VERSION_TREE;
 		},
 		getFoxipediaGroupsRESTPath: function() {
 			return this.getProductRESTPath() + "/" + FOXIPEDIA_GROUPS;
 		},
 		getFoxProductRESTPath: function() {
 			return this.getProductRESTPath() + "/" + PRODUCT_FROM_FOX_ID;
 		},
 		getFoxMediaNodesRESTPath : function(){
 			return this.getMediaRESTPath() + "/" + MEDIA_NODES;
 		},
 		getMediaNodesJsRESTPath: function() {
 			return this.getMediaRESTPath() + "/" + JS +"/" + MEDIA_NODES; 			
 		},
 		getTerritoryNodesJsRESTPath: function() {
 			return this.getTerritoryRESTPath() + "/" + JS +"/" + TERRITORY_NODES; 			
 		},
 		getAllTerritoriesJsRESTPath: function() {
 			return this.getTerritoryRESTPath() + "/" + JS +"/" + "territories";
 		},
 		getLanguageNodesJsRESTPath: function() {
 			return this.getLanguageRESTPath() + "/" + JS +"/" + LANGUAGE_NODES; 			
 		},

 		getCodesServiceRESTPath: function() {
 			return this.getBase() + "/" + CODES_SERVICE;
 		},
 		getLegalConfirmationStatusRESTPath: function() {
 			return this.getBase() + "/" + LEGAL_CONFIRMATION_STATUS;
 		},
 		getLegalConfirmationStatusMapRESTPath: function() {
 			return this.getBase() + "/" + LEGAL_CONFIRMATION_STATUS_MAP;
 		},
 		getBusinessConfirmationStatusRESTPath: function() {
 			return this.getBase() + "/" + RIGHTS_CONSUMPTION_STATUS;
 		},
 		getCommentStatusRESTPath: function() {
 			return this.getBase() + "/" + COMMENT_STATUS;
 		}, 		
 		getFoxTerritoryNodesRESTPath : function(){
 			return this.getTerritoryRESTPath() + "/" + TERRITORY_NODES;
 		},
 		getFoxLanguageNodesRESTPath : function(){
 			return this.getLanguageRESTPath() + "/" + LANGUAGE_NODES;
 		},
 		getRightStrandsRESTPath : function(){
 			return this.getBase() +"/"+ RIGHT_STRAND;
 		},
 		getRestrictionCodeRESTPath : function(){
 			return this.getBase() + "/" + RESTRICTION_CODES;
 		},
 		getRestrictionCodeSortedRESTPath : function(){
 			return this.getRestrictionCodeRESTPath() + "/" + RESTRICTION_CODES_SORTED_BY_CODE;
 		},
 		getRestricitonsJsRESTPath: function() {
 			return this.getRestrictionCodeRESTPath() + "/" + JS + "/" + RESTRICTION_CODES_SORTED_BY_CODE;			
 		},
 		
 		getTerritoryGroupRESTPath : function(){
 			return this.getBase() + "/" + TERRITORY_GROUPS;
 		},
 		getLanguageGroupRESTPath : function(){
 			return this.getBase() + "/" + LANGUAGE_GROUPS;
 		},
 		getDateCodeStatusRESTPath : function(){
 			return this.getBase() + "/" + DATE_CODE_STATUS;
 		},
 		getAllDateCodesRESTPath : function(){
 			return this.getDateCodeStatusRESTPath() + "/" + ALL_DATE_CODES;
 		},
 		getAllDateStatusRESTPath : function(){
 			return this.getDateCodeStatusRESTPath() + "/" + ALL_DATE_STATUS;
 		},
 		getAllRestrictionGroupRESTPath :function(){
 			return this.getRestrictionCodeRESTPath() + "/" + ALL_RESTRICTION_GROUPS;
 		},
 		getProductRightStrandRESTPath : function(){
 			return this.getRightStrandsRESTPath() + "/" + PRODUCT_RIGHT_STRAND;
 		},
 		getRightStrandSetRESTPath : function(){
 			return this.getRightStrandsRESTPath() + "/" + RIGHT_STRAND_SET;
 		},
 		getRightStrandUpdateRESTPath : function(){
 			return this.getRightStrandsRESTPath() + "/" + RIGHT_STRAND_UPDATE;
 		}, 		
 		getClearanceMemoRootRESTPath : function() { 			
 			return this.getBase() +"/"+ CLEARANCE_MEMO_ROOT;
 		}, 		
 		getRightStrandAdoptRESTPath : function(){
 			return this.getRightStrandsRESTPath() + "/" + RIGHT_STRAND_ADOPT;
 		},
 		getProductInfoCodeAdoptRESTPath : function(){
 			return this.getRightsRESTPath() + "/" + PRODUCT_INFO_CODE_ADOPT;
 		},
 		getClearanceMemoPreviewRESTPath : function() { 			
 			return this.getClearanceMemoRootRESTPath() + CLEARANCE_MEMO_PREVIEW;
 		},
 		getClearanceMemoRESTPath : function() { 			
 			return this.getClearanceMemoRootRESTPath() + CLEARANCE_MEMO;
 		},
 		getClearanceMemoNodeCommentRESTPath : function() { 			
 			return this.getClearanceMemoRootRESTPath() + CLEARANCE_MEMO_NODE_COMMENT;
 		},
 		getClearanceMemoNodeCommentVersionsRESTPath : function() { 			
 			return this.getClearanceMemoRootRESTPath() + CLEARANCE_MEMO_NODE_COMMENT_VERSIONS;
 		},
 		getClearanceMemoNodeAcknowledgeRESTPath : function() { 			
 			return this.getClearanceMemoRootRESTPath() + CLEARANCE_MEMO_NODE_COMMENT_ACKNOWLEDGE;
 		},
 		getClearanceMemoNodeTitleRESTPath : function() { 			
 			return this.getClearanceMemoRootRESTPath() + CLEARANCE_MEMO_NODE_TITLE;
 		},
 		getClearanceMemoNodeCreateRESTPath : function() { 			
 			return this.getClearanceMemoRootRESTPath() + CLEARANCE_MEMO_NODE_CREATE;
 		},
 		getClearanceMemoNodeDeleteRESTPath : function() { 			
 			return this.getClearanceMemoRootRESTPath() + CLEARANCE_MEMO_NODE_DELETE;
 		},
 		getClearanceMemoNodeUploadRESTPath : function() { 			
 			return this.getClearanceMemoRootRESTPath() + CLEARANCE_MEMO_NODE_UPLOAD;
 		}, 		
 		getClearanceMemoNodeMoveRESTPath : function() {
 			return this.getClearanceMemoRootRESTPath() + CLEARANCE_MEMO_NODE_MOVE;
 		},
 		getClearanceMemoNodeLinkRESTPath : function() {
 			return this.getClearanceMemoRootRESTPath() + CLEARANCE_MEMO_NODE_LINK;
 		},
 		getClearanceMemoMapRESTPath : function() {
 			return this.getClearanceMemoRootRESTPath() + CLEARANCE_MEMO_MAP;
 		},
 		getClearanceMemoUnMapRESTPath : function() {
 			return this.getClearanceMemoRootRESTPath() + CLEARANCE_MEMO_UNMAP;
 		}, 		
 		getClearanceMemoCreateRESTPath : function() {
 			return this.getClearanceMemoRootRESTPath() + CLEARANCE_MEMO_CREATE;
 		},
 		getClearanceMemoDeleteRESTPath : function() {
 			return this.getClearanceMemoRootRESTPath() + CLEARANCE_MEMO_DELETE;
 		},
 		getProductGrantsRESTPath : function(){
 			return this.getBase() +"/"+ PRODUCT_GRANTS;
 		},
 		getProductGrantsListRESTPath : function(){
 			return this.getProductGrantsRESTPath() + "/" + PRODUCT_GRANTS_LIST;
 		},
 		getProductGrantsAddCommentRESTPath : function(){
 			return this.getProductGrantsRESTPath() + "/" + PRODUCT_GRANTS_SAVE_COMMENT;
 		},
 		getProductGrantsEditCommentRESTPath : function(){
 			return this.getProductGrantsRESTPath() + "/" + PRODUCT_GRANTS_SAVE_COMMENT;
 		}, 
 		getProductGrantsDeleteCommentRESTPath : function(){
 			return this.getProductGrantsRESTPath() + "/" + PRODUCT_GRANTS_REMOVE_COMMENT;
 		},
 		getProductGrantsDeleteMultipleCommentsRESTPath : function(){
 			return this.getProductGrantsRESTPath() + "/" + PRODUCT_GRANTS_REMOVE_MULTIPLE_COMMENT;
 		},
 		getProductGrantsGetCommentRESTPath : function(){
 			return this.getProductGrantsRESTPath() + "/" + PRODUCT_GRANTS_GET_COMMENT;
 		},
 		getProductGrantsAddStatusRESTPath : function(){
 			return this.getProductGrantsRESTPath() + "/" + PRODUCT_GRANTS_STATUS_ADD;
 		},
 		getCPFoxEntitiesRESTPath : function() {
 			return this.getBase() + "/" + FOX_ENTITIES;
 		},
 		getAllContactsRESTPath : function() {
 			return this.getBase() + "/" + CONTACTS;
 		},
 		getAllContactsFromProductsRESTPath: function() {
 			return this.getBase() + "/" + CONTACTS_PRODUCTS; 			
 		},
 		
 		getContactRESTPath : function() {
 			return this.getBase() + "/" + CONTACT;
 		},
 		getSaveContactRESTPath : function() {
 			return this.getBase() + "/" + SAVE_CONTACT;
 		}, 	 		 
 		getAssignContactRESTPath : function() {
 			return this.getBase() + "/" + ASSIGN_CONTACT;
 		},
 		getSearchContactsRESTPath : function() {
 			return this.getBase() + "/" + SEARCH_CONTACTS;
 		},
 		getSwitchAccessOrContactTypeRESTPath : function() {
 			return this.getBase() + "/" + SWITCH_ACCESS_OR_CONTACT_TYPE;
 		}, 		 		 		
 		getDeleteProductContactRESTPath : function() {
 			return this.getBase() + "/" + DELETE_PRODUCT_CONTACT;
 		}, 		 		
 		getProductContactsRESTPath : function() {
 			return this.getBase() + "/" + PRODUCT_CONTACTS;
 		}, 		 		
 		getContractualPartiesRESTPath : function() {
 			return this.getBase() + "/" + CONTRACTUAL_PARTIES;
 		},
 		getLastModifiedClassMappingRESTPath : function() {
 			return this.getBase() + "/" + LAST_MODIFIED_CLASS_MAPPING;
 		}, 		 		 	
 		getContractualPartyTypesRESTPath : function() {
 			return this.getBase() + "/" + CONTRACTUAL_PARTY_TYPES;
 		},
 		getPartyTypesRESTPath : function() {
 			return this.getBase() + "/" + PARTY_TYPES;
 		},
 		getContactTypesRESTPath : function() {
 			return this.getBase() + "/" + CONTACT_TYPES;
 		},
 		getAccessTypesRESTPath : function() {
 			return this.getBase() + "/" + ACCESS_TYPES;
 		}, 		
 		getOrganizationTypesRESTPath : function() {
 			return this.getBase() + "/" + ORGANIZATION_TYPES;
 		},
 		getCountriesRESTPath : function() {
 			return this.getBase() + "/" + COUNTRIES;
 		}, 	 	
 		getContractualPartyErmContractListRESTPath: function() { 			
 			return this.getBase() + "/" + ERM_CONTRACT_LIST;
 		},
 		getContractualPartySaveErmContractListRESTPath: function() { 			
 			return this.getBase() + "/" + ERM_CONTRACT_LIST_SAVE;
 		},
 		getContractualPartyDeleteErmContractListRESTPath: function() { 			
 			return this.getBase() + "/" + ERM_CONTRACT_LIST_DELETE;
 		}, 		 		
 		getProductGrantsEditStatusRESTPath : function(){
 			return this.getProductGrantsRESTPath() + "/" + PRODUCT_GRANTS_STATUS_EDIT;
 		},
 		getJobsRESTPath: function() {
 			return this.getBase() + "/" + JOBS_ROOT;
 		}, 		
 		getPendingJobsRESTPath: function() {
 			return this.getJobsRESTPath() + "/" + JOBS;
 		},
 		getAllJobsForUserRESTPath: function() {
 			return this.getPendingJobsRESTPath() + "/" + ALL_JOBS_FOR_USER;
 		},
 		getJobDetailRESTPath: function() { 			                                      
 			return this.getJobsRESTPath() + "/" + JOB_DETAILS;
 		},
 		getDeleteJobRESTPath: function() {
 			return this.getJobsRESTPath() +"/" + DELETE;
 		},
 		getStopJobRESTPath: function() {
 			return this.getJobsRESTPath() + "/" + STOP;
 		},
 		getHasPendingJobsRESTPath: function() {
 			return this.getJobsRESTPath() + "/" + HAS_PENDING_JOBS;
 		},
 		getCopyRightStrandRESTPath: function(){
 			return this.getRightStrandsRESTPath() + "/" + RIGHT_STRAND_COPY;
 		}, 		
 		getPDFBaseRESTPath: function() {
 			return this.getBase() + "/" + PDF_BASE;
 		}, 		
 		getCreateBaselinePDFRESTPath: function() {
 			return this.getPDFBaseRESTPath() + CREATE_BASELINE_PDF;
 		},
 		getBaselineVersionsRESTPath: function() {
 			return this.getPDFBaseRESTPath() + GET_BASELINE_VERSIONS;
 		},
 		getSystemXClearanceRESTPath: function() {
 			return this.getPDFBaseRESTPath() + GET_SYSTEM_X_VIEW;
 		}, 		
 		getClearanceHTMLRESTPath: function() {
 			return this.getPDFBaseRESTPath() + CLEARANCE_HTML;
 		},
 		getCommentsHTMLRESTPath: function() {
 			return this.getPDFBaseRESTPath() + COMMENTS_HTML;
 		},
 		getCommentsPDFRESTPath : function() {
 			return this.getPDFBaseRESTPath() + COMMENTS_PDF;
 		},
 		getClearancePDFRESTPath: function() {
 			return this.getPDFBaseRESTPath() + CLEARANCE_PDF;
 		},
 		getBaseReportRESTPath : function(){
 			return this.getBase() + "/" + REPORT;
 		},
 		getAllReportByUserIdRESTPath : function(){
 			return this.getBaseReportRESTPath() + "/" + REPORT_GET_ALL_REPORT_BY_USER_ID;
 		},
 		getReportByReportIdRESTPath : function(){
 			return this.getBaseReportRESTPath() + "/" + REPORT_RETRIEVE_REPORT;
 		},
 		getSaveQueryParamsRESTPath : function(){
 			return this.getBaseReportRESTPath() + "/" + REPORT_SAVE_QUERY_PARAMS;
 		},
 		getCopyrightNoticeRESTPath: function() {
 			return this.getBase() + "/" + COPYRIGHT_NOTICE;
 		},
 		getSaveQueryRESTPath : function(){
 			return this.getBaseReportRESTPath() + "/" + REPORT_SAVE_QUERY;
 		},
 		getXProductCopyRESTPath: function() {
 			return this.getBase() + "/" + XPRODUCT_COPY;
 		}, 	 	
 	 	getXProductCopyValidateRESTPath: function () {
 	 		return this.getXProductCopyRESTPath() + "/" + XPRODUCT_COPY_VALIDATE;
 	 	},
 	 	getXProductDeleteRESTPath: function() {
 	 		return this.getXProductCopyRESTPath() + "/" + XPRODUCT_DELETE; 	 		
 	 	},
 	 	getXProductCopyValidateAndCopyRESTPath: function() {
 	 		return this.getXProductCopyRESTPath() + "/" + XPRODUCT_VALIDATE_AND_COPY; 	 		
 	 	}, 	 	
 	 	getRunQueryRESTPath : function(){
 			return this.getBaseReportRESTPath() + "/" + REPORT_RUN_QUERY;
 		},
 		getSavedQueryRESTPath : function(){
 			return this.getBaseReportRESTPath() + "/" + REPORT_LOAD_SAVED_QUERY;
 		},
 		getSearchSavedQueryRESTPath : function(){
 			return this.getBaseReportRESTPath() + "/" + REPORT_SEARCH_SAVED_QUERY;
 		},
 		getSyncReleaseDateRESTPath : function(){
 			return this.getRightStrandsRESTPath() + "/" + SYNC_RELEASE_DATE;
 		},
 		getEnumBaseRESTPath : function() {
 			return this.getBase() + "/" + ENUM;
 		},
 		getProductVersionsByFoxVersionIds : function(){
 			return this.getProductRESTPath() + "/" + PRODUCT_VERSIONS_BY_FOX_VERSION_IDS;
 		},
 		getSavedQueryDeleteRESTPath : function(){
 			return this.getBaseReportRESTPath() + "/" + REPORT_SAVED_QUERY_DELETE;
 		},
 		getEnumEntitiesRESTPath : function() {
 			return this.getEnumBaseRESTPath() + "/" + ENUM_ENTITIES;
 		},
 		getSavedQueryUpdateRESTPath : function(){
 			return this.getBaseReportRESTPath() + "/" + REPORT_SAVED_QUERY_UPDATE;
 		}, 
 		getAllActiveGrantCodeRESTPath : function(){
 			return this.getProductGrantsRESTPath() + "/" + PRODUCT_GRANTS_CODES;
 		},
 		getProductMethodOfTransmissionRESTPath : function(){
 			return this.getCodesServiceRESTPath() + "/" + PRODUCT_METHOD_OF_TRANSMISSION;
 		},
 		getUpdateBusinessConfirmationStatusRESTPath: function() {
 			return this.getBase() + "/" + UPDATE_PRODUCT   + "/" + UPDATE_BUSINESS_CONF_STATUS;
 		},
 		getDateCodesAndStatusRESTPath: function() {
 			return this.getCodesServiceRESTPath() + "/" +  JS + "/" + DATE_CODES_AND_STATUS; 			
 		},
 		getAllMediaJsRESTPath: function() {
 			return this.getMediaRESTPath() + "/" + JS +"/" + "media"; 			
 		},
 		getAllLnaguagesJsRESTPath: function() {
 			return this.getLanguageRESTPath() + "/" + JS +"/" + "language"; 			
 		},
 		getSaveProductFileNumber: function(){
 			return this.getProductRESTPath() + "/" + SAVE_PRODUCT_FILE_NUMBER;
 		},
 		getDeleteProductFileNumber: function(){
 			return this.getProductRESTPath() + "/" + DELETE_PRODUCT_FILE_NUMBER;
 		},
 		getSessionHeartBeatCheck: function(){
 			return this.getBase()+"/"+SESSION_HEARTBEAT_CHECK;
 		},
 		getUpdateRestrictionsRESTPath: function(){
 			return this.getRestrictionCodeRESTPath() + "/" + UPDATE_RESTRICTIONS;
 		},
 		getInactiveTerritoryRESTPath : function(){
 			return this.getTerritoryRESTPath() + "/" + INACTIVE_TERRITORIES;
 		}
 		
 	};
 };
