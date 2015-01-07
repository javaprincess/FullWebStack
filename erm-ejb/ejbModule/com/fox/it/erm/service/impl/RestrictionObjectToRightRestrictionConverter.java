package com.fox.it.erm.service.impl;

import java.util.Calendar;

import com.fox.it.erm.ErmProductRightRestriction;
import com.fox.it.erm.util.RestrictionObject;

public class RestrictionObjectToRightRestrictionConverter extends RightStrandObjectConverterBase{
	
	public ErmProductRightRestriction convert(RestrictionObject restriction) {
		ErmProductRightRestriction rightRestriction = new ErmProductRightRestriction();
		if(restriction.getStartDate() != null){
			Calendar c = Calendar.getInstance();
			c.setTimeInMillis(restriction.getStartDate());
			rightRestriction.setStartDate(c.getTime());
		}
		if(restriction.getEndDate() != null){
			Calendar c = Calendar.getInstance();
			c.setTimeInMillis(restriction.getEndDate());
			rightRestriction.setEndDate(c.getTime());
		}
		
		if (isValue(restriction.getStartDateCodeId())) {
			rightRestriction.setStartDateCdId(restriction.getStartDateCodeId());
		}
		if (isValue(restriction.getEndDateCodeId())) {
			rightRestriction.setEndDateCdId(restriction.getEndDateCodeId());			
		}
		if (isValue(restriction.getStartDateExprInstncId())) {		
			rightRestriction.setStartDateExprInstncId(restriction.getStartDateExprInstncId());
		}
		if (isValue(restriction.getEndDateExprInstncId())) {
			rightRestriction.setEndDateExprInstncId(restriction.getEndDateExprInstncId());
		}
		if (isValue(restriction.getRestrictionCodeId())) {
			rightRestriction.setRestrictionCdId(restriction.getRestrictionCodeId());
		}
		if (isValue(restriction.getRestrictionId())) {
			rightRestriction.setRightRestrictionId(restriction.getRestrictionId());
		}
		
		//restriction comments
		if (isValue(restriction.getCommentId())) {
			rightRestriction.setCommentId(restriction.getCommentId());
		}
		if (isValue(restriction.getCommentTimestampId())) {
			rightRestriction.setCommentTimestamp(restriction.getCommentTimestampId());			
		}
		
		
		return rightRestriction;
	}
			

}
