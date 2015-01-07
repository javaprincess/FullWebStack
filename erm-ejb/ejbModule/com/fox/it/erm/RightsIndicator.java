package com.fox.it.erm;

public enum RightsIndicator {
	Recorded("R"),
	Inherited("I"),
	NoRights("N");

	
	private final String indicator;
	private RightsIndicator(String indicator) {
		this.indicator = indicator;
	}

	public String getIndicator() {
		return indicator;
	}
	
	
	
}
