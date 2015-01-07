package com.fox.it.erm.util;

import java.util.ArrayList;
import java.util.List;

import com.fox.it.erm.enums.ExclusionInclusion;

/**
 * Object that represents the user's selection when updating one or more right strands
 * This is de-serialized from JSON
 * @author AndreasM  
 */
public class RightStrandUpdateObject {
	private static final Long EXCLUSION = ExclusionInclusion.EXCLUSION.getId();
	private static final Long INCLUSION_EXCLISION = ExclusionInclusion.BOTH.getId();
	private List<Long> ids;
	private Long mediaId;
	private Long territoryId;
	private Long languageId;
	
	private List<Long> mediaIds;
	private List<Long> territoryIds;
	private List<Long> languageIds;
	
	private String endContractualDateString;
	private Long endContractualDate;
	private Long endDateCode;
	private Long endDateStatus;
	private String endOverrideDateString;
	private Long endOverrideDate;
	
	private String startContractualDateString;
	private Long startContractualDate;
	private Long startDateCode;
	private Long startDateStatus;
	private String startOverrideDateString;
	private Long startOverrideDate;
	
	private String strandSetName;
	private Long strandSetId;
	
	private Long inclusionExclusion;
	
	private Long processFlag;
	
	
	private List<RestrictionObject> restrictionsToAdd;
	private List<RestrictionObject> restrictionsToRemove;
	
	private List<Long> targetProductVersionIds;
	private Long fromProductVersionId;
	
	private String comment;
	private String commentTitle;
	private Boolean changeStartDate = false;
	private Boolean changeEndDate = false;
	private Boolean changeOverrideStartDate = false;
	private Boolean changeOverrideEndDate = false;
	private String restrictionComment;
	private String restrictionCommentTitle;
	private Boolean deleteOriginal;

	//new fields
	private Boolean deleteOverrideStartDate;
	private Boolean deleteOverrideEndDate;
	
	private Long commentId;
	
	private boolean isFoxipediaSearch;
	
	public List<Long> getIds() {
		return ids;
	}
	public void setIds(List<Long> ids) {
		this.ids = ids;
	}
	public Long getMediaId() {
		return mediaId;
	}
	public void setMediaId(Long mediaId) {
		this.mediaId = mediaId;
	}
	public Long getTerritoryId() {
		return territoryId;
	}
	public void setTerritoryId(Long territoryId) {
		this.territoryId = territoryId;
	}
	public Long getLanguageId() {
		return languageId;
	}
	public void setLanguageId(Long languageId) {
		this.languageId = languageId;
	}
	public Long getEndContractualDate() {
		return endContractualDate;
	}
	public void setEndContractualDate(Long endContractualDate) {
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
	public void setEndDateStatus(long endDateStatus) {
		this.endDateStatus = endDateStatus;
	}
	public Long getEndOverrideDate() {
		return endOverrideDate;
	}
	public void setEndOverrideDate(Long endOverrideDate) {
		this.endOverrideDate = endOverrideDate;
	}
	public Long getStartContractualDate() {
		return startContractualDate;
	}
	public void setStartContractualDate(Long startContractualDate) {
		this.startContractualDate = startContractualDate;
	}
	public Long getStartDateCode() {
		return startDateCode;
	}
	public void setStartDateCode(long startDateCode) {
		this.startDateCode = startDateCode;
	}
	public Long getStartDateStatus() {
		return startDateStatus;
	}
	public void setStartDateStatus(Long startDateStatus) {
		this.startDateStatus = startDateStatus;
	}
	public Long getStartOverrideDate() {
		return startOverrideDate;
	}
	public void setStartOverrideDate(Long startOverrideDate) {
		this.startOverrideDate = startOverrideDate;
	}
	public String getStrandSetName() {
		return strandSetName;
	}
	public void setStrandSetName(String strandSetName) {
		this.strandSetName = strandSetName;
	}
	public Long getStrandSetId() {
		return strandSetId;
	}
	public void setStrandSetId(long strandSetId) {
		this.strandSetId = strandSetId;
	}
	public List<RestrictionObject> getRestrictionsToAdd() {
		if (restrictionsToAdd==null) {
			restrictionsToAdd = new ArrayList<>();
		}
		return restrictionsToAdd;
	}
	public void setRestrictionsToAdd(List<RestrictionObject> restrictionsToAdd) {
		this.restrictionsToAdd = restrictionsToAdd;
	}
	public List<RestrictionObject> getRestrictionsToRemove() {
		if (restrictionsToRemove==null) {
			restrictionsToRemove = new ArrayList<>();
		}
		return restrictionsToRemove;
	}
	public void setRestrictionsToRemove(List<RestrictionObject> restrictionsToRemove) {
		this.restrictionsToRemove = restrictionsToRemove;
	}
	public Long getInclusionExclusion() {
		return inclusionExclusion;
	}
	public void setInclusionExclusion(Long inclusionExclusion) {
		this.inclusionExclusion = inclusionExclusion;
	}
	
	
	public void setExclusion() {
		setInclusionExclusion(EXCLUSION);
	}
	
	public boolean isSinlgeStrandUpdate() {
		if (getIds()==null) return false;
		return getIds().size()==1;
	}
	
	public boolean isInclusion() {
		return !isExclusion() && !isInclusionExclusion();
	}
	
	public boolean isExclusion() {
		return EXCLUSION.equals(inclusionExclusion);
	}
	
	public boolean isInclusionExclusion() {
		return INCLUSION_EXCLISION.equals(inclusionExclusion);
	}
	public Long getProcessFlag() {
		return processFlag;
	}
	public void setProcessFlag(Long processFlag) {
		this.processFlag = processFlag;
	}
	
	
	public boolean isRestrictionChange() {
		return getRestrictionsToAdd().size()>0||
			   getRestrictionsToRemove().size()>0;
	}
	public List<Long> getMediaIds() {
		return mediaIds;
	}
	public void setMediaIds(List<Long> mediaIds) {
		this.mediaIds = mediaIds;
	}
	public List<Long> getTerritoryIds() {
		return territoryIds;
	}
	public void setTerritoryIds(List<Long> territoryIds) {
		this.territoryIds = territoryIds;
	}
	public List<Long> getLanguageIds() {
		return languageIds;
	}
	public void setLanguageIds(List<Long> languageIds) {
		this.languageIds = languageIds;
	}
	public List<Long> getTargetProductVersionIds() {
		return targetProductVersionIds;
	}
	public void setTargetProductVersionIds(List<Long> targetProductVersionIds) {
		this.targetProductVersionIds = targetProductVersionIds;
	}
	public Long getFromProductVersionId() {
		return fromProductVersionId;
	}
	public void setFromProductVersionId(Long fromProductVersionId) {
		this.fromProductVersionId = fromProductVersionId;
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
	
	/**
	 * Set the dates based on the string value
	 */
	public void setDates() {
		if (!StringUtil.isEmptyOrWhitespace(startContractualDateString)) {
			setStartContractualDate(toDateAsLong(startContractualDateString));
		}
		if (!StringUtil.isEmptyOrWhitespace(endContractualDateString)) {
			setEndContractualDate(toDateAsLong(endContractualDateString));
		}
		if (!StringUtil.isEmptyOrWhitespace(startOverrideDateString)) {
			setStartOverrideDate(toDateAsLong(startOverrideDateString));
		}
		if (!StringUtil.isEmptyOrWhitespace(endOverrideDateString)) {
			setEndOverrideDate(toDateAsLong(endOverrideDateString));
		}
		if (isDeleteOverrideStartDate()) {
			setStartOverrideDate(null);
		}

		if (isDeleteOverrideEndDate()) {
			setEndOverrideDate(null);
		}
		

		setRestrictionDates();
	}
	
	public void setRestrictionDates() {
		for (RestrictionObject r: getRestrictionsToAdd()) {
			r.setDates();
		}
		for (RestrictionObject r: getRestrictionsToRemove()) {
			r.setDates();
		}
	}
	


	
	private Long toDateAsLong(String dateStr) {
		return DateUtil.toDateAsLong(dateStr);
	}
	
	public boolean hasComment() {
		return commentId!=null;
	}
	public boolean hasCommentInRestrictions() {
		return getCommentIdFromRestrictions()!=null;
	}
	
	public Long getCommentIdFromRestrictions() {
		for (RestrictionObject restriction: restrictionsToAdd) {
			if (restriction.getCommentId()!=null) {
				return restriction.getCommentId();
			}
		}
		return null;
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
	public Boolean getChangeStartDate() {
		return changeStartDate;
	}
	
	public boolean isChageStartDate() {
		return isTrue(getChangeStartDate());
	}
	
	public void setChangeStartDate(Boolean changeStartDate) {
		this.changeStartDate = changeStartDate;
	}
	public Boolean getChangeEndDate() {
		return changeEndDate;
	}
	
	public boolean isChangeEndDate() {
		return isTrue(getChangeEndDate());
	}
	
	public void setChangeEndDate(Boolean changeEndDate) {
		this.changeEndDate = changeEndDate;
	}
	private boolean isTrue(Boolean b) {
		return Boolean.TRUE.equals(b);
	}
	
	public Boolean getChangeOverrideStartDate() {
		return changeOverrideStartDate;
	}
	public boolean isChangeOverrideStartDate() {
		return isTrue(getChangeOverrideStartDate());
	}

	
	public void setChangeOverrideStartDate(Boolean changeOverrideStartDate) {
		this.changeOverrideStartDate = changeOverrideStartDate;
	}
	public Boolean getChangeOverrideEndDate() {
		return changeOverrideEndDate;
	}
	
	public boolean isChangeOverrideEndDate() {
		return isTrue(getChangeOverrideEndDate());
	}
	public void setChangeOverrideEndDate(Boolean changeOverrideEndDate) {
		this.changeOverrideEndDate = changeOverrideEndDate;
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
	public Boolean getDeleteOriginal() {
		return deleteOriginal;
	}
	public void setDeleteOriginal(Boolean deleteOriginal) {
		this.deleteOriginal = deleteOriginal;
	}
	
	public boolean shouldDeleteOriginal() {
		return Boolean.TRUE.equals(deleteOriginal);
	}
	public Boolean getDeleteOverrideStartDate() {
		return deleteOverrideStartDate;
	}
	public void setDeleteOverrideStartDate(Boolean deleteOverrideStartDate) {
		this.deleteOverrideStartDate = deleteOverrideStartDate;
	}
	public Boolean getDeleteOverrideEndDate() {
		return deleteOverrideEndDate;
	}
	public void setDeleteOverrideEndDate(Boolean deleteOverrideEndDate) {
		this.deleteOverrideEndDate = deleteOverrideEndDate;
	}
	
	public boolean isDeleteOverrideStartDate() {
		return Boolean.TRUE.equals(getDeleteOverrideStartDate());
	}
	
	public boolean isDeleteOverrideEndDate() {
		return Boolean.TRUE.equals(getDeleteOverrideEndDate());		
	}
	
	private boolean hasRestrictionCode(List<RestrictionObject> restrictions, Long restrictionCodeId) {
		if (restrictions==null) return false;
		for (RestrictionObject restriction: restrictions) {
			if (restriction.hasRestrictionCode(restrictionCodeId)) {
				return true;
			}
		}
		return false;
	}
	
	public boolean hasAddRestriction(Long restrictionCodeId) {
		return hasRestrictionCode(restrictionsToAdd,restrictionCodeId);
	}
	
	public boolean hasRemoveRestriction(Long restrictionCodeId) {
		return hasRestrictionCode(restrictionsToRemove,restrictionCodeId);
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
	
	
	
	
	

}
