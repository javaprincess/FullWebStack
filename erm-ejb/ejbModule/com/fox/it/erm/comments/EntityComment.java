package com.fox.it.erm.comments;


import java.util.HashMap;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fox.it.erm.EntityAttachment;

/**
 * Grouping of comments for an entity
 * @author AndreasM
 *
 */
@Entity
@Table(name="ENTTY_CMNT")
public class EntityComment extends EntityCommentBase implements Comparable<EntityComment>{
	

	@ManyToOne(fetch=FetchType.LAZY)
	@JoinColumn(name="CMNT_ID",insertable=false,updatable=false)
	private Comment comment;
	
	
	@Transient
	List<EntityAttachment> attachments;
	
	@Transient
	private Boolean commentExpanded = Boolean.FALSE;
	
	@Transient
	private Boolean hasMultipleEntityComments = Boolean.FALSE;
	
	@Transient
	private HashMap<Long, List<Long>> entityIdListMap = new HashMap<Long, List<Long>>();

		
	@Transient
	private Long promoMaterialId;
	

	public Comment getComment() {
		return comment;
	}

	public void setComment(Comment comment) {
		this.comment = comment;
	}



	public List<EntityAttachment> getAttachments() {
		return attachments;
	}

	public void setAttachments(List<EntityAttachment> attachments) {
		this.attachments = attachments;
	}

	public Boolean getHasMultipleEntityComments() {
		return hasMultipleEntityComments;
	}

	public void setHasMultipleEntityComments(Boolean hasMultipleEntityComments) {
		this.hasMultipleEntityComments = hasMultipleEntityComments;
	}	
	
	public Boolean getCommentExpanded() {
		return commentExpanded;
	}

	public void setCommentExpanded(Boolean commentExpanded) {
		this.commentExpanded = commentExpanded;
	}	

	public HashMap<Long, List<Long>> getEntityIdListMap() {
		return entityIdListMap;
	}

	public void setEntityIdListMap(HashMap<Long, List<Long>> entityIdListMap) {
		this.entityIdListMap = entityIdListMap;
	}

	public Long getPromoMaterialId() {
		return promoMaterialId;
	}

	public void setPromoMaterialId(Long promoMaterialId) {
		this.promoMaterialId = promoMaterialId;
	}

	public void copyFromWithoutComment(EntityComment comment) {
		setId(comment.getId());
		setCommentSequence(comment.getCommentSequence());
		setCommentId(comment.getCommentId());
		setCreateDate(comment.getCreateDate());
		setCreateName(comment.getCreateName());
		setEntityCommentTypeId(comment.getEntityCommentTypeId());
		setEntityId(comment.getEntityId());
		setEntityTypeId(comment.getEntityTypeId());
		setHasMultipleEntityComments(comment.getHasMultipleEntityComments());
		setEntityIdListMap(comment.getEntityIdListMap());
		setUpdateDate(comment.getUpdateDate());
		setUpdateName(comment.getUpdateName());
	}

	@Override
	public int compareTo(EntityComment o) {
		Long id = getId();
		if (this==o) return 0;
		if (o==null) return -1;
		if(o != null && o.getComment() != null && this.getComment() != null){
			int dateCompare = this.getComment().getUpdateDate().compareTo(o.getComment().getUpdateDate());
			if (dateCompare==0) {
				int idCompare = id.compareTo(o.getId()); 
				return 	idCompare;		
			}
			return dateCompare;
		}
		if (id==null) return -1;
		if (o.getId()==null) return 1;
		return id.compareTo(o.getId());
	}			
	
	public void copyFrom(EntityCommentOnly e) {
		setId(e.getId());
		setEntityCommentTypeId(e.getEntityCommentTypeId());
		setEntityTypeId(e.getEntityTypeId());
		setEntityId(e.getEntityId());
		setCreateDate(e.getCreateDate());
		setUpdateDate(e.getUpdateDate());
		setCreateName(e.getCreateName());
		setUpdateName(e.getUpdateName());
		setCommentId(e.getCommentId());
	}
}

