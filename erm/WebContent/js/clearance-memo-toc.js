var lastSelectedDivID = null;

function hilightClearanceSection(selectedID) {
	//HIGHLIGHT SELECTED AREA IN PREVIEW WINDOW
	if (lastSelectedDivID != null)
	  $("#" + lastSelectedDivID).removeClass("selectedContent");	  
	lastSelectedDivID = selectedID;
	$("#" + selectedID).addClass("selectedContent");
	// SCROLL TO SELECTED AREA
	$('.memoPreviewContent').scrollTop(0);
	console.log("selected id: " + selectedID);
	console.log("selected id position: " + $("#" + selectedID).position().top);
	if ($("#" + selectedID) != null && $("#" + selectedID).position() != null) {
	    $("html, body").animate( {
		    scrollTop: eval($("#"+selectedID).position().top - 200)
		  }, 'fast');
	}
}

function setupToolbarButtons() {
  $("#print-clearance-memo").click(function(event) {
    event.preventDefault();
    var url = paths().getClearanceHTMLRESTPath() + foxVersionId;
    url = "/erm/" + url + "/true/false/true" + "/" + foxVersionId + ".html";
    var isFoxipediaSearch = false;
    if (this.getAttribute('is-foxipedia-search')==='true') {
    	isFoxipediaSearch = true;
    }
    if (isFoxipediaSearch) {
    	url = url + '?isFoxipediaSearch=true';
    }    
    window.open(url);
  });
	
  $("#download-clearance-memo").click(function(event) {
    event.preventDefault();
    var isFoxipediaSearch = false;
    if (this.getAttribute('is-foxipedia-search')==='true') {
    	isFoxipediaSearch = true;
    }
    
    var url = paths().getClearancePDFRESTPath() + foxVersionId;
    url = "/erm/" + url + "/true" + "/" + foxVersionId + ".pdf";
    if (isFoxipediaSearch) {
    	url = url + '?isFoxipediaSearch=true';
    }
    
    window.open(url);
  });
  
  $("#print-comments").click(function(event) {
	event.preventDefault();
	window.print();
  });
		
  $("#download-comments").click(function(event) {
	event.preventDefault();
	var url = paths().getCommentsPDFRESTPath() + foxVersionId;
	console.log("url: " + url);
	window.open("/erm/" + url + "/" + grantCodeId + "/comments.pdf");
  });
}