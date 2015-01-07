package com.fox.it.erm;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class ProductGrantComment {
	@Id
	@Column(name="ID")
	private String id;
	
	@Column(name="PROD_GRNT_ID")	
	private Long productGrantId;
	@Column(name="FOX_VERSION_ID")	
	private Long foxVersionId;
	@Column(name="GRNT_CD_ID")	
	private Long grantCodeId;
	@Column(name="ENTTY_CMNT_ID")	
	private Long entityCommentId;	
	@Column(name="ENTTY_CMNT_TYP_ID")
	private Long entityTypeId;
	@Column(name="CMNT_ID")	
	private Long commentId;
	@Column(name="CMNT_SHRT_DESC")	
	private String shortDescription;
	
	public ProductGrantComment() {

	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Long getProductGrantId() {
		return productGrantId;
	}

	public void setProductGrantId(Long productGrantId) {
		this.productGrantId = productGrantId;
	}

	public Long getFoxVersionId() {
		return foxVersionId;
	}

	public void setFoxVersionId(Long foxVersionId) {
		this.foxVersionId = foxVersionId;
	}

	public Long getGrantCodeId() {
		return grantCodeId;
	}

	public void setGrantCodeId(Long grantCodeId) {
		this.grantCodeId = grantCodeId;
	}

	public Long getEntityCommentId() {
		return entityCommentId;
	}

	public void setEntityCommentId(Long entityCommentId) {
		this.entityCommentId = entityCommentId;
	}

	public Long getCommentId() {
		return commentId;
	}

	public void setCommentId(Long commentId) {
		this.commentId = commentId;
	}

	public String getShortDescription() {
		return shortDescription;
	}

	public void setShortDescription(String shortDescription) {
		this.shortDescription = shortDescription;
	}

	public Long getEntityTypeId() {
		return entityTypeId;
	}

	public void setEntityTypeId(Long entityTypeId) {
		this.entityTypeId = entityTypeId;
	}
	
	
	

}
