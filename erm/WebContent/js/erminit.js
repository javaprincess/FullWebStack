if (!window.erm) {
  erm = {};
  erm.scopes = {
	main: function main() {
    	return angular.element(document.getElementById("mainController")).scope();		
	},
    search: function search() {
    	return angular.element(document.getElementById("productSearchController")).scope();
    },
	rights : function rights() {
		return angular.element(document.getElementById("rightsController")).scope();
	},
	comments: function comments() {
		return angular.element(document.getElementById("ermSidePanelController")).scope();		
	}
  };
  erm.icons = {
	getIconTag: function(product) {
		var data = this.getIconData(product);
		 if (data.src) {
			 return "<img title='" + data.title + "' src='/erm/img/" + data.src +".png" + "'/>";	
	     }
		 return "";
	},
	getIconData : function(product) {
		 var img = null;
		 var title = null;
		 var rightsIconType = "N";
		 if (product.ermProductVersionHeader != null)
		   rightsIconType = product.ermProductVersionHeader.rightsIconType;
		 else if (product.rightsIndicator != null)
		   rightsIconType = product.rightsIndicator;
		 switch(rightsIconType) {
		   case "CM+B":
		     img="CM+BusinessStrand";
		     title="Clearance Memo with Business Strand(s)";
		     break;
		   case "CM+LB":
		   case "CM+BL":
			 img="CM+LegalAndBusinessAgree";
			 title="Clearance Memo with Legal and Business Strand(s)";
		     break;
		   case "CM+L":
		     img="CM+LegalStrand";
		     title="Clearance Memo with Legal Strand(s)";
			 break;
		   case "CM+":
			 img="CMexistsOnly";
			 title="Clearance Memo";
		     break;
		   case "CMDP+B":
		     img="CMDP+BusinessStrand";
		     title="Draft/Processing Clearance Memo with Business Strand(s)";
		     break;
		   case "CMDP+LB":
		   case "CMDP+BL":
			 img="CMDP+LegalAndBusinessAgree";
			 title="Draft/Processing Clearance Memo with Legal and Business Strand(s)";
		     break;
		   case "CMDP+L":
		     img="CMDP+LegalStrand";
		     title="Draft/Processing Clearance Memo with Legal Strand(s)";
			 break;
		   case "CMDP+":
			 img="CMDPexistsOnly";
			 title="Draft/Processing Clearance Memo";
		     break;  
		   case "B":
		     img="NoCM+BusinessStrand";
		     title="Business Strand(s)";
		     break;
		   case "BL":
		   case "LB":
		     img="NoCM+LegalAndBusinessAgree";
		     title="Legal and Business Strand(s)";
		 	 break;
		   case "L":
		     img="NoCM+LegalStrand";
		     title="Legal Strand(s)";
		     break;
		   case "N":
		   case "":
		   default:
			 break;
		 };
		 return {
			 src:img,
			 title:title
		 };
	 } 
  },
  erm.util = {
	dispaly: {
		DEFAULT_LENGHT:30,
		getShortDisplayName: function(s,l) {
			if (!l) {
				l = this.DEFAULT_LENGHT;
			}
			return s.substring(0,l);
		},
		setShortDisplayName:function(o,displayField,shortDisplayField,length) {
			var s = o[displayField];			
			var short = this.getShortDisplayName(s,length);
			o[shortDisplayField] = short;
		},
		setShortDisplayNameList:function setShortDisplayNameList(list,displayField,shortDisplayField,length) {
			var that = this;
			$.each(list,function(idx,elem) {
				that.setShortDisplayName(elem, displayField, shortDisplayField, length);
			});
		},
	}  
  },
  erm.Dates = {
		    toDate: function toDate(str,format) {
		    	var date = null;
		    	if (!format)  {
		    	  date = new Date(str);
		    	} else {
		    	  date = kendo.parseDate(str,format);
		    	}
		    	return date;
		    },
		    getFirstReleaseDate: function getFirstReleaseDate(str) {
		    	return erm.Dates.toDate(str,"yyyy-MM-dd");
		    },
			getFormatedReleaseDate: function getFormatedReleaseDate(str) {
				   var formatedDate = null;			
				   firstReleaseDate = this.getFirstReleaseDate(str); 
				   formatedDate = erm.Dates.format(firstReleaseDate);
				   if (!formatedDate) formatedDate="";
				   return formatedDate;
			}, 
		    
		  	format: function format(date,dateFormat) {
		  		if (!dateFormat) {
		  			dateFormat = "MM/dd/yyyy";
		  			//dateFormat = "yyyy-MM-dd";
		  		}
		  		return kendo.toString(date, dateFormat);
		  	},
		    getDates:function getDates(date,dateCode) {
		    	try {
		    		
		    		if (date != null && date != -1 && date != -2 && Math.abs(date) > 0) {
				    	if(!isNaN(date)){			    		
				    		return erm.Dates.format(new Date(date));
				    	}else {
				    		return erm.Dates.format(date);
				    	}				      
				    } else if (dateCode) {
				    	return dateCode.dateCode;       
				    }
		    	}
		    	catch(e){
		    		console.log("%o", e);
		    	}			    
			    return "";  
		    }
  };
  
  erm.timer = function timer(name) {
	  var t0=null;
	  var t1=null;
	  return {
		start: function start() {
			t0 = Date.now();
			return this;
		},
		stop: function stop() {
			t1 = Date.now();
			return this;
		},
		get: function get() {
			var end = t1;;
			if (!end) {
				end = Date.now();
			}
			return end-t0;
		},
		print: function() {
			console.log("Operation: " + name + " took " + this.get() + " ms");
		}
	  };
  },
  erm.uiInit = function uiInit() {
		var psscope = angular.element("body").scope();
		psscope.setDynamic();
	  
		$('#searchByTitleBasicInput').focus();
	    $("#searchByTitleBasicInput:text:visible:first").focus();	  
  },
  erm.dbvalues = {
		  initCompleted:false,
		  postProcessExecuted:false,
		  grantTypes: {
			FILMS_CLIPS_STILLS: 2,
			REMAKES_SEQUELS:7,
			BILLING_BLOCK:15,
			LEGITIMATE_STAGE:10,
			ANCILLARY_RIGHTS:13,
			MERCHANDISING_COMMERCIAL_TIE_INS:3,
			PAID_AD_MEMO:14,
			COMMERICAL_TIE_INS:15,
			TITLE_CREDITS:16,
			ARTWORK_RESTRICTIONS:17
		  },
		  
		  
		  postProcess: function postProcess() {
			var values = erm.dbvalues;
			var toMap = function toMap(list,keyField) {
				var map={};
				var key = null;
				$.each(list,function(idx,element){
					key = element[keyField];
					map[key]=element;
				});
				return map;
			};
			var getInactiveObjects = function getInactiveObjects(list) {
				var inactive = [];
				$.each(list,function(idx,elem){
					//NOTE this only applies for Territories. Really this should be split and put on other method
					if (elem.activeFlag && elem.activeFlag==='N' && elem.name && elem.name.toUpperCase().indexOf("REST OF") <= -1 && (elem.id < 10865 || (elem.id > 11183 && elem.id < 11185) || elem.id > 11230)) {						
						inactive.push(elem);						
					}
				});
				return inactive;
			};
			
			var getActiveObjects = function getActionveObjects(list) {
				return list.filter(function(e){
					return e.activeFlag==='Y';
				});
			};
			
			var sort = function sort(list,propertyF) {
				list.sort(function(a,b){
					var pa = propertyF(a);
					var pb = propertyF(b);
					if (pa < pb)
						return -1;
					if (pa > pb)
						return 1;
					return 0;					
				});
				return list;
			};
			
			//post process the dbvalues, 
			//construct map based on list for media, territory, language, date codes, restrictions
			values.allMediaMap = toMap(values.allMedia,"id");
			values.allTerritoryMap = toMap(values.allTerritories,"id");
			values.allLanguageMap = toMap(values.allLanguages,"id");
			values.allRestrictionMap = toMap(values.restrictions,"id");
			values.allRestrictionMapByCode = toMap(values.restrictions,"code");
			values.allDateCodeMap = toMap(values.dateCodes,"refDateId");
			values.allDateStatusMap = toMap(values.dateStatus,"id");
			values.activeRestrictions = getActiveObjects(values.restrictions);
			var inactiveObjects = getInactiveObjects(values.allTerritories);
			$.map(inactiveObjects, function(t){
				t.text = t.name + "*";
				
			});
			values.inactiveTerritories = sort(inactiveObjects,function(o) {return o.name;});
			
			erm.util.dispaly.setShortDisplayNameList(values.contractualParties,'displayName' ,'shortDisplayName', 30);
			values.contractualPartiesDisplay=$.grep(values.contractualParties,function(elem,i) {
				var displayName = elem.displayName;
				return (displayName && displayName.trim().length>0);
			});
			values.postProcessExecuted=true;
		  },
		  afterInit: function afterInit(callback) {
			var timerID = null;
			timerID = setInterval(function(){		
				  if (erm.dbvalues.initCompleted) {
					  if (!erm.dbvalues.postProcessExecuted) {
						  erm.dbvalues.postProcess();
					  }
					  clearInterval(timerID);
					  callback();
				  }
			},200);	  
		  },
		 getDateCodeById: function getDateCodeById(id) {
			var values = erm.dbvalues;
			return values.allDateCodeMap[id];
			
		 },
		 getDateStatusById: function getDateStatusById(id) {
			 var values = erm.dbvalues; 
			 return values.allDateStatusMap[id];
			
		 },
		 getMediaById: function getMediaById(id) {
			 var values = erm.dbvalues;
			 return values.allMediaMap[id];
		 },
		 getTerritoryById: function getTerritoryById(id) {
			 var values = erm.dbvalues;
			 return values.allTerritoryMap[id];
		 },
		 getLanguageById: function getLanguageById(id) {
			 var values = erm.dbvalues;
			 return values.allLanguageMap[id];
		 },
		 getRestrictionById: function getRestrictionById(id) {
			 var values = erm.dbvalues;
			 return values.allRestrictionMap[id];
		 },
		 getRestrictionByCode: function getRestrictionByCode(code) {
			 var values = erm.dbvalues;
			 return values.allRestrictionMapByCode[code];
		 } 

		  
		  
  };
  erm.dynamicJSLoadedCounter = 0;
  erm.statusIndicatorTime = 3000;
  erm.copySection = {};
  erm.copySection.strands = "STRANDS";
  erm.copySection.comments = "COMMENTS";
  erm.copySection.infoCodes = "INFO_CODES";
  erm.copySection.clearanceMemo = "CLEARANCE_MEMO";
  erm.copySection.subrights = "SUBRIGHTS";
  erm.copySection.salesAndMarketing = "SALES_AND_MARKETING";	
  erm.copySection.contacts = "CONTACTS";
  erm.copySection.contractualParties = "CONTRACTUAL_PARTIES";
  erm.sessionManagement={
		  loginHeader:"LoginPage",
		  redirectToLogin: function redirectToLogin() {
				var page="sessionExpired.jsp";
				window.location.replace(page);				
		  }
  };
}
