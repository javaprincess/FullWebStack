package com.fox.it.erm.util;

import java.util.List;

/**
 * Object representing the values passed from the UI to add restrictions to the product
 * @author AndreasM
 *
 */
public class ProductRestrictionCreateObject {
	private Long foxVersionId;
	private List<RestrictionObject> restrictions;
	private Long commentId;
	
	public Long getFoxVersionId() {
		return foxVersionId;
	}
	public void setFoxVersionId(Long foxVersionId) {
		this.foxVersionId = foxVersionId;
	}
	public List<RestrictionObject> getRestrictions() {
		return restrictions;
	}
	public void setRestrictions(List<RestrictionObject> restrictions) {
		this.restrictions = restrictions;
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
