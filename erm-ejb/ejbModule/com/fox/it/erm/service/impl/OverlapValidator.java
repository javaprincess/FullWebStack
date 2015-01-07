package com.fox.it.erm.service.impl;

import com.fox.it.erm.ErmProductRightStrand;

public class OverlapValidator {

	private final DateOverlapValidator dateOverlapValidator = new DateOverlapValidator();
	
	public OverlapValidator() {
	}
	
	private boolean isDateOverlap(ErmProductRightStrand s1,ErmProductRightStrand s2) {
		return dateOverlapValidator.isOverlap(s1, s2);
	}
	
	private boolean isMTLOverlap(ErmProductRightStrand s1, ErmProductRightStrand s2) {
		return (s1.getTerritoryId().equals(s2.getTerritoryId()) &&
				s1.getMediaId().equals(s2.getMediaId()) &&
				s1.getLanguageId().equals(s2.getLanguageId())
				);
	}
	
	private boolean isSameBusinessType(ErmProductRightStrand s1, ErmProductRightStrand s2) {
		boolean isBusiness=(s1.isBusiness()==s2.isBusiness()&&s1.isBusiness()==true);
		boolean isLegal=(s1.isLegal()==s2.isLegal()&&s1.isLegal()==true);
		return isBusiness||
			   isLegal;
	}
	
	private boolean isSameInclusionType(ErmProductRightStrand s1, ErmProductRightStrand s2) {
		return s1.isExclusion()==s2.isExclusion();
	}
	
	public boolean isOverlap(ErmProductRightStrand s1, ErmProductRightStrand s2) {
		if (!isSameBusinessType(s1, s2)) {
			//if they are not the same type. there's no point on checking anything else.
			return false;
		}
		if (!isSameInclusionType(s1, s2)&&
			isMTLOverlap(s1, s2)) {
			return true;
		}
		if (isMTLOverlap(s1,s2) &&
		    isDateOverlap(s1, s2)
			) {
			return true;
		}
		
		return false;
	}

}
