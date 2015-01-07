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

/**
 * 
 * @author JonathanP
 *
 */
@Entity
@Table(name="PARTY_VW")
public class ErmParty implements Comparable<ErmParty> { 
	
	@Id
	@SequenceGenerator(name = "PARTY_SEQ", sequenceName = "PARTY_SEQ",allocationSize=1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "PARTY_SEQ")
	@Column(name="PTY_ID")
	private Long partyId;
	
	@Column(name="PTY_TYP_CD", length=15)
	private String partyTypeCode;
	
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
	
	@Column(name="GIVEN_NM", length=100)
	private String givenName;
	
	@Column(name="MID_NM", length=100)
	private String middleName;
	
	@Column(name="FMLY_NM", length=100)
	private String familyName;
	
	@Column(name="DISP_NM", length=302, updatable=false, insertable=false)
	private String displayName;
	
	@Column(name="NM_PFX", length=4)
	private String prefixName;
	
	@Column(name="NM_SFX", length=5)
	private String suffixName;
	
	@Column(name="ORG_NM", length=200)
	private String organizationName;
	
	@Column(name="ORG_TYP_CD", length=15)
	private String organizationTypeCode;
		
	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="BIRTH_DT")
	private Date birthDate;
	
	@Column(name="BIRTH_PLACE", length=100)
	private String birthPlace;
	
	@Column(name="GNDR_CD", length=15)
	private String gender;
	
	@Column(name="EMAIL_ADDR", length=200)
	private String emailAddress;
	
	@Column(name="PHONE_NUM", length=15)
	private String phoneNumber;
	
	@Column(name="PHONE_NUM_2", length=15)
	private String phoneNumber2;
	
	@Column(name="FAX_NUM", length=15)
	private String faxNumber;
	
	@Column(name="ADDR_LINE_1", length=200)
	private String address1;
	
	@Column(name="ADDR_LINE2", length=200)
	private String address2;
	
	@Column(name="CITY", length=100)
	private String city;
	
	@Column(name="STATE_PROV_CD", length=50)
	private String state;
	
	@Column(name="POSTAL_CD", length=30)
	private String postal;
	
	@Column(name="CNTRY_CD", length=15)
	private String country;
	
	@Column(name="WEBSITE_URL", length=200)
	private String websiteURL;	
	
	@Column(name="PTY_ORDR")
	private Long partyOrder;
	
	@Column(name="FOX_CNTCT_FLG")
	private String foxContactFlag;
	
	@Column(name="ACTV_FLG")
	private String activeFlag;
	
	@Transient
	private boolean active;
	
	@Column(name="JOB_TITLE", length=100)
	private String jobTitle;
	
	@Column(name="DEPT_NM", length=100)
	private String department;		
	
	@Transient
	private EntityComment comment;

	public Long getPartyId() {
		return partyId;
	}

	public void setPartyId(Long partyId) {
		this.partyId = partyId;
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
	
	public String getPartyTypeCode() {
		return partyTypeCode;
	}

	public void setPartyTypeCode(String partyTypeCode) {
		this.partyTypeCode = partyTypeCode;
	}

	public String getGivenName() {
		return givenName;
	}

	public void setGivenName(String givenName) {
		this.givenName = givenName;
	}

	public String getMiddleName() {
		return middleName;
	}

	public void setMiddleName(String middleName) {
		this.middleName = middleName;
	}	

	public String getFamilyName() {
		return familyName;
	}

	public void setFamilyName(String familyName) {
		this.familyName = familyName;
	}	

	public String getDisplayName() {
		if (getFamilyName() != null) {
			return (getGivenName() != null ? getGivenName() + " " : "") + (getMiddleName() != null && !getMiddleName().equalsIgnoreCase("") ? getMiddleName() + " " : "" ) + getFamilyName();
		} else {
			return getOrganizationName();
		}
	}

	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}

	public String getPrefixName() {
		return prefixName;
	}

	public void setPrefixName(String prefixName) {
		this.prefixName = prefixName;
	}

	public String getSuffixName() {
		return suffixName;
	}

	public void setSuffixName(String suffixName) {
		this.suffixName = suffixName;
	}

	public String getOrganizationName() {
		return organizationName;
	}

	public void setOrganizationName(String organizationName) {
		this.organizationName = organizationName;
	}	

	public String getOrganizationTypeCode() {
		return organizationTypeCode;
	}

	public void setOrganizationTypeCode(String organizationTypeCode) {
		this.organizationTypeCode = organizationTypeCode;
	}

	public Date getBirthDate() {
		return birthDate;
	}

	public void setBirthDate(Date birthDate) {
		this.birthDate = birthDate;
	}

	public String getBirthPlace() {
		return birthPlace;
	}

	public void setBirthPlace(String birthPlace) {
		this.birthPlace = birthPlace;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getEmailAddress() {
		return emailAddress;
	}

	public void setEmailAddress(String emailAddress) {
		this.emailAddress = emailAddress;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getPhoneNumber2() {
		return phoneNumber2;
	}

	public void setPhoneNumber2(String phoneNumber2) {
		this.phoneNumber2 = phoneNumber2;
	}

	public Long getPartyOrder() {
		return partyOrder;
	}

	public void setPartyOrder(Long partyOrder) {
		this.partyOrder = partyOrder;
	}	
	
	public String getFaxNumber() {
		return faxNumber;
	}

	public void setFaxNumber(String faxNumber) {
		this.faxNumber = faxNumber;
	}

	public String getAddress1() {
		return address1;
	}

	public void setAddress1(String address1) {
		this.address1 = address1;
	}

	public String getAddress2() {
		return address2;
	}

	public void setAddress2(String address2) {
		this.address2 = address2;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getPostal() {
		return postal;
	}

	public void setPostal(String postal) {
		this.postal = postal;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getWebsiteURL() {
		return websiteURL;
	}

	public void setWebsiteURL(String websiteURL) {
		this.websiteURL = websiteURL;
	}

	public String getFoxContactFlag() {
		return foxContactFlag;
	}

	public void setFoxContactFlag(String foxContactFlag) {
		this.foxContactFlag = foxContactFlag;
	}
	
	public String getActiveFlag() {
		return activeFlag;
	}

	public void setActiveFlag(String activeFlag) {
		this.activeFlag = activeFlag;
	}	
	
	public boolean isActive() {
		return activeFlag != null && activeFlag.equalsIgnoreCase("Y");
	}

	public void setActive(boolean active) {
		this.activeFlag = active ? "Y" : "N";
	}

	public String getJobTitle() {
		return jobTitle;
	}

	public void setJobTitle(String jobTitle) {
		this.jobTitle = jobTitle;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public EntityComment getComment() {
		return comment;
	}

	public void setComment(EntityComment comment) {
		this.comment = comment;
	}

	@Override
	public int compareTo(ErmParty o) {
		return this.displayName.compareTo(o.displayName);
	}
}
