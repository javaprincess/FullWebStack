package com.fox.it.erm;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="TMP_FOXIPEDIA_USER")
public class FoxipediaUser {

	@Id
	@Column(name="LOGIN_USER")
	private String userId; 
	
	public FoxipediaUser() {

	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}
	
	

}
