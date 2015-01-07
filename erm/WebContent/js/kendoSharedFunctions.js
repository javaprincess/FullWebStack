var currentTooltip = "";

function clearDelConfirmButtons() {
	$("#delete-right-strands-confirm").removeClass("forceShow");
	$("#delete-product-info-restriction-confirm").removeClass("forceShow");
	$("#delete-clearance-memo-confirm").removeClass("forceShow");
	$("#delete-attachment-confirm").removeClass("forceShow");
	$("#delete-contractualparty-confirm	").removeClass("forceShow");	
};

function showDeleteConfirmationWindow(){
	var d = $("#deleteConfirmationWindow").data("kendoWindow");
	d.setOptions({
		visible : true,
		modal : true
	});
	d.center();
	d.open();		
};	

function closeDeleteConfirmationWindow(){
	var d = $("#deleteConfirmationWindow").data("kendoWindow");
	d.close();		
};	

function showSubmitPopupWindow(){	
	if (!$("#submitPopupWindow").data("kendoWindow")) {
		  $("#submitPopupWindow").kendoWindow({
	        width: "450px",
	        height : "150px",
	        minWidth : "450px",
	        minHeight : "150px",
	        title: "",
	        actions: [],
	        visible : false,
	        close: function(e) {          
	        }
	      });
	}	
	var d = $("#submitPopupWindow").data("kendoWindow");
	d.setOptions({
		visible : true,
		modal : true
	});
	d.center();
	d.open();		
};	

function closeSubmitPopupWindow(){
	var d = $("#submitPopupWindow").data("kendoWindow");
	d.close();		
};	

function showErrorPopupWindow(textToShow){
	clearDelConfirmButtons();
	$("#errorParagraph").html(textToShow);
	var d = $("#errorPopupWindow").data("kendoWindow");
	d.setOptions({
		visible : true,
		modal : true
	});
	d.center();
	d.open();		
};

function showLoadingPopupWindow(){
	try {
		if (!$("#loadingPopupWindow").data("kendoWindow")) {
		  $("#loadingPopupWindow").kendoWindow({
	        width: "450px",
	        height : "150px",
	        minWidth : "450px",
	        minHeight : "150px",
	        title: "",
	        actions: [],
	        visible : false,
	        close: function(e) {          
	        }
	      });
		}		
		var d = $("#loadingPopupWindow").data("kendoWindow");
		if (d) {
		  d.setOptions({
			visible : true,
			modal : true
		  });
		  d.center();
		  d.open();
		}
	} catch (e) {		
	}
};	

function closeLoadingPopupWindow(){	
  var d = $("#loadingPopupWindow").data("kendoWindow");
  if (d)
    d.close();	
};	


function showVideoPopupWindow(){	
	try {
		if (!$("#videoPopupWindow").data("kendoWindow")) {
		  $("#videoPopupWindow").kendoWindow({
	        width: "90%",	        	       
	        actions: ["Close"],
	        visible : false,
	        close: function(e) {          
	        }
	      });
		}		
		var d = $("#videoPopupWindow").data("kendoWindow");
		if (d) {
		  d.setOptions({
			visible : true,
			modal : true
		  });
		  d.center();
		  d.open();
		}
	} catch (e) {		
	}
};	

function closeVideoPopupWindow(){	
  var d = $("#videoPopupWindow").data("kendoWindow");
  if (d)
    d.close();	
};

function getCorrectStrandDate(date){
	if(date){			
		var ms = date.getTime(); // - (date.getTimezoneOffset() * 60 * 1000);
		var d = new Date(ms);
		return d;
	}
	return date;
};

function getProperlyFormattedDate(date){
	if(date){
		var d = date.getDate();
		var m = date.getMonth() + 1;
		var y = date.getFullYear();
		
		var day = (d < 10) ? "0"+d : d;
		var month = (m < 10) ? "0"+m : m;
		var year = y;
		
		return ""+month+"/"+day+"/"+year;
	}
	return null;
};

function truncateStringSize(string, size){
	if(string && size && string.length > size){
		return string.substring(0, (size - 3)) + "...";
	}
	else {
		return (string == null ? "" : string);
	}
}

function setInvalidDateFromat(id) {
  $("#" + id).css("border", "2px solid red");
  $("#" + id).tooltip('enable');
  $("#" + id).tooltip('show');  
  $("#" + id).tooltip({html: true});
}

function setValidDateFromat(id) {
  $("#" + id).css("border" , "thin inset");
  $("#" + id).tooltip('disable');
  $("#" + id).tooltip('hide');
}

function showToolTip(element) {
  if (currentTooltip != "" && currentTooltip != element) {
    $(currentTooltip).popover('hide');
  }
  $(element).popover('show');
  currentTooltip = element;
}

function validatePhone(field) {
	var pattern = /^\(\d{3}\)\s*\d{3}(?:-|\s*)\d{4}$/;
	if (pattern.test(field)) { 			    
      return true;
    } 
    return false;
}

function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 

function checkValidDateFormat(dateString, id) {
	console.log("checkValidDateFormat dateString " + dateString);	
	
	if (dateString.trim() == "") {
	  setValidDateFromat(id);
	  return true;
	}
	
    // First check for the pattern
    if(!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      setInvalidDateFromat(id);
	  return false;
    }

    // Parse the date parts to integers
    var parts = dateString.split("/");
    var day = parseInt(parts[1], 10);
    var month = parseInt(parts[0], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if(year < 1000 || year > 3000 || month == 0 || month > 12) {
      setInvalidDateFromat(id);
  	  return false;
    }

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
        monthLength[1] = 29;

    // Check the range of the day
    if (day > 0 && day <= monthLength[month - 1]) {
      setValidDateFromat(id);
      return true;
    } else {
      setInvalidDateFromat(id);
      return false;
    }
}

function trimWhiteSpaces(value, id) {
  console.log("trimWhiteSpaces " + value);
  $("#" + id).val(value.replace(/^\s\s*/, '').replace(/\s\s*$/, ''));
}

/**
 * 
 * @param calendarId
 * @returns
 */
function getCorrectDateFromKendoDatePicker(calendarId){
	if(calendarId){
		var cal = $("#"+calendarId);
		if(cal){
			var calValue = cal.val();
			var kc = cal.data("kendoDatePicker");
			if(kc && kc.value()){
				return getCorrectStrandDate(new Date(Date.parse(kc.value())));
			}
			else if(calValue){
				return getCorrectStrandDate(new Date(Date.parse(calValue)));
			}
		}
		
	}
	return null;
}

function getCorrectDateFromKendoDatePickerAsString(calendarId){
	if(calendarId){
		var cal = $("#"+calendarId);
		if(cal){
			var calValue = cal.val();
			var kc = cal.data("kendoDatePicker");
			var dat = null;
			if(kc && kc.value()){
				dat = new Date(Date.parse(kc.value()));				
			}
			else if(calValue){
				dat = new Date(Date.parse(calValue));
			}
			
			if(dat){
				var d = dat;
				var year = d.getFullYear();
				var month = (d.getMonth() + 1);
				month = month < 10 ? "0"+month : "" + month;
				var day = d.getDate();
				day = day < 10 ? "0"+day : "" + day;
				
				return ""+year+"-"+month+"-"+day;
			}
		}
		
	}
	return null;
}

function json_deserialize_helper(key,value) {
  if ( typeof value === 'string' ) {
    var regexp;
    regexp = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/.exec(value);
    if ( regexp ) {
      return new Date(value);
    }
  }
  return value;
}

function allTerritoryActive(rightStrandMap){
	var active = 0;
	if(rightStrandMap){    			
		for(var mappedStrand in rightStrandMap){
			if(rightStrandMap[mappedStrand].strand.territory.activeFlag == 'Y'){
				active = active | 2;    					
			}
			if(rightStrandMap[mappedStrand].strand.territory.activeFlag == 'N'){
				active = active | 1;
			}
			
			if(((active & 2) == 2) && ((active & 1) == 1)){
				break;
			}
		}
	}
	return active;
};

function allMediaActive(rightStrandMap){
	var active = 0;
	if(rightStrandMap){    			
		for(var mappedStrand in rightStrandMap){
			if(rightStrandMap[mappedStrand].strand.media.activeFlag == 'Y'){
				active = active | 2;    					
			}
			if(rightStrandMap[mappedStrand].strand.media.activeFlag == 'N'){
				active = active | 1;
			}
			
			if(((active & 2) == 2) && ((active & 1) == 1)){
				break;
			}
		}
	}
	return active;
};

function allTerritorySame(rightStrandMap){
	var terre = null;
	var allSame = true;
	if(rightStrandMap){
		for(var mappedStrand in rightStrandMap){
			if(terre == null){
				terre = rightStrandMap[mappedStrand].strand.territory.id;
			}
			else if(terre != rightStrandMap[mappedStrand].strand.territory.id){								
				allSame = false;
				break;								
			}
		}
	}
	return allSame;
};

function isIE() {
	if (navigator.appName==='Microsoft Internet Explorer') {
		return true;
	}
	return false;
};

function embedVideoInIE(divID, movieName) {
	var embeddedAbleString = "<object classid=\"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\" width=\"100%\" height=\"600\" id=\"movie_name\" align=\"middle\">";
	embeddedAbleString += "<param name=\"movie\" value=\"" + movieName + "\"/>";    
	embeddedAbleString += "<a href=\"http://www.adobe.com/go/getflash\">";
	embeddedAbleString += "<img src=\"http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif\" alt=\"Get Adobe Flash player\"/>";
	embeddedAbleString += "</a>";    
	embeddedAbleString += "</object>";
	 $('#' + divID).html(embeddedAbleString);
}

function toTitleCase(str) {
	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
