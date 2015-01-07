package com.fox.it.erm.comments;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="REF_CMNT_STS")
public class CommentStatus {

	@Id
	@Column(name="CMNT_STS_ID")
	private Long commentStatusId;
	
	@Column(name="CMNT_STS_CD")
	private String commentStatusCode;
	
	@Column(name="CMNT_STS_DESC")
	private String commentStatusDescription;

	public Long getCommentStatusId() {
		return commentStatusId;
	}

	public void setCommentStatusId(Long commentStatusId) {
		this.commentStatusId = commentStatusId;
	}

	public String getCommentStatusCode() {
		return commentStatusCode;
	}

	public void setCommentStatusCode(String commentStatusCode) {
		this.commentStatusCode = commentStatusCode;
	}

	public String getCommentStatusDescription() {
		return commentStatusDescription;
	}

	public void setCommentStatusDescription(String commentStatusDescription) {
		this.commentStatusDescription = commentStatusDescription;
	}

	
	
}
