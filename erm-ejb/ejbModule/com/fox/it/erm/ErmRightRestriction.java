package com.fox.it.erm;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;


@Entity
@Table(name="RGHT_RSTRCN")
public class ErmRightRestriction extends ErmProductRestrictionBaseFields implements ErmUpdatable{
	
	@Id
	@SequenceGenerator(name = "RGHT_RSTRCN_SEQ", sequenceName = "RGHT_RSTRCN_SEQ",allocationSize=1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "RGHT_RSTRCN_SEQ")		
	@Column(name="RGHT_RSTRCN_ID")
	private Long rightRestrictionId;
	
	@Column(name="RGHT_STRND_ID",updatable=false,insertable=false)
	private Long rightStrandId;
	
	
	@Transient
	private boolean hasComments;
	
	@Transient
	private boolean isMappedToClearanceMemo;
	

	
	@Column(name="RSTRCN_CD_ID")
	private Long restrictionCdId;

	
	public ErmRightRestriction() {
	}
	
	public Long getRightRestrictionId() {
		return rightRestrictionId;
	}
	
	
	public boolean isNew() {
		return rightRestrictionId==null;
	}

	public Long getRestrictionCdId() {
		return restrictionCdId;
	}

	public void setRestrictionCdId(Long restrictionCdId) {
		this.restrictionCdId = restrictionCdId;
	}

	public void setRightRestrictionId(Long rightRestrictionId) {
		this.rightRestrictionId = rightRestrictionId;
	}

	public Long getRightStrandId() {
		return rightStrandId;
	}

	public void setRightStrandId(Long rightStrandId) {
		this.rightStrandId = rightStrandId;
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
	
	

	

	

}
