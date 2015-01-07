package com.fox.it.erm.copyright;

import java.sql.Date;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;


@Entity
@Table(name="EDM_GLOBAL_TITLE_COPYRIGHT_VW")
public class ERMCopyright {
	@Id
	@Column(name="FOX_VERSION_ID")
	private Long foxVersionId;
	
	@Column(name="CREATE_DATE")
	private Date createDate;
	
	@Column(name="FOX_ID")
	private Long foxId;
	
	@Column(name="LAST_UPDATE_DATE")
	private Date lastUpdate;
	
	@Column(name="CPY_RT_ID")
	private String copyrightId;
	
	@Column(name="WPR_ID")
	private String wprId;
	
	@Column(name="CNTRY_CD")
	private String countryCode;
	
	@Column(name="CNTRY_DESC")
	private String countryDescription;
	
	@Column(name="CPY_RT_ELMT_TYP_CD")
	private String copyrightElementTypeCode;
	
	@Column(name="CPY_RT_ELMT_TYP_DESC")
	private String copyrightElementTypeDescription;
	
	@Column(name="LNG_CD")
	private String languageCode;
	
	@Column(name="LNG_DESC")
	private String languageDescription;
	
	@Column(name="CPY_RT_REG_DT")
	private Date copyrigthRegistrationDate;
	
	@Column(name="CPY_RT_REG_NUM")
	private String copyrightRegistrationNumber;
	
	@Column(name="CPY_RT_NTCE")
	private String copyrightNotice;
	
	@Column(name="CPY_RT_ARTWK")
	private String copyrightArtwork;
	
	@Column(name="CPY_RT_MP")
	private String copyrightMap;
	
	@Column(name="CPY_RT_PHOTO")
	private String copyrightPhoto;
	
	@Column(name="CPY_RT_PRESSKIT")
	private String copyrightPresskit;
	
	@Column(name="CPY_RT_TRAILER")
	private String copyrightTrailer;
	
	@Column(name="CPY_RT_EXP_DT")
	private Date copyrightExpirationDate;
	
	@Column(name="PUB_DT")
	private Date publicationDate;

	public Long getFoxVersionId() {
		return foxVersionId;
	}

	public void setFoxVersionId(Long foxVersionId) {
		this.foxVersionId = foxVersionId;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public Long getFoxId() {
		return foxId;
	}

	public void setFoxId(Long foxId) {
		this.foxId = foxId;
	}

	public Date getLastUpdate() {
		return lastUpdate;
	}

	public void setLastUpdate(Date lastUpdate) {
		this.lastUpdate = lastUpdate;
	}

	public String getCopyrightId() {
		return copyrightId;
	}

	public void setCopyrightId(String copyrightId) {
		this.copyrightId = copyrightId;
	}

	public String getWprId() {
		return wprId;
	}

	public void setWprId(String wprId) {
		this.wprId = wprId;
	}

	public String getCountryCode() {
		return countryCode;
	}

	public void setCountryCode(String countryCode) {
		this.countryCode = countryCode;
	}

	public String getCountryDescription() {
		return countryDescription;
	}

	public void setCountryDescription(String countryDescription) {
		this.countryDescription = countryDescription;
	}

	public String getCopyrightElementTypeCode() {
		return copyrightElementTypeCode;
	}

	public void setCopyrightElementTypeCode(String copyrightElementTypeCode) {
		this.copyrightElementTypeCode = copyrightElementTypeCode;
	}

	public String getCopyrightElementTypeDescription() {
		return copyrightElementTypeDescription;
	}

	public void setCopyrightElementTypeDescription(
			String copyrightElementTypeDescription) {
		this.copyrightElementTypeDescription = copyrightElementTypeDescription;
	}

	public String getLanguageCode() {
		return languageCode;
	}

	public void setLanguageCode(String languageCode) {
		this.languageCode = languageCode;
	}

	public String getLanguageDescription() {
		return languageDescription;
	}

	public void setLanguageDescription(String languageDescription) {
		this.languageDescription = languageDescription;
	}

	public Date getCopyrigthRegistrationDate() {
		return copyrigthRegistrationDate;
	}

	public void setCopyrigthRegistrationDate(Date copyrigthRegistrationDate) {
		this.copyrigthRegistrationDate = copyrigthRegistrationDate;
	}

	public String getCopyrightRegistrationNumber() {
		return copyrightRegistrationNumber;
	}

	public void setCopyrightRegistrationNumber(String copyrightRegistrationNumber) {
		this.copyrightRegistrationNumber = copyrightRegistrationNumber;
	}

	public String getCopyrightNotice() {
		return copyrightNotice;
	}

	public void setCopyrightNotice(String copyrightNotice) {
		this.copyrightNotice = copyrightNotice;
	}

	public String getCopyrightArtwork() {
		return copyrightArtwork;
	}

	public void setCopyrightArtwork(String copyrightArtwork) {
		this.copyrightArtwork = copyrightArtwork;
	}

	public String getCopyrightMap() {
		return copyrightMap;
	}

	public void setCopyrightMap(String copyrightMap) {
		this.copyrightMap = copyrightMap;
	}

	public String getCopyrightPhoto() {
		return copyrightPhoto;
	}

	public void setCopyrightPhoto(String copyrightPhoto) {
		this.copyrightPhoto = copyrightPhoto;
	}

	public String getCopyrightPresskit() {
		return copyrightPresskit;
	}

	public void setCopyrightPresskit(String copyrightPresskit) {
		this.copyrightPresskit = copyrightPresskit;
	}

	public String getCopyrightTrailer() {
		return copyrightTrailer;
	}

	public void setCopyrightTrailer(String copyrightTrailer) {
		this.copyrightTrailer = copyrightTrailer;
	}

	public Date getCopyrightExpirationDate() {
		return copyrightExpirationDate;
	}

	public void setCopyrightExpirationDate(Date copyrightExpirationDate) {
		this.copyrightExpirationDate = copyrightExpirationDate;
	}

	public Date getPublicationDate() {
		return publicationDate;
	}

	public void setPublicationDate(Date publicationDate) {
		this.publicationDate = publicationDate;
	}
	

}
