package com.fox.it.erm.comments;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Lob;
import javax.persistence.Table;

/**
 * Same as Comment, except that this class loads the comments eagerly
 */
@Entity
@Table(name="CMNT")
public class EagerComment extends CommentBase{

	@Basic(fetch=FetchType.EAGER)
	@Lob
	@Column(name="CMNT_LNG_DESC")
	private String longDescription;

	public String getLongDescription() {
		return longDescription;
	}

	public void setLongDescription(String longDescription) {
		this.longDescription = longDescription;
	}

}
