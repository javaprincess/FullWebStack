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
import javax.persistence.Transient;

/**
 * 
 * @author JonathanP
 *
 */
@Entity
@Table(name="PROD_CNTCT")
public class ErmProductContact { 
	@Id
	@SequenceGenerator(name = "PROD_CNTCT_SEQ", sequenceName = "PROD_CNTCT_SEQ",allocationSize=1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "PROD_CNTCT_SEQ")
	@Column(name="PROD_CNTCT_ID")
	private Long productContactId;
	
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
	
	@Column(name="FOX_VERSION_ID")
	private Long foxVersionId;
	
	@Column(name="PTY_ID")
	private Long partyId;
	
	@Column(name="CNTCT_TYP_ID")
	private Long contactTypeId;
	
	@Transient
	private String contactTypeIdString;
	
	@Column(name="ACCESS_TYP_ID")
	private Long accessTypeId;
	
	@Transient
	private String accessTypeIdString;
	
	@Column(name="DEL_IND")
	private Boolean delInd;
	
	@ManyToOne(fetch=FetchType.LAZY)				
	@JoinColumn(name="PTY_ID",insertable=false,updatable=false)
	private ErmParty contact;		
		
	public Long getProductContactId() {
		return productContactId;
	}
	public void setProductContactId(Long productContactId) {
		this.productContactId = productContactId;
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
	public Long getFoxVersionId() {
		return foxVersionId;
	}
	public void setFoxVersionId(Long foxVersionId) {
		this.foxVersionId = foxVersionId;
	}
	public Long getPartyId() {
		return partyId;
	}
	public void setPartyId(Long partyId) {
		this.partyId = partyId;
	}
	public Long getContactTypeId() {
		return contactTypeId;
	}
	public void setContactTypeId(Long contactTypeId) {
		this.contactTypeId = contactTypeId;
	}	
	public Long getAccessTypeId() {
		return accessTypeId;
	}
	public void setAccessTypeId(Long accessTypeId) {
		this.accessTypeId = accessTypeId;
	}
	public Boolean getDelInd() {
		return delInd;
	}
	public void setDelInd(Boolean delInd) {
		this.delInd = delInd;
	}
	public boolean isDeleted() {
		return Boolean.TRUE.equals(getDelInd());
	}
	public ErmParty getContact() {
		return contact;
	}
	public void setContact(ErmParty contact) {
		this.contact = contact;
	}
	public String getContactTypeIdString() {
		return contactTypeId.toString();
	}
	public void setContactTypeIdString(String contactTypeIdString) {
		this.contactTypeIdString = contactTypeIdString;
	}
	public String getAccessTypeIdString() {
		return accessTypeId.toString();
	}
	public void setAccessTypeIdString(String accessTypeIdString) {
		this.accessTypeIdString = accessTypeIdString;
	}		
	
}
