package com.fox.it.erm.query;



import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name="SVD_QRY_PARAM")
public class QueryParameters {
	@Id
	@Column(name="QRY_PARAM_ID")
	@SequenceGenerator(name = "SVD_QRY_PARAM_SEQ", sequenceName = "SVD_QRY_PARAM_SEQ",allocationSize=1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "SVD_QRY_PARAM_SEQ")
	private Long paramId;
	
	@Id
	@Column(name="QRY_ID")
	private Long queryId;
	
	@Id
	@Column(name="PART_ID")
	private Long partId;
	
	@Id
	@Column(name="PARAM_NM")
	private String name;
	
	@Column(name="PARAM_VAL")
	private String value;
	
	@Column(name="PARAM_TXT")
	private String text;
	
	@Column(name="CRT_NM")
	private String createName;
	
	@Column(name="CRT_DT")
	@Temporal(value=TemporalType.TIMESTAMP)
	private Date createDate;
	
	@Column(name="UPD_NM")
	private String updateName;
	
	@Column(name="UPD_DT") 
	@Temporal(value=TemporalType.TIMESTAMP)
	private Date updateDate;

	public Long getParamId() {
		return paramId;
	}

	public void setParamId(Long paramId) {
		this.paramId = paramId;
	}

	public Long getQueryId() {
		return queryId;
	}

	public void setQueryId(Long queryId) {
		this.queryId = queryId;
	}

	public Long getPartId() {
		return partId;
	}

	public void setPartId(Long partId) {
		this.partId = partId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
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
	
	
}
