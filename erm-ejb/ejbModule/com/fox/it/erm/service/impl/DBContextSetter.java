package com.fox.it.erm.service.impl;

/**
 * Sets the current user id and user type in the database
 * @author AndreasM
 *
 */
public interface DBContextSetter {
	public void set(String userId,Boolean isBusiness);
	public void set(String userId,String userType);
	public void clear();
	
	public void set(String userId,Boolean isBusiness,boolean isConfidentialAccess);
	public void set(String userId,String userType,boolean isConfidentialAccess);
	
}
