  //////////////////////////////////////////////////////
  // ---------------- product restrictions grid
  var productRestrictionsGridConfigurator = {
  editMode:true,
  setEditMode:function(edit) {
	this.editMode=edit;  
  },		  
  
  
	selectByIds: function selectByIds(restrictionIds) {
		var ds=this.ds;    
	    var allData = ds.data().toJSON();
		$.each(allData, function(idx, elem) {
			var restrictionId = elem.productRestrictionId;
			if (restrictionIds.indexOf(restrictionId)>=0) {
				elem.selected = true;
			} else {
				elem.selected = false;
			} 
		});
		ds.data(allData);	    		
	},  
  getIdsWithComments: function getIdsWithComments() {
		var ds=this.ds;    
	    var data = ds.data();
	    var ids = strands.getProductRestrictionIdsWithPredicate(data,strands.getRestrictionHasCommentPredicate);
	    return ids;
  },
  
  showSelectedInNewGrid: function(divId) {
	var selectedElements = this.getSelectedElements();
	strands.showProductRestrictionsGrid(selectedElements, divId);
  },
		  
  selectRestrictionsInGrid : function(ids) {
  	//console.log("Selecting product restrictions strands in grid %o",ids);
    var grid = $("#product-restrictions-grid").data("kendoGrid");
    strands.selectGridElements(grid,ids,function(elem){
      return elem.productRestrictionId; 
    });
  },
  getProductRestrictionsByIds: function getProductRestrictionsByIds(ids) {
	  var ds=this.ds;
	  var data = ds.data();
	  return strands.getProductRestrictionsById(data,ids);	  
  },

  getSelectedProductRestrictionsByIds: function getSelectedProductRestrictionsByIds(){
	  return this.getProductRestrictionsByIds(strands.selections.getSelectedProductRestrictionIds());
//		var ds=this.ds;    
//	    var data = ds.data();
//	    var selected = strands.getProductRestrictionsById(data, strands.selections.getSelectedProductRestrictionIds());
//	    return selected;
  },
 
  
  setSavedElements: function(savedIds)  {
	  var message = "Saved " + savedIds.length + " product info code" + (savedIds.length > 1 ? "s" : "");
	  var messageDivId="restrictions-message";
	  strands.setMessage(message,messageDivId);
	  this.selectRestrictionsInGrid(savedIds);
	  savedIds = null;	  
  },
  
  setDeletedElements: function(deletedIdsTotal)  {
	  var message = "Deleted " + deletedIdsTotal + " product info code" + (eval(deletedIdsTotal) > 1 ? "s" : "");
	  var messageDivId="restrictions-message";
	  strands.setMessage(message,messageDivId);	  
  },		  
  
  setUpdatedElements: function(updatedIdsTotal)  {
	  var message = "Updated " + updatedIdsTotal + " product info code" + (eval(updatedIdsTotal) > 1 ? "s" : "");
	  var messageDivId="restrictions-message";
	  strands.setMessage(message,messageDivId);	  
  },
  
  unCheckProductRestrictions: function() {
	var ds=this.ds;    
	var data = ds.data();	      	     
	$.each(data,function(idx,elem){
	    elem.selected=false;
	});
	ds.data(data);
  },
  
  checkSelectedProductRestrictions: function(ids, checkedValue) {
	var ds=this.ds;    
    var data = ds.data();
    $.each(ids, function(index, value) {    	
	  strands.setSelectedProductRestriction(data, value, checkedValue);	  
    });
    //console.log("data %o", data);
    ds.data(data);
  },
    
  commentsInfoCodes: function(ids, hasComments) {
	var ds=this.ds;    
    var data = ds.data();
    $.each(ids, function(index, id) {    			  
	  $.each(data,function(idx,elem) {			
	    if (elem.productRestrictionId===id) {
	      elem.restriction.hasComments=hasComments;
	      //console.log("mapInfoCodes elem id %o %o %o", id, elem, hasComments);
	      return false;
	    }     		    
	  });		  
    });
    ds.data(data);
  },
  
  mapInfoCodes: function(ids, map) {
	var ds=this.ds;    
    var data = ds.data();
    $.each(ids, function(index, id) {    			  
	  $.each(data,function(idx,elem) {			
	    if (elem.productRestrictionId===id) {
	      elem.restriction.mappedToClearanceMemo=map;
	      //console.log("mapInfoCodes elem id %o %o %o", id, elem, map);
	      return false;
	    }     		    
	  });		  
    });
    ds.data(data);
  },
	 
  getSelectedElements: function() {
    var ds=this.ds;
    return this.getSelectedElementsFromDS(ds);
  },
  
  getSelectedElementsFromDS : function(ds) {
      var allData = ds.data().toJSON();
      var selectedElements = [];
      $.each(allData,function(idx,elem) {
          if (elem.selected) {
              selectedElements.push(elem);
          }
      });
      return selectedElements;   
  },
  
  getSelectedIds : function() {
	return this.getIds(this.getSelectedElements());
  },
  
  getIds: function(strands) {
    var ids = [];
    $.each(strands,function(idx,elem) {
      ids.push(elem.productRestrictionId);
    });
    return ids;
  },
  
  setNumberOfProductRestrictionsFromDS : function(ds) {    
    var rcscope = erm.scopes.rights();
    rcscope.currentProductArray.businessInfoCodesCount = 0;
    rcscope.currentProductArray.legalInfoCodesCount = 0;    
  	if (ds != null) {
      var allData = ds.data().toJSON();    	
  	  $.each(allData,function(idx,elem) {
		if (elem.legalInd)
			rcscope.currentProductArray.legalInfoCodesCount++; 
		if (elem.businessInd)
			rcscope.currentProductArray.businessInfoCodesCount++;
      });
  	  if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest')
		rcscope.$apply();
  	  rcscope.updateRightsIndicator(rcscope.currentProductArray.foxVersionId);
	}		    
  },
  
  getSelectedMap : function() {
	return this.getSelectedProductCodeMapFromElements(this.getSelectedElements());
  },
  
  getSelectedProductCodeMapFromElements: function(strands) {
	var selectedMap = Array();
	$.each(strands,function(idx,elem) {
	  var mappedElements = {
			  description : " - " + elem.restriction.description,
			  isBusiness : elem.business,
			  isLegal : elem.legal
	  };		  
	  selectedMap[elem.productRestrictionId] = mappedElements;   	  
	});
	return selectedMap;
  },

  /**
   * TMA: updates the PLIC in the General Section
   *	
	* TMA Bug Fixes: 
	* 	46009: Product level info code list in General tab is not refreshed after add, adopt and delete of product info codes (medium)
		46011: Only one product info code is displayed in the General tab regardless of how many a product has (Critical)
		46013: Deleted Product level info code is not removed from General tab even after refreshing title (high)
	*/
updateProductRestrictions : function (foxVersionId) {
	
       console.log("TMA debug in updateProductRestrictions: foxVersionId: ", foxVersionId);
      
       var getRestrictionUrl = function(foxVersionId) {
			  console.log("Getting url for  product restrictions  for " + foxVersionId);
			  return paths().getRightsRESTPath()+"/restrictions" + "/" +foxVersionId;	  
		};
		
		var url = getRestrictionUrl(foxVersionId);
		var rcscope = erm.scopes.rights();
			   
		$.get(url, function(data){
				
			rcscope.currentProductArray.ermProductRestrictionObject = null;
			rcscope.currentProductArray.ermProductRestrictionObject = new Array();
			
				 
			$.each(data,function(idx,elem){
				console.log("TMA debug: elem.iconType", elem.iconType);
				console.log("TMA debug: elem.restriction.description: ", elem.restriction.description);
				
				rcscope.currentProductArray.ermProductRestrictionObject.push(elem);
		
			 });	
		 }).fail(function(xhr,status,message){
				errorPopup.showErrorPopupWindow(xhr.responseText);
		 });
		
		 
		 if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest')
				rcscope.$apply();
  },
  
  setRestrictionsGrid : function(foxVersionId,savedIds)  {
	  var readOnly = !this.editMode;
	  var productRestrictionsSectionId = "#product-restrictions-grid-section";
	  var productRestrictionSpinnerId = "#product-restrictions-grid-spinner";
	  
	  var clearGrid = function() {
	    	var grid = $("#product-restrictions-grid").data("kendoGrid");
	    	if (grid) {
	    		grid.destroy();
	    	}		  
	    	$("#product-restrictions-grid").empty();
			$("#product-restrictions-grid").remove();
			
			//TMA remove and detach
			$("#product-restrictions-grid").detach();
			
			//$(productRestrictionsSectionId).append("<div id='product-restrictions-grid'></div>");	
			
			//console.log("TMA debug: product level info code restrictions grid cleared. Trying to show restrictions section");
			//var productRestrictionsSectionId = "#product-restrictions-grid-section";
			//$("#product-restrictions-grid-section").show();
			
			$(productRestrictionsSectionId).append("<div id='product-restrictions-grid'></div>");	
	  };
	  clearGrid();
	  
		var hideProductRestrictionsSection = function() {
			$(productRestrictionsSectionId).hide();
		};
		var showProductRestrictionsSection = function() {
			$(productRestrictionsSectionId).show();
		};
		var showSpinner = function() {
			$(productRestrictionSpinnerId).show();
		};
		var hideSpinner = function() {
			$(productRestrictionSpinnerId).hide();
		};
		var showInProgress = function() {
			console.log("Product restrictions loading...");
			showSpinner();
			hideProductRestrictionsSection();
		};
		var showCompleted = function() {
			console.log("Showing product restrictions....");
			hideSpinner();
			showProductRestrictionsSection();
		};
	
		showInProgress();
	  
	  
	  var  setUpMessage= function() {
		  $("#restrictions-message").hide();
		  $("#restrictions-message-alert-close-button").click(function() {
			  console.log(" CLOSE RESTRICTIONS MESSAGE ");
			  $("#restrictions-message").hide();
		  });
	  }; 
	  
	  setUpMessage();
  var getRestrictionUrl = function(foxVersionId) {
	  console.log("Getting url for  product restrictions  for " + foxVersionId);
	  return paths().getRightsRESTPath()+"/restrictions" + "/" +foxVersionId;	  
  };

  var url = getRestrictionUrl(foxVersionId);

  var setDates = strands.setDates;

  var parseRestrictions = function(data) {	  
      var res = [];                         
      strands.selections.clearProductRestrictionsSelection();
      if (data.length == 0) {
        var rcscope = erm.scopes.rights();
        //rcscope.productInfoCodesShow = false;
        //TMA BUG: 47344 -- they want this section to stay open even when the data.length == 0
        rcscope.productInfoCodesShow = true;
      }
      $.each(data,function(idx,elem){
    	var hasComments = !!elem.hasComments;
    	var hasMapping = !!elem.mappedToClearanceMemo;
		elem.restriction.hasComments= hasComments;    		
		elem.restriction.mappedToClearanceMemo = hasMapping;    		

    	
    	
        setDates(elem);
        res.push(elem);
      });

      return res;    
  };


  var ds = new kendo.data.DataSource({
                                            type: "json",
                                            transport: {
                                              read: url
                                            },
                                            pageSize: 500,
                                            schema:{
                                                        parse: parseRestrictions
                                                    },                                            
                });
  this.ds = ds;
  
// end ds
  
 
	
  var onDataBound = function() {
	  
    var selectAllCheckbox = $("#product-restriction-grid-select-all");
	showCompleted();
	if (savedIds) {
		console.log("product restrictions grid onDataBoud saved ids %o", savedIds);
		// if the saved elements was provided
		// show the message and select the elements
		productRestrictionsGridConfigurator.setSavedElements(savedIds);
		savedIds = null;
		
		//TMA -- Updates Product Restrictions in the General Section
		console.log("TMA debug: adding product restrictions");
		productRestrictionsGridConfigurator.updateProductRestrictions(foxVersionId);
	}
	
	
    selectAllCheckbox.unbind('click');
    selectAllCheckbox.on('click',function(event){      
        var dataSource = ds;
        var filter = dataSource.filter();
        var allData = dataSource.data();
        var selected = this.checked;
        console.log("selectAll clicked selected =" +selected);
        $.each(allData,function(idx,elem) {
          elem.selected=selected;
          if (selected)
	        strands.selections.selectProductRestriction(elem.productRestrictionId);
          else
        	strands.selections.unSelectProductRestriction(elem.productRestrictionId);
        });
        var checkboxes = $(".product-restriction-checkbox");
        $.each(checkboxes,function(idx,elem){
        	elem.checked=selected;        	
        });        
       	var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();				
    	if (ermSidePanelScope.isERMSidePanelOut)
          strands.toggleMapUnMapAndStrandComments();		
    });
    
    $(".product-restriction-checkbox").unbind();
    $(".product-restriction-checkbox").click(function(){
        var id = parseInt(this.name);
        var dataSource = ds;
        var selected = this.checked;
        strands.setSelectedProductRestriction(dataSource.data(),id,selected);
        var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();				
		if (ermSidePanelScope.isERMSidePanelOut)
    	  strands.toggleMapUnMapAndStrandComments();       
      });
        

    var clearSelection= $("#product-restriction-grid-clear-selection");
    clearSelection.unbind('click');
    clearSelection.on('click',function(e){
      e.preventDefault();      
      var dataSource = ds;
      var filter = dataSource.filter();
      var allData = dataSource.data();
      
      $(".product-restriction-checkbox").removeAttr('checked');
      $("#product-restriction-grid-select-all").removeAttr('checked');
      $.each(allData,function(idx,elem){
        elem.selected=false;
      });      
      strands.selections.clearProductRestrictionsSelection();
    });

    productRestrictionsGridConfigurator.setNumberOfProductRestrictionsFromDS(ds);    	 
  };



  $("#product-restrictions-grid").kendoGrid({

      dataSource: ds,
      groupable: true,
      sortable: true,
      filterable: false,
      resizable: true,
      selectable: "multiple, row",
      dataBound: onDataBound,
      pageable: {
      	numeric : false,
      	previousNext : false,
      	buttonCount : 0,
      	pageSizes : false
      },
      columns: strands.getProductRestrictionColumns(readOnly)
    });


  }

  };
// end product restriction grid configurator
