//------- original functions
	strandActions = {
			modifyRightStrands:function modifyRightStrands() {
		    	$(".icp_displayAddComment").hide();
				$("#icp_addCommentPlus_icon").attr("class", "icon-plus-sign");
				//TODO why is this variable global
				icp_showAddComment = false;
				$(".cre_displayAddComment").hide();
				$("#cre_addCommentPlus_icon").attr("class", "icon-plus-sign");
				cre_showAddComment = false;
		    	productDetailObject.checkSessionHeartBeat();
		    	var rcscope = erm.scopes.rights();
		    	var inclusionExclusionCheckFailed = false;
		    	var inclusionExclusionCheckFailedError = "";   
		    	var permissionCheckFailed = false;
		    	var permissionError = "";    	
		    	var modifyRightStrandsObj = {
		        		'rightStrandIds' : gridStrandsConfigurator.getSelectedIds(),
		        	    'rightStrandMap' : gridStrandsConfigurator.getSelectedMap(),
		        	    'rightStrandRestrictionIds' : gridStrandsConfigurator.getSelectedStrandRestrictionIds(),
		        	    'rightStrandRestrictionMap' : gridStrandsConfigurator.getSelectedStrandRestrictionMap(),
		        };    	
		    	if (modifyRightStrandsObj.rightStrandIds.length <= 0 && modifyRightStrandsObj.rightStrandRestrictionIds.length > 0) {
		    		for (var mappedStrandRestriction in modifyRightStrandsObj.rightStrandRestrictionMap){
		        		var canUpdate = false;
		        		if (modifyRightStrandsObj.rightStrandRestrictionMap[mappedStrandRestriction].isBusiness && rcscope.security.canUpdateBusinessStrands) {
		        			canUpdate=true;
		        		}
		        		if (modifyRightStrandsObj.rightStrandRestrictionMap[mappedStrandRestriction].isLegal && rcscope.security.canUpdateLegalStrands) {
		        			canUpdate=true;
		        		}
		        		
		        		if (!canUpdate&&modifyRightStrandsObj.rightStrandRestrictionMap[mappedStrandRestriction].isBusiness && !rcscope.security.canUpdateBusinessStrands) {    			
		        			permissionCheckFailed = true;
		        			permissionError = "Sorry, but you do not have permission to modify business rights strand restrictions: " + modifyRightStrandsObj.rightStrandRestrictionMap[mappedStrandRestriction].description;
		        			break;
		        		}    		    		
		        		if (!canUpdate&&modifyRightStrandsObj.rightStrandRestrictionMap[mappedStrandRestriction].isLegal && !rcscope.security.canUpdateLegalStrands) {    			
		        			permissionCheckFailed = true;
		        			permissionError = "Sorry, but you do not have permission to modify legal rights strand restrictions: " + modifyRightStrandsObj.rightStrandRestrictionMap[mappedStrandRestriction].description;
		        			break;
		        		}   
		        	}
		        	if(permissionCheckFailed){
		        		errorPopup.showErrorPopupWindow(permissionError);
		        	}
		        	else {
		        		//We open the restriction popup edit window
		        		rightStrandUpdateObject.openInfoCodePopupWindowStandAlone(gridStrandsConfigurator.getSelectedStrandRestrictionElements());
		        	}
		       	  return;
		       	}
		    	if (modifyRightStrandsObj.rightStrandIds.length <= 0) {
		        	  errorPopup.showErrorPopupWindow("No right strands were checked for modifying.");
		       	  return;
		       	}    
		    	
		    	// permissions check
		    	var isExclusion = null;
		    	for (var mappedStrand in modifyRightStrandsObj.rightStrandMap) {
		    		if (isExclusion == null)
		    			isExclusion = modifyRightStrandsObj.rightStrandMap[mappedStrand].isExclusion;
		    		else {
		    			if (modifyRightStrandsObj.rightStrandMap[mappedStrand].isExclusion != isExclusion) {
		    				inclusionExclusionCheckFailed = true;
		    				inclusionExclusionCheckFailedError = "Sorry, but you cannot modify multiple rights strands that are exlusions and inclusions. ";
		    				break;
		    			}    		
		    		}
		    		var canUpdate = false;
		    		if (modifyRightStrandsObj.rightStrandMap[mappedStrand].isBusiness && rcscope.security.canUpdateBusinessStrands) {
		    			canUpdate=true;
		    		}
		    		if (modifyRightStrandsObj.rightStrandMap[mappedStrand].isLegal && rcscope.security.canUpdateLegalStrands) {
		    			canUpdate=true;
		    		}
		    		
		    		if (!canUpdate&&modifyRightStrandsObj.rightStrandMap[mappedStrand].isBusiness && !rcscope.security.canUpdateBusinessStrands) {    			
		    			permissionCheckFailed = true;
		    			permissionError = "Sorry, but you do not have permission to modify business rights strand: " + modifyRightStrandsObj.rightStrandMap[mappedStrand].description;
		    			break;
		    		}    		    		
		    		if (!canUpdate&&modifyRightStrandsObj.rightStrandMap[mappedStrand].isLegal && !rcscope.security.canUpdateLegalStrands) {    			
		    			permissionCheckFailed = true;
		    			permissionError = "Sorry, but you do not have permission to modify legal rights strand: " + modifyRightStrandsObj.rightStrandMap[mappedStrand].description;
		    			break;
		    		}    		    		
		    	}    
		    	if (!permissionCheckFailed) {
			    	for (var mappedStrand in modifyRightStrandsObj.rightStrandRestrictionMap) {	    		
			    		if (modifyRightStrandsObj.rightStrandRestrictionMap[mappedStrand].isBusiness && !modifyRightStrandsObj.rightStrandRestrictionMap[mappedStrand].isLegal && !rcscope.security.canUpdateBusinessStrands) {	    			
			    			permissionCheckFailed = true;
			    			permissionError = "Sorry, but you do not have permission to modify business informational code: " + modifyRightStrandsObj.rightStrandRestrictionMap[mappedStrand].description;
			    			break;
			    		}    		
			    		if (modifyRightStrandsObj.rightStrandRestrictionMap[mappedStrand].isLegal && !modifyRightStrandsObj.rightStrandRestrictionMap[mappedStrand].isBusiness && !rcscope.security.canUpdateLegalStrands) {	    			
			    			permissionCheckFailed = true;
			    			permissionError = "Sorry, but you do not have permission to modify legal informational code: " + modifyRightStrandsObj.rightStrandRestrictionMap[mappedStrand].description;
			    			break;
			    		}
			    	}    
		    	}    
		    	if (permissionCheckFailed)
		            errorPopup.showErrorPopupWindow(permissionError);
		    	else if (inclusionExclusionCheckFailed)
		    		errorPopup.showErrorPopupWindow(inclusionExclusionCheckFailedError);
		      	else {      		
		      		rightStrandUpdateObject.openRightStrandEditWindow(gridStrandsConfigurator.getSelectedElements());
		      	}
				
			},
			
			deleteRightStrands: function deleteRightStrands() {
		    	var rcscope = erm.scopes.rights();
		    	var permissionCheckFailed = false;
		    	var permissionError = "";
		    	var deleteRightStrandsObj = {
		    	  'rightStrandIds' : gridStrandsConfigurator.getSelectedIds(),
		    	  'rightStrandMap' : gridStrandsConfigurator.getSelectedMap(),
		    	  'rightStrandRestrictionIds' : gridStrandsConfigurator.getSelectedStrandRestrictionIds(),
		    	  'rightStrandRestrictionMap' : gridStrandsConfigurator.getSelectedStrandRestrictionMap(),
		    	};    
		    	for (var mappedStrand in deleteRightStrandsObj.rightStrandMap) {    		
		    		if (deleteRightStrandsObj.rightStrandMap[mappedStrand].isBusiness &&
		    			!deleteRightStrandsObj.rightStrandMap[mappedStrand].isLegal &&
		    			!rcscope.security.canDeleteBusinessStrands) {    			
		    			permissionCheckFailed = true;
		    			permissionError = "Sorry, but you do not have permission to delete business rights strand: " + deleteRightStrandsObj.rightStrandMap[mappedStrand].description;
		    			break;
		    		}    		    		
		    		if (deleteRightStrandsObj.rightStrandMap[mappedStrand].isLegal &&
		    			!deleteRightStrandsObj.rightStrandMap[mappedStrand].isBusiness &&    				
		    			!rcscope.security.canDeleteLegalStrands) {    			
		    			permissionCheckFailed = true;
		    			permissionError = "Sorry, but you do not have permission to delete legal rights strand: " + deleteRightStrandsObj.rightStrandMap[mappedStrand].description;
		    			break;
		    		}
		    		
		    		if (deleteRightStrandsObj.rightStrandMap[mappedStrand].isLegal &&
		        		deleteRightStrandsObj.rightStrandMap[mappedStrand].isBusiness &&
		        		(!rcscope.security.canDeleteBusinessStrands&&!rcscope.security.canDeleteLegalStrands)) {
		    			//shared strand
		    			permissionCheckFailed = true;
		    			permissionError = "Sorry, but you do not have permission to delete rights strand: " + deleteRightStrandsObj.rightStrandMap[mappedStrand].description;
		    			break;    			
		    		}    				
		    		
		    		
		    		
		    	}    
		    	if (!permissionCheckFailed) {
			    	for (var mappedStrand in deleteRightStrandsObj.rightStrandRestrictionMap) {	    		
			    		if (deleteRightStrandsObj.rightStrandRestrictionMap[mappedStrand].isBusiness &&
			    			!deleteRightStrandsObj.rightStrandRestrictionMap[mappedStrand].isLegal &&
			    			!rcscope.security.canDeleteBusinessStrands) {	    			
			    			permissionCheckFailed = true;
			    			permissionError = "Sorry, but you do not have permission to delete business informational code: " + deleteRightStrandsObj.rightStrandRestrictionMap[mappedStrand].description;
			    			break;
			    		}    		
			    		if (deleteRightStrandsObj.rightStrandRestrictionMap[mappedStrand].isLegal &&
			    			!deleteRightStrandsObj.rightStrandRestrictionMap[mappedStrand].isBusiness &&
			    			!rcscope.security.canDeleteLegalStrands) {	    			
			    			permissionCheckFailed = true;
			    			permissionError = "Sorry, but you do not have permission to delete legal informational code: " + deleteRightStrandsObj.rightStrandRestrictionMap[mappedStrand].description;
			    			break;
			    		}
			    		if (deleteRightStrandsObj.rightStrandRestrictionMap[mappedStrand].isLegal &&
			    			deleteRightStrandsObj.rightStrandRestrictionMap[mappedStrand].isBusiness &&
			    		    (!rcscope.security.canDeleteBusinessStrands&&!rcscope.security.canDeleteLegalStrands)) {
			    				//shared restriction
				    			permissionCheckFailed = true;
				    			permissionError = "Sorry, but you do not have permission to delete informational code: " + deleteRightStrandsObj.rightStrandRestrictionMap[mappedStrand].description;
				    			break;
				    		}
			    		
			    		
			    	}    
		    	}    	
		    	if (permissionCheckFailed)
		    	  errorPopup.showErrorPopupWindow(permissionError);
		    	else 
		    	kendoElementInit.rightStrandObject.confirmDelOfStrandsOrRestriction(deleteRightStrandsObj, gridStrandsConfigurator.isSelectedStrandsPartOfStrandSet());        					
			},
			copyRightStrands: function copyRightsStrands() {
		    	productDetailObject.checkSessionHeartBeat();
		    	var rcscope = erm.scopes.rights();
		    	var permissionCheckFailed = false;
		    	var permissionError = "";
		    	var mappedStrand = null;
//		    	var isAllTerritoryInactive = false;
		    	var copyRightStrandsObj = {
		    		'rightStrandIds' : gridStrandsConfigurator.getSelectedIds(),
		    	    'rightStrandMap' : gridStrandsConfigurator.getSelectedMap(),
		    	    'rightStrandRestrictionIds' : gridStrandsConfigurator.getSelectedStrandRestrictionIds(),
		    	    'rightStrandRestrictionMap' : gridStrandsConfigurator.getSelectedStrandRestrictionMap(),
		    	};
		    	
		    	var allTerritoryActive = function allTerritoryActive(rightStrandMap){
		    		var active = 0;
		    		if(rightStrandMap){    			
		    			for(var mappedStrand in rightStrandMap){
		    				if(rightStrandMap[mappedStrand].strand.territory.activeFlag == 'Y'){
		    					active = active | 2;    					
		    				}
		    				if(rightStrandMap[mappedStrand].strand.territory.activeFlag == 'N'){
		    					active = active | 1;
		    				}
		    			}
		    		}
		    		return active;
		    	};
		    	
		    	var allTerritorySame = function allTerritorySame(rightStrandMap){
		    		var terre = null;
		    		var allSame = true;
		    		if(rightStrandMap){
		    			for(var mappedStrand in rightStrandMap){
		    				console.log(" MAPPED STRAND : %o", mappedStrand);
		    				if(terre == null){
		    					terre = rightStrandMap[mappedStrand].strand.id;
		    				}
		    				else if(terre != rightStrandMap[mappedStrand].strand.id){
		    					allSame = false;
		    					break;
		    				}
		    			}
		    		}
		    		return allSame;
		    	};
		    	
		    	var isInactiveMedia = function isInactiveMedia(strand) {
		    		if (!strand) return false;
		    		if (!strand.media) return false;
		    		var media = strand.media;
		    		return media.activeFlag==='N';    		
		    	};
		    	
		    	if (copyRightStrandsObj.rightStrandIds.length <= 0 && copyRightStrandsObj.rightStrandRestrictionIds.length <= 0) {
		          errorPopup.showErrorPopupWindow("No right strands or informational codes were checked for copying.");
		       	  return;
		       	}
		    	for (mappedStrand in copyRightStrandsObj.rightStrandMap) {    		
		    		if (copyRightStrandsObj.rightStrandMap[mappedStrand].isBusiness && !rcscope.security.canCopyBusinessStrands) {    			
		    			permissionCheckFailed = true;
		    			permissionError = "Sorry, but you do not have permission to copy business rights strand: " + copyRightStrandsObj.rightStrandMap[mappedStrand].description;
		    			break;
		    		}    		    		
		    		if (copyRightStrandsObj.rightStrandMap[mappedStrand].isLegal && !rcscope.security.canCopyLegalStrands) {    			
		    			permissionCheckFailed = true;
		    			permissionError = "Sorry, but you do not have permission to copy legal rights strand: " + copyRightStrandsObj.rightStrandMap[mappedStrand].description;
		    			break;
		    		}
		    	}    
		    	if (!permissionCheckFailed) {
			    	for (mappedStrand in copyRightStrandsObj.rightStrandRestrictionMap) {	    		
			    		if (copyRightStrandsObj.rightStrandRestrictionMap[mappedStrand].isBusiness && !rcscope.security.canCopyBusinessStrands) {	    			
			    			permissionCheckFailed = true;
			    			permissionError = "Sorry, but you do not have permission to copy business informational code: " + copyRightStrandsObj.rightStrandRestrictionMap[mappedStrand].description;
			    			break;
			    		}    		
			    		if (copyRightStrandsObj.rightStrandRestrictionMap[mappedStrand].isLegal && !rcscope.security.canCopyLegalStrands) {	    			
			    			permissionCheckFailed = true;
			    			permissionError = "Sorry, but you do not have permission to copy legal informational code: " + copyRightStrandsObj.rightStrandRestrictionMap[mappedStrand].description;
			    			break;
			    		}
			    	}    
		    	} 
		    	//check for inactive media

		    	if (!permissionCheckFailed) {
		        	for (mappedStrand in copyRightStrandsObj.rightStrandMap) {
		        		var strand = copyRightStrandsObj.rightStrandMap[mappedStrand].strand;
		        		if (copyRightStrandsObj.rightStrandMap[mappedStrand].isBusiness &&  !rcscope.security.canUpdateBusinessStrands && isInactiveMedia(strand) ) {
		        			permissionCheckFailed = true;
		        			permissionError = "Sorry, but you cannot copy strands with inactive media";
		        			break;
		        		}
						if(copyRightStrandsObj.rightStrandMap[mappedStrand].isLegal && !rcscope.security.canUpdateLegalStrands && isInactiveMedia(strand)){
							permissionCheckFailed = true;
		        			permissionError = "Sorry, but you cannot copy strands with inactive media";
							break;
						}
		        		
		        	}        		
		    	}
		    	
		    	//end inactive media check
		    	
		    	//Check for strands with inactive territories conversion
		    	if(!permissionCheckFailed){
		    		var ts = allTerritorySame(copyRightStrandsObj.rightStrandMap);
		    		var active = allTerritoryActive(copyRightStrandsObj.rightStrandMap);
		    		if(((active & 2) == 2) && ((active & 1) == 1)){
		    			permissionCheckFailed = true;
		    			permissionError = " Sorry, you cannot copy a group of strands composed of active and inactive territories"; //where some strands have inactive territories, while other strands have active territories ";
		    		}
		    		else if(((active & 2) == 0)  && ((active & 1) == 1) && ts && !permissionCheckFailed){
		    			
		    			//We check to make the user has the right to convert the strands, since a business user cannot convert legal strands
		    			//And vice versa    			
						for(var mappedStrand in copyRightStrandsObj.rightStrandMap){
							if(copyRightStrandsObj.rightStrandMap[mappedStrand].isBusiness && !rcscope.security.canUpdateBusinessStrands){
								permissionCheckFailed = true;
								permissionError = " Sorry, but you do not have the right to convert business strands with inactive territory.";
								break;
			    			}
							if(copyRightStrandsObj.rightStrandMap[mappedStrand].isLegal && !rcscope.security.canUpdateLegalStrands){
								permissionCheckFailed = true;
								permissionError = " Sorry, but you do not have the right to convert legal strands with inactive territory.";
								break;
							}
		    			}
		    			    			
		    			/*
		    			if(!permissionCheckFailed){
		    				isAllTerritoryInactive = true;
		    			}
		    			*/
		    		}   		
		    	}
		    	
		    	if (permissionCheckFailed)
		    	  errorPopup.showErrorPopupWindow(permissionError);
		    	else{
		    		//console.log(" RIGHT STRAND OBJECT : %o", rightStrandCopyWindow);
		    		copyRightStrandObject.showRightStrandCopyWindow(gridStrandsConfigurator.getSelectedElements());	
		    	}
				
			},
			
			copyProductInfoCodes: function copyProductInfoCodes() {
		    	var rcscope = erm.scopes.rights();
		    	var permissionCheckFailed = false;
		    	var permissionError = "";
		    	var copyProductInfoCodesObj = {
		    	  'productInfoCodeIds' : productRestrictionsGridConfigurator.getSelectedIds(),
		    	  'productInfoCodeMap' : productRestrictionsGridConfigurator.getSelectedMap()    	  
		    	};
		    	if (copyProductInfoCodesObj.productInfoCodeIds.length <= 0) {
		          errorPopup.showErrorPopupWindow("No product info codes were checked for copying.");
		          return;
		        }
		    	for (var mappedStrand in copyProductInfoCodesObj.productInfoCodeMap) {    		
		    		if (copyProductInfoCodesObj.productInfoCodeMap[mappedStrand].isBusiness && !rcscope.security.canCopyBusinessProductRestrictions) {    			
		    			permissionCheckFailed = true;
		    			permissionError = "Sorry, but you do not have permission to copy business product code: " + copyProductInfoCodesObj.productInfoCodeMap[mappedStrand].description;
		    			break;
		    		}    		    		
		    		if (copyProductInfoCodesObj.productInfoCodeMap[mappedStrand].isLegal && !rcscope.security.canCopyLegalProductRestrictions) {
		    			console.log("Can not copy legal strand: " + copyProductInfoCodesObj.productInfoCodeMap[mappedStrand].description);
		    			permissionCheckFailed = true;
		    			permissionError = "Sorry, but you do not have permission to copy legal product code: " + copyProductInfoCodesObj.productInfoCodeMap[mappedStrand].description;
		    			break;
		    		}
		    	}        	    	    
		    	if (permissionCheckFailed)
		      	  errorPopup.showErrorPopupWindow(permissionError);
		    	else //TODO implement actualy copy process
		          errorPopup.showErrorPopupWindow("Permissions Check Passed: You would be able to copy");				
			},
			deleteProductInfoCodes: function deleteProductInfoCodes() {
		    	var rcscope = erm.scopes.rights();
		    	var permissionCheckFailed = false;
		    	var permissionError = "";
		    	var deleteProductInfoCodesObj = {
		    	  'productInfoCodeIds' : productRestrictionsGridConfigurator.getSelectedIds(),
		    	  'productInfoCodeMap' : productRestrictionsGridConfigurator.getSelectedMap()    	  
		    	};    	    	    	
		    	for (var mappedStrand in deleteProductInfoCodesObj.productInfoCodeMap) {    		
		    		if (deleteProductInfoCodesObj.productInfoCodeMap[mappedStrand].isBusiness &&
		    			!deleteProductInfoCodesObj.productInfoCodeMap[mappedStrand].isLegal &&
		    			!rcscope.security.canDeleteBusinessProductRestrictions) {    			
		    			permissionCheckFailed = true;
		    			permissionError = "Sorry, but you do not have permission to delete business product code: " + deleteProductInfoCodesObj.productInfoCodeMap[mappedStrand].description;
		    			break;
		    		}    		    		
		    		if (deleteProductInfoCodesObj.productInfoCodeMap[mappedStrand].isLegal &&
		    			!deleteProductInfoCodesObj.productInfoCodeMap[mappedStrand].isBusiness &&
		    			!rcscope.security.canDeleteLegalProductRestrictions) {    			
		    			permissionCheckFailed = true;
		    			permissionError = "Sorry, but you do not have permission to delete legal product code: " + deleteProductInfoCodesObj.productInfoCodeMap[mappedStrand].description;
		    			break;
		    		}
		    		if (deleteProductInfoCodesObj.productInfoCodeMap[mappedStrand].isLegal &&
		       			deleteProductInfoCodesObj.productInfoCodeMap[mappedStrand].isBusiness &&
		       			(!rcscope.security.canDeleteBusinessStrands&&!rcscope.security.canDeleteLegalStrands)) {    			
		    				permissionCheckFailed = true;
		        			permissionError = "Sorry, but you do not have permission to delete product code: " + deleteProductInfoCodesObj.productInfoCodeMap[mappedStrand].description;
		        			break;
		        		}
		    		
		    	}     	
		    	if (permissionCheckFailed)
		          errorPopup.showErrorPopupWindow(permissionError);
		    	else 
		    	  kendoElementInit.rightStrandObject.confirmDelOfProductInfoCodes(deleteProductInfoCodesObj);  
			},
			adoptRigthStrands: function adoptRightStrands() {
		    	var mappedStrand = null;
		    	var rcscope = erm.scopes.rights();
		    	var permissionCheckFailed = false;
		    	var permissionError = "";
		    	var media = null;
		    	var territory=null;
		    	var adoptRightStrandObj = {
		    	  'rightStrandIds' : gridStrandsConfigurator.getSelectedIds(),
		    	  'rightStrandMap' : gridStrandsConfigurator.getSelectedMap()    	  
		    	};
		    	for (mappedStrand in adoptRightStrandObj.rightStrandMap) {    		
		    		if (adoptRightStrandObj.rightStrandMap[mappedStrand].isBusiness && !rcscope.security.canAdoptBusinessRightStrand) {    			
		    			permissionCheckFailed = true;
		    			permissionError = "Sorry, but you do not have permission to adopt business right strand: " + adoptRightStrandObj.rightStrandMap[mappedStrand].description;
		    			break;
		    		}    		    		
		    		if (adoptRightStrandObj.rightStrandMap[mappedStrand].isLegal && !rcscope.security.canAdoptLegalRightStrand) {    			
		    			permissionCheckFailed = true;
		    			permissionError = "Sorry, but you do not have permission to adopt legal right strand: " + adoptRightStrandObj.rightStrandMap[mappedStrand].description;
		    			break;
		    		}
		    	}
		    	var strand = null;
		    	var data = null;
		    	var restrictionElements = null;
		    	var rightStrandIds = null;
		    	//now validate if the strand has inactive media or territory
		    	for (mappedStrand in adoptRightStrandObj.rightStrandMap) {
		    		strand = adoptRightStrandObj.rightStrandMap[mappedStrand].strand;
		    		media = strand.media;
		    		territory = strand.territory;
		    		if (media.activeFlag!=='Y') {
		    			permissionCheckFailed = true;
		    			permissionError = "You cannot adopt a strand with inactive media: " + media.name;
		    			break;
		    		}
		    		if (territory.activeFlag!=='Y') {
		    			permissionCheckFailed = true;
		    			permissionError = "You cannot adopt a strand with inactive territory: " + territory.name;    			
		    			break;
		    		}
		    	}
		    	
		    	if(permissionCheckFailed){
		    		errorPopup.showErrorPopupWindow(permissionError);
		    	}
		    	else {
		    		data = gridStrandsConfigurator.getSelectedElements();
		        	restrictionElements = gridStrandsConfigurator.getSelectedStrandRestrictionElements();
		        	if(data.length > 0 || restrictionElements.length > 0){
		        		var ids = new Array();
		            	if(restrictionElements){
		            		$.each(restrictionElements, function(index, element){
		                		ids.push(element.rightStrandId);
		                	});
		            	}    	
		            	rightStrandIds = gridStrandsConfigurator.getIsStrandSelectedMap(ids);
		            	
		            	if(!rightStrandUpdateObject.validateAdoptRightStrand(data) || !rightStrandUpdateObject.validateAdoptRestrictions(restrictionElements, rightStrandIds)){  
		            		rightStrandUpdateObject.processAdoptRightStrand(data, restrictionElements);
		            	}
		        	}
		        	else {
		        		errorPopup.showErrorPopupWindow("You must first select some right strand and/or info codes before you can adopt ");
		        	}
		    	}
				
			},
			adoptProductInfoCodes: function adoptProductInfoCodes() {
				var data = null;
		    	data = productRestrictionsGridConfigurator.getSelectedElements();
		    	if(!rightStrandUpdateObject.validateAdoptProductRestrictions(data)){
		    		rightStrandUpdateObject.processAdoptProductInfoCodes(data);
		    		
		    		//TMA -- Updates Product Restrictions in the General Section
		    		productRestrictionsGridConfigurator.updateProductRestrictions(foxVersionId);
		    	}				
			},
			setUp: function setUp() {
			    $("#modifyRightStrandsButton").unbind();
			    //MLC-cr TMA 5/28/14
			    $("#modifyRightStrandsButton").on('click', modifyRightsStrandsButton);
			    function modifyRightsStrandsButton(e){
			    	strandActions.modifyRightStrands();
			    };
			    
			    $("#delete-right-strands").unbind();	
			    //MLC-cr TMA 5/28/14
			    $("#delete-right-strands").on('click', deleteRightStrandsClick);
			    function deleteRightStrandsClick(e){
			    	strandActions.deleteRightStrands();
			    };
			    
			    $("#copy-right-strands").unbind();
			    //MLC-cr TMA 5/28/14
			    $("#copy-right-strands").on('click', copyRightStrandsClick);
			    function copyRightStrandsClick(e){
			    	strandActions.copyRightStrands();
			    };
			    
			    $("#copy-product-info").unbind();	
			    //MLC-cr TMA 5/28/14
			    $("#copy-product-info").on('click', copyProductInfoCodesClick);
			    function copyProductInfoCodesClick(e){
			    	strandActions.copyProductInfoCodes();
			    };		
			    
			    $("#delete-product-info-codes").unbind();	
			    //MLC-cr TMA 5/28/14
			    $("#delete-product-info-codes").on('click', deleteProductInfoCodesClick);
			    function deleteProductInfoCodesClick(e){
			    	strandActions.deleteProductInfoCodes();
			    };
			    
			    $("#adopt-right-strands").unbind();
			    //MLC-cr TMA 5/28/14
			    $("#adopt-right-strands").on('click', adoptRightStrandsClick);
			    function adoptRightStrandsClick(e){
			    	strandActions.adoptRigthStrands();
			    };
			    
			    $("#adopt-product-info-codes").unbind();	
			    //MLC-cr TMA 5/28/14
			    $("#adopt-product-info-codes").on('click', adoptProductInfoCodesClick);
			    function adoptProductInfoCodesClick(e){
			    	strandActions.adoptProductInfoCodes();
			    };	

			    //setup confirmation status
			    $("#delete-right-strands-confirm").unbind();	
			    //MLC-cr TMA 5/28/14
			    //var deleteRightStrandsConfirmButton = $("#delete-right-strands-confirm").click(deleteRightStrandsConfirmButtonClick);
			    $("#delete-right-strands-confirm").on('click', deleteRightStrandsConfirmButtonClick);
			    function deleteRightStrandsConfirmButtonClick(){    	
			    	kendoElementInit.rightStrandObject.removeRightStrandRestrictions();    	
			    };
			    
			    $("#do-not-license-confirm").unbind();	
			    //MLC-cr TMA 5/28/14
			    //var updateDoNotLicenseConfirmButton = $("#do-not-license-confirm").click(updateDoNotLicenseConfirmButtonClick);
			    $("#do-not-license-confirm").on('click', updateDoNotLicenseConfirmButtonClick);
			    function updateDoNotLicenseConfirmButtonClick(){    	
			    	kendoElementInit.rightStrandObject.updateDoNotLicense();    	
			    };    
			    
			    $("#cancel-do-not-license").unbind();
			    //MLC-cr TMA 5/28/14
			    //var cancelDoNotLicense = $("#cancel-do-not-license").click(cancelDoNotLicenseClick);
			    $("#cancel-do-not-license").on('click', cancelDoNotLicenseClick);
			    function cancelDoNotLicenseClick(){    	
			    	kendoElementInit.rightStrandObject.cancelDoNotLicenseConfirmationWindow();    	
			    };    
			    
			    $("#delete-product-info-restriction-confirm").unbind();
			    //MLC-cr TMA 5/28/14
			    //var deleteProductInfoRestrictionConfirmButton = $("#delete-product-info-restriction-confirm").click(deleteProductInfoRestrictionConfirmButtonClick);
			    $("#delete-product-info-restriction-confirm").on('click', deleteProductInfoRestrictionConfirmButtonClick);
			    function deleteProductInfoRestrictionConfirmButtonClick(){    	
			    	kendoElementInit.rightStrandObject.removeProductInfoCodes();    	
			    };        
			    
			    $("#cancel-right-strands-delete").unbind();
			    //MLC-cr TMA 5/28/14
			    //var cancelRightStrandsDeleteButton = $("#cancel-right-strands-delete").click(cancelRightStrandsDeleteButtonClick);
			    $("#cancel-right-strands-delete").on('click', cancelRightStrandsDeleteButtonClick);
			    function cancelRightStrandsDeleteButtonClick(){        	    	
			    	kendoElementInit.rightStrandObject.cancelRemoveRightStrandRestrictions();    	    	
			    	$("#delete-attachment-confirm").removeClass("forceShow");
			    	$("#delete-contractualparty-confirm").removeClass("forceShow");
			    	$("#delete-clearance-memo-confirm").removeClass("forceShow");
			    };
			    
			    
			}
			
	};
	    
