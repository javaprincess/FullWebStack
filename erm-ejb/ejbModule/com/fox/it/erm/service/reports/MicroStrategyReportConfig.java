package com.fox.it.erm.service.reports;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

	
@Entity
@Table(name="REPORTS_CONFIG")
public class MicroStrategyReportConfig implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 6524859861029152234L;
	@Id
	@Column(name="REPORT_NAME")
	private String reportName;
	

	@Id
	@Column(name="REPORT_FORMAT")
	private String reportFormat;
	
	@Column(name="SRC")
	private String src;
	
	@Column(name="EVT")
	private String evt;
	
	@Column(name="EXECUTION_MODE")
	private String executionMode;
	
	@Column(name="ENVIRON_NAME")
	private String environmentName;
	
	@Column(name="DOCUMENT_ID")
	private String documentID;
	
	@Column(name="SERVER_NAME")
	private String serverName;
	
	@Column(name="PROJECT")
	private String project;
	
	@Column(name="MS_URL")
	private String microStrategyUrl;
	
	
	
	
	public void setServerName(String name) {
		this.serverName = name;
	}
	
	public String getServerName(){
		return this.serverName;
	}
	
	public void setDocumentID(String documentID) {
		this.documentID = documentID;
		
	}
	
	public String getDocumentID() {
		return this.documentID;
	}
	
	public String getEnvironmentName() {
		return this.environmentName;
	}
	
	public void setEnvironmentName(String environmentName) {
		this.environmentName = environmentName;
	}

	public String getProject() {
		return project;
	}

	public void setProject(String project) {
		this.project = project;
	}

	public String getMicroStrategyUrl() {
		return microStrategyUrl;
	}

	public void setMicroStrategyUrl(String microStrategyUrl) {
		this.microStrategyUrl = microStrategyUrl;
	}

	public String getReportName() {
		return reportName;
	}

	public void setReportName(String reportName) {
		this.reportName = reportName;
	}

	public String getSrc() {
		return src;
	}

	public void setSrc(String src) {
		this.src = src;
	}

	public String getExecutionMode() {
		return executionMode;
	}

	public void setExecutionMode(String executionMode) {
		this.executionMode = executionMode;
	}

	public String getReportFormat() {
		return reportFormat;
	}

	public void setReportFormat(String reportFormat) {
		this.reportFormat = reportFormat;
	}

	public String getEvt() {
		return evt;
	}

	public void setEvt(String evt) {
		this.evt = evt;
	}
}
