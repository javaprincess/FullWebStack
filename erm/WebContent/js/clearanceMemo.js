function clearanceMemo(){
/**
*
*/  
  this.path = paths();
  this.linkedMap = {};
  this.checkedStrandsAndCodesObj = {};  
  this.mappedRightStrands = {};
  this.mappedRightStrandRestrictions = {};
  this.mappedProductInfoCodes = {};
  this.isMapped = false;
  
  this.toggleMapUnmapButtons = function toggleMapUnmapButtons() {
	//IE is choking on this statement	
	var rcscope = angular.element(document.getElementById("rightsController")).scope();
    var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();
    //console.log("Inside clearanceMemo toggleMapUnmapButtons %o ", ermSidePanelScope.checkedStrandsAndCodesObj);
	//console.log("mappedTOCSelectedIDs: %o" + mappedTOCSelectedIDs);
    $("#ermSideClearanceShowMappedStrands").addClass("hideControls");
	if (mappedTOCSelectedIDs.length > 0 && rcscope.security.canMapCM) {	  
	  for (var i = 0; i < mappedTOCSelectedIDs.length; i ++) {		
	    if (clearanceMemoObject.mappedRightStrands[mappedTOCSelectedIDs[i]] || clearanceMemoObject.mappedRightStrandRestrictions[mappedTOCSelectedIDs[i]] || clearanceMemoObject.mappedProductInfoCodes[mappedTOCSelectedIDs[i]]) {
	      $("#ermSideClearanceShowMappedStrands").removeClass("hideControls");
	      break;
	    }
	  }	  
    }
	if (((ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandIds != null && ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandIds.length > 0) || 
					(ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandRestrictionIds != null && ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandRestrictionIds.length > 0) || 
					(ermSidePanelScope.checkedStrandsAndCodesObj.productInfoCodeIds != null && ermSidePanelScope.checkedStrandsAndCodesObj.productInfoCodeIds.length > 0))) {		
	  if (mappedTOCSelectedIDs.length > 0 && rcscope.security.canMapCM) {
	    $("#ermSideClearanceMap").removeClass("hideControls");
	    $("#ermSideClearanceUnmap").removeClass("hideControls");	    
	  }	  
	  $("#ermSideClearanceShowMapped").removeClass("hideControls");
   	} else {
   	  $("#ermSideClearanceMap").addClass("hideControls");
   	  $("#ermSideClearanceUnmap").addClass("hideControls");
   	  $("#ermSideClearanceShowMapped").addClass("hideControls");
	}
  };
	
  this.showClearanceMemoPopup = function showClearanceMemoPopup(){ 	 
    rcscope = angular.element(document.getElementById("rightsController")).scope();   
    //console.log("Inside Show Clearance Menu Pop");
    var w = $("#template_addEditClearanceMemo").data("kendoWindow");
    //console.log("Inside Show Clearance Menu Pop %o", w);
    if(w){
	  w.setOptions({
	    modal : true,
		width : "97%",
		height : 650	    
	  });	  	  
	  w.center();
	  w.open();
    }           
    this.setUpTreeButtons();
    clearEditor();
    $(".tocAttachments").removeClass("forceShow");
  };
  
  

  this.loadClearanceMemoComments = function loadClearanceMemoComments() {
	  var rcscope = angular.element(document.getElementById("rightsController")).scope();
	  var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();
	  ermSidePanelScope.clearanceMemoComments = [];
	  var url = this.path.getCommentsLoadCMCommentsRESTPath();	   
	  $.get(url + rcscope.foxVersionId, function(data){	   
		//ermSidePanelScope.clearanceMemoComments = data;
		ermSidePanelScope.clearanceMemoComments = new Array();
		for (var i = 0; i < data.length; i++) {
		  if (data[i].comment.publicInd == 1 || ((ermSidePanelScope.security.isBusiness && data[i].comment.business && ermSidePanelScope.security.canViewPrivateComments) || (!ermSidePanelScope.security.isBusiness && data[i].comment.legal && ermSidePanelScope.security.canViewPrivateComments))) {
			ermSidePanelScope.clearanceMemoComments.push(data[i]);
		  }
		}		
		if (ermSidePanelScope.$root.$$phase != '$apply' && ermSidePanelScope.$root.$$phase != '$digest')
		  ermSidePanelScope.$apply();					
		}).fail(function(xhr,status,message,rcscope){
		  // failed to save contractual parties 
		  console.log("failed to load clearance memo product comments");		   		    
		});
  };
      
  function populateCMVersionInfo(angularScope, w){
	var cPScope = angular.element(document.getElementById("contractualPartyController")).scope();
	if(angularScope){
	   if (w != null) w.title("Clearance Memo for " + angularScope.currentProductArray.realProductTitle);
	   $(".cmRealProductTitle").html(angularScope.currentProductArray.realProductTitle);
	   $(".cmPreviewRealProductTitle").html(angularScope.currentProductArray.realProductTitle);	  
	   $(".cmProductCode").html(angularScope.currentProductArray.productCode);
	   $(".cmOriginalMediaDesc").html(angularScope.currentProductArray.originalMediaDesc);
	   $(".cmProductTypeDesc").html(angularScope.currentProductArray.productTypeDesc);
	   if (angularScope.currentProductArray.firstReleaseDate != null && angularScope.currentProductArray.firstReleaseDate != "") {
	     var d = new Date(angularScope.currentProductArray.firstReleaseDate);
	     $(".cmFirstReleaseDate").html(d.getFullYear());	   	   
	   }
	   $(".cmProductionYear").html(angularScope.currentProductArray.productionYear);	   	   
	   $(".cmPreviewRealProductionYear").html(angularScope.currentProductArray.productionYear != null ? "(" + angularScope.currentProductArray.productionYear + ")" : "");	   
	   $(".cmFoxId").html(angularScope.currentProductArray.foxId);
	   $(".cmFoxVersionId").html(angularScope.currentProductArray.foxVersionId);
	   $(".cmFoxIdJDE").html(angularScope.currentProductArray.jdeId);	   
	   var foxProduced = "";
	   if (eval(angularScope.currentProductArray.foxProducedInd) == 1)
		 foxProduced = "Yes";
	   else if (eval(angularScope.currentProductArray.foxProducedInd) == 0)
		 foxProduced = "No";	      	   		 		  
	   $(".cmFoxProduced").html(foxProduced);
	   if (angularScope.currentProductVersionLocal.clearanceMemo != null && angularScope.currentProductVersionLocal.clearanceMemo.entityComment != null) {
	     $(".cmPreparedBy").html(angularScope.currentProductVersionLocal.clearanceMemo.entityComment.createName);
	     r = new restriction("", "", "", "", "", "");
	     $(".cmLastReviewed").html(r.getCustomDisplayDate(angularScope.currentProductVersionLocal.clearanceMemo.entityComment.updateDate));
	   }
	   
	   if (cPScope != null) {		   
		 var foxEntities = [];
		 var foxEntityValues = [];
		 var foxParties = [];
	     for (var i = 0; i < cPScope.savedContractualParties.length; i++) {
	       if (jQuery.inArray(cPScope.savedContractualParties[i].foxEntityPartyId, foxEntities) == -1) {	       
	         foxEntities.push(cPScope.savedContractualParties[i].foxEntityPartyId);	         
	       }
	       var contractDate = new Date(cPScope.savedContractualParties[i].contractDate);
	       if (cPScope.savedContractualParties[i].contractualPartyId != null) {
	  	     r = new restriction("", "", "", "", "", "");
	    	   foxParties.push(erm.dbvalues.contractualPartiesMap[cPScope.savedContractualParties[i].contractualPartyId] + " -- " + 
	    			   erm.dbvalues.contractualPartyTypesMap[cPScope.savedContractualParties[i].contractualPartyTypeId] + " -- " +
	    			   r.getCustomDisplayDate(contractDate) + " <BR/> ");
	       }
	     }	     
	     for (var i = 0; i < foxEntities.length; i++) {
	       var stringToPush = "";
	       if (foxEntityValues.length > 0)
	    	   stringToPush += (", ");	       
	       stringToPush += erm.dbvalues.foxEntitiesMap[foxEntities[i]];
	       foxEntityValues.push(stringToPush);
	     }
	     $(".cmFoxEntity").html(foxEntityValues);
	     $(".cmContractualParty").html(foxParties);
	   }
	   	   
	   if ($("#toc-item-status")[0].length <= 1) {
	     var tocItemStatusSelect= $("#toc-item-status");
	     tocItemStatusSelect.empty();
	     $("<option />", {value: "0", text: ""}).appendTo(tocItemStatusSelect);
	     for (var i = 0; i < angularScope.commentStatus.length; i++) {
  	       //console.log("commentStatus id: ", angularScope.commentStatus[i].commentStatusId, "commentStatus: %o", angularScope.commentStatus);
	       $("<option />", {value: angularScope.commentStatus[i].commentStatusId, text: angularScope.commentStatus[i].commentStatusDescription}).appendTo(tocItemStatusSelect);	     
	     }
	   }
	   if (!angularScope.security.canModifyClearanceMemos) {
	     $(".memoInfoToolbar").addClass("hideControls");
	     $(".clearanceMemoEditor").addClass("hideControls");
	     $(".clearanceMemoEditPreview").addClass("largerClearanceMemoEditPreview");	     
	   }
	   if (!angularScope.security.canViewClearanceReport) {
	     $(".clearanceViewSelector").addClass("hideControls");
	     //console.log("Hiding report view controls");
	   }	   
	   if (currentView == "M") {
	     $("#clearance-editview-radio-m").prop('checked', true);
	     $("#clearance-prevview-radio-m").prop('checked', true);
	   } else {
		 $("#clearance-editview-radio-r").prop('checked', true);
		 $("#clearance-prevview-radio-r").prop('checked', true);
	   }
	}	
  }
  
  function clearEditor() {
	var editor = $("#clearanceMemoEditor").data("kendoEditor");	  
  	var range = editor.createRange();
  	range.selectNodeContents(editor.body);
    editor.selectRange(range);
    editor.paste("");
  }
  
  function removeMemoPreviewIndicatorResponses() {
	$("#memo-preview-response").removeClass("displayInline");
	$("#memo-preview-spinner").removeClass("displayInline");
	$("#memo-preview-check").removeClass("displayInline");
	$("#memo-preview-spinner-message").removeClass("tocErrorClass");
	$("#memo-preview-response").removeClass("successClass");
	$("#memo-preview-response").removeClass("deletedClass");	
  }
  function startMemoPreviewIndicatorResponses() {
	removeMemoPreviewIndicatorResponses();
	$("#memo-preview-response").addClass("displayInline");
    $("#memo-preview-spinner").addClass("displayInline");    
  }
  
  function removeMemoTextIndicatorResponses() {
	$("#memo-text-response").removeClass("displayInline");
	$("#memo-text-spinner").removeClass("displayInline");
	$("#memo-text-check").removeClass("displayInline");
	$("#memo-text-spinner-message").removeClass("tocErrorClass");
	$("#memo-text-response").removeClass("successClass");
	$("#memo-text-response").removeClass("deletedClass");	
  }
  function startMemoTextIndicatorResponses() {
	removeMemoTextIndicatorResponses();
	$("#memo-text-response").addClass("displayInline");
    $("#memo-text-spinner").addClass("displayInline");    
  }
  
  function removeMemoTOCIndicatorResponses() {
	$("#memo-toc-response").removeClass("displayInline");
	$("#memo-toc-spinner").removeClass("displayInline");
	$("#memo-toc-check").removeClass("displayInline");
	$("#memo-toc-spinner-message").removeClass("tocErrorClass");
	$("#memo-toc-response").removeClass("successClass");
	$("#memo-toc-response").removeClass("deletedClass");	
  }
  function startMemoTOCIndicatorResponses() {
	removeMemoTOCIndicatorResponses();
	$("#memo-toc-response").addClass("displayInline");
    $("#memo-toc-spinner").addClass("displayInline");
  }
  
  function computeTOCLevelClass(previousPosition) {
	var splitTreePosition = previousPosition.toString().split("\.");
	if (splitTreePosition.length == 1)
	  return("header");
	if (splitTreePosition.length == 2)
	  return("subHeader");
	if (splitTreePosition.length == 3)
	  return("paragraph");
	else
	  return("subParagraph");
  }
  function computeTOCLevel(childSequence, level, previousPosition) {
	  if (level > 1)
	    return previousPosition + "." + childSequence;
	  else
		return childSequence;  
  }
  function outputPreviewTOC(node, previousPosition) {
	var stringBuilder = [];
	//console.log("Appending node: %o", node); 
	var rcscope = angular.element(document.getElementById("rightsController")).scope();
	var commentStatus = node.commentStatus > 0 && rcscope.commentStatus[eval(node.commentStatus - 1)] != null ? rcscope.commentStatus[eval(node.commentStatus - 1)].commentStatusDescription : "";
	previousPosition = computeTOCLevel(node.childSequence, node.level, previousPosition);
	stringBuilder.push("<div class=\"toc_");
	stringBuilder.push(node.id);	
	stringBuilder.push(" ");
	stringBuilder.push(computeTOCLevelClass(previousPosition));	
	if (!node.showPublic)
	  stringBuilder.push(" reportOnly hideControls");	
	stringBuilder.push("\">");	
	stringBuilder.push("<span class=\"tocPosition\">");
	stringBuilder.push(previousPosition);
	stringBuilder.push("</span>");
	stringBuilder.push("<span class=\"tocTitle\">");	
	stringBuilder.push(node.title);
	stringBuilder.push("</span>");
	stringBuilder.push("<span class=\"tocItemStatus\">");
	stringBuilder.push(commentStatus);
	stringBuilder.push("</span>");
	stringBuilder.push("</div>");
    $('.memoPreviewContentTOC').append(stringBuilder.join(""));
	//console.log("Appending id: %o", node.id, " title: %o", node.title);
	if (node.nodes != null)
	  for (var i = 0; i < node.nodes.length; i++)
		outputPreviewTOC(node.nodes[i], previousPosition);
  }
  function loadPreviewTOC(clearanceMemoTOC) {
    storedClearanceMemoTOC = clearanceMemoTOC;
    if (clearanceMemoTOC != null) {
      for (var i = 0; i <  clearanceMemoTOC.nodes.length; i++)
        outputPreviewTOC(clearanceMemoTOC.nodes[i], "");
    }
  }
  function populateCrossProductClearanceSelectArea(node, previousPosition, parentid) {
	var stringBuilder = [];
	console.log("node: %o", node);
    previousPosition = computeTOCLevel(node.childSequence, node.level, previousPosition);	  		    
    var splitTreePosition = previousPosition.toString().split("\.");
    stringBuilder.push(" ");
    if (splitTreePosition.length > 1)
      for (var i = 0; i < splitTreePosition.length; i++)    		
        stringBuilder.push(unescape("__".replace(/_/g, "%A0")));	
	stringBuilder.push(previousPosition);
	stringBuilder.push(" ");
    stringBuilder.push(node.title);         
    $(".crossProductClearanceTOCSelectArea").append($("<li style=\"display: block; clear: both;\"></li>")
		  .attr({
		    "id": node.id, 
			"parent":parentid
		  })
	      .text(stringBuilder.join("")));    
    if (node.nodes != null)
	  for (var i = 0; i < node.nodes.length; i++)
		  populateCrossProductClearanceSelectArea(node.nodes[i], previousPosition, node.id);        
	$('.crossProductClearanceTOCSelectArea').scrollTop(0);  
  }
  function populateSideClearanceSelectArea(node, previousPosition) {	  
    var stringBuilder = [];
    previousPosition = computeTOCLevel(node.childSequence, node.level, previousPosition);	  		    
    var splitTreePosition = previousPosition.toString().split("\.");
    stringBuilder.push(" ");
    if (splitTreePosition.length > 1)
      for (var i = 0; i < splitTreePosition.length; i++)    		
        stringBuilder.push(unescape("__".replace(/_/g, "%A0")));	
	//stringBuilder.push(previousPosition);
	//stringBuilder.push(" ");
    stringBuilder.push(node.title);       
    var isNodeMapped = false;
    //console.log("populateSideClearanceSelectArea node.title : " + node.title + " isNodeMapped " + isNodeMapped + " node.mappedRightStrands %o", node.mappedRightStrands);
    clearanceMemoObject.mappedRightStrands[node.id] = node.mappedRightStrands;
    clearanceMemoObject.mappedRightStrandRestrictions[node.id] = node.mappedRightStrandRestrictions;
    clearanceMemoObject.mappedProductInfoCodes[node.id] = node.mappedProductInfoCodes;    
    if ((node.mappedRightStrands != null && node.mappedRightStrands.length > 0) || 
    		(node.mappedRightStrandRestrictions != null && node.mappedRightStrandRestrictions.length > 0) || 
    		(node.mappedProductInfoCodes != null && node.mappedProductInfoCodes.length > 0)) {
    	//console.log(" node.title " + node.title + " node.mappedRightStrands %o", node.mappedRightStrands != null ? node.mappedRightStrands.length : "" , " node.mappedRightStrandRestrictions %o ", clearanceMemoObject.mappedRightStrandRestrictions[node.id], " node.mappedProductInfoCodes %o", node.mappedProductInfoCodes != null ? node.mappedProductInfoCodes.length : "");
      isNodeMapped = true; 
      clearanceMemoObject.isMapped = true;
    }
    //console.log("populateSideClearanceSelectArea node.title : " + node.title + " isMapped " + isMapped);
    if (node.showPublic) {
	    if ((erm.security.isBusiness() && node.reviewedByBusiness != null && !node.reviewedByBusiness) ||
	    		(!erm.security.isBusiness() && node.reviewedByLegal != null && !node.reviewedByLegal)) { 
		  $(".ermSideClearanceTOCSelectArea").append($("<li style=\"display: block; clear: both;\" class=\"" + (isNodeMapped ? "acknowledge-withmap" : "acknowledge") + "\"></li>")
				  .attr("id", node.id)
			      .text(stringBuilder.join("")));
	    } else {
	      $(".ermSideClearanceTOCSelectArea").append($("<li style=\"display: block; clear: both;\" class=\"" + (isNodeMapped ? "icon-sitemap" : "") + "\"></li>")
			  .attr("id", node.id)
		      .text(stringBuilder.join("")));
	    }    
      if (node.nodes != null)
	    for (var i = 0; i < node.nodes.length; i++)
  	      populateSideClearanceSelectArea(node.nodes[i], previousPosition);
    }
	$('.ermSideClearanceTOCSelectArea').scrollTop(0);
  }  
  function loadERMSidePanelClearanceTOC(clearanceMemoTOC) {
	console.log("loading ERMSidePanelClearanceTOC");
    $(".ermSideClearanceTOCSelectArea").html("");
    clearanceMemoObject.isMapped = false;
    if (clearanceMemoTOC != null) {
      for (var i = 0; i <  clearanceMemoTOC.nodes.length; i++)
        populateSideClearanceSelectArea(clearanceMemoTOC.nodes[i], "");
    }
    $(".ermSideClearanceTOCSelectArea li").unbind();
    $(".ermSideClearanceTOCSelectArea li").click(function (e) {    	
	    if (!e.ctrlKey) {    	  
	      var allOptions = $(".ermSideClearanceTOCSelectArea").children('li');
	      allOptions.removeClass('backgroundColorHighlight');
	      mappedTOCSelectedIDs = [];
	      $("#ermSideClearanceAcknowledge").addClass("hideControls");	      
	      if ($(this).hasClass("acknowledge") || $(this).hasClass("acknowledge-withmap")) {
	    	if (erm.security.canAcknowledgeUpdates())
	    	  $("#ermSideClearanceAcknowledge").removeClass("hideControls");		  
		  }
		  mappedTOCSelectedIDs.push(this.id);
		  $(this).addClass('backgroundColorHighlight');
		  loadClearanceTextForSidePanel(this.id, ($(this).hasClass("acknowledge") || $(this).hasClass("acknowledge-withmap")));		  
	    } else {	      
	      if ($(this).hasClass("backgroundColorHighlight")) {
	    	//console.log("Unchecking right strands");  
	    	$(this).removeClass('backgroundColorHighlight');
	    	var index = mappedTOCSelectedIDs.indexOf(this.id);
	    	if (index > -1)
	    	  mappedTOCSelectedIDs.splice(index, 1);	    	
	    	if (mappedTOCSelectedIDs.length == 0)
	    	  $("#ermSideClearanceAcknowledge").addClass("hideControls");	    	  		
	      } else {
	    	if ($(this).hasClass("acknowledge") || $(this).hasClass("acknowledge-withmap")) {
	    	  if (erm.security.canAcknowledgeUpdates())
	    		$("#ermSideClearanceAcknowledge").removeClass("hideControls");		  
    		}
    	    mappedTOCSelectedIDs.push(this.id);
    	    $(this).addClass('backgroundColorHighlight');
    	    console.log("mappedTOCSelectedIDs: %o", mappedTOCSelectedIDs);
    	    loadClearanceTextForSidePanel(this.id, ($(this).hasClass("acknowledge") || $(this).hasClass("acknowledge-withmap")));
	      }
	    }	    
		strands.toggleMapUnmapButtons();		
	});
  }
  
  function loadCrossProductClearanceTOC(clearanceMemoTOC) {
    $(".crossProductClearanceTOCSelectArea").html("");
    if (clearanceMemoTOC != null) {
      for (var i = 0; i <  clearanceMemoTOC.nodes.length; i++)
        populateCrossProductClearanceSelectArea(clearanceMemoTOC.nodes[i], "", 0);
    }
    $(".crossProductClearanceTOCSelectArea li").unbind();
    $(".crossProductClearanceTOCSelectArea li").click(function (e) {
		console.log("crossProductClearanceTOCSelectArea li clicked parent id %o", eval($(this).attr("parent")));
		var psscope = angular.element(document.getElementById("productSearchController")).scope();
		psscope.crossProduct.copyClearanceMemoAllSections = false;
		if (psscope.$root.$$phase != '$apply' && psscope.$root.$$phase != '$digest') {
		  psscope.$apply();
		}
	    if (!e.ctrlKey) {			  
	      psscope.crossProduct.copyClearanceMemoSections = [];	      	      
	      if (eval($(this).attr("parent")) != null && eval($(this).attr("parent")) > 0)
	        psscope.crossProduct.copyClearanceMemoSectionsParentMap[this.id] = eval($(this).attr("parent"));  
	      psscope.crossProduct.copyClearanceMemoSections.push(this.id);  
		  console.log("copyClearanceMemoSections: %o", psscope.crossProduct.copyClearanceMemoSections);
	    } else {
	      if ($(this).hasClass("backgroundColorHighlight")) {
	    	var index = psscope.crossProduct.copyClearanceMemoSections.indexOf(this.id);
	    	if (index > -1)
	    	  psscope.crossProduct.copyClearanceMemoSections.splice(index, 1);	    	  	  		
	      } else {
	    	if (eval($(this).attr("parent")) != null && eval($(this).attr("parent")) > 0) {	  	      
	  	      //var parentId = eval($(this).attr("parent"));
	  	      //var childId = this.id;
	  	      //while (parentId != null && eval(parentId) > 0) {
	  	    	//psscope.crossProduct.copyClearanceMemoSectionsParentMap[childId] = eval($(this).attr("parent"));
	  	    	//childId = $("#" + eval($(this).attr("parent"))).id;
	  	    	//parentId = eval($("#" + eval($(this).attr("parent"))).attr("parent"));
	  	      //}
	    	}
	    	psscope.crossProduct.copyClearanceMemoSections.push(this.id);	    	
	      }
	    }
	    console.log("psscope.crossProduct.copyClearanceMemoSectionsParentMap: %o", psscope.crossProduct.copyClearanceMemoSectionsParentMap);
	    var allOptions = $(".crossProductClearanceTOCSelectArea").children('li');
		allOptions.removeClass('backgroundColorHighlight');
	    $('.crossProductClearanceTOCSelectArea').find('li').each(function() {	       	      
	      var indexOfSection = eval(psscope.crossProduct.copyClearanceMemoSections.indexOf(this.id));
	      console.log("inside crossProductClearanceTOCSelectArea " + indexOfSection);
	      if (indexOfSection > -1) {
	        $(this).addClass('backgroundColorHighlight');
	        var parentId = $(this).attr("parent");	
	  	    while (parentId != null && eval(parentId) > 0) {
	  	      console.log("parentId: " + parentId);
		      $("#" + parentId).addClass('backgroundColorHighlight');	
		      if (eval(psscope.crossProduct.copyClearanceMemoSections.indexOf(parentId) == -1))
		        psscope.crossProduct.copyClearanceMemoSections.push(parentId);
		      parentId = $("#" + parentId).attr("parent");
	  	    }
	      }	    	 
		});
	    psscope.crossProduct.copyClearanceMemoSections.sort(); 
	    console.log("copyClearanceMemoSections: %o", psscope.crossProduct.copyClearanceMemoSections);
	});
  }
  function outputPreviewData(node, previousPosition, clearanceMemoData) {
	var stringBuilder = [];  
	previousPosition = computeTOCLevel(node.childSequence, node.level, previousPosition);
	stringBuilder.push("<div class=\"content_");
	stringBuilder.push(node.id);
	stringBuilder.push(" ");
	stringBuilder.push(computeTOCLevelClass(previousPosition));
	if (!node.showPublic)
      stringBuilder.push(" reportOnly hideControls");
	stringBuilder.push("\">");	
	stringBuilder.push("<span class=\"contentPosition hideControls\">");
	stringBuilder.push(previousPosition);
	stringBuilder.push("</span>");
	if (!node.ignoreTitle) {
	  stringBuilder.push("<span class=\"contentTitle\">");	
	  stringBuilder.push(node.title);
	  stringBuilder.push("</span>");
	  stringBuilder.push("<span class=\"content\">");
	} else {
	  stringBuilder.push("<span class=\"contentNoTitle\">");
	}
	//stringBuilder.push(clearanceMemoData[node.id]);
	var content = clearanceMemoData[node.id];
	var replacedExtractNumbers = content != null ? content.replace(/\(([x|X]+\S+[,*\s*[x|X]*\S*]*[,*\s*[x|X]*\S*]*)*\)/gi, function(matched) {
		return '<span class="extractnumber hideControls">' + matched + '</span>';
	}) : "";	
	stringBuilder.push(replacedExtractNumbers);
	stringBuilder.push("</span>");	
	if (node.attachments != null && node.attachments.length > 0) {
	  //console.log("node.attachments %o", node.attachments);
	  stringBuilder.push("<div class=\"contentAttachments\">");
	  for (var i = 0; i < node.attachments.length; i++) {
		stringBuilder.push("<a href=\"/erm/rest/Comments/getAttachment/" + node.attachments[i].documentId + "/" + node.attachments[i].attachmentName + "\" target=\"_blank\">");
		stringBuilder.push(node.attachments[i].attachmentName);
	    stringBuilder.push("</a>");
	    stringBuilder.push("<br/>");
	  }
	  stringBuilder.push("</div>");	
	}
	stringBuilder.push("</div>");
	$('.memoPreviewContentData').append(stringBuilder.join(""));
	//console.log("Appending id: %o", node.id, " title: %o", clearanceMemoData[node.id]);
	if (node.nodes != null)
	  for (var i = 0; i < node.nodes.length; i++)
		  outputPreviewData(node.nodes[i], previousPosition, clearanceMemoData);
  }
  function loadPreviewData(clearanceMemoTOC, clearanceMemoData) {
	storedClearanceMemoData = clearanceMemoData;
	if (clearanceMemoTOC != null && clearanceMemoTOC.nodes != null) {
      for (var i = 0; i <  clearanceMemoTOC.nodes.length; i++)
        outputPreviewData(clearanceMemoTOC.nodes[i], "", clearanceMemoData);
	}
  }
  this.showClearenceMemoView = function showClearenceMemoView(switchToView) {
	$('.clearanceMemoEditPreview .memoPreviewContent').scrollTop(0);
	if (switchToView == "M"){
	  $(".memoPreviewContentTOC").addClass("hideControls");
	  $(".clearanceReportHeader").addClass("hideControls");
	  $(".contentPosition").addClass("hideControls");
	  $(".memoPreviewContentMemorandum").removeClass("hideControls");
	  $(".memoPreviewContentAllMedia").html("All Media Distribution Rights");	  
	  $(".reportOnly").addClass("hideControls");	  	
	  $(".memoPreviewConfirmationStatus").removeClass("hideControls");
	  $(".memoPreviewFoxLogo").addClass("hideControls");
	  $(".memoPreviewContentTitle").removeClass("hideControls");
	  $(".memoPreviewContentAllMedia").removeClass("memoPreviewContentAllMediaShortWidth");
	  $(".extractnumber").addClass("hideControls");
	  $(".tocPosition").removeAttr("style");
	  $(".contentPosition").removeAttr("style");
	  $(".content").removeAttr("style");
	  $(".contentAttachments").removeAttr("style");
	  $(".subHeader").removeAttr("style");
	  $(".paragraph").removeAttr("style");
	} else {
	  $(".memoPreviewContentTOC").removeClass("hideControls");
	  $(".clearanceReportHeader").removeClass("hideControls");	  	 
	  $(".contentPosition").removeClass("hideControls");
	  $(".memoPreviewContentMemorandum").addClass("hideControls");
	  $(".memoPreviewContentAllMedia").html("Legal Rights Clearance Report");
	  $(".reportOnly").removeClass("hideControls");
	  $(".memoPreviewConfirmationStatus").addClass("hideControls");
	  $(".memoPreviewFoxLogo").removeClass("hideControls");
	  $(".memoPreviewContentTitle").addClass("hideControls");
	  $(".memoPreviewContentAllMedia").addClass("memoPreviewContentAllMediaShortWidth");
	  $(".extractnumber").removeClass("hideControls");
	  $(".tocPosition").attr("style", "width: 50px;");
	  $(".contentPosition").attr("style", "width: 50px;");
	  $(".content").attr("style", "padding-left: 50px;");
	  $(".contentAttachments").attr("style", "padding-left: 50px;");
	  $(".subHeader").attr("style", "float: left; padding-left: 0;");
	  $(".paragraph").attr("style", "float: left; padding-left: 0;");	  
	}
  };
  
  this.loadCrossProductClearenceTOCPanel = function loadCrossProductClearenceTOCPanel(foxVersionId) {	
	// Add indicator to screen for user	  	
	$("#memo-crossproduct-spinner-message").html("Loading...");	
	$("#memo-crossproduct-response").addClass("displayInline");
    $("#memo-crossproduct-spinner").addClass("displayInline");    
	var url = this.path.getClearanceMemoPreviewRESTPath() + foxVersionId;
	//console.log("url: " + url);
	$.get(url, function(data){
      console.log("loaded clearence memo toc panel: %o", data);		
      loadCrossProductClearanceTOC(data.clearanceMemoTOC);      
	  $("#memo-crossproduct-spinner").removeClass("displayInline");
	  $("#memo-crossproduct-check").addClass("displayInline");
	  $("#memo-crossproduct-spinner-message").html("Loaded");	  
	  $("#memo-crossproduct-response").addClass("successClass");      
	  setTimeout(function() {
		$("#memo-crossproduct-response").removeClass("displayInline");
		$("#memo-crossproduct-spinner").removeClass("displayInline");
		$("#memo-crossproduct-check").removeClass("displayInline");
		$("#memo-crossproduct-spinner-message").removeClass("tocErrorClass");
		$("#memo-crossproduct-response").removeClass("successClass");
		$("#memo-crossproduct-response").removeClass("deletedClass");	
	  }, erm.statusIndicatorTime);	
	}).fail(function(xhr,status,message,rcscope){
	  // failed  to load clearance preview	   
	  console.log("failed to Get  Clearance Memo Sections");
	  // Add indicator to screen for user
	  $("#memo-crossproduct-spinner").removeClass("displayInline");
	  $("#memo-crossproduct-spinner-message").addClass("tocErrorClass");
	  $("#memo-crossproduct-spinner-message").innerHTML = "Problem loading Memo";	 
	});
  };
	  
  this.loadClearenceMemoPreview = function loadClearenceMemoPreview() {
	$(".ermSideClearanceMemoSectionTextArea").html("");
	$(".ermSideClearanceTOCSelectArea").html("");	
	$(".clearanceMemoToolbar .k-widget").removeClass("forceShow");
	var cpscope = angular.element(document.getElementById("contractualPartyController")).scope();
	cpscope.loadContractualParties();
	clearanceMemoObject.loadClearanceMemoComments();
	minizeEditor();
	var rcscope = angular.element(document.getElementById("rightsController")).scope();
	$('.clearanceMemoEditPreview .memoPreviewContent').scrollTop(0);
	// Add indicator to screen for user	  	
	startMemoPreviewIndicatorResponses();     
	$('.memoPreviewContentTOC').html("");
	$('.memoPreviewContentData').html("");
	$("#memo-preview-spinner-message").html("Loading clearance memo...");
	$('#toc-item-status').val(0);
	console.log("Loading clearance memo...");
	$(".memoPreviewContentData").html("<i class=\"icon-spinner icon-spin icon-large\"></i>&nbsp; Loading...");
	startMemoSidePanelIndicatorResponses();
	$("#memo-sidepanel-spinner-message").html("Loading...");
	if (rcscope.currentProductArray.hasClearanceMemo) {
		var url = this.path.getClearanceMemoPreviewRESTPath() + rcscope.currentProductArray.foxVersionId;
		//console.log("url: " + url);
		$.get(url, function(data){
	      console.log("loaded clearence memo preview");
	      $("#memo-preview-spinner-message").html("Loading clearance memo...");
	      $(".memoPreviewContentData").html("");	      
	      $("#memo-sidepanel-spinner-message").html("Loaded");
		  loadERMSidePanelClearanceTOC(data.clearanceMemoTOC);
	      loadPreviewTOC(data.clearanceMemoTOC);
	      loadPreviewData(data.clearanceMemoTOC, data.clearanceMemoData);
		  $("#memo-preview-spinner").removeClass("displayInline");
		  $("#memo-preview-check").addClass("displayInline");
		  $("#memo-preview-spinner-message").html("Loaded");	  
		  $("#memo-preview-response").addClass("successClass");
		  $("#memo-sidepanel-spinner-message").html("Loaded");
		  $("#memo-sidepanel-response").addClass("successClass");
		  $("#memo-sidepanel-check").addClass("displayInline");
		  $("#memo-sidepanel-spinner").removeClass("displayInline");
		  setTimeout(function() {
		    removeMemoPreviewIndicatorResponses();
		    removeMemoSidePanelIndicatorResponses();			 
			$("#memo-sidepanel-check").removeClass("displayInline");
			$("#memo-sidepanel-spinner").removeClass("displayInline");
			$("#memo-sidepanel-response").removeClass("displayInline");		  				
		  }, erm.statusIndicatorTime);
		  rcscope.displayConfirmationStatus();
		  var selectedNode = clearanceMemoTreeView != null ? clearanceMemoTreeView.select() : null;
	      var selectedDataItem = clearanceMemoTreeView != null ? clearanceMemoTreeView.dataItem(selectedNode) : null;
	      $('.clearanceMemoEditPreview .memoPreviewContent').scrollTop(0);
	      if (selectedDataItem != null && 
	    		  $(".clearanceMemoEditPreview .memoPreviewContent .content_" + selectedDataItem.dbid) != null && 
	    		  $(".clearanceMemoEditPreview .memoPreviewContent .content_"+ selectedDataItem.dbid).position() != null) {
	    	lastSelectedDivID = selectedDataItem.dbid;    	
	    	$(".clearanceMemoEditPreview .memoPreviewContent .content_" + selectedDataItem.dbid).addClass("selectedContent");
		    $('.clearanceMemoEditPreview .memoPreviewContent').animate( {
		      scrollTop: eval($(".clearanceMemoEditPreview .memoPreviewContent .content_"+ selectedDataItem.dbid).position().top - 200)
		    }, 'fast');
	      }
	      populateCMVersionInfo(rcscope, $("#template_addEditClearanceMemo").data("kendoWindow"));
	      clearanceMemoObject.showClearenceMemoView(currentView);
		}).fail(function(xhr,status,message,rcscope){
		  // failed  to load clearance preview	   
		  console.log("failed to Get  ClearanceMemo preview");
		  // Add indicator to screen for user
		  $("#memo-preview-spinner").removeClass("displayInline");
		  $("#memo-preview-spinner-message").innerHTML = "Failed to load clearance preview.";	 
		});
	}
  };
  
  this.loadClearenceMemoText = function loadClearenceMemoText(commentId) {
	// Add indicator to screen for user	  	
	startMemoTextIndicatorResponses();
	$("#memo-text-spinner-message").html("Loading message comment...");	
	var url = this.path.getClearanceMemoNodeCommentRESTPath() + commentId;	   
	console.log("url: " + url);	  
	$.get(url, function(data){
      console.log("loaded clearence memo comment: %o", data);      
	  var editor = $("#clearanceMemoEditor").data("kendoEditor");	  
  	  var range = editor.createRange();
  	  range.selectNodeContents(editor.body);
      editor.selectRange(range);
      if (data != null && data.longDescription != null) 
        editor.paste(data.longDescription);
      else
    	editor.paste("");
      if (data != null) {
        if (data.publicInd != null && eval(data.publicInd) == 0)
          $("#appears-on-report-only").prop('checked',true);
        else
          $("#appears-on-report-only").prop('checked',false);
      }
      $('#toc-item-status').val(data != null && data.commentStatus != null ? eval(data.commentStatus) : 0);         
      $("#memo-text-spinner").removeClass("displayInline");
      $("#memo-text-response").removeClass("displayInline");      
	}).fail(function(xhr,status,message,rcscope){
	  // failed  to load clearance memo text	   
	  console.log("failed to Get  ClearanceMemo Text");
	  $("#memo-text-spinner").removeClass("displayInline");
	  $("#memo-text-spinner-message").innerHTML = "Failed to load message text.";
	  // Add indicator to screen for user	  
	});
  };
  
  this.generateBaselineVersion = function generateBaselineVersion(baselineTitle) {
	  var rcscope = erm.scopes.rights();
	  var isFoxipediaSearch = rcscope.isFoxipediaSearch;
	  // Add indicator to screen for user	  	
	  startMemoPreviewIndicatorResponses();
	  $("#baselineTitleEditWindow").data("kendoWindow").close();
	  $("#memo-preview-spinner-message").html("Generating Baseline Version...");	  
	  console.log("baselineTitle %o", JSON.stringify(baselineTitle));
	  var url = this.path.getCreateBaselinePDFRESTPath() + rcscope.currentProductArray.foxVersionId;
	  var params = {
				'foxVersionId': rcscope.currentProductArray.foxVersionId,
				'baselineTitle': JSON.stringify(baselineTitle)
			  };
	  if (isFoxipediaSearch) {
		  params.isFoxipediaSearch = isFoxipediaSearch;
	  }
	  
	  $.post(url, params , function(data){	   
	    // generating baseline version complete        	  	 
		// Remove indicator to screen for user
	    console.log("Generating Baseline Version returned");
	    $("#memo-preview-spinner").removeClass("displayInline");
		$("#memo-preview-check").addClass("displayInline");
	  	$("#memo-preview-spinner-message").html("Generated");	  
	  	$("#memo-preview-response").addClass("successClass");
	  	rcscope.loadBaselineVersions(rcscope.currentProductArray.foxVersionId);	    
		setTimeout(function(){
		  removeMemoPreviewIndicatorResponses();
		}, erm.statusIndicatorTime);		 
	  }).fail(function(xhr,status,message,rcscope){
	    // failed to save contractual parties 
	    console.log("failed to generate baseline version");		   
	    // Add indicator to screen for user        
	    $("#memo-preview-spinner").removeClass("displayInline");
	    $("#memo-preview-response").addClass("contractualPartyErrorClass");
	    var displayMessage = xhr.statusText;	      	
	    if (displayMessage != "") 
		      $("#memo-preview-spinner-message").html("Problem generating baseline pdf: " + displayMessage);
	    else
	      $("#memo-preview-spinner-message").html("Problem generating baseline pdf");
	  });
  };
  
  this.saveClearanceMemoText = function saveClearenceMemoText(commentId) {
	// Add indicator to screen for user	  
	startMemoTextIndicatorResponses();
	$("#memo-text-spinner-message").html("Saving...");	  		  	  
	var url = this.path.getClearanceMemoNodeCommentRESTPath();	   
	console.log("url: " + url);	  
	var editor = $("#clearanceMemoEditor").data("kendoEditor");	  
	var range = editor.createRange();
	range.selectNodeContents(editor.body);
	editor.selectRange(range);
	var selectedHTML = editor.selectedHtml();
//	var selectedHTML = $("#clearanceMemoEditor").val();
	rcscope = angular.element(document.getElementById("rightsController")).scope();		
	var jsonData = {
	  'foxVersionId': rcscope.currentProductArray.foxVersionId,
	  'commentIds': [ commentId ], 
	  'createNewVersionList' : [ $('#create-new-version').prop('checked') ],
	  'showOnReportOnlyList' : [ $('#appears-on-report-only').prop('checked') ],
	  'commentStatusList' : [ $('#toc-item-status').val() ],
	  'commentTextEntries' : [ selectedHTML ]
	};
		
	console.log("Save ClearanceMemo jsonData %o", jsonData);
	$.post(url, JSON.stringify(jsonData), function(data){	   
	  // save clearance memo text
	  console.log("Save ClearanceMemo Text %o", data);	  	  
	  // Remove indicator to screen for user
	  $("#memo-text-spinner").removeClass("displayInline");
	  $("#memo-text-check").addClass("displayInline");
	  $("#memo-text-spinner-message").html("Saved");	  
	  $("#memo-text-response").addClass("successClass");
	  var firstNode = $("#clearanceMemoTreeView").find(".k-first");
	  console.log("appears on report only checked? " + $('#appears-on-report-only').prop('checked'));
	  var selectedNode = clearanceMemoTreeView.select();	  
	  updatePublicStatusInTree(selectedNode, commentId);
	  clearanceMemoObject.loadClearenceMemoPreview();
	  setTimeout(function(){
		  removeMemoTextIndicatorResponses();
	  },erm.statusIndicatorTime);
	}).fail(function(xhr,status,message,rcscope){
	  // failed to save clearance memo	   
	  console.log("failed to Save Clearance Memo");		   
	  // Add indicator to screen for user
	  $("#memo-text-spinner").removeClass("displayInline");
	  $("#memo-text-spinner-message").html("Problem saving memo text");
	});
  };
  
  this.saveClearanceMemoTitle = function saveClearanceMemoTitle(commentId, title, ignoreTitle, clearanceMemoTOCId) {	  
	// Add indicator to screen for user	  
	startMemoTOCIndicatorResponses();
	$("#memo-toc-spinner-message").html("Saving...");	  		  	  
	var url = this.path.getClearanceMemoNodeTitleRESTPath();	   
	console.log("url: " + url);	 
	rcscope = angular.element(document.getElementById("rightsController")).scope();
	var jsonData = {
		'foxVersionId': rcscope.currentProductArray.foxVersionId, 
		'commentIds': [ commentId ], 
		'commentTitles' : [ title ],
		'ignoreTitles' : [ ignoreTitle ],
		'clearanceMemoTOCIds' : [ clearanceMemoTOCId ]		
	};
	console.log("jsonData %o", jsonData);
	$.post(url, JSON.stringify(jsonData), function(data){	   
	  // update saveDoNotLicense
	  console.log("Save ClearanceMemo Title %o", data);	  	  
	  // Remove indicator to screen for user
	  $("#memo-toc-spinner").removeClass("displayInline");
	  $("#memo-toc-check").addClass("displayInline");
	  $("#memo-toc-spinner-message").html("Saved");	  
	  $("#memo-toc-response").addClass("successClass");
	  clearanceMemoObject.loadClearenceMemoPreview();
	  setTimeout(function(){
		  removeMemoTOCIndicatorResponses();		  
	  },erm.statusIndicatorTime);	  
	}).fail(function(xhr,status,message,rcscope){
	  // failed  to update saveDoNotLicense		   
	  console.log("failed to save title");		   
	  // Add indicator to screen for user
	  $("#memo-toc-spinner").removeClass("displayInline");
	  $("#memo-toc-spinner-message").html("Failed to save title.");
	});
  };
  
  /**
   * Pops a confirmation dialog window confirming allowing the user to edit the TOC Entry  
   */  
  function submitTOCTitleSave() {	   	 	
	var selectedNode = clearanceMemoTreeView.select();
	var selectedDataItem = clearanceMemoTreeView.dataItem(selectedNode);			
	selectedDataItem.text = $("#tocTitleEditWindowInput").val();
	selectedDataItem.trigger("change", { action: "itemchange", field: "text" });
	$("#tocTitleEditWindow").data("kendoWindow").close();
	selectedDataItem.ignoreTitle = $("#tocIgnoreTitle").prop("checked");
	clearanceMemoObject.saveClearanceMemoTitle(selectedDataItem.dbid, selectedDataItem.text, $("#tocIgnoreTitle").prop("checked"), selectedDataItem.tocID);	
  };      
  function cancelTOCTitleSave() {	   		   	   	   
	  $("#tocTitleEditWindow").data("kendoWindow").close();	   
  };  
  function submitBaselineTitleSave() {
	if ($("#baselineTitleEditWindowInput").val() == null || $("#baselineTitleEditWindowInput").val().length == 0) {
	  $("#baselineErrorParagraph").html("You must enter a valid title for the baseline version.");
	  $("#baselineErrorDiv").attr("style", "display: block;");	  
	} else {
	  $("#baselineErrorDiv").attr("style", "display: none;");
	  console.log("Submitting baseline version with tile " + $("#baselineTitleEditWindowInput").val());
      clearanceMemoObject.generateBaselineVersion($("#baselineTitleEditWindowInput").val());
	}
  }
  function cancelBaselineTitleEditSave() {
	  $("#baselineTitleEditWindow").data("kendoWindow").close();	  
  }
  this.showBaselineTitleEditWindow = function showBaselineTitleEditWindow(){
	var window = $("#baselineTitleEditWindow").data("kendoWindow");		
	window.setOptions({
		visible : true,
		modal : true
	});
	window.title("Save Baseline Version");
	window.center();
	window.open();	
	$("#baselineErrorDiv").attr("style", "display: none;");
	$("#baselineErrorParagraph").html("");
	$("#baselineTitleEditWindowInput").val("");	
  };
  
  this.showTOCTitleEditWindow = function showTOCTitleEditWindow(section){
	var d = $("#tocTitleEditWindow").data("kendoWindow");	
	d.setOptions({
		visible : true,
		modal : true
	});
	d.title("Memo Table of Contents - Title Edit - Section " + section);
	d.center();
	d.open();		
  };
  
  this.moveDBItem = function moveDBItem(childDataItem, oldDataItem) {
	console.log("inside moveDBItem");  
    console.log("moveDBItem: " + childDataItem.dbid + " parent: " + childDataItem.parentid + " oldParentId: " + (oldDataItem != null ? oldDataItem.dbid : null) + " to position: " + childDataItem.treePosition + " and text: " + childDataItem.text);
    startMemoTOCIndicatorResponses();
    $("#memo-toc-response").addClass("movingClass");
	$("#memo-toc-spinner-message").html("Moving...");	
	var url = this.path.getClearanceMemoNodeMoveRESTPath();	   
	console.log("url: " + url);
	rcscope = angular.element(document.getElementById("rightsController")).scope();
	var splitTreePosition = childDataItem.treePosition.toString().split("\.");
	var position = splitTreePosition[eval(eval(splitTreePosition.length)-1)];
	console.log("New position: %o", position);
	var jsonData = {
	  'foxVersionId': rcscope.currentProductArray.foxVersionId, 
	  'parentId' : childDataItem.parentid,
	  'oldParentId' : oldDataItem == null ? rcscope.currentProductArray.clearanceMemoRootNodeId : oldDataItem.dbid,
	  'childId' : childDataItem.dbid,
	  'position' : eval(position)
	};						
	console.log("New jsonData: %o", jsonData);
	$.post(url, JSON.stringify(jsonData), function(data){	   
	  // update saveDoNotLicense
	  console.log("Moving ClearanceMemo Toc Item %o", data);	  	  
	  // Remove indicator to screen for user
	  $("#memo-toc-spinner").removeClass("displayInline");
	  $("#memo-toc-check").addClass("displayInline");
	  $("#memo-toc-spinner-message").html("Moved");
	  clearanceMemoObject.loadClearenceMemoPreview();
	  setTimeout(function(){
		removeMemoTOCIndicatorResponses();
	  },erm.statusIndicatorTime);	  
	  clearEditor();
	}).fail(function(xhr,status,message,rcscope){
	  // failed  to update saveDoNotLicense		   
	  console.log("failed to save title");		   
	  // Add indicator to screen for user
	  $("#memo-toc-spinner").removeClass("displayInline");
	  var displayMessage = xhr.responseText;
      console.log("Delete failed %o %o %o",xhr,status,message);
	  $("#memo-toc-spinner-message").addClass("tocErrorClass");
	  $("#memo-toc-spinner-message").html("There was a problem deleting the entry");		
      if (displayMessage != "") 
	    $("#memo-toc-spinner-message").html(displayMessage);		
	  childDataItem.dbid = 0;
	  clearEditor();
	});	
  };
  
  this.removeDBItem = function removeDBItem(childDataItem, reloadTree) {
	console.log("removeDBItem: " + childDataItem.dbid + " parent: " + childDataItem.parentid + " with position: " + childDataItem.treePosition + " and text: " + childDataItem.text);	
	// Add indicator to screen for user	  
	startMemoTOCIndicatorResponses();	
	$("#memo-toc-response").addClass("deletedClass");
	$("#memo-toc-spinner-message").html("Deleting...");	  		  	  
	var url = this.path.getClearanceMemoNodeDeleteRESTPath();	   
	console.log("url: " + url);
	rcscope = angular.element(document.getElementById("rightsController")).scope();
	var jsonData = {
	  'foxVersionId': rcscope.currentProductArray.foxVersionId, 
	  'parentId' : childDataItem.parentid, 
	  'childId' : childDataItem.dbid 
	};
	
	$.post(url, JSON.stringify(jsonData), function(data){	   
	  // update saveDoNotLicense
	  console.log("Deleting ClearanceMemo Toc Item %o", data);	  	  
	  // Remove indicator to screen for user
	  $("#memo-toc-spinner").removeClass("displayInline");
	  $("#memo-toc-check").addClass("displayInline");
	  $("#memo-toc-spinner-message").html("Deleted");
	  clearanceMemoObject.loadClearenceMemoPreview();
	  setTimeout(function(){
		  removeMemoTOCIndicatorResponses();
	  },erm.statusIndicatorTime);	  
	  clearEditor();
	  if (reloadTree) {
		clearanceMemoKendoElementInit.getClearanceMemoFromDB();
	  }
	}).fail(function(xhr,status,message,rcscope){
	  // failed  to update saveDoNotLicense		   
	  console.log("failed to save title");		   
	  // Add indicator to screen for user
	  $("#memo-toc-spinner").removeClass("displayInline");
	  var displayMessage = xhr.responseText;
      console.log("Delete failed %o %o %o",xhr,status,message);
	  $("#memo-toc-spinner-message").addClass("tocErrorClass");
	  $("#memo-toc-spinner-message").html("There was a problem deleting the entry");		
      if (displayMessage != "") 
	    $("#memo-toc-spinner-message").html(displayMessage);		
	  childDataItem.dbid = 0;
	  clearEditor();
	});	
  };  
  
  this.insertDBItem = function insertDBItem(childDataItem) {
	var newTOCNodeID = null; 
	console.log("insertDBItem: childDataItem: %o ", childDataItem);	
	// Add indicator to screen for user	  
	startMemoTOCIndicatorResponses();	
	$("#memo-toc-spinner-message").html("Inserting...");	  		  	  
	var url = this.path.getClearanceMemoNodeCreateRESTPath();	   
	console.log("url: " + url);
	rcscope = angular.element(document.getElementById("rightsController")).scope();
	console.log("childDataItem.treePosition %o", childDataItem.treePosition);
	var splitTreePosition = childDataItem.treePosition.toString().split("\.");
	var position = splitTreePosition[eval(eval(splitTreePosition.length)-1)];	
	var jsonData = {
	  'foxVersionId': rcscope.currentProductArray.foxVersionId, 
	  'parentId' : childDataItem.parentid, 
	  'position' : eval(position)
	};
	console.log("position: " +  eval(position));
	$.post(url, JSON.stringify(jsonData), function(data){	   
	  // update saveDoNotLicense
	  console.log("Inserting ClearanceMemo Toc Item %o", data);
	  newTOCNodeID = data;
	  $("#"+ childDataItem.dbid).attr("checkboxid", data.childCommentId);
	  $("#"+ childDataItem.dbid).attr("name","linkedEntry[" + data + "]");
	  childDataItem.dbid = data.childCommentId;
	  childDataItem.checkboxid = data.childCommentId;
	  childDataItem.tocID = data.id;
	  childDataItem.trigger("change", { action: "itemchange", field: "text" });
	  console.log("newTOCNodeID %o", data);
	  // Remove indicator to screen for user
	  $("#memo-toc-spinner").removeClass("displayInline");
	  $("#memo-toc-check").addClass("displayInline");
	  $("#memo-toc-spinner-message").html("Created");	  
	  $("#memo-toc-response").addClass("successClass");
	  clearanceMemoObject.loadClearenceMemoPreview();
	  setTimeout(function(){
		  removeMemoTOCIndicatorResponses();
	  },erm.statusIndicatorTime);	  
	  clearEditor();
	}).fail(function(xhr,status,message,rcscope){
	  // failed  to update saveDoNotLicense		   
	  console.log("failed to save title");		   
	  // Add indicator to screen for user
	  $("#memo-toc-spinner").removeClass("displayInline");
	  var displayMessage = xhr.responseText;
      console.log("Save failed %o %o %o",xhr,status,message);
	  $("#memo-toc-spinner-message").addClass("tocErrorClass");
      if (displayMessage != "") 
	    $("#memo-toc-spinner-message").html(displayMessage);		
	  childDataItem.dbid = 0;
	  childDataItem.checkboxid = 0;
	  childDataItem.tocID = 0;
	  childDataItem.trigger("change", { action: "itemchange", field: "text" });
	  clearEditor();
	});
	return newTOCNodeID;
  };
  
  this.linkDBItems = function linkDBItems(linkedIds) {
	console.log("linkDBItems: linkedIds: " + linkedIds);	
	// Add indicator to screen for user	  
	startMemoTOCIndicatorResponses();	
	$("#memo-toc-spinner-message").html("Linking...");	  		  	  
	var url = this.path.getClearanceMemoNodeLinkRESTPath();	   	
	var jsonLinkedIds = JSON.stringify(linkedIds);
	console.log("jsonLinkedIds: " + jsonLinkedIds);
	rcscope = angular.element(document.getElementById("rightsController")).scope();
	var jsonData = {
	  'foxVersionId': rcscope.currentProductArray.foxVersionId,
	  'commentIds': linkedIds	  
	};			
		    
	$.post(url, JSON.stringify(jsonData), function(data){	   
	  // update saveDoNotLicense
	  console.log("Linking Items %o", data);	  	  
	  // Remove indicator to screen for user
	  $("#memo-toc-spinner").removeClass("displayInline");
	  $("#memo-toc-check").addClass("displayInline");
	  $("#memo-toc-spinner-message").html("Linked");	  
	  $("#memo-toc-response").addClass("successClass");	  
	  var firstNode = $("#clearanceMemoTreeView").find(".k-first");
	  for (var i = 1; i < linkedIds.length; i++) {
		console.log("root node id to link to  %o", linkedIds[0], " linked id %o ", linkedIds[i]);	  
		updateLinkedIdsInTree(firstNode, linkedIds[0], linkedIds[i]);
	  }
	  clearanceMemoObject.loadClearenceMemoPreview();
	  setTimeout(function(){
		  removeMemoTOCIndicatorResponses();
	  },erm.statusIndicatorTime);
	  clearEditor();
	}).fail(function(xhr,status,message,rcscope){
	  // failed  to update saveDoNotLicense		   
	  console.log("failed to save title");		   
	  // Add indicator to screen for user
	  $("#memo-toc-spinner").removeClass("displayInline");
	  var displayMessage = xhr.responseText;
      console.log("Link failed %o %o %o",xhr,status,message);
	  $("#memo-toc-spinner-message").addClass("tocErrorClass");
      if (displayMessage != "") 
	    $("#memo-toc-spinner-message").html(displayMessage);		
	  childDataItem.dbid = 0;	
	  clearEditor();
	});	
  };
  
  
  function resetButtons() {
	clearanceMemoTreeView.select($());
	$("#cm-add-node").removeAttr("disabled", "disabled");;
	$("#cm-add-node").removeClass("btn-disabled");
	$("#cm-levelup-node").attr("disabled", "disabled");;
	$("#cm-levelup-node").addClass("btn-disabled");
	$("#cm-leveldown-node").attr("disabled", "disabled");
	$("#cm-leveldown-node").addClass("btn-disabled");
	$("#cm-tableft-node").attr("disabled", "disabled");
	$("#cm-tableft-node").addClass("btn-disabled");
	$("#cm-tabright-node").attr("disabled", "disabled");
	$("#cm-tabright-node").addClass("btn-disabled");
	$("#cm-remove-node").attr("disabled", "disabled");
	$("#cm-remove-node").addClass("btn-disabled");
  }
  
  function getSelectedSequenceNumber(selectedNode) {
	if (selectedNode != null && clearanceMemoTreeView.dataItem(selectedNode) != null)
	  return clearanceMemoTreeView.dataItem(selectedNode).treePosition;  	  
	else 
	  return null;
  };
  
  this.updateLinkedItemsChecked = function updateLinkedItemsChecked(){
	parentIDsChecked = {};
	var treePositionChecked = 0;
	//console.log("Inside get linked items");
	var somethingChecked = false;
	
	$('#clearanceMemoTreeView').find('input:checkbox').each(function() {	  		  		 
	  if (eval($(this).attr("linked")) && !eval($(this).prop("checked")) && removeEnabled) {
	    //unLinkedItems[unLinkedItems.length] = $(this).attr("checkboxid");
		console.log("found unchecked item to remove %o", clearanceMemoTreeView.dataItem($(this).parent()));
		clearanceMemoObject.removeDBItem(clearanceMemoTreeView.dataItem($(this).parent()), false);
		console.log("remove from tree %o ", $(this));
		
	    clearanceMemoTreeView.remove($(this));	  
	    
	    //TMA remove and detach
	    clearanceMemoTreeView.detach($(this));
	    
	    resetButtons();	    
	    return;
	  }
	});
	$('#clearanceMemoTreeView').find('input:checkbox:checked').each(function() {
		//console.log("found checked item parentid ", $(this).attr("parentid"), " tree position ", $(this).attr("treePosition"));
		parentIDsChecked[$(this).attr("parentid")] = $(this).attr("checkboxid");
		treePositionChecked = eval($(this).attr("treePosition").split("\.").length);
		somethingChecked = true;
	});	
	$('#clearanceMemoTreeView').find('input:checkbox').each(function() {
	  //console.log(" treePositionChecked: ", treePositionChecked, " treePosition: ", $(this).attr("treePosition").toString());
	  if (((treePositionChecked != eval($(this).attr("treePosition").split("\.").length)) || (parentIDsChecked[$(this).attr("parentid")] != null && parentIDsChecked[$(this).attr("parentid")] != $(this).attr("checkboxid")))) {
		$(this).attr("disabled", "disabled");
		//console.log(" this parentid: " + $(this).attr("parentid") + " parentIDsChecked " + parentIDsChecked[$(this).attr("parentid")] + " this id: " + $(this).attr("checkboxid"));
	  } else {
		$(this).removeAttr("disabled");
		//console.log(" treePositionChecked: " + treePositionChecked + " cur tree position: " + eval($(this).attr("treePosition").indexOf("\.")));
	  }
	});
	
	
	if (somethingChecked) {
	  $("#cm-link-node").removeClass("btn-edit");
	  $("#cm-link-node").addClass("btn-add");
	} else {
	  $("#cm-link-node").removeClass("btn-add");
	  $("#cm-link-node").addClass("btn-edit");
	  parentIDsChecked = {};
	  $('#clearanceMemoTreeView').find('input:checkbox').each(function() {	  		  		 		  
	    $(this).removeAttr("disabled");		 
	  });
	}
  };

  
  function getSelectedText(selectedNode) {
	if (selectedNode != null && clearanceMemoTreeView.dataItem(selectedNode) != null)
	  return clearanceMemoTreeView.dataItem(selectedNode).text;  	  
	else 
	  return null;
  };
  
  function getUpdatedTreePositions(treePosition, increase) {
	var stringBuilder = [];
	if (treePosition != null && treePosition.toString().indexOf("\.") > 0) {	
		var nextNodePeriodSplit = treePosition.toString().split("\.");
		//console.log("nextNodePeriodSplit " + nextNodePeriodSplit + " length " + nextNodePeriodSplit.length);
	    for (var i = 0; i < nextNodePeriodSplit.length; i++) {
	      var updatedValue = increase ? eval(eval(nextNodePeriodSplit[i]) + 1) : eval(eval(nextNodePeriodSplit[i]) - 1); 
	      if (i == (nextNodePeriodSplit.length-1))
	        stringBuilder.push(updatedValue);	    
	      else  {
	        stringBuilder.push(eval(nextNodePeriodSplit[i]));	        
		    stringBuilder.push(".");
	      }	      	 
	    }
	} else {
		var updatedValue = increase ? eval(eval(treePosition) + 1) : eval(eval(treePosition) - 1);
		stringBuilder.push(updatedValue);
	}
	return stringBuilder.join("");
  }
  
  function updatePublicStatusInTree(startNode, updatedId) {
	// next sibling			
	//while (getSelectedSequenceNumber(startNode) != null) {	  
	  var nextNodeDataItem = clearanceMemoTreeView.dataItem(startNode);
	  if(eval(nextNodeDataItem.dbid) == eval(updatedId)) {
		console.log("foundId %o ", nextNodeDataItem);
		console.log("updatePublicStatusInTree updatedId  %o", updatedId, " showPublic %o ", $('#appears-on-report-only').prop('checked'));
		console.log("1 nextNodeDataItem.showPublic %o ", nextNodeDataItem.showPublic);
		nextNodeDataItem.showPublic = $('#appears-on-report-only').prop('checked') ? false : true;
		console.log("2 nextNodeDataItem.showPublic %o ", nextNodeDataItem.showPublic);
	    nextNodeDataItem.trigger("change", { action: "itemchange", field: "text" });
	    //break;
	  }
	  // update any children
	  //var foundId = updateChildrensPublicStatus(startNode, updatedId);
	  //if (foundId == true) {
		//console.log("foundId %o ", foundId);
	    //break;
	  //}
	  //startNode = startNode.next();	  	 	  
	//}  
  }
  
  function updateChildrensPublicStatus(parentNode, updatedId, showPublic) {
	// loop through children	
	parentNode.find("li").each(function (firstChild) {		
    	var firstChild = $(this);    	    	    
    	var childDataItem = clearanceMemoTreeView.dataItem(firstChild);    	
    	if(eval(childDataItem.dbid) == eval(updatedId)) {    	  
    	  childDataItem.showPublic = !showPublic;
    	  childDataItem.trigger("change", { action: "itemchange", field: "text" });
    	  console.log("showPublic: " + showPublic);
    	  return true;
	    }
	    if (firstChild.find("li").length > 0)
	      updateChildrensPublicStatus(firstChild, updatedId, showPublic);
	});
	return false;
  }
  
  function updateLinkedIdsInTree(startNode, rootCommentId, replacedId) {
	// next sibling		
	console.log("getSelectedSequenceNumber(startNode)  %o", getSelectedSequenceNumber(startNode));
	while (getSelectedSequenceNumber(startNode) != null) {	  
	  var nextNodeDataItem = clearanceMemoTreeView.dataItem(startNode);
	  console.log("nextNodeDataItem.dbid  %o", nextNodeDataItem.dbid , " replaced id: %o", replacedId);
	  if(eval(nextNodeDataItem.dbid) == eval(replacedId)) {
		console.log("matched dbid to replacedid");
		nextNodeDataItem.dbid = rootNodeDataItem;	  
	    nextNodeDataItem.trigger("change", { action: "itemchange", field: "text" });
	    break;
	  }
	  // update any children
	  var foundId = updateChildrensLinkedIds(startNode, rootCommentId, replacedId);
	  if (foundId == true) {
		console.log("foundId %o ", foundId);
	    break;
	  }
	  startNode = startNode.next();	  	 	  
	}
  };
  
  function updateChildrensLinkedIds(parentNode, rootCommentId, replacedId) {
	// loop through children	
	parentNode.find("li").each(function (firstChild) {		
    	var firstChild = $(this);    	    	    
    	var childDataItem = clearanceMemoTreeView.dataItem(firstChild);    	    		
    	//console.log("parentTreePositionString: " + parentTreePositionString.toString() + " updatedIDs[childDataItem.dbid] " + updatedIDs[childDataItem.dbid]);
    	console.log("childDataItem.dbid  %o", childDataItem.dbid, " replaced id: %o", replacedId);
    	if(eval(childDataItem.dbid) == eval(replacedId)) {
    	  console.log("matched dbid to replacedid oldid: " + childDataItem.dbid);
    	  childDataItem.dbid = eval(rootCommentId);	    	   
    	  childDataItem.trigger("change", { action: "itemchange", field: "text" });
    	  console.log("newid: " + childDataItem.dbid);
    	  return true;
	    }
	    if (firstChild.find("li").length > 0)
	      updateChildrensLinkedIds(firstChild, rootCommentId, replacedId);
	});
	return false;
  }
  
  this.updateSiblings = function updateSiblings(nextNode) {
	updatedIDs = {};
	updateFollowingSiblingsTreePositions(nextNode, false, true);
  };
  
  function updateFollowingSiblingsTreePositions(nextNode, increase, isTopLevel) {
	// next sibling	
	var loopCount = 1;
	while (getSelectedSequenceNumber(nextNode) != null) {	  
	  //console.log("Next seq number: " + getSelectedSequenceNumber(nextNode) + " with text: " + getSelectedText(nextNode));
	  var nextNodeDataItem = clearanceMemoTreeView.dataItem(nextNode);	
      var nextNodeTreePositionString = nextNodeDataItem.treePosition;    
	  //console.log("new treePosition: " + loopCount);
	  if(isTopLevel)
	    nextNodeDataItem.treePosition = loopCount;
	  else 
		nextNodeDataItem.treePosition = getUpdatedTreePositions(nextNodeTreePositionString, increase);	  
	  // update change state of data item	  	 
	  nextNodeDataItem.trigger("change", { action: "itemchange", field: "text" });
	  // get next node
	  // update any children	  
	  updateChildrenTreePositions(nextNode);
	  nextNode = nextNode.next();	  	 
	  loopCount++;
	}
  };
  
  this.updateChildren = function updateChildren(parentNode) {
	updatedIDs = {};
    updateChildrenTreePositions(parentNode);
  };
  
  function updateChildrenTreePositions(parentNode) {			
	// loop through children	
	var lastChildValue = 1;
	parentNode.find("li").each(function (firstChild) {		
    	var firstChild = $(this);    	
    	var parentDataItem = clearanceMemoTreeView.dataItem(parentNode);
    	console.log("Parent seq number: " + getSelectedSequenceNumber(parentNode) + " with text: " + getSelectedText(parentNode));
        var parentTreePositionString = parentDataItem.treePosition;    
        var stringBuilder = [];    	
    	var childDataItem = clearanceMemoTreeView.dataItem(firstChild);    	    		
    	console.log("parentTreePositionString: " + parentTreePositionString.toString() + " updatedIDs[childDataItem.dbid] " + updatedIDs[childDataItem.dbid]);
    	if (updatedIDs[childDataItem.dbid] == null) {
		    if (parentTreePositionString != null && parentTreePositionString.toString().indexOf("\.") > 0) {	      
			  var parentPeriodSplit = parentTreePositionString.toString().split("\.");		  		  
			  if (parentPeriodSplit.length == 2) {
				stringBuilder.push(eval(parentPeriodSplit[0]));
				stringBuilder.push(".");
				stringBuilder.push(eval(parentPeriodSplit[1]));
				stringBuilder.push(".");
				stringBuilder.push(eval(lastChildValue++));
				childDataItem.parentid = parentDataItem.dbid;
				childDataItem.treePosition = stringBuilder.join("");
				childDataItem.trigger("change", { action: "itemchange", field: "text" });				
				updatedIDs[childDataItem.dbid] = true;
			  } else if (parentPeriodSplit.length == 3) {
				stringBuilder.push(eval(parentPeriodSplit[0]));
				stringBuilder.push(".");
				stringBuilder.push(eval(parentPeriodSplit[1]));
				stringBuilder.push(".");
				stringBuilder.push(eval(parentPeriodSplit[2]));
				stringBuilder.push(".");
				stringBuilder.push(eval(lastChildValue++));	
				childDataItem.parentid = parentDataItem.dbid;
				childDataItem.treePosition = stringBuilder.join("");
				childDataItem.trigger("change", { action: "itemchange", field: "text" });				
				updatedIDs[childDataItem.dbid] = true;
			  }  
			} else {		  		 
			  stringBuilder.push(parentTreePositionString);
			  stringBuilder.push(".");
			  stringBuilder.push(eval(lastChildValue++));
			  childDataItem.parentid = parentDataItem.dbid;
			  childDataItem.treePosition = stringBuilder.join("");
			  childDataItem.trigger("change", { action: "itemchange", field: "text" });			  
			  updatedIDs[childDataItem.dbid] = true;
			}
    	}
	    if (firstChild.find("li").length > 0)
	      updateChildrenTreePositions(firstChild);
	});
  }
  
  this.showLinkedItems =  function showLinkedItems(linkedid) {
	removeEnabled = true;
	$('#clearanceMemoTreeView').find('input:checkbox:checked').each(function(checkbox) { 	    		  
 	  $(this).prop("checked", false); 	  
	});
    //console.log("showLinkedItems Clicked");
    console.log("Linked map for linkedid " + linkedid + " = " + this.linkedMap[linkedid]); 
	$("#cm-link-node").removeClass("btn-edit");
	$("#cm-link-node").addClass("btn-add");	
	$(".k-checkbox").attr("style", "display: inline !important");	  
	var mappedItems = this.linkedMap[linkedid].toString().split("\,");
	console.log("mappedItems " + mappedItems);
	for (var i = 0; i < mappedItems.length; i++) {
	  if (mappedItems[i] != "") {
	  	linkEnabled = true;
	    console.log("Linked item " + i + " = " + mappedItems[i]);
	    $('#clearanceMemoTreeView').find('input:checkbox').each(function(checkbox) {
		  //console.log("checkboxid : " + $(this).attr("checkboxid") + " mapped item id: " + mappedItems[i]);
		  if ($(this).attr("checkboxid") == mappedItems[i]) {
			$(this).prop("checked", true);	  		
			$(this).removeAttr("disabled");
			//console.log("Found the item to check");	  		  
		  }
		});
	  }
	}  	
  };
  
  this.setUpTreeButtons = function() {	
	$("#create-baseline-version").unbind();
    $("#create-baseline-version").click(function(event){
      clearanceMemoObject.showBaselineTitleEditWindow();  	  
    });  
	// set enter key commands for input fields
	$("#tocTitleEditWindowInput").keypress(function(event){
	  if(event.keyCode == 13) {		
		$("#toc-title-entry-save").click();
		return false;
	  }
	});
	$("#baselineTitleEditWindowInput").keypress(function(event){
	  if(event.keyCode == 13) {		
		$("#baseline-title-entry-save").click();
		return false;
	  }
	});  
	$("#update-clearance-memo-text").unbind();
	$("#update-clearance-memo-text").click(function(event){
	  console.log("update-clearance-memo-text clicked");
	  event.preventDefault();
	  var selectedNode = clearanceMemoTreeView.select();
	  if (selectedNode != null && clearanceMemoTreeView.dataItem(selectedNode) != null) {
		clearanceMemoObject.saveClearanceMemoText(clearanceMemoTreeView.dataItem(selectedNode).dbid);
	  } else {
		$("#memo-text-response").addClass("displayInline");
		$("#memo-text-spinner-message").addClass("tocErrorClass");
		$("#memo-text-spinner-message").html("You must select an entry in the TOC");
	  }
	});
	  
	$("#toc-title-entry-save").unbind();
	$("#toc-title-entry-save").click(function(event){
	  event.preventDefault();
	  submitTOCTitleSave();    	
	});    
	    
	$("#toc-title-entry-cancel").unbind();
	$("#toc-title-entry-cancel").click(function(event){
	  event.preventDefault();
	  cancelTOCTitleSave();    	
	});
	
	$("#baseline-title-entry-save").unbind();
	$("#baseline-title-entry-save").click(function(event){
	  event.preventDefault();
	  submitBaselineTitleSave();    	
	});    
	    
	$("#baseline-title-entry-cancel").unbind();
	$("#baseline-title-entry-cancel").click(function(event){
	  event.preventDefault();
	  cancelBaselineTitleEditSave();    	
	});
	
	
	$("#cm-remove-node").unbind();
    $("#cm-remove-node").click(function(event) {
      updatedIDs = {};
	  event.preventDefault();
      var selectedNode = clearanceMemoTreeView.select();
      var parentNode = clearanceMemoTreeView.parent(selectedNode);
      //console.log("Removing sequence number: " + getSelectedSequenceNumber(clearanceMemoTreeView.select()) + " with text: " + getSelectedText(clearanceMemoTreeView.select()));       
      if (parentNode.find("li").length == 0) {
    	clearanceMemoObject.removeDBItem(clearanceMemoTreeView.dataItem(selectedNode), true);        
      } else {
    	clearanceMemoObject.removeDBItem(clearanceMemoTreeView.dataItem(selectedNode), false);
        clearanceMemoTreeView.remove(selectedNode);  
        
        //TMA remove and detach
        clearanceMemoTreeView.detach(selectedNode); 
        
      	updateChildrenTreePositions(parentNode);
      	resetButtons();
      }      
    });  
    
    $("#cm-link-node").unbind();
    $("#cm-link-node").click(function(event){
      event.preventDefault();
  	  removeEnabled = false;
  	  if (!linkEnabled) {
  	    $(".k-checkbox").attr("style", "display: inline !important");
  	    linkEnabled = true;
  	    parentIDsChecked = {};
  	    $('#clearanceMemoTreeView').find('input:checkbox').each(function() {
  	      $(this).prop("checked", false);
  	      console.log("Is this linked: %o " + eval($(this).attr("linked")));
  	      //if (eval($(this).attr("linked"))) 
  	    	//$(this).attr("disabled", "disabled"); 
  	      //else
  	    	//$(this).removeAttr("disabled");  	      
  		});
  	  } else {
  		var stringBuilder = [];
  		var linkedIds = [];
  		$('#clearanceMemoTreeView').find('input:checkbox:checked').each(function(checkbox) {
  			console.log("You would have linked ids: %o " + $(this).attr("checkboxid"));
  			linkedIds.push(eval($(this).attr("checkboxid")));
  			if (stringBuilder.length > 0)
  			  stringBuilder.push(", ");
  			stringBuilder.push($(this).attr("checkboxid"));  			
  		});
  		$('#clearanceMemoTreeView').find('input:checkbox:checked').each(function(checkbox) {  		     		     		  
  		   clearanceMemoObject.linkedMap[$(this).attr("checkboxid")] = linkedIds;  		   
  		   $(this).prop("checked", false);
  		   console.log("Is this linked: " + $(this).attr("linked"));
  		   if (!eval($(this).attr("linked"))) {
  			 $(this).parent().parent().append("  <span onClick='clearanceMemoObject.showLinkedItems(\""+ $(this).attr("checkboxid") + "\")' class=\"icon-unlink\"></span>");
  			 $(this).attr("linked", true);
  		   }
  		});
  		// update DB items  		
  		if (stringBuilder.length > 1)
  		  clearanceMemoObject.linkDBItems(linkedIds);
  		$("#cm-link-node").removeClass("btn-add");
		$("#cm-link-node").addClass("btn-edit");
  		$(".k-checkbox").attr("style", "display: none !important");
  		linkEnabled = false;
  		parentIDsChecked = {};
  	  }
  	});
    
    $("#select-root-node").unbind();    
    $("#select-root-node").click(function(event) {
      resetButtons();	
      $('.memoPreviewContent').scrollTop(0);
    });       
    
    $("#cm-add-node").unbind();
    $("#cm-add-node").click(function(event) {
      updatedIDs = {};
      event.preventDefault();      
      var stringBuilder = [];
      var defaultText = '[double click to enter title]';      
      var selectedNode = clearanceMemoTreeView.select();      
      if (selectedNode == null || clearanceMemoTreeView.dataItem(selectedNode) == null) {
    	var newSelectedNode = clearanceMemoTreeView.append({ "showPublic" : true, "text": defaultText, 'ignoreTitle' : false, "treePosition" : "1", "dbid" : dbCounter++});    	
    	var newPreviousNode = newSelectedNode.prev();
	  	if (clearanceMemoTreeView.dataItem(newPreviousNode) != null) {
	  	  var newSelectedNodeDataItem = clearanceMemoTreeView.dataItem(newSelectedNode);
	  	  var previousNodeDataItem = clearanceMemoTreeView.dataItem(newPreviousNode);	  	  
	  	  newSelectedNodeDataItem.treePosition = eval(eval(previousNodeDataItem.treePosition)+1);
	  	  clearanceMemoTreeView.insertAfter(newSelectedNode, newPreviousNode);
	  	}	  		  	
	  	newSelectedNode = clearanceMemoTreeView.findByUid(clearanceMemoTreeView.dataItem(newSelectedNode).uid);
	  	console.log("newSelectedNode %o ", newSelectedNode, " clearanceMemoTreeView.dataItem(newSelectedNode) %o ", clearanceMemoTreeView.dataItem(newSelectedNode));
	  	var insertNodeDataItem = clearanceMemoTreeView.dataItem(newSelectedNode);
	  	insertNodeDataItem.parentid = clearanceMemoTreeView.dataItem(newPreviousNode.parent()) == null ? rcscope.currentProductArray.clearanceMemoRootNodeId : clearanceMemoTreeView.dataItem(newPreviousNode.parent()).dbid;	  		  	 	
	  	var clearanceMemoToc = clearanceMemoObject.insertDBItem(insertNodeDataItem);	  
	  	console.log("clearanceMemoToc %o", clearanceMemoToc);
	  	insertNodeDataItem.dbid = clearanceMemoToc.childCommentId; 
		insertNodeDataItem.tocID = clearanceMemoToc.id;	 	  	
		console.log("clearanceMemoToc insertNodeDataItem %o", insertNodeDataItem);
	  	//insertNodeDataItem.trigger("change", { action: "itemchange", field: "text" });	  	
      } else {
	    var selectedDataItem = clearanceMemoTreeView.dataItem(selectedNode);
	    var treePositionString = selectedDataItem.treePosition;	    
	    console.log("selectedDataItem.dbid: %o", selectedDataItem.dbid);
	    console.log("treePositionString: %o", treePositionString.toString());	    
	    if (treePositionString != null && treePositionString.toString().indexOf("\.") > 0) {	      
		  var periodSplit = treePositionString.toString().split("\.");
		  console.log("periodSplit length: " + periodSplit.length);
		  if (periodSplit.length == 1) {
			stringBuilder.push(selectedDataItem.treePosition);
			stringBuilder.push(".1");		    
		  } else if (periodSplit.length == 2) {
			stringBuilder.push(eval(periodSplit[0]));
			stringBuilder.push(".");
			stringBuilder.push(eval(periodSplit[1]));
			stringBuilder.push(".1");			  		    
		  } else if (periodSplit.length == 3) {
			stringBuilder.push(eval(periodSplit[0]));
			stringBuilder.push(".");
			stringBuilder.push(eval(periodSplit[1]));
		    stringBuilder.push(".");
		    stringBuilder.push(eval(periodSplit[2]));
		    stringBuilder.push(".1");
		  }
      	} else {
      	  stringBuilder.push(treePositionString);
      	  stringBuilder.push(".1");      	 
      	}
	    var newSelectedNode = clearanceMemoTreeView.append({ "showPublic" : true, "linked" : false, 'ignoreTitle' : false, 'text': defaultText, 'parentid' : selectedDataItem.dbid, 'treePosition' : stringBuilder.join(""), 'checkboxid' : dbCounter++, 'dbid' : dbCounter++ }, selectedNode);
		// reselect the new node's sibling
	    stringBuilder = [];
	  	var newPreviousNode = newSelectedNode.prev();
	  	if (clearanceMemoTreeView.dataItem(newPreviousNode) != null) {
	  	  var newSelectedNodeDataItem = clearanceMemoTreeView.dataItem(newSelectedNode);
	  	  var previousNodeDataItem = clearanceMemoTreeView.dataItem(newPreviousNode);  	  
		  // get the current level of the sibling node by the number of periods in the treePosition
	  	  var treePositionString = previousNodeDataItem.treePosition;
	  	  console.log("previousNodeDataItem %o", previousNodeDataItem);
		  var periodSplit = treePositionString.toString().split("\.");
		  console.log("periodSplit %o", periodSplit);
		  // handle when it's moved to the second level
		  if (periodSplit.length == 2) {
			stringBuilder.push(eval(periodSplit[0]));
	      	stringBuilder.push(".");
	      	stringBuilder.push(eval(eval(periodSplit[1]) + 1));
		    newSelectedNodeDataItem.treePosition = stringBuilder.join("");
		  	newSelectedNodeDataItem.text = defaultText;
		  } else if (periodSplit.length == 3) {
			stringBuilder.push(eval(periodSplit[0]));
			stringBuilder.push(".");
			stringBuilder.push(eval(periodSplit[1]));
			stringBuilder.push(".");
			stringBuilder.push(eval(eval(periodSplit[2]) + 1));
			newSelectedNodeDataItem.treePosition = stringBuilder.join("");
			newSelectedNodeDataItem.text = defaultText;  
		  } else { // handle when it's moved to the third level
			stringBuilder.push(eval(periodSplit[0]));
			stringBuilder.push(".");
			stringBuilder.push(eval(periodSplit[1]));
			stringBuilder.push(".");
			stringBuilder.push(eval(periodSplit[2]));
			stringBuilder.push(".");
			stringBuilder.push(eval(eval(periodSplit[3]) + 1));
			newSelectedNodeDataItem.treePosition = stringBuilder.join("");
			newSelectedNodeDataItem.text = defaultText;  
		  }		  
		  //clearanceMemoTreeView.append(newSelectedNode, selectedNode);
		  newSelectedNodeDataItem.trigger("change", { action: "itemchange", field: "text" });
	  	}
	  	var insertNodeDataItem = clearanceMemoTreeView.dataItem(newSelectedNode);
	  	//console.log("selectedDataItem.dbid: %o", selectedDataItem.dbid);
	  	insertNodeDataItem.parentid = selectedDataItem.dbid;	  	
	  	clearanceMemoObject.insertDBItem(insertNodeDataItem);
	  	//insertNodeDataItem.trigger("change", { action: "itemchange", field: "text" });
	  	//console.log("insertNodeDataItem: %o", insertNodeDataItem);	  	
      }
      resetButtons();
    });
    
    $("#cm-levelup-node").unbind();
    $("#cm-levelup-node").click(function(event) {
      updatedIDs = {};
  	  event.preventDefault();
  	  console.log("Inside level up node");
  	  var selectedNode = clearanceMemoTreeView.select();  	  
  	  var previousNode = selectedNode.prev();
	  var currentParent = selectedNode.parent();
  	  var selectedNodeDataItem = clearanceMemoTreeView.dataItem(selectedNode);
  	  var previousNodeDataItem = clearanceMemoTreeView.dataItem(previousNode);

  	  var selTreePosition = selectedNodeDataItem.treePosition;
  	  selectedNodeDataItem.treePosition = previousNodeDataItem.treePosition;
  	  previousNodeDataItem.treePosition = selTreePosition;
  	  
  	  clearanceMemoTreeView.insertBefore(selectedNode, previousNode);  	  
  	  clearanceMemoObject.moveDBItem(selectedNodeDataItem, clearanceMemoTreeView.dataItem(currentParent));
  	  updateChildrenTreePositions(selectedNode);
  	  selectedNode = clearanceMemoTreeView.select();
  	  nextNode = selectedNode.next();  	  
  	  clearanceMemoTreeView.insertAfter(nextNode, selectedNode);
  	  //clearanceMemoObject.moveDBItem(previousNodeDataItem);
  	  updateChildrenTreePositions(nextNode);  	  
  	  resetButtons();
    });
    
    $("#cm-leveldown-node").unbind();
    $("#cm-leveldown-node").click(function(event) {
      updatedIDs = {};
	  event.preventDefault();	  
	  var selectedNode = clearanceMemoTreeView.select();	  
	  var currentParent = selectedNode.parent();	  
	  var nextNode = selectedNode.next();	  
	  var selectedNodeDataItem = clearanceMemoTreeView.dataItem(selectedNode);	  
	  var nextNodeDataItem = clearanceMemoTreeView.dataItem(nextNode);	  

	  var selTreePosition = selectedNodeDataItem.treePosition;
	  selectedNodeDataItem.treePosition = nextNodeDataItem.treePosition;
	  nextNodeDataItem.treePosition = selTreePosition;	  
	  clearanceMemoTreeView.insertAfter(selectedNode, nextNode);	  	  
	  clearanceMemoObject.moveDBItem(selectedNodeDataItem, clearanceMemoTreeView.dataItem(currentParent));	  
	  updateChildrenTreePositions(selectedNode);
	  selectedNode = clearanceMemoTreeView.select();
	  prevNode = selectedNode.prev();	  
	  clearanceMemoTreeView.insertBefore(prevNode, selectedNode);	  
	  updateChildrenTreePositions(prevNode);
	  resetButtons();
    });
      
    $("#cm-tableft-node").unbind();
    $("#cm-tableft-node").click(function(event) {
      updatedIDs = {};
	  event.preventDefault();
	  var selectedNode = clearanceMemoTreeView.select();
	  var currentParent = selectedNode.parent();
	  var selectedNodeDataItem = clearanceMemoTreeView.dataItem(selectedNode);	  	  	  	 
	  var parentNode = clearanceMemoTreeView.parent(selectedNode);	  
	  var nextNode = parentNode.next();
	  //console.log("Parent's Next seq number: " + getSelectedSequenceNumber(nextNode) + " with text: " + getSelectedText(nextNode));

	  var parentNodeDataItem = clearanceMemoTreeView.dataItem(parentNode);
	  console.log("parentNodeDataItem: " + parentNodeDataItem.dbid);
	  var stringBuilder = [];
	  var treePositionString = parentNodeDataItem.treePosition;
	  var periodSplit = treePositionString.toString().split("\.");
	  //console.log("treePositionString: " + treePositionString);
	  //console.log("periodSplit length: " + periodSplit.length);
	  // handle when it's moved to the second
	  if (periodSplit.length == 2) {
		stringBuilder.push(eval(periodSplit[0]));
		stringBuilder.push(".");
		stringBuilder.push(eval(eval(periodSplit[1])+1));
	  	selectedNodeDataItem.treePosition = stringBuilder.join("");
	  } else if (periodSplit.length == 3) {
		stringBuilder.push(eval(periodSplit[0]));
		stringBuilder.push(".");
		stringBuilder.push(eval(periodSplit[1]));
		stringBuilder.push(".");
		stringBuilder.push(eval(eval(periodSplit[2])+1));
		selectedNodeDataItem.treePosition = stringBuilder.join("");
	  } else { // handle when it's moved to the first level
		stringBuilder.push(eval(eval(treePositionString)+1));
	  	selectedNodeDataItem.treePosition = stringBuilder.join("");
	  }	  
	  clearanceMemoTreeView.insertAfter(selectedNode, parentNode);
	  rcscope = angular.element(document.getElementById("rightsController")).scope();
	  selectedNodeDataItem.parentid = clearanceMemoTreeView.dataItem(clearanceMemoTreeView.select().parent()) == null ? rcscope.currentProductArray.clearanceMemoRootNodeId : clearanceMemoTreeView.dataItem(clearanceMemoTreeView.select().parent()).dbid;
	  //console.log("treePositionString: " + treePositionString);
	  clearanceMemoObject.moveDBItem(selectedNodeDataItem, parentNodeDataItem);
	  updateChildrenTreePositions(parentNode);
	  updateChildrenTreePositions(clearanceMemoTreeView.select());
	  if (nextNode != null)
	    updateFollowingSiblingsTreePositions(nextNode, true, false);	  
	  resetButtons();
    });
    
    $("#cm-tabright-node").unbind();
    $("#cm-tabright-node").click(function(event) {
      updatedIDs = {};
  	  event.preventDefault();
  	  // append selected node as a child of the sibling
  	  var selectedNode = clearanceMemoTreeView.select();
  	  var currentParent = selectedNode.parent();
  	  var previousNode = selectedNode.prev();
  	  var nextNode = selectedNode.next();
  	  clearanceMemoTreeView.append(selectedNode, previousNode);  	  
	  // reselect the new node
  	  var newSelectedNode = clearanceMemoTreeView.select();
  	  var newSelectedNodeDataItem = clearanceMemoTreeView.dataItem(newSelectedNode);  
	  // reselect the new node's sibling
  	  var newPreviousNode = newSelectedNode.prev();  	  
  	  if (clearanceMemoTreeView.dataItem(newPreviousNode) != null) {  		  
        var previousNodeDataItem = clearanceMemoTreeView.dataItem(newPreviousNode);  	  
		// get the current level of the sibling node by the number of periods in the treePosition
        var treePositionString = previousNodeDataItem.treePosition;
	  	var periodSplit = treePositionString.toString().split("\.");	  		
		// handle when it's moved to the second level
	    var stringBuilder = [];
	    //console.log("periodSplit.length " + periodSplit.length);
	  	if (periodSplit.length == 1) {
	  	  //console.log("Moved to second level");
	      stringBuilder.push(periodSplit[0]);
	      stringBuilder.push(".1");	      
	  	  newSelectedNodeDataItem.treePosition = stringBuilder.join("");
	  	} else if (periodSplit.length == 2) { // handle when it's moved to the third level
	  	  //console.log("Moved to second level");
	  	  stringBuilder.push(periodSplit[0]);
	  	  stringBuilder.push(".");
	  	  stringBuilder.push(eval(eval(periodSplit[1]) + 1));	  	  	  	 
	  	  newSelectedNodeDataItem.treePosition = stringBuilder.join("");
	  	} else if (periodSplit.length == 3) {
	  	  //console.log("Moved to third level");
		  stringBuilder.push(periodSplit[0]);
		  stringBuilder.push(".");
		  stringBuilder.push(periodSplit[1]);
		  stringBuilder.push(".");
		  stringBuilder.push(eval(eval(periodSplit[2]) + 1));
		  newSelectedNodeDataItem.treePosition = stringBuilder.join("");
	  	} else if (periodSplit.length == 4) {
	  	  //console.log("Moved to third level");
		  stringBuilder.push(periodSplit[0]);
		  stringBuilder.push(".");
		  stringBuilder.push(periodSplit[1]);
		  stringBuilder.push(".");
		  stringBuilder.push(periodSplit[2]);
		  stringBuilder.push(".");
		  stringBuilder.push(eval(eval(periodSplit[3]) + 1));
		  newSelectedNodeDataItem.treePosition = stringBuilder.join("");
	  	}
	  	newSelectedNodeDataItem.parentid = clearanceMemoTreeView.dataItem(previousNode).dbid;
	  	clearanceMemoObject.moveDBItem(newSelectedNodeDataItem, clearanceMemoTreeView.dataItem(currentParent));	  	
	  	clearanceMemoTreeView.append(newSelectedNode, previousNode);	  		  	
  	  } else {
  		var newParentNode = newSelectedNode.parent(); 
  		var parentNodeDataItem = clearanceMemoTreeView.dataItem(newParentNode);  	  
		// get the current level of the sibling node by the number of periods in the treePosition
  		var treePositionString = parentNodeDataItem.treePosition;
	  	var periodSplit = treePositionString.toString().split("\.");	  				 
		// handle when it's moved to the second level
		var stringBuilder = [];
	  	if (periodSplit.length == 1) {  		  
	  	  stringBuilder.push(periodSplit[0]);
	  	  stringBuilder.push(".1");
	  	  newSelectedNodeDataItem.treePosition = stringBuilder.join("");
	  	} else if (periodSplit.length == 2) { // handle when it's moved to the third level	  	  
	  	  stringBuilder.push(periodSplit[0]);
		  stringBuilder.push(".");		  
		  stringBuilder.push(periodSplit[1]);
		  stringBuilder.push(".1");
	  	  newSelectedNodeDataItem.treePosition = stringBuilder.join("");
	  	} else { // handle when it's moved to the third level	  	  
	  	  stringBuilder.push(periodSplit[0]);
		  stringBuilder.push(".");		  
		  stringBuilder.push(periodSplit[1]);
		  stringBuilder.push(".");		  
		  stringBuilder.push(periodSplit[2]);
		  stringBuilder.push(".1");
	  	  newSelectedNodeDataItem.treePosition = stringBuilder.join("");
	  	} 	    	    	  
	  	//console.log("selectedNodeDataItem.treePosition " +  newSelectedNodeDataItem.treePosition);
	  	newSelectedNodeDataItem.parentid = clearanceMemoTreeView.dataItem(newParentNode).dbid;	  	
	  	clearanceMemoObject.moveDBItem(newSelectedNodeDataItem, clearanceMemoTreeView.dataItem(currentParent));
	  	clearanceMemoTreeView.append(newSelectedNode, newParentNode);	  	
  	  };	  
  	  //clearanceMemoTreeView.remove(selectedNode);
  	  updateChildrenTreePositions(clearanceMemoTreeView.select());
  	  if (nextNode != null)
  		updateFollowingSiblingsTreePositions(nextNode, false, false);  	  
  	  resetButtons();
    });
  };  
  
}

var clearanceMemoObject = new clearanceMemo();
var tocTitleEditWindow = null;
var baselineTitleEditWindow = null;
var lastSelectedDivID = null;
var storedClearanceMemoTOC = null;
var storedClearanceMemoData = null;
//var unLinkedItems = new Array();
var parentIDsChecked = {};
var updatedIDs = {};
var mappedTOCSelectedIDs = [];
var linkEnabled = false;
var removeEnabled = false;
var dbCounter = 100; // TODO Replace with actual id from DB
var currentView = "M";

function switchClearanceView(selectedView) {
  //console.log("Switching to view %o ", selectedView);
  if (selectedView == currentView) {  
	 return;
  } else {
	if (selectedView == "M") {
	  currentView = "M";
      clearanceMemoObject.showClearenceMemoView(currentView);     
 	  $("#clearance-editview-radio-m").prop('checked', true);
 	  $("#clearance-prevview-radio-m").prop('checked', true); 	   		 	        
	} else {
      currentView = "R";
	  clearanceMemoObject.showClearenceMemoView(currentView);
	  $("#clearance-editview-radio-r").prop('checked', true);
      $("#clearance-prevview-radio-r").prop('checked', true);
	}
  }
};

var entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': '&quot;',
  "'": '&#39;',
  "/": '&#x2F;'
};

function escapeHtml(string) {
  return String(string).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  });
}
  
function removeMemoSidePanelIndicatorResponses() {
  $("#memo-sidepanel-response").removeClass("displayInline");
  $("#memo-sidepanel-spinner").removeClass("displayInline");
  $("#memo-sidepanel-check").removeClass("displayInline");
  $("#memo-sidepanel-spinner-message").removeClass("tocErrorClass");
  $("#memo-sidepanel-response").removeClass("successClass");
  $("#memo-sidepanel-response").removeClass("deletedClass");	
}
function startMemoSidePanelIndicatorResponses() {
  removeMemoSidePanelIndicatorResponses();
  $("#memo-sidepanel-response").addClass("displayInline");
  $("#memo-sidepanel-spinner").addClass("displayInline");
}  

function checkRightStrands(mappedIds, shouldCheck) {	  	
	var productInfoCodeIds = [];
	var mappedRightStrandRestrictionIds = [];
	var mappedRightStrandIds = [];
	//console.log("checkRightStrands: mappedIds %o", mappedIds);
	for (var i = 0; i < mappedIds.length; i++) {
	  if (clearanceMemoObject.mappedProductInfoCodes[mappedIds[i]] != null) {
		for (var j = 0; j < clearanceMemoObject.mappedProductInfoCodes[mappedIds[i]].length; j++) {
		  productInfoCodeIds.push(clearanceMemoObject.mappedProductInfoCodes[mappedIds[i]][j]);	
		}			
	  }
	  if (clearanceMemoObject.mappedRightStrandRestrictions[mappedIds[i]] != null) {
		for (var j = 0; j < clearanceMemoObject.mappedRightStrandRestrictions[mappedIds[i]].length; j++) {
		  mappedRightStrandRestrictionIds.push(clearanceMemoObject.mappedRightStrandRestrictions[mappedIds[i]][j]);	
		}		
	  }
	  if (clearanceMemoObject.mappedRightStrands[mappedIds[i]] != null) {
	    for (var j = 0; j < clearanceMemoObject.mappedRightStrands[mappedIds[i]].length; j++) {
	      mappedRightStrandIds.push(clearanceMemoObject.mappedRightStrands[mappedIds[i]][j]);	
		}		
	  }
	}
    var rcscope = angular.element(document.getElementById("rightsController")).scope();
    if (mappedRightStrandRestrictionIds.length > 0) {      
  	  gridStrandsConfigurator.checkSelectedRightStrandRestrictions(mappedRightStrandRestrictionIds, shouldCheck);
  	  var strandRestrictionMap = gridStrandsConfigurator.getStrandsMapByRestrictionIds(mappedRightStrandRestrictionIds);  	  
  	  var rightStrandIds = [];
  	  console.log("strandRestrictionMap %o", strandRestrictionMap);
  	  console.log("mappedRightStrandRestrictionIds %o", mappedRightStrandRestrictionIds);
	  for (var i = 0; i < mappedRightStrandRestrictionIds.length; i++) {
		if (strandRestrictionMap && strandRestrictionMap[mappedRightStrandRestrictionIds[i]] != null && $.inArray(strandRestrictionMap[mappedRightStrandRestrictionIds[i]], rightStrandIds) == -1) {
	 	  rightStrandIds.push(strandRestrictionMap[mappedRightStrandRestrictionIds[i]]);	
	    }
	  }
	  console.log("rightStrandIds %o", rightStrandIds);
	  gridStrandsConfigurator.expandPassedStrands(rightStrandIds);
  	}
    if (mappedRightStrandIds.length > 0) {
	  gridStrandsConfigurator.checkSelectedRightStrandElements(mappedRightStrandIds, shouldCheck);
	  if (shouldCheck)
	    gridStrandsConfigurator.selectStrandsInGrid(mappedRightStrandIds);
	}
    console.log("checkRightStrands: productInfoCodeIds %o", productInfoCodeIds);
	if (productInfoCodeIds.length > 0) {
	  rcscope.productInfoCodesShow = true;
	  if (rcscope.$root.$$phase != '$apply' && rcscope.$root.$$phase != '$digest') {
		rcscope.$apply();
	  }	  
	  productRestrictionsGridConfigurator.checkSelectedProductRestrictions(productInfoCodeIds, shouldCheck);
	  if (shouldCheck)
	    productRestrictionsGridConfigurator.selectRestrictionsInGrid(productInfoCodeIds);
	}	
}

function showStrandsMapped() { 	
	strands.selections.clearAll();
	gridStrandsConfigurator.unCheckRightStrandElements();
	gridStrandsConfigurator.unCheckRightStrandRestrictions();
	productRestrictionsGridConfigurator.unCheckProductRestrictions();
	var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();    	  
	ermSidePanelScope.checkedStrandsAndCodesObj = {};
	if (ermSidePanelScope.$root.$$phase != '$apply' && ermSidePanelScope.$root.$$phase != '$digest') {
	  ermSidePanelScope.$apply();
	}
	checkRightStrands(mappedTOCSelectedIDs, true);
	strands.toggleMapUnmapButtons();
}

function showMappedCheckedItems() { 	
  mappedTOCSelectedIDs = [];
  var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();
  $('.ermSideClearanceTOCSelectArea li').each(function() {    
	$(this).removeClass('backgroundColorHighlight');	    
	if (ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandIds.length > 0) {		
	  for (var i = 0; i < ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandIds.length; i++) {
        var inArray = $.inArray(ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandIds[i],clearanceMemoObject.mappedRightStrands[this.id])>=0;
        if (inArray) {
          $(this).addClass('backgroundColorHighlight');
          mappedTOCSelectedIDs.push(this.id);
	    }
	  }
	}
	if (ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandRestrictionIds.length > 0) {
	  for (var i = 0; i < ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandRestrictionIds.length; i++) {
        var inArray = $.inArray(ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandRestrictionIds[i], clearanceMemoObject.mappedRightStrandRestrictions[this.id])>=0;
        if (inArray) { 
      	  $(this).addClass('backgroundColorHighlight');
      	  mappedTOCSelectedIDs.push(this.id);
        }
	  }
	}
	if (ermSidePanelScope.checkedStrandsAndCodesObj.productInfoCodeIds.length > 0) {
	  for (var i = 0; i < ermSidePanelScope.checkedStrandsAndCodesObj.productInfoCodeIds.length; i++) {
	    var inArray = $.inArray(ermSidePanelScope.checkedStrandsAndCodesObj.productInfoCodeIds[i], clearanceMemoObject.mappedProductInfoCodes[this.id])>=0;
	    if (inArray) {
	      $(this).addClass('backgroundColorHighlight');
	      mappedTOCSelectedIDs.push(this.id);
	    }
	  }
	}	
  });
}

function mapClearanceTOCItems() {
	var rcscope = angular.element(document.getElementById("rightsController")).scope();
	startMemoSidePanelIndicatorResponses();
	var permissionCheckFailed = false;
	var permissionError = "";
    var url = paths().getClearanceMemoMapRESTPath();
    console.log("url: " + url);
	console.log("mappedTOCSelectedIDs: %o" + mappedTOCSelectedIDs);
	var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();
    var jsonData = {
      'commentIds': mappedTOCSelectedIDs,
      'strandIds' : ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandIds,
      'strandRestrictionIds' : ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandRestrictionIds,
      'productInfoCodes' : ermSidePanelScope.checkedStrandsAndCodesObj.productInfoCodeIds 	
    };
    if (ermSidePanelScope.checkedStrandsAndCodesObj.productInfoCodeMap != null) {
	    for (var mappedStrand in ermSidePanelScope.checkedStrandsAndCodesObj.productInfoCodeMap) {    		
			if (ermSidePanelScope.checkedStrandsAndCodesObj.productInfoCodeMap[mappedStrand].isBusiness && !ermSidePanelScope.checkedStrandsAndCodesObj.productInfoCodeMap[mappedStrand].isLegal && rcscope.security.canModifyClearanceMemos) {    			
				permissionCheckFailed = true;
				permissionError = "Sorry, but you do not have permission to map business product code: " + ermSidePanelScope.checkedStrandsAndCodesObj.productInfoCodeMap[mappedStrand].description;
				break;
			}
			if (ermSidePanelScope.checkedStrandsAndCodesObj.productInfoCodeMap[mappedStrand].isLegal && !ermSidePanelScope.checkedStrandsAndCodesObj.productInfoCodeMap[mappedStrand].isBusiness && !rcscope.security.canModifyClearanceMemos) {    			
				permissionCheckFailed = true;
				permissionError = "Sorry, but you do not have permission to map legal product code: " + ermSidePanelScope.checkedStrandsAndCodesObj.productInfoCodeMap[mappedStrand].description;
				break;
			}
	    }
    }
    if (ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandRestrictionMap != null) {
	    for (var mappedStrand in ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandRestrictionMap) {    		
			if (ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandRestrictionMap[mappedStrand].isBusiness && !ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandRestrictionMap[mappedStrand].isLegal && rcscope.security.canModifyClearanceMemos) {    			
				permissionCheckFailed = true;
				permissionError = "Sorry, but you do not have permission to map business right strand informational codes: " + ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandRestrictionMap[mappedStrand].description;
				break;
			}
			if (ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandRestrictionMap[mappedStrand].isLegal && !ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandRestrictionMap[mappedStrand].isBusiness && !rcscope.security.canModifyClearanceMemos) {    			
				permissionCheckFailed = true;
				permissionError = "Sorry, but you do not have permission to map legal right strand informational codes: " + ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandRestrictionMap[mappedStrand].description;
				break;
			}
		}
    }
    if (ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandMap != null) {
	    for (var mappedStrand in ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandMap) {
			if (ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandMap[mappedStrand].isBusiness && !ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandMap[mappedStrand].isLegal && rcscope.security.canModifyClearanceMemos) {    			
				permissionCheckFailed = true;
				permissionError = "Sorry, but you do not have permission to map business right strand: " + ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandMap[mappedStrand].description;
				break;
			}
			if (ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandMap[mappedStrand].isLegal && !ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandMap[mappedStrand].isBusiness && !rcscope.security.canModifyClearanceMemos) {    			
				permissionCheckFailed = true;
				permissionError = "Sorry, but you do not have permission to map legal right strand: " + ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandMap[mappedStrand].description;
				break;
			}
		}
    }
    
    if (permissionCheckFailed) {
  	  errorPopup.showErrorPopupWindow(permissionError);
    } else {
		console.log("jsonData: %o", jsonData);
		$("#memo-sidepanel-spinner-message").html("Mapping...");
	    $.post(url, JSON.stringify(jsonData), function(){      	  
		  $("#memo-sidepanel-response").addClass("successClass");	    	
		  $("#memo-sidepanel-check").addClass("displayInline");
		  $("#memo-sidepanel-spinner-message").html("Mapped - Reloading...");			    		  
		  productRestrictionsGridConfigurator.mapInfoCodes(ermSidePanelScope.checkedStrandsAndCodesObj.productInfoCodeIds, true);
		  gridStrandsConfigurator.mapRightStrandRestriction(ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandIds, true, true);
		  gridStrandsConfigurator.mapRightStrandRestriction(ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandRestrictionIds, false, true);
		  //resetMappedTOCItems();
		  setTimeout(function() {
			$("#memo-sidepanel-check").removeClass("displayInline");
			$("#memo-sidepanel-spinner").removeClass("displayInline");
			$("#memo-sidepanel-response").removeClass("displayInline");		  
		  }, erm.statusIndicatorTime);
		  clearanceMemoObject.loadClearenceMemoPreview();
		}).fail(function(xhr,status,message,rcscope){
		  console.log("Failed to acknowledge update.");
		  // Add indicator to screen for user	  		  
		  $("#memo-sidepanel-spinner-message").html("Problem Mapping");
		});
    }
}

function resetMappedTOCItems() {
  var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();
  gridStrandsConfigurator.unCheckRightStrandElements();
  gridStrandsConfigurator.unCheckRightStrandRestrictions();
  productRestrictionsGridConfigurator.unCheckProductRestrictions();		
  ermSidePanelScope.checkedStrandsAndCodesObj.productInfoCodeIds = [];
  ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandIds = [];
  ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandRestrictionIds = [];		 
  strands.selections.strandIdsWithRestrictions = [];
  strands.selections.strandIds = [];
  strands.selections.strandRestrictionIds = [];
  strands.selections.productRestrictionIds = [];
  mappedTOCSelectedIDs = [];
  $("#ermSideClearanceMap").addClass("hideControls");
  $("#ermSideClearanceUnmap").addClass("hideControls");
  $("#ermSideClearanceShowMapped").addClass("hideControls");
  $("#ermSideClearanceShowMappedStrands").addClass("hideControls");
}

function unMapClearanceTOCItems() {
	startMemoSidePanelIndicatorResponses();
    var url = paths().getClearanceMemoUnMapRESTPath();
    var rcscope = angular.element(document.getElementById("rightsController")).scope();
    var ermSidePanelScope = angular.element(document.getElementById("ermSidePanelController")).scope();
	var permissionCheckFailed = false;
	var permissionError = "";
    console.log("url: " + url);
	console.log("mappedTOCSelectedIDs: %o" + mappedTOCSelectedIDs);		   	   
    var jsonData = {
      'commentIds': mappedTOCSelectedIDs,
      'strandIds' : ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandIds,
      'strandRestrictionIds' : ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandRestrictionIds,
      'productInfoCodes' : ermSidePanelScope.checkedStrandsAndCodesObj.productInfoCodeIds 	
    };
    for (var mappedStrand in ermSidePanelScope.checkedStrandsAndCodesObj.productInfoCodeMap) {    	
		if (ermSidePanelScope.checkedStrandsAndCodesObj.productInfoCodeMap[mappedStrand].isBusiness && !ermSidePanelScope.checkedStrandsAndCodesObj.productInfoCodeMap[mappedStrand].isLegal && rcscope.security.canModifyClearanceMemos) {    			
			permissionCheckFailed = true;
			permissionError = "Sorry, but you do not have permission to unmap business product code: " + ermSidePanelScope.checkedStrandsAndCodesObj.productInfoCodeMap[mappedStrand].description;
			break;
		}
		if (ermSidePanelScope.checkedStrandsAndCodesObj.productInfoCodeMap[mappedStrand].isLegal && !ermSidePanelScope.checkedStrandsAndCodesObj.productInfoCodeMap[mappedStrand].isBusiness && !rcscope.security.canModifyClearanceMemos) {    			
			permissionCheckFailed = true;
			permissionError = "Sorry, but you do not have permission to unmap legal product code: " + ermSidePanelScope.checkedStrandsAndCodesObj.productInfoCodeMap[mappedStrand].description;
			break;
		}
	}    
    for (var mappedStrand in ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandRestrictionMap) {    		
		if (ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandRestrictionMap[mappedStrand].isBusiness && !ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandRestrictionMap[mappedStrand].isLegal && rcscope.security.canModifyClearanceMemos) {    			
			permissionCheckFailed = true;
			permissionError = "Sorry, but you do not have permission to unmap business right strand informational codes: " + ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandRestrictionMap[mappedStrand].description;
			break;
		}
		if (ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandRestrictionMap[mappedStrand].isLegal && !ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandRestrictionMap[mappedStrand].isBusiness && !rcscope.security.canModifyClearanceMemos) {    			
			permissionCheckFailed = true;
			permissionError = "Sorry, but you do not have permission to unmap legal right strand informational codes: " + ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandRestrictionMap[mappedStrand].description;
			break;
		}
	}    
    for (var mappedStrand in ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandMap) {    		    	
		if (ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandMap[mappedStrand].isBusiness && !ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandMap[mappedStrand].isLegal && rcscope.security.canModifyClearanceMemos) {    			
			permissionCheckFailed = true;
			permissionError = "Sorry, but you do not have permission to unmap business right strand: " + ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandMap[mappedStrand].description;
			break;
		}
		if (ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandMap[mappedStrand].isLegal && !ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandMap[mappedStrand].isBusiness && !rcscope.security.canModifyClearanceMemos) {    			
			permissionCheckFailed = true;
			permissionError = "Sorry, but you do not have permission to unmap legal right strand: " + ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandMap[mappedStrand].description;
			break;
		}
	}
    if (permissionCheckFailed) {
    	errorPopup.showErrorPopupWindow(permissionError);
    } else {
    	$("#memo-sidepanel-spinner-message").html("UnMapping...");
	    $.post(url, JSON.stringify(jsonData), function(){      	  
		  $("#memo-sidepanel-response").addClass("successClass");	    	
		  $("#memo-sidepanel-check").addClass("displayInline");	  
		  $("#memo-sidepanel-spinner-message").html("UnMapped - Reloading...");
		  setTimeout(function() {
			$("#memo-sidepanel-check").removeClass("displayInline");
			$("#memo-sidepanel-spinner").removeClass("displayInline");
			$("#memo-sidepanel-response").removeClass("displayInline");		  
		  }, erm.statusIndicatorTime);
		  clearanceMemoObject.loadClearenceMemoPreview();		  
		  productRestrictionsGridConfigurator.mapInfoCodes(ermSidePanelScope.checkedStrandsAndCodesObj.productInfoCodeIds, false);
		  gridStrandsConfigurator.mapRightStrandRestriction(ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandIds, true, false);
		  gridStrandsConfigurator.mapRightStrandRestriction(ermSidePanelScope.checkedStrandsAndCodesObj.rightStrandRestrictionIds, false, false);
		  //resetMappedTOCItems();
		  console.log("Inside unMapClearanceTOCItems checkedStrandsAndCodesObj %o ", ermSidePanelScope.checkedStrandsAndCodesObj);
		}).fail(function(xhr,status,message,rcscope){
		  console.log("Failed to acknowledge update.");
		  // Add indicator to screen for user	  		  
		  $("#memo-sidepanel-spinner-message").html("Problem UnMapping");
		});
    }
}

function acknowledgeUpdate(){
	startMemoSidePanelIndicatorResponses();
    var url = paths().getClearanceMemoNodeAcknowledgeRESTPath();
	console.log("url: " + url);
	console.log("mappedTOCSelectedIDs: %o" + mappedTOCSelectedIDs);		
	$("#memo-sidepanel-spinner-message").html("Acknowledging...");
    var jsonData = {
      'commentIds': mappedTOCSelectedIDs
    };
	if (eval(mappedTOCSelectedIDs.length) > 0) {
		$.post(url, JSON.stringify(jsonData), function(){
	      console.log("Acknowledged updates");	      
		  $("#memo-sidepanel-spinner").removeClass("displayInline");
		  $("#memo-sidepanel-response").addClass("successClass");	    	
		  $("#memo-sidepanel-check").addClass("displayInline");
		  $("#memo-sidepanel-spinner-message").html("Acknowledged");		    
		  setTimeout(function() {
			$("#memo-sidepanel-check").removeClass("displayInline");
			$("#memo-sidepanel-spinner").removeClass("displayInline");
			$("#memo-sidepanel-response").removeClass("displayInline");		  
		  }, erm.statusIndicatorTime);
		  for (var i = 0; i < mappedTOCSelectedIDs.length; i++)
			$("#" + mappedTOCSelectedIDs[i]).removeClass("notAcknowledgedBackgroundColorHighlight");		  
		  if (mappedTOCSelectedIDs.length > 1)
			$(".ermSideClearanceMemoSectionTextArea").html("Multiple TOC sections selected.  Select individual TOC sections to see version differences.");
		  else 
			clearanceMemoObject.loadClearenceMemoPreview();		  
		  mappedTOCSelectedIDs = [];    	      	
		}).fail(function(xhr,status,message,rcscope){
		  console.log("Failed to acknowledge update.");
		  // Add indicator to screen for user	  		  
		  $("#memo-sidepanel-spinner-message").html("Problem acknowledging update");
		});
	} else {	  	 
	  $("#memo-sidepanel-spinner-message").html("No comments selected for acknowledgment.");
	}
};

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }

function unEcapeHtml(unsafe) {
    return unsafe         
         .replace(/&lt;/g, "<")
         .replace(/&gt;/g, ">")
    	 .replace(/&amp;/g, "&")
    	 .replace(/&quot;/g, "\"")
         .replace(/&#039;/g, "'");
 }

function replaceWithNewLine(content) {	
	//console.log("Before replacing %o", content);
	content = content.replace(/(<\/p>)/gi, "\\n");
	content = content.replace(/(<\/br>)/gi, "\\n");
	content = content.replace(/(<br\s*\/>)/gi, "\\n");
	//console.log("After replacing %o", content);
	content = content.replace(/(<\/?[^>]+>)/gi, '');	
	return content;
}

function replaceNewLineWithBreaks(content) {		
	content = content.replace(/\\n/gi, "<br/>");	
	return content;
}

function loadClearanceTextForSidePanel(passedID, loadVersions) {
	startMemoSidePanelIndicatorResponses();
    var url = loadVersions ? paths().getClearanceMemoNodeCommentVersionsRESTPath() + passedID : paths().getClearanceMemoNodeCommentRESTPath() + passedID;	
	//$('#mappingTOC_' + passedID).addClass('backgroundColorHighlight');
	if (eval(mappedTOCSelectedIDs.length) == 1) {
		$("#memo-sidepanel-spinner-message").html("Loading...");
		$(".ermSideClearanceTOCSelectArea li").css("cursor", "wait");	
		$.get(url, function(data){
	      console.log("loaded clearence memo comment(s): %o", data);
	      if (data.length > 1) {
	    	$(".ermSideClearanceMemoSectionTextArea").html("");
	    	var dmp = new diff_match_patch();
	    	var oldContent = data[1].longDescription != null ? replaceWithNewLine(data[1].longDescription) : "";
	    	var newContent = data[0].longDescription != null ? replaceWithNewLine(data[0].longDescription) : "";	    	
	    	var diff = dmp.diff_main(oldContent, newContent);
	    	//dmp.diff_cleanupSemantic(diff);
	    	for (var i = 0; i < data.length; i++) {
	    	  var d = new Date(data[i].updateDate);	    	  
	    	  var longDescription = data[i].longDescription;
	    	  if (i == 0) {
	    	    longDescription = dmp.diff_prettyHtml(diff);
	    	    longDescription = unEcapeHtml(longDescription);
	    	    longDescription = replaceNewLineWithBreaks(longDescription);
	    	  }
	    	  //console.log("longDescription " + longDescription);
	          $(".ermSideClearanceMemoSectionTextArea").html($(".ermSideClearanceMemoSectionTextArea").html() + 
	        		  "<span class=\"ermSideClearanceMemoVersionTitle\">" + (data[i].shortDescription != null ? data[i].shortDescription : "") + 
	        		  (data[i].shortDescription != null ? " (" + eval(d.getMonth()+1) + "/" + d.getDate() + "/" + d.getFullYear() + ")</span>" : "") + 
	        		  "<BR/>" + longDescription + "<BR/><BR/>");
	    	}
	      } else {
	    	var d = new Date(data.updateDate);
	    	if (data.longDescription != null)
	    	 $(".ermSideClearanceMemoSectionTextArea").html("<span class=\"ermSideClearanceMemoVersionTitle\">" + (data.shortDescription != null ? data.shortDescription : "")  + 
	    			 (data.shortDescription != null ? " (" + eval(d.getMonth()+1) + "/" + d.getDate() + "/" + d.getFullYear() + ")</span>" : "") + 
	        		  "<BR/>" + data.longDescription);
	    	else
	    	  $(".ermSideClearanceMemoSectionTextArea").html("");	
	      }
		  $("#memo-sidepanel-spinner").removeClass("displayInline");
		  $("#memo-sidepanel-response").addClass("successClass");	    	
		  $("#memo-sidepanel-check").addClass("displayInline");
		  $("#memo-sidepanel-spinner-message").html("Loaded");		  
		  $(".ermSideClearanceTOCSelectArea li").css("cursor", "pointer");
		  setTimeout(function() {
			$("#memo-sidepanel-check").removeClass("displayInline");
			$("#memo-sidepanel-spinner").removeClass("displayInline");
			$("#memo-sidepanel-response").removeClass("displayInline");		  
		  }, erm.statusIndicatorTime);
		}).fail(function(xhr,status,message,rcscope){
		  console.log("Failed to load message text.");
		  // Add indicator to screen for user	  
		  $("#memo-sidepanel-spinner").removeClass("displayInline");
		  $("#memo-sidepanel-spinner-message").html("Problem Loading TOC Text");
		  document.body.style.cursor='default';
		});
	} else {
	  $("#memo-sidepanel-response").removeClass("displayInline");		 
	  $(".ermSideClearanceTOCSelectArea li").css("cursor", "pointer");
	  $(".ermSideClearanceMemoSectionTextArea").html("Multiple TOC sections selected.  Select individual TOC sections to see version differences.");
	}
};

function processSaveTOCAttachments() {
	console.log("Inside save TOC attachments");
	var selectedNode = clearanceMemoTreeView.select();  
    var tocID = clearanceMemoTreeView.dataItem(selectedNode).dbid;
    console.log("tocID " + tocID);
}

function maximizeEditor() {
	$(".clearanceMemoEditor").addClass("clearanceMemoEditorMax");	
	$("#editorMinimize").css("display", "inline-block");
	$("#editorMaximize").css("display", "none");		
	$(".memoTextControls").css("padding", "0.5%");	
	$(".memoTextControls").css("margin-bottom", "0");
	$(".memoTextControls").css("width", "98%");
	$(".memoTextControls").css("display", "none");
	$(".k-ie .memoTextControls").css("margin-top", "0");
	$(".k-ie .memoTextControls").css("display", "none");
	$("table.k-editor").css("margin-top", "0");
	$("table.k-editor").css("width", "98%");
	$("table.k-editor").css("height", "560px");
	$(".k-ie table.k-editor").css("margin-top", "0");
	$(".k-ie table.k-editor").css("margin-left", "0");
	$(".k-ie table.k-editor").css("height", "550px");
}

function minizeEditor() {
	$(".clearanceMemoEditor").removeClass("clearanceMemoEditorMax");	
	$("#editorMinimize").css("display", "none");
	$("#editorMaximize").css("display", "inline-block");	 
	$("table.k-editor").css("margin-top", "10%");	
	$(".memoTextControls").css("padding", "2.5%");
	$(".memoTextControls").css("margin-top", "2%");
	$(".memoTextControls").css("margin-bottom", "1%");
	$(".memoTextControls").css("display", "inline-block");	
	$(".k-ie .memoTextControls").css("margin-top", "2%");
	$("table.k-editor").css("width", "auto");	
	$("table.k-editor").css("height", "425px");
	$(".k-ie table.k-editor").css("margin-top", "2%");
	$(".k-ie table.k-editor").css("margin-left", "0");
	$(".k-ie table.k-editor").css("height", "375px");
}

function popAttachments() {
  console.log("Inisde popattachmets");
  var selectedNode = clearanceMemoTreeView.select();  
  if (selectedNode != null && clearanceMemoTreeView.dataItem(selectedNode) != null) {
	var commentId = clearanceMemoTreeView.dataItem(selectedNode).dbid;
	var attachments = clearanceMemoTreeView.dataItem(selectedNode).attachments;
	commentsAndAttachmentsObject.openCMAttachmentsPopupWindow(processSaveTOCAttachments, commentId, attachments);
  } else {
	$("#memo-text-response").addClass("displayInline");
	$("#memo-text-spinner-message").addClass("tocErrorClass");
	$("#memo-text-spinner-message").html("You must select an entry in the TOC");
  }	
}