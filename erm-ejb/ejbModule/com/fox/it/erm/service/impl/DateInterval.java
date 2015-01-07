package com.fox.it.erm.service.impl;

import java.util.Date;

/**
 * Represents a Date interval.
 * An interval can be represented through concrete dates, codes or expressions
 * @author AndreasM
 *
 */
public class DateInterval {

	private Date contractualStartDate;
	private Date contractualEndDate;
	private Date overrideContractualStartDate;
	private DateCodes.Code contractualStartDateCode;
	private DateCodes.Code contractualEndDateCode;
	private Date overrideContractualEndDate;
	private Long startExpressionId;
	private Long endExpressionId;

	public DateInterval() {

	}
	
	private boolean isExpression() {
		return startExpressionId!=null && endExpressionId!=null;
	}
	
	private Date getConcreteStartDate() {
		if (overrideContractualStartDate!=null) return overrideContractualStartDate;
		if (contractualStartDate!=null) return contractualStartDate;
		if (contractualStartDateCode!=null) return contractualStartDateCode.getStartDate();
		return null;
	}
	
	private Date getConcreateEndDate() {
		if (overrideContractualEndDate!=null) return overrideContractualEndDate;
		if (contractualEndDate!=null) return contractualEndDate;
		if (contractualEndDateCode!=null) return contractualEndDateCode.getEndDate();
		return null;
	}
	
	private boolean in(long s1,long e1,long s2, long e2) {
		boolean in =(s2>=s1&&s2<=e1||
					e2>=s1&&e2<=e1);
		return in;
	}
	
	private boolean isOverlap(long s1,long e1,long s2, long e2) {
		return in(s1,e1,s2,e2)||
			   in(s2,e2,s1,e1);
	}
	
	private boolean isOverlap(Date s1,Date e1, Date s2, Date e2) {
		//if one of the dates is empty return false, as we can not compute the overlap
		if (s1==null||e1==null||s2==null||e2==null) return false;
		return isOverlap(s1.getTime(),e1.getTime(),s2.getTime(),e2.getTime());
		
	}
	
	public boolean isOverlap(DateInterval interval) {
		if (isExpression()) {
			//return false. We can not compute as this is an expression
			//that gets evaluated at save time
			return false;
		}
		boolean isOverlap = isOverlap(getConcreteStartDate(), getConcreateEndDate(), interval.getConcreteStartDate(), interval.getConcreateEndDate());
		return isOverlap;
		
	}


	public Date getContractualStartDate() {
		return contractualStartDate;
	}


	public void setContractualStartDate(Date contractualStartDate) {
		this.contractualStartDate = contractualStartDate;
	}


	public Date getContractualEndDate() {
		return contractualEndDate;
	}


	public void setContractualEndDate(Date contractualEndDate) {
		this.contractualEndDate = contractualEndDate;
	}


	public DateCodes.Code getContractualStartDateCode() {
		return contractualStartDateCode;
	}


	public void setContractualStartDateCode(DateCodes.Code contractualStartDateCode) {
		this.contractualStartDateCode = contractualStartDateCode;
	}


	public DateCodes.Code getContractualEndDateCode() {
		return contractualEndDateCode;
	}


	public void setContractualEndDateCode(DateCodes.Code contractualEndDateCode) {
		this.contractualEndDateCode = contractualEndDateCode;
	}


	public Long getStartExpressionId() {
		return startExpressionId;
	}


	public void setStartExpressionId(Long startExpressionId) {
		this.startExpressionId = startExpressionId;
	}


	public Long getEndExpressionId() {
		return endExpressionId;
	}


	public void setEndExpresionId(Long endExpresionId) {
		this.endExpressionId = endExpresionId;
	}
	
	

}
