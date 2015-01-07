package com.fox.it.erm;

import javax.persistence.Column;
import javax.persistence.Entity;

@Entity
public class RightStrandForQuery extends RightStrandBase{
	@Column(name="MEDIA_CD")
	private String mediaCode;

	@Column(name="MEDIA_DESC")
	private String mediaName;
	
	@Column(name="TRRTRY_CD")
	private String terrioryCode;
	
	@Column(name="TRRTRY_DESC")
	private String territoryName;
	
	@Column(name="LNGG_CD")
	private String languageCode;
	
	@Column(name="LNGG_DESC")
	private String languageName;
		
	@Column(name="STRND_SET_NM")
	private String strandSetName;
	
	@Column(name="START_DT_STS_CD")
	private String startDateStatusCode;
	
	@Column(name="START_DT_STS_DESC")
	private String startDateStatusName;
	
	@Column(name="END_DT_STS_CD")
	private String endDateStatusCode;
	
	@Column(name="END_DT_STS_DESC")
	private String endDateStatusDesc;
	
	@Column(name="START_DT_CD")
	private String startDateCode;
	
	@Column(name="START_DT_CD_DESC")
	private String startDateCodeName;
	
	@Column(name="END_DT_CD")
	private String endDateCode;
	
	@Column(name="END_DT_CD_DESC")
	private String endDateCodeName;
	
	public RightStrandForQuery() {
		
	}

	public String getMediaCode() {
		return mediaCode;
	}

	public void setMediaCode(String mediaCode) {
		this.mediaCode = mediaCode;
	}

	public String getMediaName() {
		return mediaName;
	}

	public void setMediaName(String mediaName) {
		this.mediaName = mediaName;
	}

	public String getTerrioryCode() {
		return terrioryCode;
	}

	public void setTerrioryCode(String terrioryCode) {
		this.terrioryCode = terrioryCode;
	}

	public String getTerritoryName() {
		return territoryName;
	}

	public void setTerritoryName(String territoryName) {
		this.territoryName = territoryName;
	}

	public String getLanguageCode() {
		return languageCode;
	}

	public void setLanguageCode(String languageCode) {
		this.languageCode = languageCode;
	}

	public String getLanguageName() {
		return languageName;
	}

	public void setLanguageName(String languageName) {
		this.languageName = languageName;
	}

	public String getStrandSetName() {
		return strandSetName;
	}

	public void setStrandSetName(String strandSetName) {
		this.strandSetName = strandSetName;
	}

	public String getStartDateStatusCode() {
		return startDateStatusCode;
	}

	public void setStartDateStatusCode(String startDateStatusCode) {
		this.startDateStatusCode = startDateStatusCode;
	}

	public String getStartDateStatusName() {
		return startDateStatusName;
	}

	public void setStartDateStatusName(String startDateStatusName) {
		this.startDateStatusName = startDateStatusName;
	}

	public String getEndDateStatusCode() {
		return endDateStatusCode;
	}

	public void setEndDateStatusCode(String endDateStatusCode) {
		this.endDateStatusCode = endDateStatusCode;
	}

	public String getEndDateStatusDesc() {
		return endDateStatusDesc;
	}

	public void setEndDateStatusDesc(String endDateStatusDesc) {
		this.endDateStatusDesc = endDateStatusDesc;
	}

	public String getStartDateCode() {
		return startDateCode;
	}

	public void setStartDateCode(String startDateCode) {
		this.startDateCode = startDateCode;
	}

	public String getStartDateCodeName() {
		return startDateCodeName;
	}

	public void setStartDateCodeName(String startDateCodeName) {
		this.startDateCodeName = startDateCodeName;
	}

	public String getEndDateCode() {
		return endDateCode;
	}

	public void setEndDateCode(String endDateCode) {
		this.endDateCode = endDateCode;
	}

	public String getEndDateCodeName() {
		return endDateCodeName;
	}

	public void setEndDateCodeName(String endDateCodeName) {
		this.endDateCodeName = endDateCodeName;
	}
	
	

}
