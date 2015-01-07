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
@Table(name="TMP_RGHT_RSTRCN")
public class RightStrandRestrictionSave extends ErmProductRestrictionBase implements TempTableSaveObject{
	private static final long serialVersionUID = 1L;

	@Id
	@SequenceGenerator(name = "RGHT_RSTRCN_SEQ", sequenceName = "RGHT_RSTRCN_SEQ",allocationSize=1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "RGHT_RSTRCN_SEQ")		
	@Column(name="RGHT_RSTRCN_ID")
	private Long rightRestrictionId;
	
	@Column(name="RGHT_STRND_ID")
	private Long rightStrandId;
	
	@Column(name="RSTRCN_CD_ID")
	private Long restrictionCdId;
	
	@Transient
	private Long originalRightRestrictionId;
	
	@Transient
	private String commentTitle;
	
	@Transient
	private String comment;
	
	@Transient
	private Long commentId;
	
	@Transient
	private Long commentTimestamp;
	
	
	
	


	
	@Column(name="DB_OPER")
	private String operation;
	
	public Long getRightRestrictionId() {
		return rightRestrictionId;
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
	
	

	public Long getRestrictionCdId() {
		return restrictionCdId;
	}

	public void setRestrictionCdId(Long restrictionCdId) {
		this.restrictionCdId = restrictionCdId;
	}

	
	
	public String getCommentTitle() {
		return commentTitle;
	}

	public void setCommentTitle(String commentTitle) {
		this.commentTitle = commentTitle;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Long getCommentTimestamp() {
		return commentTimestamp;
	}

	public void setCommentTimestamp(Long commentTimestamp) {
		this.commentTimestamp = commentTimestamp;
	}

	public void copyFrom(ErmProductRightRestriction r) {
		copyFrom((ErmProductRestrictionBase) r);
		setRightRestrictionId(r.getRightRestrictionId());
		setRightStrandId(r.getRightStrandId());
		setOriginalRightRestrictionId(r.getRightRestrictionId());
		setCommentId(r.getCommentId());
		setCommentTimestamp(r.getCommentTimestamp());
	}
	
	public void copyFrom(RightStrandRestrictionSave r) {
		copyFrom((ErmProductRestrictionBase) r);
		setRightRestrictionId(r.getRightRestrictionId());
		setRightStrandId(r.getRightStrandId());	
		setOriginalRightRestrictionId(r.getOriginalRightRestrictionId());
	}
	
	

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
	public void setDelete() {
		setOperation(DBOperation.DELETE.toString());
	}
	
	public void setSyncDate() {
		//doesn't make sence,so just throw excpetion
		throw new UnsupportedOperationException();
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
	
	
	
	public Long getOriginalRightRestrictionId() {
		return originalRightRestrictionId;
	}

	public void setOriginalRightRestrictionId(Long originalRightRestrictionId) {
		this.originalRightRestrictionId = originalRightRestrictionId;
	}

	public boolean hasDBOperation() {
		return getOperation()!=null;
	}

	@Override
	public boolean isNew() {
		return rightRestrictionId==null;
	}
	
	
	public boolean hasComment() {
		return commentId!=null;
	}

	public Long getCommentId() {
		return commentId;
	}

	public void setCommentId(Long commentId) {
		this.commentId = commentId;
	}

	
	


}
