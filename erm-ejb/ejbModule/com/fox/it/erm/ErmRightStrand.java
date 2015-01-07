package com.fox.it.erm;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;


@Entity
@Table(name="RGHT_STRND")
public class ErmRightStrand extends RightStrandBase {

	@Column(name="FOX_VERSION_ID")
	private Long foxVersionId;

	
	@Transient
	private boolean hasComments;
	
	@Transient
	private boolean isMappedToClearanceMemo;
	
	
	@Column(name="RGHT_STRND_SET_ID",updatable=false,insertable=false)
	private Long rightStrandSetId;

	@Column(name="STRND_SET_NM",updatable=false,insertable=false)
	private String strandSetName;
	
	
	public Long getRightStrandSetId() {
		return rightStrandSetId;
	}


	@Transient
	private ErmRightStrandSet strandSet;
	
	
	@Transient
	private List<ErmRightRestriction> ermProductRightRestrictions;
	
	public ErmRightStrand() {
	}
	
	public void setErmProductRightRestrictions(List<ErmRightRestriction> restrictions) {
		this.ermProductRightRestrictions = restrictions;
	}
	
	
	public List<ErmRightRestriction> getErmProductRightRestrictions() {
		return ermProductRightRestrictions;
	}

	public boolean isHasComments() {
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
	
	public ErmRightStrandSet getStrandSet() {
		return strandSet;
	}

	public void setStrandSet(ErmRightStrandSet strandSet) {
		this.strandSet = strandSet;
	}
	
	private ErmRightStrandSet getOrCreateStrandSet() {
		if (strandSet==null) {
			strandSet = new ErmRightStrandSet();
		}
		return strandSet;

	}
	
	public void setRightStrandSetId(Long rightStrandSetId) {
		this.rightStrandSetId = rightStrandSetId;
	}

	public String getStrandSetName() {
		return strandSetName;
	}

	public void setStrandSetName(String strandSetName) {
		this.strandSetName = strandSetName;
	}
	
	public void populateRightStrandSet() {
		if (rightStrandSetId!=null) {
			ErmRightStrandSet strandSet = getOrCreateStrandSet();
			strandSet.setRightStrandSetId(rightStrandSetId);
			strandSet.setStrandSetName(strandSetName);
		}
	}
	
	
	
	

}
