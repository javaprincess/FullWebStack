package com.fox.it.erm.service.impl;

import java.util.Date;

import com.fox.it.erm.ErmProductRightStrand;

public class DateOverlapValidator {

	public DateOverlapValidator() {

	}
	
	private DateInterval getInterval(ErmProductRightStrand strand) {
		Date startDate = strand.getContractualStartDate();
		Date endDate = strand.getContractualEndDate();
		DateCodes.Code startDateCode = DateCodes.Code.get(strand.getContractualStartDateCodeId());
		DateCodes.Code endDateCode = DateCodes.Code.get(strand.getContractualEndDateCodeId());
		Long startDateExpressionId = strand.getContractualStartDateExprInstncId();
		Long endDateExpressionId = strand.getContractualEndDateExprInstncId();
		DateInterval interval = new DateInterval();
		interval.setContractualStartDate(startDate);
		interval.setContractualEndDate(endDate);
		interval.setContractualStartDateCode(startDateCode);
		interval.setContractualEndDateCode(endDateCode);
		interval.setStartExpressionId(startDateExpressionId);
		interval.setEndExpresionId(endDateExpressionId);
		return interval;
	}
	
	public boolean isOverlap(ErmProductRightStrand s1, ErmProductRightStrand s2) {
		DateInterval s1Interval = getInterval(s1);
		DateInterval s2Interval = getInterval(s2);		
		return s1Interval.isOverlap(s2Interval);		
	}

}
