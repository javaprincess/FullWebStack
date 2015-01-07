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
import javax.persistence.Transient;

import com.fox.it.erm.comments.EntityComment;

@Entity
@Table(name="CNTRCT_INFO")
public class ErmContractInfo {	
	
	@Id
	@SequenceGenerator(name = "CNTRCT_INFO_SEQ", sequenceName = "CNTRCT_INFO_SEQ",allocationSize=1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "CNTRCT_INFO_SEQ")	
	@Column(name="CNTRCT_INFO_ID")
	private Long contractInfoId;

	@Column(name="FOX_VERSION_ID")
	private Long foxVersionId;
	
	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="CRT_DT")
	private Date createDate;
	
	@Column(name="CRT_NM", length=50)
	private String createName;
	
	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="UPD_DT")
	private Date updateDate;
	
	@Column(name="UPD_NM", length=50)
	private String updateName;
	
	@Column(name="FOX_ENTTY_PTY_ID")
	private Long foxEntityPartyId;	
	
	@Column(name="CNTRCT_PTY_ID")
	private Long contractualPartyId;
	
	@Column(name="CNTRCT_PTY_TYP_ID")
	private Long contractualPartyTypeId;
	
	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="CNTRCT_DT")
	private Date contractDate;
	
	@Transient
	private Long index;
	
	@Transient
	private EntityComment comment;
	
	@Transient
	private String $$hashKey;
	
	public Long getContractInfoId() {
		return contractInfoId;
	}

	public void setContractInfoId(Long contractInfoId) {
		this.contractInfoId = contractInfoId;
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

	public Long getFoxEntityPartyId() {
		return foxEntityPartyId;
	}

	public void setFoxEntityPartyId(Long foxEntityPartyId) {
		this.foxEntityPartyId = foxEntityPartyId;
	}

	public Long getContractualPartyId() {
		return contractualPartyId;
	}

	public void setContractualPartyId(Long contractualPartyId) {
		this.contractualPartyId = contractualPartyId;
	}

	public Long getContractualPartyTypeId() {
		return contractualPartyTypeId;
	}

	public void setContractualPartyTypeId(Long contractualPartyTypeId) {
		this.contractualPartyTypeId = contractualPartyTypeId;
	}

	public Date getContractDate() {
		return contractDate;
	}

	public void setContractDate(Date contractDate) {
		this.contractDate = contractDate;
	}

	public Long getFoxVersionId() {
		return foxVersionId;
	}

	public void setFoxVersionId(Long foxVersionId) {
		this.foxVersionId = foxVersionId;
	}

	public Long getIndex() {
		return index;
	}

	public void setIndex(Long index) {
		this.index = index;
	}

	public String get$$hashKey() {
		return $$hashKey;
	}

	public void set$$hashKey(String $$hashKey) {
		this.$$hashKey = $$hashKey;
	}

	public EntityComment getComment() {
		return comment;
	}

	public void setComment(EntityComment comment) {
		this.comment = comment;
	}
	
	public void copyBasicFrom(ErmContractInfo c) {
		setContractDate(c.getContractDate());
		setContractualPartyId(c.getContractualPartyId());
		setContractualPartyTypeId(c.getContractualPartyTypeId());
		setFoxEntityPartyId(c.getFoxEntityPartyId());		
	}
	
	
	
}
