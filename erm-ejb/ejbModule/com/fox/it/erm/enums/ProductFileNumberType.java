package com.fox.it.erm.enums;

public enum ProductFileNumberType {

	CFNO(1L),
	ENO(2L);
	
	private final long id;
	
	private ProductFileNumberType(long id){
		this.id = id;
	}
	
	public long getId(){
		return this.id;
	}
}
