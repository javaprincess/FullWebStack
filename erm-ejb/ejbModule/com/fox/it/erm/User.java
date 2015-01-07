package com.fox.it.erm;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name="EDM_SEC_USER")
public class User implements Serializable{
	private static final long serialVersionUID = 1L;
	private static final String ERM_ROLE = "ERM";

	//	private static final String BUSINESS_ROLE_NAME="ERM Business User";
	private static final String LEGAL_ROLE_NAME="ERM Legal User";
	
	@Id
	@Column(name="USER_ID")
	private Long id;
	
	@Column(name="LOGIN_ID")
	private String userId;
	
	@Column(name="FULL_NM")
	private String name;
	
	@Column(name="STATUS_CD")
	private String status;
	
	@Transient
	private List<Privilege> privileges;
	
	
	@Transient
	private Boolean isBusiness;
	@Transient
	private Boolean isLegal;

	public Long getId() {
		return id;
	}
	
	public String getUserId() {
		return userId;
	}

	public void setUserId(String id) {
		this.userId = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	
	public boolean isLegal() {
		if (isLegal==null) {
			isLegal=computeIsLegal();
		}
		return isLegal;
	}
	
	
	
	private boolean computeIsLegal() {
		return hasRole(LEGAL_ROLE_NAME);
	}

	/**
	 * By default all users are Business users unless they have the Legal Role
	 */
	public boolean isBusiness() {
		return !isLegal();
	}
	
	public List<Privilege> getPrivileges() {
		if (privileges==null) {
			privileges=new ArrayList<>();
		}
		return privileges;
	}
	
	public void setPrivileges(List<Privilege> privileges) {
		this.privileges = privileges;
	}
	
	public boolean hasRole(String roleName) {
		for (Privilege privilege:getPrivileges()) {
			if (roleName.equals(privilege.getRoleName())) {
				return true;
			}
		}
		return false;
	}
	
	public boolean hasAnyRole(String[] roles) {
		if (roles==null||roles.length==0) return false;
		for (String role: roles) {
			if (hasRole(role)) {
				return true;
			}
		}		
		return false;
	}
	
	public boolean hasERMRole() {
		return hasRole(ERM_ROLE);
	}
	
	public boolean hasFunctionPoint(String functionPoint, String privilege,String operation) {
		for (Privilege priv: getPrivileges()) {
			if (priv.isFunctionPoint(functionPoint, privilege, operation)) return true;
		}
		return false;		
	}
}
