package com.fox.it.erm;

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
@Table(name="ERR_LOG")
public class DBErrorLog {

	@Id
	@Column(name="ERR_LOG_ID")
	@SequenceGenerator(name = "ERR_LOG_SEQ", sequenceName = "ERR_LOG_SEQ",allocationSize=1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "ERR_LOG_SEQ")		
	private Long id;
	
	@Column(name="PROG_NM")
	private String programName;
	
	@Column(name="OBJ_NM")
	private String objectName;

	@Column(name="ERR_CD")	
	private String errorCode;
	
	@Column(name="ERR_DESC")	
	private String errorDescription;
	
	@Column(name="SVRTY")	
	private Integer severity;
	
	@Temporal(value=TemporalType.TIMESTAMP)	
	@Column(name="CRT_DT")	
	private Date createDate;
	
	@Column(name="CRT_NM")	
	private String createName;
	
	public DBErrorLog() {

	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getProgramName() {
		return programName;
	}

	public void setProgramName(String programName) {
		this.programName = programName;
	}

	public String getObjectName() {
		return objectName;
	}

	public void setObjectName(String objectName) {
		this.objectName = objectName;
	}

	public String getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(String errorCode) {
		this.errorCode = errorCode;
	}

	public String getErrorDescription() {
		return errorDescription;
	}

	public void setErrorDescription(String errorDescription) {
		this.errorDescription = errorDescription;
	}

	public Integer getSeverity() {
		return severity;
	}

	public void setSeverity(Integer severity) {
		this.severity = severity;
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
	
	

}
