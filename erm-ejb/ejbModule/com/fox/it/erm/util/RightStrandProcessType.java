package com.fox.it.erm.util;

public enum RightStrandProcessType {
	CREATE_RIGHT_STRAND(new Long(1)),
	UPDATE_RIGHT_STRAND(new Long(2)),
	ADOPT_RIGHT_STRAND(new Long(3)),
	UNADOPT_RIGHT_STRAND(new Long(4)),
	ADOPT_RESTRICTION(new Long(5)),
	UNADOPT_RESTRICTON(new Long(6));
	
	private Long typeId;
	
	private RightStrandProcessType(Long typeId){
		this.typeId = typeId;
	}
	
	public Long getTypeId(){
		return this.typeId;
	}
}
