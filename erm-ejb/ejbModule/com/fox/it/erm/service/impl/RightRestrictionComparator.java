package com.fox.it.erm.service.impl;

import java.util.Date;

import com.fox.it.erm.ErmProductRestrictionBase;
import com.google.common.base.Objects;

/**
 * Compares if tow right strand restriction have the same values.
 * This class is used when updating right strands. If the user added a new restriction but the restriction already exists with the same values no 
 * action will be performed. Otherwise will add a new one
 * @author AndreasM
 *
 */
public class RightRestrictionComparator {

	private boolean equal(Date d1,Date d2) {
		return Objects.equal(d1, d2);
	}
	
	
	
	public boolean equal(ErmProductRestrictionBase r1, ErmProductRestrictionBase r2) {
		if (!equal(r1.getEndDate(), r2.getEndDate())) {
			return false;
		}
		if (!equal(r1.getStartDate(),r2.getStartDate())) {
			return false;
		}
		if (!Objects.equal(r1.getRestrictionCdId(),r2.getRestrictionCdId())) {
			return false;
		}
		
		if (!Objects.equal(r1.getEndDateCdId(),r2.getEndDateCdId())) {
			return false;
		}
		if (!Objects.equal(r1.getEndDateExprInstncId(),r2.getEndDateExprInstncId())) {
			return false;
		}
		if (!Objects.equal(r1.getStartDateCdId(),r2.getStartDateCdId())) {
			return false;
		}

		
		return true;
	}

}
