package com.fox.it.erm.util;

import java.util.List;

/**
 * Object representing the values passed from the UI to aid in modifying a Clearance Memo
 * @author JonathanP
 *
 */
public class ClearanceMemoEditorCreateObject {
	private List<Long> commentIds;
	private List<Long> strandIds;
	private List<Long> strandRestrictionIds;
	private List<Long> productInfoCodes;
	private List<String> commentTextEntries;
	private List<String> commentTitles;
	private List<Boolean> ignoreTitles;
	private List<Long> clearanceMemoTOCIds;			
	private Long foxVersionId;
	private Long oldParentId;
	private Long parentId;
	private Long childId;
	private Long position;
	private List<Boolean> createNewVersionList;
	private List<Boolean> showOnReportOnlyList;
	private List<Integer> commentStatusList;
	
	
	public List<Long> getCommentIds() {
		return commentIds;
	}
	public void setCommentIds(List<Long> commentIds) {
		this.commentIds = commentIds;
	}
	public List<String> getCommentTextEntries() {
		return commentTextEntries;
	}
	public void setCommentTextEntries(List<String> commentTextEntries) {
		this.commentTextEntries = commentTextEntries;
	}
	public List<String> getCommentTitles() {
		return commentTitles;
	}
	public void setCommentTitles(List<String> commentTitles) {
		this.commentTitles = commentTitles;
	}	
	public List<Boolean> getIgnoreTitles() {
		return ignoreTitles;
	}
	public void setIgnoreTitles(List<Boolean> ignoreTitles) {
		this.ignoreTitles = ignoreTitles;
	}		
	public List<Long> getClearanceMemoTOCIds() {
		return clearanceMemoTOCIds;
	}
	public void setClearanceMemoTOCIds(List<Long> clearanceMemoTOCIds) {
		this.clearanceMemoTOCIds = clearanceMemoTOCIds;
	}
	public Long getFoxVersionId() {
		return foxVersionId;
	}
	public void setFoxVersionId(Long foxVersionId) {
		this.foxVersionId = foxVersionId;
	}
	public Long getParentId() {
		return parentId;
	}
	public Long getOldParentId() {
		return oldParentId;
	}
	public void setOldParentId(Long oldParentId) {
		this.oldParentId = oldParentId;
	}
	public void setParentId(Long parentId) {
		this.parentId = parentId;
	}	
	public Long getChildId() {
		return childId;
	}
	public void setChildId(Long childId) {
		this.childId = childId;
	}
	public Long getPosition() {
		return position;
	}
	public void setPosition(Long position) {
		this.position = position;
	}
	public List<Boolean> getCreateNewVersionList() {
		return createNewVersionList;
	}
	public void setCreateNewVersionList(List<Boolean> createNewVersionList) {
		this.createNewVersionList = createNewVersionList;
	}
	public List<Boolean> getShowOnReportOnlyList() {
		return showOnReportOnlyList;
	}
	public void setShowOnReportOnlyList(List<Boolean> showOnReportOnlyList) {
		this.showOnReportOnlyList = showOnReportOnlyList;
	}
	public List<Integer> getCommentStatusList() {
		return commentStatusList;
	}
	public void setCommentStatusList(List<Integer> commentStatusList) {
		this.commentStatusList = commentStatusList;
	}
	public List<Long> getStrandIds() {
		return strandIds;
	}
	public void setStrandIds(List<Long> strandIds) {
		this.strandIds = strandIds;
	}
	public List<Long> getStrandRestrictionIds() {
		return strandRestrictionIds;
	}
	public void setStrandRestrictionIds(List<Long> strandRestrictionIds) {
		this.strandRestrictionIds = strandRestrictionIds;
	}
	public List<Long> getProductInfoCodes() {
		return productInfoCodes;
	}
	public void setProductInfoCodes(List<Long> productInfoCodes) {
		this.productInfoCodes = productInfoCodes;
	}
	
}
