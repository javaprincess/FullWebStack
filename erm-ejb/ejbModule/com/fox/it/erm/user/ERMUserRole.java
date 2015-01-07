package com.fox.it.erm.user;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="ERM_USER_ROLE")
public class ERMUserRole {
	@Id
	@Column(name="USER_ID")
	private Long id;
	
	@Column(name="FULL_NM")
	private String fullName;
	
	
	@Column(name="LOGIN_ID")
	private String loginId;
	
	
	@Column(name="STATUS_CD")
	private String statusCode;
	
	@Column(name="ROLE_ID")
	private Long roleId;
	
	@Column(name="ROLE_TYPE")
	private String roleType;
	
	@Column(name="ROLE_DESC")
	private String roleDescription;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getLoginId() {
		return loginId;
	}

	public void setLoginId(String loginId) {
		this.loginId = loginId;
	}

	public String getStatusCode() {
		return statusCode;
	}

	public void setStatusCode(String statusCode) {
		this.statusCode = statusCode;
	}

	public Long getRoleId() {
		return roleId;
	}

	public void setRoleId(Long roleId) {
		this.roleId = roleId;
	}

	public String getRoleType() {
		return roleType;
	}

	public void setRoleType(String roleType) {
		this.roleType = roleType;
	}

	public String getRoleDescription() {
		return roleDescription;
	}

	public void setRoleDescription(String roleDescription) {
		this.roleDescription = roleDescription;
	}
}
