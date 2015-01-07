package com.fox.it.erm.service.impl;

public class RightStrandObjectConverterBase {

	public RightStrandObjectConverterBase() {
	}
	
	protected boolean isValue(Long value) {
		if (value==null) return false;
		return value.longValue()>0;
	}
	
	protected boolean isValue(String s) {
		return (s!=null&&!s.trim().isEmpty());		
	}

}
