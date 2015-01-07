package com.fox.it.erm;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name="RGHT_STRND_SET")
public class ErmRightStrandSet {

	@Id
	@SequenceGenerator(name = "RGHT_STRND_SET_SEQ", sequenceName = "RGHT_STRND_SET_SEQ",allocationSize=1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "RGHT_STRND_SET_SEQ")								
	@Column(name="RGHT_STRND_SET_ID")
	private Long rightStrandSetId;
	
	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="CRT_DT")
	private Date createDate;
	
	@Column(name="CRT_NM")
	private String createName;
	
	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="UPD_DT")
	private Date updateDate;
	
	@Column(name="UPD_NM")
	private String updateName;
	
	@Column(name="STRND_SET_NM")
	private String strandSetName;
	
	@Column(name="STRND_SET_DESC")
	private String strandSetDescription;
	
	//TODO maybe remove this as is unnecessary
	@ManyToOne(fetch=FetchType.EAGER)
	@JoinColumn(name="FOX_VERSION_ID", nullable=false,updatable=false,insertable=false)
	private ErmProductVersionHeader ermProductVersion;
	
	@Column(name="FOX_VERSION_ID")
	private Long foxVersionId;

	public Long getRightStrandSetId() {
		return rightStrandSetId;
	}

	public void setRightStrandSetId(Long rightStrandSetId) {
		this.rightStrandSetId = rightStrandSetId;
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

	public String getStrandSetName() {
		return strandSetName;
	}

	public void setStrandSetName(String strandSetName) {
		this.strandSetName = strandSetName;
	}

	public String getStrandSetDescription() {
		return strandSetDescription;
	}

	public void setStrandSetDescription(String strandSetDescription) {
		this.strandSetDescription = strandSetDescription;
	}

	public ErmProductVersionHeader getErmProductVersion() {
		return ermProductVersion;
	}

	public void setErmProductVersion(ErmProductVersionHeader ermProductVersion) {
		this.ermProductVersion = ermProductVersion;
	}

	public Long getFoxVersionId() {
		return foxVersionId;
	}

	public void setFoxVersionId(Long foxVersionId) {
		this.foxVersionId = foxVersionId;
	}
	
	

	
	
}
