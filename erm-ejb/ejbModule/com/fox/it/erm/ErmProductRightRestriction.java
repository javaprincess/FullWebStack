package com.fox.it.erm;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;

@SuppressWarnings("serial")
@Entity
@Table(name="RGHT_RSTRCN")
public class ErmProductRightRestriction extends ErmProductRightStrandBase implements ErmUpdatable, Comparable<ErmProductRightRestriction>{

	@Id
	@SequenceGenerator(name = "RGHT_RSTRCN_SEQ", sequenceName = "RGHT_RSTRCN_SEQ",allocationSize=1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "RGHT_RSTRCN_SEQ")		
	@Column(name="RGHT_RSTRCN_ID")
	private Long rightRestrictionId;
	
	@ManyToOne
	@JoinColumn(name="RSTRCN_CD_ID", nullable=false,insertable=false,updatable=false)
	private Restriction restriction;
	
	@Column(name="RSTRCN_CD_ID")
	private Long restrictionCdId;
	
	@Transient
	private Long commentId;
	
	@Transient
	private String commentTitle;
	
	@Transient
	private String comment;
	
	@Transient
	private Long commentTimestamp;
	

	public Long getRightRestrictionId() {
		return rightRestrictionId;
	}

	public void setRightRestrictionId(Long rightRestrictionId) {
		this.rightRestrictionId = rightRestrictionId;
	}

	public Long getRestrictionCdId() {
		return restrictionCdId;
	}
	
	

	public Restriction getRestriction() {
		return restriction;
	}

	public void setRestriction(Restriction restriction) {
		this.restriction = restriction;
	}

	public void setRestrictionCdId(Long restrictionCdId) {
		this.restrictionCdId = restrictionCdId;
	}
	
	public boolean isNew() {
		return rightRestrictionId==null;
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

	
	
	public Long getCommentId() {
		return commentId;
	}

	public void setCommentId(Long commentId) {
		this.commentId = commentId;
	}

	@Override
	public int compareTo(ErmProductRightRestriction o) {		
		return restrictionCdId.compareTo(o.getRestrictionCdId());
	}
	
	public void copyFrom(ErmRightRestriction r) {
		super.copyFrom(r);
		setRightRestrictionId(r.getRightRestrictionId());
		
	}
}

