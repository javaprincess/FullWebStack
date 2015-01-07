package com.fox.it.erm;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;


import com.fox.it.erm.util.UserType;

@Entity
@Table(name="TMP_USR_SESSION")
public class UserSession {
	@Id
	@Column(name="USR_NM")
	private String userId;
	@Column(name="USR_TYP")
	private String userType;
	
//	@Transient
	@Column(name="FXP_SRC")
	private String foxipediaSearch;
	
	public UserSession() {
		
	}
	
	public UserSession(String userId, String userType) {
		setUserId(userId);
		setUserType(getUserType());
	}
	
	public UserSession(String userId,Boolean isBusiness) {
		setUserId(userId);
		setUserType(getUserType(isBusiness));
		
	}
	
	private String getUserType(Boolean isBusiness) {
		return UserType.getUserType(isBusiness);
	}
	
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getUserType() {
		return userType;
	}
	public void setUserType(String userType) {
		this.userType = userType;
	}
	
	public String getFoxipediaSearch() {
		return foxipediaSearch;
	}

	public void setFoxipediaSearch(String foxipediaSearch) {
		this.foxipediaSearch = foxipediaSearch;
	}

	public void setIsFoxipediaSearch() {
		setIsFoxipediaSearch(false);
	}
	
	public boolean isFoxipediaSearch() {
		return "Y".equals(foxipediaSearch);
	}
	
	public void setIsFoxipediaSearch(boolean isFoxipediaSearch) {
		setFoxipediaSearch(isFoxipediaSearch?"Y":"N");
	}
	
	
	
	
	
	
	public String toString() {
		return getUserId() + "-" + getUserType() + "-" + getFoxipediaSearch();
	}
	
	
	
}
