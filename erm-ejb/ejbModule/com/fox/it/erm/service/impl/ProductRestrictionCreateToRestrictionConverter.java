package com.fox.it.erm.service.impl;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import com.fox.it.erm.ErmProductRestriction;
import com.fox.it.erm.util.ProductRestrictionCreateObject;
import com.fox.it.erm.util.RestrictionObject;

/**
 * Converts a ProductRestrictionCreateObject (as submitted from the UI) to a 
 * ErmProductRestriction.
 * @author AndreasM
 *
 */
public class ProductRestrictionCreateToRestrictionConverter {
	
	private ErmProductRestriction getRestriction(Long foxVersionId,RestrictionObject o) {
		ErmProductRestriction restriction = new ErmProductRestriction();
		restriction.setFoxVersionId(foxVersionId);
		restriction.setRestrictionCdId(o.getRestrictionCodeId());
		if(o.getStartDate() != null){
			Calendar start = Calendar.getInstance();
			start.setTimeInMillis(o.getStartDate());
			restriction.setStartDate(start.getTime());
		}
				
		
		restriction.setStartDateCdId(o.getStartDateCodeId());
		if(o.getEndDate() != null){
			Calendar end = Calendar.getInstance();
			end.setTimeInMillis(o.getEndDate());
			restriction.setEndDate(end.getTime());
		}
		
		restriction.setEndDateCdId(o.getEndDateCodeId());
		restriction.setStartDateExprInstncId(o.getStartDateExprInstncId());
		restriction.setEndDateExprInstncId(o.getEndDateExprInstncId());
		restriction.setProductRestrictionId(o.getProductRestrictionId());
		
		return restriction;
	}
	
	public List<ErmProductRestriction> convert(ProductRestrictionCreateObject o) {
		Long foxVersionId = o.getFoxVersionId();
		List<ErmProductRestriction> list = new ArrayList<>();
		if (o!=null&&o.getRestrictions()!=null&&o.getRestrictions().size()>0) {
			for (RestrictionObject r: o.getRestrictions()) {
				ErmProductRestriction restriction= getRestriction(foxVersionId, r);
				list.add(restriction);
			}
		}
		return list;
	}
}
