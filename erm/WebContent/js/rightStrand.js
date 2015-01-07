//TODO this should really be RightStrand
function rightStrand(){
	
	this.restrictionObject = null;
	this.path = paths();
	this.strandRestrictionsToRemove = null;
	this.productInfoCodesToRemove = null;
	this.updatingDoNotLicense = false;
	
	/**
	 * 
	 * @param nodes
	 */
	this.deselectAllNodes = function deselectAllNodes(nodes){
		
		if(nodes && nodes.length > 0){
			for(var i = 0; i < nodes.length; i++){
				if(nodes[i].checked){
					nodes[i].set("checked", false);
				}
				if(nodes[i].hasChildren){
					this.deselectAllNodes(nodes[i].children.view());
				}
			}
		}
	};
	
	 /**
	  * 
	  * @param nodes
	  * @param checkedNodes
	  */
	 this.checkedNodeRestriction = function checkedNodeRestriction(nodes, checkedNodes) {
	         for (var i = 0; i < nodes.length; i++) {
	             if (nodes[i].checked) {
	                 checkedNodes.push(nodes[i].code + "," + nodes[i].description);
	             }
	
	             if (nodes[i].hasChildren) {
	                 this.checkedNodeRestriction(nodes[i].children.view(), checkedNodes);
	             }
	         }
	  };
	  
	  /**
	   * 
	   * @param nodes
	   * @param checkedNodes
	   * @param groupIds
	   */
	  this.checkNodeOnGroupChange = function checkNodeOnGroupChange(nodes, checkedNodes, groupIds){
       		
       		for(var i = 0; i < nodes.length; i++){
       			if(nodes[i]){
       			      				
       				for(var k = 0; k < groupIds.length; k++){       						
	       					if(groupIds[k]){
	       						for(var c = 0; c < groupIds[k].length; c++){
	       							if((groupIds[k][c] == nodes[i].id) && (checkedNodes.indexOf(nodes[i].text)) < 0){	       								
	       								checkedNodes.push(nodes[i].text);
		       							nodes[i].set("checked", true);
		       							break;
	       							}
	       							
	       						}
	       							       						
	       					}
	       			}
       				
       				
   					if(!nodes[i].checked && nodes[i].hasChildren){
   						this.checkNodeOnGroupChange(nodes[i].children.view(), checkedNodes, groupIds);
   					}
       			}
       		}
       };
       
       /**
        * 
        * @param nodes
        * @param selectedValues
        */
       this.processRestrictionGroupSelectionChange = function processRestrictionGroupSelectionChange(nodes, selectedValues){
           	var selectedIds = new Array();
      		if(nodes && nodes.length > 0 && selectedValues && selectedValues.length > 0){
      			for(var i = 0; i < selectedValues.length; i++){
      				if(selectedValues[i]){
      					for(var k = 0; k < nodes.length; k++){      						
      						if(nodes[k].restrictionTypeId == selectedValues[i].restrictionTypeId){
      							nodes[k].set("checked", true);
      							selectedIds.push(nodes[k].id);
      						}
      					}
      				}
      			}
      		}
      		     		
      		this.clearNonIncludedSelectedRestriction(selectedIds);
       };
      
      /**
       * 
       * @param nodes
       * @param checkedNodes
       */
      this.processMessage = function processMessage(nodes, checkedNodes){
     		
     		if(nodes && nodes.length > 0){
     			for(var i = 0; i < nodes.length; i++){
     				if(!nodes[i]){
     					continue;
     				}
     				if(nodes[i].checked){
     					checkedNodes.push(nodes[i].text);
     				}
     				else if(nodes[i].hasChildren){
     					this.processMessage(nodes[i].children.view(), checkedNodes);
     				}
     				
     			}
     		}
     };
	  
     /**
      * 
      * @param nodes
      * @param checkedIds
      */
     this.processIds = function processIds(nodes, checkedIds){
    		
    		if(nodes && nodes.length > 0){
    			for(var i = 0; i < nodes.length; i++){
    				if(!nodes[i]){
    					continue;
    				}
    				if(nodes[i].checked){
    					checkedIds.push(nodes[i].id);
    				}
    				else if(nodes[i].hasChildren){
    					this.processIds(nodes[i].children.view(), checkedIds);
    				}
    				
    			}
    		}
    };
    
    /**
     * Uitility method to check wether tree view of MTLR have any nodes checked. 
     * This method return if at least one node is checked.
     * @param treeNodes
     * @returns {Boolean}
     */
    this.checkNodeIds = function checkNodeIds(treeNodes){
    	
    	if(treeNodes && treeNodes.length > 0){
    		for(var i = 0; i < treeNodes.length; i++){
    			if(treeNodes[i] && treeNodes[i].checked){
    				return true;
    			}
    		}
    	}
    	
    	return false;
    };
    
    /**
     * 
     * @param nodes
     * @param checkedNodes
     */
    this.processRestrictionMessage = function processRestrictionMessage(nodes, checkedNodes, restrictionIds){
   		
    	//processRestrictionMessageInternal(nodes, checkedNodes, restrictionIds);
    	
   		if(nodes && nodes.length > 0){
   			for(var i = 0; i < nodes.length; i++){
   				if(!nodes[i]){
   					continue;
   				}  				
   				if(nodes[i].checked){
   					checkedNodes.push(nodes[i].code + "," + nodes[i].description);
   					restrictionIds.push(nodes[i].id);
   					
   				}
   				else if(nodes[i].hasChildren){   					
   					this.processRestrictionMessage(nodes[i].children.view(), checkedNodes, restrictionIds);
   				}       				
   			}
   		}
   		
    };
    
    /*
	function processRestrictionMessageInternal(nodes, checkedNodes, restrictionIds){
			
			if(nodes && nodes.length > 0){
				for(var i = 0; i < nodes.length; i++){
					if(!nodes[i]){
						continue;
					}  				
					if(nodes[i].checked){
						checkedNodes.push(nodes[i].code + "," + nodes[i].description);
						restrictionIds.push(nodes[i].id);
						
					}
					else if(nodes[i].hasChildren){   					
						processRestrictionMessageInternal(nodes[i].children.view(), checkedNodes, restrictionIds);
					}       				
				}
			}
	}
    */
    
    /**
     * 
     * @param value
     * @returns {Boolean}
     */
    this.isBlank = function isBlank(value){
   		if(value == null || value == ""){
   			return true;
   		}
   		return false;
    };
    
    /**
     * 
     */
    this.disableTerm = function disableTerm(){
   		var scdp = $("#startContractualDate").data("kendoDatePicker");
		scdp.value("");
		scdp.enable(false);
		
		var sds = $("#startDateStatus").data("kendoDropDownList");
		sds.value("");
		sds.enable(false);
		
		var sdc = $("#startDateCode").data("kendoDropDownList");
		sdc.value("");
		sdc.enable(false);
		
		var sod = $("#startOverrideDate").data("kendoDatePicker");
		sod.value("");
		sod.enable(false);
		
		var escdp = $("#endContractualDate").data("kendoDatePicker");
		escdp.value("");
		escdp.enable(false);
		
		var esds = $("#endDateStatus").data("kendoDropDownList");
		esds.value("");
		esds.enable(false);
		
		var esdc = $("#endDateCode").data("kendoDropDownList");
		esdc.value("");
		esdc.enable(false);
		
		var esod = $("#endOverrideDate").data("kendoDatePicker");
		esod.value("");
		esod.enable(false);
    };
    
    /**
     * 
     */
    this.enableTerm = function enableTerm(){
   		var scdp = $("#startContractualDate").data("kendoDatePicker");
		scdp.enable(true);
		
		var sds = $("#startDateStatus").data("kendoDropDownList");
		sds.enable(true);
		
		var sdc = $("#startDateCode").data("kendoDropDownList");
		sdc.enable(true);
		
		var sod = $("#startOverrideDate").data("kendoDatePicker");
		sod.enable(true);
		
		var escdp = $("#endContractualDate").data("kendoDatePicker");
		escdp.enable(true);
		
		var esds = $("#endDateStatus").data("kendoDropDownList");
		esds.enable(true);
		
		var esdc = $("#endDateCode").data("kendoDropDownList");
		esdc.enable(true);
		
		var esod = $("#endOverrideDate").data("kendoDatePicker");
		esod.enable(true);
    };
    
    /**
     * 
     */
    this.resetKendoFields = function resetKendoFields(){
  		var scdp = $("#startContractualDate").data("kendoDatePicker");
		scdp.value("");
		
		var sds = $("#startDateStatus").data("kendoDropDownList");
		sds.value("");
		
		var sdc = $("#startDateCode").data("kendoDropDownList");
		sdc.value("");
		
		var sod = $("#startOverrideDate").data("kendoDatePicker");
		sod.value("");
		
		var escdp = $("#endContractualDate").data("kendoDatePicker");
		escdp.value("");
		
		var esds = $("#endDateStatus").data("kendoDropDownList");
		esds.value("");
		
		var esdc = $("#endDateCode").data("kendoDropDownList");
		esdc.value("");
		
		var esod = $("#endOverrideDate").data("kendoDatePicker");
		esod.value("");
		
		$("#inclusion")[0].checked = false;
		$("#exclusion")[0].checked = false;
		$("#productInfoCodeType")[0].checked = false;
		
		this.deselectAllNodes($("#mediaTreeView").data("kendoTreeView").dataSource.view());
		this.deselectAllNodes($("#territoryTreeView").data("kendoTreeView").dataSource.view());
		this.deselectAllNodes($("#languageTreeView").data("kendoTreeView").dataSource.view());
		this.deselectAllNodes($("#restrictionTreeView").data("kendoTreeView").dataSource.view());
		$("#territoryGroups").data("kendoMultiSelect").value("");
		$("#languageGroups").data("kendoMultiSelect").value("");
		$("#startDateStatus").data("kendoDropDownList").value("");
		$("#infoCodeGroup").data("kendoMultiSelect").value("");
		$("#strandSetName").data("kendoComboBox").value("");
		$("#termDisplayDate").html("");		
   };
   
   /**
    * 
    * @returns
    */
   this.createRightStrandValidation = function createRightStrandValidation(){
	   
	    var rightStrand = new Object();
	    var inclusion = $("#inclusion");       		     		
 		var exclusion = $("#exclusion");
 		var productInfoCodeType = $("#productInfoCodeType");
 		
 		if(!inclusion[0].checked && !exclusion[0].checked && !productInfoCodeType[0].checked){
 			errorPopup.showErrorPopupWindow(" Invalid selection : You must select either inclusion , exclusion or productInfoCodeType");
 			return null;
 		}
 		else {
 			
 			
 			if(inclusion[0].checked || exclusion[0].checked){
 				
 				var media = $("#mediaTreeView").data("kendoTreeView"); 
 		  		var mediaArray = this.validateTreeView(media.dataSource.view());  
 		  		if(mediaArray.length <= 0){
 		  			//Validation failed, take appropriate action and return
 		  			errorPopup.showErrorPopupWindow(" Invalid Media ");
 		  			return null;
 		  		}
 		  		else {
 		  			rightStrand.media = mediaArray;  			
 		  		}  
 		  		  		
 		  		var territories = $("#territoryTreeView").data("kendoTreeView");
 		  		var territoriesArray = this.validateTreeView(territories.dataSource.view());
 		  		if(territoriesArray.length <= 0){
 		  			//Validation failed, take appropriate action and return
 		  			errorPopup.showErrorPopupWindow(" Invalid Territories ");
 		  			return null;
 		  		}
 		  		else {
 		  			rightStrand.territories = territoriesArray;
 		  		}
 		  		
 		  		var languages = $("#languageTreeView").data("kendoTreeView");
 		  		var languagesArray = this.validateTreeView(languages.dataSource.view());
 		  		if(languagesArray.length <= 0){
 		  			//Validation failed, take appropriate action and return
 		  			errorPopup.showErrorPopupWindow(" Invalid Languages ");
 		  			return null;
 		  		}
 		  		else {
 		  			rightStrand.languages = languagesArray;
 		  		}
 		  		
 		  		var strandSetName = $("#strandSetName").data("kendoComboBox"); 
 		  		rightStrand.strandSetName = strandSetName.text().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
 		  		if(rightStrand.strandSetName == ""){
 		  			rightStrand.strandSetName = null;
 		  		}
 		  		
 		  		rightStrand.strandSetId = strandSetName.value();		  		
 		  		if(isNaN(parseInt(rightStrand.strandSetId))){
 					rightStrand.strandSetId = null;
 				}
 		  		
 			}
 			
 			if(inclusion && inclusion[0].checked){
 		  		
 	  			rightStrand.inclusionExclusionProduct = inclusion[0].value;
 	  			
 	  			var startContractualDate = $("#startContractualDate").data("kendoDatePicker");
 	  			var startOverrideDate = $("#startOverrideDate").data("kendoDatePicker");
 	      		var startDateCode = $("#startDateCode").data("kendoDropDownList");
 	      		var startDateStatus = $("#startDateStatus").data("kendoDropDownList");
 	      		
 	      		var startContractualDateValue = startContractualDate.value();
 	      		var startDateCodeValue = startDateCode.value();
 	      		
 	      		var startDateStatusValue = startDateStatus.value();
 	      		var sdcv = parseInt(startDateCodeValue);
 	      		
 	      		if(isNaN(Date.parse(startContractualDateValue)) && (sdcv <= 0) && (isNaN(Date.parse(startOverrideDate)))){
 	      			//Validation failed, popup a message
 	      			errorPopup.showErrorPopupWindow(" You must select either a valid start date or a start date code. ");
 	      			return null;
 	      		}
 	      		else {
 	      			rightStrand.startContractualDate = startContractualDateValue;
 	      			if(startDateCodeValue > 0){
 	      				rightStrand.startDateCode = startDateCodeValue;
 	      			}
 	      			else {
 	      				rightStrand.startDateCode = null;
 	      			}
 	      			
 	      			if(startDateStatusValue > 0){
 	      				rightStrand.startDateStatus = startDateStatusValue;
 	      			}
 	      			else {
 	      				rightStrand.startDateStatus = null;
 	      			}	      			
 	      			rightStrand.startOverrideDate = startOverrideDate.value();
 	      		}
 	      		
 	      		var endContractualDate = $("#endContractualDate").data("kendoDatePicker");
 	      		var endOverrideDate = $("#endOverrideDate").data("kendoDatePicker");
 	      		var endDateCode = $("#endDateCode").data("kendoDropDownList");
 	      		var endDateStatus = $("#endDateStatus").data("kendoDropDownList");
 	      		
 	      		var endContractualDateValue = endContractualDate.value();
 	      		var endDateCodeValue = endDateCode.value();
 	      		var endDateStatusValue = endDateStatus.value();
 	      		var edcv = parseInt(endDateCodeValue);
 	      		if(isNaN(Date.parse(endContractualDateValue)) && (edcv <=0 || isNaN(edcv))  && isNaN(Date.parse(endOverrideDate))){
 	      			//Validation failed, popup message and return
 	      			errorPopup.showErrorPopupWindow(" You must select either a valid end date or an end date code. ");
 	      			return null;
 	      		}
 	      		else {
 	      			rightStrand.endContractualDate = endContractualDateValue;
 	      			if(endDateCodeValue > 0){
 	      				rightStrand.endDateCode = endDateCodeValue;
 	      			}
 	      			else {
 	      				rightStrand.endDateCode = null;
 	      			}
 	      			
 	      			if(endDateStatusValue > 0){
 	      				rightStrand.endDateStatus = endDateStatusValue;
 	      			}
 	      			else {
 	      				rightStrand.endDateStatus = null;
 	      			}
 	      			rightStrand.endOverrideDate = endOverrideDate.value();	       			
 	      		}
 	      		
 	      		var restrictions = $("#restrictionTreeView").data("kendoTreeView");
 	     		var restrictionsArray = this.validateTreeView(restrictions.dataSource.view());
 	     		rightStrand.restrictions = restrictionsArray;
 	  		}
 			
 			if(exclusion && exclusion[0].checked){
 	  			rightStrand.inclusionExclusionProduct = exclusion[0].value;       			
 	  		}
 			
 			if(productInfoCodeType && productInfoCodeType[0].checked) {
 	  			rightStrand.inclusionExclusionProduct = productInfoCodeType[0].value;
 	  		}
 			
 			this.processEnteredInfoCodes($("#restrictionTreeView").data("kendoTreeView").dataSource.view());
 			
 			if(this.restrictionObject.restrictions.length > 0){
 				rightStrand.restrictions = this.restrictionObject.getShortRestrictionObjectForRightStrand();
 			}
 			 			
 			rightStrand.foxVersionId = rcscope.foxVersionId;
 		}
  		
 		return rightStrand;    		
   };
   
   /**
    * 
    * @param nodes
    * @returns {Array}
    */
   this.validateTreeView = function validateTreeView(nodes){
  		var checkedIds = [];
  		this.processIds(nodes, checkedIds);
  		return checkedIds;		
   };
   
   /**
    * 
    * @param popupLayerId
    * @param blanket
    */
   this.hidePopup = function hidePopup(){
	   $("#addEditButton").removeClass('disabled');
	   $("addEditButton").css("visibility", "hidden");
	   rightStrandPopupWindow.close();
	   
   };
   
   /**
    * 
    */
   this.createRightStrandSubmit = function createRightStrandSubmit(){
	    
  		var data = this.createRightStrandValidation();
  		
  		if(data != null){
  			//showSubmitPopupWindow shows the in progress spinner. We need to close it when there's an exception 
  			//or when the save compeltes.
  			this.showSubmitPopupWindow();			
  			var jsonData = JSON.stringify(data);
  			var url = rightStrandObject.path.getRightStrandsRESTPath();
  			var that = this;
  			var applyFilter = true;
  			var jqxhr = $.post(url, {q:jsonData}, function(data){
  				submitPopupWindow.close();
  				rightStrandObject.cancel();
  				rcscope.viewStrandsGrid(rcscope.foxVersionId,data,undefined,applyFilter);
  				rcscope.setUpdatedStrands(eval(data.length));
  				rcscope.$apply();
  				rightStrandObject.resetFields();
  			}, "json");			
			jqxhr.fail(function(xhr,status,message){
				//this closes the spinner. Note that submitPopupWindow is a global variable
				//apareantly this is a restriction for Kendo windows. They have to be global. (Yves said...)
				submitPopupWindow.close();
  				var displayMessage = xhr.responseText;
  				//TODO find a more elegant way to display error
  				errorPopup.showErrorPopupWindow("Error saving strands: " + displayMessage );
  			});       			
  		}
  		
   };
   
   
   /**
    * Pops a confirmation dialog window confirming that the user would like to delete 
    * a number of prouct info codes
    * @param productInfoCodesToRemove
    */
   this.confirmDelOfProductInfoCodes = function confirmDelOfProductInfoCodes(productInfoCodesToRemove) {
	   var rcscope = erm.scopes.rights();
	   
	   clearDelConfirmButtons();
	   if (productInfoCodesToRemove.productInfoCodeIds.length > 0) {
	     $("#deleteConfirmDetails").html("<BR/><BR/>" + eval(productInfoCodesToRemove.productInfoCodeIds.length) + " Product Info Code" + (eval(productInfoCodesToRemove.productInfoCodeIds.length) > 1 ? "s":""));
	     $("#delete-product-info-restriction-confirm").html("Yes, Delete " + eval(productInfoCodesToRemove.productInfoCodeIds.length) + " Product Info Code" + (eval(productInfoCodesToRemove.productInfoCodeIds.length) > 1 ? "s":""));
	     this.showDeleteConfirmationWindow();
	     rightStrandObject.productInfoCodesToRemove = productInfoCodesToRemove;
	     $("#delete-product-info-restriction-confirm").addClass("forceShow");	     
	     $("#strands-set-warning-div").removeClass("forceShow");
	     
 		if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest') {
 		     rcscope.$apply();
 		}
	   } else {
		 errorPopup.showErrorPopupWindow("No product codes were checked for deletion.");
	   }
   };
   
   /**
    * Pops a confirmation dialog window confirming that the user would like to change "Do Not License"   
    */
   
   this.confirmDoNotLicense = function confirmDoNotLicense() {
	   this.showDoNotLicenseConfirmationWindow();	   
   };
   
   this.cancelDoNotLicenseConfirmationWindow = function cancelDoNotLicenseConfirmationWindow() {	   		   	   	   
	   $("#doNotLicenseConfirmationWindow").data("kendoWindow").close();
	   rcscope = angular.element(document.getElementById("rightsController")).scope();
	   rcscope.currentProductArray.doNotLicense = !rcscope.currentProductArray.doNotLicense;
	   if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest') {
	     rcscope.$apply();
	   }
   };
   
	/**
    * Updates the value of saveDoNotLicense
    * @param saveDoNotLicense value
    */   
   this.updateDoNotLicense = function updateDoNotLicense() {
	   $("#doNotLicenseConfirmationWindow").data("kendoWindow").close();
	   rcscope = angular.element(document.getElementById("rightsController")).scope();
	   rcscope.currentProductArray.finishedSavingProduct = false;
	   rcscope.currentProductArray.savingProduct = true;
	   if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest') {
	     rcscope.$apply();
	   }
	   var foxVersionId = rcscope.foxVersionId;
	   var url = rightStrandObject.path.getRightsRESTPath()+"/restrictions/dnl/"+foxVersionId;	   
	   var jqxhr = $.post(url, '"' + rcscope.currentProductArray.doNotLicense + '"', function(data){	   
		   // update saveDoNotLicense
		   // Add indicator to screen for user
		   rcscope = angular.element(document.getElementById("rightsController")).scope();		   
		   rcscope.currentProductArray.doNotLicense = rcscope.currentProductArray.doNotLicense;
			
		   rcscope.currentProductArray.savingProduct = false;		   
		   rcscope.currentProductArray.finishedSavingProduct = true;		   
		   setTimeout(function() {
		     rcscope.currentProductArray.finishedSavingProduct = false;
			 if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest') {
			   rcscope.$apply();
			 }
		   }, erm.statusIndicatorTime);
		   var foxVersionId = rcscope.foxVersionId;
		   // Refresh product restrictions grid		   
		   rcscope.viewProductRestrictionsGrid(foxVersionId);
		 }).fail(function(xhr,status,message,rcscope){
		   // failed  to update saveDoNotLicense		   
		   console.log("failed to update saveDoNotLicense");		   
		   // Add indicator to screen for user
		   rcscope = angular.element(document.getElementById("rightsController")).scope();
		   rcscope.currentProductArray.savingProduct = false;
		   rcscope.currentProductArray.errorSavingProduct = true;
		   rcscope.currentProductArray.doNotLicense = !rcscope.currentProductArray.doNotLicense;
		   rcscope.$apply();		
	   });
   };
   
   /**
    * Pops a confirmation dialog window confirming that the user would like to delete 
    * a number of strands / restrictions 
    * @param strandRestrictionsToRemove
    */
   this.confirmDelOfStrandsOrRestriction = function confirmDelOfStrandsOrRestriction(strandRestrictionsToRemove, isSelectedStrandsPartOfStrandSet) {
	   clearDelConfirmButtons();
	   if (strandRestrictionsToRemove.rightStrandIds.length > 0 || strandRestrictionsToRemove.rightStrandRestrictionIds.length > 0) {
	     $("#deleteConfirmDetails").html(
			   (eval(strandRestrictionsToRemove.rightStrandIds.length) > 0 ? "<BR/>" + 
			     eval(strandRestrictionsToRemove.rightStrandIds.length)  + " Rights Strand" + (eval(strandRestrictionsToRemove.rightStrandIds.length) > 1 ? "s":"") : "") + 
			   (eval(strandRestrictionsToRemove.rightStrandRestrictionIds.length) > 0 ? "<BR/>" + eval(strandRestrictionsToRemove.rightStrandRestrictionIds.length) + " Informational Code" + (eval(strandRestrictionsToRemove.rightStrandRestrictionIds.length) > 1 ? "s":"") : ""));
	     $("#delete-right-strands-confirm").html("Yes, Delete " + 
    		 (eval(strandRestrictionsToRemove.rightStrandIds.length) > 0 ?  
   			     eval(strandRestrictionsToRemove.rightStrandIds.length)  + " Rights Strand" + (eval(strandRestrictionsToRemove.rightStrandIds.length) > 1 ? "s":"") + (eval(strandRestrictionsToRemove.rightStrandRestrictionIds.length) > 0 ? " and " : "") : "") + 
   			   (eval(strandRestrictionsToRemove.rightStrandRestrictionIds.length) > 0 ? "" + eval(strandRestrictionsToRemove.rightStrandRestrictionIds.length) + " Informational Code" + (eval(strandRestrictionsToRemove.rightStrandRestrictionIds.length) > 1 ? "s":"") : ""));
	     if (isSelectedStrandsPartOfStrandSet)
		   $("#strands-set-warning-div").addClass("forceShow");
		 else
		   $("#strands-set-warning-div").removeClass("forceShow");
	     this.showDeleteConfirmationWindow();
	     rightStrandObject.strandRestrictionsToRemove = strandRestrictionsToRemove;	     
	     $("#delete-right-strands-confirm").addClass("forceShow");	     
	   } else {
		 errorPopup.showErrorPopupWindow("No right strands or informational codes were checked for deletion.");
	   }
   };
   
   this.cancelRemoveRightStrandRestrictions = function cancelRemoveRightStrandRestrictions(strandRestrictionsToRemove) {
	   clearDelConfirmButtons();
	   rightStrandObject.strandRestrictionsToRemove = null;
	   rightStrandObject.productInfoCodesToRemove = null;	   
	   $("#deleteConfirmationWindow").data("kendoWindow").close();		   
   };
     
   this.removeProductInfoCodes = function removeProductInfoCodes(){
	   deleteConfirmationWindow.close();
	   rcscope = angular.element(document.getElementById("rightsController")).scope();
	   var windowPopped = false;
	   var foxVersionId = rcscope.foxVersionId;	  
	   var productInfoCodesToRemove = rightStrandObject.productInfoCodesToRemove;	   	  
	   if (rightStrandObject.productInfoCodesToRemove.productInfoCodeMap.length > 0) {		 	     		   		 
		 var url = rightStrandObject.path.getProductRESTPath()+"/deleteproductinfocode";		   
		 var that = this;		 
		 this.asyncRemoveProductRestrictions(that, url, windowPopped, foxVersionId, rightStrandObject.productInfoCodesToRemove, 0);	     	    
   	  
		
	   } else {
		 errorPopup.showErrorPopupWindow("No product info codes were checked for deletion.");
	   }	   	   	  
   };
   
   this.asyncRemoveProductRestrictions = function asyncRemoveProductRestrictions(that, url, windowPopped, foxVersionId, productInfoCodesToRemove, index){
	   var curIndex = 0;
	   var productInfoCodeId = 0;
	   for (var curProductInfoCodeId in productInfoCodesToRemove.productInfoCodeMap) {
		   if (curIndex == index) {
			   productInfoCodeId = curProductInfoCodeId;
			   break;
		   }
		   curIndex++;
	   }
	   var deleteWidowHTMLInner = "<div id='submitDiv'  class='submitClass' style='height : 50%; margin-top : 20px;'>" +
		"<i class='icon-spinner icon-spin icon-large'></i> Deleting ";			
	   var deleteWidowHTMLOuter = "</div>";
	   var deleteMessage = "Product Info Code [" + productInfoCodeId + "] " +  productInfoCodesToRemove.productInfoCodeMap[productInfoCodeId].description;
	   $("#deletePopupWindow").html(deleteWidowHTMLInner + deleteMessage + "<BR/><BR/>Please wait..." + deleteWidowHTMLOuter);
	   if (!windowPopped) {
	     that.showDeletePopupWindow();
	     windowPopped = true;
	   }	   	   
	   $.post(url, '{"foxVersionId":' + foxVersionId + ',"productInfoCodeRestrictionIds":[' + productInfoCodeId + ']}', function(data){
		   // removed restriction
		   if (index < eval(eval(productInfoCodesToRemove.productInfoCodeIds.length)-1)) {
		     asyncRemoveProductRestrictions(that, url, windowPopped, foxVersionId, productInfoCodesToRemove, (index+1));
		   } else {
		     if (windowPopped)
			   deletePopupWindow.close();
		     var rcscope = angular.element(document.getElementById("rightsController")).scope();		     
			 rcscope.viewProductRestrictionsGrid(foxVersionId);
			 if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest')
			   rcscope.$apply();	
			 setTimeout(function() {
			   rcscope.setDeltedProductCodeRestrictions(eval(productInfoCodesToRemove.productInfoCodeIds.length));
			   
			   //TMA
			   console.log("TMA debug: deleting product info codes from the general section");
			   productRestrictionsGridConfigurator.updateProductRestrictions(foxVersionId);
			   
			   if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest') {
				   rcscope.$apply();
			   }
			 }, 500);			 
	   	   }
		 }).fail(function(xhr,status,message){
		   // failed to remove restriction		   
		   var displayMessage = xhr.responseText;
		   console.log("Delete failed %o %o %o %o", xhr, status, message, displayMessage);
		   errorPopup.showErrorPopupWindow("Problem deleting " + deleteMessage + ": " + displayMessage);
		   that.errorFound = true;
	   });	   
   };
   
   
   /**
    * 
    */
   this.removeRightStrandRestrictions = function removeRightStrandRestrictions(){
	   deleteConfirmationWindow.close();
	   rcscope = angular.element(document.getElementById("rightsController")).scope();
	   var foxVersionId = rcscope.foxVersionId;	   	   
	   var windowPopped = false;
	   if ((rightStrandObject.strandRestrictionsToRemove.rightStrandIds != null && rightStrandObject.strandRestrictionsToRemove.rightStrandIds.length > 0 )|| (rightStrandObject.strandRestrictionsToRemove.rightStrandRestrictionIds != null && rightStrandObject.strandRestrictionsToRemove.rightStrandRestrictionIds.length > 0)) {
		 var errorFound = false;
	     if (eval(rightStrandObject.strandRestrictionsToRemove.rightStrandRestrictionIds.length) > 0)	{  	 
		   var url = rightStrandObject.path.getRightsRESTPath()+"/deleterestriction";		   		   		 
		   var that = this;
		   this.asyncRemoveRightStrandRestrictions(that, url, windowPopped, foxVersionId, rightStrandObject.strandRestrictionsToRemove, eval(eval(rightStrandObject.strandRestrictionsToRemove.rightStrandIds.length) + eval(rightStrandObject.strandRestrictionsToRemove.rightStrandRestrictionIds.length)), 0);		   
	     }
	   	 if (!errorFound && eval(rightStrandObject.strandRestrictionsToRemove.rightStrandIds.length) > 0 && ((rightStrandObject.strandRestrictionsToRemove.rightStrandRestrictionIds == null || rightStrandObject.strandRestrictionsToRemove.rightStrandRestrictionIds.length == 0))) {   	 
	   	   var url = rightStrandObject.path.getRightStrandsRESTPath()+"/deleterightstrand";		   		   		 
		   var that = this;
		   this.asyncRemoveRightStrands(that, url, windowPopped, foxVersionId, rightStrandObject.strandRestrictionsToRemove, eval(eval(rightStrandObject.strandRestrictionsToRemove.rightStrandIds.length) + eval(rightStrandObject.strandRestrictionsToRemove.rightStrandRestrictionIds.length)), 0);		   
	     };	     
   	   } else {   		 
		 errorPopup.showErrorPopupWindow("No right strands or informational codes were checked for deletion.");		 
	   }	   	   	 
   };
   
   this.asyncRemoveRightStrands = function asyncRemoveRightStrands(that, url, windowPopped, foxVersionId, strandRestrictionsToRemove, totalRemoved, index){
	   var curIndex = 0;
	   var rightStrandID = 0;
	   var applyFilter = true;
	   for (var curRightStrandID in strandRestrictionsToRemove.rightStrandMap) {
	     if (curIndex == index) {
		   rightStrandID = curRightStrandID;
		   break;
		 }
		 curIndex++;
	   }
	   var deleteWidowHTMLInner = "<div id='submitDiv'  class='submitClass' style='height : 50%; margin-top : 20px;'>" +
		"<i class='icon-spinner icon-spin icon-large'></i> Deleting ";			
	   var deleteWidowHTMLOuter = "</div>";	   
	   var deleteMessage = "Rights Strand [" + rightStrandID + "] " + strandRestrictionsToRemove.rightStrandMap[rightStrandID].description;
	   $("#deletePopupWindow").html(deleteWidowHTMLInner + deleteMessage + "<BR/><BR/>Please wait..." + deleteWidowHTMLOuter);		   		   	   	  	   	   	   	 
	   if (!windowPopped) {
	     that.showDeletePopupWindow();
	     windowPopped = true;
	   }	   	   
	   $.post(url, '{"foxVersionId":' + foxVersionId + ',"rightStrandIds":[' + rightStrandID + ']}', function(data){	   
		   // removed restriction
		   if (index < eval(eval(strandRestrictionsToRemove.rightStrandIds.length)-1)) {
			   asyncRemoveRightStrands(that, url, windowPopped, foxVersionId, strandRestrictionsToRemove, totalRemoved, (index+1));
		   } else {
			   //$.post(rightStrandObject.path.getRightStrandsRESTPath() + "/setbitmap/" + foxVersionId, function(data) {
				   if (windowPopped)
					   deletePopupWindow.close();
				     rcscope = angular.element(document.getElementById("rightsController")).scope();
					 rcscope.setDeltedStrands(totalRemoved);										
					 if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest')
					   rcscope.$apply();				 
					 var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();					 
					 ermSidePanelScope.rightStrandOrRestrictionChecked = false;
					 ermSidePanelScope.rightStrandComments = null;
					 if (ermSidePanelScope.$root.$$phase != '$apply' && ermSidePanelScope.$root.$$phase != '$digest')
					   ermSidePanelScope.$apply();
					 setTimeout(function() {
					   rcscope.viewStrandsGrid(foxVersionId,undefined,undefined,applyFilter);
					 }, erm.statusIndicatorTime);			   			   		     			  
	   	   };
		 }).fail(function(xhr,status,message){
		   // failed to remove restriction
		   if (windowPopped)
		     deletePopupWindow.close();
		   var displayMessage = xhr.responseText;
		   errorPopup.showErrorPopupWindow("Problem deleting " + deleteMessage + ": " + displayMessage);
		   that.errorFound = true;
	   });	   
   };
   
   this.asyncRemoveRightStrandRestrictions = function asyncRemoveRightStrandRestrictions(that, url, windowPopped, foxVersionId, strandRestrictionsToRemove, totalRemoved, index){
	   var curIndex = 0;
	   var restrictionID = 0;
	   var applyFilter = true;
	   for (var curRestrictionID in strandRestrictionsToRemove.rightStrandRestrictionMap) {
		   if (curIndex == index) {
			   restrictionID = curRestrictionID;
			   break;
		   }
		   curIndex++;
	   }
	   var deleteWidowHTMLInner = "<div id='submitDiv'  class='submitClass' style='height : 50%; margin-top : 20px;'>" +
		"<i class='icon-spinner icon-spin icon-large'></i> Deleting ";			
	   var deleteWidowHTMLOuter = "</div>";	   
	   var deleteMessage = "Restriction [" + restrictionID + "] " + strandRestrictionsToRemove.rightStrandRestrictionMap[restrictionID].description;
	   $("#deletePopupWindow").html(deleteWidowHTMLInner + deleteMessage + "<BR/><BR/>Please wait..." + deleteWidowHTMLOuter);
	   if (!windowPopped) {
	     this.showDeletePopupWindow();
	     windowPopped = true;
	   }
	   if (!windowPopped) {
	     that.showDeletePopupWindow();
	     windowPopped = true;
	   }	   	   
	   $.post(url, '{"foxVersionId":' + foxVersionId + ',"rightStrandRestrictionIds":[' + restrictionID + ']}', function(data){	   
		   // removed restriction
		   if (index < eval(eval(strandRestrictionsToRemove.rightStrandRestrictionIds.length)-1)) {
			   asyncRemoveRightStrandRestrictions(that, url, windowPopped, foxVersionId, strandRestrictionsToRemove, totalRemoved, (index+1));
		   } else if (totalRemoved == eval(strandRestrictionsToRemove.rightStrandRestrictionIds.length)) {			   
		     if (windowPopped)
			   deletePopupWindow.close();
		     rcscope.setDeltedStrands(eval(strandRestrictionsToRemove.rightStrandRestrictionIds.length));
		     rcscope = angular.element(document.getElementById("rightsController")).scope();			 			 		
			 var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();
			 ermSidePanelScope.rightStrandOrRestrictionChecked = false;
			 ermSidePanelScope.rightStrandComments = null;		
			 if (ermSidePanelScope.$root.$$phase != '$apply' && ermSidePanelScope.$root.$$phase != '$digest')
			   ermSidePanelScope.$apply();			 
			 setTimeout(function() {
			   rcscope.viewStrandsGrid(foxVersionId,undefined, undefined, applyFilter);
			 }, erm.statusIndicatorTime);
	   	   } else {	   		 			  
			 that.asyncRemoveRightStrands(that, rightStrandObject.path.getRightStrandsRESTPath()+"/deleterightstrand", windowPopped, foxVersionId, rightStrandObject.strandRestrictionsToRemove, totalRemoved, 0);
	   	   }
		 }).fail(function(xhr,status,message){
		   // failed to remove restriction		   
		   var displayMessage = xhr.responseText;
		   console.log("Delete failed %o %o %o %o", xhr, status, message, displayMessage);
		   errorPopup.showErrorPopupWindow("Problem deleting " + deleteMessage + ": " + displayMessage);
		   that.errorFound = true;
	   });	   
   };
   
   
   /**
    * 
    */
   this.createOrUpdateProductLevelRestrictions = function createOrUpdateProductLevelRestrictions(nodes){
	   
	   if(nodes && nodes.length > 0){
		   rightStrandObject.processEnteredInfoCodes(nodes);
	   }
	   if(this.restrictionObject.restrictions.length > 0){
		   this.showSubmitPopupWindow();
		   var jsonObject = rightStrandObject.restrictionObject.getShortRestrictionObject();
		   var jsonRestrictionObject = JSON.stringify(jsonObject);
		   var url = rightStrandObject.path.getRightsRESTPath()+"/restrictions";
		   rcscope = angular.element(document.getElementById("rightsController")).scope();
		   var foxVersionId = rcscope.foxVersionId;
		   var jqxhr = $.post(url, {q:jsonRestrictionObject}, function(data){
			   submitPopupWindow.close();		   	   
			   rightStrandObject.cancel();
			   rcscope.viewProductRestrictionsGrid(foxVersionId,data);
			   rcscope.$apply();
			   rcscope.setUpdatedProductCodeRestrictions(eval(data.length));
				   
		   });
		   jqxhr.fail(function(xhr,status,message){
			    //submitPopupWindow.close();
 				var displayMessage = xhr.responseText;
 				console.log("Save failed %o %o %o",xhr,status,message);
 				errorPopup.showErrorPopupWindow("Error saving strands: " + displayMessage );
 			});
	   }
	   else {
		   errorPopup.showErrorPopupWindow(" You must select some info code before submitting");
	   }
	   
   };
   
   /**
    * 
    */
   this.processEnteredInfoCodes = function processEnteredInfoCodes(nodes){
	   //We get all the selected info code Id's
	   var selectedRestrictionsId = this.validateTreeView(nodes);
	   var regularDateRestrictionIds = new Array();
	   if(selectedRestrictionsId && selectedRestrictionsId.length > 0){
		   //Here we get all the info codes with start and end date that were assigned using the popup 
		   //Info code window
		   var specialDateRestrictionIds = this.restrictionObject.getAllRestrictionIds();
		   
		   if(specialDateRestrictionIds && specialDateRestrictionIds.length > 0){			   
			   for(var i = 0; i < selectedRestrictionsId.length; i++){
				   //We check to see if the specific id exists in the array of Id's created using the popup 
				   //Info code window. If not we add it to a temporary array
				   var index = specialDateRestrictionIds.indexOf(selectedRestrictionsId[i]);
				   if(index < 0){					   
					   regularDateRestrictionIds.push(selectedRestrictionsId[i]);
				   }
			   }
		   }
		   else {
			   regularDateRestrictionIds = selectedRestrictionsId;
		   }
		   if(regularDateRestrictionIds.length > 0){
			   //Finally here we loop through the temporary array and add them to the 
			   //restrictionObject restrictions array
			   for(var i  = 0; i < regularDateRestrictionIds.length; i++){
				   var res = new restriction(regularDateRestrictionIds[i], "", "", "", "", "");
				   this.restrictionObject.restrictions.push(res);
			   }
		   }
		   this.restrictionObject.foxVersionId = rcscope.foxVersionId;
	   }	   
   };
   
   /**
    * 
    */
   this.cancel = function cancel(){
	   this.hidePopup();	   
   };
   
   this.resetFields = function resetFields(){
	   this.resetKendoFields();	
	   this.restrictionObject.resetFields();
   };
   
   /**
    * 
    * @param popupLayerId
    * @param blanket
    */
   this.showRightStrandPopup = function showRightStrandPopup(isProductInfoCode){ 	 
	   rcscope = angular.element(document.getElementById("rightsController")).scope();
	   
	   $("#productTitlePopup").html("New Rights Definitions for : "+rcscope.currentProductArray.productTitle);
	   $("#productCode").html(rcscope.currentProductArray.productCode);
	   $("#productTypeCode").html(rcscope.currentProductArray.productTypeCode);
	   var r = new restriction("", "", "", "", "", "");
	   $("#firstReleaseDate").html(r.getCustomDisplayDate(rcscope.currentProductArray.firstReleaseDate));
	   $("#productionYear").html(rcscope.currentProductArray.productionYear);
	   $("#currentFoxId").html(rcscope.currentProductArray.foxId);
	   $("#currentFoxVersionId").html(rcscope.currentProductArray.foxVersionId);
	   $("#currentFoxIdJDE").html(rcscope.currentProductArray.jdeId);
	   
	   if(isProductInfoCode){
		   $("#productInfoCodeType")[0].checked = true;
		   $("#infoCodeGroup").data("kendoMultiSelect").enable(true);
			$("#restrictionTreeView").data("kendoTreeView").enable(".k-item", true);
			$("#strandSetName").data("kendoComboBox").enable(false);
			$("#territoryGroups").data("kendoMultiSelect").enable(false);
			$("#languageGroups").data("kendoMultiSelect").enable(false);
			this.enableTerm();
			this.enableDisableMTL(false);
			$("#addEditButton")[0].disabled = false;
	   }
	   
	   var w = $("#rightStrandPopupWindow").data("kendoWindow");
	   if(w){
		   w.setOptions({
			   modal : true
		   });
		   w.center();
		   w.open();
	   }
	   
   };
   
   this.enableDisableMTL = function enableDisableMTL(bool){
	   $("#mediaTreeView").data("kendoTreeView").enable(".k-item", bool);
	   $("#languageTreeView").data("kendoTreeView").enable(".k-item", bool);
	   $("#territoryTreeView").data("kendoTreeView").enable(".k-item", bool);
   };
   
   /**
    * 
    * @param restrictionIds
    * @param startDate
    * @param endDate
    * @param startDateCodeId
    * @param endDateCodeId
    */
   /*
   this.addRestrictions = function addRestrictions(restrictionIds, startDate, endDate, startDateCodeId, endDateCodeId){
	   
	   if(this.restrictionObject == null){
		   this.restrictionObject = new restrictionObject(rcscope.foxVersionId);
	   }
	   this.restrictionObject.addRestriction(restrictionIds, startDate, endDate, startDateCodeId, endDateCodeId);
   };
   */
   /**
    * Final restrictions processing method. Returns a json object.
    * @param restrictionIds
    * @returns
    */
   /*
   this.processRestrictions = function processRestrictions(restrictionIds){
	   if(restrictionIds != null && restrictionIds.length > 0){
		   var specialDateRestrictionIds = this.restrictionObject.getAllRestrictionIds();
		   if(specialDateRestrictionIds != null){
			   for(var k = 0; k < specialDateRestrictionIds.length; k++){
				   var index = restrictionIds.indexOf(specialDateRestrictionIds[k]);
				   if(index >= 0){
					   restrictionIds.splice(index, 1);
				   }
			   }
		   }
		   
		   this.restrictionObject.addRestriction(restrictionIds, "", "", "", "");
		   return JSON.stringify(this.restrictionObject);
	   }
   };
   */
   /**
    * This method builds the array that will be used as a datasource for the Add/Edit info code popup window.
    */
   this.buildPopupInfoCodeArray = function buildPopupInfoCodeArray(nodes){
	   //var retrictionTreeViewNodes = $("#restrictionTreeView").data("kendoTreeView").dataSource.view();
	   var retrictionTreeViewNodes = nodes;
	   var nodesAlreadySelected = this.restrictionObject.getAllRestrictionIds();
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
				   var restriction =  this.restrictionObject.getRestriction(nodeId);
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
    * This method build the datasource for the nodes coming from the product info code modify button. The 
    * resulting array is become a datasource for the info code popup window
    * @param nodes
    * @returns {Array}
    */
   this.buildPopupInfoCodeArrayForEdit = function buildPopupInfoCodeArrayForEdit(nodes){
	   var retrictionTreeViewNodes = nodes;
	   var r = new restriction("", "", "", "", "", "");
	   var infoCodeDataSourceNodes = new Array();
	   if(retrictionTreeViewNodes != null && retrictionTreeViewNodes.length > 0){
		   for(var i = 0; i < retrictionTreeViewNodes.length; i++){
			   if($("#cbpr"+retrictionTreeViewNodes[i].productRestrictionId)[0].checked){
				   var infoCodeNode = new Object();
				   infoCodeNode.checkboxValue = false;
				   infoCodeNode.id = retrictionTreeViewNodes[i].productRestrictionId;
				   infoCodeNode.infoCode = retrictionTreeViewNodes[i].restriction.code + "," + retrictionTreeViewNodes[i].restriction.description;
				   infoCodeNode.type = retrictionTreeViewNodes[i].restriction.description;
				   infoCodeNode.startDate = retrictionTreeViewNodes[i].startDateDate;
				   infoCodeNode.altRestrictionId = retrictionTreeViewNodes[i].restriction.id;
				   if(infoCodeNode.startDate){
					   infoCodeNode.startDate = r.getCustomDisplayDate(Date.parse(infoCodeNode.startDate));
				   }
				   infoCodeNode.endDate = retrictionTreeViewNodes[i].endDateDate;
				   if(infoCodeNode.endDate){
					   infoCodeNode.endDate = r.getCustomDisplayDate(Date.parse(infoCodeNode.endDate));
				   }
				   infoCodeDataSourceNodes.push(infoCodeNode);
			   }			   
		   }
		   //Adding dummy data at the end of the dataSource. Since if the kendo grid is 
		   //initially hidden when it becomes visible if does not render correctly and 
		   //the last row of data will be hidden and not visible
		   var infoCodeNode = new Object();
		   infoCodeNode.checkboxValue = false;
		   infoCodeNode.id = "-1";
		   infoCodeNode.infoCode = "";
		   infoCodeNode.type = "";
		   infoCodeNode.startDate = "";
		   infoCodeNode.altRestrictionId = "";
		   infoCodeNode.endDate = "";
		   //infoCodeDataSourceNodes.push(infoCodeNode);
	   }
	   return infoCodeDataSourceNodes;
	   
   };
   
   
   /**
    * Process the selected info codes from the info code popup window
    */
   this.addSelectedInfoCode = function addSelectedInfoCode(infoCodePopupResults){
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
    */
   this.getSelectedInfoCodeIds = function getSelectedInfoCodeIds(selectedRows, isCreate){
	   var selectedIds = [];
	   var selectedInfoCodeTexts = [];
	   var returnObject = new Object();
	   if(selectedRows && selectedRows.length > 0){
			for(var i = 0; i < selectedRows.length; i++){
				if($("#checkbox_"+selectedRows[i].id)[0].checked){
					var ob = new Object();
					if(isCreate){
						ob.restrictionId = selectedRows[i].id;
						ob.productRestrictionId = "";
					}
					else {
						
						ob.restrictionId = selectedRows[i].altRestrictionId;
						ob.productRestrictionId = selectedRows[i].id;
					} 
					selectedIds.push(ob);
					selectedInfoCodeTexts.push(selectedRows[i].infoCode);
				}				
			}			
		}
	   returnObject.selectedIds = selectedIds;
	   returnObject.selectedInfoCodeTexts = selectedInfoCodeTexts;
	   return returnObject;
   };
   
   /**
    * 
    * @param infoCodePopupResults
    * @param bool
    * @returns {___selectedCodes8}
    */
   this.processInfoCodesRightStrand = function processInfoCodesRightStrand(infoCodePopupResults, bool){
	   var selectedCodes = rightStrandObject.addSelectedInfoCode(infoCodePopupResults);
	   var selCodes = rightStrandObject.getSelectedInfoCodeIds(infoCodePopupResults.grid.dataSource.data(), bool);
	   selectedCodes.selectedInfoCodeIds = selCodes.selectedIds;
	   selectedCodes.selectedInfoCodeTexts = selCodes.selectedInfoCodeTexts;
	   return selectedCodes;
   };
   
   /**
    * function responsible for receiving the processed info codes for the right strand or product level
    * and displaying that information in the right strand/product info code editing popup window
    */
   this.processPopupWindowInfoCode = function processPopupWindowInfoCode(infoCodePopupResults){
	   var selectedCodes = rightStrandObject.processInfoCodesRightStrand(infoCodePopupResults, true);	   
	   if(selectedCodes){
		   rightStrandObject.restrictionObject.addRestriction(selectedCodes.selectedInfoCodeIds, selectedCodes.startDate, selectedCodes.endDate, selectedCodes.startInfoCodeDateCode, selectedCodes.endInfoCodeDateCode, selectedCodes.startCodeText, selectedCodes.endCodeText, selectedCodes.selectedInfoCodeTexts);
		   $("#infoCodeAlternateDateDisplay").html(rightStrandObject.builRestrictionDisplay(rightStrandObject));
	   }
   };
   
   /**
    * function responsible for processing the product level info codes update
    * @param infoCodePopupResults
    */
   this.processPopupWindowInfoCodeForUpdate = function processPopupWindowInfoCodeForUpdate(infoCodePopupResults){
	   var selectedCodes = rightStrandObject.processInfoCodesRightStrand(infoCodePopupResults, false);
	   if(selectedCodes){
		   rightStrandObject.restrictionObject.addRestriction(selectedCodes.selectedInfoCodeIds, selectedCodes.startDate, selectedCodes.endDate, 
				   selectedCodes.startInfoCodeDateCode, selectedCodes.endInfoCodeDateCode, selectedCodes.startCodeText, selectedCodes.endCodeText, selectedCodes.selectedInfoCodeTexts);
		   rightStrandObject.createOrUpdateProductLevelRestrictions(null);
	   }
	   
   };
   
   
   
   /**
    * Initialization function for the right strand object. Must be called shortly after initialization
    * @param rcscope
    */
   this.initRightStrand = function initRightStrand(rcscope){
	 //TMA memory leak -- same pattern of using object.getPrototypeOf();
	  // this.restrictionObject = object.getPrototypeOf(restrictionObject(rcscope.foxVersionId));
	   this.restrictionObject = new restrictionObject(rcscope.foxVersionId);
   };
   
   /**
    * This function build and format the string that will be displayed in the special date info code box
    * @returns
    */
   this.builRestrictionDisplay = function builRestrictionDisplay(ob){
	   if(ob.restrictionObject.restrictions != null && ob.restrictionObject.restrictions.length > 0){
		   var displayArray = new Array();
		   for(var i = 0; i < ob.restrictionObject.restrictions.length; i++){
			   var r = ob.restrictionObject.restrictions[i];
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
    * @param selectedIds
    */
   this.clearNonIncludedSelectedRestriction = function clearNonIncludedSelectedRestriction(selectedIds){
	   this.restrictionObject.clearNonIncludedSelectedRestriction(selectedIds);
   };
   
   
   /**
    * Display the start and end date in the #termDisplayDate div (rightsEdit.html) in the popup right strand window
    */
   this.displayTermDate = function displayTermDate(){
	   
	   var contractualStartDate = $("#startContractualDate").data("kendoDatePicker").value();
	   var contractualStartDateCode = $("#startDateCode").data("kendoDropDownList").dataItem();
	   var overrideStartDate = $("#startOverrideDate").data("kendoDatePicker").value();
	   var startDate = "";
	   if(overrideStartDate){
		   startDate = Date.parse(overrideStartDate);
		   if(startDate){
			   startDate = this.getCustomDisplayDateFromLong(startDate);
		   }
	   }
	   else if(contractualStartDateCode && contractualStartDateCode.id > 0){
		   startDate = contractualStartDateCode.description;
	   }
	   else if(contractualStartDate){
		   startDate = Date.parse(contractualStartDate);
		   if(startDate){
			   startDate = this.getCustomDisplayDateFromLong(startDate);
		   }
	   }
	   
	   var contractualEndDate = $("#endContractualDate").data("kendoDatePicker").value();
	   var contractualEndDateCode = $("#endDateCode").data("kendoDropDownList").dataItem();
	   var overrideEndDate = $("#endOverrideDate").data("kendoDatePicker").value();
	   var endDate = "";
	   if(overrideEndDate){
		   endDate = Date.parse(overrideEndDate);
		   if(endDate){
			   endDate = this.getCustomDisplayDateFromLong(endDate);
		   }
	   }
	   else if(contractualEndDateCode && contractualEndDateCode.id > 0){
		   endDate = contractualEndDateCode.description;
	   }
	   else if(contractualEndDate){
		   endDate = Date.parse(contractualEndDate);
		   if(endDate){
			   endDate = this.getCustomDisplayDateFromLong(endDate);
		   }
	   }
	   
	   if(startDate || endDate){
		   var display = startDate +" To "+endDate;
		   $("#termDisplayDate").html(display);
	   }
   };
   
   this.getCustomDisplayDateFromLong = function getCustomDisplayDateFromLong(longDate){
		var m = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		if(longDate){
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
	 * Not used currently
	 * @param mediaSource
	 */
	this.loadMediaSource = function loadMediaSource(mediaSource){
		$.getJSON(this.path.getFoxMediaNodesRESTPath(), function(data){
			if(data){
				mediaSource = data;
			}
		});
	};
	
	/**
	 * 
	 * @param textToShow
	 */
	
	this.showErrorPopupWindow = function showErrorPopupWindow(textToShow){
		errorPopup.showErrorPopupWindow(textToShow);		
	};
	
	/**
	 * 
	 */
	this.showSubmitPopupWindow = function showSubmitPopupWindow(){
		var d = $("#submitPopupWindow").data("kendoWindow");
		d.setOptions({
			visible : true,
			modal : true
		});
		d.center();
		d.open();		
	};
	
	this.showDeletePopupWindow = function showDeletePopupWindow(){
		var d = $("#deletePopupWindow").data("kendoWindow");
		d.setOptions({
			visible : true,
			modal : true
		});
		d.center();
		d.open();		
	};
	
	this.showDeleteConfirmationWindow = function showDeleteConfirmationWindow(){
		var d = $("#deleteConfirmationWindow").data("kendoWindow");
		d.setOptions({
			visible : true,
			modal : true
		});
		d.center();
		d.open();		
	};
	
	this.showDoNotLicenseConfirmationWindow = function showDoNotLicenseConfirmationWindow(){
		var d = $("#doNotLicenseConfirmationWindow").data("kendoWindow");
		d.setOptions({
			visible : true,
			modal : true
		});
		d.center();
		d.open();		
	};		
	
	/**
	 * 
	 */
	this.validateInfoCodePopup = function validateInfoCodePopup(){
		var shouldSubmit  = false;
		var gridNodes = $("#infoCodeGrid").data("kendoGrid").dataSource.view();
		if(gridNodes && gridNodes.length > 0){			
			for(var i = 0; i < gridNodes.length; i++){
				
				if($("#checkbox_"+gridNodes[i].id)[0].checked){
					shouldSubmit = true;
					break;
				};
			}			
			if(!shouldSubmit){
				//There was no nodes selected
				errorPopup.showErrorPopupWindow(" You must select one or more product infor codes in order to save");				
			}
			
			if(shouldSubmit){
				//VALIDATE THE DATE ENTERED HERE.
				shouldSubmit = false;
				var startInfoCodeDateCode = $("#startInfoCodeDateCode").data("kendoDropDownList").value();
				
				
				var startInfoCodeDate = $("#startInfoCodeDate").data("kendoDatePicker").value();
				
				
				var endInfoCodeDate = $("#endInfoCodeDate").data("kendoDatePicker").value();
				
				
				var endInfoCodeDateCode = $("#endInfoCodeDateCode").data("kendoDropDownList").value();
				
				
				var st = "";
			    if(startInfoCodeDateCode && endInfoCodeDateCode && startInfoCodeDateCode > 0 && endInfoCodeDateCode > 0){
			    	shouldSubmit = true;
			    }
			    else if(startInfoCodeDateCode && startInfoCodeDateCode > 0 && endInfoCodeDate && !isNaN(Date.parse(endInfoCodeDate))){
			    	shouldSubmit = true;
			    }
			    else if(startInfoCodeDate && !isNaN(Date.parse(startInfoCodeDate)) && endInfoCodeDateCode && endInfoCodeDateCode > 0){
			    	shouldSubmit = true;
			    }
			    else if(startInfoCodeDate && !isNaN(Date.parse(startInfoCodeDate)) && endInfoCodeDate && !isNaN(Date.parse(endInfoCodeDate)) && ((Date.parse(endInfoCodeDate) - Date.parse(startInfoCodeDate)) >= 0)){		    	
			    	shouldSubmit = true;
			    }
			    else {
			    	if(startInfoCodeDate && !isNaN(Date.parse(startInfoCodeDate)) && endInfoCodeDate && !isNaN(Date.parse(endInfoCodeDate)) && (Date.parse(endInfoCodeDate) - Date.parse(startInfoCodeDate)) < 0){
			    		st = "Start date cannot be after the end date...";
			    	}
			    }
			    
			    if(st.length > 0){
			    	errorPopup.showErrorPopupWindow(st);
			    }
			}
			
			
		}
		else {
			errorPopup.showErrorPopupWindow(" Error the grid has no rows, please close the popup window by clicking cancel, and start over.");
		}
		return shouldSubmit;
	};
	
	this.validateInfoCodeDate = function(){
		
	};
	
	/**
	 * Just for testing must be deleted
	 * @param nodes
	 * @param checkedNodes
	 */
	this.getMatchedStartNodeId = function getMatchedStartNodeId(nodes, startString, searchNode) {
			
	        for (var i = 0; i < nodes.length; i++) {
	        	if(searchNode.length > 0){
	        		break;
	        	}
	        	//TMA memory leak -- same pattern of using object.getPrototypeOf();
	        	//var nodeText = object.getPrototypeOf(String(nodes[i].text));
	        	var nodeText = new String(nodes[i].text);
	        	
	            if (nodeText) {
	            	if(startString.length <= nodeText.length){
	            		var st = nodeText.substr(0, startString.length);	            		
	            		if(st.toLowerCase() == startString.toLowerCase()){
	            			searchNode.push(nodes[i]);
	            			break;
	            		}
	            	}
	                
	            }
	            if (nodes[i].hasChildren) {
	                this.getMatchedStartNodeId(nodes[i].children.view(), startString, searchNode);
	            }
	        }	
	        
	        return searchNode;
	 };
	 
	 /**
	  * 
	  * @param kendoTree
	  * @param startString
	  */
	 this.kendoTreeKeySearch = function kendoTreeKeySearch(kendoTree, startString){
		 var searchNode = [];
		 var foundNode = this.getMatchedStartNodeId(kendoTree.dataSource.view(), startString, searchNode);
		 if(foundNode && foundNode.length > 0){
			 var bar = kendoTree.findByUid(foundNode[0].uid);
			 if(bar){
				 kendoTree.select(bar);
			 }
		 }
		 		 
	 };
	 
	 this.showGeneralPopupWindow = function(text){
		 $("#rightsController").append('<div id="generalPurposePopupWindow"></div>');
		 $("#generalPurposePopupWindow").append('<div id="generalPurposePopupDiv" class="submitClass" style="height: 50%; margin-top: 20px;">');
		 $("#generalPurposePopupDiv").html('<i class="icon-spinner icon-spin icon-large"></i>&nbsp;'+text);
		 $("#generalPurposePopupWindow").kendoWindow({
             width: "450px",
             height : "150px",
             minWidth : "450px",
             minHeight : "150px",
             title: "",
             actions: [],
             visible : false
         });
		 
		 var d = $("#generalPurposePopupWindow").data("kendoWindow");
		 d.setOptions({
			visible : true,
			modal : true
		 });
		 d.center();
		 d.open();
	 };
	 
	 this.closeGeneralPopupWindow = function(){
		 $("#generalPurposePopupWindow").data("kendoWindow").close();
		 $("#generalPurposePopupWindow").data("kendoWindow").destroy();
		 $("#generalPurposePopupWindow").remove();
	 };
   
}	

var rcscope = null;
var submitPopupWindow = null;
var deletePopupWindow = null;
var deleteConfirmationWindow = null;
var doNotLicenseConfirmationWindow = null;
//TMA memory leak -- same pattern of using object.getPrototypeOf();
//rightStrandObject = object.getPrototypeOf(rightStrand());      
rightStrandObject = new rightStrand();

       
       
       
       