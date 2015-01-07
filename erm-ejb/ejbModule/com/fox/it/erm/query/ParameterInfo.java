package com.fox.it.erm.query;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="SVD_PARAM_INFO")
public class ParameterInfo {

	@Id
	@Column(name="SRC_RPT_ID")
	private Long id;
	
	@Column(name="OPERATOR")
	private String operator;
	
	@Column(name="FOOTER_ORDER")
	private Long footerOrder;
	
	@Column(name="CMNT")
	private String comment;
	
	@Column(name="PROC_NM")
	private String storedProcedureName;
	
	@Column(name="FOOTER_LABEL")
	private String footerLabel;
	
	@Column(name="DB_FIELD")
	private String databaseField;
	
	@Id
	@Column(name="PARAM_NM")
	private String paramName;
	
	/*
	@Column(name="CRT_NM") //nullable == true
	private String createName;
	
	@Column(name="UPD_NM") //nullable == true
	private String updateName;
	*/
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getOperator() {
		return operator;
	}

	public void setOperator(String operator) {
		this.operator = operator;
	}

	public Long getFooterOrder() {
		return footerOrder;
	}

	public void setFooterOrder(Long footerOrder) {
		this.footerOrder = footerOrder;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public String getStoredProcedureName() {
		return storedProcedureName;
	}

	public void setStoredProcedureName(String storedProcedureName) {
		this.storedProcedureName = storedProcedureName;
	}

	public String getFooterLabel() {
		return footerLabel;
	}

	public void setFooterLabel(String footerLabel) {
		this.footerLabel = footerLabel;
	}

	public String getDatabaseField() {
		return databaseField;
	}

	public void setDatabaseField(String databaseField) {
		this.databaseField = databaseField;
	}

	public String getParamName() {
		return paramName;
	}

	public void setParamName(String paramName) {
		this.paramName = paramName;
	}

	/*
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
	*/
}
