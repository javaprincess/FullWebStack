package com.fox.it.erm;

import java.util.HashMap;
import java.util.Map;

public class ClearanceMemoOutput {
	private ClearanceMemo clearanceMemoTOC;
	private HashMap<Long, String> clearanceMemoData;
	public ClearanceMemo getClearanceMemoTOC() {
		return clearanceMemoTOC;
	}
	public void setClearanceMemoTOC(ClearanceMemo clearanceMemoTOC) {
		this.clearanceMemoTOC = clearanceMemoTOC;
	}
	public HashMap<Long, String> getClearanceMemoData() {
		return clearanceMemoData;
	}
	public void setClearanceMemoData(HashMap<Long, String> clearanceMemoData) {
		this.clearanceMemoData = clearanceMemoData;
	}	
	
	public String toString() {
	  StringBuilder sb = new StringBuilder();	  
	  if (getClearanceMemoData() != null) {
	    for (Map.Entry<Long, String> entry : getClearanceMemoData().entrySet()) {		
		  sb.append(entry.getKey() + " = " + entry.getValue() + "\n");
	    }      	      	    
	  }
	  return sb.toString();
	}
}
