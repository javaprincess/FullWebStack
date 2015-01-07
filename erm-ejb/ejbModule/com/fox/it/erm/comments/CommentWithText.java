package com.fox.it.erm.comments;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Lob;
import javax.persistence.Table;

@Entity
@Table(name="CMNT")
public class CommentWithText extends CommentBase {

	@Lob
	@Column(name="CMNT_LNG_DESC")
	private String longDescription;
	
	
	public CommentWithText() {

	}

	@Override
	public String getLongDescription() {
		return longDescription;
	}

	@Override
	public void setLongDescription(String longDescription) {
		this.longDescription = longDescription;
	}

}
