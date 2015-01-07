package com.fox.it.erm.comments;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Lob;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fox.it.erm.ErmUpdatable;


/**
 * Represent a comment to an entity. 
 * This class loads the long description lazily
 * @author AndreasM
 *
 */
@Entity
@Table(name="CMNT")
public class Comment extends CommentBase implements ErmUpdatable, Cloneable{

	@Basic(fetch=FetchType.LAZY)
	@Lob
	@Column(name="CMNT_LNG_DESC")
	private String longDescription;
	
	@Transient
	private Long categoryId;
	
	@Transient
	private Long entityCommentId;
	

	public String getLongDescription() {
		  return longDescription;
	}

	public void setLongDescription(String longDescription) {
		this.longDescription = longDescription;
	}
	
	
	
	public Long getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(Long categoryId) {
		this.categoryId = categoryId;
	}
	
	


	public Long getEntityCommentId() {
		return entityCommentId;
	}

	public void setEntityCommentId(Long entityCommentId) {
		this.entityCommentId = entityCommentId;
	}
		
	// Added JsonIgnore for isPublic to enable saving comments that pass comment objects
	@JsonIgnore
	public boolean isPublic() {
		return getPublicInd()==null||getPublicInd().intValue()==1;
	}

	@Override
	public Object clone() throws CloneNotSupportedException {
	  return super.clone();
	}		
	
}
