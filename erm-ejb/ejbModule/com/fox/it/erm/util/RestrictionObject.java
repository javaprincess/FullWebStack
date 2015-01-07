package com.fox.it.erm.util;



/**
 * Represents one restriction as created from the UI.
 * The restriction will have the restriction id and a set of dates associated with them
 * @author AndreasM
 *
 */
public class RestrictionObject {
	private Long restrictionCodeId;
	private Long startDateCodeId;
	private Long startDate;
	private Long endDate;
	private Long endDateCodeId;
	private Long startDateExprInstncId;
	private Long endDateExprInstncId;
	private Long productRestrictionId;
	private Long restrictionId;
	private String comment;
	private String commentTitle;
	private Long commentTimestampId;
	private String startDateString;
	private String endDateString;
	private Boolean changeStartDate;
	private Boolean changeEndDate;
	private Long commentId;
	
	public Long getRestrictionCodeId() {
		return restrictionCodeId;
	}
	public void setRestrictionCodeId(Long restrictionCodeId) {
		this.restrictionCodeId = restrictionCodeId;
	}	
	
	public Long getStartDate() {
		return startDate;
	}
	public void setStartDate(Long startDate) {
		this.startDate = startDate;
	}
	
	
	public void setDates() {
		if (!StringUtil.isEmptyOrWhitespace(startDateString)) {
			setStartDate(DateUtil.toDateAsLong(startDateString));
		}
		if (!StringUtil.isEmptyOrWhitespace(endDateString)) {
			setEndDate(DateUtil.toDateAsLong(endDateString));
		}
		
		
		
	}
	
	
	/*
	 * Commented out, because even though it is JsonIgnore
	 * it prevent the date from being persisted to the database
	@JsonIgnore	
	public void setStartDate(Date startDate) {
		setStartDate(startDate.getTime());
	}
	*/
	public Long getEndDate() {
		return endDate;
	}
	public void setEndDate(Long endDate) {
		this.endDate = endDate;
	}
	/*
	 * Commented out, because even though it is JsonIgnore
	 * it prevent the date from being persisted to the database
	@JsonIgnore
	public void setEndDate(Date endDate) {
		setEndDate(endDate.getTime());
	}
	*/
	public Long getStartDateCodeId() {
		return startDateCodeId;
	}
	public void setStartDateCodeId(Long startDateCodeId) {
		this.startDateCodeId = startDateCodeId;
	}
	public Long getEndDateCodeId() {
		return endDateCodeId;
	}
	public void setEndDateCodeId(Long endDateCodeId) {
		this.endDateCodeId = endDateCodeId;
	}
	public Long getStartDateExprInstncId() {
		return startDateExprInstncId;
	}
	public void setStartDateExprInstncId(Long startDateExprInstncId) {
		this.startDateExprInstncId = startDateExprInstncId;
	}
	public Long getEndDateExprInstncId() {
		return endDateExprInstncId;
	}
	public void setEndDateExprInstncId(Long endDateExprInstncId) {
		this.endDateExprInstncId = endDateExprInstncId;
	}
	public Long getProductRestrictionId() {
		return productRestrictionId;
	}
	public void setProductRestrictionId(Long productRestrictionId) {
		this.productRestrictionId = productRestrictionId;
	}
	public Long getRestrictionId() {
		return restrictionId;
	}
	public void setRestrictionId(Long restrictionId) {
		this.restrictionId = restrictionId;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public String getCommentTitle() {
		return commentTitle;
	}
	public void setCommentTitle(String commentTitle) {
		this.commentTitle = commentTitle;
	}
	public Long getCommentTimestampId() {
		return commentTimestampId;
	}
	public void setCommentTimestampId(Long commentTimestampId) {
		this.commentTimestampId = commentTimestampId;
	}
	public String getStartDateString() {
		return startDateString;
	}
	public void setStartDateString(String startDateString) {
		this.startDateString = startDateString;
	}
	public String getEndDateString() {
		return endDateString;
	}
	public void setEndDateString(String endDateString) {
		this.endDateString = endDateString;
	}
	public Boolean getChangeStartDate() {
		return changeStartDate;
	}
	public void setChangeStartDate(Boolean changeStartDate) {
		this.changeStartDate = changeStartDate;
	}
	public Boolean getChangeEndDate() {
		return changeEndDate;
	}
	public void setChangeEndDate(Boolean changeEndDate) {
		this.changeEndDate = changeEndDate;
	}
	
	public boolean startDateChanged() {
		return Boolean.TRUE.equals(getChangeStartDate());
	}
	
	public boolean endDateChanged() {
		return Boolean.TRUE.equals(getChangeEndDate());
	}
	
	
	public boolean hasComment() {
		return commentId!=null;
	}
		
	
	public Long getCommentId() {
		return commentId;
	}
	public void setCommentId(Long commentId) {
		this.commentId = commentId;
	}
	
	public boolean hasRestrictionCode(Long restrictionCodeId) {
		if (restrictionCodeId==null) return false;
		if (this.restrictionCodeId==null) return false;
		return restrictionCodeId.equals(this.restrictionCodeId);
	}
	
	/**
	 * Returns true if any of the dates have changed
	 * @return
	 */
	public boolean hasChanged() {
		Boolean t = Boolean.TRUE;
		if (t.equals(getChangeEndDate())||
			t.equals(getChangeStartDate())) {
			return true;
		}
		return false;
	}
	
}
