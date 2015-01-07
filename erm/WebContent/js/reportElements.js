function QueryParametersWrapper(){
	
	this.savedQuery = new SavedQuery();
	this.productParametersList = new Array();
	this.queryParametersList = new Array();
	this.parameterInfo = new ParameterInfo();
	
	this.getObjectForJSON = function(){
		var obj = new Object();
		
		obj.savedQuery = this.savedQuery.getObjectForJSON();
		obj.queryParametersList = new Array();
		$.each(this.queryParametersList, function(id, elem){
			obj.queryParametersList.push(elem.getObjectForJSON());
		});
		//obj.parameterInfo = this.parameterInfo.getObjectForJSON();
		
		obj.productParametersList = new Array();
		$.each(this.productParametersList, function(id, elem){
			obj.productParametersList.push(elem.getObjectForJSON());
		});
		
		return obj;
	};
	
}

function SavedQuery(){
	
	this.id = null;
	this.name = null;
	this.prsnlTag = null;
	this.sourceReportId = null;
	this.publicFlag = "N";
	this.queryComment = null;
	
	this.getObjectForJSON = function(){
		var obj = new Object();
		
		obj.id = this.id;
		obj.name = this.name;
		obj.prsnlTag = this.prsnlTag;
		obj.sourceReportId = this.sourceReportId;
		obj.publicFlag = this.publicFlag;
		obj.queryComment = (this.queryComment == null) ? "" : this.queryComment;
		
		return obj;
	};
}

function ProductParameters(){
	
	this.queryId = null;
	this.foxVersionId = null;
	
	this.getObjectForJSON = function(){
		
		var obj = new Object();
		obj.queryId = this.queryId;
		obj.foxVersionId = this.foxVersionId;
		
		return obj;
	};
}

function QueryParameter(){
	/**
	 * param name
	 * Language
	 * Media
	 * Territory
	 * ToDate
	 * FromDate
	 * FromDateInclTBA
	 * ToDateInclTBA
	 * Report_Name
	 * InternetOpenCheck
	 * InternetClosedCheck
	 * WithinThroughoutFlag
	 * RestrictionCodeNoneList
	 * ProductSelected_RTS
	 * 
	 */
	this.queryId = null;
	this.name = null;
	this.value = null;
	this.text = null;
	this.partId = 0;
	
	this.getObjectForJSON = function(){
		var obj = new Object();
		
		obj.queryId = this.queryId;
		obj.name = this.name;
		obj.value = this.value;
		obj.text = this.text;
		obj.partId = this.partId;
		
		return obj;
	};
}

function ParameterInfo(){
	this.id = null;
	this.comment = null;
	
	this.getObjectForJSON = function(){
		var obj = new Object();
		obj.id = this.id;
		obj.comment = this.comment;
		return obj;
	};
}

function RightGroup(){
	
	this.groupId = null;
	this.media = new Array();
	this.territories = new Array();
	this.languages = new Array();
	
	this.getMediaEntry = function(){		
		var mediaString = "";
		for(var i = 0; i < this.media.length; i++){
			if(i < (this.media.length - 1)){
				mediaString += this.media[i].text+", ";
			}
			else {
				mediaString += this.media[i].text;
			}
		}
		return mediaString;
		
	};
	
	this.getTerritoryEntry = function(){
		var territoryString = "";
		for(var i = 0; i < this.territories.length; i++){
			if(i < (this.territories.length - 1)){
				territoryString += this.territories[i].text+", ";
			}
			else {
				territoryString += this.territories[i].text;
			}
		}
		return territoryString;
	};
	
	this.getLanguageEntry = function(){		
		var languageString = "";
		for(var i = 0; i < this.languages.length; i++){
			if(i < (this.languages.length - 1)){
				languageString += this.languages[i].text+", ";
			}
			else {
				languageString += this.languages[i].text;
			}
		}
		return languageString;
		
	};
	
	/**
	 * 
	 */
	this.equals = function(rightGroup){		
		if(rightGroup == null){
			return false;
		}
		var b = this.media != null && this.territories != null && this.languages != null;
		b = b && rightGroup.media != null && rightGroup.territories != null && rightGroup.languages != null;
		if(b){
			return this.compareQueryParameter(this.media, rightGroup.media) && this.compareQueryParameter(this.territories, rightGroup.territories) && this.compareQueryParameter(this.languages, rightGroup.languages);			
		}
		else {
			return false;
		}		
		
	};
	
	/**
	 * 
	 */
	this.compareQueryParameter = function(queryParam0, queryParam1){
				
		if(queryParam1 && queryParam0){
			if(queryParam0.length != queryParam1.length){
				//The arrays are of different size so they cannot be equals
				return false;
			}			
			for(var i = 0; i < queryParam0.length; i++){
				var isMatch = false;
				for(var j = 0; j < queryParam1.length; j++){
					if(queryParam0[i].value == queryParam1[j].value){
						isMatch = true;
						break;
					}
				}
				if(!isMatch){
					return false;
				}
			}
			return true;
		}
		else {
			return false;
		}
	};
}

/**
 * 
 * @returns
 */
function QuerySearchObject(){
	this.queryName = null;
	this.personalTag = null;
	this.comment = null;
	this.sourceReportId = null;
	this.publicFlag = null;
	this.createName = null;
	
	this.getObjectForJson = function(){
		var ob = new Object();
		
		ob.queryName = (this.queryName == null) ? "" : this.queryName;
		ob.personalTag = (this.personalTag == null) ? "" : this.personalTag;
		ob.comment = (this.comment == null) ? "" : this.comment;
		ob.sourceReportId = (this.sourceReportId == null) ? -1 : this.sourceReportId;
		ob.publicFlag = (this.publicFlag == null) ? "" : this.publicFlag;
		ob.createName = (this.createName == null) ? "" : this.createName;
		
		return ob;
	};
	
	this.validate = function(){
		this.printParameters();
		var b = (this.queryName != null && this.queryName.trim() != '');
		b = b || (this.personalTag != null && this.personalTag.trim() != '');
		b = b || (this.comment != null && this.comment.trim() != '');
		b = b || (this.sourceReportId != null && parseInt(this.sourceReportId) > 0);
		//b = b || (this.publicFlag != null && this.publicFlag.trim() != '');
		b = b || (this.createName != null && this.createName.trim() != '');
		
		return b;
	};
	
	this.printParameters = function(){
		var string = " Query Name : "+this.queryName+"\n";
		string += " Personal Tag : "+this.personalTag+"\n";
		string += " Comment : "+this.comment+"\n";
		string += " Source Report Id : "+this.sourceReportId+"\n";
		string += " Public Flag : "+this.publicFlag+"\n";
		string += " Create Name : "+this.createName;
		console.log(string);
	};
}

