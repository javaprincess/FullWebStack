package com.fox.it.erm.security;

public enum Privilege {
	LEGAL_DATA("ERM Legal Data"),
	BUSINESS_DATA("ERM Business Data"),
	SUBRIGHTS_DATA("ERM Subrights Data");
	
	private final String name;
	
	private Privilege(String name) {
		this.name=name;
	}

	public String getName() {
		return name;
	}
	
	

}
