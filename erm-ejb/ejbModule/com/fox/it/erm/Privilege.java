package com.fox.it.erm;


import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fox.it.erm.security.Operation;

@Entity
public class Privilege implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private String id;
	
	@Column(name="USER_ID")
	private Long userId;

	@Column(name="ROLE_ID")
	private Long roleId;

	@Column(name="PRIV_ID")
	private Long privilegeId;
	@Column(name="ROLE_DESC")	
	private String roleName;
	@Column(name="PRIV_DESC")
	private String privilegeName;
	@Column(name="PRIV_CRT_IND")
	private String canCreateInd;
	@Column(name="PRIV_READ_IND")
	private String canReadInd;
	@Column(name="PRIV_UPD_IND")
	private String canUpdateInd;
	@Column(name="PRIV_DEL_IND")
	private String canDeleteInd;
	@Column(name="FUNC_PT_ID")
	private Long functionPointId;
	@Column(name="FUNC_PT_NM")
	private String functionPointName;
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	public Long getRoleId() {
		return roleId;
	}
	public void setRoleId(Long roleId) {
		this.roleId = roleId;
	}
	public String getRoleName() {
		return roleName;
	}
	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}
	public Long getPrivilegeId() {
		return privilegeId;
	}
	public void setPrivilegeId(Long privilegeId) {
		this.privilegeId = privilegeId;
	}
	public String getPrivilegeName() {
		return privilegeName;
	}
	public void setPrivilegeName(String privilegeName) {
		this.privilegeName = privilegeName;
	}
	
	@JsonIgnore
	public String getCanCreateInd() {
		return canCreateInd;
	}
	public void setCanCreateInd(String canCreateInd) {
		this.canCreateInd = canCreateInd;
	}
	@JsonIgnore
	public String getCanReadInd() {
		return canReadInd;
	}
	public void setCanReadInd(String canReadInd) {
		this.canReadInd = canReadInd;
	}
	@JsonIgnore
	public String getCanUpdateInd() {
		return canUpdateInd;
	}
	public void setCanUpdateInd(String canUpdateInd) {
		this.canUpdateInd = canUpdateInd;
	}
	@JsonIgnore	
	public String getCanDeleteInd() {
		return canDeleteInd;
	}
	public void setCanDeleteInd(String canDeleteInd) {
		this.canDeleteInd = canDeleteInd;
	}
	public Long getFunctionPointId() {
		return functionPointId;
	}
	public void setFunctionPointId(Long functionPointId) {
		this.functionPointId = functionPointId;
	}
	public String getFunctionPointName() {
		return functionPointName;
	}
	public void setFunctionPointName(String functionPointName) {
		this.functionPointName = functionPointName;
	}
	
	private boolean toBoolean(String ind) {
		return "Y".equalsIgnoreCase(ind);
	}
	
	public boolean isCreate() {
		return toBoolean(canCreateInd);
	}
	
	public boolean isRead() {
		return toBoolean(canReadInd);		
	}
	
	public boolean isUpdate() {
		return toBoolean(canUpdateInd);
		
	}
	
	/**
	 * Note delete is a reserved wod in JavaScript. So changed to Del. DO NOT CHANGE 
	 * @return
	 */
	public boolean isDel() {
		return toBoolean(canDeleteInd);
		
	}
	
	
	private boolean isOperation(String operation) {
		if (Operation.CREATE.toString().equals(operation) && isCreate()) return true;
		if (Operation.READ.toString().equals(operation) && isRead()) return true;
		if (Operation.UPDATE.toString().equals(operation) && isUpdate()) return true;		
		if (Operation.DELETE.toString().equals(operation) && isDel()) return true;		
		return false;
	}
	
	public boolean isFunctionPoint(String functionPoint, String privilege,String operation) {
		if (privilege.equals(getPrivilegeName()) &&
			functionPoint.equals(getFunctionPointName())) {
			return isOperation(operation);
		}
		return false;

	}

	
	

	
}
