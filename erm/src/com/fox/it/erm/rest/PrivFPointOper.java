package com.fox.it.erm.rest;

public class PrivFPointOper {
	private final String privilege;
	private final String functionPoint;
	private final String operation;
	
	private PrivFPointOper(String privilege,String functionPoint, String operation) {
		this.privilege = privilege;
		this.functionPoint = functionPoint;
		this.operation = operation;
	}

	public String getPrivilege() {
		return privilege;
	}

	public String getFunctionPoint() {
		return functionPoint;
	}

	public String getOperation() {
		return operation;
	}
	
	public static final PrivFPointOper get(String privilege,String functionPoint, String operation) {
		return new PrivFPointOper(privilege, functionPoint, operation);
	}

}
