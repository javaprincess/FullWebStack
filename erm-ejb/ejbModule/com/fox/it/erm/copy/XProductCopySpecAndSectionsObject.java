package com.fox.it.erm.copy;

import java.util.List;

public class XProductCopySpecAndSectionsObject {
	private Long fromFoxVersionId;
	private List<Long> toFoxVersionIds;
	private List<Long> clearanceMemoCommentIds;	
	private List<String> sections;
	public Long getFromFoxVersionId() {
		return fromFoxVersionId;
	}
	public void setFromFoxVersionId(Long fromFoxVersionId) {
		this.fromFoxVersionId = fromFoxVersionId;
	}
	public List<Long> getToFoxVersionIds() {
		return toFoxVersionIds;
	}
	public void setToFoxVersionIds(List<Long> toFoxVersionIds) {
		this.toFoxVersionIds = toFoxVersionIds;
	}
	public List<Long> getClearanceMemoCommentIds() {
		return clearanceMemoCommentIds;
	}
	public void setClearanceMemoCommentIds(List<Long> clearanceMemoCommentIds) {
		this.clearanceMemoCommentIds = clearanceMemoCommentIds;
	}
	public List<String> getSections() {
		return sections;
	}
	public void setSections(List<String> sections) {
		this.sections = sections;
	}
	
	
}
