function restriction(restrictionCodeId, startDate, startDateCodeId, endDate, endDateCodeId, restrictionCodeText, productRestrictionId,rightRestrictionId){
	
	this.restrictionCodeId = restrictionCodeId;
	this.restrictionCodeText = restrictionCodeText;
	this.startDate = startDate;
	this.endDate = endDate;
	this.startDateCodeId = startDateCodeId;
	this.startDateCodeText = "";
	this.endDateCodeId = endDateCodeId;
	this.endDateCodeText = "";
	this.restrictionCode = "";
	this.startDateExprInstncId = "";
	this.endDateExprInstncIdm = "";
	this.productRestrictionId = productRestrictionId;
	this.rightRestrictionId = rightRestrictionId;
	this.comment = null;
	this.commentTitle = null;
	this.commentId = null;
	this.commentTimestampId = null;
	this.startDateString = null;
	this.endDateString = null;
	this.changeStartDate = false;
	this.changeEndDate = false;
	
	
	/**
	 * 
	 * @param contractualStarDate
	 * @param startDateStatus
	 * @param contractualEndDate
	 * @param endDateStatus
	 */
	this.updateRestriction = function updateRestriction(sDate, eDate, sCode, eCode, sDateCodeText, eDateCodeText, rCodeText, pRestrictionId){
		this.startDate = sDate;
		this.endDate = eDate;
		this.startDateCodeId = sCode;
		this.endDateCodeId = eCode;
		this.startDateCodeText = sDateCodeText;
		this.endDateCodeText = eDateCodeText;
		this.restrictionCodeText = rCodeText;
		this.productRestrictionId = pRestrictionId;
	};
	
	/**
	 * 
	 * @param startDateCodeText
	 * @param endDateCodeText
	 */
	this.setCodeText = function setCodeText(startDateCodeText, endDateCodeText){
		this.startDateCodeText = startDateCodeText;
		this.endDateCodeText = endDateCodeText;
	};
	
	this.setRestrictionCode = function setRestrictionCode(){
		if(this.restrictionCodeText){
			var s = new String(this.restrictionCodeText);
			var index = s.indexOf(",");
			if(index > 0){
				var sa = s.split(",");
				this.restrictionCode = sa[0];
			}
		}
	};
	
	/**
	 * 
	 * @returns {String}
	 */
	this.getCodeDateDisplayString = function getCodeDateDisplayString(){
		var sd = this.getCorrectStartDateForDisplay();
		var ed = this.getCorrectEndDateForDisplay();
		if(sd != null || ed != null){
			var s = this.restrictionCode + " (";
			if(sd != null){
				s += sd;
			}
			s += " to ";
			if(ed != null){
				s += ed; 
			}
			s += ")";
			return s;
		}
		return null;
	};
	
	/**
	 * 
	 * @returns
	 */
	this.getCorrectStartDateForDisplay = function getCorrectStartDateForDisplay(){
		try {
			if(!isNaN(this.startDate) && this.startDate > 0){
				return this.getCustomDisplayDate(this.startDate);
			}
			else if(this.startDateCodeText.length > 1){
				return this.startDateCodeText;
			}
			return null;
		}catch(e){
			return null;
		};
	};
	
	/**
	 * 
	 * @returns
	 */
	this.getCorrectEndDateForDisplay = function getCorrectEndDateForDisplay(){
		try {
			if(!isNaN(this.endDate) && this.endDate > 0){
				return this.getCustomDisplayDate(this.endDate);
			}
			else if(this.endDateCodeText.length > 1){
				return this.endDateCodeText;
			}
			return null;
		}
		catch(e){
			return null;
		}
	};
	
	/**
	 * 
	 * @param longDate
	 * @returns
	 */
	this.getCustomDisplayDate = function getCustomDisplayDate(longDate){
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
	 * 
	 * @returns {___shortObject0}
	 */
	this.getShortObject = function getShortObject(){
		
		var shortObject = new Object();
		shortObject.restrictionCodeId= this.restrictionCodeId;
		
		if(this.changeStartDate){
			shortObject.startDate = this.startDate;
			shortObject.startDateString = this.startDateString; //(this.startDate == null) ? null : (new Date(this.startDate)).toString();
			if(this.startDateString == null && this.startDate != null){
				var date = new Date(parseInt(this.startDate));
				if(date){
					
					shortObject.startDateString = getCorrectStrandDate(date);
				}
			}
			if(!isNaN(this.startDateCodeId) && this.startDateCodeId > 0){
				shortObject.startDateCodeId = this.startDateCodeId;
			}
			else {
				shortObject.startDateCodeId = null;
			}
			shortObject.startDateExprInstncId = null;
			shortObject.changeStartDate = this.changeStartDate;
		}
		else {
			this.startDate = null;
			this.startDateCodeId = null;
			shortObject.startDateExprInstncId = null;
			shortObject.changeStartDate = this.changeStartDate;
		}
		
		
		if(this.changeEndDate){
			shortObject.endDate = this.endDate;		
			shortObject.endDateString = this.endDateString; //(this.endDate == null) ? null : (new Date(this.endDate)).toString();
			if(this.endDateString == null && this.endDate != null){
				var date = new Date(parseInt(this.endDate));
				if(date){
					shortObject.endDateString = getCorrectStrandDate(date);
				}
			}		
			if(!isNaN(this.endDateCodeId) && this.endDateCodeId > -1){
				shortObject.endDateCodeId = this.endDateCodeId;
			}
			else {
				shortObject.endDateCodeId = null;
			}
			shortObject.endDateExprInstncId = null;
			shortObject.changeEndDate = this.changeEndDate;
		}
		else {
			this.endDate = null;
			this.endDateCodeId = null;
			shortObject.endDateExprInstncId = null;
			shortObject.changeEndDate = this.changeEndDate;
		}
				
		if(this.productRestrictionId > 0){
			shortObject.productRestrictionId = this.productRestrictionId;
		}
		else {
			shortObject.productRestrictionId = null;
		}
		
		if(this.rightRestrictionId && !isNaN(this.rightRestrictionId)){
			shortObject.restrictionId = this.rightRestrictionId;
		}
		var commentId = this.commentId; 
		if (commentId && parseInt(commentId)) {
			shortObject.commentId = commentId;
		}
		if (this.commentTimestampId) {
			shortObject.commentTimestampId = this.commentTimestampId; 
		}
		
		return shortObject;
		
	};
	
}

/**
 * 
 * @returns
 */
function restrictionObject(foxVersionId){
	
	this.foxVersionId = foxVersionId;
	this.restrictions = new Array();
	
	/**
	 * 
	 * @param restrictionCodeIds
	 * @param starDate
	 * @param endDate
	 * @param startDateCodeId
	 * @param endDateCodeId
	 * @param startDateCodeText
	 * @param endDateCodeText
	 */
	this.addRestriction = function addRestriction(restrictionCodeIds, starDate, endDate, startDateCodeId, endDateCodeId, startDateCodeText, endDateCodeText, restrictionCodeTexts, rightRestrictionIds){
		//We clear the restrictions array
		if(this.restrictions == null){
			this.restrictions = new Array();
		}
		if(restrictionCodeIds != null && restrictionCodeIds.length > 0){
				for(var i = 0; i < restrictionCodeIds.length; i++){
					var res = this.getRestriction(restrictionCodeIds[i].restrictionId);
					var productRestrictionId = "";
					if(restrictionCodeIds[i].productRestrictionId){
						productRestrictionId = restrictionCodeIds[i].productRestrictionId;
					}
					if(res != null){	
						res.updateRestriction(starDate, endDate, startDateCodeId, endDateCodeId, startDateCodeText, endDateCodeText, restrictionCodeTexts[i], productRestrictionId);
						res.setRestrictionCode();
						if(rightRestrictionIds && rightRestrictionIds.length > 0){
							res.rightRestrictionId = rightRestrictionIds[i];
						}
					}
					else {
						res = new restriction(restrictionCodeIds[i].restrictionId, starDate, startDateCodeId, endDate, endDateCodeId, restrictionCodeTexts[i], productRestrictionId);
						res.setCodeText(startDateCodeText, endDateCodeText);
						res.setRestrictionCode();
						if(rightRestrictionIds && rightRestrictionIds.length > 0){
							res.rightRestrictionId = rightRestrictionIds[i];
						}
						this.restrictions.push(res);
					}
									
				}
			
		}
		
	};
	
	this.addNewRestriction = function(restriction){
		var res = this.getRestriction(restriction.restrictionCodeId);
		if(res == null){
			restriction.setRestrictionCode();
			this.restrictions.push(restriction);
			
		}
	};
	
	/**
	 * Work-around because for some unknown reason we have a double call with the addNewRestriction function
	 * in the rightStrandModification.js module
	 */
	this.addNewRestrictionAlt = function(restriction){
		var restrictionCodeId = restriction.restrictionCodeId;
		restriction.setRestrictionCode();
		var existingRestriction = this.getRestriction(restrictionCodeId);
		if (existingRestriction) {
			//we need to merge the restriction
			this.mergeRestriction(existingRestriction,restriction);
		} else {
			this.restrictions.push(restriction);
		}
		
	};
	
	/**
	 * Merges the content of r2 into r1
	 * @param r1
	 * @param r2
	 */
	this.mergeRestriction = function mergeRestriction(r1,r2) {
		r1.changeEndDate=r2.changeEndDate;
		r1.changeStartDate=r2.changeStartDate;
		r1.commentId = r2.commentId;
		r1.comment=r2.comment;
		r1.commentTimestampId=r2.commentTimestampId;
		r1.commentTitle=r2.commentTitle;
		r1.endDate=r2.endDate;
		r1.endDateCodeId=r2.endDateCodeId;
		r1.endDateCodeText=r2.endDateCodeText;
		r1.endDateExprInstncIdm=r2.endDateExprInstncIdm;
		r1.endDateString=r2.endDateString;
		r1.productRestrictionId=r2.productRestrictionId;
		r1.restrictionCode=r2.restrictionCode;
		r1.restrictionCodeId=r2.restrictionCodeId;
		r1.restrictionCodeText=r2.restrictionCodeText;
		r1.startDate=r2.startDate;
		r1.startDateCodeId=r2.startDateCodeId;
		r1.startDateCodeText=r2.startDateCodeText;
		r1.startDateExprInstncId=r2.startDateExprInstncId;
		r1.startDateString=r2.startDateString;
	};
	
	
	
	/**
	 * 
	 * @returns {Array}
	 */
	this.getAllRestrictionIds = function getAllRestrictionIds(){
		
		var ids = new Array();
		if(this.restrictions != null && this.restrictions.length > 0){					
			for(var i = 0; i < this.restrictions.length; i++){
				ids.push(this.restrictions[i].restrictionCodeId);
			}			
		}
		return ids;
	};
	
	/**
	 * 
	 * @param restrictionCodeId
	 * @returns
	 */
	this.getRestriction = function getRestriction(restrictionCodeId){
		if(this.restrictions != null && this.restrictions.length > 0){
			for(var k = 0; k < this.restrictions.length; k++){
				if(this.restrictions[k].restrictionCodeId == restrictionCodeId){
					return this.restrictions[k];
				}
			}			
		}
		return null;
	};
	
	/**
	 * 
	 * @param restrictionCodeId
	 * @returns
	 */
	this.getRestrictionIndex = function getRestrictionIndex(restrictionCodeId){
		if(this.restrictions != null && this.restrictions.length > 0){
			var index = -1;
			for(var k = 0; k < this.restrictions.length; k++){
				if(this.restrictions[k].restrictionCodeId == restrictionCodeId){
					index = k;
				}
			}
			return index;
		}
		return null;
	};
	
	this.resetFields = function resetFields(){
		this.foxVersionId = null;
		this.restrictions = new Array();
	};
	
	/**
	 * 
	 * @param restrictionIds
	 */
	this.clearSelectedRestriction = function clearSelectedRestriction(restrictionIds){
		if(restrictionIds && restrictionIds.length > 0){
			for(var i = 0; i < restrictionIds.length; i++){
				var res = new Number(this.getRestrictionIndex(restrictionIds[i]));				
				if(!isNaN(res)){
					this.restrictions.splice(res.valueOf(), 1);
				}
			}
		}
	};
	
	this.removeRestriction = function(index){
		if(index && index > -1){
			
			this.restrictions.splice(index, 1);
		}
	};
	
	/**
	 * This method receives a array of selected restriction ids and compare it against the list of special date ids contained 
	 * in the this.restrictions array. if this.restrictions contains an id that is not in the selectedInfoCodeIds it is removed
	 * from the this.restrictions array.
	 * @param selectedInfoCodeIds
	 */
	this.clearNonIncludedSelectedRestriction = function clearNonIncludedSelectedRestriction(selectedInfoCodeIds){
		
		if(selectedInfoCodeIds && selectedInfoCodeIds.length > 0 && this.restrictions && this.restrictions.length > 0){
			var nonIncludedIds = new Array();
			for(var i = 0; i < this.restrictions.length; i++){
				var r = this.restrictions[i];
				var bool = false;
				for(var k = 0; k < selectedInfoCodeIds.length; k++){
					if(r.restrictionCodeId == selectedInfoCodeIds[k]){
						bool = true;
						break;
					}
				}
				if(!bool){
					nonIncludedIds.push(r.restrictionCodeId);
				}
			}
			
			this.clearSelectedRestriction(nonIncludedIds);
		}
		else {
			this.restrictions = new Array();
		}
	};
	
	/**
	 * 
	 * @returns {___so1}
	 */
	this.getShortRestrictionObject = function getShortRestrictionObject(){
		
		var so = new Object();
		so.foxVersionId = this.foxVersionId;
		var res = new Array();
		so.restrictions = null;
		for(var i = 0; i < this.restrictions.length; i++){
			res.push(this.restrictions[i].getShortObject());
		}
		so.restrictions = res;
		return so;
	};
	
	/**
	 * 
	 * @returns {Array}
	 */
	this.getShortRestrictionObjectForRightStrand = function getShortRestrictionObjectForRightStrand(){
		
		var res = new Array();		
		for(var i = 0; i < this.restrictions.length; i++){
			res.push(this.restrictions[i].getShortObject());
		}		
		return res;
	};
	
	/**
	 * 
	 * @returns {Array}
	 */
	this.getRestrictionDisplay = function getRestrictionDisplay(){
		
		var displayStringArray = new Array();
		if(this.restrictions){
			for(var i = 0; i < this.restrictions.length; i++){
				displayStringArray.push(this.restrictions[i].getCodeDateDisplayString());
			}
		}
		return displayStringArray;
	};
}

function ermRightRestriction(){
	
	this.rightRestrictionId = null;
	this.rightStrandId = null;
	this.restrictionCdId = null;
	this.startDate= null;
	this.startDateCdId = null;
	this.endDate = null;
	this.endDateCdId = null;
	
	this.startDateCdName = null;
	this.endDateCdName = null;
	this.restrictionCdName = null;
	this.restrictionTypeId = null;
	this.restrictionTypeName = null;
	this.description = null;
	this.comment = null;
	this.commentTitle = null;
	this.commentTimestampId = null;
	this.startDateString = null;
	this.endDateString = null;
	this.changeStartDate = false;
	this.changeEndDate = false;
	
	/**
	 * 
	 */
	this.getErmRestrictionObjectForJSON = function(){
		
		var resObject = new Object();
		resObject.rightRestrictionId = this.rightRestrictionId;
		resObject.rightStrandId = this.rightStrandId;
		resObject.restrictionCdId = this.restrictionCdId;
		resObject.startDate = this.startDate;
		resObject.startDateCdId = this.startDateCdId;
		resObject.endDate = this.endDate;
		resObject.endDateCdId = this.endDateCdId;
		
		return resObject;
	};
	
	this.hasStartDate = function hasStartDate() {
		return this.startDate || this.startDateCdId;	
	};
	
	this.hasEndDate = function hasEndDate() {
		return this.endDate || this.endDateCdId;		
	};
	
	this.getRestrictionObjectForJSON = function(){
		
		var resObject = new Object();
		resObject.restrictionCodeId = this.restrictionCdId;
		
		
		resObject.commentId = this.commentId;
		resObject.commentTimestampId = this.commentTimestampId;
		
		if(this.changeStartDate){
			resObject.startDate = this.startDate;
			resObject.startDateString = this.startDateString;
			if(this.startDateString == null && this.startDate != null){
				var date = new Date(parseInt(this.startDate));
				if(date){
					
					resObject.startDateString = getCorrectStrandDate(date);
				}
			}
			resObject.startDateCodeId = this.startDateCdId;
			resObject.changeStartDate = this.changeStartDate;
		}
		else {
			resObject.startDate = null;
			resObject.startDateString = null;
			resObject.startDateCodeId = null;
			resObject.changeStartDate = false;
		}
		
		
		if(this.changeEndDate){
			resObject.endDate = this.endDate;
			resObject.endDateCodeId = this.endDateCdId;
			resObject.endDateString = this.endDateString; //(this.endDate == null) ? null : (new Date(this.endDate)).toString();
			if(this.endDateString == null && this.endDate != null){
				var date = new Date(parseInt(this.endDate));
				if(date){
					resObject.endDateString = getCorrectStrandDate(date);
				}
			}
			resObject.changeEndDate = this.changeEndDate;
		}	else {
			resObject.endDate = null;
			resObject.endDateString = null;
			resObject.endDateCodeId = null;
			resObject.changeEndDate = false;
		}
		return resObject;
	};
	
	/**
	 * 
	 * @param restrictionCode
	 * @returns
	 */
	this.getCodeDateDisplayString = function getCodeDateDisplayString(){
		var sd = this.getCorrectStartDateForDisplay();
		var ed = this.getCorrectEndDateForDisplay();
		if(sd != null || ed != null){
			var s = this.restrictionCdName + " (";
			if(sd != null){
				s += sd;
			}
			s += " to ";
			if(ed != null){
				s += ed; 
			}
			s += ")";
			return s;
		}
		return null;
	};
	
	/**
	 * 
	 * @returns
	 */
	this.getCorrectStartDateForDisplay = function getCorrectStartDateForDisplay(){
		try {
			if(!isNaN(this.startDate) && this.startDate > 0){
				return this.getCustomDisplayDate(this.startDate);
			}
			else if(this.startDateCdName.length > 1){
				return this.startDateCdName;
			}
			return null;
		}catch(e){
			return null;
		};
	};
	
	/**
	 * 
	 * @returns
	 */
	this.getCorrectEndDateForDisplay = function getCorrectEndDateForDisplay(){
		try {
			if(!isNaN(this.endDate) && this.endDate > 0){
				return this.getCustomDisplayDate(this.endDate);
			}
			else if(this.endDateCdName.length > 1){
				return this.endDateCdName;
			}
			return null;
		}
		catch(e){
			return null;
		}
	};
	
	/**
	 * 
	 * @param longDate
	 * @returns
	 */
	this.getCustomDisplayDate = function getCustomDisplayDate(longDate){
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
}



