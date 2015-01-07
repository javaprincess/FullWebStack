package com.fox.it.erm.query;

public class QuerySearchObject {

	private String queryName;
	private String personalTag;
	private String comment;
	private Long sourceReportId;
	private String publicFlag;
	private String createName;
	
	
	public String getQueryName() {
		return queryName;
	}
	public void setQueryName(String queryName) {
		this.queryName = queryName;
	}
	public String getPersonalTag() {
		return personalTag;
	}
	public void setPersonalTag(String personalTag) {
		this.personalTag = personalTag;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	
	public String getPublicFlag() {
		return publicFlag;
	}
	public void setPublicFlag(String publicFlag) {
		this.publicFlag = publicFlag;
	}
	
	public Long getSourceReportId() {
		return sourceReportId;
	}
	public void setSourceReportId(Long sourceReportId) {
		this.sourceReportId = sourceReportId;
	}
	public String getCreateName() {
		return createName;
	}
	public void setCreateName(String createName) {
		this.createName = createName;
	}
	
}
