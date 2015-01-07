package com.fox.it.erm;


import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.eclipse.persistence.annotations.BatchFetch;
import org.eclipse.persistence.annotations.BatchFetchType;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * 
 * @author YvesN
 *
 */
@Entity
@Table(name="RGHT_STRND")
public class ErmProductRightStrand extends RightStrandBase implements Serializable, Comparable<ErmProductRightStrand>{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	

	
	@JsonIgnore
	@ManyToOne(fetch=FetchType.LAZY, optional=false)	
	@JoinColumn(name="FOX_VERSION_ID", nullable=false,insertable=false,updatable=false)
//	@Transient
	private ErmProductVersion ermProductVersion;
	
	@Column(name="FOX_VERSION_ID")
	private Long foxVersionId;
	
	@ManyToOne(fetch=FetchType.EAGER)
	@JoinColumn(name="STRT_DT_CD_ID", nullable=true,insertable=false,updatable=false)
	private RefDate startDateCode;
	

	
	@ManyToOne(fetch=FetchType.EAGER)
	@JoinColumn(name="END_DT_CD_ID", nullable=true,insertable=false,updatable=false)
	private RefDate endDateCode;
	
	
	
	@OneToMany(mappedBy="ermProductRightStrand", fetch=FetchType.EAGER,cascade=CascadeType.ALL)
	@BatchFetch(value=BatchFetchType.EXISTS)
	private List<ErmProductRightRestriction> ermProductRightRestrictions;
	
	@OneToMany(mappedBy="ermProductRightStrand", fetch=FetchType.LAZY)
	@BatchFetch(value=BatchFetchType.JOIN)	
	private List<ErmProductRightGrant> ermProductRightGrants;
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="MEDIA_ID", nullable=false, insertable=false,updatable=false)
	@BatchFetch(value=BatchFetchType.JOIN)	
	private Media media;
	
		
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="LNGG_ID", nullable=false, insertable=false,updatable=false)
	@BatchFetch(value=BatchFetchType.JOIN)	
	private Language language;
	
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="TRRTRY_ID", nullable=false, insertable=false,updatable=false)
	@BatchFetch(value=BatchFetchType.JOIN)	
	private Territory territory;
	
	
	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="RGHT_STRND_SET_ID", insertable=false, updatable=false)
	@BatchFetch(value=BatchFetchType.JOIN)	
	private ErmRightStrandSet strandSet;
	
	
	@Transient
	private boolean hasComments;
	
	@Transient
	private boolean isMappedToClearanceMemo;
	

	public RefDate getStartDateCode() {
		return startDateCode;
	}

	public void setStartDateCode(RefDate startDateCodeId) {
		this.startDateCode = startDateCodeId;
	}

	public RefDate getEndDateCode() {
		return endDateCode;
	}

	public void setEndDateCode(RefDate endDateCodeId) {
		this.endDateCode = endDateCodeId;
	}




	

	public List<ErmProductRightRestriction> getErmProductRightRestrictions() {
		if (ermProductRightRestrictions==null) {
			ermProductRightRestrictions= new ArrayList<ErmProductRightRestriction>();
		}
		return ermProductRightRestrictions;
	}

	public void setErmProductRightRestrictions(
			List<ErmProductRightRestriction> ermProductRightRestrictions) {
		this.ermProductRightRestrictions = ermProductRightRestrictions;
	}

	public List<ErmProductRightGrant> getErmProductRightGrants() {
		if (ermProductRightGrants==null) {
			return new ArrayList<ErmProductRightGrant>();
		}
		return ermProductRightGrants;
	}

	public void setErmProductRightGrants(
			List<ErmProductRightGrant> ermProductRightGrants) {
		this.ermProductRightGrants = ermProductRightGrants;
	}

	public Long getFoxVersionId() {
		return foxVersionId;
	}

	public void setFoxVersionId(Long foxVersionId) {
		this.foxVersionId = foxVersionId;
	}

	public Media getMedia() {
		return media;
	}

	public void setMedia(Media media) {
		this.media = media;
	}

	public Language getLanguage() {
		return language;
	}

	public void setLanguage(Language language) {
		this.language = language;
	}

	public Territory getTerritory() {
		return territory;
	}

	public void setTerritory(Territory territory) {
		this.territory = territory;
	}


	public ErmRightStrandSet getStrandSet() {
		return strandSet;
	}

	public void setStrandSet(ErmRightStrandSet strandSet) {
		this.strandSet = strandSet;
	}
	
	
	
	
	

	@Override
	public int compareTo(ErmProductRightStrand o) {
		// TODO compare with the other fields?
		if(o != null && o.getMedia() != null && this.media != null){
			return this.media.getName().compareToIgnoreCase(o.getMedia().getName());
		}
		return 0;
	}

	
	public List<String> getRestrictionCodes() {
		List<String> codes = new ArrayList<>();
		List<ErmProductRightRestriction> restrictions = getErmProductRightRestrictions();
		Set<String> codesSet = new HashSet<>();
		for (ErmProductRightRestriction restriction: restrictions) {
			Restriction r = restriction.getRestriction();
			if(r != null && r.getCode() != null){
				String code = restriction.getRestriction().getCode(); 
				codesSet.add(code);
			}			
		}
		codes.addAll(codesSet);
		Collections.sort(codes);
		return codes;
	}

	
	@JsonIgnore
	public String getTypeDescription() {
		String type="";
		if (isBusiness()) type="B";
		if (isLegal()) {
			if (type.length()>0) type+="/";
			type+="L";
		}
		return type;
	}
	

	/**
	 * Returns the start date code. Used to facilitate the JSON processing on the front end
	 * @return
	 */
	public String getStartDateCodeCode() {
		if (getStartDateCode()==null) return null;
		return getStartDateCode().getDateCode();
	}

	/**
	 * Returns the end date code. Used to facilitate the JSON processing on the front end
	 * @return
	 */
	public String getEndDateCodeCode() {
		if (getEndDateCode()==null) return null;
		return getEndDateCode().getDateCode();
	}
	
	
	
	
	public boolean getHasComments() {
		return hasComments;
	}

	public void setHasComments(boolean hasComments) {
		this.hasComments = hasComments;
	}
	
	

	public boolean isMappedToClearanceMemo() {
		return isMappedToClearanceMemo;
	}

	public void setMappedToClearanceMemo(boolean isMappedToClearanceMemo) {
		this.isMappedToClearanceMemo = isMappedToClearanceMemo;
	}

	/**
	 * Copy the fields from s to this
	 * @param s
	 */
	public void copyFrom(RightStrandBase s) {
		setBusinessInd(s.getBusinessInd());
		setContractualEndDate(s.getContractualEndDate());
		setContractualEndDateCodeId(s.getContractualEndDateCodeId());
		setContractualEndDateExprInstncId(s.getContractualEndDateExprInstncId());
		setContractualEndDateStatusId(s.getContractualEndDateStatusId());
		setContractualStartDate(s.getContractualStartDate());
		setContractualStartDateCodeId(s.getContractualStartDateCodeId());
		setContractualStartDateExprInstncId(s.getContractualStartDateExprInstncId());
		setContractualStartDateStatusId(s.getContractualStartDateStatusId());
		setCreateDate(s.getCreateDate());
		setCreateName(s.getCreateName());
		setEndDate(s.getEndDate());
		setEndDateCodeId(s.getEndDateCodeId());
		setExcludeFlag(s.getExcludeFlag());
		setFoxVersionId(s.getFoxVersionId());
		setLanguageId(s.getLanguageId());
		setLegalInd(s.getLegalInd());
		setMediaId(s.getMediaId());
		setOverrideEndDate(s.getOverrideEndDate());
		setOverrideStartDate(s.getOverrideStartDate());
		setReleaseDate(s.getReleaseDate());
		setRestrictionSeverity(s.getRestrictionSeverity());
		setRightLegalBitmap(s.getRightLegalBitmap());
		setRightStrandId(s.getRightStrandId());
		setStartDate(s.getStartDate());
		setStartDateCodeId(s.getStartDateCodeId());
		setStrandSetId(s.getStrandSetId());
		setTerritoryId(s.getTerritoryId());
		setUpdateDate(s.getUpdateDate());
		setUpdateName(s.getUpdateName());
	}
	
	
	
}
