package com.fox.it.erm;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fox.it.erm.service.impl.ClearanceMemoInciatorLglConfStatusProvider;

@MappedSuperclass
public class ErmProductVersionBase {
	
	@Id
	@Column(name="FOX_VERSION_ID")
	private Long foxVersionId;
	
	@Column(name="TITLE_NM", length=100)
	private String titleName;
	
	@Column(name="PROD_TYP_ID")
	private Long productTypeId;
	
	@Column(name="PROD_VER_STS_ID")
	private Long productVersionStatusId;
	
	@Column(name="SCRIPTED_FLG")
	private String scriptedFlag;
	
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

	@JsonIgnore
	@Column(name="HDR_LGL_CVRG_BITMAP")
	private byte[] headerLegalBitmap;
	
	@JsonIgnore
	@Column(name="HDR_BSNS_CVRG_BITMAP")
	private byte[] headerBusinessBitmap;
	
//	@Column(name="HDR_BSNS_BITMAP")
//	private String businessBitmap;
	
	@Column(name="LGL_INHERITS_FRM_VER_ID")
	private Long legalInheritsFromVersionId;
	
	@Column(name="BSNS_INHERITS_FRM_VER_ID")
	private Long businessInheritsFromVersionId;
	
	@Column(name="BASED_ON_TMPLT_ID")
	private Long basedOnTemplateId;
	
	@Column(name="CLRNC_MEMO_IND")
	private Boolean hasClearanceMemo;
		
	@Column(name="LGL_CONF_STS_ID", nullable=true)	
	private Long legalConfirmationStatusId;
	
	@Column(name="BSNS_CONF_STS_ID", nullable=true)
	private Long businessConfirmationStatusId;
	
	
	@Column(name="FOX_PRODUCED_IND", nullable=true)
	private Integer foxProducedInd;
	
	@Column(name="FTR_MEDIA_IND", nullable=true)	
	private Integer futureMediaInd;
	
 
	@Temporal(value=TemporalType.TIMESTAMP)
	@Column(name="LST_RGHTS_INFO_UPD_DT")
	private Date lastRightsInfoUpdateDate;
	

	
	@Transient	
	private Long doNotLicenseID;
	
	@Transient	
	private ClearanceMemo clearanceMemo;	

	public Long getFoxVersionId() {
		return foxVersionId;
	}

	public void setFoxVersionId(Long foxVersionId) {
		this.foxVersionId = foxVersionId;
	}

	public String getTitleName() {
		return titleName;
	}

	public void setTitleName(String titleName) {
		this.titleName = titleName;
	}

	public Long getProductTypeId() {
		return productTypeId;
	}

	public void setProductTypeId(Long productTypeId) {
		this.productTypeId = productTypeId;
	}

	public Long getProductVersionStatusId() {
		return productVersionStatusId;
	}

	public void setProductVersionStatusId(Long productVersionStatusId) {
		this.productVersionStatusId = productVersionStatusId;
	}
	
	public String getScriptedFlag() {
		return scriptedFlag;
	}
	
	public boolean isScripted() {
		return getScriptedFlag() != null && getScriptedFlag().equals("Y");		
	}

	public void setScriptedFlag(Boolean scriptedFlag) {
		this.scriptedFlag = Boolean.TRUE.equals(scriptedFlag) ? "Y" : "N";
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

	public byte[] getHeaderLegalBitmap() {
		return headerLegalBitmap;
	}

	public void setHeaderLegalBitmap(byte[] headerLegalBitmap) {
		this.headerLegalBitmap = headerLegalBitmap;
	}

	public byte[] getHeaderBusinessBitmap() {
		return headerBusinessBitmap;
	}

	public void setHeaderBusinessBitmap(byte[] headerBusinessBitmap) {
		this.headerBusinessBitmap = headerBusinessBitmap;
	}

	public Long getLegalInheritsFromVersionId() {
		return legalInheritsFromVersionId;
	}

	public void setLegalInheritsFromVersionId(Long legalInheritsFromVersionId) {
		this.legalInheritsFromVersionId = legalInheritsFromVersionId;
	}

	public Long getBusinessInheritsFromVersionId() {
		return businessInheritsFromVersionId;
	}

	public void setBusinessInheritsFromVersionId(Long businessInheritsFromVersionId) {
		this.businessInheritsFromVersionId = businessInheritsFromVersionId;
	}

	public Long getBasedOnTemplateId() {
		return basedOnTemplateId;
	}

	public void setBasedOnTemplateId(Long basedOnTemplateId) {
		this.basedOnTemplateId = basedOnTemplateId;
	}
	
	private boolean isEmpty(byte[] bitmap) {
		if (bitmap==null) return true;
		for (byte b: bitmap) {
			if (b!=0) {
				return false;
			}
		}
		return true;
	}
	
	public boolean isBusinessHeaderEmpty() {
		return isEmpty(headerBusinessBitmap);
	}
	
	public boolean isLegalHeaderEmpty() {
		return isEmpty(headerLegalBitmap);
	}
	
	public boolean hasAnyBitmapValue() {
		return !isBusinessHeaderEmpty()||isLegalHeaderEmpty();
	}		
	
	public boolean hasClearanceMemo() {
		return Boolean.TRUE.equals(hasClearanceMemo);
	}
	
	public void setHasClearanceMemo(boolean hasClearanceMemo) {
		this.hasClearanceMemo = hasClearanceMemo;
	}		
	
	public ClearanceMemo getClearanceMemo() {
		return clearanceMemo;
	}

	public void setClearanceMemo(ClearanceMemo clearanceMemo) {
		this.clearanceMemo = clearanceMemo;
	}

	public String getRightsIconType() {
		String s = "";
		if (hasClearanceMemo()) {
			Long legalConfirmationStatus = getLegalConfirmationStatusId();
			ClearanceMemoInciatorLglConfStatusProvider indictorProvider = new ClearanceMemoInciatorLglConfStatusProvider();
			if (indictorProvider.shouldHaveCM(legalConfirmationStatus)) {
				s+="CM+";				
			}
//			if ((getLegalConfirmationStatusId() == LegalConfirmationStatusTypes.DRAFT.getId() || getLegalConfirmationStatusId() == LegalConfirmationStatusTypes.PROCESSING.getId())) { 
//			  s+="CMDP+";		
//			} else  {
//			  s+="CM+";
//			}
		}
		if (!isBusinessHeaderEmpty()) 
			s+="B";		
		if (!isLegalHeaderEmpty()) 
			s+="L";
		if (s.length() == 0)
		  s = "N";
		return s;
	}
	
	private RightsIndicator getRightsIndicatorAsEnum() {
		boolean hasBitmapValue = !isBusinessHeaderEmpty();
		boolean isInherited = businessInheritsFromVersionId!=null;
		if (hasBitmapValue&&!isInherited) {
			return RightsIndicator.Recorded;
		}
		if (hasBitmapValue&&isInherited) {
			return RightsIndicator.Inherited;
		}
		return RightsIndicator.NoRights;
	}
	
	/**
	 * Returns an indicator for whether a product version has recorded rights, inherited rights or not entered;
	 * Possible values are:
	 * 	R: Rights recorded
	 *  I: Inherited
	 *  N: Not entered
	 * @return
	 */
	public String getRightsIndicator() {

		return getRightsIndicatorAsEnum().getIndicator();
	}

	public Long getDoNotLicenseID() {
		return doNotLicenseID;
	}

	public void setDoNotLicenseID(Long doNotLicenseID) {
		this.doNotLicenseID = doNotLicenseID;
	}

	public Long getLegalConfirmationStatusId() {
		return legalConfirmationStatusId;
	}

	public void setLegalConfirmationStatusId(Long legalConfirmationStatusId) {
		this.legalConfirmationStatusId = legalConfirmationStatusId;
	}

	public Integer getFoxProducedInd() {
		return foxProducedInd;
	}
	
	

	
	
	public Integer getFutureMediaInd() {
		return futureMediaInd;
	}

	public void setFutureMediaInd(Integer futureMediaInd) {
		this.futureMediaInd = futureMediaInd;
	}

	public Long getBusinessConfirmationStatusId() {
		return businessConfirmationStatusId;
	}

	public void setBusinessConfirmationStatusId(Long businessConfirmationStatusId) {
		this.businessConfirmationStatusId = businessConfirmationStatusId;
	}

	public void setFoxProducedInd(Integer foxProducedInd) {
		this.foxProducedInd = foxProducedInd;
	}
	
	
	
	public Date getLastRightsInfoUpdateDate() {
		return lastRightsInfoUpdateDate;
	}

	public void setLastRightsInfoUpdateDate(Date lastRightsInfoUpdateDate) {
		this.lastRightsInfoUpdateDate = lastRightsInfoUpdateDate;
	}

	public void copyFrom(ErmProductVersionBase b) {
		setBasedOnTemplateId(b.getBasedOnTemplateId());
		setBusinessConfirmationStatusId(b.getBusinessConfirmationStatusId());
		setBusinessInheritsFromVersionId(b.getBusinessInheritsFromVersionId());
		setClearanceMemo(b.getClearanceMemo());
		setCreateDate(b.getCreateDate());
		setCreateName(b.getCreateName());
		setDoNotLicenseID(b.getDoNotLicenseID());
		setFoxProducedInd(b.getFoxProducedInd());
		setFoxVersionId(b.getFoxVersionId());
		setFutureMediaInd(b.getFutureMediaInd());
		setHasClearanceMemo(b.hasClearanceMemo==null?false:b.hasClearanceMemo.booleanValue());
		setHeaderBusinessBitmap(b.getHeaderBusinessBitmap());
		setLegalConfirmationStatusId(b.getLegalConfirmationStatusId());
		setLegalInheritsFromVersionId(b.getLegalInheritsFromVersionId());
		setProductTypeId(b.getProductTypeId());
		setProductVersionStatusId(b.getProductVersionStatusId());
		scriptedFlag = b.scriptedFlag;
		setTitleName(b.getTitleName());
		setUpdateDate(b.getUpdateDate());
		setUpdateName(b.getUpdateName());
		setLastRightsInfoUpdateDate(b.getLastRightsInfoUpdateDate());
	}
	
}
