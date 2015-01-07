
var basePath = "/erm/";
var path = paths();
var initializeWindow;
function showInitialzingPopupWindow(){		
	initializeWindow = $("#initializingPopupWindow").kendoWindow({	  
          width: "400px",
          height : "200px",
          minWidth : "400px",
          minHeight : "200px",
          title: "Initializing", 
          actions: [],
          visible : false            		  
    }).data("kendoWindow");	
	initializeWindow.setOptions({
      modal : true	    
	});
	initializeWindow.center();
	initializeWindow.open();		
};	

function closeInitialzingPopupWindow(){
	var initializeWindow = $("#initializingPopupWindow").data("kendoWindow");
	initializeWindow.close();		
};	

// GET LAST MODIFIED TIME STAMP
 function addDynamicJSRestFile(timeStampRestPathMap) { 
  showInitialzingPopupWindow();
  $.get(path.getLastModifiedClassMappingRESTPath(), function(data){
	for (index in timeStampRestPathMap) {	  
	  var fileref = null; 
	  fileref = document.createElement('script');
	  fileref.setAttribute("type","text/javascript");	  
	  fileref.setAttribute("src", basePath + timeStampRestPathMap[index].path + "?lastModified=" + data[timeStampRestPathMap[index].key]); 
	  if (fileref!=null)
	    document.getElementsByTagName("head")[0].appendChild(fileref);
	}	
	var timerID = null;
	timerID = setInterval(function(){		
	  if (erm.dynamicJSLoadedCounter >= timeStampRestPathMap.length) {
		console.log("Dynamic JS completed... got " + erm.dynamicJSLoadedCounter + ". Performing post process.....");
		clearInterval(timerID);  
		closeInitialzingPopupWindow();
		//initialization is complete, set a value in the erm.dbvalues to indicate completion
		erm.dbvalues.initCompleted=true;
		erm.dbvalues.postProcess();
		erm.uiInit();
	  } else {
		  console.log("Dynamic JS loader has loaded " + erm.dynamicJSLoadedCounter + " out of " + timeStampRestPathMap.length + " resources");
	  }
	}, 200);
  }).fail(function(xhr,status,message,rcscope){
    // failed to get last modified time stamp map
    console.log("failed to get last modified timestamp");    	  
  });
  
};

var timeStampRestPathMap = new Array(); 
timeStampRestPathMap.push({key: "parties", path: path.getContractualPartiesRESTPath()});
timeStampRestPathMap.push({key: "foxEntities", path: path.getCPFoxEntitiesRESTPath()});
timeStampRestPathMap.push({key: "contractualPartyTypes",  path: path.getContractualPartyTypesRESTPath()});
timeStampRestPathMap.push({key: "partyTypes",  path: path.getPartyTypesRESTPath()});
timeStampRestPathMap.push({key: "productTypes", path: path.getProductTypesRESTPath()});
//mediaNodes
timeStampRestPathMap.push({key: "mediaNodes", path: path.getMediaNodesJsRESTPath()});
timeStampRestPathMap.push({key: "territoryNodes", path: path.getTerritoryNodesJsRESTPath()});
timeStampRestPathMap.push({key: "languageNodes", path: path.getLanguageNodesJsRESTPath()});
timeStampRestPathMap.push({key: "restrictions", path: path.getRestricitonsJsRESTPath()});
timeStampRestPathMap.push({key: "legalConfirmationStatusMap", path: path.getLegalConfirmationStatusMapRESTPath()});
timeStampRestPathMap.push({key: "enumsEntities", path: path.getEnumEntitiesRESTPath()});
timeStampRestPathMap.push({key: "contactTypes", path: path.getContactTypesRESTPath()});
timeStampRestPathMap.push({key: "accessTypes", path: path.getAccessTypesRESTPath()});
timeStampRestPathMap.push({key: "organizationTypes", path: path.getOrganizationTypesRESTPath()});
timeStampRestPathMap.push({key: "countriesMap", path: path.getCountriesRESTPath()});
//date codes and status
timeStampRestPathMap.push({key: "dateCodesAndStatus", path: path.getDateCodesAndStatusRESTPath()});

timeStampRestPathMap.push({key: "allMedia", path: path.getAllMediaJsRESTPath()});
timeStampRestPathMap.push({key: "allLanguages", path: path.getAllLnaguagesJsRESTPath()});
timeStampRestPathMap.push({key: "allTerritories", path: path.getAllTerritoriesJsRESTPath()});



// Insert dynamic JS files to add below
$(document).ready(function() {
  addDynamicJSRestFile(timeStampRestPathMap);
});