package com.fox.it.erm.security;

public enum Role {
	LEGAL_ADMIN("ERM Legal Admin"),
	BUSINESS_ADMIN("ERM Business Admin");
	
	private final String name;
	
	private Role(String name) {
		this.name=name;
	}
	
	public String getName() {
		return name;
	}
	
}
