
var productsSearchPopUpWindow = null;
var selectContactToAddWindow = null;
var editContactWindow = null;
var searchContactsWindow = null;
var jobsWindow = null;
var reportsWindow = null;

app.controller('MainController',function MainController($rootScope,$scope,$window) {
	$scope.renderTemplates = function renderTemplates() {
		console.log("Rendering templates");
		renderTemplateObject.renderTemplate('errorWindow', {},$('#errorPopupWindow'));
		//TODO rename this div it should not be 'testXXXXX'
		renderTemplateObject.renderTemplate('addEditInfoCodeDates', {},$('#test2_addEditInfoCodeWindow'));
		renderTemplateObject.renderTemplate('rightStrandEditPopupWindow', {},$('#sse_rightStrandPopupWindow'));
		renderTemplateObject.renderTemplate('addEditClearanceMemo', {},$('#template_addEditClearanceMemo'));																					
		renderTemplateObject.renderTemplate('commentsAndAttachments', {}, $('#template_addCommentsAndAttachments'));
		renderTemplateObject.renderTemplate('confirmationPopup', {}, $('#commentsAndAttachmentPopupWindow'));
		renderTemplateObject.renderTemplate('copyRightStrand', {}, $('#crs_rightStrandCopyPopupWindow'));
		renderTemplateObject.renderTemplate('createRightStrand', {}, $('#cre_rightStrandCreatePopupWindow'));
	};	
	
	$rootScope.$on("$routeChangeStart", function (event, current, previous, rejection) {
		gridStrandsConfigurator.clear();
	});	
	$scope.user=$window.erm_user;
	
	// THE FOLLOWING ARE LOADED FROM STATIC JS CACHE
	$scope.foxEntities;
	$scope.foxEntitiesMap;
	$scope.contractualParties;
	$scope.contractualPartiesMap;
	$scope.contractualPartyTypes;	
	$scope.contractualPartyTypesMap;
	$scope.partyTypes;	
	$scope.partyTypesMap;
	$scope.productTypes;
	$scope.productTypesMap;
	$scope.contactTypes;
	$scope.contactTypesMap;
	$scope.accessTypes;
	$scope.accessTypesMap;
	$scope.organizationTypes;
	$scope.organizationTypesMap;
	$scope.countriesMap;
		
	$scope.showGetStartedMenu = document.URL.indexOf("rights") > 0 ? false : true;
	
	$scope.ermAppVersion = ermAppVersion;
	$scope.ermMajorVersion = ermMajorVersion;
	
	$scope.popReportsController = function() {		
	  if (reportsWindow == null) {
		reportsWindow = $("#reportController").kendoWindow({	  
		  width: "90%",
		  height : "600px",
		  minWidth : "1400px",
		  minHeight : "600px",
		  title: "Enterprise Rights Management Reports",
		  actions: ["Maximize","Close"],
		  visible : false,
		  open: function(e) {
			renderTemplateObject.renderTemplate('reportManagement', {}, $('#rep_reportQueryManagementPopupWindow'));
			renderTemplateObject.renderTemplate('reportSaveQueryPopup', {}, $('#rep_saveReportPopupWindow'));
			renderTemplateObject.renderTemplate('reportSearchSavedQuery', {}, $('#rep_searchReportPopupWindow'));
			renderTemplateObject.renderTemplate('errorWindow', {},$('#errorPopupWindow'));
			renderTemplateObject.renderTemplate('successWindow', {}, $('#successPopupWindow'));
			rep_reportManagementObject.initializeElements();
			errorPopup.init();
			successPopup.init();
		  },
		  close: function(e) {   
		  }  		  
		}).data("kendoWindow");		  		 
	  }
	  if(reportsWindow){
		reportsWindow.setOptions({
		  modal : true	    
	    });
	    reportsWindow.center();
	    reportsWindow.open();
	  }  	
	};
	
	$scope.showHelpMenu = function () {	  
	  var mainScope = angular.element(document.getElementById("mainController")).scope();
	  mainScope.showGetStartedMenu = !mainScope.showGetStartedMenu;
	  var resultsScope = angular.element(document.getElementById("erm-product-search-results")).scope();
	  resultsScope.doHideSearchResults();
	  if (mainScope.showGetStartedMenu) {
	    $(".rightsController").animate({ opacity: 0 },50);
	    $(".ermSidePanelOuter").animate({ opacity: 0 },50);
	  } else {
		$(".rightsController").animate({ opacity: 1 },50);
		$(".ermSidePanelOuter").animate({ opacity: 1 },50);
	  }
	};
	
	$scope.popJobsController = function () {
	  var jobsScope = angular.element(document.getElementById("jobsController")).scope();
	  jobsScope.getPendingJobs();	  
	  if (jobsWindow == null) {
		jobsWindow = $("#jobsController").kendoWindow({	  
	      width: "90%",
	      height : "600px",
	      minWidth : "600px",
	      minHeight : "600px",
	      title: "My Jobs",
	      actions: ["Maximize","Close"],
	      visible : false,
	      open: function(e) {		        		        
	  	  },
	      close: function(e) {   
	      }  		  
		}).data("kendoWindow");		  		 
	  }
	  if(jobsWindow){
		jobsWindow.setOptions({
		  modal : true	    
		});
		jobsWindow.center();
		jobsWindow.open();
	  }  
	};		
	
	$scope.toggleERMContent = function (shrink) {
		if (shrink) {		  
		  $("#erm-content").animate({width:'74.5%'},500);
		  $("button").css("font-size", "9px");
		  $("#ermSideClearanceAcknowledge").css("font-size", "12px");
		  $("#ermSideClearanceMap").css("font-size", "11px");
		  $("#ermSideClearanceUnmap").css("font-size", "11px");
		  $("#ermSideClearanceShowMapped").css("font-size", "11px");		  
		  $("#ermSideClearanceShowMappedStrands").css("font-size", "11px");		  
		} else {
		  $("#erm-content").animate({width:'100%'},500);
		  $("button").css("font-size", "12px");
		}
	};
	
	$scope.openERMSidePanel = function() {
		var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();				
		if (!ermSidePanelScope.isERMSidePanelOut)
		  $scope.toggleERMSidePanel();			
	};
	
	$scope.closeERMSidePanel = function closeERMSidePanel() {
		var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();				
		if (ermSidePanelScope.isERMSidePanelOut)
		  $scope.toggleERMSidePanel();			
	};
	
	
	$scope.toggleERMSidePanel= function() {
		//console.log("Inside toggleERMSidePanel");
		var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();
		var rcscope = angular.element(document.getElementById("rightsController")).scope();
		ermSidePanelScope.isERMSidePanelOut = !ermSidePanelScope.isERMSidePanelOut;
		var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
		if (ermSidePanelScope.isERMSidePanelOut) {
		  //$(".searchTypes").animate({width:'24%'},500);
		  $scope.toggleERMContent(true);
		  $(".ermSidePanelItems").animate({width:'0%'},500);	
//		  rcscope.productHeaderShow = false;
//		  rcscope.rightStrandsShow = true;		  
		  $(".ermSidePanelOuter").css("display", "none");		  		  
		  $(".ermSidePanelItems").animate({width:'25.5%'},500);
		  $(".ermSidePanelChevron").removeClass("icon-chevron-left");
		  $(".ermSidePanelChevron").addClass("icon-chevron-right");	
		  //TMA BUG 46855
		  //$("#productSearchController").css("display", "none");
		  $("#productSearchController").css("display", "block");
		  $('.ermSideClearanceTOCSelectArea').scrollTop(0);
		  //strands.toggleMapUnMapAndStrandComments();		  		  
		  $('.crossProductPanel').css("max-height", (h - 175));
		  $('#right_strands_div').css("max-height", (h - 175));		  
		} else {
		  $scope.toggleERMContent(false);
		  //rcscope.productHeaderShow = true;
		  //rcscope.rightStrandsShow = false;
		  $("#productSearchController").css("display", "block");
		  $(".ermSidePanelOuter").css("display", "block");
		  $(".ermSidePanelItems").animate({width:'0%'},500);		  		  			  
		  $(".ermSidePanelChevron").removeClass("icon-chevron-right");
		  $(".ermSidePanelChevron").addClass("icon-chevron-left");		  
		  $('.crossProductPanel').css("max-height", (h - 175));
		  $('#right_strands_div').css("max-height", "none");
		}
	};
	
	$scope.sortObject = function (resultVal) {		
		selectOptions = [];
		angular.forEach(resultVal, function(value, key) {
		    selectOptions.push({
		        key: value,
		        label: key
		    });
		});
		return selectOptions;		
	};
	
	$scope.setDynamic = function() {
	  // THE FOLLOWING ARE LOADED FROM STATIC JS CACHE
	  $scope.foxEntities = erm.dbvalues.foxEntities;
	  $scope.foxEntitiesMap = erm.dbvalues.foxEntitiesMap;
	  $scope.contractualParties = erm.dbvalues.contractualPartiesDisplay;
	  $scope.contractualPartiesMap = erm.dbvalues.contractualPartiesMap;
	  $scope.contractualPartyTypes = erm.dbvalues.contractualPartyTypes;
	  $scope.contractualPartyTypesMap = erm.dbvalues.contractualPartyTypesMap;
	  $scope.partyTypes = erm.dbvalues.partyTypes;
	  $scope.partyTypesMap = erm.dbvalues.partyTypesMap;	  
	  $scope.productTypes = erm.dbvalues.productTypes;
	  $scope.productTypesMap = erm.dbvalues.productTypesMap;
	  $scope.contactTypes = erm.dbvalues.contactTypes;
	  $scope.contactTypesMap = erm.dbvalues.contactTypesMap;	  
	  $scope.accessTypes = erm.dbvalues.accessTypes;
	  $scope.accessTypesMap = erm.dbvalues.accessTypesMap;	  
	  $scope.organizationTypes = erm.dbvalues.organizationTypes;
	  $scope.organizationTypesMap = erm.dbvalues.organizationTypesMap;
	  $scope.countriesMap = $scope.sortObject(erm.dbvalues.countriesMap);	  
	  //console.log("$scope.countriesMap %o", $scope.sortObject(erm.dbvalues.countriesMap));
	};
	
	/**
	 * Determines is the user logged in is a business user
	 */
	$scope.isBusinessUser = function() {
		return true;
	};
	
	/**
	 * Determines if the user logged in is a legal user
	 */
	$scope.isLegalUser = function() {
		return false;
	};
	
	$(".closeModalProductsForReport").unbind();				  			
	$(".closeModalProductsForReport").click(function(){
		var psc = erm.scopes.search();
		//should not clear targets in copy. Originally it was always but copy also uses it so can not clear it always
		var shouldClearTargets = true;
		if (psc.productSearch.isCopySearch) {
			shouldClearTargets = false;			
		}
		$("#productSearchController").data("kendoWindow").close();
		$(".closeModalProductsForReport").hide();
		if (shouldClearTargets) {
			psc.clearCrossProductTargets();
		}
	});
		
	$("#closeModalProducts").unbind();				  			
	$scope.closeModalProductsButton = $("#closeModalProducts").click(function(event){
	  if(productsSearchPopUpWindow){
		productsSearchPopUpWindow.close();	
	  }  
	});
	
	$scope.restoreSearch = function(){
		setTimeout(function(){
		$("#productSearchController").removeClass("k-window-content");
		$("#productSearchController").removeClass("k-content");
		var oldproductSearchController = $("#productSearchController").detach();
			  oldproductSearchController.insertBefore($("#getStartedController"));
		}, 100);
	};
	
	$scope.setUpSearchButton = function(event){
	  event.preventDefault();	  
	  //console.log("Clicked setSearchForTargetProductsButton");
	  var psscope = angular.element(document.getElementById("productSearchController")).scope();
	  psscope.productSearch.clear();
	  psscope.productSearch.productSearchCompleted=false;
	  psscope.productSearch.searchExecuted=false;
	  $(".crossProductSubmit").hide();	  
	  if (productsSearchPopUpWindow == null)
	    $scope.initializeSearchPopUpWindow();
	  else {
	    $("#productSearchController").addClass("k-window-content");
	    $("#productSearchController").addClass("k-content");
	  }
	  if(productsSearchPopUpWindow){
		productsSearchPopUpWindow.setOptions({
		  modal : true	    
	    });
		productsSearchPopUpWindow.center();
		productsSearchPopUpWindow.open();
	  }           	     
	};
	
	$scope.initializeSearchPopUpWindow = function(){
	  //console.log("------- INSIDE initializeSearchPopUpWindow ---------------");
	  var psscope = angular.element(document.getElementById("productSearchController")).scope();	  
	  psscope.crossProduct.source = null;
	  psscope.crossProduct.targets = [];
	  if (psscope.$root.$$phase != '$apply' && psscope.$root.$$phase != '$digest')
		psscope.$apply();
	  var resultsScope = angular.element(document.getElementById("erm-product-search-results")).scope();	  
	  if (productsSearchPopUpWindow == null) {
		productsSearchPopUpWindow = $("#productSearchController").kendoWindow({	  
          width: "1400px",
          height : "750px",
          minWidth : "1400px",
          minHeight : "750px",
          title: "Product Search",
          actions: ["Maximize","Close"],
          visible : false,
          open: function(e) {
        	  console.log(" PSSCOPE : %o", psscope.productSearch);
        	     		
    		psscope.productSearch.isAdvancedSearchCollapsed = false;
    		psscope.productSearch.isModal = true;
        	psscope.productSearch.isCrossProduct = false;
//        	psscope.productSearch.isCopySearch = false;
        	psscope.toggleCrossProduct();
        	$(".closeModalProductsForReport").show();
  			$(".mainNavigation").addClass("hideControls");
  			$(".switchToBasicSearch").addClass("hideControls");
  			$(".hideSearchResultsLink").addClass("hideControls");
  			$(".crossProduct").addClass("hideControls");
  			$("#advancedSearchOptions").css("display", "none");
  			// setup cross product operations
  			$(".crossProductInstructions").css("display", "none");
  			$(".crossProductModalInstructions").css("display", "block");  			
  			$(".crossProductTabs").css("display", "none");
  			$(".crossProductSourceButton").css("display", "none");
  			$(".crossProductSourceInput").css("display", "none");
  			$(".removeCrossProductTarget ").css("display", "none");
  			$(".clearCrossProductTargets ").css("display", "none"); 
  			//AMV commented out this is making the options to show when they should not show
//  			$(".crossProductCopyOption").css("display", "none");
  			$("#submitCrossProductCopy").css("display", "none");
  			$(".panel").css("border-top", "1px solid rgb(221, 221, 221)");
  			$(".crossProductTargetsArea").css("height", "400px");
  			$(".crossProductTargetsArea").css("max-height", "400px");
  			$(".crossProductItems").css("width", "23%");
  			$(".crossProductItems").css("padding-left", "0");  			
  			$(".crossProductItems").css("right", "1%");
  			
  			if (!psscope.productSearch.productSearchCompleted)
  			  $(".productResults").addClass("productResultsModal");
  			$("#selectModalProducts").addClass("forceShow");
            $("#closeModalProducts").addClass("forceShow");
  			
  			resultsScope.results.showCheckboxes = true;			  			
  			resultsScope.results.crossProductCheckAll = false;
  			var crossProductCheckboxes = $(".cross-product-checkbox");  			  	
  			if (crossProductCheckboxes != null) {
			  for (var index = 0; index < crossProductCheckboxes.length; index++) {			  
			    crossProductCheckboxes[index].checked = false;				    	    			
			  }
			}
  			var oldproductSearchController = $("#productSearchController").detach();
  			oldproductSearchController.insertAfter($("#productSearchController_wnd_title").parent());
  			if (psscope.$root.$$phase != '$apply' && psscope.$root.$$phase != '$digest')
   			   psscope.$apply();  
  			if (resultsScope.$root.$$phase != '$apply' && resultsScope.$root.$$phase != '$digest')
  				resultsScope.$apply();
  			$(".searchResultsProductTitle").addClass("disableLink");  			  			
  			$('.searchResultsProductTitle').attr('disabled', true);
  		  },
          close: function(e) {   
        			 
        	psscope.productSearch.productSearchCompleted = false;
        	psscope.productSearch.searchExecuted = false;
        	psscope.productSearch.searchInProgress = false;		 
        	psscope.productSearch.errorMessage = null;
        	
            psscope.productSearch.isAdvancedSearchCollapsed = true;
            psscope.productSearch.isModal = false;
        	psscope.productSearch.isCrossProduct = true;
          	psscope.toggleCrossProduct(); 
          	psscope.crossProduct.targets = [];
          	
          	psscope.doClearCriteria();
          	
          	$(".mainNavigation").removeClass("hideControls");
            $(".switchToBasicSearch").removeClass("hideControls");
            $(".hideSearchResultsLink").removeClass("hideControls");
            $(".crossProduct").removeClass("hideControls");
            $("#advancedSearchOptions").css("display", "");
            // setup cross product operations
            $(".closeModalProductsForReport").css("display", "none");
            $(".crossProductInstructions").css("display", "");
  			$(".crossProductModalInstructions").css("display", "none");
  			$(".crossProductTabs").css("display", "");
  			$(".crossProductSourceButton").css("display", "");
  			$(".crossProductSourceInput").css("display", "");
  			$(".removeCrossProductTarget ").css("display", "");
  			$(".clearCrossProductTargets ").css("display", "");
  			//AMV commented out this is making the options to show when they should not show  			
//  			$(".crossProductCopyOption").css("display", "");
  			$("#submitCrossProductCopy").css("display", "");  	
  			$(".panel").css("border-top", "1px none");
  			$(".crossProductTargetsArea").css("height", "auto");
  			$(".crossProductTargetsArea").css("max-height", "225px"); 
  			$(".crossProductItems").css("padding-left", "");  		
  			$(".crossProductItems").css("width", "23%");
  			$(".crossProductItems").css("right", "1%");
  			$(".productResults").removeClass("productResultsModal");
            $("#selectModalProducts").removeClass("forceShow");
  			$("#closeModalProducts").removeClass("forceShow");
  			$(".closeModalProductsForReport").hide();
  			resultsScope.results.showCheckboxes = false;
  			resultsScope.results.crossProductCheckAll = false;
  			var crossProductCheckboxes = $(".cross-product-checkbox");  			  	
  			if (crossProductCheckboxes != null) {
			  for (var index = 0; index < crossProductCheckboxes.length; index++) {			  
			    crossProductCheckboxes[index].checked = false;				    	    			
			  }
			}  			
  			var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();				
  			ermSidePanelScope.isERMSidePanelOut = true;
  			console.log("toggleERMSidePanel ");
  			$scope.toggleERMSidePanel();	
  			if (psscope.$root.$$phase != '$apply' && psscope.$root.$$phase != '$digest') { 
  			   psscope.$apply();  
  			}
            $(".searchResultsProductTitle").removeClass("disableLink");
            $(".searchResultsProductTitle").attr("disabled", false);
          }  		  
        }).data("kendoWindow");
		$(productsSearchPopUpWindow).focus();
	  }	  	 
	};	
	
	
	/**
	 * 
	 * @param longDate
	 * @returns
	 */
	$scope.getCustomDisplayDate = function getCustomDisplayDate(longDate){
		var m = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		if(longDate != null){
			var d = new Date(longDate);
			var day = d.getDate();
			var month = d.getMonth();
			var year = d.getFullYear();
			
			var dday = ""+day;
			if(day < 10){
				dday = "0"+day;
			}
			return dday+"-"+m[month]+"-"+year;
		}
		return null;
	};
	
	/**
	 * 
	 * @param longDate
	 * @returns
	 */
	$scope.getCustomDisplayDateWithTime = function getCustomDisplayDateWithTime(longDate){
		var m = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		if(longDate){
			var d = new Date(longDate);
			var day = d.getDate();
			var month = d.getMonth();
			var year = d.getFullYear();
			
			var hour = d.getHours();
		    hour = (hour < 10 ? "0" : "") + hour;

		    var min  = d.getMinutes();
		    min = (min < 10 ? "0" : "") + min;
			
			var dday = ""+day;
			if(day < 10){
				dday = "0"+day;
			}
			
			var amPM = (hour > 11) ? "PM" : "AM";
			return dday+"-"+m[month]+"-"+year+" "+hour+":"+min+" "+amPM;
		}
		return null;
	};
	
	//this holds variables to show/hide buttons based on security constraints
	$scope.security = {
			isBusiness : erm.security.isBusiness(),			
			isInquiryUser : erm.security.isInquiryUser(),
			canCreateStrands:  erm.security.canCreateStrands(),
			canDeleteBusinessStrands: erm.security.canDeleteBusinessStrands(),
			canDeleteLegalStrands: erm.security.canDeleteLegalStrands(),
			canDeleteStrands:erm.security.canDeleteStrands(),
			canCopyBusinessStrands: erm.security.canCopyBusinessStrands(),
			canCopyLegalStrands: erm.security.canCopyLegalStrands(),
			canUpdateDoNotLicense : erm.security.canUpdateDoNotLicense(),
			canUpdateLegalStrands: erm.security.canUpdateLegalStrands(),
			canUpdateBusinessStrands: erm.security.canUpdateBusinessStrands(),						
			canCopyBusinessProductRestrictions: erm.security.canCopyBusinessProductRestrictions(),
			canCopyLegalProductRestrictions: erm.security.canCopyLegalProductRestrictions(),
			canCreateProductRestrictions: erm.security.canCreateProductRestrictions(),
			canDeleteBusinessProductRestrictions: erm.security.canDeleteBusinessProductRestrictions(),
			canDeleteLegalProductRestrictions: erm.security.canDeleteLegalProductRestrictions(),
			canDeleteProductRestrictions:erm.security.canDeleteProductRestrictions(),
			canDeleteComments:erm.security.canDeleteComments(),
			canUpdateLegalProductRestrictions: erm.security.canUpdateLegalProductRestrictions(),
			canUpdateBusinessProductRestrictions: erm.security.canUpdateBusinessProductRestrictions(),
			canAdoptRightStrand: erm.security.canAdoptRightStrand(),
			canAdoptBusinessRightStrand : erm.security.canAdoptBusinessRightStrand(),
			canAdoptLegalRightStrand : erm.security.canAdoptLegalRightStrand(),
			canUploadOrCreateClearanceMemos: erm.security.canUploadOrCreateClearanceMemos(),
			canModifyClearanceMemos: erm.security.canModifyClearanceMemos(),			
			canViewClearanceReport: erm.security.canViewClearanceReport(), 
			canDeleteClearanceMemo : erm.security.canDeleteClearanceMemo(),
			canAdoptBusinessProductRestrictions: erm.security.canAdoptBusinessProductRestrictions(),
			canAdoptLegalProductRestrictions: erm.security.canAdoptLegalProductRestrictions(),
			canReadSubrights : erm.security.canReadSubrights(),
			canCreateSubrights : erm.security.canCreateSubrights(),
			canUpdateSubrights : erm.security.canUpdateSubrights(),
			canDeleteSubrights : erm.security.canDeleteSubrights(),
			canReadSalesAndMarketing : erm.security.canReadSalesAndMarketing(),
			canCreateSalesAndMarketing : erm.security.canCreateSalesAndMarketing(),
			canUpdateSalesAndMarketing : erm.security.canUpdateSalesAndMarketing(),
			canDeleteSalesAndMarketing : erm.security.canDeleteSalesAndMarketing(),
			canAcknowledgeUpdates : erm.security.canAcknowledgeUpdates(),
			canUseProductSidePanel : erm.security.canUseProductSidePanel(),
			canUseCrossProductSidePanel : erm.security.canUseCrossProductSidePanel(),
			canViewBusinessProductComments: erm.security.canViewBusinessProductComments(),
			canEditBusinessProductComments: erm.security.canEditBusinessProductComments(),
			canDeleteBusinessProductComments: erm.security.canDeleteBusinessProductComments(),
			canViewPrivateComments: erm.security.canViewPrivateComments(),
			canViewLegalClearanceMemoComments: erm.security.canViewLegalClearanceMemoComments(),
			canEditLegalClearanceMemoComments: erm.security.canEditLegalClearanceMemoComments(),
			canDeleteLegalClearanceMemoComments: erm.security.canDeleteLegalClearanceMemoComments(),
			canViewLegalRightStrandComments:erm.security.canViewLegalRightStrandComments(),
			canEditLegalRightStrandComments:erm.security.canEditLegalRightStrandComments(),
			canDeleteLegalRightStrandComments:erm.security.canDeleteLegalRightStrandComments(),

			canViewBusinessRightStrandComments:erm.security.canViewBusinessRightStrandComments(),
			canEditBusinessRightStrandComments:erm.security.canEditBusinessRightStrandComments(),
			canDeleteBusinessRightStrandComments:erm.security.canDeleteBusinessRightStrandComments(),

			canViewRightStrandComments:erm.security.canViewRightStrandComments(),
			canEditRightStrandComments:erm.security.canEditRightStrandComments(),
			canDeleteRightStrandComments:erm.security.canDeleteRightStrandComments(),
			
			canViewBusinessConfirmationStatus:erm.security.canViewBusinessConfirmationStatus(),
			canUpdateBusinessConfirmationStatus:erm.security.canUpdateBusinessConfirmationStatus(),
			canUpdateFoxProduced:erm.security.canUpdateFoxProduced(),
			canViewJobs:erm.security.canViewJobs(),
			canSyncReleaseDate:erm.security.canSyncReleaseDate(),
			canAddOrDeleteCentralFileNumber : erm.security.canAddOrDeleteCentralFileNumber(),
			canViewPrivateContacts : erm.security.canViewPrivateContacts(),
			canAssignContact : erm.security.canAssignContact(),
			canModifyContact : erm.security.canModifyContact(),
			canSearchRightConsumptionStatus: erm.security.canSearchRightConsumptionStatus(),
			canUpdateFutureMedia: erm.security.canUpdateFutureMedia(),
			canMapCM: erm.security.canMapCM(),
			canCrossProductCopy: erm.security.canCrossProductCopy(),
			canCrossProductDelete:erm.security.canCrossProductDelete(),
			canSearchRightConsumptionStatus:erm.security.canSearchRightConsumptionStatus(),
			canModifyContractualParties: erm.security.canModifyClearanceMemos(),
			canUpdateFutureMedia:erm.security.canUpdateFutureMedia(),
			canViewFilmsAndClips:erm.security.canViewFilmsAndClips(),
			canEditFilmsAndClips:erm.security.canEditFilmsAndClips(),
			canViewRemakesAndSequels:erm.security.canViewRemakesAndSequels(),
			canEditRemakesAndSequels:erm.security.canEditRemakesAndSequels(),
			canViewLegitimateStage:erm.security.canViewLegitimateStage(),
			canEditLegitimateStage:erm.security.canEditLegitimateStage(),
			canUpdatePaidAdMemo: erm.security.canUpdatePaidAdMemo(),
			canDeletePaidAdMemo: erm.security.canDeletePaidAdMemo(),
			canUpdateAncillaryRights: erm.security.canUpdateAncillaryRights(),
			canUpdateMerchandisingTieIns: erm.security.canUpdateMerchandisingTieIns(),
			canUpdateCommercialTieIns: erm.security.canUpdateCommercialTieIns(),
			canUpdateBillingBlock:erm.security.canUpdateBillingBlock(),
			canUpdateTitleCredits:erm.security.canUpdateTitleCredits(),			
			canUpdateArtworkRestrictions:erm.security.canUpdateArtworkRestrictions(),
			
			canViewPaidAdMemo: erm.security.canViewPaidAdMemo(),			
			canViewAncillaryRights: erm.security.canViewAncillaryRights(),
			canViewMerchandisingTieIns: erm.security.canViewMerchandisingTieIns(),
			canViewCommercialTieIns: erm.security.canViewCommercialTieIns(),
			canViewBillingBlock:erm.security.canViewBillingBlock(),
			canViewTitleCredits:erm.security.canViewTitleCredits(),
			canViewArtworkRestrictions:erm.security.canViewArtworkRestrictions(),
			canViewConfidentialTitles:erm.security.canViewConfidentialTitles(),
			canViewPrivateStrands:erm.security.canViewPrivateStrands(),
			
			canViewGrantCode: function canViewGrantCode(grantCode) {
				if (!grantCode) {
					return false;
				}
				if (grantCode==-1) return true;
				if (grantCode==erm.dbvalues.grantTypes.FILMS_CLIPS_STILLS) return this.canViewFilmsAndClips;
				if (grantCode==erm.dbvalues.grantTypes.REMAKES_SEQUELS) return this.canViewRemakesAndSequels;
				if (grantCode==erm.dbvalues.grantTypes.BILLING_BLOCK) return this.canViewBillingBlock;				
				if (grantCode==erm.dbvalues.grantTypes.TITLE_CREDITS) return this.canViewTitleCredits;				
				if (grantCode==erm.dbvalues.grantTypes.ARTWORK_RESTRICTIONS) return this.canViewArtworkRestrictions;				
				if (grantCode==erm.dbvalues.grantTypes.LEGITIMATE_STAGE) return this.canViewLegitimateStage;
				if (grantCode==erm.dbvalues.grantTypes.PAID_AD_MEMO) return this.canViewPaidAdMemo;
				if (grantCode==erm.dbvalues.grantTypes.ANCILLARY_RIGHTS) return this.canViewAncillaryRights;
				if (grantCode==erm.dbvalues.grantTypes.MERCHANDISING_COMMERCIAL_TIE_INS) return this.canViewMerchandisingTieIns;
				if (grantCode==erm.dbvalues.grantTypes.COMMERICAL_TIE_INS) return this.canViewCommercialTieIns;
				

				return false;
			},
			canEditGrantCode: function canEditGrantCode(grantCode) {
				if (!grantCode) {
					return false;
				}
				if (grantCode==-1) return true;
				if (grantCode==erm.dbvalues.grantTypes.FILMS_CLIPS_STILLS) return this.canEditFilmsAndClips;
				if (grantCode==erm.dbvalues.grantTypes.REMAKES_SEQUELS) return this.canEditRemakesAndSequels;
				if (grantCode==erm.dbvalues.grantTypes.BILLING_BLOCK) return this.canUpdateBillingBlock;
				if (grantCode==erm.dbvalues.grantTypes.TITLE_CREDITS) return this.canUpdateTitleCredits;
				if (grantCode==erm.dbvalues.grantTypes.ARTWORK_RESTRICTIONS) return this.canUpdateArtworkRestrictions;				
				if (grantCode==erm.dbvalues.grantTypes.LEGITIMATE_STAGE) return this.canEditLegitimateStage;
				if (grantCode==erm.dbvalues.grantTypes.PAID_AD_MEMO) return this.canUpdatePaidAdMemo;
				if (grantCode==erm.dbvalues.grantTypes.ANCILLARY_RIGHTS) return this.canUpdateAncillaryRights;
				if (grantCode==erm.dbvalues.grantTypes.MERCHANDISING_COMMERCIAL_TIE_INS) return this.canUpdateMerchandisingTieIns;
				if (grantCode==erm.dbvalues.grantTypes.COMMERICAL_TIE_INS) return this.canUpdateCommercialTieIns;
				return false;
			},
			//For now, if the grant can be edited it can be deleted
			canDeleteGrantCode: function canDeleteGrantCode(grantCode) {
				return this.canEditGrantCode(grantCode);
			},			
			userRole: erm.security.userRole()			
	};
	
	$scope.security.comments = {
		isBusiness: $scope.user.business,
		canEditComment: function canEditComment(comment,isBusiness) {
			var commentBusiness = comment.comment && comment.comment.business;
			var commentLegal = comment.comment && comment.comment.legal;
			if (commentBusiness && isBusiness) {
				return true;
			}
			if (commentLegal && !isBusiness) {
				return true;
			}
			return false;
		},	
		canEditStrandComment: function canEditStrandComment(comment) {
			return $scope.security.canEditRightStrandComments && 
				   this.canEditComment(comment,this.isBusiness);
		},
		canDeleteStrandComment: function canDeleteStrandComment(comment) {
			return $scope.security.canDeleteRightStrandComments && 
				   this.canEditComment(comment,this.isBusiness);
		},

		canEditBusinessProductComment: function canEditBusinessProductComment(comment) {
			return $scope.security.canEditBusinessProductComments && 
				   this.canEditComment(comment,this.isBusiness);			
		},
		canDeleteBusinessProductComment: function canDeleteBusinessProductComment(comment) {
			return $scope.security.canDeleteBusinessProductComments && 
				   this.canEditComment(comment,this.isBusiness);			
		},
		
		canEditCMComment: function canEditCMComment(comment) {
			return $scope.security.canEditLegalClearanceMemoComments &&
				   this.canEditComment(comment,this.isBusiness);
		},
		canDeleteCMComment: function canDeleteCMComment(comment) {
			return $scope.security.canDeleteLegalClearanceMemoComments &&
				   this.canEditComment(comment,this.isBusiness);
		}
		
	};
	
});


app.controller('GetStartedController',function GetStartedController($scope,$route,$log){	
	$scope.getStartedTab = "";
	$scope.getStartedTabSection = '1';		
	$('#GUIDE_NEWS').load('/guide/News.html');
	$scope.collapseGetStartedTabs = function() {
	  $(".getStarted_Menu_tab").animate({'padding-top':'10%'},1000);
	  $(".homeTileBlurb").animate({'padding':'5%'},1000);
	  $(".card").animate({'padding-top':'50px'},0);
	  $(".card").animate({'max-height':'200px'},1000);
	  $scope.getStartedTab = '';
	  if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
		$scope.$apply();
	  }
	};
	$scope.switchGetStartedTabs=function(tabName, section) {		  
	  $(".getStarted_Menu_tab").animate({'padding-top':'0%'},1000);
	  $(".homeTileBlurb").animate({'padding':'2%'},1000);
	  $(".card").animate({'padding-top':'25px'},0);
	  $(".card").animate({'max-height':'100px'},1000);
	  if (tabName == 'news') {			
		$scope.getStartedTab = 'news';		
	  } else if (tabName == 'getStarted') {			
		$scope.getStartedTab = 'getStarted';		
	    $('#GET_STARTED_NAV').load('/guide/Get_Started_Nav.html');
		$('#GUIDE_GETSTARTED').html('<img width="100%" height="100%" src="/guide/img/getStarted_' + $scope.getStartedTabSection + '.png"/>');
		console.log("switchGetStartedTabs: $scope.getStartedTabSection " + $scope.getStartedTabSection);
	  } else if (tabName == 'guide') {					
		console.log("Section %o", section);					
		if (section == 'Language'){ 
			window.open('/guide/ERMLanguageList.pdf',"guide","location=1,status=1,scrollbars=1, width=800,height=600");
		} 
		if (section == 'InformationCode') {
			window.open('/guide/ERMInformationalCode.pdf',"guide","location=1,status=1,scrollbars=1, width=800,height=600");		
		}
		if (section == 'Glossary') {
		  window.open('/guide/Glossary.pdf',"guide","location=1,status=1,scrollbars=1, width=800,height=600");
		}
	  } else if (tabName == 'castandcrew') {			
		$scope.getStartedTab = 'castandcrew';
		$('#GUIDE_CASTANDCREW').load('/guide/castandcrew.html');
	  } else if (tabName == 'questions') {			
		$scope.getStartedTab = 'questions';				
		$('#GUIDE_QUESTIONS').load('/guide/questions.html');		
	  }
	  if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
		$scope.$apply();
	  }
	};
});			  

app.controller('ERMSidePanelController',function ERMSidePanelController($scope,$route,$log){
	$scope.isERMSidePanelOut = false;	
	$scope.currentERMSidePanelTab = "productcomments";
	$scope.hide = function hide() {
		$scope.isERMSidePanelOut = false;		
	};
	
	$scope.switchERMSidePanels=function(tabName) {
	  if (tabName == 'strandcomments' && $scope.currentERMSidePanelTab != 'strandcomments') {			
		$scope.currentERMSidePanelTab = 'strandcomments';
	  } else if (tabName == 'clearancemapping' && $scope.currentERMSidePanelTab != 'clearancemapping') {			
		$scope.currentERMSidePanelTab = 'clearancemapping';
	  } else if (tabName == 'clearancecomments' && $scope.currentERMSidePanelTab != 'clearancecomments') {			
		$scope.currentERMSidePanelTab = 'clearancecomments';
	  } else if (tabName == 'productcomments' && $scope.currentERMSidePanelTab != 'productcomments') {			
		$scope.currentERMSidePanelTab = 'productcomments';
	  }	  
	};
	//AMV returns true if the user can view strand comments (considering if the product has right consumption status of private)
	$scope.canViewStrandsComments = function canViewStrandsComments() {
		if ($scope.security.canViewPrivateStrands) {
			return true;
		}
		var rightsScope = erm.scopes.rights();
		if (!rightsScope) {
			return true;
		}
		
		//there is a posibility when the rightsScope is null (ie is not loaded yet)
		return rightsScope.currentProductArray.businessConfirmationStatusId!==1;
	};
	
	
	$scope.toggleSidePanelComments = function(){
	  if($scope.sidePanelCommentsShowComments) {
		$scope.sidePanelCommentsShowComments = false;
	  } else { 
		$scope.sidePanelCommentsShowComments = true;
	  }
	  for (var i = 0; i < $scope.rightStrandComments.length; i++) {		  
	    $scope.rightStrandComments[i].commentExpanded = $scope.sidePanelCommentsShowComments;  
	  }
	  for (var i = 0; i < $scope.clearanceMemoComments.length; i++) {		  
		$scope.clearanceMemoComments[i].commentExpanded = $scope.sidePanelCommentsShowComments;  
	  }
	};
	$scope.toggleSidePanelProductComments = function(status){  
	  if($scope.sidePanelProductCommentsShowComments) {
		$scope.sidePanelProductCommentsShowComments = false;
	  } else { 
		$scope.sidePanelProductCommentsShowComments = true;
	  }	  
	  for (var i = 0; i < $scope.productComments.length; i++) {		  
		  $scope.productComments[i].commentExpanded = $scope.sidePanelProductCommentsShowComments;  
	  }
	};
	$scope.sidePanelCommentsShowComments = false;
	$scope.sidePanelProductCommentsShowComments = true;	
	
	$scope.productComments = null;
	$scope.loadProductComments = function () {
		var rcscope = angular.element(document.getElementById("rightsController")).scope();
		var url = path.getCommentsLoadProductCommentsRESTPath() + rcscope.foxVersionId;
		console.log("Loading Product Comments");
		var jqxhr = $.get(url, function(data){			
			$scope.productComments = new Array();
			for (var i = 0; i < data.length; i++) {
			  if ((data[i].comment.publicInd == 1 || data[i].comment.publicInd == null) || (($scope.security.isBusiness && data[i].comment.business && $scope.security.canViewPrivateComments) || (!$scope.security.isBusiness && data[i].comment.legal && $scope.security.canViewPrivateComments))) {
				$scope.productComments.push(data[i]);
			  }
			}
			if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
			  $scope.$apply();
		}).fail(function(xhr,status,message){
			errorPopup.showErrorPopupWindow("Problem loading product comments" + xhr.responseText);
		});
	};
	
	
	$scope.processSaveProductComments = function(comment, categoryId, foxVersionId, entityKey){
		var that = this;
		if(comment){					
			var jsonData = JSON.stringify(comment);
			var rcscope = angular.element(document.getElementById("rightsController")).scope();
			console.log(" PRODUCT COMMENT JSON : %o", jsonData);
			var path = paths("rest");
			var url = path.getCommentsSaveProductRESTPath() + rcscope.foxVersionId;
			console.log(" PRODUCT COMMENT url: " + url);
			console.log(" PRODUCT COMMENT foxVersionId: " + rcscope.foxVersionId);			
			that.showSubmitPopupWindow();
			var jqxhr = $.post(url, {q:jsonData}, function(data){				
				subrights_submitPopupWindow.close();
				commentsAndAttachmentsObject.closeTemplateAddCommentsAndAttachmentWindow();
				commentsAndAttachmentsObject.resetFields();
				$scope.loadProductComments();
			}).fail(function(xhr,status,message){
				subrights_submitPopupWindow.close();
				errorPopup.showErrorPopupWindow(xhr.responseText);
			});			
		}
	};
	$scope.openAddProductCommentsAndAttachments = function (commentId) {
		commentsAndAttachmentsObject.openAddCommentsAndAttachmentsPopupWindow($scope.processSaveProductComments, eval(commentId) > 0 ? commentId : null, false, erm.dbvalues.entityCommentType.PRODUCT_INFO, erm.dbvalues.entityType.PRODUCT_VERSION);	
	};
	$scope.processDeleteProductComment = function(commentId){
		if(commentId){
			var rcscope = angular.element(document.getElementById("rightsController")).scope();
			var c = new Object();
			c.id = commentId;			
			var jsonData = JSON.stringify(c);
			console.log(" COMMENT TO BE DELETED : %o", jsonData);
			var url = path.getProductGrantsDeleteCommentRESTPath()+"/"+rcscope.foxVersionId;
			var jqxhr = $.post(url, {q:jsonData}, function(data){	
				$scope.loadProductComments();
			}).fail(function(xhr,status,message){
				errorPopup.showErrorPopupWindow(xhr.responseText);
			});
		}
	};
	$scope.openDeleteProductCommentsPopopWindow = function (commentId) {
		var cf = new confirmationPopup();
		cf.initializeElement();
		var confirmationText = "You are about to delete a comment (ID : "+commentId+") . Are you sure?";
		var confirmationButtonText = "Confirm Delete";
		cf.openConfirmationWindow("#commentsAndAttachmentPopupWindow", confirmationText, confirmationButtonText, commentId, $scope.processDeleteProductComment);		
	};
	$scope.clearanceMemoComments = null;	
	$scope.processSaveClearanceMemoComments = function(comment, categoryId, foxVersionId, entityKey){
		var that = this;
		if(comment){					
			var jsonData = JSON.stringify(comment);
			var rcscope = angular.element(document.getElementById("rightsController")).scope();
			console.log(" CLERANCE MEMO COMMENT JSON : %o", jsonData);
			var path = paths("rest");
			var url = path.getCommentsSaveClearanceMemoRESTPath() + rcscope.foxVersionId;
			console.log(" CLERANCE MEMO COMMENT url: " + url);
			console.log(" CLERANCE MEMO COMMENT foxVersionId: " + rcscope.foxVersionId);			
			that.showSubmitPopupWindow();
			var jqxhr = $.post(url, {q:jsonData}, function(data){				
				subrights_submitPopupWindow.close();
				commentsAndAttachmentsObject.closeTemplateAddCommentsAndAttachmentWindow();
				commentsAndAttachmentsObject.resetFields();
				clearanceMemoObject.loadClearanceMemoComments();
			}).fail(function(xhr,status,message){
				subrights_submitPopupWindow.close();
				errorPopup.showErrorPopupWindow(xhr.responseText);
			});			
		}
	};
	$scope.openAddClearanceCommentsAndAttachments = function (commentId) {
		commentsAndAttachmentsObject.openAddCommentsAndAttachmentsPopupWindow($scope.processSaveClearanceMemoComments, eval(commentId) > 0 ? commentId : null, false, erm.dbvalues.entityCommentType.CLEARANCE_MEMO_COMMENT, erm.dbvalues.entityType.PRODUCT_VERSION);
	};
	
	$scope.processDeleteClearanceMemoComment = function(commentId){
		if(commentId){
			var rcscope = angular.element(document.getElementById("rightsController")).scope();
			var c = new Object();
			c.id = commentId;			
			var jsonData = JSON.stringify(c);
			console.log(" COMMENT TO BE DELETED : %o", jsonData);
			var url = path.getProductGrantsDeleteCommentRESTPath()+"/"+rcscope.foxVersionId;
			var jqxhr = $.post(url, {q:jsonData}, function(data){
				clearanceMemoObject.loadClearanceMemoComments();
			}).fail(function(xhr,status,message){
				errorPopup.showErrorPopupWindow(xhr.responseText);
			});
		}
	};
	
	$scope.processDeleteRightStrandComment = function(commentId){
		if(commentId){
			var rcscope = angular.element(document.getElementById("rightsController")).scope();
			var c = new Object();
			c.id = commentId;			
			var jsonData = JSON.stringify(c);
			console.log(" COMMENT TO BE DELETED : %o", jsonData);
			var url = path.getProductGrantsDeleteCommentRESTPath()+"/"+rcscope.foxVersionId;
			var jqxhr = $.post(url, {q:jsonData}, function(data){												   
			    $scope.loadStrandCommentCounts();
			    strands.toggleMapUnMapAndStrandComments();
			    console.log(" DELETED $scope.checkedStrandsAndCodesObj : %o", $scope.checkedStrandsAndCodesObj);				
				productRestrictionsGridConfigurator.commentsInfoCodes($scope.checkedStrandsAndCodesObj.productInfoCodeIds, false);
				gridStrandsConfigurator.commentsRightStrandRestriction($scope.checkedStrandsAndCodesObj.rightStrandIds, true, false);
				gridStrandsConfigurator.commentsRightStrandRestriction($scope.checkedStrandsAndCodesObj.rightStrandRestrictionIds, false, false);
			}).fail(function(xhr,status,message){
				errorPopup.showErrorPopupWindow(xhr.responseText);
			});
		}
	};
	
	
	$scope.openDeleteClearanceMemoCommentsPopopWindow = function (commentId) {
		var cf = new confirmationPopup();
		cf.initializeElement();
		var confirmationText = "You are about to delete a comment (ID : "+commentId+") . Are you sure?";
		var confirmationButtonText = "Confirm Delete";
		cf.openConfirmationWindow("#commentsAndAttachmentPopupWindow", confirmationText, confirmationButtonText, commentId, $scope.processDeleteClearanceMemoComment);		
	};
	
	$scope.openDeleteRightStrandCommentsPopopWindow = function (commentId) {
		var cf = new confirmationPopup();
		cf.initializeElement();
		var confirmationText = "You are about to delete a comment (ID : "+commentId+") . Are you sure?";
		var confirmationButtonText = "Confirm Delete";
		cf.openConfirmationWindow("#commentsAndAttachmentPopupWindow", confirmationText, confirmationButtonText, commentId, $scope.processDeleteRightStrandComment);		
	};
	
	$scope.strandCommentsToDelete = new Array();
	$scope.productCommentsToDelete = new Array();
	$scope.clearanceMemoCommentsToDelete = new Array();
	
	$scope.checkedStrandsAndCodesObj = {};
	$scope.rightStrandOrRestrictionChecked = false;
	$scope.rightStrandComments = new Array();
	
	$scope.productInfoCodeComments = new Array();
	$scope.rightStrandStrandComments = new Array();
	$scope.rightStrandInfoCodeComments = new Array();
	
	$scope.rightStrandCommentsCount = 0;
	$scope.productInfoCodeCommentsCount = 0;
	$scope.rightStrandStrandCommentsCount = 0;
	$scope.rightStrandInfoCodeCommentsCount = 0;
	
	$scope.loadStrandCommentCounts = function () {
		var rcscope = angular.element(document.getElementById("rightsController")).scope();
		var url = path.getCommentsLoadStrandCommentCountRESTPath() + rcscope.foxVersionId;
		console.log("Loading Strand Comment Count");
		$scope.startStrandSidePanelIndicatorResponses();
		$("#strand-sidepanel-spinner-message").html("Loading Rights Strand Comment Count");							
		$("#strand-sidepanel-spinner").addClass("displayInline");
		$("#strand-sidepanel-check").removeClass("displayInline");
		var jqxhr = $.get(url, function(data){				
			$scope.rightStrandStrandCommentsCount = data.strandComments;
			$scope.productInfoCodeCommentsCount = data.productRestrictionComments;
			$scope.rightStrandInfoCodeCommentsCount = data.strandRestrictionComments;
			$scope.rightStrandCommentsCount = eval(eval($scope.rightStrandStrandCommentsCount) + eval($scope.productInfoCodeCommentsCount) + eval($scope.rightStrandInfoCodeCommentsCount));
			$scope.removeStrandSidePanelIndicatorResponses();			
			if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
			  $scope.$apply();
		}).fail(function(xhr,status,message){
			errorPopup.showErrorPopupWindow("Problem Strand Comment Count " + xhr.responseText);
		});
	};
	
	$scope.checkAllClearanceMemoComments = function(check) {
		if (!check) {
	      $scope.clearanceMemoCommentsToDelete = new Array();
		}
		for (var i = 0; i < $scope.clearanceMemoComments.length; i++) {
		  document.getElementById("commenttodelete_" + $scope.clearanceMemoComments[i].comment.id).checked = check;
		  $scope.checkClearanceMemoComment($scope.clearanceMemoComments[i].comment.id);
		}
		if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
			$scope.$apply();
	};	
	$scope.checkClearanceMemoComment = function(commentid) {		
		if (!document.getElementById("commenttodelete_" + commentid).disabled) {
		  var isChecked = document.getElementById("commenttodelete_" + commentid).checked;
		  console.log("checkStrandComment commentid " + commentid + " isChecked " + isChecked);
		  if (isChecked && $.inArray(commentid, $scope.clearanceMemoCommentsToDelete) == -1) {
			$scope.clearanceMemoCommentsToDelete.push(commentid);
		  } else if (!isChecked && $.inArray(commentid, $scope.clearanceMemoCommentsToDelete) > -1) {
			$scope.clearanceMemoCommentsToDelete.splice($.inArray(commentid, $scope.clearanceMemoCommentsToDelete), 1);	
		  }
		  console.log("$scope.clearanceMemoCommentsToDelete " + $scope.clearanceMemoCommentsToDelete);
		}
	};
	
	$scope.checkAllProductComments = function(check) {
		if (!check) {
	      $scope.productCommentsToDelete = new Array();
		}
		for (var i = 0; i < $scope.productComments.length; i++) {
		  document.getElementById("commenttodelete_" + $scope.productComments[i].comment.id).checked = check;
		  $scope.checkProductComment($scope.productComments[i].comment.id);
		}
		if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
			$scope.$apply();
	};	
	$scope.checkProductComment = function(commentid) {		
		if (!document.getElementById("commenttodelete_" + commentid).disabled) {
		  var isChecked = document.getElementById("commenttodelete_" + commentid).checked;
		  console.log("checkStrandComment commentid " + commentid + " isChecked " + isChecked);
		  if (isChecked && $.inArray(commentid, $scope.productCommentsToDelete) == -1) {
			$scope.productCommentsToDelete.push(commentid);
		  } else if (!isChecked && $.inArray(commentid, $scope.productCommentsToDelete) > -1) {
			$scope.productCommentsToDelete.splice($.inArray(commentid, $scope.productCommentsToDelete), 1);	
		  }
		  console.log("$scope.productCommentsToDelete " + $scope.productCommentsToDelete);
		}
	};
	
	
	$scope.checkAllStrandComments = function(check) {
		if (!check) {
	      $scope.strandCommentsToDelete = new Array();
		}
		if ($scope.rightStrandStrandComments != null) {
		  for (var i = 0; i < $scope.rightStrandStrandComments.length; i++) {
		    document.getElementById("commenttodelete_" + $scope.rightStrandStrandComments[i].comment.id).checked = check;
		    $scope.checkStrandComment($scope.rightStrandStrandComments[i].comment.id);
		  }
		}
		if ($scope.productInfoCodeComments != null) {
		  for (var i = 0; i < $scope.productInfoCodeComments.length; i++) {
		    document.getElementById("commenttodelete_" + $scope.productInfoCodeComments[i].comment.id).checked = check;
		    $scope.checkStrandComment($scope.productInfoCodeComments[i].comment.id);
		  }
		}
		if ($scope.rightStrandInfoCodeComments != null) {
		  for (var i = 0; i < $scope.rightStrandInfoCodeComments.length; i++) {
		    document.getElementById("commenttodelete_" + $scope.rightStrandInfoCodeComments[i].comment.id).checked = check;
		    $scope.checkStrandComment($scope.rightStrandInfoCodeComments[i].comment.id);
		  }
		}
		if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
			$scope.$apply();
	};	
	$scope.checkStrandComment = function(commentid) {		
		if (!document.getElementById("commenttodelete_" + commentid).disabled) {
		  var isChecked = document.getElementById("commenttodelete_" + commentid).checked;
		  console.log("checkStrandComment commentid " + commentid + " isChecked " + isChecked);
		  if (isChecked && $.inArray(commentid, $scope.strandCommentsToDelete) == -1) {
			$scope.strandCommentsToDelete.push(commentid);
		  } else if (!isChecked && $.inArray(commentid, $scope.strandCommentsToDelete) > -1) {
			$scope.strandCommentsToDelete.splice($.inArray(commentid, $scope.strandCommentsToDelete), 1);	
		  }		  
		}
	};
		
	$("#deleteCheckedStrandCommentButton").unbind();
	$("#deleteCheckedStrandCommentButton").click(function(event){	
		var confirmationText = "Are you sure you want to delete the checked comments?";
		var confirmationButtonText = "Yes, Delete";
		cf = new confirmationPopup();
		cf.initializeElement();           
		cf.openConfirmationWindow("#confirmationPopupWindow", confirmationText, confirmationButtonText, {}, $scope.deleteCheckedStrandComments);					
	});	
	$scope.deleteCheckedStrandComments = function () {	
		console.log("inside deleteCheckedStrandComments");
		var scope = angular.element(document.getElementById("rightsController")).scope();
		var foxVersionId = scope.foxVersionId;
		var ids = $scope.strandCommentsToDelete;
		console.log("inside deleteCheckedStrandComments ids %o", ids);
		if(ids.length <= 0){
			errorPopup.showErrorPopupWindow(" You must check some comments before you can delete");
		} else {											
			var jsonData = JSON.stringify($scope.strandCommentsToDelete);
			console.log(" COMMENTS TO BE DELETED : %o", jsonData);
			var url = path.getProductGrantsDeleteMultipleCommentsRESTPath()+"/"+foxVersionId;						
			$("#deleteCheckedStrandCommentButton").html('<i class="icon-spinner icon-spin"></i> Deleting Checked Comments');
			$.post(url, {q:jsonData}, function(data){
			  $("#deleteCheckedStrandCommentButton").html('<i class="icon-remove"></i> Delete Checked Comments');
			  for (var i = 0; i < $scope.strandCommentsToDelete.length; i++) {			  			
				$("#comment_" + $scope.strandCommentsToDelete[i]).attr("style", "display: none !important;");
				$("#commenttodelete_" + $scope.strandCommentsToDelete[i]).prop('disabled', true);								
			  };			  
			  $scope.checkAllStrandComments(false);
			  $scope.loadStrandCommentCounts();
			  strands.toggleMapUnMapAndStrandComments();
			  productRestrictionsGridConfigurator.commentsInfoCodes($scope.checkedStrandsAndCodesObj.productInfoCodeIds, false);
			  gridStrandsConfigurator.commentsRightStrandRestriction($scope.checkedStrandsAndCodesObj.rightStrandIds, true, false);
			  gridStrandsConfigurator.commentsRightStrandRestriction($scope.checkedStrandsAndCodesObj.rightStrandRestrictionIds, false, false);
			}).fail(function(xhr,status,message){
				$("#deleteCheckedStrandCommentButton").html('<i class="icon-remove"></i> Delete Checked Comments');
				errorPopup.showErrorPopupWindow(xhr.responseText);
			});
		}
	};
	
	$("#deleteCheckedProductCommentButton").unbind();
	$("#deleteCheckedProductCommentButton").click(function(event){	
		var confirmationText = "Are you sure you want to delete the checked comments?";
		var confirmationButtonText = "Yes, Delete";
		cf = new confirmationPopup();
		cf.initializeElement();           
		cf.openConfirmationWindow("#confirmationPopupWindow", confirmationText, confirmationButtonText, {}, $scope.deleteCheckedProductComments);					
	});	
	$scope.deleteCheckedProductComments = function () {	
		console.log("inside deleteCheckedStrandComments");
		var scope = angular.element(document.getElementById("rightsController")).scope();
		var foxVersionId = scope.foxVersionId;
		var ids = $scope.productCommentsToDelete;
		console.log("inside deleteCheckedStrandComments ids %o", ids);
		if(ids.length <= 0){
			errorPopup.showErrorPopupWindow(" You must check some comments before you can delete");
		} else {											
			var jsonData = JSON.stringify($scope.productCommentsToDelete);
			console.log(" COMMENTS TO BE DELETED : %o", jsonData);
			var url = path.getProductGrantsDeleteMultipleCommentsRESTPath()+"/"+foxVersionId;						
			$("#deleteCheckedStrandCommentButton").html('<i class="icon-spinner icon-spin"></i> Deleting Checked Comments');
			$.post(url, {q:jsonData}, function(data){
			  $("#deleteCheckedStrandCommentButton").html('<i class="icon-remove"></i> Delete Checked Comments');
			  for (var i = 0; i < $scope.productCommentsToDelete.length; i++) {			  			
				$("#comment_" + $scope.productCommentsToDelete[i]).attr("style", "display: none !important;");
				$("#commenttodelete_" + $scope.productCommentsToDelete[i]).prop('disabled', true);				
			  };
			  $scope.checkAllProductComments(false);			  
			}).fail(function(xhr,status,message){
				$("#deleteCheckedStrandCommentButton").html('<i class="icon-remove"></i> Delete Checked Comments');
				errorPopup.showErrorPopupWindow(xhr.responseText);
			});
		}
	};	
	
	$("#deleteCheckedClearanceMemoCommentButton").unbind();
	$("#deleteCheckedClearanceMemoCommentButton").click(function(event){	
		var confirmationText = "Are you sure you want to delete the checked comments?";
		var confirmationButtonText = "Yes, Delete";
		cf = new confirmationPopup();
		cf.initializeElement();           
		cf.openConfirmationWindow("#confirmationPopupWindow", confirmationText, confirmationButtonText, {}, $scope.deleteCheckedClearanceMemoComments);					
	});	
	$scope.deleteCheckedClearanceMemoComments = function () {	
		console.log("inside deleteCheckedClearanceMemoComments");
		var scope = angular.element(document.getElementById("rightsController")).scope();
		var foxVersionId = scope.foxVersionId;
		var ids = $scope.clearanceMemoCommentsToDelete;
		console.log("inside clearanceMemoCommentsToDelete ids %o", ids);
		if(ids.length <= 0){
			errorPopup.showErrorPopupWindow(" You must check some comments before you can delete");
		} else {											
			var jsonData = JSON.stringify($scope.clearanceMemoCommentsToDelete);
			console.log(" COMMENTS TO BE DELETED : %o", jsonData);
			var url = path.getProductGrantsDeleteMultipleCommentsRESTPath()+"/"+foxVersionId;						
			$("#deleteCheckedStrandCommentButton").html('<i class="icon-spinner icon-spin"></i> Deleting Checked Comments');
			$.post(url, {q:jsonData}, function(data){
			  $("#deleteCheckedStrandCommentButton").html('<i class="icon-remove"></i> Delete Checked Comments');
			  for (var i = 0; i < $scope.clearanceMemoCommentsToDelete.length; i++) {			  			
				$("#comment_" + $scope.clearanceMemoCommentsToDelete[i]).attr("style", "display: none !important;");
				$("#commenttodelete_" + $scope.clearanceMemoCommentsToDelete[i]).prop('disabled', true);				
			  };
			  $scope.checkAllClearanceMemoComments(false);			  
			}).fail(function(xhr,status,message){
				$("#deleteCheckedStrandCommentButton").html('<i class="icon-remove"></i> Delete Checked Comments');
				errorPopup.showErrorPopupWindow(xhr.responseText);
			});
		}
	};	
	
	$scope.toggleStrandComments = function(showAll) {		
		console.log("toggleStrandComments checkedStrandsAndCodesObj %o", $scope.checkedStrandsAndCodesObj);
		$("#strand-sidepanel-conflict-message").html(""); 
		if ((($scope.checkedStrandsAndCodesObj.rightStrandIds != null && $scope.checkedStrandsAndCodesObj.rightStrandIds.length > 0) || 
						($scope.checkedStrandsAndCodesObj.rightStrandRestrictionIds != null && $scope.checkedStrandsAndCodesObj.rightStrandRestrictionIds.length > 0) || 
						($scope.checkedStrandsAndCodesObj.productInfoCodeIds != null && $scope.checkedStrandsAndCodesObj.productInfoCodeIds.length > 0))) {		  
		  $scope.rightStrandOrRestrictionChecked = true;
		  //console.log("toggleStrandComments $scope.checkedStrandsAndCodesObj %o", $scope.checkedStrandsAndCodesObj);		  
		  var noCommentsAllowed = false;		  		
		  if (!showAll) {
			  for (var i = 0; i < $scope.checkedStrandsAndCodesObj.rightStrandIds.length; i++) {
				  if (($scope.security.isBusiness && !$scope.checkedStrandsAndCodesObj.rightStrandMap[$scope.checkedStrandsAndCodesObj.rightStrandIds[i]].isBusiness) ||
						(!$scope.security.isBusiness && !$scope.checkedStrandsAndCodesObj.rightStrandMap[$scope.checkedStrandsAndCodesObj.rightStrandIds[i]].isLegal)) {
					  $scope.rightStrandOrRestrictionChecked = false;
					  noCommentsAllowed = true;
				  }
			  }
			  for (var i = 0; i < $scope.checkedStrandsAndCodesObj.productInfoCodeIds.length; i++) {
				  if (($scope.security.isBusiness && !$scope.checkedStrandsAndCodesObj.productInfoCodeMap[$scope.checkedStrandsAndCodesObj.productInfoCodeIds[i]].isBusiness) ||
						(!$scope.security.isBusiness && !$scope.checkedStrandsAndCodesObj.productInfoCodeMap[$scope.checkedStrandsAndCodesObj.productInfoCodeIds[i]].isLegal)) {
					  $scope.rightStrandOrRestrictionChecked = false;
					  noCommentsAllowed = true;
				  }			  
			  }
			  for (var i = 0; i < $scope.checkedStrandsAndCodesObj.rightStrandRestrictionIds.length; i++) {
				  if (($scope.security.isBusiness && !$scope.checkedStrandsAndCodesObj.rightStrandRestrictionMap[$scope.checkedStrandsAndCodesObj.rightStrandRestrictionIds[i]].isBusiness) ||
						(!$scope.security.isBusiness && !$scope.checkedStrandsAndCodesObj.rightStrandRestrictionMap[$scope.checkedStrandsAndCodesObj.rightStrandRestrictionIds[i]].isLegal)) {
					  $scope.rightStrandOrRestrictionChecked = false;
					  noCommentsAllowed = true;
				  }
			  }		  
			  if (noCommentsAllowed) {
				//$("#strand-sidepanel-conflict-message").html("You can not add a comment to a " + ($scope.security.isBusiness ? "legal" : "business") +  " strand / info code");	
			  }
		  }
			  
	   	} else {
	   	  $scope.rightStrandOrRestrictionChecked = false;
	   	  console.log("Setting rightStrandOrRestrictionChecked to false");
		}
		if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
			$scope.$apply();
	};
	
	
	$scope.processSaveStrandComments = function(comment, categoryId, foxVersionId, entityKey){
		var that = this;
		if(comment){
			var jsonData = JSON.stringify(comment);			
			console.log(" STRAND COMMENT JSON : %o", jsonData);
			var path = paths("rest");
			var url = path.getCommentsSaveRightStrandRESTPath();
			console.log(" STRAND COMMENT url: " + url);
			console.log(" STRAND COMMENT checkedStrandsAndCodesObj: %o", $scope.checkedStrandsAndCodesObj);
			console.log(" STRAND COMMENT rightStrandIds: " + $scope.checkedStrandsAndCodesObj.rightStrandIds);
			that.showSubmitPopupWindow();
			var jqxhr = $.post(url, {
				q:jsonData,
				'productInfoCodeIds':JSON.stringify($scope.checkedStrandsAndCodesObj.productInfoCodeIds),
				'rightStrandIds':JSON.stringify($scope.checkedStrandsAndCodesObj.rightStrandIds),
				'rightStrandRestrictionIds':JSON.stringify($scope.checkedStrandsAndCodesObj.rightStrandRestrictionIds)}, function(data){				
				subrights_submitPopupWindow.close();
				commentsAndAttachmentsObject.closeTemplateAddCommentsAndAttachmentWindow();
				commentsAndAttachmentsObject.resetFields();							
				productRestrictionsGridConfigurator.commentsInfoCodes($scope.checkedStrandsAndCodesObj.productInfoCodeIds, true);
				gridStrandsConfigurator.commentsRightStrandRestriction($scope.checkedStrandsAndCodesObj.rightStrandIds, true, true);
				gridStrandsConfigurator.commentsRightStrandRestriction($scope.checkedStrandsAndCodesObj.rightStrandRestrictionIds, false, true);				
				$scope.loadStrandCommentCounts();
				strands.toggleMapUnMapAndStrandComments();
			}).fail(function(xhr,status,message){
				subrights_submitPopupWindow.close();
				errorPopup.showErrorPopupWindow(xhr.responseText);
			});			
		}
	};
	$scope.openAddRightStrandCommentsAndAttachments = function (commentId) {
			commentsAndAttachmentsObject.openAddStrandCommentsAndAttachmentsPopupWindow($scope.processSaveStrandComments, eval(commentId) > 0 ? commentId : null);	
//	  if ((($scope.checkedStrandsAndCodesObj.rightStrandIds != null && $scope.checkedStrandsAndCodesObj.rightStrandIds.length > 0) || 
//		($scope.checkedStrandsAndCodesObj.rightStrandRestrictionIds != null && $scope.checkedStrandsAndCodesObj.rightStrandRestrictionIds.length > 0) || 
//		($scope.checkedStrandsAndCodesObj.productInfoCodeIds != null && $scope.checkedStrandsAndCodesObj.productInfoCodeIds.length > 0))) {
//					 
//	  } else {
//		$scope.rightStrandOrRestrictionChecked = false;
//		$("#strand-sidepanel-response").addClass("deletedClass");	    				
//		$("#strand-sidepanel-spinner-message").html("No Strands, Informational Codes, or Product Info codes checked");		
//	  }
	};
	
	$scope.removeStrandSidePanelIndicatorResponses = function () {
	  $("#strand-sidepanel-response").removeClass("displayInline");
	  $("#strand-sidepanel-spinner").removeClass("displayInline");
	  $("#strand-sidepanel-check").removeClass("displayInline");
	  $("#strand-sidepanel-spinner-message").removeClass("tocErrorClass");
	  $("#strand-sidepanel-response").removeClass("successClass");
	  $("#strand-sidepanel-response").removeClass("deletedClass");	
	};
		
	$scope.startStrandSidePanelIndicatorResponses = function () {			
	  $scope.removeStrandSidePanelIndicatorResponses();
	  $("#strand-sidepanel-response").addClass("displayInline");
	  $("#strand-sidepanel-spinner").addClass("displayInline");
	};
	
	$scope.emptyProductInfoCodeComments = function () {
		$scope.productInfoCodeComments = new Array();;
		$("#product-restriction-grid-clear-selection").click();
		if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
		  $scope.$apply();
		}
	};
	$scope.emptyRightStrandStrandComments = function () {
		$scope.rightStrandStrandComments = new Array();
		if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
	      $scope.$apply();
		}
	};
	$scope.emptyRightStrandInfoCodeComments = function () {
		$scope.rightStrandInfoCodeComments = new Array();
		if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
	      $scope.$apply();
		}
	};
	$scope.emptyAllComments = function () {
		$scope.productInfoCodeComments = new Array();
		$scope.rightStrandStrandComments = new Array();
		$scope.rightStrandInfoCodeComments = new Array();
		$scope.rightStrandComments = new Array();
		if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
	      $scope.$apply();
		}
	};
	
	$scope.loadCommentById = function loadCommentById(commentId) {
		var url = paths().getCommentByIdRESTPath()+ commentId;
		var comments = [];		
		$.get(url,function(comment){
			$scope.popupComments = comments;
			if (comment) {
				comments.push(comment);
			}			 
		});
		
	};
	
	$scope.loadCommentsForRightStrandsAndCodes = function(loadAll){
		$scope.startStrandSidePanelIndicatorResponses();
		$scope.productInfoCodeComments = new Array();
		$scope.rightStrandStrandComments = new Array();
		$scope.rightStrandInfoCodeComments = new Array();
		var path = paths("rest");
		$scope.rightStrandComments = new Array();
		var url = path.getCommentsRightStrandsRESTPath();
		console.log(" STRAND COMMENT url: " + url);
		console.log(" STRAND COMMENT checkedStrandsAndCodesObj: %o", $scope.checkedStrandsAndCodesObj);
		$("#strand-sidepanel-spinner-message").html("Loading comments...");
		var jqxhr = $.post(url, {
			'productInfoCodeIds':JSON.stringify($scope.checkedStrandsAndCodesObj.productInfoCodeIds),
			'rightStrandIds':JSON.stringify($scope.checkedStrandsAndCodesObj.rightStrandIds),
			'rightStrandRestrictionIds':JSON.stringify($scope.checkedStrandsAndCodesObj.rightStrandRestrictionIds)}, function(data){
		    //console.log("loadCommentsForRightStrandsAndCodes data %o ", data);
			$("#strand-sidepanel-response").addClass("successClass");	    	
			$("#strand-sidepanel-check").addClass("displayInline");
			$("#strand-sidepanel-spinner-message").html("Loaded comments...");
			$("#strand-sidepanel-spinner").removeClass("displayInline");
			setTimeout(function() {
			  $("#strand-sidepanel-check").removeClass("displayInline");			  
			  $("#strand-sidepanel-response").removeClass("displayInline");		  
			}, erm.statusIndicatorTime);			
			for (var i = 0; i < data.length; i++) {	
			  //console.log("loadCommentsForRightStrandsAndCodes data[i] %o ", data[i]);
			  //console.log("loadCommentsForRightStrandsAndCodes data[i].comment.publicInd %o ", data[i].comment.publicInd);
			  if ((data[i].comment.publicInd == 1 || data[i].comment.publicInd == null) || (($scope.security.isBusiness && data[i].comment.business && $scope.security.canViewPrivateComments) || (!$scope.security.isBusiness && data[i].comment.legal && $scope.security.canViewPrivateComments))) {
				//console.log("loadCommentsForRightStrandsAndCodes data[i].entityTypeId " + data[i].entityTypeId);
				if (data[i].entityTypeId == 2) {
				  $scope.rightStrandStrandComments.push(data[i]);	
				}
				if (data[i].entityTypeId == 3) {
				  $scope.rightStrandInfoCodeComments.push(data[i]);	
				}
				if (data[i].entityTypeId == 4) {
				  $scope.productInfoCodeComments.push(data[i]);	
				}
				$scope.rightStrandComments.push(data[i]);
			  }
			}
			if (loadAll) {				
				$scope.rightStrandCommentsCount = $scope.rightStrandComments.length; 
				$scope.rightStrandStrandCommentsCount = $scope.rightStrandStrandComments.length;
				$scope.rightStrandInfoCodeCommentsCount = $scope.rightStrandInfoCodeComments.length;
				$scope.productInfoCodeCommentsCount = $scope.productInfoCodeComments.length;
				$scope.checkedStrandsAndCodesObj.productInfoCodeIds = [];
				$scope.checkedStrandsAndCodesObj.rightStrandIds = [];
				$scope.checkedStrandsAndCodesObj.rightStrandRestrictionIds = [];												
				$scope.rightStrandOrRestrictionChecked = false;
			}			
			if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
			  $scope.$apply();
			}
		}).fail(function(xhr,status,message){
			$("#strand-sidepanel-response").addClass("deletedClass");	    				
			$("#strand-sidepanel-spinner-message").html("Could not load comments: " + xhr.responseText);
			errorPopup.showErrorPopupWindow(xhr.responseText);
			if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
			  $scope.$apply();
		});
	};
	
	$scope.checkEntityItems = function checkEntityItems(entityTypeId, commentId, entityIdListMap, uncheckAll) {
		//console.log("displayCommentInfo entityIdListMap %o", entityIdListMap);
		if (uncheckAll) {
  	      gridStrandsConfigurator.unCheckRightStrandElements();
  	      productRestrictionsGridConfigurator.unCheckProductRestrictions();
		}
	    if (entityIdListMap != null) {
	      // STRANDS (2L) 	
	      //console.log("displayCommentInfo entityIdListMap[commentId] %o", entityIdListMap[commentId]);
	      if (entityTypeId == 2 && entityIdListMap[commentId] != null && entityIdListMap[commentId].length > 0) {
	    	gridStrandsConfigurator.checkSelectedRightStrandElements(entityIdListMap[commentId], true);
		    gridStrandsConfigurator.selectStrandsInGrid(entityIdListMap[commentId]);
	      }
	      
	      // STRAND_RESTRICTION(3L)
	      if (entityTypeId == 3 && entityIdListMap[commentId] != null && entityIdListMap[commentId].length > 0) {	    	  	    		    	 
	    	gridStrandsConfigurator.checkSelectedRightStrandRestrictions(entityIdListMap[commentId], true);
	    	gridStrandsConfigurator.selectStrandRestrictionsInGrid(entityIdListMap[commentId]);
	    	
	    	//gridStrandsConfigurator.expandPassedStrands([25843993, 25855500, 25855510]);
	    	var strandRestrictionMap = gridStrandsConfigurator.getStrandsMapByRestrictionIds(entityIdListMap[commentId]);
	    	var rightStrandIds = [];
	    	for (var i = 0; i < entityIdListMap[commentId].length; i++){
	          if (strandRestrictionMap[entityIdListMap[commentId][i]] != null && $.inArray(strandRestrictionMap[entityIdListMap[commentId][i]], rightStrandIds) == -1) {
	    	 	 rightStrandIds.push(strandRestrictionMap[entityIdListMap[commentId][i]]);	
	    	  }
	    	}
	    	//console.log("rightStrandIds %o", rightStrandIds);
	    	gridStrandsConfigurator.expandPassedStrands(rightStrandIds);
	      }
	      
	      // PROD_RSTRCN(4L)
	      if (entityTypeId == 4 && entityIdListMap[commentId] != null && entityIdListMap[commentId].length > 0) {	    	
	        productRestrictionsGridConfigurator.checkSelectedProductRestrictions(entityIdListMap[commentId], true);
	        productRestrictionsGridConfigurator.selectRestrictionsInGrid(entityIdListMap[commentId]);
	      }		   
	      
	  	}		
	};
	
	$scope.displayCommentInfo = function(hasMultipleEntityComments, entityTypeId, entityId) {				
		
		if (entityTypeId == erm.dbvalues.entityType.STRAND) {
			if ($scope.checkedStrandsAndCodesObj.rightStrandMap != null) {
			  if ($scope.checkedStrandsAndCodesObj.rightStrandMap[entityId] != null) {
			    if (hasMultipleEntityComments) { 
			      return "Rights Strands: Multiple";
			    } else {
			      return "Rights Strands: " + $scope.checkedStrandsAndCodesObj.rightStrandMap[entityId].description;
			    }
			  }
			}
		} else if (entityTypeId == erm.dbvalues.entityType.STRAND_RESTRICTION) {
		    if ($scope.checkedStrandsAndCodesObj.rightStrandRestrictionMap != null) {
			  if ($scope.checkedStrandsAndCodesObj.rightStrandRestrictionMap[entityId] != null) {
			    if (hasMultipleEntityComments) {
			      return "Strand Informational Code: Multiple";
			    } else {
			      return "Strand Informational Code: " + $scope.checkedStrandsAndCodesObj.rightStrandRestrictionMap[entityId].description;
			    }
			  }
		    }
		} else if (entityTypeId == erm.dbvalues.entityType.PROD_RSTRCN) {
			if ($scope.checkedStrandsAndCodesObj.productInfoCodeMap != null) {
			  if ($scope.checkedStrandsAndCodesObj.productInfoCodeMap[entityId] != null) {
			    if (hasMultipleEntityComments) {
			      return "Info Code: Multiple";
			    } else {
			      return "Info Code: " + $scope.checkedStrandsAndCodesObj.productInfoCodeMap[entityId].description;
			    }
			  }
			}
		}
	};
	
});

app.controller('ProductSearchResultsController',function ProductSearchResultsController($scope,$route,$log,productService,sharedStateService){
	$scope.filterResults="";
	$scope.results={
			sortBy:'title',
			showCheckboxes: false,
			reverse: false,
			includeHasRights: true,
			clearSort: function() {
				this.sortBy ='title';
				this.reverse = false;
			},
			setSortColumn: function(column) {
				if (this.sortBy===column) {
					this.reverse=!this.reverse;
				} else {
					this.reverse=false;
					this.sortBy=column;
				}
			},
			isSorted:function(column) {
				return this.sortBy===column;
			},
			isAscending:function() {
				return !this.reverse;
			},
			crossProductCheckAll : false,
			crossProductCheckAllChanged:function() {
			  console.log("Is check all checked: %o", this.crossProductCheckAll);
			  var crossProductCheckboxes = $(".cross-product-checkbox");
			  if (crossProductCheckboxes != null) {
			    for (var index = 0; index < crossProductCheckboxes.length; index++) {			  
				  crossProductCheckboxes[index].checked = this.crossProductCheckAll;				    	    			
			    }
			  }			  		 
			}
	};
	
	 $scope.clearFilter = function() {
		return $scope.filterResults = ""; 
	 };
	
	 $scope.isShowTotal = function() {
		 return $scope.showTotal;
	 };
	 
	 $scope.isShowSearch = function() {
		return $scope.showSearch; 
	 };
	 
	 
	 
	 $scope.isProductVersionsExpanded = function(product) {
		 if (product.versions===null||product.versions===undefined||product.versions.length==0) {
			 return false;
		 }
		 return product.versionsExpanded=== undefined||product.versionsExpanded;
	 };
	 
	 /**
	  * Expands the product versions of a product.
	  * If the product versions of the product are fetched already then
	  * the <div> containing the product versions just shows/hides.
	  * If the product versions are not fetched. Then an invocation to the productService is made
	  * to fetch product versions. And mark the model as expanded.
	  */
	 $scope.doToggleProductVersions = function(product) {
		 $log.log("Getting product versions for: %o",product);
		 $log.log("Product strandsQuery: ", product.strandsQuery);
		 var foxId = product.foxId;
		 if (product!=null) {
			 product.expanding = true;
			 product.checkedChildren = true;
			 product.hasChildren = true;			 
			 var searchCompleted = function(products) {				 		 
				 var rcscope = angular.element(document.getElementById("productSearchController")).scope();
				 console.log("Finished getting product versions products: %o", products);
				 // set WPRMap for Cross Product Search
				 var psscope = angular.element(document.getElementById("productSearchController")).scope();
				 for (var index = 0; index < products.length; index++) {				   
				   var thisProduct = products[index].product;
				   thisProduct.versionTitle = products[index].versionTitle;
				   thisProduct.foxVersionId = products[index].foxVersionId;				   
				   psscope.crossProduct.WPRMap[products[index].foxVersionId] = thisProduct;
				   console.log("Adding version to WPRMap %o", thisProduct);
				 }
				 setTimeout(function(){ 
				   if (rcscope.productSearch.isModal) {					  			  
					 $(".searchResultsProductTitle").addClass("disableLink");  			  			
					 $(".searchResultsProductTitle").attr("disabled", true);
				   } else {
				     $(".searchResultsProductTitle").removeClass("disableLink");
				     $(".searchResultsProductTitle").attr("disabled", false);
				   }
				 }, 100);
			 };			 
			 if (!product.versions||product.versions.length==0) {				 
				 var productVersions = productService.findProductVersionsExcludeDefault(foxId, product.strandsQuery, product, searchCompleted);
				 product.versions = productVersions;
				 product.versionsExpanded=true;
				 product.versionsFetched=true;
			 } else {
				 product.expanding = false;
				 if (product.versionsExpanded===undefined) {
					 product.versionsExpanded=true;
				 }				 
				 product.versionsExpanded=!product.versionsExpanded;
			 }			 
		 }		 					 	
	 };
	 
	 /**
	  * Selects a product and the version of the  from the product search.
	  * Puts the selected product and version in the sharedState service and then redirects to
	  * the rights page.
	  * @param product. The product (this is the title level product, is not a version)
	  * @param version. The productVersion. This might be null. (if the versions were never expanded)
	  * 
	  */
	 $scope.doSelectProduct = function(product,version) {
		 if ($("#template_addEditContractualParty").data("kendoWindow"))
		   $("#template_addEditContractualParty").data("kendoWindow").destroy();
		 
		 //TMA debug: trying to find out how financialDivisionDesc gets lost between
		 //now and sharedStateService.setCurrentProduct
		 console.log("TMA debug: product.financialDivisionDesc before sharedStateService: ", product.financialDivisionDesc);
		 $log.log("product selected %o version %o",product,version);
		 var rcscope = angular.element(document.getElementById("rightsController")).scope();
		 if (rcscope == null || (product.defaultVersionId != rcscope.foxVersionId))
		   showLoadingPopupWindow();
		 sharedStateService.setCurrentProduct(product,version);		 
		 console.log("TMA debug: product.financialDivisionDesc after sharedStateService ", product.financialDivisionDesc);
		 
		 var pscScope = angular.element(document.getElementById("productSearchController")).scope();		 
		 $(".productResults").animate({ opacity: 0 },500 , function() {
		        $(this).css('display','none');
		 });	 
		 $(".rightsController").animate({ opacity: 1 },500);
		 $(".ermSidePanelOuter").animate({ opacity: 1 },500);		 
		 setTimeout(function(){ 
			 pscScope.productSearch.isCrossProduct = true;
			 pscScope.toggleCrossProduct();
			 pscScope.productSearch.productSearchCompleted = false;
			 pscScope.productSearch.searchExecuted = false;
			 pscScope.productSearch.searchInProgress = false;		 
			 pscScope.productSearch.isAdvancedSearchCollapsed = true;
			 pscScope.productSearch.errorMessage = null;
			 pscScope.productSearch.clearOptions();
			 if (pscScope.$root.$$phase != '$apply' && pscScope.$root.$$phase != '$digest') {
				 pscScope.$apply();
			 }			 
		 }, 500);
	 };
	 
	 /**
	  * Clears the search results and search options allowing you to start a new search
	  * 
	  */
	 $scope.doClearResults = function() {		 		 		
		 var rcscope = angular.element(document.getElementById("productSearchController")).scope();		 
		 rcscope.productSearch.productSearchCompleted = false;
		 rcscope.productSearch.searchExecuted = false;
		 rcscope.productSearch.searchInProgress = false;		 
		 rcscope.productSearch.isAdvancedSearchCollapsed = true;
		 rcscope.productSearch.errorMessage = null;
		 rcscope.doClearCriteria();
	 };
	 
	 /**
	  * Hides search results and advanced search options 
	  * 
	  */
	 $scope.doHideSearchResults = function() {
		 console.log("doHideSearchResults ");
		 var rcscope = angular.element(document.getElementById("productSearchController")).scope();		 		 
		 $(".productResults").animate({ opacity: 0 },500 , function() {
		        $(this).css('display','none');
		 });
		 $(".rightsController").animate({ opacity: 1 },500);
		 $(".ermSidePanelOuter").animate({ opacity: 1 },500);
		 setTimeout(function(){ 
			 rcscope.productSearch.productSearchCompleted = true;
			 if (!rcscope.productSearch.isModal)
			   rcscope.productSearch.isAdvancedSearchCollapsed = true;
			 rcscope.productSearch.errorMessage = null;
			 rcscope.productSearch.isCrossProduct = true;
			 rcscope.toggleCrossProduct();
			 if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest')
				 rcscope.$apply();			 
		 }, 500);
	 };
	 
	 /**
	  * Shows search results 
	  * 
	  */
	 $scope.doShowSearchResults = function() {
		 var rcscope = angular.element(document.getElementById("productSearchController")).scope();
		 var resultsScope = angular.element(document.getElementById("erm-product-search-results")).scope();
		 $(".productResults").css('display','block');
		 $(".productResults").animate({ opacity: 1 },500);		 
		 setTimeout(function(){ 
			 rcscope.productSearch.searchExecuted = true;	
			 rcscope.productSearch.productSearchCompleted = true;			 
			 if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest') {
				 rcscope.$apply();
			 }
			 if (isModal) {
			   resultsScope.results.showCheckboxes = true;			   
			   $(".productResults").removeClass("productResultsModal");
			   console.log("Added disableLink");
			   $(".searchResultsProductTitle").addClass("disableLink");
			   $(".searchResultsProductTitle").attr("disabled", true);
		 	 }
		 }, 500);
	 };
	 
}); 

/**
 * Product search controllers.
 * Performs basic and advanced serach.
 * Possible wildcard search types are:
 * 'C': Contains (this is the default0
 * 'S': Starts with
 * 'E': ends with
 * 'EQ': equal
 */
app.controller('ProductSearchController',function ProductSearchController($scope,$route,$filter,$log,productService,utilService,sharedStateService,confirmationStatusService,businessConfirmationStatusService,crossProductCopyService){
		
		var defaultMaxResults = 2000; 
		var minCharactersBasicSearch = 2;
		var defWildcardType = 'C';
		var defIDType = 'WPR';
		
		$(".crossProductSourceInput").val("");
		
		// set enter key commands for all search buttons on their input fields		
		$("#searchByTitleBasicInput").keypress(function(event){
		  if(event.keyCode == 13) {		
		    $("#searchByTitleBasicButton").click();
		    return false;
		  }
		});
		$("#searchByTitleAdvancedInput").keypress(function(event){		  		  
		  if(event.keyCode == 13) {
		    $("#searchByTitleAdvancedButton").click();
		    return false;
		  }
		});
		$("#searchByIDAdvancedInput").keypress(function(event){
		  if(event.keyCode == 13) {
		    $("#searchByIDAdvancedButton").click();
		    return false;
		  }
		});
		$("#searchFoxipediaAdvancedInput").keypress(function(event){
		  if(event.keyCode == 13) {
		    $("#searchFoxipediaAdvancedButton").click();
		    return false;
		  }
		});
		
		$scope.legalConfirmationStatus = confirmationStatusService.getLegalConfirmationStatus();
		
		$scope.businessConfirmationStatus = businessConfirmationStatusService.getBusinessConfirmationStatus();
		
		$scope.getCheckedCrossProductItems = function() {
		  var checkedWPRIds = new Array();
		  var crossProductCheckboxes = $(".cross-product-checkbox");
		  if (crossProductCheckboxes != null) {
		    for (var index = 0; index < crossProductCheckboxes.length; index++) {			  
			  if (crossProductCheckboxes[index].checked)
			    checkedWPRIds.push(crossProductCheckboxes[index].value);			    			 
		    }
		  }		  
		  return checkedWPRIds;
		};
		
		$scope.setCrossProductCopySource = $(".setCrossProductCopySource").click(function(event){		  
		  event.preventDefault();
		  //AMV 11/20/2014 this was defined as global
		  var checkedWPRIds = $scope.getCheckedCrossProductItems();
		  $scope.crossProduct.source = null;
		  if (checkedWPRIds.length == 0 || checkedWPRIds.length > 1) {			  
		    $(".crossProductErrorParagraph").html("You must check one and only one source.");
			$(".crossProductErrorDiv").addClass("displayInline");
		  } else {			 
			$(".crossProductErrorParagraph").html("");
		    $(".crossProductErrorDiv").removeClass("displayInline");		  
			$scope.crossProduct.source = checkedWPRIds;
			var stringBuilder = [];
			var sourceProduct = $scope.crossProduct.WPRMap[$scope.crossProduct.source[0]];
			//console.log("sourceProduct: %o", sourceProduct);
			var finProductId = sourceProduct.financialProductId || "";
		    var productTitle = sourceProduct.title != null && sourceProduct.title.length > 20 ? 
		    		finProductId + ": " + sourceProduct.title.substr(0,20) + "..." : finProductId + ": " + sourceProduct.title;
			stringBuilder.push(productTitle);									
			$(".crossProductSourceInput").val(stringBuilder.join(""));		
			// Check if source already exists in target, if so, remove from targeted list
			if ($.inArray($scope.crossProduct.source[0], $scope.crossProduct.targets) > -1) {
			  $scope.crossProduct.targets.splice($.inArray($scope.crossProduct.source[0], $scope.crossProduct.targets), 1);			  						  			  		  
		    }
			if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
			  $scope.$apply();			
			$scope.appendCrossProductOptions();
		  }
		});
		
		$scope.appendCrossProductOptions = function() {
			console.log(" REACHED : (controller.js:1215");
			$(".crossProductTargetsArea").empty();
			for (var index = 0; index < $scope.crossProduct.targets.length; index++) {
			  var targetProduct = $scope.crossProduct.WPRMap[$scope.crossProduct.targets[index]];
			  var finProductId = targetProduct.financialProductId || "";
			  var productTitle = targetProduct.title != null && targetProduct.title.length > 15 ? 
					  finProductId + ": " + targetProduct.title + (targetProduct.versionTitle != null ? " / " + targetProduct.versionTitle : "") : finProductId + ": " + targetProduct.title + (targetProduct.versionTitle != null ? " / " + targetProduct.versionTitle : "");
			  //console.log("appending %o", $scope.crossProduct.targets[index], " and text %o", productTitle);			  
			  //console.log("targetProduct: %o", targetProduct);			  
			  $(".crossProductTargetsArea").append($("<option></option>")
		       .attr("value",$scope.crossProduct.targets[index])
		       .attr("title",productTitle)
		       .text(productTitle));							
			}
			$(".crossProductTargetsArea").click();
		};
		
		$scope.removeCrossProductTarget = $(".removeCrossProductTarget").click(function(event){
			event.preventDefault();
			var selectedTargetsToRemove = new Array();			
		    $('.crossProductTargetsArea').find(":selected").each(function(elem) {
		    	console.log("$(this).val(): %o", $(this).val());
		    	selectedTargetsToRemove.push($(this).val());
		    });		    
			if (selectedTargetsToRemove.length > 0) {
			  console.log("1 $scope.crossProduct.targets %o", $scope.crossProduct.targets);
			  for (var index = 0; index < selectedTargetsToRemove.length; index++) {
			    $scope.crossProduct.targets.splice($.inArray(selectedTargetsToRemove[index], $scope.crossProduct.targets), 1);
			  }
			  console.log("2 $scope.crossProduct.targets %o", $scope.crossProduct.targets);
			  if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
				$scope.$apply();
			  $scope.appendCrossProductOptions();
			} else {
			  $(".crossProductErrorParagraph").html("You must select a target to remove.");
			  $(".crossProductErrorDiv").addClass("displayInline");
			}			
		});
		
		$(".setCrossProductCopyTargets").unbind();
		$scope.setCrossProductCopyTargets = $(".setCrossProductCopyTargets").click(function(event){		  
		  event.preventDefault();		 
		  var checkedWPRIds = $scope.getCheckedCrossProductItems();
		  if (checkedWPRIds.length == 0) {			  
		    $(".crossProductErrorParagraph").html("You must check at least one target.");
			$(".crossProductErrorDiv").addClass("displayInline");
		  } else {
			$(".crossProductErrorParagraph").html("");
		    $(".crossProductErrorDiv").removeClass("displayInline");
		    // remove source from target if exists
		    if ($scope.crossProduct.source != null && $scope.crossProduct.source.length > 0) {
			  if ($.inArray($scope.crossProduct.source[0], checkedWPRIds) > -1)
			    checkedWPRIds.splice($.inArray($scope.crossProduct.source[0], checkedWPRIds), 1);			  
		    }	
		    
		    // remove any checked targeted items that have already been targeted
		    var deDupedWPRIds = [];
		    for (var index = 0; index < checkedWPRIds.length; index++) {
		      if ($.inArray(checkedWPRIds[index], $scope.crossProduct.targets) == -1)
		        deDupedWPRIds.push(checkedWPRIds[index]);
		    }	
			$scope.crossProduct.targets = $scope.crossProduct.targets.concat(deDupedWPRIds);
			$scope.appendCrossProductOptions();
		
			if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
			  $scope.$apply();			
		  }
		});
		
		$scope.clearCrossProductSource = function() {
			console.log("Inside clearCrossProductSource");
		    var psscope = angular.element(document.getElementById("productSearchController")).scope();
		    psscope.crossProduct.source = null;			
			$(".crossProductSourceInput").val("");
		    if (psscope.$root.$$phase != '$apply' && psscope.$root.$$phase != '$digest') {
			  psscope.$apply();
		    }
		};
		$(".clearCrossProductSource").unbind();
		$(".clearCrossProductSource").click(function(event){
			event.preventDefault();
			$scope.clearCrossProductSource();
		  }
		);
		
		$scope.clearCrossProductItemsBoxes = function() {
			var psscope = angular.element(document.getElementById("productSearchController")).scope();		    
		    psscope.crossProduct.copyClearanceMemo = false;
		    psscope.crossProduct.copySubrights = false;
		    psscope.crossProduct.copySalesAndMarketing = false;
		    psscope.crossProduct.copyRightStrandsAndCodes = false;
		    psscope.crossProduct.copyProductInfoCodes = false;
		    psscope.crossProduct.copyCommentsAndAttachments = false;
		    psscope.crossProduct.copyContacts = false;
		    psscope.crossProduct.copyContractualParties = false;
		    psscope.crossProduct.deleteRightStrandsAndCodes = false;
		    psscope.crossProduct.deleteProductInfoCodes = false;
		    psscope.crossProduct.deleteCommentsAndAttachments = false;
		    if (psscope.$root.$$phase != '$apply' && psscope.$root.$$phase != '$digest') {
			  psscope.$apply();
		    }
		};
		$(".clearCrossProductItemsBoxes").unbind();
		$(".clearCrossProductItemsBoxes").click(function(event){
			event.preventDefault();
			$scope.clearCrossProductItemsBoxes();   
		  }
		);
		
		$scope.clearCrossProductTargets = function() {
			console.log("Inside clearCrossProductTargets");
			var psscope = angular.element(document.getElementById("productSearchController")).scope();
			psscope.crossProduct.targets = [];
			psscope.crossProduct.targetsValue = [];
			$(".crossProductTargetsArea").empty();
			if (psscope.$root.$$phase != '$apply' && psscope.$root.$$phase != '$digest') {
			  psscope.$apply();
			}
		};
		$(".clearCrossProductTargets").unbind();
		$(".clearCrossProductTargets").click(function(event){		  
			event.preventDefault();
			$scope.clearCrossProductTargets();		
		  }
		);
		
		$scope.currentCrossProductTab = 'copy';	

		$scope.switchCrossProductTabs=function(tabName) {		
		  $scope.crossProduct.source = null;
		  if (tabName == 'copy' && $scope.currentCrossProductTab != 'copy') {			
			$scope.currentCrossProductTab = 'copy';
		  } else if (tabName == 'link' && $scope.currentCrossProductTab != 'link') {			
			$scope.currentCrossProductTab = 'link';
		  } else if (tabName == 'delete' && $scope.currentCrossProductTab != 'delete') {					
			$scope.currentCrossProductTab = 'delete';
		  } else if (tabName == 'update' && $scope.currentCrossProductTab != 'update') {					
			$scope.currentCrossProductTab = 'update';
		  } else if (tabName == 'sync' && $scope.currentCrossProductTab != 'sync') {					
			$scope.currentCrossProductTab = 'sync';
		  }
		};
		
		$scope.togglePasteFromExcel = function() {
		  $scope.productSearch.isPasteFromExcelToggle = !$scope.productSearch.isPasteFromExcelToggle;			
		};
		
		$scope.parsePastedExcelCodes = function() {
			//console.log("pastedExcelCodes: %o", $("#pastedExcelCodes").val());			
			var regExp = "";			
			if ($scope.productSearch.idType != "WPR") {
			  regExp = /(\d+)/gi;
			} else {			
			  regExp = /(\w{6})/gi;
			}
			//console.log("matchedNumbers matches: %o", $("#pastedExcelCodes").val().match(regExp));
			var matchedNumbers = $("#pastedExcelCodes").val().match(regExp);			
			$("#pastedExcelCodes").val($("#pastedExcelCodes").val().replace(regExp, ""));
			var uniqueNumbers = [];
			var parsedExcelIds = document.getElementById('parsedExcelIds');
			for (var i = 0; i < parsedExcelIds.length; i++) {				
			  uniqueNumbers.push(parsedExcelIds.options[i].value);				
			}
			//console.log("1 uniqueNumbers %o", uniqueNumbers);
			if (matchedNumbers != null) {
			  $.each(matchedNumbers, function(i, el){
			    if($.inArray(el, uniqueNumbers) === -1) uniqueNumbers.push(el);
			  });
			}
			//console.log("2 uniqueNumbers %o", uniqueNumbers);
			$(".parsedExcelIds").empty();
			for (var index = 0; index < uniqueNumbers.length; index++) {
			  //$("#searchByIDAdvancedInput").val(index > 0 ? $("#searchByIDAdvancedInput").val() + ", " + matchedNumbers[index] : matchedNumbers[index]);
			  $scope.productSearch.searchID = index > 0 ? $scope.productSearch.searchID + "; " + uniqueNumbers[index] : uniqueNumbers[index];			  
			  $(".parsedExcelIds").append($("<option></option>").attr("value",uniqueNumbers[index]).text(uniqueNumbers[index]));			  
			}
		};
		
		$scope.doClearPastedExcel = function() {
		  $('#pastedExcelCodes').val("");		  
		};
			
		$scope.doClearParsedExcel = function() {		  		
		  $scope.productSearch.searchID = "";
		  var uniqueNumbers = [];
		  var parsedExcelIds = document.getElementById('parsedExcelIds');		  
		  for (var i = 0; i < parsedExcelIds.length; i++) {
			if (parsedExcelIds.options[i].selected) {
			  $("#pastedExcelCodes").val($("#pastedExcelCodes").val().replace(/^\s*\n/gm, '') + "\n" + parsedExcelIds.options[i].value);			  			 
			} else {			
			  if($.inArray(parsedExcelIds.options[i].value, uniqueNumbers) === -1) { 
			    uniqueNumbers.push(parsedExcelIds.options[i].value);
			  }
			}
		  }
		  for (var i = parsedExcelIds.length-1; i>=0; i--) {
			if (parsedExcelIds.options[i].selected) {				  
			  parsedExcelIds.remove(i);			  	
			}
		  }
		  for (var index = 0; index < uniqueNumbers.length; index++) {
			$scope.productSearch.searchID = $scope.productSearch.searchID != "" ? $scope.productSearch.searchID + "; " + uniqueNumbers[index] : uniqueNumbers[index];			  
		  }
		};
		
		$scope.clearCrossProductIfEmpty = function clearCrossProductIfEmpty() {
			//TODO implement
			//clear cross product if it the scope for targest is empty
		};
		
		
		 $scope.showXProductOptions = function showXProductOptions(show) {
				$scope.productSearch.showXProductOptions = show; 
		 };
		 
		 $scope.showFoxipediaSearchButton = function showFoxipediaSearchButton(show) {
			 	$scope.productSearch.showFoxipediaSearchButton = show;			 
		 };
			 
		 $scope.setXProductOperation = function setXProductOperation() {
			console.log("Settig xProructOperation to true");
			$scope.showXProductOptions(true); 
		 };
			 
			 
		 $scope.setReportSearch = function setReportSearch() {
			 $scope.showXProductOptions(false);
			 $scope.showFoxipediaSearchButton(false);

		 };
		
		 $scope.setCopySearch = function setCopySearch() {
			 $scope.showXProductOptions(false);
			 $scope.productSearch.isCopySearch=true;
			 $scope.showFoxipediaSearchButton(true);			 
		 };
		
		$scope.toggleCrossProduct= function(setXProductOperation) {			
			var resultsScope = angular.element(document.getElementById("erm-product-search-results")).scope();
			$scope.productSearch.isCrossProduct = !$scope.productSearch.isCrossProduct;
			var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
			$scope.clearCrossProductIfEmpty();
			if (setXProductOperation) {
				$scope.setXProductOperation();
			}
			if ($scope.productSearch.isCrossProduct) {
			  //$(".searchTypes").animate({width:'24%'},500);
			  //$(".crossProductTargetsArea").empty();					
			  //$scope.crossProduct.targets = [];		
			  $scope.toggleERMContent(true);			  
			  $(".ermSidePanelOuter").css("display", "none");		
			  $("#advanced-product-search-options").animate({width:'75.5%'},500);
			  $("#searchOptionsEntered").animate({width:'75.5%'},500);
			  $(".productResults").animate({width:'75.5%'},500);			  			  			 
			  $("#searchingForProducts").animate({width:'75.5%'},500);
			  $("#productSearchErrorMessage").animate({width:'75.5%'},500);
			  if (!$scope.productSearch.isModal) {
			    $(".crossProductItems").animate({width:'22.5%'},500);
			    $(".crossProductSubmit").show();
			  }
			  $("#crossProductChevron").removeClass("icon-chevron-left");
			  $("#crossProductChevron").addClass("icon-chevron-right");	
			  resultsScope.results.showCheckboxes = true;		  			    		 
			  $('.productResults').css("max-height", (h - 250));			  
			} else {
			  //$(".searchTypes").animate({width:'32.5%'}, 500);
			  $scope.toggleERMContent(false);
			  if ($scope.security.canUseProductSidePanel) {
			    $(".ermSidePanelOuter").css("display", "block");
			  }
			  if (!$scope.productSearch.isModal)
			    $(".crossProductItems").animate({width:'0%'},500);
			  $("#advanced-product-search-options").animate({width:'99%'},500);
			  $(".productResults").animate({width:'98.5%'},500);
			  $("#searchingForProducts").animate({width:'98.5%'},500);			  
			  $("#searchOptionsEntered").animate({width:'98.5%'},500);
			  $("#productSearchErrorMessage").animate({width:'99%'},500);
			  $("#crossProductChevron").removeClass("icon-chevron-right");
			  $("#crossProductChevron").addClass("icon-chevron-left");
			  $('.productResults').css("max-height", "none");
			  resultsScope.results.showCheckboxes = false;
			}
		};
		
		$scope.toggleCrossProductClearanceTOCPanel= function() {
			if ($scope.crossProduct.copyClearanceMemo) {
			  $scope.crossProduct.showCrossProductClearanceTOCPanel = !$scope.crossProduct.showCrossProductClearanceTOCPanel;
			  if ($scope.crossProduct.showCrossProductClearanceTOCPanel) {
			    $(".crossProductClearanceTOCPanel").animate({right:'27%'},500);			  
			    console.log("foxVersionId %o ", $scope.crossProduct.source[0]);
  			    // load the source clearance memo
			    if ($scope.crossProduct.source[0] != $scope.crossProduct.lastLoadedSource) {
			      clearanceMemoKendoElementInit.clearanceMemoObject.loadCrossProductClearenceTOCPanel($scope.crossProduct.source[0]);
			      $scope.crossProduct.lastLoadedSource = $scope.crossProduct.source[0];
			    }
			  } else {			  
 			    $(".crossProductClearanceTOCPanel").animate({right:'200%'},500);
		      }
			}
			return false;
		};
		
		$scope.removeHighlighting = function() {
		  var allOptions = $(".crossProductClearanceTOCSelectArea").children('li');
		  allOptions.removeClass('backgroundColorHighlight');
		};
		
		$scope.xProductDelete = function xProductDelete() {			
			var preValidationError = false;
			var successMessageDiv = ".crossProductDeleteSuccessDiv";
			var successErrorParagraph = ".crossProductDeleteSuccessParagraph";
			var messageDiv=".crossProductDeleteErrorDiv";
			var paragraph = ".crossProductDeleteErrorParagraph";
			var sections = [];
			var cf = new confirmationPopup();
			$(paragraph).html("");
			
			if ($scope.crossProduct.deleteSubrights) {
			  sections.push(erm.copySection.subrights);
			}
			if ($scope.crossProduct.deleteSalesAndMarketing) {			  				 
			  sections.push(erm.copySection.salesAndMarketing);
			}
			if ($scope.crossProduct.deleteRightStrandsAndCodes) {
			  sections.push(erm.copySection.strands);
			}
			if ($scope.crossProduct.deleteProductInfoCodes) {
			  sections.push(erm.copySection.infoCodes);
			}
			if ($scope.crossProduct.deleteCommentsAndAttachments) {
			  sections.push(erm.copySection.comments);
			}
			if ($scope.crossProduct.deleteClearanceMemo) {
			  sections.push(erm.copySection.clearanceMemo);
			}
			if (sections.length == 0) {
				  $(paragraph).html($(paragraph).html() +  "You must check at least one section to delete.<BR/>");
				  $(messageDiv).addClass("displayInline");
				  preValidationError = true;
			} else {
				$(messageDiv).removeClass("displayInline");
			}
			var sectionsText = "";
			for (var i = 0; i < sections.length; i++) {
			  if (i > 0) {
				sectionsText += ", ";
			  }
			  sectionsText += toTitleCase(sections[i].replace("_", " "));
			}
		    var confirmationText = "Are you sure you want to delete <BR/> " + sectionsText + " <BR/> from the products?";
		    console.log("sections %o ", sections);
		    console.log("confirmationText %o ", confirmationText);
		    console.log("$scope.crossProduct.targets %o ", $scope.crossProduct.targets);
			var confirmationButtonText = "Yes, Delete";
			
			var data={};
			data.sections={"sections":sections};
			data.foxVersionIds=$scope.crossProduct.targets;
			var onSuccess = function onXProductDelete(data) {
				console.log("Created XProduct delete job: " + data.id);				
				$(successMessageDiv).addClass("displayInline");	
				$(successErrorParagraph).html("Delete Job Successfully Created! <BR>Please check progress of operation in My Jobs");
				var psscope = angular.element(document.getElementById("productSearchController")).scope();
			    psscope.crossProduct.source = null;
			    psscope.crossProduct.targets = [];
			    psscope.clearCrossProductSource();
			    psscope.clearCrossProductTargets();
			    psscope.clearCrossProductItemsBoxes();
				if (psscope.$root.$$phase != '$apply' && psscope.$root.$$phase != '$digest') {
				  psscope.$apply();
			    }
				setTimeout(function(){
				  //$(".crossProductSuccessDiv").removeClass("displayInline");
				 /* $scope.popJobsController();					  
				  var jobsScope = angular.element(document.getElementById("jobsController")).scope();
				  jobsScope.getPendingJobs();
				  if (jobsScope.$root.$$phase != '$apply' && jobsScope.$root.$$phase != '$digest') {
					jobsScope.$apply();
				  } */
				}, eval(erm.statusIndicatorTime));				
			};
			
			var doDelete = function doDelete() {
				crossProductCopyService.xDelete(data,onSuccess);				
			};
			

			
			if (!preValidationError) {
				  cf = new confirmationPopup();
				  cf.initializeElement();           
				  cf.openConfirmationWindow("#confirmationPopupWindow", confirmationText, confirmationButtonText, {}, doDelete);				
			}
		};
		
		$scope.xProductCopySubmitAndValidate = function xProductCopySubmitAndValidate() {			
			var preValidationError = false; 
			$(".crossProductErrorParagraph").html("Validation Errors <BR/>");
			if ($scope.crossProduct.source == null) {			  
			  $(".crossProductErrorParagraph").html($(".crossProductErrorParagraph").html() + "You must set a source to copy from.<BR/>");
			  $(".crossProductErrorDiv").addClass("displayInline");
			  preValidationError = true;
			} 
			if ($scope.crossProduct.targets == null || $scope.crossProduct.targets.length == 0) {			  
			  $(".crossProductErrorParagraph").html($(".crossProductErrorParagraph").html() + "You must set at least one target to copy to.<BR/>");
			  $(".crossProductErrorDiv").addClass("displayInline");
			  preValidationError = true;
			}
			// var clearanceMemoCommentIds;
			var sections = [];
			var clearanceMemoCommentIds = [];
			if ($scope.crossProduct.copyClearanceMemo) {
		      sections.push(erm.copySection.clearanceMemo);
		      console.log();
		      if (!$scope.crossProduct.copyClearanceMemoAllSections && $scope.crossProduct.copyClearanceMemoSections.length == 0) {
		        $(".crossProductErrorParagraph").html($(".crossProductErrorParagraph").html() + erm.copySection.clearanceMemo + ": No clearance memo sections have been selected to copy.<BR/>");
			    $(".crossProductErrorDiv").addClass("displayInline");
			    preValidationError = true;
		      } else if (!$scope.crossProduct.copyClearanceMemoAllSections) {
		    	clearanceMemoCommentIds = $scope.crossProduct.copyClearanceMemoSections;
		      }
		    }				  
			if ($scope.crossProduct.copySubrights)
			  sections.push(erm.copySection.subrights);
			if ($scope.crossProduct.copySalesAndMarketing)
			  sections.push(erm.copySection.salesAndMarketing);
			if ($scope.crossProduct.copyRightStrandsAndCodes)
			  sections.push(erm.copySection.strands);
			if ($scope.crossProduct.copyProductInfoCodes)
			  sections.push(erm.copySection.infoCodes);				
			if ($scope.crossProduct.copyCommentsAndAttachments)
			  sections.push(erm.copySection.comments);
			if ($scope.crossProduct.copyContacts) {
			  sections.push(erm.copySection.contacts);
			}
			if ($scope.crossProduct.copyContractualParties) {
			  sections.push(erm.copySection.contractualParties);
			}
			
			//console.log("sections %o", sections);
			//console.log("clearanceMemoCommentIds %o", clearanceMemoCommentIds);
			if (sections.length == 0) {
			  $(".crossProductErrorParagraph").html($(".crossProductErrorParagraph").html() +  "You must check at least one section to copy.<BR/>");
			  $(".crossProductErrorDiv").addClass("displayInline");
			  preValidationError = true;
			}
			if (!preValidationError) {
			  $(".crossProductErrorDiv").removeClass("displayInline");
			  //console.log("pre validation succeeded: posting");
			  var jsonData = {
				'clearanceMemoCommentIds' : clearanceMemoCommentIds,
				'sections' : sections,
				'fromFoxVersionId' : $scope.crossProduct.source[0],
				'toFoxVersionIds' : $scope.crossProduct.targets				
			  };
			  $scope.validateCrossProductCopy(jsonData);			  
			  $scope.crossProduct.copyClearanceMemo = false;
			  $scope.crossProduct.copyClearanceMemoAllSections = true;
			  $scope.crossProduct.copyClearanceMemoSections = [];
			  $scope.crossProduct.copyClearanceMemoSectionsParentMap = [];
			}
		};
		
		/**
		 * Method responsible for validating cross product copy
		 */
		$scope.validateCrossProductCopy = function(jsonData){
			$(".crossProductSuccessDiv").addClass("displayInline");	
			$(".crossProductSuccessParagraph").html("<span class=\"icon-spinner icon-spin icon-small\"></span> Validating Cross Product Copy.  Please wait...");
			var validationComplete = function(response){
				var data = null;
				if (!response.validationOk) {
					data = response.errors;
				}
				if(data){
					$(".crossProductSuccessDiv").removeClass("displayInline");
					//console.log("validationComplete data: %o", data);
					if (data != null) {
						var errorCount = 0;
						for(var foxVersionID in data) {	
					      if(data.hasOwnProperty(foxVersionID)) {
					        errorCount++;
					      }					      
						}						
						if (errorCount > 0) {
						  //console.log("validation error");
						  for (var foxVersionID in data) {
						    //console.log("valiation error foxVersionID " + foxVersionID);
						    var product = $scope.crossProduct.WPRMap[foxVersionID];
						    var productTitle = product.title != null && product.title.length > 20 ? 
							  	  product.financialProductId + ": " + product.title.substr(0,20) + "..." : product.financialProductId + ": " + product.title;
						    $(".crossProductErrorParagraph").html($(".crossProductErrorParagraph").html() + productTitle + "<BR/>");
						    for (var index = 0; index < data[foxVersionID].sections.length; index++) {
						      $(".crossProductErrorParagraph").html($(".crossProductErrorParagraph").html() + "&nbsp;&nbsp;&nbsp;&nbsp;" + data[foxVersionID].sections[index] + " Conflicts<BR/>");					        
						    }
						  }
						  $(".crossProductErrorDiv").addClass("displayInline");				
						}
					}
				}  else {
					$(".crossProductSuccessDiv").addClass("displayInline");	
					$(".crossProductSuccessParagraph").html("Cross Product Copy Job Successfully Created! <BR>Please check progress of operation in My Jobs");
					var psscope = angular.element(document.getElementById("productSearchController")).scope();
				    psscope.crossProduct.source = null;
				    psscope.crossProduct.targets = [];
				    psscope.clearCrossProductSource();
				    psscope.clearCrossProductTargets();
				    psscope.clearCrossProductItemsBoxes();
					if (psscope.$root.$$phase != '$apply' && psscope.$root.$$phase != '$digest') {
					  psscope.$apply();
				    }
					
					 setTimeout(function(){
					 /*TMA: get rid of JOBs popup
					  //$(".crossProductSuccessDiv").removeClass("displayInline");
					  $scope.popJobsController();					  
					  var jobsScope = angular.element(document.getElementById("jobsController")).scope();
					  jobsScope.getPendingJobs();
					  if (jobsScope.$root.$$phase != '$apply' && jobsScope.$root.$$phase != '$digest') {
						jobsScope.$apply();
					  }
					  */
					}, eval(erm.statusIndicatorTime));
					
				}
			};
			crossProductCopyService.validateAndCopy(jsonData, validationComplete);
		};
						
		$scope.crossProduct={
				source: null,
				targets: [],
				targetsValue : [],
				copyClearanceMemo: false,
				copyClearanceMemoAllSections: true,
				copyClearanceMemoSections : [],
				copyClearanceMemoSectionsParentMap : [],
				lastLoadedSource : null,
				showCrossProductClearanceTOCPanel : false,
				copySubrights: false,
				copySalesAndMarketing: false,
				copyRightStrandsAndCodes: false,
				copyProductInfoCodes: false,
				copyCommentsAndAttachments: false,
				copyContacts:false,
				copyContractualParties:false,
				WPRMap: []
		};
				
		$scope.productSearch={
				 isCrossProduct: false,
				 isCopySearch : false,
				 isPasteFromExcelToggle: false,
				 showFoxipediaSearchButton: true, //note this will show the search foxipedia only if the user has access to confidential titles
				 searchByTitle: true,
				 searchByID: false,
				 title: null,
				 searchOptionsChanged: true,
				 searchID: null,
				 prodYearFrom: null,
				 prodYearTo: null,
				 wildcardType: defWildcardType,
				 idType : defIDType,
				 releaseYearFrom: null,
				 releaseYearTo: null,
				 selectedProductTypes: [],
				 searchExecuted : false,
				 searchInProgress: false,
				 includeAliases: false,
				 searchAliases: false,
				 showStrandOptions: false,
				 foxipediaGroupQ: null,
				 isAdvancedSearchCollapsed : true,
				 includeVersions: false,
				 includeHasRights: true,
				 contractualPartyTypeId: null,
				 contractualPartyId: null,
				 maxResults:defaultMaxResults,
				 errorMessage:null,
				 legalConfirmationStatus:null,
				 businessConfirmationStatus:null,
				 strandsQuery:null,
				 foxipediaSearch:false,
				 onlyConfidential:false,
				 isModal:false,
				 startSearch: function(){
					 this.searchExecuted = false;
					 this.searchInProgress = true;
					 this.productSearchCompleted=false;
					 this.foxipediaGroupSearchCompleted = false;					 
				 },
				 searchCompleted: function() {
					 this.searchExecuted = true;
					 this.searchInProgress = false;
					 this.searchOptionsChanged = false;
				 },				
				 isBasicSearch: function() {
					 return this.isAdvancedSearchCollapsed;
				 },
				 getIDTypeString: function() {				   
				   if (this.idType == "WPR")
					 //TMA BUG: 46849
				     //return "FIN PROD ID";
					   return "Financial Title ID (WPR ID)";
				   if (this.idType == "FOXID")
					 return "Fox ID";
				   if (this.idType == "FOXVERSIONID")
					 return "Fox Version ID";
				   if (this.idType == "JDEVERSIONID")
					 return "JDE Version ID";
				 },
				 getStrandsQueryString: function() {					 
					if (this.strandsQuery == "withLegalRightStrands")											
					  return "with legal right strands";
					if (this.strandsQuery == "withoutLegalRightStrands")											
				      return "without legal right strands";
				    if (this.strandsQuery == "withRightStrands")											
					  return "with business right strands";
					if (this.strandsQuery == "withoutRightStrands")											
					  return "without business right strands";
					if ($scope.productSearch.strandsQuery == 'true')											
					  return "with unsynced dates";					
				 },
				 getSelectedProductDescriptions: function() {
				   var productList = "";					 
				   for(var i = 0; i < this.selectedProductTypes.length; i++) {
					 if (productList != "")
						 productList += ", ";
				     productList += $scope.productTypesMap[this.selectedProductTypes[i]];
				   }
				   return productList;
				 },
				 getContractualPartyTypeDescription: function() {
				   if ($scope.productSearch.contractualPartyTypeId != null) {		
					 console.log("getContractualPartyTypeDescription: " + $scope.contractualPartiesMap[$scope.productSearch.contractualPartyTypeId]);
					 return $scope.contractualPartyTypesMap[$scope.productSearch.contractualPartyTypeId];
				   } else { 
				     return "";
				   }
				 },
				 getContractualPartyDescription: function() {
				   if ($scope.productSearch.contractualPartyId != null) {							 
					 return $scope.productSearch.contractualPartyId.shortDisplayName;
				   } else { 
				     return "";
				   }
				 },				 
				 getSelectedBusinessConfirmationStatus: function() {
					 var status = "";				
					 for (var i = 0; i < $scope.businessConfirmationStatus.length; i++) {
						 if ($scope.businessConfirmationStatus[i].confirmationStatusId == $scope.productSearch.businessConfirmationStatusId)
							 status = $scope.businessConfirmationStatus[i].confirmationStatusDescription;
					 }
					 return status;			      
				 },
				 getSelectedLegalStatus: function() {
					 var status = "";
					 for (var i = 0; i < $scope.legalConfirmationStatus.length; i++) {
						 if ($scope.legalConfirmationStatus[i].confirmationStatusId == $scope.productSearch.legalConfirmationStatusId)
							 status = $scope.legalConfirmationStatus[i].confirmationStatusDescription;
					 }
					 return status;			      
				 },
				 isAdvancedSearch: function() {
					 return !this.isBasicSearch();
				 },
				 isFoxipediaGroupSearch: function() {
					var isFoxipediaGroup = this.foxipediaGroupQ!=null && this.foxipediaGroupQ.length>0; 
					return isFoxipediaGroup;
				 },
				 isSearchByID: function() {							
				    return searchByID;
				 },
				 setAdvanced: function(isAdvanced) {
					this.isAdvancedSearchCollapsed=!isAdvanced; 
				 },
				 setWildcardType: function(type) {
					 this.wildcardType = type;
				 },
				 setSearchByTitle: function() {
					 this.searchByTitle = true;
					 this.searchByID = false;
					 if (this.foxipediaSearch) {
						 this.searchOptionsChanged = true;						 
					 }					 
					 this.foxipediaSearch = false;
					 this.searchID = null;
					 if (this.foxipediaGroupQ!=null) { 
 					   this.foxipediaGroupQ = null;
   					   this.searchOptionsChanged = true;
 					 }
				 },
				 setSearchByTitleFoxipedia: function() {
					 if (!this.foxipediaSearch) {
						 this.searchOptionsChanged = true;						 
					 }					 
					 this.foxipediaSearch = true; 
				 },			 
				 setSearchByID: function() {
					 this.searchByTitle = false;
					 this.searchByID = true;
					 this.title=null;
					 if (this.foxipediaGroupQ!=null) { 
 					   this.foxipediaGroupQ = null;
 					   this.searchOptionsChanged = true;
 					 }
				 },
				 setError: function(message) {
					this.errorMessage = message; 
				 },
				 clearError: function() {
					this.errorMessage=null; 
				 },				 
				 clearReleaseYear: function() {
					this.releaseYearFrom = null;
					this.releaseYearTo = null;
					$scope.checkValidNumber('', 'advancedSearch_releaseYearTo');
					$scope.checkValidNumber('', 'advancedSearch_releaseYearFrom');
				 },				
				 clearProdYear: function() {
					this.prodYearFrom = null;
					this.prodYearTo = null;
					$scope.checkValidNumber('', 'advancedSearch_prodYearTo');
					$scope.checkValidNumber('', 'advancedSearch_prodYearFrom');
				 },
				 clearOptions: function clearOptions() {
						this.isCopySearch = false;
						this.foxipediaGroupQ = null;
						this.includeAliases = true;
						this.showFoxipediaSearchButton = true;
						this.maxResults = defaultMaxResults;
						this.selectedProductTypes = [];
						this.searchID = null;
						this.releaseYearFrom = null;
						this.releaseYearTo = null;
						this.prodYearFrom = null;
						this.prodYearTo = null;
						this.wildcardType = defWildcardType;
						this.businessConfirmationStatusId=null;
						this.legalConfirmationStatus = null;
						this.BusinessConfirmationStatus = null;
						this.legalConfirmationStatusId=null;
						this.legalConfirmationStatus = null,
						this.businessConfirmationStatus = null,
						this.includeAlases=false;
						this.searchAliases=false;
						this.wildcardType = defWildcardType;
						this.idType = defIDType;
						this.showStrandOptions = false;
						this.strandsQuery = false;
						this.clearError();
						this.contractualPartyTypeId = null;
						this.contractualPartyId = null;
						this.onlyDefaultVersion = true;
						this.foxipediaSearch = false;
						this.onlyConfidential = false;
						$(".parsedExcelIds").empty();
						$scope.doClearPastedExcel();					
						$scope.checkValidNumber('', 'advancedSearch_prodYearTo');
						$scope.checkValidNumber('', 'advancedSearch_prodYearFrom');
						$scope.checkValidNumber('', 'advancedSearch_releaseYearTo');
						$scope.checkValidNumber('', 'advancedSearch_releaseYearFrom');
						$scope.checkValidNumber('', 'advancedSearch_maxResults');					 
				 },
				 clear: function() {
					this.isCopySearch = false;
					this.foxipediaGroupQ = null;
					this.includeAliases = true;
					this.showFoxipediaSearchButton = true;
					this.maxResults = defaultMaxResults;
					this.selectedProductTypes = [];
					this.title = null;
					this.searchID = null;
					this.releaseYearFrom = null;
					this.releaseYearTo = null;
					this.prodYearFrom = null;
					this.prodYearTo = null;
					this.wildcardType = defWildcardType;
					this.businessConfirmationStatusId=null;
					this.legalConfirmationStatus = null;
					this.BusinessConfirmationStatus = null;
					this.legalConfirmationStatusId=null;
					this.legalConfirmationStatus = null,
					this.businessConfirmationStatus = null,
					this.includeAlases=false;
					this.searchAliases=false;
					this.wildcardType = defWildcardType;
					this.idType = defIDType;
					this.showStrandOptions = false;
					this.strandsQuery = false;
					this.clearError();
					this.contractualPartyTypeId = null;
					this.contractualPartyId = null;
					this.onlyDefaultVersion = true;
					this.foxipediaSearch = false;
					this.onlyConfidential = false;
					$(".parsedExcelIds").empty();
					$scope.doClearPastedExcel();					
					$scope.checkValidNumber('', 'advancedSearch_prodYearTo');
					$scope.checkValidNumber('', 'advancedSearch_prodYearFrom');
					$scope.checkValidNumber('', 'advancedSearch_releaseYearTo');
					$scope.checkValidNumber('', 'advancedSearch_releaseYearFrom');
					$scope.checkValidNumber('', 'advancedSearch_maxResults');
				 }
				 
		 };
		 
		 $scope.validation = {
			hasErrors: false,
			message: null,
			setError: function(message) {
				this.hasErrors = true;
				this.message=message;
			},
		 	isOk: function() {
		 		return !this.hasErrors;
		 	},
		 	clear: function() {
		 		this.hasErrors=false;
		 		this.message=null;
		 	}
			
		 };
		 
		 /**
		  * Gets the product search criteria based on user selection
		  */
		 var getProductSearchCriteria = function() {
			 var criteria = {};
			 if ($scope.productSearch.searchByTitle)
			   criteria.q = $scope.productSearch.title;			
			 else if ($scope.productSearch.searchByID)
			   criteria.q = $scope.productSearch.searchID != null ? $scope.productSearch.searchID.replace(/;/gi, ",") : $scope.productSearch.searchID;
			 if ($scope.productSearch.isFoxipediaGroupSearch()) {
			   $scope.productSearch.title=null;
			   $scope.productSearch.searchByID=null;
			   criteria.q=$scope.productSearch.foxipediaGroupQ;
			 } else {
				 if ($scope.productSearch.isBasicSearch()) {
					 criteria.maxResults = defaultMaxResults;
				 } else {
					 if ($scope.productSearch.selectedProductTypes.length>0) {
						 criteria.productTypes = $scope.productSearch.selectedProductTypes;
					 }
					 if ($scope.productSearch.prodYearFrom) {
						 criteria.prodYearFrom = $scope.productSearch.prodYearFrom;
					 }
					 if ($scope.productSearch.prodYearTo) {
						 criteria.prodYearTo = $scope.productSearch.prodYearTo;
					 }
					 if ($scope.productSearch.releaseYearFrom) {
						 criteria.releaseYearFrom = $scope.productSearch.releaseYearFrom;
					 }
					 if ($scope.productSearch.releaseYearTo) {
						 criteria.releaseYearTo = $scope.productSearch.releaseYearTo;
					 }
					 if ($scope.productSearch.legalConfirmationStatusId) {
						 criteria.legalConfirmationStatusId = $scope.productSearch.legalConfirmationStatusId; 
					 }	
					 if ($scope.productSearch.businessConfirmationStatusId) {
						 criteria.businessConfirmationStatusId = $scope.productSearch.businessConfirmationStatusId; 
					 }
					 if ($scope.productSearch.onlyConfidential) {
						 criteria.onlyConfidential = true;						 
					 }
					 if ($scope.productSearch.strandsQuery && $scope.productSearch.showStrandOptions) {
						 console.log(" PRODUCT SEARCH STRANDS QUERY : %o", $scope.productSearch.strandsQuery);
						 if($scope.productSearch.strandsQuery == 'true'){
							 criteria.withMismatchedDates = true;
						 }
						 else {
							 criteria.strandsQuery = $scope.productSearch.strandsQuery;
						 }
						  
					 }
					 if ($scope.productSearch.onlyDefaultVersion==='true'||$scope.productSearch.onlyDefaultVersion===true) {
						 criteria.onlyDefaultVersion=true;
					 }
					 if ($scope.productSearch.contractualPartyTypeId) {
						 criteria.contractualPartyTypeId = $scope.productSearch.contractualPartyTypeId; 
					 }
					 if ($scope.productSearch.contractualPartyId) {
						 criteria.contractualPartyId = $scope.productSearch.contractualPartyId.partyId; 
					 }

					 if ($scope.productSearch.withMismatchedDates) {
						 criteria.withMismatchedDates = true;
					 }
					 
					 criteria.maxResults = $scope.productSearch.maxResults;
				 }
			 }
			 criteria.searchAliases = $scope.productSearch.searchAliases;		
			 if ($scope.productSearch.searchByTitle)
			   criteria.wildcardType = $scope.productSearch.wildcardType;
			 if ($scope.productSearch.searchByID) {
			   criteria.idType = $scope.productSearch.idType;
			   criteria.wildcardType = "EQ";
		 	 }
			 criteria.includeVersions = $scope.productSearch.includeVersions;
			 criteria.includeHasRights = $scope.productSearch.includeHasRights;
			 criteria.searchByID = $scope.productSearch.searchByID;
			 criteria.searchByTitle = $scope.productSearch.searchByTitle;
			 criteria.advancedSearch = !$scope.productSearch.isAdvancedSearchCollapsed;
			 criteria.foxipediaSearch = $scope.productSearch.foxipediaSearch;
			 return criteria;
		 };
		 
		 /**
		  * Alternates between basic search and advanced search
		  */
		 $scope.doToggleSearchType=function doToggleSearchType(){
			 var mainScope = angular.element(document.getElementById("mainController")).scope();			 
			 mainScope.closeERMSidePanel();
			 mainScope.showGetStartedMenu = false;
			 $(".rightsController").animate({ opacity: 0 },500);
			 $(".ermSidePanelOuter").animate({ opacity: 0 },500);			  
			 $scope.productSearch.isAdvancedSearchCollapsed = !$scope.productSearch.isAdvancedSearchCollapsed;
			 if (!$scope.productSearch.isAdvancedSearchCollapsed) {
			   $scope.productSearch.searchCollapsed = false;
			 }
			 if (!$scope.productSearch.isAdvancedSearchCollapsed) {			   
			   $("#erm-content").animate({width:'100%'},500);
			 } else {			   
			   if ($scope.productSearch.isCrossProduct)
			     $scope.toggleCrossProduct();
			   $("#erm-content").animate({width:'100%'},500);
			   var psscope = angular.element(document.getElementById("productSearchController")).scope();		
			   psscope.crossProduct.source = null;
			   $(".crossProductSourceInput").val("");
			   psscope.crossProduct.targets = [];
			   if (psscope.$root.$$phase != '$apply' && psscope.$root.$$phase != '$digest') {
			     psscope.$apply();
			   }
			   $(".crossProductTargetsArea").empty();
			 }			 
		 };
		 
		 /**
		  * Toggle Search Options
		  */
		 $scope.collapseSearchOptions=function(){
		   $scope.productSearch.searchCollapsed = true;
		   if ($scope.productSearch.isModal)
		     $(".productResults").addClass("productResultsModal");			 
		 };		 
		 $scope.expandSearchOptions=function(){
		   $scope.productSearch.searchCollapsed = false;
		   if ($scope.productSearch.isModal) {
		     $(".productResults").addClass("productResultsModal");
		   }
		 };
		 
		 var hasValue = function(s) {
			 if (angular.isArray(s)) {
				 return s.length>0;
			 }
			 return (angular.isString(s)&&s.trim().length>0);
		 };
		 
		 var isValidNumber = function(n) {
			 console.log(" IS VALID NUMBER INVOKED...");
			if (n) {				
				if (!$.isNumeric(n)) {
				return false;
			}
			return true;
			}
		 };
	
		 /**
		  * Validates the advanced search
		  * At least one criteria must be specified
		  */
		 $scope.validateAdvancedSearch = function() {
			 var productSearch= $scope.productSearch;
			 var hasValues = false;
			 var titleValid = false;
			 var searchIDValid = false;
			 
			 //if the productSearch.title does not have value and the searchId has value, set it as search by id automatically
			 //this is because if using search in foxipedia, the searchByID is never set
			 if (!hasValue(productSearch.title) && hasValue(productSearch.searchID)) {
				 $scope.productSearch.searchByID = true;
				 $scope.productSearch.searchByTitle = false;				 
			 }
			 
			 
			 if ($scope.productSearch.searchByTitle && hasValue(productSearch.title)) {
				 hasTitle=true;
				 hasValues=true;
				 titleValid = $scope.validateBasicSearch();
				 if (!titleValid) {
					 return false;
				 }
			 }
			 
			 if ($scope.productSearch.searchByID && hasValue(productSearch.searchID)) {
				 hasSearchID=true;
				 hasValues=true;
				 searchIDValid = $scope.validateSearchByID();
				 if (!searchIDValid) {
					 return false;
				 }
			 }
			 
			 if (productSearch.prodYearFrom) {
				 hasValues=true;				 
				 if (!isValidNumber(productSearch.prodYearFrom)) {
					 $scope.validation.setError("Please specify a valid production from year");
					 return false;				 
				 }				 
			 }
			 if (productSearch.prodYearTo) {
				 hasValues=true;
				 if (!isValidNumber(productSearch.prodYearTo)) {
					 $scope.validation.setError("Please specify a valid production to year");
					 return false;				 
				 }				 
			 }
			 if (productSearch.releaseYearFrom) {
				 hasValues=true;
				 if (!isValidNumber(productSearch.releaseYearFrom)) {
					 $scope.validation.setError("Please specify a valid release from year");
					 return false;				 
				 }				 				 
			 }
			 if (productSearch.releaseYearTo) {
				 hasValues=true;
				 if (!isValidNumber(productSearch.releaseYearTo)) {
					 $scope.validation.setError("Please specify a valid release to year");
					 return false;				 
				 }				 				 				 
			 }
			 if (hasValue(productSearch.selectedProductTypes)) {
				 hasValues=true;
			 }
			 if (productSearch.legalConfirmationStatusId) {
				 hasValues=true;				 
			 }
			 if (productSearch.businessConfirmationStatusId) {
				 hasValues=true;				 
			 }
			 if (productSearch.strandsQuery) {
				 hasValues=true;				 
			 }
			 if (productSearch.contractualPartyTypeId) {
				 hasValues=true;				 
			 }
			 if (productSearch.contractualPartyId) {
				 hasValues=true;				 
			 }
			 if (productSearch.onlyConfidential) {
				 hasValues=true;
			 }
			 if (!hasValues) {
				 $scope.validation.setError("Please specify at least one criteria");
				 return false;				 
			 }
			 return true;
		 };
		 

		 $scope.validateBasicSearch = function() {
			 var minTitleLength = minCharactersBasicSearch;
			 var productSearch = $scope.productSearch;
			 var q = productSearch.title;
			 if ((q===null||q===undefined||q.length<minTitleLength) && $scope.productSearch.wildcardType != "EQ") {
				 $scope.validation.setError("Minimum title length is " + minTitleLength + " characters");
				 return false;
			 }
			 return true;
		 };
		 
		 $scope.validateSearchByID = function() {
			 var productSearch = $scope.productSearch;
			 var q = productSearch.searchID;
			 if (q===null||q===undefined) {
				 $scope.validation.setError("You must enter a valid search id");
				 return false;
			 }
			 return true;
		 };
		 
		 $scope.validateFoxipediaGroupSearch = function() {
			 var minTitleLength = minCharactersBasicSearch;
			 var productSearch = $scope.productSearch;
			 var q = productSearch.foxipediaGroupQ;
			 if (q===null||q===undefined||q.length<minTitleLength) {
				 $scope.validation.setError("Minimum franchise group name length is " + minTitleLength + " characters");
				 return false;
			 }			 
		 };
		 
		 
		 /**
		  * Validates the search form. It verifies that the minimum amount of information is provided.
		  * For example, if the basic search is executed the min number of characters for the search is 3.
		  * If this function returns false, an error will be displayed and the search will not be executed
		  * 
		  */
		 $scope.validateSearch=function(){
		   var productSearch=$scope.productSearch;
		   $scope.validation.clear();
		   if (productSearch.isBasicSearch()) {
		     return $scope.validateBasicSearch();
		   } else if (productSearch.isFoxipediaGroupSearch()) {
			 return $scope.validateFoxipediaGroupSearch();
		   } else {
			 return $scope.validateAdvancedSearch();
		   }
		   return true;
		 };
		 
		 /**
		  * Clears the advanced search criteria
		  */
		 $scope.doClearCriteria= function() {
			 $scope.productSearch.clear();
			 $scope.validation.clear();		
		 };
		 
		 
		 $scope.checkValidNumber = function(numberToCheck, id) {			 			
			 if(!$.isNumeric(numberToCheck) && numberToCheck != "") {
				 $("#" + id).css("border", "2px solid red");
				 $("#" + id).tooltip('enable');
				 $("#" + id).tooltip('show');  
				 $("#" + id).tooltip({html: true});
			 } else {
				 $("#" + id).css("border" , "thin inset");
				 $("#" + id).tooltip('hide');  
				 $("#" + id).tooltip('disable');				 
			 }			 
		 };
		 
		 /**
		  * Clears the advanced search criteria
		  */
		 $scope.doSetSearchOptionsChanged = function doSetSearchOptionsChanged() {
			 $scope.productSearch.searchOptionsChanged = true;	
			 if(!$scope.productSearch.showStrandOptions){
				 $scope.productSearch.strandsQuery = null;
			 } 
		 };
		 
		 $scope.doDefaultStrandQuery = function() {
			 if($scope.productSearch.showStrandOptions){			 
				$scope.productSearch.strandsQuery='withLegalRightStrands';
			 }
		 };		 
		 		 
		 /**
		  * Expands the product versions of a product.
		  * If the product versions of the product are fetched already then
		  * the <div> containing the product versions just shows/hides.
		  * If the product versions are not fetched. Then an invocation to the productService is made
		  * to fetch product versions. And mark the model as expanded.
		  */
		 $scope.doToggleProductVersions = function(product, searchID ) {
			 $log.log("Getting product versions for: %o",product);			 			
			 var foxId = product.foxId;
			 if (product!=null) {
				 
				
				 if (!product.versions||product.versions.length==0) {
					 var productVersions = productService.findProductVersionsExcludeDefault(foxId, product.strandsQuery);
					 product.versions = productVersions;
					 product.versionsExpanded=true;
					 product.versionsFetched=true;					 							
				 } else {
					 if (product.versionsExpanded===undefined) {
						 product.versionsExpanded=true;
					 }					 
					 product.versionsExpanded=!product.versionsExpanded;
				 }				 
			 }				
		 };
		 
		 $scope.doShowSearchResults = function() {
			 console.log("disableLink doShowSearchResults 2");
			 $(".productResults").css('display','block');
			 $(".productResults").animate({ opacity: 1 },500);			 
			 $(".rightsController").animate({ opacity: 0 },500);
			 $(".ermSidePanelOuter").animate({ opacity: 0 },500);
			 var resultsScope = angular.element(document.getElementById("erm-product-search-results")).scope();
			 resultsScope.clearFilter();
			 setTimeout(function(){ 
				 $scope.productSearch.searchExecuted = true;	
				 $scope.productSearch.productSearchCompleted = true;
				 if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
				   $scope.$apply();
				 }	
				 if ($scope.productSearch.isModal) {
				   resultsScope.results.showCheckboxes = true;		
				   $(".searchResultsProductTitle").attr("disabled", true);
				   $(".searchResultsProductTitle").addClass("disableLink");				   
				   $(".productResults").removeClass("productResultsModal");
				   $(".hideSearchResultsLink").addClass("hideControls");
				 } else {
				   $(".searchResultsProductTitle").removeClass("disableLink");
				   $(".searchResultsProductTitle").attr('disabled', false);
				   $(".hideSearchResultsLink").removeClass("hideControls");
				 }				
			 }, 50);
		 };
		 
		 $scope.hideUIElements = function hideUIElements() {
			 var mainScope = erm.scopes.main();
			 mainScope.showGetStartedMenu = false;
			 var sidePanelScope = erm.scopes.comments();
			 sidePanelScope.hide();			 
		 };
		 /**
		  * Performs a product search.
		  * It will first construct a criteria object and then submitted to the productService.find()
		  * The criteria object is obtained from the $scope.productSearch
		  */
		 $scope.doProductSearch=function(){
//			 var mainScope = angular.element(document.getElementById("mainController")).scope();
//			 var mainScope = erm.scopes.main();
//			 mainScope.showGetStartedMenu = false;
			 $scope.hideUIElements();
			 $scope.errorMessage = null;
			 if (!$scope.productSearch.searchOptionsChanged) {
			   $scope.doShowSearchResults();
			   return;
			 }
			 $scope.validateSearch();			 
			 if (!$scope.validation.isOk()) {
				 $log.log("Search is not valid");
				 return null;
			 }
			 $scope.validation.clear();
			 var criteria = getProductSearchCriteria();
			 var productSearch=$scope.productSearch;
			 productSearch.clearError();
			 var maxResultsError = "Search results exceeded the default maximum number of titles. Please refine your search criteria.";
			 var noResultsFoundError = "No results were found";
			 var transformProduct  = function transformProduct(product) {
				 var displayProductionYear = product.productionYear?product.productionYear:"";
				 var displayReleaseDate = product.releaseDate?product.releaseDate:"";
				 
				//TMA: bug 44542
				 var displayFinancialProductId = product.financialProductId?product.financialProductId:"";
				 var displayFinancialDivisionDesc = product.financialDivisionDesc?product.financialDivisionDesc:"";
				 
				 product.displayProductionYear = displayProductionYear;
				 product.displayReleaseDate = displayReleaseDate;
				 
				 //TMA: bug 44542
				 product.displayFinancialProductId = displayFinancialProductId;
				 product.displayFinancialDivisionDesc =  displayFinancialDivisionDesc;
				 
				 product.icon=erm.icons.getIconTag(product);
				 
			 };
			 var transformProducts = function transformProducts(products) {
				$.each(products,function(idx,elem){
					transformProduct(elem);
				});
			 };
			 var searchCompleted = function(products) {
				 $log.log("product search completed with  ", products.length + " products");
				 transformProducts(products);
				 productSearch.searchCompleted();
				 productSearch.productSearchCompleted=true;
				 productSearch.foxipediaGroupSearchCompleted = false;
				 //TODO use isArray
				 if( Object.prototype.toString.call( products ) === '[object Array]' ) {
					 $scope.groups[0] = { 
					   'products' : products,
					   filterResults : "" 
					 };				 					 
					 if (products.length>=productSearch.maxResults) {
						 productSearch.setError(maxResultsError);
					 }
					 // set WPRMap for Cross Product Search				
					 for (var index = 0; index < products.length; index++) {
					   $scope.crossProduct.WPRMap[products[index].defaultVersionId] = products[index];
					 }				 				 				
					 
					 if (products.length==0) {
						 productSearch.setError(noResultsFoundError);
					 } else {
						 
						
					   if (productSearch.searchByID && productSearch.idType == "FOXVERSIONID") {				   
						   $scope.doToggleProductVersions(products[0], productSearch.searchID);
					   }
					 }	
				 } else {				   				  				   
				   productSearch.setError(products.indexOf("Error Code") > 0 ? products.substr(0, products.indexOf("Error Code")) : products);				   
				 }											
				 $scope.doShowSearchResults();				 
			 };
			 var foxipediaSearchCompleted=function(foxipediaGroups) {
				 $log.log("foxipediaGroups search completed with foxipediaGroups ",foxipediaGroups.length + " groups");
				 productSearch.searchCompleted();				 
				 productSearch.foxipediaGroupSearchCompleted=true;
				 productSearch.productSearchCompleted = false;
				 if (foxipediaGroups.length>=productSearch.maxResults) {
					 productSearch.setError(maxResultsError);
				 }
				 
				// set WPRMap for Cross Product Search
				 for (var groupIndex = 0; groupIndex < foxipediaGroups.length; groupIndex++) {
				   for (var index = 0; index < foxipediaGroups[groupIndex].products.length; index++) {
				     $scope.crossProduct.WPRMap[foxipediaGroups[groupIndex].products[index].defaultVersionId] = foxipediaGroups[groupIndex].products[index];
				   }		
				 }
				 
				 if (foxipediaGroups.length==0) {
					 productSearch.setError(noResultsFoundError);
				 }		
				 $scope.doShowSearchResults();	
			 };
			 
			 var searchFailed = function(error) {
		       console.log("error %o", error);
		       productSearch.searchCompleted();				 
			   productSearch.foxipediaGroupSearchCompleted=true;
			   productSearch.productSearchCompleted = false;
		       productSearch.setError(error.responseText);
			   $scope.doShowSearchResults();	
			 };
			 
			 productSearch.startSearch();
			 $scope.groups = [];
			 $log.log("Searching for products %o ", criteria);
			 $log.log("productSearch.strandsQuery ", productSearch.strandsQuery);
			 if (productSearch.isFoxipediaGroupSearch()) {				 				 
				 $scope.foxipediaGroups=productService.findFoxipediaGroups(criteria,foxipediaSearchCompleted);				 
				 $scope.groups = $scope.foxipediaGroups;				
				 $log.log("$scope.groups %o ", $scope.groups);
			 } else {
				 $scope.foxipediaGroups=null;
				 productService.find(criteria, searchCompleted, searchFailed);			 				 	
			 }
		 };
		 		 		 		 		 
	});


/* RIGHTS CONTRLLER (start) */
app.controller('RightsController',function RightsController($window, $scope,$log,$routeParams,$timeout,rightsService,sharedStateService,commentService,attachmentsService,confirmationStatusService,utilService, productService, clearanceMemoService, commentStatusService, productSubrightsService,businessConfirmationStatusService){
	strandActions.setUp();
	
	if ($routeParams.isFoxipediaSearch==="true") {
		$scope.isFoxipediaSearch = true;
	} else {
		$scope.isFoxipediaSearch = false;
	}
	
	
	$scope.showProductInfoCodes = function showProductInfoCodes(show) {
		$scope.productInfoCodesShow = show;
	};
	
	
	$scope.init = function init() {
		var rcscope = $scope;
		errorPopup.init();		
		rightStrandObject.initRightStrand(rcscope);
		kendoElementInit.initKendoElements(rcscope);
		clearanceMemoKendoElementInit.initCMKendoElements(rcscope);
		infoCodePopupObject.initializeInfoCodePopupWindow();
		rightStrandUpdateObject.initializeElements(null);
				
		subrightObject.initializeElements();
		
		commentsAndAttachmentsObject.initializeElements();
		subrightObject.initializeElements();
		copyRightStrandObject.initializeElements();
		createRightStrandObject.initializeElements();
		productDetailObject.initializeElements(rcscope);
		errorPopup.init();
		
	}; //end init
	
	//first render the templates
	//NOTE this happens every time we visit a new product. These should be moved to the main controller to happen only once
	//Moved the divs for the templates from rightsEdit to body.html becaue it was creating duplicate divs everytime
	$scope.renderTemplates();
	//init the objects
	$scope.init();
	
	
	var clearGrid = function clearGrid() {
		 gridStrandsConfigurator.clear();		
	};
	
	//AMV 11/21/2014
	//Moved this from ProductDetail
	$scope.saveProductFileNumber = function saveProductFileNumber(){
//		var scope = angular.element(document.getElementById("rightsController")).scope(); //.foxVersionId
		var scope = $scope;
		var foxVersionId = scope.foxVersionId;
		var pfn = $("#productFileNumberInput").val();
		if(pfn){
			var select = document.getElementById("centralFileNumberSelector");
			var opts = select.options;			
			var splitInput = pfn.split(",");
			var passedArray = new Array(); 	
			//var iChars = "~`!#$%^&@*+=-[]\\\';,/{}|\":<>?";
			for (var i=0; i < splitInput.length; i++) {
			  //for (var j = 0; j < splitInput[i].length; j++) {
			    //if (iChars.indexOf(splitInput[i].charAt(j)) != -1) {
				  //errorPopup.showErrorPopupWindow("Your central file number has special characters ~`!#$%^&@*+=-[]\\\';,/{}|\":<>? <BR/><BR/>These are not allowed<BR/><BR/>");
			      //return false;
			    //}			    
			  //}	
			  if (splitInput[i].trim().length > 200) {
				errorPopup.showErrorPopupWindow("You have entered a central file number that is greater than 200 characters.");
				return;
			  } else if ($.inArray(splitInput[i].trim(), passedArray) > -1) {
				errorPopup.showErrorPopupWindow("You have entered the same central file number twice.");
				return;
			  } else {
				passedArray.push(splitInput[i].trim());
			  }				
			}				
			for(var opt=0; opt < opts.length; opt++) {
			  for (var i=0; i < splitInput.length; i++) {			
			    if (splitInput[i].trim() == opts[opt].text) {
				  errorPopup.showErrorPopupWindow("That central file number already exists for this product.");
			      return;
			    }			    
			  }			  
			}			
			pfn = pfn.replace("&", "%26");
			var queryString = "q="+JSON.stringify(pfn)+"&foxVersionId="+foxVersionId;
			var url = paths().getSaveProductFileNumber();
			$("#productFileNumberButton").html('<i class="icon-spinner icon-spin"></i> Adding');
			$.post(url, queryString, function(data){
				$("#productFileNumberButton").html('<i class="icon-plus-sign"></i> Add');
				$("#productFileNumberInput").val('');
				scope.currentProductArray.productFileNumbers = data;
				if (scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest')
				  scope.$apply();
			}).fail(function(xhr,status,message){
				$("#productFileNumberButton").html('<i class="icon-plus-sign"></i> Add');
				errorPopup.showErrorPopupWindow(xhr.responseText);
			});
		}
		else {
			errorPopup.showErrorPopupWindow("You must enter a file number before clicking the Save button");
		}
	};
	
	$scope.deleteProductFileNumber = function deleteProductFileNumber(){			
		var confirmationText = "Are you sure you want to delete this central file number?";
		var confirmationButtonText = "Yes, Delete";
		cf = new confirmationPopup();
		cf.initializeElement();           
		cf.openConfirmationWindow("#confirmationPopupWindow", confirmationText, confirmationButtonText, {}, function(){
				var scope = $scope;
				var foxVersionId = scope.foxVersionId;
				var ids = $("#centralFileNumberSelector").find(":selected");
				if(ids.length <= 0){
					errorPopup.showErrorPopupWindow(" You must select a file number before you can delete");
				} else {									
					var fileNumberIds = "";
					var counter = 0;
					$.each(ids, function(id, elem){
						if(counter < (ids.length-1)){
							fileNumberIds += elem.value + ",";
						}
						else {
							fileNumberIds += elem.value;
						}
						counter++;
					});	
					
					var url = paths().getDeleteProductFileNumber();
					var queryString = "q="+JSON.stringify(fileNumberIds)+"&foxVersionId="+foxVersionId;
					$("#productFileNumberButtonDelete").html('<i class="icon-spinner icon-spin"></i> Deleting');
					$.post(url, queryString, function(data){
						$("#productFileNumberButtonDelete").html('<i class="icon-remove"></i> Delete');
						scope.currentProductArray.productFileNumbers = data;
						if (scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest')
							  scope.$apply();
					}).fail(function(xhr,status,message){
						$("#productFileNumberButtonDelete").html('<i class="icon-remove"></i> Delete');
						errorPopup.showErrorPopupWindow(xhr.responseText);
					});
				}
			}			
		);						
	};
	
	
	
	/*
	 * Kendo poppups attach to the body, so when the html gets destroyed the kendo popups remain causing problems (duplicate elements with same ids)
	 * So we need to clear them manually
	 * 
	 */
	var clearTemplates = function clearTemplates() {
		console.log("Cleaning up templates");
		var divsToClear = ['#test2_addEditInfoCodeWindow','#sse_rightStrandPopupWindow','#template_addEditClearanceMemo','#template_addCommentsAndAttachments','#commentsAndAttachmentPopupWindow','#crs_rightStrandCopyPopupWindow','#cre_rightStrandCreatePopupWindow'];
		$.each(divsToClear,function(idx,elem) {
			$(elem).empty();
		});

	
	};
	$scope.$on("$destroy", function() {
		 clearGrid();
		 clearTemplates();
     });	
	
	$scope.doneLoading = false;
	
	$scope.productPanelMaximized = false;
	
	$scope.toggleProductPanelMaximize = function() {
		if (!$scope.productPanelMaximized) {
			$("#sidebarInformation").animate({width:'0%'},500);
			$("#productInformation").animate({width:'100%'},500);			
			$("#sidebarInformation").css("display", "none");	
		} else {
			$("#sidebarInformation").animate({width:'16%'},500);
			$("#productInformation").animate({width:'83%'},500);
			$("#sidebarInformation").css("display", "");	
		}
		$scope.productPanelMaximized = !$scope.productPanelMaximized;
	},
	
	/* START VARIABLES DEFINITIONS */
	$scope.rightSearch={
			 searchExecuted : false,
			 searchInProgress: false,
			 startSearch: function(){
				 this.searchExecuted = false;
				 this.searchInProgress = true;
			 },
			 searchCompleted: function() {
				 this.searchExecuted = true;
				 this.searchInProgress = false;				 
			 },
			 versionExecuted : false,
			 versionInProgress : false,
			 versionExecuteInProgress : function(){
				 this.versionExecuted = false;
				 this.versionInProgress = true;
			 },
			 versionExecuteCompleted : function(){
				 this.versionExecuted = true;
				 this.versionInProgress = false;
			 }
	 };	
	
	//TODO get them from erm.dbvalues
	$scope.businessConfirmationStatus = businessConfirmationStatusService.getBusinessConfirmationStatus();
	
	$scope.commentStatus = commentStatusService.getCommentStatus();
	
	$scope.showExpandStrandInformationalCodes = true;
	$scope.expandStrandInformationalCodesSpinner = false;
	
	$scope.allExpanded = false;
	$scope.xpandAllVersions = function() {
	  $scope.allExpanded = true;
	  if ($scope.productVersionTree.children != null) {		  
	    for (var i = 0; i < $scope.productVersionTree.children.length; i++)
	      if ($scope.productVersionTree.children[i] != null)
	    	$scope.productVersionTree.children[i].data.showFactor = true;	      
	  }
	};
	$scope.collapseAllVersions = function() {
	  $scope.allExpanded = false;
	  if ($scope.productVersionTree.children != null) {		  
	    for (var i = 0; i < $scope.productVersionTree.children.length; i++)
	      if ($scope.productVersionTree.children[i] != null)
	    	$scope.productVersionTree.children[i].data.showFactor = false;	      
	  }
	};
	
	$scope.currentProductArray = {			
			productDetailLink : "",
			productTitle : "",
			productVersionTitle : "",
			productTypeCode : "",
			productTypeDesc : "",
			productCode : "", //financialProductId
			financialDivisionCode : "",
			financialDivisionDesc : "", //TMA
			firstReleaseDate : "",
			productionYear : "", 
			runtime : "",
			doNotLicense : false,
			legalConfirmationStatus : null,
			legalConfirmationStatusId : "", 
			businessConfirmationStatus : null,
			futureMediaInd : "",
			comments : null,
			foxVersionId : "",
			defaultVersionId : "",
			hasRightStrands : false,
			isDefaultVersion : false,
			foxId : "",
			realProductTitle : "",						
			ermProductRestrictionObject : new Array(),  //TMA
			//ermProductRestrictionObjectIconType : new Array(), //TMA
			lifecycleStatusDescription : null,
			centralFileNumberArray : new Array(),
			centralFileNumber : '',
			scriptedFlag : false,
			savingProduct : false,
			finishedSavingProduct : false,
			errorSavingProduct : false,
			hasClearanceMemo : null,
			legalInfoCodesCount : 0,
			businessInfoCodesCount : 0,
			legalStrandsCount : 0,
			businessStrandsCount : 0,
			clearanceMemo : null,
			clearanceMemoText : null,
			clearanceMemoRootNodeId : null,
			foxProducedInd : null,
			copyright : null,
			productFileNumbers : null,
			productFileNumber : null,
			productFileNumberInput : null,
			episodeCount : 0,
			seasonCount : 0
	};
	
	$scope.strandsSection = {
			finishedSavingProduct:false,
			errorSavingProduct:false
		};
	
	$scope.removeStrandComment = function removeStrandComment(commentId) {
		
	};
	
	
	
	
	/**
	 * Load a baseline versions based on the foxVersionId.
	 */	
	$scope.productVersion = {createName : "test"};
	$scope.foxVersionId = $routeParams.foxVersionId;
	$scope.foxId = null;
	$scope.parentFoxVersionId = null;
	$scope.parentProduct = null;
	$scope.defaultFoxVersionId = null;
	$scope.defaultFoxId = null;
	$scope.productHeaderShow = true;
	$scope.currentTab = 'general';	
	$scope.rightStrandsShow = false;
	$scope.shouldRightStrandsPanelShow = false; //Use in the strandsGrid.js file to decide whether to show Rihgts strands panel on load
	$scope.productInfoCodesShow = true;
	$scope.rightStrands = new Array();
	$scope.currentProductLocal = null;
	$scope.currentProductVersionLocal = null;
	$scope.currentProduct = null;
	$scope.currentLyHighlightedElement = null;
	$scope.desiredLengthForMenuString = 24;
	$scope.defaultProductVersion = null;
	$scope.productVersionTree = "";
	$scope.movieTitle = "";	
	$scope.rightsIconType = "";
	$scope.legalConfirmationStatus = confirmationStatusService.getLegalConfirmationStatus();
	$scope.user = $window.erm_user;
	$scope.copyrightNotice = null;
	$scope.showSyncSuccessMessage = false;
	$scope.shouldShowSyncButton = false;
	$scope.copyrightNoticeHTML = "";
	
	var foxProducedInd = [{id:1,name:"YES"},
						  {id:0,name:"NO"}];
	$scope.foxProducedInd = foxProducedInd;
	
	/** COPYRIGHT NOTICE -- TMA*/
	
	$scope.showHideRightStrandSection = function(bool){
		$scope.rightStrandsShow = bool;
	};
	
	var cN = function(copyrightNotice) {		
		if(copyrightNotice){
			$scope.copyrightNotice = copyrightNotice;			
			if (copyrightNotice != null && copyrightNotice.copyrightNotice != null)  
			  $scope.copyrightNoticeHTML = copyrightNotice.copyrightNotice.replace(/\n/g, "<br>");
			//$scope.copyrightNoticeHTML = $scope.copyrightNoticeHTML.replace(/,/g, "<br>");			
		}
		
	};
	
	$scope.loadCopyrightNotice = function loadCopyrightNotice() {		
		productService.copyrightNotice($scope.foxVersionId, cN);  
	};

	//AMV 2/12/2014
	//Commented out no need to call here. It will be called by loadVersions
//	$scope.loadCopyrightNotice();
	//$scope.copyrightNotice = $scope.loadCopyrightNotice($scope.foxVersionId);
	
	/** COPYRIGHT NOTICE -- TMA*/
	
	$scope.loadBaselineVersions = function(foxVersionId){		
		attachmentsService.loadBaselineVersionsByFoxVersionId(foxVersionId);
		
	};	
	
	
	  
//	$scope.baselineVersions = $scope.loadBaselineVersions($scope.foxVersionId);
	
	var secondInMinute = 60;
	var dataLoaded = false;
	
	$scope.treeLoaded = false;
	
	/* The variable representing the tree on the left side of the pane*/
	$scope.treeListing = null;
	
	/* Variables used for sorting the right strands */
	$scope.mediaPredicate = "media.name";
	$scope.mediaReverse = false;
	$scope.territoryPredicate = "territory.name";
	$scope.territoryReverse = false;
	$scope.languagePredicate = "language.name";
	$scope.languageReverse = false;
	$scope.predicate = $scope.mediaPredicate;
	$scope.reverse = $scope.mediaReverse;	
	/* END VARIABLES DEFINITIONS */
	
	/**
	 * Updated the business confirmation status
	 * Triggered when the buisiness confirmation status selector changes
	 * 
	 */
	$scope.doChangeBusinessConfirmationStatus = function doChangeBusinessConfirmationStatus() {
		console.log("RightsController.doChangeBusinessConfirmationStatus");
		var businessConfirmationStatusId = $scope.currentProductArray.businessConfirmationStatusId;
		var foxVersionId = $scope.currentProductArray.foxVersionId;
		$scope.strandsSection.finishedSavingProduct = false;
		$scope.strandsSection.errorSavingProduct = false;		
		var onSuccess = function onSucess() {
			console.log("Updated business confirmation status");
			$scope.strandsSection.finishedSavingProduct = true;
			$scope.strandsSection.savingProduct = false;
			$scope.updateRightsIndicator($scope.currentProductArray.foxVersionId);
			setTimeout(function() {
				  $scope.strandsSection.finishedSavingProduct = false;
				  $scope.strandsSection.savingProduct = false;				  
				  if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest') {
					rcscope.$apply();
				  }
				}, erm.statusIndicatorTime);
			
		};
		var onError = function onError(data) {			
			console.log("Error updating business confirmation status %o" , data);
			errorPopup.showErrorPopupWindow("Error updating business confirmation status: " + data.data);					
			$scope.strandsSection.errorSavingProduct = true;
			$scope.strandsSection.savingProduct = false;			
			if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
				rcscope.$apply();
			}
			
		};
		$scope.strandsSection.savingProduct = true;
		rightsService.updateBusinessConfirmationStatus(foxVersionId,businessConfirmationStatusId,onSuccess,onError);
	};  //end doChangeBusinessConfirmationStatus
	
	/**
	 * Displays the strands grid and filter with the foxVersionId
	 */
	$scope.viewStrandsGrid = function viewStrandsGrid(foxVersionId,savedIds, bool,applyFilter) {
		  var selectable = erm.security.canSelectStrands();
		  gridStrandsConfigurator.setEditMode(selectable);		 
		  //AMV load the grid after the db values are loaded
		  $("#rightStrandshowAllDates").prop("checked", false);
		  erm.dbvalues.afterInit(function viewStrandsGridAfterInit() {
				  gridStrandsConfigurator.setUpStrandsGrid(foxVersionId,savedIds, bool,applyFilter);
				  gridStrandsConfigurator.setUpFilter();
				  });
	};
	
	$scope.switchTabs=function(tabName) {
		if (tabName == 'general' && $scope.currentTab != 'general') {			
			$scope.currentTab = 'general';
		} else if (tabName == 'clearanceMemo' && $scope.currentTab != 'clearanceMemo') {			
			$scope.currentTab = 'clearanceMemo';
		} else if (tabName == 'subrights' && $scope.currentTab != 'subrights') {					
			$scope.currentTab = 'subrights';
		} else if (tabName == 'comments' && $scope.currentTab != 'comments') {					
			$scope.currentTab = 'comments';
		} else if (tabName == 'sales' && $scope.currentTab != 'sales') {					
			$scope.currentTab = 'sales';
			//TMA bug
			console.log("TMA debug...trying to switchSalesMarketingSubTabs");
			$scope.switchSalesMarketingSubTabs("COM");
		} else if (tabName == 'copyright' && $scope.currentTab != 'copyright') {					
			$scope.currentTab = 'copyright';
		} else if (tabName == 'contacts' && $scope.currentTab != 'contacts') {					
			$scope.currentTab = 'contacts';
			var cpScope = angular.element(document.getElementById("productContactsTab")).scope();			
			cpScope.loadProductContacts();
		}
	};
	
	/**
	 * Displays the strands grid and filter with the foxVerstionId
	 */
	$scope.setDeltedStrands=function(total) {		  
      gridStrandsConfigurator.setDeletedElements(total);		  		
	};
	
	$scope.setDeltedProductCodeRestrictions=function(total) {		  
	  productRestrictionsGridConfigurator.setDeletedElements(total);		  		
	};	
	
	$scope.setUpdatedProductCodeRestrictions=function(total) {		  
	  productRestrictionsGridConfigurator.setUpdatedElements(total);
	};
	
	$scope.setUpdatedStrands=function(total) {		  
	  gridStrandsConfigurator.setUpdatedElements(total);
	};
		
	$scope.viewProductRestrictionsGrid = function(foxVersionId,savedIds) {
		  var selectable = erm.security.canSelectProductRestrictions();
		  productRestrictionsGridConfigurator.setEditMode(selectable);				  
		  productRestrictionsGridConfigurator.setRestrictionsGrid(foxVersionId,savedIds);
	};		
	
	$scope.setCurrentProductArray = function setCurrentProductArray(productVersion) {
		
		 $scope.showProductInfoCodes(false);
		 
		 if (productVersion != null) {
			 
		   console.log("TMA debug: productVersion.financialDivisionDesc: ", productVersion.financialDivisionDesc);
			 
		   var futureMedia = productVersion.futureMediaInd;
		   //console.log(" FUTURE MEDIA : %o", futureMedia);
		   
		   if (futureMedia == null||futureMedia==='') {
			 futureMedia=-1;
		   }
		   //console.log(" FUTURE MEDIA (1) : %o", futureMedia);		   
		   $scope.currentProductArray.businessConfirmationStatusId = productVersion.businessConfirmationStatusId;		   
		   $scope.currentProductArray.legalConfirmationStatusId = productVersion.legalConfirmationStatusId;
		   $scope.currentProductArray.foxProducedInd = productVersion.foxProducedInd;
		   $scope.currentProductArray.futureMediaInd = futureMedia;
		   $scope.currentProductArray.copyright = $scope.copyrightNotice != null ? $scope.copyrightNotice.copyrightNotice : "";	
		   $scope.currentProductArray.jdeId = productVersion.jdeId;
		 }
		
	};
	
	
	/**
	 * Display the strands data and restrictions
	 */
	$scope.doRightSearch = function(cProduct,isFoxipediaSearch){
		var productVersion = cProduct.productVersion;
		var foxVersionId = cProduct.productVersion.foxVersionId;
//		var foxVersionId = $scope.foxVersionId;
		$scope.foxId = cProduct.product.foxId;
		$scope.currentProductLocal = cProduct.product;
		$scope.currentProductVersionLocal = productVersion;
		
		//ermProductVersionHeader needs to have the jde id, so we'll just assign it
		//is not pretty but i'm in a rush AMV 2/12/2014
		//AMV 11/12/2014
		//sometimes ermProductVersionHeader does not exist because the ERM_PROD_VER table doesn't have a row for this productVersion
		//note that JDE is already present in productVersion.
		//FIX this is also not pretty but I find myself in a rush again.....
		//so if productVersion.ermProductVersionHeader is undefined or null, create a dummy one
		//TODO at some point make fix this non sense 
		if (productVersion.ermProductVersionHeader) {
			productVersion.ermProductVersionHeader.jdeId = productVersion.jdeId;
		} else {
			productVersion.ermProductVersionHeader ={};
			productVersion.ermProductVersionHeader.jdeId = productVersion.jdeId;			
		}
		
		$scope.setCurrentProductArray(productVersion.ermProductVersionHeader);
		 erm.dbvalues.afterInit(function displayLegalConfirmationStatus() {
			 $("#legalConfirmationStatusDescription").html(
					 		 erm.dbvalues.legalConfirmationDescMap[$scope.productVersion.legalConfirmationStatusId] != null ? 
							 erm.dbvalues.legalConfirmationDescMap[$scope.productVersion.legalConfirmationStatusId] : "");
		 });
						
	    $scope.populateCurrentProduct(cProduct);
	    $scope.viewStrandsGrid(foxVersionId);
	    $scope.viewProductRestrictionsGrid(foxVersionId);
	    $scope.baselineVersions = $scope.loadBaselineVersions(foxVersionId);
	    var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();
		ermSidePanelScope.loadProductComments();
		
		ermSidePanelScope.productInfoCodeComments = new Array();
		ermSidePanelScope.rightStrandStrandComments = new Array();
		ermSidePanelScope.rightStrandInfoCodeComments = new Array();
		
		ermSidePanelScope.rightStrandCommentsCount = 0;
		ermSidePanelScope.productInfoCodeCommentsCount = 0;
		ermSidePanelScope.rightStrandStrandCommentsCount = 0;
		ermSidePanelScope.rightStrandInfoCodeCommentsCount = 0;
		ermSidePanelScope.loadStrandCommentCounts();
		if (ermSidePanelScope.$root.$$phase != '$apply' && ermSidePanelScope.$root.$$phase != '$digest') {
		  ermSidePanelScope.$apply();
		}		
		$scope.loadSubrightsAndSalesMarketing();	
		$scope.loadCopyrightNotice();
		var cpScope = angular.element(document.getElementById("productContactsTab")).scope();			
		cpScope.loadProductContacts();
		resetMappedTOCItems();
	};  //end of doRightSearch
	
	/**
	 * This function is used to show product and right strands information from the currentProductLocal variable whose value
	 * is kept in memory.
	 * Called when user clicks on a node in the product tree
	 * TODO remove  doRightSearchLocal and use doRigthSearch instead
	 */
	$scope.doRightSearchLocal = function(versionId, foxId,savedIds,isFoxipediaSearch){
		//AMV
		showLoadingPopupWindow();
		$scope.loadVersions(versionId,isFoxipediaSearch);		
	};
	
	/**
	 * 
	 */
	$scope.doShowProductHeader = function(){
		if($scope.productHeaderShow){
			$scope.productHeaderShow = false;
		}
		else {
			$scope.productHeaderShow = true;
		}
	};
	
	/**
	 * 
	 */
	$scope.doShowRightStrands = function(){
		if($scope.rightStrandsShow){
			$scope.rightStrandsShow = false;			
		}
		else {
			$scope.rightStrandsShow = true;
			//$("#strandsGrid").attr("style", "max-height: 645px");
		}
	};
	
	$scope.doRefreshRightStrands = function doRefreshRightStrands(){
		var isFoxipediaSearch = $scope.isFoxipediaSearch;
	   	$("#ermSideClearanceMap").addClass("hideControls");
	   	$("#ermSideClearanceUnmap").addClass("hideControls");
	   	$("#ermSideClearanceShowMapped").addClass("hideControls");
	   	$("#ermSideClearanceShowMappedStrands").addClass("hideControls");
	    $scope.doRightSearchLocal($scope.foxVersionId, $scope.foxId,null,isFoxipediaSearch);
	};    
	
	/**
	 * 
	 */
	$scope.doProductInfoCodes = function(){
		if($scope.productInfoCodesShow){
			$scope.productInfoCodesShow = false;
		}
		else {
			$scope.productInfoCodesShow = true;
		}
	};
	
	/**
	 * 
	 */
	$scope.populateRightStrandLocally = function(versionId){		
		$scope.currentProductVersionLocal = null;
		if($scope.currentProductLocal && $scope.currentProductLocal.versions){
			for(var i = 0; i < $scope.currentProductLocal.versions.length; i++){
				if(versionId == $scope.currentProductLocal.versions[i].foxVersionId){
					$scope.currentProductVersionLocal = $scope.currentProductLocal.versions[i];
					break;
				}
			}
			var cProduct = {
					product : $scope.currentProductLocal,
					productVersion : $scope.currentProductVersionLocal
			};
			$scope.populateCurrentProduct(cProduct);
		}
		
	};
	
	/**
	 * Populate the product info from the local tree menu.
	 */
	$scope.populateRightStrandLocalTree = function(foxVersionId, product){
		$scope.currentProductVersionLocal = $scope.searchTree($scope.productVersionTree, foxVersionId);
		$scope.currentProductLocal = product;
		var cProduct = {
				product : $scope.currentProductLocal,
				productVersion : $scope.currentProductVersionLocal
		};
		$scope.populateCurrentProduct(cProduct);
	};
	
	/**
	 * Recursive function to search for a particular version.
	 */
	$scope.searchTree = function(tree, versionId){
		var data = null;		
		if(tree.data != null && tree.data.foxVersionId == versionId){
			data = tree.data;
		}
		else if(tree.children && tree.children.length > 0){
			for(var i = 0; i < tree.children.length; i++){
				data = $scope.searchTree(tree.children[i], versionId);	
				if(data != null){
					return data;
				}
			}
		}
		return data;
	};
	
	/**
	 * Recursive function to search for a particular version.
	 */
	$scope.updateVersionInTree = function(tree, versionId, version){
		if(tree.data != null && tree.data.foxVersionId == versionId){
			tree.data = version;
			return;
		}
		else if(tree.children && tree.children.length > 0){
			for(var i = 0; i < tree.children.length; i++){
				if (tree.children[i].data.foxVersionId == versionId) {
					tree.children[i].data = version;					
					break;
				}				
			}
		}
	};
	
	$scope.getLegalStatusDescription = function(legalConfirmationStatusId) {
		 //$log.log("getLegalStatusDescription " + legalConfirmationStatusId);
		 var status = "";					 
		 if (legalConfirmationStatusId == null)
			 return status;
		 var index = legalConfirmationStatusId;
		 // handle strange indexing done by angular
		 if (index == 3)
			 index = 4;
		 if (index == 100)
			 index = 3;
		 if ($scope.legalConfirmationStatus != null) {
			 $log.log("index : " + index);
			if (index != null)
		 	  status = $scope.legalConfirmationStatus[eval(eval(index)-1)];		 			 	
		 	if (status != null)
		 	 status = status.confirmationStatusDescription;		 	
	 	 }
		 return status;			      
	 };
	 		
	$scope.updatingRightsIndictor = false;
	$scope.updateRightsIndicator = function(foxVersionId) {
		if (!$scope.updatingRightsIndictor) {
		  $scope.updatingRightsIndictor = true;
		  console.log("TMA debug: trying to update the product level info codes");
	 	  productRestrictionsGridConfigurator.updateProductRestrictions(foxVersionId);
	 	  $scope.updatingRightsIndictor = false;		  
		  //NOTE: this is executing outside angular lifecycle, so $resource.get is not going to get executed until the next digest cycle.
		  //see https://github.com/angular/angular.js/issues/2438
		  //to be part of the cycle it needs to be wrapped in $timeout
		  //it was setTimout before
		 $timeout(function() {
			//console.log("indicatorCompleted updateRightsIndicator");
			var indicatorCompleted = function indicatorCompleted(data){
			  //console.log("indicatorCompleted data %o", data);
			  var iconType = "";
			  if (data.clearanceMemo)
			    iconType += "CM+";
			  if (data.clearanceMemoDP)
			    iconType += "CMDP+";
			  if (data.businessStrands && ($scope.currentProductArray.businessConfirmationStatusId != null && $scope.currentProductArray.businessConfirmationStatusId > 1))
				iconType += "B";
			  if (data.legalStrands && ($scope.currentProductArray.legalConfirmationStatusId != null && $scope.currentProductArray.legalConfirmationStatusId > 0))
				iconType += "L";
			  var img = $("#rightsIndicator_" + foxVersionId);
			  img.attr("src", $scope.getIndicator(iconType));
			  			  			    
		    };
		    
		  //TMA update general section when product level info codes are deleted
			 
		    //console.log("indicatorCompleted $scope.foxVersionId %o", foxVersionId);
			rightsService.productRightsIndicator(foxVersionId, indicatorCompleted);
//			$scope.$apply();
			
			
		  }, 500); 
		}
	};
		
	$scope.getIndicator = function(type) {		
	    var img = null;	
	    switch(type) {
		   case "CM+B":
		     img="CM+BusinessStrand";
		     break;
		   case "CM+LB":
		   case "CM+BL":
			 img="CM+LegalAndBusinessAgree";
		     break;
		   case "CM+L":
		     img="CM+LegalStrand";
			 break;
		   case "CM+":
			 img="CMexistsOnly";
		     break;
		   case "CMDP+B":
		     img="CMDP+BusinessStrand";
		     break;
		   case "CMDP+LB":
		   case "CMDP+BL":
			 img="CMDP+LegalAndBusinessAgree";
		     break;
		   case "CMDP+L":
		     img="CMDP+LegalStrand";
			 break;
		   case "CMDP+":
			 img="CMDPexistsOnly";
		     break;		     
		   case "B":
		     img="NoCM+BusinessStrand";		     
		     break;
		   case "BL":
		   case "LB":
		     img="NoCM+LegalAndBusinessAgree";
		 	 break;
		   case "L":
		     img="NoCM+LegalStrand";
		     break;		   		
		   default:
			 img="NoIcon";
			 break;
		};	 		 	
	 	return "/erm/img/" + img +".png";
	 };
	 
	 $scope.getIndicatorTitle = function(type) {
		var title = "";		
	    switch(type) {
		   case "CM+B":
		     title="Clearance Memo with Business Strand(s)";
		     break;
		   case "CM+LB":
		   case "CM+BL":
			 title="Clearance Memo with Legal and Business Strand(s)";
		     break;
		   case "CM+L":
		     title="Clearance Memo with Legal Strand(s)";
			 break;
		   case "CM+":
			 title="Clearance Memo";
		     break;
		   case "CMDP+B":
		     title="Draft/Processing Clearance Memo with Business Strand(s)";
		     break;
		   case "CMDP+LB":
		   case "CMDP+BL":
			 title="Draft/Processing Clearance Memo with Legal and Business Strand(s)";
		     break;
		   case "CMDP+L":
		     title="Draft/Processing Clearance Memo with Legal Strand(s)";
			 break;
		   case "CMDP+":
			 title="Draft/Processing Clearance Memo";
		     break;  
		   case "B":
		     title="Business Strand(s)";
		     break;
		   case "BL":
		   case "LB":
		     title="Legal and Business Strand(s)";
		 	 break;
		   case "L":
		     title="Legal Strand(s)";
		     break;
		   case "N":		 
		   default:			 
			 break;
		};	 	
	 	return title;	 	
	 };
	 
 
 
		 
	/**
	 * Sets the current product data into the scope
	 */
	$scope.populateCurrentProduct = function(cProduct){
		var scpa = $scope.currentProductArray;
		var formatedReleaseDate = null;
		if(cProduct){
			var currentProduct = cProduct.product;
			
			var currentProductVersion = cProduct.productVersion;
			
			if (currentProductVersion.doNotLicenseID != null && eval(currentProductVersion.doNotLicenseID) > 0)
				$scope.currentProductArray.doNotLicense = true;
			else
				$scope.currentProductArray.doNotLicense = false;
											
			$scope.currentProductArray.scriptedFlag = currentProductVersion.scriptedFlag;						
			$scope.currentProductArray.hasClearanceMemo = currentProductVersion.clearanceMemo != null;
			$scope.currentProductArray.clearanceMemo = currentProductVersion.clearanceMemo;	
			$scope.currentProductArray.productFileNumbers = currentProductVersion.productFileNumbers;			 
		 	//$scope.updateRightsIndicator();
		    
			if(!currentProductVersion && currentProduct.versions){
				for(var i = 0; i < currentProduct.versions.length; i++){
					if(currentProduct.versions[i].isDefaultVersion){
						currentProductVersion = currentProduct.versions[i];
					}
				}
			}
			if(currentProductVersion && currentProductVersion.foxVersionId != $scope.defaultFoxVersionId){
				scpa.foxVersionId = currentProductVersion.foxVersionId;
				scpa.isDefaultVersion = currentProductVersion.isProductVersionId;
				scpa.hasRightStrands = currentProductVersion.hasRightStrands;
				scpa.productTitle = currentProductVersion.title;
				scpa.productVersionTitle = currentProductVersion.versionTitle;
			}
			else {
				scpa.defaultVersionId = currentProduct.defaultVersionId;
				scpa.isDefaultVersion = currentProduct.isDefaultVersion;
				scpa.hasRightStrands = currentProduct.hasRightStrands;
				scpa.productTitle = currentProduct.title;
				scpa.foxVersionId = currentProduct.defaultVersionId;
				scpa.productVersionTitle = currentProductVersion.versionTitle;
			}
			
			if(currentProductVersion){				
				if(currentProductVersion.actRunTime){
					scpa.runtime = (currentProductVersion.actRunTime/secondInMinute).toFixed(0);
				}
				else if(currentProductVersion.progRunTime){
					scpa.runtime = (currentProductVersion.progRunTime/secondInMinute).toFixed(0);
				}				
			}
			
			scpa.code = currentProduct.financialProductId;
			scpa.productTypeCode = currentProduct.productTypeCode;
			scpa.productTypeDesc = currentProduct.productTypeDesc;
			scpa.productCode = currentProduct.financialProductId;			
			scpa.productionYear = currentProduct.productionYear;
			scpa.firstReleaseDate = currentProduct.releaseDate;
			scpa.realProductTitle = currentProduct.title;
			scpa.lifecycleStatusDescription = currentProduct.lifecycleStatusDescription;
			scpa.financialDivisionCode = currentProduct.financialDivisionCode;		
			
			//TMA adding financialDivisionDesc 
			scpa.financialDivisionDesc = currentProduct.financialDivisionDesc;
			
			scpa.originalMediaDesc = currentProduct.originalMediaDesc;
			scpa.statusCode = currentProduct.statusCode;
			
			// load product version from tree to obtain season and episode count
			if ($scope.productVersionTree.data.foxVersionId == currentProductVersion.foxVersionId) {
			  currentProductVersion = $scope.productVersionTree.data;
			} else {
			  for (var i = 0; i < $scope.productVersionTree.children.length; i++) {
			    if ($scope.productVersionTree.children[i] != null) {
				  if ($scope.productVersionTree.children[i].data.foxVersionId == currentProductVersion.foxVersionId) {
				    currentProductVersion = $scope.productVersionTree.children[i].data;
				    break;
				  }
			    }
			  }
			}
			
			scpa.episodeCount = currentProductVersion.episodeCount;
			scpa.seasonCount = currentProductVersion.seasonCount;
			scpa.foxId = currentProduct.foxId;
			$("#sse_productTitle").html("Title:<BR/><b>" + scpa.productTitle + "</b>");
			//TMA BUG: 46849
			//$("#sse_productCode").html("FIN PROD ID:<BR/><b>" + (scpa.productCode != null ? scpa.productCode : "" ) + "</b>");
			$("#sse_productCode").html("Financial Title ID (WPR ID):<BR/><b>" + (scpa.productCode != null ? scpa.productCode : "" ) + "</b>");
			$("#sse_productTypeCode").html("Product Type:<BR/><b>" + scpa.productTypeDesc + "</b>");
			formatedReleaseDate = erm.Dates.getFormatedReleaseDate(scpa.firstReleaseDate);
			var releaseDate = "US Release Date:<BR/><b>" + formatedReleaseDate+ "</b>";
			$("#sse_firstReleaseDate").html(releaseDate);
			$("#sse_productionYear").html("Production Year:<BR/><b>" + (scpa.productionYear != null ? scpa.productionYear : "") +"</b>");
			$("#sse_currentFoxId").html("Fox ID:<BR/><b>" + scpa.foxId + "</b>");
			$("#sse_currentFoxVersionId").html("Fox Version ID:<BR/><b>" + scpa.foxVersionId +"</b>");
			$("#sse_currentFoxIdJDE").html("JDE Version ID:<BR/><b>" + (scpa.jdeId != null ? scpa.jdeId : "") + "</b>");
									
			if (currentProductVersion.clearanceMemo != null && currentProductVersion.clearanceMemo.entityComment != null) {
			  r = new restriction("", "", "", "", "", "");
			  $("#memoCreatedDate").html(r.getCustomDisplayDate(currentProductVersion.clearanceMemo.entityComment.createDate));
			  $("#memoCreatedBy").html(currentProductVersion.clearanceMemo.entityComment.createName);
			  r = new restriction("", "", "", "", "", "");
			  $("#memoLastUpdatedDate").html(r.getCustomDisplayDate(currentProductVersion.clearanceMemo.entityComment.updateDate));
			  $("#memoLastUpdatedBy").html(currentProductVersion.clearanceMemo.entityComment.updateName);			  			  			    			
			} else {
				  $("#memoCreatedDate").html("");
				  $("#memoCreatedBy").html("");
				  $("#memoLastUpdatedDate").html("");
				  $("#memoLastUpdatedBy").html("");			  			  			    			
			}	
			
			
						
			/**
			 * load the default clearance memo
			 */
			clearanceMemoKendoElementInit.clearanceMemoObject.loadClearenceMemoPreview();			
			
			/**
			 * load the default product version for use in the template
			 */
			if($scope.currentProductLocal && $scope.currentProductLocal.versions){
				for(var i=0; i < $scope.currentProductLocal.versions.length; i++){
					var p = $scope.currentProductLocal.versions[i];
					if(p && p.isDefaultVersion){
						$scope.defaultProductVersion = p;
						break;
					}
				}
			}
			
		}
		else {
			$log.log("The current product is null or otherwise unavailable...");
		}
		
	};	
	
	/**
	 * 
	 */
	$scope.checkHighlightedElement = function(index){
		if($scope.currentLyHighlightedElement == index){
			return true;
		}
		return false;
	};
	
	/**
	 * Load a product comments based on the foxVersionId.
	 */
	$scope.loadComments = function(cObject, foxVersionId){
		var loadingCommentComplete = function(comments){
			if(comments){				
				cObject.comments = comments;
				if(cObject.comments){
					for(var i = 0; i < cObject.comments.length; i++){
						var k = cObject.comments[i];
						if(k && k.comment){
							var str = k.comment.longDescription;
							if(str){
								str = str.replace(/\n/g, "<br/>");
								k.comment.longDescription = str;
							}
						}
					}
				}
				
			}
		};
		commentService.loadCommentByFoxVersionId(foxVersionId, loadingCommentComplete);			
	};		
	
	/**
	 * 
	 */
	$scope.truncateString = function(stringToTruncate){
		return utilService.truncateString($scope.desiredLengthForMenuString, stringToTruncate);
	};
	
	/**
	 * 
	 */
	$scope.getCorrectRunningTime = function(runningTime){
		if(runningTime){
			return runningTime/60;
		}
		return 0;
	};
	
	/**
	 * 
	 */
	$scope.addToCentralFileNumber = function(valueToAdd){
		if($scope.currentProductArray.centralFileNumberArray == null){
			$scope.currentProductArray.centralFileNumberArray = new Array();			
		}
		if($scope.currentProductArray.centralFileNumberArray.indexOf(valueToAdd) < 0){
			$scope.currentProductArray.centralFileNumberArray.push(valueToAdd);
			$scope.currentProductArray.centralFileNumberArray.sort();
			
		}
		$scope.currentProductArray.centralFileNumber = "";
	};
	
	/**
	 * 
	 */
	$scope.removeFromCentralFileNumber = function(indexOfValueToRemove){
		if($scope.currentProductArray.centralFileNumberArray != null && indexOfValueToRemove != null){
			$scope.currentProductArray.centralFileNumberArray.splice(indexOfValueToRemove, 1);
		}		
	};
	
	/**
	 * 
	 */
	$scope.changeDoNotLicense = function(){			
	  kendoElementInit.rightStrandObject.confirmDoNotLicense();
	};
	
	$scope.changeFutureMedia = function changeFutureMedia() {
		var foxVersionId = $scope.currentProductArray.foxVersionId;
		$scope.currentProductArray.finishedSavingProduct = false;
		$scope.currentProductArray.savingProduct = true;
		var currentProductLocal = $scope.searchTree($scope.productVersionTree, foxVersionId);
		var previousValue = currentProductLocal.futureMediaInd;
		var onSuccess = function onSuccess() {
			var scope = $scope;
			scope.currentProductArray.savingProduct = false;		   
			scope.currentProductArray.finishedSavingProduct = true;
			setTimeout(function() {
				  scope.currentProductArray.finishedSavingProduct = false;
				  if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest') {
					scope.$apply();
				  }
				}, erm.statusIndicatorTime); 
			currentProductLocal.futureMediaInd = scope.currentProductArray.futureMediaInd;
			
		};
		var onError = function onError() {
			currentProductLocal.futureMediaInd = previousValue;
		};
		
		rightsService.updateFutureMedia(foxVersionId,$scope.currentProductArray.futureMediaInd,onSuccess,onError);

	};
	
	$scope.legalConfirmationDescMap = erm.dbvalues.legalConfirmationDescMap; 
	
	$scope.changeScripted = function(){		
		$scope.currentProductArray.finishedSavingProduct = false;
		$scope.currentProductArray.savingProduct = true;		
		rightsService.updateScriptedFlag($scope.currentProductArray.foxVersionId, $scope.currentProductArray.scriptedFlag);
	};
	
	$scope.changeConfirmationStatus = function(){		
		$scope.currentProductArray.finishedSavingProduct = false;
		$scope.currentProductArray.savingProduct = true;
		$("body").css("cursor", "wait");
		rightsService.updateLegalConfirmationStatus($scope.currentProductArray.foxVersionId, $scope.currentProductArray.legalConfirmationStatusId);
		$("#legalConfirmationStatusDescription").html($scope.getLegalStatusDescription($scope.currentProductArray.legalConfirmationStatusId));
		$("#legalConfirmationStatusDescription").html(
				 erm.dbvalues.legalConfirmationDescMap[$scope.currentProductArray.legalConfirmationStatusId] != null ? 
						 erm.dbvalues.legalConfirmationDescMap[$scope.currentProductArray.legalConfirmationStatusId] : "");				
	};
	
	$scope.changeFoxProducedInd = function(){		
		$scope.currentProductArray.finishedSavingProduct = false;
		$scope.currentProductArray.savingProduct = true;
		$("body").css("cursor", "wait");
		rightsService.updateFoxProducedInd($scope.currentProductArray.foxVersionId, $scope.currentProductArray.foxProducedInd);
	    var foxProduced = "";
	    if (eval($scope.currentProductArray.foxProducedInd) == 1)
		  foxProduced = "Yes";
	    else if (eval($scope.currentProductArray.foxProducedInd) == 0)
		  foxProduced = "No";	      	   		 		  
	    $(".cmFoxProduced").html(foxProduced);
	};
	
	$scope.displayConfirmationStatus = function() {
		var rcscope = angular.element(document.getElementById("rightsController")).scope();
		var legalConfirmationStatusId = eval(rcscope.currentProductArray.legalConfirmationStatusId);
 	    $("#create-new-version").prop('checked',false);
		if (legalConfirmationStatusId != null)
		  $(".memoPreviewConfirmationStatus").html(erm.dbvalues.legalConfirmationStatusMap[legalConfirmationStatusId]);
		//$(".memoPreviewConfirmationStatus").html("DRAFT:  Do Not Use");			
	};	   
	
	
	$scope.getRightsService = function(){			
		return $scope.rightsService;
	};
		
	/**
	 * This method is used to make sure that the data is available before we start processing. This method should be called 
	 * on entry.
	 */
	$scope.loadStartingData = function loadStartingData(startingFoxVersionId,isFoxipediaSearch){
		showLoadingPopupWindow();
		var mainScope = angular.element(document.getElementById("mainController")).scope();
		mainScope.showGetStartedMenu = false;
		var loadTree = function(tree){			
			 $scope.productVersionTree = tree;			 		
			 if (tree.data != null) {
				 product = tree.data;
				 $scope.defaultFoxVersionId = product.foxVersionId;
				 $scope.movieTitle = product.title;
				 $scope.defaultFoxId = product.foxId;
				 $scope.movieTitle = product.title;
				 $scope.defaultProductVersion = product;
				 $scope.rightsIconType = product.rightsIconType;
				 $scope.loadVersions(startingFoxVersionId,isFoxipediaSearch);
			 }			 
			 $scope.treeLoaded = true;			 			 
		};
						
		if(!$scope.treeLoaded){			
			$scope.parentFoxVersionId = startingFoxVersionId;
			rightsService.productVersionTree($scope.parentFoxVersionId, isFoxipediaSearch, loadTree);
		}
		
		var cProduct = sharedStateService.getCurrentProduct();
		if(false && cProduct != null && cProduct.product != null && cProduct.productVersion != null){
			//We need all this information to properly populate the front-end
			 $scope.doRightSearch(cProduct);			 
			 dataLoaded = true;	
		} else if($scope.treeLoaded) {
		  $scope.loadVersions(startingFoxVersionId,isFoxipediaSearch);			 
		}
		$scope.showExpandStrandInformationalCodes = true;
//		$scope.loadSubrightsAndSalesMarketing();	
//		$scope.loadCopyrightNotice();
	};
	
	$scope.clearStrandsFilter = function clearStrandsFilter() {
		strands.filter.clear();
	};
	
	
	/**
	 * TODO dataLoaded is a global variable. This is WROOOOOONG!!! it should not be global
	 */
	$scope.loadVersions = function loadVersions(startingFoxVersionId,isFoxipediaSearch){
		$scope.foxVersionId=startingFoxVersionId;
		//Product version will have a reference to the product
		var versionCompleted = function versionCompleted(productVersion){
		  var product = productVersion.product;
		  var cProduct = {};
		  cProduct.product = product;			 			
		  cProduct.productVersion = productVersion;			 
		  dataLoaded = true;
		  $scope.doRightSearch(cProduct,isFoxipediaSearch);
		  //AMV 2/12/2014
		  closeLoadingPopupWindow();
		  $scope.doneLoading = true;
	    };
	    rightsService.productVersionSingle(startingFoxVersionId, versionCompleted,isFoxipediaSearch);
	    
	};
	
	/**
	 * 
	 */
	//TODO remove, this shouldn't be nacessary if we get the product version (which has the product in itself)
	$scope.loadProduct = function(foxVersionId, foxId){
	};
	
	/**
	 * 
	 */
	$scope.toggleProductVersion = function(version){
		if(version){
			if(version.data.showFactor == true){
				version.data.showFactor = false;
			}
			else {
				version.data.showFactor = true;
			}
		}
	};
	
	$scope.showHideColumn = function(gridId){
		strands.showHideColumn(gridId);
	};
	
	$scope.shouldSyncReleaseDate = function(){ //firstReleaseDate, gridId){
		var date = new Date($scope.currentProductArray.firstReleaseDate); //var date = new Date(firstReleaseDate);
		$scope.shouldShowSyncButton = strands.shouldSyncReleaseDate(date, 'strandsGrid');	
		strands.refreshGrid('strandsGrid');
	};
	
	$scope.sync = function sync(gridId){
		rightsService.syncReleaseDate($scope.currentProductArray.foxVersionId, $scope.currentProductArray.firstReleaseDate, gridId);
//		$("#filter-clear-button").click();
	};
	
	$scope.showSuccessMessage = function(){
		$scope.showSyncSuccessMessage = true;
		setTimeout(function(){
			$scope.showSyncSuccessMessage = false;
			if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
				$scope.$apply();
			}
		}, 10000);
	};
	/**********************************************************************
	 *          START SUBRIGHTS SECTION                                   *
	 *********************************************************************/
	$scope.subrightGrantCodes = new Array();
	$scope.subrightsStatusArray = new Array();
	$scope.salesAndMerchandisingCategories = new Array();
	$scope.grantCodeSubtab = null; 
	$scope.enableAddButton = false;
	$scope.productSubrightsCurrent = {
			productGrantId : null,
			grantStatusId : null,
			grantStatus : null,
			legalIndicator : null,
			BusinessIndicator : null,
			grantCodeId : null,
			comments : null,
			showComments : false,
			title : null,
			foxVersionId : null
			
	};
	
	/**
	 * 
	 */
	$scope.resetProductSubrightsCurrent = function(){
		$scope.productSubrightsCurrent = {};
	};
	
	$scope.getGrantStatusById = function getGrantStatusById(grantStatusId) {
		var grantStatus = null;
		if ($scope.subrightsStatusArray) {
			$.each($scope.subrightsStatusArray,function(idx,elem){
				if (elem.grantStatusId===grantStatusId) {
					grantStatus = elem; 
				}
			});
		}
		return grantStatus;
	};
	
	
	$scope.loadSubrightCommentsByGrantCode = function loadSubrightCommentsByGrantCode(foxVersionId, grantCodeId) {
		var onSuccess = function(productGrant) {
			var current = $scope.productSubrightsCurrent;
			var grantStatus = null;
			console.log('in controller loadSubrightCommentsByGrantCode',productGrant);
			if (productGrant) {				
				current.comments = productGrant.comments;
				if (productGrant.grantStatusId) {
					grantStatus = $scope.getGrantStatusById(productGrant.grantStatusId);
					current.grantStatus = grantStatus; 
				}

			}
		};
		productSubrightsService.getCommentByGrantCodeId(grantCodeId,foxVersionId,onSuccess);
//		var success = function(comments){
//			if (comments) {
//				$scope.productSubrightsCurrent.comments = comments;
//			}
//		};
//		
//		console.log("loadSubrightComments grantCodeId: " + grantCodeId + " foxVersionId:  " + foxVersionId);
//		productSubrightsService.loadCommentsUsingGrantCodeId(grantCodeId, foxVersionId, success);		
	};
	
	
	/**
	 * 
	 */
	$scope.loadSubrightComments = function(){
		
		var success = function(comments){
			$scope.productSubrightsCurrent.comments = comments;
		};
		
		console.log("loadSubrightComments grantCodeId: " + $scope.grantCodeSubtab.grantCodeId + " foxVersionId:  " + $scope.foxVersionId);
		productSubrightsService.loadCommentsUsingGrantCodeId($scope.grantCodeSubtab.grantCodeId, $scope.foxVersionId, success);
	};
	
	/**
	 * 
	 */
	$scope.populateSubrightGrantCode =  function(data){		
			if(data){
				
				$scope.subrightGrantCodes = new Array();
				
				for(var i = 0; i < data.length; i++){
					var ar = {};
					var d = data[i];
					if(d.activeFlag === 'Y' && d.grantTypeId === 1){
						
						ar.grantCodeId = d.id;
						ar.grantCodeDescription = d.description;
						ar.grantCode = d.code;
						ar.grantTypeId = d.grantTypeId;
						if(!$scope.grantCodeSubtab){
							$scope.grantCodeSubtab = ar;
						}
						$scope.subrightGrantCodes.push(ar);
					}
				}
			}
	};
	
	
	
	/**
	 * 
	 */
	$scope.populateSubrightsStatus = function(data){
		
		if(data){
			$scope.subrightsStatusArray = new Array();
			$scope.subrightsStatusArray.push({"grantStatusId":-1, "grantStatusDescription":"No Status (blank)", "code":"NSBLANK"});
			for(var i = 0; i < data.length; i++){
				var ar = {};
				var d = data[i];
				ar.grantStatusId = d.id;
				ar.grantStatusDescription = d.description;
				ar.grandStatusCode = d.code;
				$scope.subrightsStatusArray.push(ar);
			}
		}
	};
	
	/**
	 * 
	 */
	$scope.populateProductSubrights = function(data){
		
		if(data){
			$scope.productSubrightsArray = new Array();
			
			for(var i = 0; i < data.length; i++){
				var ar = new Array();
				var d = data[i];
				ar.id = d.id;
				ar.foxVersionId = d.foxVersionId;
				ar.grantStatusId = d.grantStatusId;
				ar.legalIndicator = d.legalIndicator;
				ar.BusinessIndicator = d.BusinessIndicator;
				ar.grantCodeId = d.grantCodeId;
				ar.startDateCodeId = d.startDateCodeId;
				ar.startDateExprInstcId = d.startDateExprInstcId;
				ar.endDateCodeId = d.endDateCodeId;
				ar.endDateExprInstcId = d.endDateExprInstcId;
				ar.createDate = d.createDate;
				ar.endDate = d.endDate;
				ar.updateDate = d.updateDate;
				ar.startDate = d.startDate;
				ar.createName = d.createName;
				ar.updateName = d.updateName;
				ar.comments = new Array();
				
				$scope.productSubrightsArray.push(ar);
			}
		}
	};
	
	/**
	 * 
	 */
	$scope.setCurrentProductGrant = function(grantCodeId){
		
		for(var i = 0; i < $scope.productSubrightsArray.length; i++){
			var pg = $scope.productSubrightsArray[i];
			if(pg.grantCodeId == grantCodeId){
				$scope.productSubrightsCurrent = pg;
				break;
			}
		}
	};
	
	/**
	 * loading the current product grant view 
	 */
	$scope.populateCurrentProductGrant = function(grantCodeId){
		$scope.resetProductSubrightsCurrent();
		
		$scope.productSubrightsCurrent.grantCodeId = grantCodeId;
		
		var productGrants = $scope.productSubrightsArray;

		console.log("populateCurrentProductGrant productGrants: " + productGrants + " grantCodeId: " +  grantCodeId);				

		$scope.loadSubrightCommentsByGrantCode($scope.foxVersionId,grantCodeId);		
		
		if(productGrants && productGrants.length > 0){
			
			for(var i = 0; i < productGrants.length; i++){
				if(grantCodeId == productGrants[i].grantCodeId){	
					for(var k=0; k < $scope.subrightsStatusArray.length; k++){
						var s = $scope.subrightsStatusArray[k];
						if(productGrants[i].grantStatusId == s.grantStatusId){
							productGrants[i].grantStatus = s;
							break;
						}
					}
					
					$scope.productSubrightsCurrent = productGrants[i];
//					$scope.loadSubrightComments();
					break;
				}
			}
		}
		
		for(var j=0; j < $scope.subrightGrantCodes.length; j++){
			var g = $scope.subrightGrantCodes[j];
			if(grantCodeId == g.grantCodeId){
				$scope.productSubrightsCurrent.title = g.grantCodeDescription;
				break;
			}
		}
		
		if($scope.productSubrightsCurrent.grantStatus != null && $scope.productSubrightsCurrent.grantStatus.grantStatusId > 0){
			$scope.enableAddButton = true;
		}
		else {
			$scope.enableAddButton = false;
		}
		
	};
	
	/**
	 * Method responsible for retrieving all the grant codes and product grant pertaining to
	 * a spefic version id.
	 */
	$scope.loadSubrightsAndSalesMarketing = function(){
		var subrightsLoaded = function(data){
			
			if(data){			
				$scope.populateSubrightsTab(data);			
				$scope.populateSalesAndMarketingTab(data);
			}
		};
		productSubrightsService.loadSubrights($scope.foxVersionId, subrightsLoaded);
	};
	
	/**
	 * 
	 */
	$scope.switchSubTabs=function(subTabName){
		
		if($scope.subrightGrantCodes && $scope.subrightGrantCodes.length > 0){
			for(var i = 0; i < $scope.subrightGrantCodes.length; i++){
				var gc = $scope.subrightGrantCodes[i];
				if(gc){
					var code = gc.grantCode;
					if(code == subTabName && $scope.grantCodeSubtab.grantCode != code){
						$scope.grantCodeSubtab = gc;
						var b = $scope.productSubrightsCurrent.showComments;
						$scope.populateCurrentProductGrant(gc.grantCodeId);
						$scope.productSubrightsCurrent.showComments = b;
					}
				}
			}
		}
	};
	
	
	/**
	 * 
	 */
	$scope.productSubrightsStatusChanged = function(){
		if($scope.productSubrightsCurrent.grantStatus != null && $scope.productSubrightsCurrent.grantStatus.grantStatusId >= -1){
			$scope.enableAddButton = true;
			$scope.updateProductGrantStatus();
		}
		else {
			$scope.enableAddButton = false;
		}
	};
	
	/**
	 * 
	 */
	$scope.toggleSubrightsComments = function(){
		if($scope.productSubrightsCurrent.showComments){
			$scope.productSubrightsCurrent.showComments = false;
		}
		else {
			$scope.productSubrightsCurrent.showComments = true;
		}
		for (var i = 0; i < $scope.productSubrightsCurrent.comments.length; i++) {		  
			$scope.productSubrightsCurrent.comments[i].commentExpanded = $scope.productSubrightsCurrent.showComments;  
		}
	};
	
	/**
	 * 
	 */
	$scope.populateSubrightsTab = function(data){
		if(data){
			
			var grantCodes = data.grantCodeList;
			var grantStatuses = data.grantStatusList;
			var productGrants = data.productGrantList;
			
			$scope.populateSubrightGrantCode(grantCodes);
			$scope.populateSubrightsStatus(grantStatuses);
			$scope.populateProductSubrights(productGrants);
			$scope.populateCurrentProductGrant($scope.grantCodeSubtab.grantCodeId);
			$scope.productSubrightsCurrent.showComments = false;
		}
	};
	
	
	/**
	 * 
	 */
	$scope.updateProductGrantStatus = function(){	
		$scope.currentProductArray.savingProduct = true;		   
		$scope.currentProductArray.finishedSavingProduct = false;	
		var result = function(data){
			//$scope.loadSubrightsAndSalesMarketing();	
			$scope.currentProductArray.savingProduct = false;		   
			$scope.currentProductArray.finishedSavingProduct = true;
			setTimeout(function() {
			  $scope.currentProductArray.finishedSavingProduct = false;
			  if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
				  $scope.$apply();
			  }
			}, erm.statusIndicatorTime); 
		};		
		var ob = new Object();
		ob.id = $scope.productSubrightsCurrent.id;
		ob.foxVersionId = $scope.foxVersionId;
		ob.grantCodeId = $scope.productSubrightsCurrent.grantCodeId;
		ob.grantStatusId = $scope.productSubrightsCurrent.grantStatus.grantStatusId;
		
		var jsonData = JSON.stringify(ob);
		if(!isNaN(ob.id) && ob.id > 0){
			productSubrightsService.updateProductGrantStatus(jsonData, result);
		}
		else {
			productSubrightsService.saveProductGrantStatus(jsonData, result);
		}	
	};
	
	/**
	 * 
	 */
	$scope.formatMenuItem = function(menuItem){
		var str = null;
		var st = null;
		str = menuItem;
		if(menuItem){
			st = new String(menuItem);						
			str = toTitleCase(st);
		}
		return str;
	};
	
	/**
	 * 
	 */
	$scope.changeFirstCharatertoUpperCase = function(st){
		return st.substring(0,1).toUpperCase()+st.substring(1).toLowerCase();
	};
	
	/**********************************************************************
	 *          END SUBRIGHTS SECTION                                     *
	 *********************************************************************/
	
	/**********************************************************************
	 *          START SALES AND MARKTING SECTION                          *
	 *********************************************************************/
	$scope.salesMarketingGrantCodes = null;
	$scope.salesMarketingGrantCodeSubtab = null;
	$scope.enableSalesMarketingAddButton = false;
	$scope.salesMarketingStatus = new Array();
	$scope.productSalesMarketingCurrent = new Array();
	
	
	$scope.salesAndMarketingTab = new Array();
	
	$scope.salesAndMarketingSubtab = {
			productGrant : null,
			grantCode : null,
			grantCategory : null,
			showComments : false,
			grantCategorySelected : null,
			sortedComments : null		
	};
	
	/**
	 * 
	 */ 
	$scope.loadSalesAndMarketingComments = function(grantCategory){
		
		var grantCodeId = $scope.salesAndMarketingSubtab.grantCode.id;
		
		console.log("TMA debug: grantCodeId: ", grantCodeId);
		
		var foxVersionId = $scope.foxVersionId;
		var success = function(comments){
			//console.log("TMA debug: loadSalesAndMarketingComments grantCodeId; ", grantCodeId);
			
			$scope.salesAndMarketingSubtab.sortedComments = $scope.sortComments(comments, grantCategory);
			$scope.setCurrentCommentsByGrantCode();			
			var commentCount = 0;
			//console.log("loadSalesAndMarketingComments sortedComments %o", $scope.salesAndMarketingSubtab.sortedComments);			
			for (var j = 0; j < $scope.salesAndMarketingSubtab.sortedComments.length; j++) {
			  var sortedComments = $scope.salesAndMarketingSubtab.sortedComments[j].comments;
			  for (var i = 0; i < sortedComments.length; i++) {
			    if ((sortedComments[i].comment.publicInd == 1 || sortedComments[i].comment.publicInd == null) || (($scope.security.isBusiness && sortedComments[i].comment.business && $scope.security.canViewPrivateComments) || (!$scope.security.isBusiness && sortedComments[i].comment.legal && $scope.security.canViewPrivateComments)) || ($scope.user.userId == sortedComments[i].comment.createName)) {
			      commentCount++;
			    }
			  }			
			}
			//console.log("loadSalesAndMarketingComments grantCodeId " + grantCodeId + " commentCount " + commentCount);
			$scope.smTabCommentCount[grantCodeId] = commentCount;			
		};
		//console.log("loadSalesAndMarketingComments grantCodeId " + grantCodeId + " foxVersionId " + foxVersionId);		
		productSubrightsService.loadCommentsUsingGrantCodeId(grantCodeId, foxVersionId, success);
	};
	
	
	/**
	 * 
	 */
	$scope.populateSalesAndMarketingTab = function(data){
		$scope.salesAndMarketingTab = new Array();
		if(data){
			var grantCodes = data.grantCodeList;
			var productGrants = data.productGrantList;
			var grantCategory = data.grantCategoryList;
			var gcob = new Object(); 
			$scope.splitCategories(grantCategory, gcob);
			//The id:5052 entry is a random entry designed to represent
			//the 'ALL' selection option since this is not in the database.
			var startingMenuArray = {id:5052, code:"ALL", description:"All"};
			
			var defaultGrandCodeId = 0;
			var defaultGrandCode = "";
			for(var i = 0; i < grantCodes.length; i++){					
				var d = grantCodes[i];
				
				if(d.activeFlag == 'Y' && d.grantType.id === 3){
					var ar = new Array();
					
					ar.grantCode = grantCodes[i];
					ar.productGrant = $scope.getProductGrant(productGrants, d.id);
					ar.grantCategory = gcob.otherCategories;
					ar.grantCategorySelected = ar.grantCategory[0];
					if(ar.grantCategory[0].id != 5052){
						ar.grantCategory.splice(0, 0, startingMenuArray);
					}
					
					$scope.salesAndMarketingTab.push(ar);
					if(!$scope.salesAndMarketingSubtab || !$scope.salesAndMarketingSubtab.grantCode){
						$scope.salesAndMarketingSubtab = ar;
						$scope.salesAndMarketingSubtab.grantCategorySelected = ar.grantCategory[0];
						defaultGrandCodeId = ar.grantCode.id;
						defaultGrandCode = ar.grantCode.code;
						$scope.salesAndMarketingSubtab.showComments = false;						
					}
					// preload comments for comment count					
					$scope.salesAndMarketingSubtab.grantCode.id = ar.grantCode.id;
					$scope.loadSalesAndMarketingComments($scope.salesAndMarketingSubtab.grantCategory);
				}
			}			
			
			var oldGrantCategory = $scope.salesAndMarketingSubtab.grantCategory;
			var promo = new Array();
			promo.grantCode = {id:-1, code:"PROMO_MTRL", description:"Promotional Material"};
			promo.productGrant = null;
			promo.grantCategory = gcob.promotionCategories;
			promo.grantCategory.splice(0, 0, {id:1000, code:"ALL", description:"All"});
			promo.grantCategorySelected = promo.grantCategory[0];
			$scope.salesAndMarketingSubtab.grantCategory = promo.grantCategory;
			$scope.salesAndMarketingTab.push(promo);
			// load promotional materials				
			$scope.salesAndMarketingSubtab.grantCode.id = -1;
			$scope.loadSalesAndMarketingComments(promo.grantCategory);
			// reload first category
			$scope.salesAndMarketingSubtab.grantCategory = oldGrantCategory
			console.log("switchSalesMarketingSubTabs defaultGrandCode ", defaultGrandCode);			  
			$scope.salesAndMarketingSubtab.grantCode.id = defaultGrandCodeId;
			$scope.switchSalesMarketingSubTabs(defaultGrandCode);
			$scope.loadSalesAndMarketingComments(oldGrantCategory);		  					
		}
	};
	
	/**
	 * 
	 */
	$scope.getProductGrant = function(productGrantList, grantCodeId){
		var productGrant = null;
		if(productGrantList && productGrantList.length > 0){
			for(var i = 0; i < productGrantList.length; i++){
				var pg = productGrantList[i];
				if(grantCodeId == pg.grantCodeId){
					productGrant = pg;
					break;
				}
			}
		}
		return productGrant;
	};
	
	/**
	 * 
	 */
	$scope.splitCategories = function(categories, categoryObject){
		if(categoryObject.promotionCategories){
			categoryObject.promotionCategories = null;
		}
		if(categoryObject.otherCategories){
			categoryObject.otherCategories = null;
		}
		
		var promoCat = new Array();
		var otherCat = new Array();
		for(var i = 0; i < categories.length; i++){
			var c = categories[i];
			if(c.categoryId === 7){
				otherCat.push(c);
			}
			else {	
				c.description = $scope.formatMenuItem(c.description);
				promoCat.push(c);
			}
		}
		
		categoryObject.promotionCategories = promoCat;
		categoryObject.otherCategories = otherCat;		
	};
	
	/**
	 * 
	 */
	$scope.sortComments = function(comments, categories){
		var mainCommentObject = new Array();
		var arr={};
		//Fix promo material
		//compare if entity type id = 10 and handle specailly
		//special handling as this is not really a grant
		
		if(comments && categories){
			for(var i = 0; i < categories.length; i++){
				var cat = categories[i];
				var co = $scope.getCategoryComments(comments, cat.id);
				if(co && co.length > 0){
					arr = new Object();
					arr.id = cat.id;
					arr.categoryId = cat.categoryId;
					arr.code = cat.code;
					arr.description = cat.description;
					arr.comments = co;
					mainCommentObject.push(arr);
				}
			}
		}
		return mainCommentObject;
	};
	
	/**
	 * 
	 */
	$scope.getCategoryComments = function(comments, categoryId){
		var PROMO_MATERIAL_ENTITY_TYPE_ID=10;
		var ar = new Array();
		if(comments && comments.length > 0){
			for(var i = 0; i < comments.length; i++){
				var c = comments[i];
				if (c.entityCommentTypeId == PROMO_MATERIAL_ENTITY_TYPE_ID) {
					if (c.promoMaterialId==categoryId) {
						ar.push(c);
					}
				} else if(c.entityCommentTypeId == categoryId){
					ar.push(c);
				}
			}
		}
		return ar;
	};
	
	
	/*AMV Original function
	*
	*/
	$scope.switchSalesMarketingSubTabs=function(subTabName){
		
		
		console.log("TMA debug: switchSalesMarketingSubTabs %o", subTabName);
		console.log("TMA debug: $scope.salesAndMarketingTab %o", $scope.salesAndMarketingTab);
		console.log("TMA debug: $scope.salesAndMarketingTab.length %o", $scope.salesAndMarketingTab.length);
		
		
		if($scope.salesAndMarketingTab && $scope.salesAndMarketingTab.length > 0){
			for(var i = 0; i < $scope.salesAndMarketingTab.length; i++){
				var gc = $scope.salesAndMarketingTab[i].grantCode;
				if(gc){
					var code = gc.code;
					if(code == subTabName) { 
						//&& $scope.salesAndMarketingSubtab.grantCode.code != code){
						var b = $scope.salesAndMarketingSubtab.showComments;
						$scope.salesAndMarketingSubtab = $scope.salesAndMarketingTab[i];
						$scope.salesAndMarketingSubtab.showComments = b;
						$scope.loadSalesAndMarketingComments($scope.salesAndMarketingSubtab.grantCategory);
					}
				}
			}
		}
	};
	
		
	/**
	 * TMA 12/4/14...working on bug 29328....I think the algorthim can be better for this one
	 * but oh well....I think the bug is fixed but I think there may be a ripple effect
	 */
	/*
	$scope.switchSalesMarketingSubTabs=function(subTabName){
		
		
		console.log("TMA debug: switchSalesMarketingSubTabs %o", subTabName);
		console.log("TMA debug: $scope.salesAndMarketingTab %o", $scope.salesAndMarketingTab);
		console.log("TMA debug: $scope.salesAndMarketingTab.length %o", $scope.salesAndMarketingTab.length);
		
		
		if($scope.salesAndMarketingTab && $scope.salesAndMarketingTab.length > 0){
			console.log("TMA debug: loading sales and marketing comment for $scope.salesAndMarketingTab[0].grantCategory %o", $scope.salesAndMarketingTab[0].grantCategory);
			$scope.loadSalesAndMarketingComments($scope.salesAndMarketingTab[0].grantCategory);
			
			for(var i = 0; i < $scope.salesAndMarketingTab.length; i++){
				console.log("TMA debug: grantCode.id of the tab in the scope: ", $scope.salesAndMarketingTab[i].grantCode.id);
				console.log("TMA debug: grantCode.id of the SUBTAB in the scope: ", $scope.salesAndMarketingSubtab.grantCode.id);
				console.log("TMA debug: grantCode.code of the SUBTAB in the scope: ", $scope.salesAndMarketingSubtab.grantCode.code);

				var gc = $scope.salesAndMarketingTab[i].grantCode;
				
				console.log("TMA debug: comment count --> ", $scope.getSMTabCommentCount(gc.id));

				if(gc){
					var code = gc.code;
				
					var b = $scope.salesAndMarketingSubtab.showComments;
					console.log("TMA debug: show comments? ", b);
					
					if((code == subTabName) && ($scope.salesAndMarketingSubtab.grantCode.code != code)){
					
						var b = $scope.salesAndMarketingSubtab.showComments;
						
						console.log("TMA debug: saving previous tab");
						console.log("TMA debug: $scope.salesAndMarketingTab[i] %o", $scope.salesAndMarketingTab[i]);
						console.log("TMA debug: where i = ", i);
						
						console.log("TMA debug: $scope.getSMTabCommentCount(gc.id): ", $scope.getSMTabCommentCount(gc.id));
						console.log("TMA debug: $scope.salesAndMarketingTab[i].currentComments: ", $scope.salesAndMarketingTab[i].currentComments);
						
						var currentComments = $scope.salesAndMarketingTab[i].currentComments;
						console.log("TMA debug: currentComments: ", currentComments);

						
						$scope.salesAndMarketingSubtab = $scope.salesAndMarketingTab[i];
						$scope.salesAndMarketingSubtab.showComments = b;
						$scope.loadSalesAndMarketingComments($scope.salesAndMarketingTab[i].grantCategory);
						
					} //inner if
				  }  //if (gc)
				
			}
		}
	};
	*/
	
	$scope.smTabCommentCount = {};	
	$scope.getSMTabCommentCount = function(grantCodeId){		
		return $scope.smTabCommentCount[grantCodeId];
	};
	
	/**
	 * 
	 */
	$scope.populateSalesMarketingCurrentProductGrant = function(grantCodeId){
		for(var j=0; j < $scope.salesMarketingGrantCodes.length; j++){
			var g = $scope.salesMarketingGrantCodes[j];
			if(grantCodeId == g.grantCodeId){
				$scope.productSalesMarketingCurrent.title = g.grantCodeDescription;
				break;
			}
		}
	};
	
	/**
	 * 
	 */
	$scope.productSalesMarketingStatusChanged = function(){
		if($scope.productSalesMarketingCurrent.grantStatus != null && $scope.productSalesMarketingCurrent.grantStatus.grantStatusId > 0){
			$scope.enableSalesMarketingAddButton = true;
		}
		else {
			$scope.enableSalesMarketingAddButton = false;
		}
	};
	
	/**
	 * 
	 */
	$scope.toggleSalesMarketingComments = function(){
		if($scope.salesAndMarketingSubtab.showComments){
			$scope.salesAndMarketingSubtab.showComments = false;
		}
		else {
			$scope.salesAndMarketingSubtab.showComments = true;
		}
		for (var i = 0; i < $scope.salesAndMarketingSubtab.currentComments.length; i++) {
		  for (var j = 0; j < $scope.salesAndMarketingSubtab.currentComments[i].comments.length; j++) {			
			$scope.salesAndMarketingSubtab.currentComments[i].comments[j].commentExpanded = $scope.salesAndMarketingSubtab.showComments;  
		  }
		}
	};
	
	/**
	 * 
	 */
	$scope.populateSalesMarketingStatus = function(data){
		
		if(data){
			$scope.salesMarketingStatus = new Array();
			for(var i = 0; i < data.length; i++){
				var ar = new Array();
				var d = data[i];
				ar.grantStatusId = d.id;
				ar.grantStatusDescription = d.description;
				ar.grandStatusCode = d.code;
				$scope.salesMarketingStatus.push(ar);
			}
		}
	};
	
	/**
	 * 
	 */
	$scope.setCurrentCommentsByGrantCode = function(){	
		var b = false;
		if($scope.salesAndMarketingSubtab){
			var code = $scope.salesAndMarketingSubtab.grantCategorySelected.code;
			var commentArray = $scope.salesAndMarketingSubtab.sortedComments;
			if(commentArray){
				if(code == "ALL"){
					$scope.salesAndMarketingSubtab.currentComments = commentArray;
					b = true;
				}
				else {
					$scope.salesAndMarketingSubtab.currentComments=[];					
					for(var i = 0; i < commentArray.length; i++){
						var c0 = commentArray[i];					
						if(c0 && c0.code == code){
							$scope.salesAndMarketingSubtab.currentComments.push(c0);
							b = true;
							break;
						}
					}					
				}				
			}
			
			if(!b){
				$scope.salesAndMarketingSubtab.currentComments = [];
			} else {	
				// put security around the comments before it's set in the scope
				for (var j = 0; j < $scope.salesAndMarketingSubtab.currentComments.length; j++) {
				  var checkedSecurityComments = [];
				  var uncheckedComments = $scope.salesAndMarketingSubtab.currentComments[j].comments;
				  //console.log("uncheckedComments %o", uncheckedComments);				
				  if (uncheckedComments != null) {
					for (var i = 0; i < uncheckedComments.length; i++)  {
						var currentComment = uncheckedComments[i].comment;
						var isBusiness = $scope.security.isBusiness;
						var canViewPrivateComments = $scope.security.canViewPrivateComments;
						if (
							(currentComment.publicInd == 1 || currentComment.publicInd == null) || 
							( isBusiness && currentComment.business && canViewPrivateComments) || 
						    (!isBusiness && currentComment.legal && canViewPrivateComments) || 
							($scope.user.userId == currentComment.createName)
							) {
							checkedSecurityComments.push(uncheckedComments[i]);
						}
					}
					//console.log("checkedSecurityComments %o", checkedSecurityComments);
					$scope.salesAndMarketingSubtab.currentComments[j].comments = checkedSecurityComments;
				  }
				}
			}
		}
	};
	/**********************************************************************
	 *          END SALES AND MARKTING SECTION                            *
	 *********************************************************************/
	
	$scope.loadStartingData($scope.foxVersionId,$scope.isFoxipediaSearch);	
	 	 
});


/* RIGHTS CONTRLLER (end) */

app.controller('ContractualPartyController',function ContractualPartyController($scope,$log,$routeParams){
	
	$scope.foxEntityId = null;
	$scope.partyId = null;		
	
	$scope.savedContractualParties = [];
	
	$scope.nextPartyIndex = 0;
	
	$scope.selectedContractInfoId = 0;
	
	$scope.selectedParty = null;
	
	$scope.removeContractualPartiesIndicatorResponses = function() {
		$("#memo-contractp-response").removeClass("contractualPartyErrorClass");
		$("#memo-contractp-response").removeClass("displayInline");
		$("#memo-contractp-spinner").removeClass("displayInline");
		$("#memo-contractp-check").removeClass("displayInline");
		$("#memo-contractp-spinner-message").removeClass("tocErrorClass");
		$("#memo-contractp-response").removeClass("successClass");
		$("#memo-contractp-response").removeClass("deletedClass");	
	};
	
	$scope.startContractualPartiesIndicatorResponses = function() {
		$scope.removeContractualPartiesIndicatorResponses();
		$("#memo-contractp-response").addClass("displayInline");
		$("#memo-contractp-spinner").addClass("displayInline");    
	};
		  
	$scope.loadContractualParties = function () {
		$scope.startContractualPartiesIndicatorResponses();
		$("#contractp-add").attr("disabled", "disabled");			
		$("#contractp-add").addClass("btn-disabled");
		$("#saveContractualPartiesButton").attr("disabled", "disabled");			
		$("#saveContractualPartiesButton").addClass("btn-disabled");	
		var rcscope = angular.element(document.getElementById("rightsController")).scope();	    
		$scope.savedContractualParties = [];	     
	  	$("#memo-contractp-spinner-message").html("Loading Contractual Parties...");
	  	var path = paths("rest");
		var url = path.getContractualPartyErmContractListRESTPath();	   
		$.get(url + '/' + rcscope.foxVersionId, function(data){	   
			$scope.savedContractualParties = data;
			$scope.nextPartyIndex = data.length;
			for (var i = 0; i < data.length; i++) {
			  $scope.savedContractualParties[i].index = i;
			  delete $scope.savedContractualParties[i].$$hashKey; 
			}
			$("#memo-contractp-spinner").removeClass("displayInline");
		    $("#memo-contractp-response").addClass("successClass");	    	
		    $("#memo-contractp-check").addClass("displayInline");
		    $("#memo-contractp-spinner-message").html("Loaded");
			$("#contractp-add").removeAttr("disabled");
		    $("#contractp-add").removeClass("btn-disabled");
		    $("#saveContractualPartiesButton").removeAttr("disabled", "disabled");			
			$("#saveContractualPartiesButton").removeClass("btn-disabled");
			setTimeout(function() {
			  $("#memo-contractp-check").removeClass("displayInline");
			  $("#memo-contractp-spinner").removeClass("displayInline");
			  $("#memo-contractp-response").removeClass("displayInline");		  
			}, erm.statusIndicatorTime);
			if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
			  $scope.$apply();
			}
			for (var i = 0; i < data.length; i++) {			  
			  $("#cpDate_" + i).data("kendoDatePicker");
		      $("#cpDate_" + i).kendoDatePicker({
		   		  footer: "Today - #=kendo.toString(data, 'd') #",
		   		  format : "MM/dd/yyyy",
		   		  parseFormats : ["yyyy-MM-dd", "EEE, d MMM yyyy", "EEE, MMM d, ''yy"]
		      });
			};
			if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
			  $scope.$apply();
			}
			setTimeout(function(){
			  for (var i = 0; i < $scope.savedContractualParties.length; i++) {
		        if ($("#cpDate_" + i).data("kendoDatePicker") != null && $scope.savedContractualParties[i].contractDate != null) {
		          $("#cpDate_" + i).data("kendoDatePicker").value(new Date($scope.savedContractualParties[i].contractDate));
		        }
			  }
			},100);
			if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
			  $scope.$apply();
			}
		}).fail(function(xhr,status,message,rcscope){
		    // failed to save contractual parties 
		    console.log("failed to Save Clearance Memo");		   
		    // Add indicator to screen for user
		    $("#memo-contractp-spinner").removeClass("displayInline");
		    $("#memo-contractp-spinner-message").html("Problem Loading Contractual Parties");
		});
	};		  		
	
	$scope.showContractualPartyPopup = function(){ 
		rcscope = angular.element(document.getElementById("rightsController")).scope();	    
	    $("#template_addEditContractualParty").kendoWindow({
            width: "85%",
            height : "465px",
            minWidth : "700px",
            minHeight : "465px",
            title: "Contractual Parties",
            actions: ["Maximize","Close"],
            visible : false,
            close: function(e) {        	
              clearanceMemoObject.loadClearenceMemoPreview(); 
            }
        });					    	   
	    var w = $("#template_addEditContractualParty").data("kendoWindow");
	    if(w){
		  w.setOptions({
		    modal : true	    
		  });	  	  
		  w.center();
		  w.open();
		  w.refresh();
	    }           
	    $scope.setUpContratualPartryButtons();    
	};
	  
	$scope.setUpContratualPartryButtons = function() {		  				
		$("#cancelContractualPartiesButton").unbind();
		$("#cancelContractualPartiesButton").click(function(event){
		  event.preventDefault();
		  event.stopPropagation();
		  var w = $("#template_addEditContractualParty").data("kendoWindow");
		  if(w)  
		    w.close();	  
		});
		
		$("#delete-contractualparty-confirm").unbind();
		$("#delete-contractualparty-confirm").click(function(event) {	
			event.preventDefault();		
			$("#delete-contractualparty-confirm").removeClass("forceShow");
			$scope.deleteContractualPartyFromDB();
		});
		
		$("#saveContractualPartiesButton").unbind();
		$("#saveContractualPartiesButton").click(function(event){
		  event.preventDefault();
		  event.stopPropagation();
		  var valid = $scope.validateContractualParties();
		  if (valid) {
			console.log("running saveContractualParties method");
			$scope.saveContractualParties();
		  }
		});		
		
	};
	  
	$scope.validateContractualParties = function() {
	    var valid = true;
		var errorMessage = "";
		$scope.startContractualPartiesIndicatorResponses();
	    $("#memo-contractp-spinner-message").html("Validating Contractual Parties...");	  
		for (var i = 0; i < $scope.savedContractualParties.length; i++) {
		  if ($scope.savedContractualParties[i].foxEntityPartyId == null || isNaN($scope.savedContractualParties[i].foxEntityPartyId)) {
			//console.log("index: " + $scope.savedContractualParties[i].index + " " + "Invalid fox entity");
			$("#cpFoxEntity_" + $scope.savedContractualParties[i].index).addClass("contractualPartyRowError");
			valid = false;
			if (errorMessage == "")
			  errorMessage = "You must select a valid Fox Entity.  ";
			} else {
			  $("#cpFoxEntity_" + $scope.savedContractualParties[i].index).removeClass("contractualPartyRowError");
			}
			if ($scope.savedContractualParties[i].contractualPartyId != null && !isNaN($scope.savedContractualParties[i].contractualPartyId)) {
			  if ($scope.savedContractualParties[i].contractualPartyTypeId == null || isNaN($scope.savedContractualParties[i].contractualPartyTypeId)) {
	  		    //console.log("index: " + $scope.savedContractualParties[i].index + " " + "Invalid contractual party type");
			    $("#cpType_" + $scope.savedContractualParties[i].index).addClass("contractualPartyRowError");
		        valid = false;
		        if (errorMessage == "")
		          errorMessage = "You must select a valid type for your contractual party.  ";
			  } else {
			    $("#cpType_" + $scope.savedContractualParties[i].index).removeClass("contractualPartyRowError");
			  }		  
		      if ($("#cpDate_" + $scope.savedContractualParties[i].index).val() != null) { 
		        if ($("#cpDate_" + $scope.savedContractualParties[i].index).val() != "") {		          
	 	          var timestamp = Date.parse($("#cpDate_" + $scope.savedContractualParties[i].index).val());
		          if (isNaN(timestamp)) {
	    	        $("#cpDate_" + $scope.savedContractualParties[i].index).addClass("contractualPartyRowError");
		    	    //console.log("index: " + $scope.savedContractualParties[i].index + " " + "Invalid parsing of date");
		    	    if (errorMessage == "")
		    	      errorMessage = "The date you entered for your contractual party was not valid.  ";
		            valid = false;
		          } else {	    	 
	  	            $("#cpDate_" + $scope.savedContractualParties[i].index).removeClass("contractualPartyRowError");	    	
		          }
		        }
		      }
			} else {
			  if ($scope.savedContractualParties[i].contractualPartyTypeId != null && !isNaN($scope.savedContractualParties[i].contractualPartyTypeId)) {
				//console.log("index: " + $scope.savedContractualParties[i].index + " " + " Invalid contractual party type without selecting contractual party");
				$("#cpType_" + $scope.savedContractualParties[i].index).addClass("contractualPartyRowError");
			    valid = false;
			    if (errorMessage == "")
			      errorMessage = "You selected a type without a contractual party.  ";
			  }
			  if ($("#cpDate_" + $scope.savedContractualParties[i].index).val() != null) { 
		        var timestamp = Date.parse($("#cpDate_" + $scope.savedContractualParties[i].index).val());
		        if (!isNaN(timestamp)) {
			      $("#cpDate_" + $scope.savedContractualParties[i].index).addClass("contractualPartyRowError");
		    	//console.log("index: " + cPScope.savedContractualParties[i].index + " " + "Invalid parsing of date");
		          if (errorMessage == "")
		           errorMessage = "You entered a contract date without a contractual party.  ";
		          valid = false;
		        }		      
			  }
		    }
		  }
		  if (!valid) {	    
		    $("#memo-contractp-spinner").removeClass("displayInline");
		    $("#memo-contractp-response").addClass("contractualPartyErrorClass");
		    $("#memo-contractp-spinner-message").html(errorMessage + "Please fix the entries below before saving.");
		  }
		return valid;
	};
	  
	$scope.deleteContractualPartyFromDB = function() {
	  $scope.startContractualPartiesIndicatorResponses();
	  closeDeleteConfirmationWindow();
	  var rcscope = angular.element(document.getElementById("rightsController")).scope();
	  var jsonData = {
	    'foxVersionId': rcscope.currentProductArray.foxVersionId,
	    'ermContractInfo': $scope.selectedParty
	  };
	  //console.log("Delete jsonData %o", jsonData);
	  var path = paths("rest");
	  var url = path.getContractualPartyDeleteErmContractListRESTPath();	   
	  $.post(url, JSON.stringify(jsonData), function(data){	   
	      // save contractual parties
	      //console.log("Delete contractualParties %o", data);	  	  
	      // Remove indicator to screen for user
	      $("#memo-contractp-spinner").removeClass("displayInline");
	      $("#memo-contractp-response").addClass("successClass");	    	
	      $("#memo-contractp-check").addClass("displayInline");
	      $("#memo-contractp-spinner-message").html("Deleted.  Please wait.");	      
		  setTimeout(function() {
		    $("#memo-contractp-check").removeClass("displayInline");
		    $("#memo-contractp-spinner").removeClass("displayInline");
		    $("#memo-contractp-response").removeClass("displayInline");
		    $scope.loadContractualParties();
		  }, 100);	  	 
	  }).fail(function(xhr,status,message,rcscope){
	      // failed to save contractual parties 
	      console.log("failed to delete Clearance Memo");		   
	      // Add indicator to screen for user
	      $("#memo-contractp-spinner").removeClass("displayInline");
	      $("#memo-contractp-response").addClass("contractualPartyErrorClass");
	      var displayMessage = xhr.statusText;	      	
	      if (displayMessage != "") 
		    $("#memo-contractp-spinner-message").html("Sorry, there was a problem deleting your contractual party.  " + displayMessage);
	      else
	        $("#memo-contractp-spinner-message").html("Sorry, there was a problem deleting your contractual party.");
	  });
	};
		
	$scope.saveContractualParties = function saveContractualParties() {
		$scope.startContractualPartiesIndicatorResponses();
	    var rcscope = angular.element(document.getElementById("rightsController")).scope();
	    $("#memo-contractp-spinner-message").html("Saving Contractual Parties...");
	    for (var i = 0; i < $scope.savedContractualParties.length; i++) {
	      if ($("#cpDate_" + $scope.savedContractualParties[i].index).val() != null && $("#cpDate_" + $scope.savedContractualParties[i].index).val() != "") {
	    	//console.log("cpDate " + new Date($("#cpDate_" + cPScope.savedContractualParties[i].index).data("kendoDatePicker").value()));
	    	  $scope.savedContractualParties[i].contractDate = new Date($("#cpDate_" + $scope.savedContractualParties[i].index).data("kendoDatePicker").value());
	      }
	    }
	    var jsonData = {
	      'foxVersionId': rcscope.currentProductArray.foxVersionId,
	      'ermContractInfoList': $scope.savedContractualParties
	    };
	    //console.log("Save Contractual Parties jsonData %o", jsonData);
	    var path = paths("rest");
	    var url = path.getContractualPartySaveErmContractListRESTPath();	   
	    $.post(url, JSON.stringify(jsonData), function(data){	   
	      // save contractual parties
	      $("#memo-contractp-spinner").removeClass("displayInline");
	      $("#memo-contractp-response").addClass("successClass");	    	
	      $("#memo-contractp-check").addClass("displayInline");
	      $("#memo-contractp-spinner-message").html("Saved.  Please wait.");	  
		  setTimeout(function() {
		    $("#memo-contractp-check").removeClass("displayInline");
		    $("#memo-contractp-spinner").removeClass("displayInline");
		    $("#memo-contractp-response").removeClass("displayInline");
		    $scope.loadContractualParties();
		  }, 100);	  	 
	    }).fail(function(xhr,status,message,rcscope){
	      // failed to save contractual parties 
	      console.log("failed to Save Clearance Memo");		   
	      // Add indicator to screen for user
	      $("#memo-contractp-spinner").removeClass("displayInline");
	      $("#memo-contractp-response").addClass("contractualPartyErrorClass");
	      //console.log("xhr: %o", xhr);
	      var displayMessage = xhr.statusText;	      	
	      if (displayMessage != "") 
		    $("#memo-contractp-spinner-message").html("Sorry, there was a problem saving your contractual parties.  " + displayMessage);
	      else
	        $("#memo-contractp-spinner-message").html("Sorry, there was a problem saving your contractual parties.");
	    });
	};
	
	$scope.processAddComments = function(comment, categoryId, foxVersionId, entityKey){
		var that = this;
		if(comment){					
			var jsonData = JSON.stringify(comment);
			//console.log(" CONTRACTUAL PARTY COMMENT JSON : %o", jsonData);
			var path = paths("rest");
			var url = path.getCommentsAddContractualRESTPath() + $scope.selectedContractInfoId;
			//console.log(" CONTRACTUAL PARTY url: " + url);
			that.showSubmitPopupWindow();
			var jqxhr = $.post(url, {q:jsonData}, function(data){				
				subrights_submitPopupWindow.close();
				commentsAndAttachmentsObject.closeTemplateAddCommentsAndAttachmentWindow();
				commentsAndAttachmentsObject.resetFields();				
				$scope.loadContractualParties();
			}).fail(function(xhr,status,message){
				subrights_submitPopupWindow.close();
				errorPopup.showErrorPopupWindow(xhr.responseText);
			});			
		}
	};
	
	$scope.openAddCommentsAndAttachments = function (contractInfoId, commentId) {
	  $scope.selectedContractInfoId = contractInfoId;
	  if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
	    $scope.$apply();
	  console.log("openAddCommentsAndAttachments contractInfoId " + contractInfoId + " commentId: " + commentId);
	  commentsAndAttachmentsObject.openAddCommentsAndAttachmentsPopupWindow($scope.processAddComments, eval(commentId) > 0 ? commentId : null, false, erm.dbvalues.entityCommentType.CONTRACTUAL_PARTY_COMMENT, erm.dbvalues.entityType.CONTRACT_INFO);	  
	};
	
	$scope.addContractualParty = function() {		
		var contractualParty = {	
		  index: $scope.nextPartyIndex++,
		  contractInfoId: null,
		  foxEntityPartyId: null,
		  contractualPartyTypeId: null,
		  contractualPartyId: null,
		  comment: null
		};
		$scope.savedContractualParties.push(contractualParty);	
		//console.log("Inside addContractualParty nextPartyIndex " + $scope.nextPartyIndex);		
		setTimeout(function(){
	      $("#cpDate_" + eval(contractualParty.index)).data("kendoDatePicker");
		  $("#cpDate_" + eval(contractualParty.index)).kendoDatePicker({
		  	footer: "Today - #=kendo.toString(data, 'd') #",
		  	format : "MM/dd/yyyy",
		  	parseFormats : ["yyyy-MM-dd", "EEE, d MMM yyyy", "EEE, MMM d, ''yy"]
		  });		  		
		},500);	    
	};
	
	$scope.removeContractualParty = function(partyToRemove) {
		clearDelConfirmButtons();
		$scope.selectedParty = partyToRemove;		
		var deleteIndex = null;
		if (eval(partyToRemove.contractInfoId) > 0) {			
		  for (deleteIndex = 0; deleteIndex < $scope.savedContractualParties.length; deleteIndex++) {
			//console.log("Id of party to remove %o", partyToRemove.index, " $scope.savedContractualParties[deleteIndex].id %o ", $scope.savedContractualParties[deleteIndex].index);
			if ($scope.savedContractualParties[deleteIndex].index == partyToRemove.index) {				
			  $("#deleteConfirmDetails").html("this contractual information?");	     
			  $("#strands-set-warning-div").addClass("forceShow");
			  $("#strands-set-warning-div").html("<i class=\"icon-warning-sign\"></i>  Please note:  This action can not be reversed.");		 	
			  showDeleteConfirmationWindow();	     	    
			  $("#delete-contractualparty-confirm").addClass("forceShow");
			  break;
			}
		  }
		} else {
			for (deleteIndex = 0; deleteIndex < $scope.savedContractualParties.length; deleteIndex++) {
				if ($scope.savedContractualParties[deleteIndex].index == partyToRemove.index) {
					$scope.savedContractualParties.splice(deleteIndex, 1);
					break;
				}
			}
		}	
	};
	
	$scope.currentProductContacts = $scope.loadProductContacts;
	$scope.availableContacts;
	$scope.sortBy="givenName";
	$scope.reverse=false;
	$scope.setSortColumn = function(column) {
		if ($scope.sortBy===column) {
			$scope.reverse=!$scope.reverse;
		} else {
			$scope.reverse=false;
			$scope.sortBy=column;
		}
	};
	$scope.selectedContact = 0;
	$scope.selectedContactId = 0;
	$scope.editContact = {};
	$scope.genderMap = { "M" : "Male", "F" : "Female"};	
	$scope.foxContactMap = { "Y" : "Yes", "N" : "No"};	
	
	$scope.advancedSearch = {
			active : true,
			partyTypeCode : "",
			givenName : "",
			familyName : "",
			jobTitle : "",
			department : "",
			organizationName : "",
			organizationTypeCode : ""
	};
	
	$scope.clearAdvancedSearch = function () {
		$scope.advancedSearch.active = true;		
		$scope.advancedSearch.givenName = "";
		$scope.advancedSearch.familyName = "";
		$scope.advancedSearch.jobTitle = "";
		$scope.advancedSearch.department = "";
		$scope.advancedSearch.organizationName = "";
		$scope.advancedSearch.organizationTypeCode = "";
		$scope.advancedSearch.partyTypeCode = "";		 
	};
	
	$scope.clearFilter = function() {			
	  return $scope.filterResults = ""; 
	};
	
	$scope.switchAccessType = function (productContactId, accessType)  {
		//console.log("productContactId: " + productContactId + " accessType: " + accessType);
		$scope.switchAccessOrContactType(productContactId, "accessType", accessType);
	};
	
	$scope.switchContactType = function (productContactId, contactType)  {
		//console.log("productContactId: " + productContactId + " contactType: " + contactType);
		$scope.switchAccessOrContactType(productContactId, "contactType", contactType);
	};	
	
	$scope.openDeleteProductContactPopopWindow = function (productContactId, givenName, familyName) {
		var cf = new confirmationPopup();
		cf.initializeElement();		
		var confirmationText = "You are about to unassign contact " + (givenName != null ? givenName : "") + " " + (familyName != null ? familyName : "") +" from this product.";
		var confirmationButtonText = "Confirm Unassign Contact";
		cf.openConfirmationWindow("#commentsAndAttachmentPopupWindow", confirmationText, confirmationButtonText, productContactId, $scope.deleteProductContact);		
	};
	
	$scope.deleteProductContact = function (productContactId) {
		$scope.startProductContactsIndicatorResponse();					
		var url = path.getDeleteProductContactRESTPath() + productContactId;
		//console.log("switchAccessOrContactType url %o", url);
		$("#productcontacts-spinner-message").html("Unassigning contact...");
		var jqxhr = $.post(url, function(data){
		  $("#productcontacts-response").addClass("successClass");	    	
		  $("#productcontacts-check").addClass("displayInline");
		  $("#productcontacts-spinner-message").html("Contact Unassigned.  Please wait.");
		  var cpScope = angular.element(document.getElementById("contractualPartyController")).scope();			
		  cpScope.loadProductContacts();	
		  $("#productcontacts-spinner").removeClass("displayInline");
		  setTimeout(function() {
			$("#productcontacts-check").removeClass("displayInline");			  
			$("#productcontacts-response").removeClass("displayInline");	  		
		  }, erm.statusIndicatorTime);
		}).fail(function(xhr,status,message){
		  $("#productcontacts-spinner-message").html("Problem unassigning contact " + xhr.responseText);		  
		});			
	};
	
	$scope.switchAccessOrContactType = function (productContactId, typeSwitch, typeId) {
		$scope.startProductContactsIndicatorResponse();					
		var url = path.getSwitchAccessOrContactTypeRESTPath() + productContactId;
		//console.log("switchAccessOrContactType url %o", url);
		$("#productcontacts-spinner-message").html("Saving contact...");
		var jqxhr = $.post(url, {'typeSwitch':typeSwitch,'typeId':typeId}, function(data){
		  $("#productcontacts-response").addClass("successClass");	    	
		  $("#productcontacts-check").addClass("displayInline");
		  $("#productcontacts-spinner-message").html("Contact Saved");
		  $("#productcontacts-spinner").removeClass("displayInline");
		  setTimeout(function() {
			$("#productcontacts-check").removeClass("displayInline");			  
			$("#productcontacts-response").removeClass("displayInline");	  		
		  }, erm.statusIndicatorTime);
		}).fail(function(xhr,status,message){
		  $("#productcontacts-spinner-message").html("Problem saving contact " + xhr.responseText);		  
		});			
	};
	
	$("#cancelEditContactButton").unbind();				  			
	$scope.cancelEditContactButton = $("#cancelEditContactButton").click(function(event){
	  event.preventDefault(); 
	  //console.log("cancelEditContactButton clicked");
	  if(editContactWindow)
		editContactWindow.close();		  
	});
	
	$("#assignContactToProduct").unbind();				  			
	$scope.assignContactToProductButton = $("#assignContactToProduct").click(function(event){
      event.preventDefault();    	    	   
      //console.log("assignContactToProduct clicked");
      $scope.assignContactToProductPopup();
	});
	
	$("#cancelContractualPartiesButton").unbind();				  			
	$scope.cancelContractualPartiesButton = $("#cancelAssignContactToProductButton").click(function(event){
	  event.preventDefault(); 
	  //console.log("cancelContractualPartiesButton clicked");
	  if(selectContactToAddWindow)
		selectContactToAddWindow.close();		  
	});
	  
	$("#saveAssignContactToProductButton").unbind();				  			
	$scope.saveAssignContactToProductButton = $("#saveAssignContactToProductButton").click(function(event){
	  event.preventDefault(); 
	  //console.log("saveAssignContactToProductButton clicked");
	  $scope.assignContact();	  		  
	});		
	
	$scope.selectContact = function (selectedContactId) {	  
	  var cpScope = angular.element(document.getElementById("contractualPartyController")).scope();
	  cpScope.selectedContact = selectedContactId;
	  //console.log("selectedContact " + cpScope.selectedContact);
	};
	
	$scope.assignContactToProductPopup = function () {
	  if (selectContactToAddWindow == null) {
		selectContactToAddWindow = $("#selectContactToAdd").kendoWindow({	  
	      width: "90%",
	      height : "500px",
	      minWidth : "600px",
	      minHeight : "400px",
	      title: "Select a Contact to Add",
	      actions: ["Maximize","Close"],
	      visible : false,
	      open: function(e) {
	        //console.log("selectContactToAdd open");
	        $scope.loadAllContacts();
	  	  },
	      close: function(e) {   
	      }  		  
		}).data("kendoWindow");		  		 
	  }
	  if(selectContactToAddWindow){
		selectContactToAddWindow.setOptions({
		  modal : true	    
		});
		selectContactToAddWindow.center();
		selectContactToAddWindow.open();
	  }  
	};
	
	$scope.validateSaveContact = function (editContact) {
		var validationPassed = true;
		var errorString = "";
		if (editContact.partyTypeCode == null || editContact.partyTypeCode == "") {		
		  validationPassed = false;
		  errorString = "You must select a type for the contact before saving.";
		}
		if (validationPassed && ((editContact.familyName == null || editContact.familyName == "") && (editContact.organizationName == null || editContact.organizationName == ""))) {		
		  validationPassed = false;
		  errorString = "You must enter a last name or an organization name for the contact before saving.";
		}		
		if (validationPassed && (editContact.emailAddress != null && editContact.emailAddress != "" && !validateEmail(editContact.emailAddress))) {		
		  validationPassed = false;
		  errorString = "The email address you entered is not valid.";
		}
		//if (validationPassed && (editContact.phoneNumber != null && editContact.phoneNumber != "")) {		
		  //validationPassed = false;
		  //errorString = "The phone number must a valid phone number with optional area code, space or dash in the middle.";
		//}		
		//if (validationPassed && (editContact.phoneNumber2 != null && editContact.phoneNumber2 != "")) {		
		  //validationPassed = false;
		  //errorString = "The cell phone number must a valid phone number with optional area code, space or dash in the middle.";
		//}
		//if (validationPassed && (editContact.faxNumber != null && editContact.faxNumber != "")) {		
		  //validationPassed = false;
		  //errorString = "The fax number must a valid phone number with optional area code, space or dash in the middle.";
		//}
		if (!validationPassed) {
		  $("#editcontact-spinner").removeClass("displayInline");
		  $("#editcontact-spinner-message").addClass("tocErrorClass");
		  $("#editcontact-spinner-message").html(errorString);		  
		}
		return validationPassed;
	};
	
    $scope.saveContact = function (partyId) {
		var editScope = angular.element(document.getElementById("contractualPartyController")).scope();
		editScope.startEditContactIndicatorResponse();
    	if (!editScope.validateSaveContact(editScope.editContact))
          return;
		var url = path.getSaveContactRESTPath() + (partyId != null ? partyId : 0);		
		//console.log("assignContact url %o", url);
		$("#editcontact-spinner-message").html("Saving contact...");		
		if (editScope.editContact.comment != null) {
		  editScope.editContact.comment.comment.longDescription = editScope.viewModel.editContactLongDescription;
		} else {
		  editScope.editContact.comment = { comment : { longDescription : ""}};		  
		  editScope.editContact.comment.comment.longDescription = editScope.viewModel.editContactLongDescription;		  
		}		
		var jsonData = JSON.stringify(editScope.editContact);
		//console.log("jsonData %o", jsonData);		
		var jqxhr = $.post(url, jsonData, function(data){
		  $("#editcontact-response").addClass("successClass");	    	
		  $("#editcontact-check").addClass("displayInline");
		  $("#editcontact-spinner-message").html("Contact Saved.  Please wait...");
		  $("#editcontact-spinner").removeClass("displayInline");
		  var prdContactScope = angular.element(document.getElementById("contractualPartyController")).scope();
		  if (partyId == null || partyId == 0)
			$scope.loadAllContacts();
		  else
		    prdContactScope.loadProductContacts();
		  if(editContactWindow)
			editContactWindow.close();  		  
		}).fail(function(xhr,status,message){
		  $("#editcontact-spinner").removeClass("displayInline");
		  $("#editcontact-spinner-message").addClass("tocErrorClass");
		  $("#editcontact-spinner-message").html("Problem saving contact " + xhr.responseText);		  
		});					
	};
	
	$scope.assignContact = function () {
		$scope.startSelectContactsIndicatorResponse();
		var rcscope = angular.element(document.getElementById("rightsController")).scope();				
		var url = path.getAssignContactRESTPath() + rcscope.foxVersionId;
		//console.log("assignContact url %o", url);
		var cpScope = angular.element(document.getElementById("contractualPartyController")).scope();
		//console.log("selectedContact %o", eval(cpScope.selectedContact));
		$("#selectcontacts-spinner-message").html("Assigning contact...");
		if (eval(cpScope.selectedContact) == 0) {
		  $("#selectcontacts-spinner").removeClass("displayInline");
		  $("#selectcontacts-spinner-message").addClass("tocErrorClass");
		  $("#selectcontacts-spinner-message").html("You have not selected a contact to assign. ");	
		} else {
			var jqxhr = $.post(url, {'partyId': cpScope.selectedContact}, function(data){
			  $("#selectcontacts-response").addClass("successClass");	    	
			  $("#selectcontacts-check").addClass("displayInline");
			  $("#selectcontacts-spinner-message").html("Contact Assigned.  Please wait...");
			  $("#selectcontacts-spinner").removeClass("displayInline");
			  var prdContactScope = angular.element(document.getElementById("contractualPartyController")).scope();
			  prdContactScope.loadProductContacts();		  
			  if(selectContactToAddWindow)
			    selectContactToAddWindow.close();  		  
			}).fail(function(xhr,status,message){
			  $("#selectcontacts-spinner").removeClass("displayInline");
			  $("#selectcontacts-spinner-message").addClass("tocErrorClass");
			  $("#selectcontacts-spinner-message").html("Problem loading contacts " + xhr.responseText);		  
			});			
		} 
	};
	
	$scope.loadProductContacts = function () {
		//console.log("Contractual Party loadProductContacts");
		$scope.startProductContactsIndicatorResponse();		
		var rcscope = angular.element(document.getElementById("rightsController")).scope();				
		var url = path.getProductContactsRESTPath() + rcscope.foxVersionId;
		//console.log("loadAllProductContacts url %o", url);				
		$("#productcontacts-spinner-message").html("Loading contacts...");
		var jqxhr = $.get(url, function(data){					  
		  //console.log("loadProductContacts data %o", data);
		  $("#productcontacts-response").addClass("successClass");	    	
		  $("#productcontacts-check").addClass("displayInline");
		  $("#productcontacts-spinner-message").html("Loaded contacts");
		  $("#productcontacts-spinner").removeClass("displayInline");
		  setTimeout(function() {
			$("#productcontacts-check").removeClass("displayInline");			  
			$("#productcontacts-response").removeClass("displayInline");	  		
		  }, erm.statusIndicatorTime);
		  $scope.currentProductContacts = data;
  		  if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest')
  			$scope.$apply();
		}).fail(function(xhr,status,message){
		  $("#productcontacts-spinner-message").addClass("tocErrorClass");
		  $("#productcontacts-spinner-message").html("Problem loading contacts " + xhr.responseText);		  		  
		});	
	};	
	
	$scope.advancedSearchLink = function(){   	    	   
      //console.log("advancedSearchLink clicked");
      var searchScope = angular.element(document.getElementById("contractualPartyController")).scope();
      searchScope.advancedSearchPopUp();
	};
	$scope.advancedSearchPopUp = function () {
	  var searchScope = angular.element(document.getElementById("contractualPartyController")).scope();
	  if (searchContactsWindow == null) {
		  searchContactsWindow = $("#searchContacts").kendoWindow({	  
	      width: "60%",
	      height : "300px",
	      minWidth : "300px",
	      minHeight : "300px",
	      title: "Search Contacts",
	      actions: ["Maximize","Close"],
	      visible : false,
	      open: function(e) {	        
	  	  },
	      close: function(e) {   
	      }  		  
		}).data("kendoWindow");		  		 
	  }
	  if(searchContactsWindow){
		  searchContactsWindow.setOptions({			  
		  modal : true	    
		});
		searchContactsWindow.center();        
		searchContactsWindow.open();
	  } 
	  //searchScope.clearAdvancedSearch();
	};
	
	$("#cancelSearchContacts").unbind();				  			
	$scope.cancelSearchContactsButton = $("#cancelSearchContacts").click(function(event){
	  event.preventDefault(); 
	  //console.log("cancelSearchContacts clicked");
	  if(searchContactsWindow)
	    searchContactsWindow.close();		  
	});
	
	$scope.searchContacts = function (partyId) {
		if(searchContactsWindow)
		   searchContactsWindow.close();
		var cpScope = angular.element(document.getElementById("contractualPartyController")).scope();
		cpScope.startSelectContactsIndicatorResponse();
		cpScope.selectedContact = 0;
		cpScope.availableContacts = null; 
		if (cpScope.$root.$$phase != '$apply' && cpScope.$root.$$phase != '$digest')
	  	  cpScope.$apply();		
		var rcscope = angular.element(document.getElementById("rightsController")).scope();
		var url = path.getSearchContactsRESTPath() + rcscope.foxVersionId;		
		$("#selectcontacts-spinner-message").html("Searching for contacts...");		
		var searchScope = angular.element(document.getElementById("contractualPartyController")).scope();			
		var jsonData = JSON.stringify(searchScope.advancedSearch);
		//console.log("jsonData %o", jsonData);		
		var jqxhr = $.post(url, jsonData, function(data){
		  cpScope.availableContacts = data;
		  //console.log("loadContacts data %o", data);
  		  if (cpScope.$root.$$phase != '$apply' && cpScope.$root.$$phase != '$digest')
  		    cpScope.$apply();
		  $("#selectcontacts-response").addClass("successClass");	    	
		  $("#selectcontacts-check").addClass("displayInline");
		  $("#selectcontacts-spinner-message").html("Search Complete");
		  $("#selectcontacts-spinner").removeClass("displayInline");
		  setTimeout(function() {
			$("#selectcontacts-check").removeClass("displayInline");			  
			$("#selectcontacts-response").removeClass("displayInline");
		  }, erm.statusIndicatorTime);		  
		}).fail(function(xhr,status,message){
		  $("#selectcontacts-spinner").removeClass("displayInline");
		  $("#selectcontacts-spinner-message").addClass("tocErrorClass");
		  $("#selectcontacts-spinner-message").html("Problem searching for contacts " + xhr.responseText);		  
		});					
	};
	
	$scope.editContactLink = function(partyId){   	    	   
      //console.log("loadContactLink clicked");
      var editScope = angular.element(document.getElementById("contractualPartyController")).scope();
      editScope.editContactPopup(partyId);
      editScope.editContact = {};
	  if (editScope.$root.$$phase != '$apply' && editScope.$root.$$phase != '$digest')
	    editScope.$apply();
	};
	$scope.editContactLongDescription = "";
	$scope.editContactPopup = function (partyId) {
	  var editScope = angular.element(document.getElementById("contractualPartyController")).scope();	  
	  editContactWindow = $("#editContact").kendoWindow({	  
	      width: "75%",
	      height : "650px",
	      minWidth : "300px",
	      minHeight : "600px",
	      title: eval(partyId) > 0 ? "Contact Details" : "Add Contact",
	      actions: ["Maximize","Close"],
	      visible : false,
	      open: function(e) {
	        //console.log("selectContactToAdd open");
	  	  },
	      close: function(e) {   
	      }  		  
	  }).data("kendoWindow");		  		 	  
	  if(editContactWindow){
		  editContactWindow.setOptions({			  
		  modal : true	    
		});
		editContactWindow.center();        
		editContactWindow.open();
	  }  
	  editScope.loadContact(partyId);
	  
	  // Clearance Memo Editor Setup
	  if (!$("#editContactLongDescription").data("kendoEditor")) {
		  $scope.editContactLongDescription = $("#editContactLongDescription").kendoEditor({			
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
	};
	
	$scope.viewModel = kendo.observable({
		editContactLongDescription : ""
	});	
	$scope.loadContact = function (partyId) {
		kendo.bind($("#editContact"), $scope.viewModel);
		var editScope = angular.element(document.getElementById("contractualPartyController")).scope();
		if ($scope != editScope) {
			//console.log("$scope %o", $scope);
			//console.log("editScope %o", editScope);
		}
		editScope.startEditContactIndicatorResponse();
		editScope.editContact = {};
		if (editScope.$root.$$phase != '$apply' && editScope.$root.$$phase != '$digest')
		  editScope.$apply();
		var url = path.getContactRESTPath() + partyId;
		//console.log("loadContact url %o", url);
		$("#editcontact-spinner-message").html("Loading contact...");
		var jqxhr = $.get(url, function(data){
		  //console.log("contact %o", data);		  
		  editScope.editContact = data;
		  $scope.viewModel.set("editContactLongDescription", "");
		  if (editScope.editContact.comment != null && editScope.editContact.comment != null && editScope.editContact.comment.comment != null) {
		     $scope.viewModel.set("editContactLongDescription", editScope.editContact.comment.comment.longDescription);		  
		  }
		  //console.log("editScope.editContact %o", editScope.editContact);
		  $("#editcontact-response").addClass("successClass");	    	
		  $("#editcontact-check").addClass("displayInline");
		  $("#editcontact-spinner-message").html("Loaded contact");
		  $("#editcontact-spinner").removeClass("displayInline");
		  setTimeout(function() {
			$("#editcontact-check").removeClass("displayInline");			  
			$("#editcontact-response").removeClass("displayInline");			
		  }, erm.statusIndicatorTime);
		  if (editScope.$root.$$phase != '$apply' && editScope.$root.$$phase != '$digest') {
			editScope.$apply();  
		  }
		}).fail(function(xhr,status,message){
		  $("#editcontact-spinner-message").addClass("tocErrorClass");
		  $("#editcontact-spinner-message").html("Problem loading contact " + xhr.responseText);		  		  
		});	
	};
	
	$scope.loadAllContacts = function () {
		var cpScope = angular.element(document.getElementById("contractualPartyController")).scope();
		cpScope.startSelectContactsIndicatorResponse();
		cpScope.selectedContact = 0;
		cpScope.availableContacts = null; 
		if (cpScope.$root.$$phase != '$apply' && cpScope.$root.$$phase != '$digest')
	  	  cpScope.$apply();
		var rcscope = angular.element(document.getElementById("rightsController")).scope();
		var url = path.getAllContactsRESTPath() + rcscope.foxVersionId;;
		//console.log("loadAllContacts url %o", url);				
		$("#selectcontacts-spinner-message").html("Loading contacts...");
		var jqxhr = $.get(url, function(data){									  		  		
		  cpScope.availableContacts = data;
		  //console.log("loadContacts data %o", data);
  		  if (cpScope.$root.$$phase != '$apply' && cpScope.$root.$$phase != '$digest')
  		    cpScope.$apply();
		  $("#selectcontacts-response").addClass("successClass");	    	
		  $("#selectcontacts-check").addClass("displayInline");
		  $("#selectcontacts-spinner-message").html("Loaded contacts");
		  $("#selectcontacts-spinner").removeClass("displayInline");
		  setTimeout(function() {
			$("#selectcontacts-check").removeClass("displayInline");			  
			$("#selectcontacts-response").removeClass("displayInline");
			//console.log("$scope.availableContacts %o", $scope.availableContacts);
		  }, erm.statusIndicatorTime);
		}).fail(function(xhr,status,message){
		  $("#selectcontacts-spinner-message").addClass("tocErrorClass");
		  $("#selectcontacts-spinner-message").html("Problem loading contacts " + xhr.responseText);		  		  
		});	
	};
	
	$scope.removeSelectContactsIndicatorResponse = function () {
	  $("#selectcontacts-response").removeClass("displayInline");
	  $("#selectcontacts-spinner").removeClass("displayInline");
	  $("#selectcontacts-check").removeClass("displayInline");
	  $("#selectcontacts-spinner-message").removeClass("tocErrorClass");
	  $("#selectcontacts-response").removeClass("successClass");
	  $("#selectcontacts-response").removeClass("deletedClass");	
	};		
	$scope.startSelectContactsIndicatorResponse = function () {			
	  $scope.removeSelectContactsIndicatorResponse();
	  $("#selectcontacts-response").addClass("displayInline");
	  $("#selectcontacts-spinner").addClass("displayInline");
	};
	
	$scope.removeEditContactIndicatorResponse = function () {
	  $("#editcontact-response").removeClass("displayInline");
	  $("#editcontact-spinner").removeClass("displayInline");
	  $("#editcontact-check").removeClass("displayInline");
	  $("#editcontact-spinner-message").removeClass("tocErrorClass");
	  $("#editcontact-response").removeClass("successClass");
	  $("#editcontact-response").removeClass("deletedClass");	
	};		
	$scope.startEditContactIndicatorResponse = function () {			
	  $scope.removeEditContactIndicatorResponse();
	  $("#editcontact-response").addClass("displayInline");
	  $("#editcontact-spinner").addClass("displayInline");
	};
	
	$scope.removeProductsContactsIndicatorResponse = function () {
	  $("#productcontacts-response").removeClass("displayInline");
	  $("#productcontacts-spinner").removeClass("displayInline");
	  $("#productcontacts-check").removeClass("displayInline");
	  $("#productcontacts-spinner-message").removeClass("tocErrorClass");
	  $("#productcontacts-response").removeClass("successClass");
	  $("#productcontacts-response").removeClass("deletedClass");	
	};		
	$scope.startProductContactsIndicatorResponse = function () {			
	  $scope.removeProductsContactsIndicatorResponse();
	  $("#productcontacts-response").addClass("displayInline");
	  $("#productcontacts-spinner").addClass("displayInline");
	};
});

//------ Jobs Controller
app.controller('JobsController',function JobsController(jobsService,$scope,$timeout) {
	var timeInterval = 3000,
		setJobInScope;
	var status = {COMPETED:1,NOT_STARTED:0,PAUSED:2,ERROR:3,RUNNING:4,STOPED:5};
	$scope.jobSearchType = "pending";
	$scope.noJobs = true;
	$scope.jobs = [];
	$scope.statusCheck = [];
	$scope.statusCheckRunning = [];
	$scope.showDetails = [];
	$scope.loadingJobDetails = [];
	$scope.cancelCheck = [];	
	$scope.predicate = "createDate";
	$scope.reverse = true;
	
	$scope.clearSort = function() {
		$scope.predicate ='createDate';
		$scope.reverse = false;
	};
	$scope.setSortColumn = function(column) {
		if ($scope.predicate===column) {
			$scope.reverse=!$scope.reverse;
		} else {
			$scope.reverse=false;
			$scope.predicate=column;
		}
	};
	$scope.isSorted = function(column) {
		return $scope.predicate===column;
	};
	$scope.isAscending = function() {
		return !$scope.reverse;
	};
	
	setJobInScope = function setJobInScope(jobSet) {
		//console.log("Setting job in scope %o",jobSet);		
		for (var i = 0; i < $scope.jobs.length; i++) {		
		  if ($scope.jobs[i].id == jobSet.id) {
			$scope.jobs[i].job = jobSet;
			//console.log("pushed job in scope %o", $scope.jobs[i].job);
			if ($scope.jobs[i].job.completed) {
				//console.log("Job " + jobSet.id + " completed status: " + jobSet.status);
				$scope.cancelCheck[jobSet.id]=true;
				$scope.statusCheckRunning[jobSet.id]=false;			
			}
			break;
		  }		
		}
	};
	
	errorInOperation = function(operation) {
		return function(error) {
			console.error("Error in operation " + operation + ". " + error);
		};
		
	};
					
	$scope.doCheckForStatus = function doCheckForStatus(jobId) {
		//console.log("doCheckForStatus: jobId " + jobId);
		$scope.statusCheckRunning[jobId]=true;		
		$scope.statusCheck[jobId] = true;
		//console.log("show details for job: " + $scope.showDetails[jobId]); 
		if ($scope.showDetails[jobId]) {
			jobsService.getJobDetail(jobId,setJobInScope);
		} else {
			jobsService.getJobStatus(jobId,setJobInScope);
		}
		var jobStatusCheck = $timeout(function() {
			//console.log("timeout checking for status for " + jobId);
			if (!$scope.statusCheck[jobId]||$scope.cancelCheck[jobId]) {
				$scope.statusCheckRunning[jobId]=false;				
				$timeout.cancel(jobStatusCheck);
			} else {
				doCheckForStatus(jobId);				
			}
		    if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
		    	$scope.$apply();
		    }
			
		},timeInterval);
	};
	
	
	$scope.doStopJob = function doStopJob(jobId) {
		jobsService.stopJob(jobId);
	};
			
	hideJob = function(jobId) {
		$("#pendingJob_"+jobId).hide();	
	};
	
	$scope.doDeleteJob = function doDeleteJob(jobId) {
		$scope.statusCheck[jobId]=false;
		var promise = jobsService.deleteJob(jobId);
		promise.$then(hideJob(jobId),errorInOperation("deleteJob"));		
	};
		
	$scope.doCancelCheckForStatus = function doCancelCheckForStatus(jobId) {
		$scope.statusCheck[jobId]=false;		
	};
	
	$scope.doToggleShowDetails = function doToggleShowDetails(jobId) {
		$scope.showDetails[jobId] = !$scope.showDetails[jobId];
		//console.log("doToggleShowDetails for job id " + jobId + " = " + $scope.showDetails[jobId]); 
		if ($scope.showDetails[jobId] && !$scope.statusCheckRunning[jobId]) {
			$scope.doCheckForStatus(jobId);		
		}		
	};
	
	$scope.getAllJobs = function getAllJobs() {		
		$scope.jobSearchType = "all";
		$scope.jobs = [];
		var allJobsSearchCompleted = function(allJobs) {
			//console.log("$scope.allJobsSearchCompleted: %o", allJobs);
			if (allJobs.length == 0) {
			  $scope.noJobs = true;			
			}
			for (var i = 0; i < allJobs.length; i++) {			
			  $scope.noJobs = false;
			  $scope.statusCheck[allJobs[i].id] = false;
			  $scope.showDetails[allJobs[i].id] = false;
			  $scope.loadingJobDetails[allJobs[i].id] = false;
			  $scope.jobs[i] = allJobs[i];
			}								
		};
		jobsService.getAllJobs(allJobsSearchCompleted);				
	};
	
	$scope.getPendingJobs = function getPendingJobs() {
		$scope.jobSearchType = "pending";
		$scope.jobs = [];
		var pendingJobsSearchCompleted = function(pendingJobs) {
			if (pendingJobs.length == 0)
			  $scope.noJobs = true;
			for (var i = 0; i < pendingJobs.length; i++) {
			  $scope.noJobs = false;
			  $scope.statusCheck[pendingJobs[i].id] = false;
			  $scope.showDetails[pendingJobs[i].id] = false;
			  $scope.loadingJobDetails[pendingJobs[i].id] = false;
			  $scope.jobs[i] = pendingJobs[i];
			}								
		};
		jobsService.getPendingJobs(pendingJobsSearchCompleted);		
	};
	
	
});

/**
 * 
 */
app.controller('ReportController',function ReportController(reportService,$scope){

	$scope.reportData ={
			dataTypeValue : 1,
			reportId : null,
			savedReportQueries : null,
			recentReportQueries : null,
			reports : null
	};
	
	/**
	 * 
	 */
	$scope.loadReports = function(){
		
		var reportLoaded = function(data){
			if(data){
				$scope.reportData.reports = data;
				$scope.reportData.savedReportQueries = data.queryList;
			}
		};
		
		reportService.loadReports(reportLoaded);
	};
	
	/**
	 * 
	 */
	$scope.getReportName = function(reportId){
		var reportName = "";
		if($scope.reportData.reports && $scope.reportData.reports.reportsList && $scope.reportData.reports.reportsList.length > 0){
			for(var i = 0; i < $scope.reportData.reports.reportsList.length; i++){
				var report = $scope.reportData.reports.reportsList[i];
				if(report.id == reportId){
					reportName = report.description;
				}
			}
		}
		return reportName;
	};
	
	$scope.loadReports();
});





