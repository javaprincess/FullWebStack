package com.fox.it.erm;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;



@Entity
@Table(name="REF_ENTTY_CMNT_TYP")
public class EntityCommentType implements ErmUpdatable{
	@Id
	@Column(name="ENTTY_CMNT_TYP_ID")
	private Long id;
	
	
	@Column(name="ENTTY_CMNT_TYP_CD")
	private String code;
	
	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="CRT_DT")
	private Date createDate;
	
	@Column(name="CRT_NM", length=50)
	private String createName;
	
	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="UPD_DT")
	private Date updateDate;
	
	@Column(name="LGL_IND")
	private Boolean legalInd;
	
	@Column(name="BSNS_IND")
	private Boolean businessInd;
	
	
	@Column(name="UPD_NM", length=50)
	private String updateName;
	
	@Column(name="ENTTY_CMNT_CAT_ID")
	private Long categoryId;
	

	public EntityCommentType() {
	}


	public Long getId() {
		return id;
	}


	public void setId(Long id) {
		this.id = id;
	}


	public String getCode() {
		return code;
	}


	public void setCode(String code) {
		this.code = code;
	}


	public Date getCreateDate() {
		return createDate;
	}


	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}


	public String getCreateName() {
		return createName;
	}


	public void setCreateName(String createName) {
		this.createName = createName;
	}


	public Date getUpdateDate() {
		return updateDate;
	}


	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}


	public String getUpdateName() {
		return updateName;
	}


	public void setUpdateName(String updateName) {
		this.updateName = updateName;
	}


	public Boolean getLegalInd() {
		return legalInd;
	}


	public void setLegalInd(Boolean legalInd) {
		this.legalInd = legalInd;
	}


	public Boolean getBusinessInd() {
		return businessInd;
	}


	public void setBusinessInd(Boolean businessInd) {
		this.businessInd = businessInd;
	}
	
	public boolean isBusiness() {
		return Boolean.TRUE.equals(getBusinessInd());
	}

	public boolean isLegal() {
		return Boolean.TRUE.equals(getLegalInd());
	}


	@Override
	public boolean isNew() {
		return id==null;
	}
	
	


	public Long getCategoryId() {
		return categoryId;
	}


	public void setCategoryId(Long categoryId) {
		this.categoryId = categoryId;
	}


	@Override
	public String getIconType() {
		// unimplemented
		return null;
	}
	
	
	
	
	
	
	
}
