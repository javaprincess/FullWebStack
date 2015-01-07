package com.fox.it.erm;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name="TMP_RGHT_STRND")
public class RightStrandSave extends RightStrandBase implements TempTableSaveObject, ErmUpdatable{
	
	@Column(name="DB_OPER")
	private String operation;

	@OneToMany(cascade=CascadeType.ALL)
	@JoinColumn(name="RGHT_STRND_ID")
	private List<RightStrandRestrictionSave> rightRestrictions;
	
	@Transient
	private Long originalRightStrandId;

	
	
	public String getOperation() {
		return operation;
	}

	@Override
	public void setOperation(String operation) {
		this.operation = operation;
	}
	
	@Override	
	public void setInsert() {
		setOperation(DBOperation.INSERT.toString());
	}
	
	@Override	
	public void setUpdate() {
		setOperation(DBOperation.UPDATE.toString());
	}
	
	@Override
	public void setSyncDate() {
		setOperation(DBOperation.SYNCDT.toString());
	}
	
	@Override	
	public void setDelete() {
		setOperation(DBOperation.DELETE.toString());
	}

	@Override
	public void setAdopt() {
		setOperation(DBOperation.ADOPT.toString());
	}
	

	@Override
	public void setOperation(DBOperation operation) {
		if (operation!=null) {
			setOperation(operation.toString());
		}
	}
	
	

	public Long getOriginalRightStrandId() {
		return originalRightStrandId;
	}

	public void setOriginalRightStrandId(Long originalRightStrandId) {
		this.originalRightStrandId = originalRightStrandId;
	}

	public List<RightStrandRestrictionSave> getRightRestrictions() {
		if (rightRestrictions==null) {
			rightRestrictions = new ArrayList<>();
		}
		return rightRestrictions;
	}

	public void setRightRestrictions(
			List<RightStrandRestrictionSave> rightRestrictions) {
		this.rightRestrictions = rightRestrictions;
	}
	
	public void add(RightStrandRestrictionSave restriction) {
		getRightRestrictions().add(restriction);
	}
	
	
	public List<RightStrandRestrictionSave> getChangedRestrictions() {
		List<RightStrandRestrictionSave> restrictions = new ArrayList<>();
		for (RightStrandRestrictionSave restriction: getRightRestrictions()) {
			if (restriction.hasDBOperation()) {
				restrictions.add(restriction);
			}
		}
		return restrictions;
	}
	
	
	

	public void addRestrictions(RightStrandSave s) {
		List<RightStrandRestrictionSave> restrictions = new ArrayList<>();
		for (RightStrandRestrictionSave r: s.getRightRestrictions()) {
			RightStrandRestrictionSave rs = new RightStrandRestrictionSave();
			rs.copyFrom(r);
			restrictions.add(rs);
		}
		if (restrictions.size()>0) {
			getRightRestrictions().addAll(restrictions);
		}
	}
	
	public void clearRestrictions() {
		setRightRestrictions(null);
	}
	
	@Override
	public void copyFrom(RightStrandBase s) {
		super.copyFrom(s);
		setOriginalRightStrandId(s.getRightStrandId());
	}
	
	
}
