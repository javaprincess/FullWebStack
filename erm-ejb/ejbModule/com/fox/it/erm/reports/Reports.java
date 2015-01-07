package com.fox.it.erm.reports;

import java.sql.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;


@Entity
@Table(name="SRC_RPT")
public class Reports {
	
	//COLUMNS -- BEGIN
	@Id
	@Column(name="SRC_RPT_ID")
	@SequenceGenerator(name = "SRC_RPT_SEQ", sequenceName = "SRC_RPT_SEQ",allocationSize=1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SRC_RPT_SEQ")
	private Long id;
	

	@Column(name="SRC_RPT_CD")
	private String code;
	
	@Column(name="RPT_DESC")
	private String description;
	
	
	@Column(name="SRC_RPT_ORDR")		
	private Long order;
	
	@Column(name="ADDL_CMNT") //nullable == true
	private String additionalComment;
	
	@Column(name="PROC_NM")
	private String prodecureName;
	
	
	@Column(name="CRT_DT")
	private Date createDate;
	
	
	@Column(name="UPD_DT") //nullable == true
	private Date updateDate;
	
	@Column(name="CRT_NM") //nullable == true
	private String createName;
	
	@Column(name="UPD_NM") //nullable == true
	private String updateName;

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

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Long getOrder() {
		return order;
	}

	public void setOrder(Long order) {
		this.order = order;
	}

	public String getAdditionalComment() {
		return additionalComment;
	}

	public void setAdditionalComment(String additionalComment) {
		this.additionalComment = additionalComment;
	}

	public String getProdecureName() {
		return prodecureName;
	}

	public void setProdecureName(String prodecureName) {
		this.prodecureName = prodecureName;
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

	//COLUMNS -- END

}
