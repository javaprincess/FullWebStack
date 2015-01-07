package com.fox.it.erm.grants;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="REF_ENTTY_CMNT_TYP")
public class SalesAndMarketingCategory extends Category implements Comparable<SalesAndMarketingCategory> {
	
	//COLUMNS -- BEGIN
	@Id
	@Column(name="ENTTY_CMNT_TYP_ID")
	private Long id;
	
	@Column(name="CRT_DT")
	private Date createDate;
	
	@Column(name="UPD_DT")
	private Date updateDate;
	
	@Column(name="BSNS_IND")
	private Long businessIndicator;
	
	@Column(name="LGL_IND")
	private Long legalIndicator;
	
	@Column(name="ENTTY_CMNT_CAT_ID")
	private Long categoryId;
	
	@Column(name="ENTTY_CMNT_TYP_DESC")
	private String description;
	
	@Column(name="ENTTY_CMNT_TYP_CD")
	private String code;
	
	@Column(name="CRT_NM")
	private String createName;
	
	@Column(name="UPD_NM")
	private String updateName;
	//COLUMNS -- BEGIN

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}

	public Long getBusinessIndicator() {
		return businessIndicator;
	}

	public void setBusinessIndicator(Long businessIndicator) {
		this.businessIndicator = businessIndicator;
	}

	public Long getLegalIndicator() {
		return legalIndicator;
	}

	public void setLegalIndicator(Long legalIndicator) {
		this.legalIndicator = legalIndicator;
	}

	public Long getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(Long categoryId) {
		this.categoryId = categoryId;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getCreateName() {
		return createName;
	}

	public void setCreateName(String createName) {
		this.createName = createName;
	}

	public String getUpdateName() {
		return updateName;
	}

	public void setUpdateName(String updateName) {
		this.updateName = updateName;
	}
	
	@Override
	public int compareTo(SalesAndMarketingCategory o) {
		return id.compareTo(o.getId());
	}	
	
}
