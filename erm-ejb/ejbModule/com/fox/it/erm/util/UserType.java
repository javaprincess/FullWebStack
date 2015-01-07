package com.fox.it.erm.util;

public class UserType {
	public static final String BUSINESS = "B";
	public static final String LEGAL = "L";
	
	public static final String getUserType(Boolean isBusiness) {
		if (isBusiness==null||isBusiness.booleanValue()) return BUSINESS;
		return LEGAL;
	}

}
