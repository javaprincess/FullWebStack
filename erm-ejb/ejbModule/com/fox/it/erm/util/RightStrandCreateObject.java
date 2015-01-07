package com.fox.it.erm.util;

import java.util.List;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fox.it.erm.enums.ExclusionInclusion;

public class RightStrandCreateObject {
	private static final Long EXCLUSION = ExclusionInclusion.EXCLUSION.getId();	
	private String endContractualDate;
	private String endContractualDateString;
	private Long endDateCode;
	private Long endDateStatus;
	private String endOverrideDate;
	private String endOverrideDateString;
	private Long inclusionExclusionProduct;
	
	@NotNull(message="1000")
	@Size(min=1, message="1001")
	private Long[] languages;
	
	@NotNull(message="1002")
	@Size(min=1, message="1003")
	private Long[] media;
	private String startContractualDate;
	private String startContractualDateString;
	private Long startDateCode;
	private Long startDateStatus;
	private String startOverrideDate;
	private String startOverrideDateString;
	
	private String strandSetName;
	private Long strandSetId; 
	@NotNull
	private Long foxVersionId;
	
	@NotNull(message="1004")
	@Size(min=1, message="1005")
	private Long[] territories;
	
	private String comment;
	private String commentTitle;
	private Integer linkCopyAttribute;
	private String restrictionComment;
	private String restrictionCommentTitle;
	
	private Long commentId;
	
	private boolean isFoxipediaSearch;
	
	
	private List<RestrictionObject> restrictions;
	
	public String getEndContractualDate() {
		return endContractualDate;
	}
	public void setEndContractualDate(String endContractualDate) {
		this.endContractualDate = endContractualDate;
	}
	public Long getEndDateCode() {
		return endDateCode;
	}
	public void setEndDateCode(Long endDateCode) {
		this.endDateCode = endDateCode;
	}
	public Long getEndDateStatus() {
		return endDateStatus;
	}
	public void setEndDateStatus(Long endDateStatus) {
		this.endDateStatus = endDateStatus;
	}
	public String getEndOverrideDate() {
		return endOverrideDate;
	}
	public void setEndOverrideDate(String endOverrideDate) {
		this.endOverrideDate = endOverrideDate;
	}
	public Long getInclusionExclusionProduct() {
		return inclusionExclusionProduct;
	}
	public void setInclusionExclusionProduct(Long inclusionExclusionProduct) {
		this.inclusionExclusionProduct = inclusionExclusionProduct;
	}
	public Long[] getLanguages() {
		return languages;
	}
	public void setLanguages(Long[] languages) {
		this.languages = languages;
	}
	public Long[] getMedia() {
		return media;
	}
	public void setMedia(Long[] media) {
		this.media = media;
	}

	public String getStartContractualDate() {
		return startContractualDate;
	}
	public void setStartContractualDate(String startContractualDate) {
		this.startContractualDate = startContractualDate;
	}
	public Long getStartDateCode() {
		return startDateCode;
	}
	public void setStartDateCode(Long startDateCode) {
		this.startDateCode = startDateCode;
	}
	public Long getStartDateStatus() {
		return startDateStatus;
	}
	public void setStartDateStatus(Long startDateStatus) {
		this.startDateStatus = startDateStatus;
	}
	public String getStartOverrideDate() {
		return startOverrideDate;
	}
	public void setStartOverrideDate(String startOverrideDate) {
		this.startOverrideDate = startOverrideDate;
	}
	public String getStrandSetName() {
		return strandSetName;
	}
	public void setStrandSetName(String strandSetName) {
		this.strandSetName = strandSetName;
	}
	public Long[] getTerritories() {
		return territories;
	}
	public void setTerritories(Long[] territories) {
		this.territories = territories;
	}
	public Long getStrandSetId() {
		return strandSetId;
	}
	public void setStrandSetId(Long strandSetId) {
		this.strandSetId = strandSetId;
	}
	public Long getFoxVersionId() {
		return foxVersionId;
	}
	public void setFoxVersionId(Long foxVersionId) {
		this.foxVersionId = foxVersionId;
	}
	public List<RestrictionObject> getRestrictions() {
		return restrictions;
	}
	public void setRestrictions(List<RestrictionObject> restrictions) {
		this.restrictions = restrictions;
	}
	
	public boolean hasComment() {
//		return comment!=null&&!comment.trim().isEmpty();
		return commentId!=null;
	}
	
	public String getComment() {
		return comment;
	}
	
	public void setComment(String comment) {
		this.comment = comment;
	}
	
	public boolean isInclusion() {
		return !isExclusion();
	}
	
	public boolean isExclusion() {
		return EXCLUSION.equals(inclusionExclusionProduct);
	}
	public Integer getLinkCopyAttribute() {
		return linkCopyAttribute;
	}
	public void setLinkCopyAttribute(Integer linkCopyAttribute) {
		this.linkCopyAttribute = linkCopyAttribute;
	}
	public String getCommentTitle() {
		return commentTitle;
	}
	public void setCommentTitle(String commentTitle) {
		this.commentTitle = commentTitle;
	}
	public String getRestrictionComment() {
		return restrictionComment;
	}
	public void setRestrictionComment(String restrictionComment) {
		this.restrictionComment = restrictionComment;
	}
	public String getRestrictionCommentTitle() {
		return restrictionCommentTitle;
	}
	public void setRestrictionCommentTitle(String restrictionCommentTitle) {
		this.restrictionCommentTitle = restrictionCommentTitle;
	}
	public String getEndContractualDateString() {
		return endContractualDateString;
	}
	public void setEndContractualDateString(String endContractualDateString) {
		this.endContractualDateString = endContractualDateString;
	}
	public String getEndOverrideDateString() {
		return endOverrideDateString;
	}
	public void setEndOverrideDateString(String endOverrideDateString) {
		this.endOverrideDateString = endOverrideDateString;
	}
	public String getStartContractualDateString() {
		return startContractualDateString;
	}
	public void setStartContractualDateString(String startContractualDateString) {
		this.startContractualDateString = startContractualDateString;
	}
	public String getStartOverrideDateString() {
		return startOverrideDateString;
	}
	public void setStartOverrideDateString(String startOverrideDateString) {
		this.startOverrideDateString = startOverrideDateString;
	}
	
	
	
	public Long getCommentId() {
		return commentId;
	}
	public void setCommentId(Long commentId) {
		this.commentId = commentId;
	}
	
	
	public boolean isFoxipediaSearch() {
		return isFoxipediaSearch;
	}
	public void setIsFoxipediaSearch(boolean isFoxipediaSearch) {
		this.isFoxipediaSearch = isFoxipediaSearch;
	}
	public void setDates() {
		if (!StringUtil.isEmptyOrWhitespace(startContractualDateString)) {
			setStartContractualDate(startContractualDateString);
		}
		if (!StringUtil.isEmptyOrWhitespace(endContractualDateString)) {
			setEndContractualDate(endContractualDateString);
		}
		if (!StringUtil.isEmptyOrWhitespace(startOverrideDateString)) {
			setStartOverrideDate(startOverrideDateString);
		}
		if (!StringUtil.isEmptyOrWhitespace(endOverrideDateString)) {
			setEndOverrideDate(endOverrideDateString);
		}		

		setRestrictionDates();
	}
	
	public void setRestrictionDates() {
		if(this.restrictions != null && this.restrictions.size() > 0){
			for (RestrictionObject r: getRestrictions()) {
				r.setDates();
			}
		}		
	}
	
}
