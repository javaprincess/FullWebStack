package com.fox.it.erm.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.fox.it.erm.ErmException;

public class CopyToProductsResponse {

	private List<Long> successFoxVersionIds= new ArrayList<>();
	private List<Long> strandIds = new ArrayList<>();
	private Map<Long,String> failures = new HashMap<>();
	
	public CopyToProductsResponse() {
	}
	
	public void setSuccess(Long foxVersionId) {
		successFoxVersionIds.add(foxVersionId);
	}
	
	public void setFail(Long foxVersionId, String message) {
		failures.put(foxVersionId, message);
	}
	
	public void setFail(Long foxVersionId, ErmException e) {
		setFail(foxVersionId,e.getMessage());
	}
	
	public List<Long> getSuccess() {
		return successFoxVersionIds;
	}
	
	public Map<Long,String> getFailures() {
		return failures;
	}

	public List<Long> getStrandIds() {
		return strandIds;
	}

	public void setStrandIds(List<Long> strandIds) {
		if (strandIds==null) {
			strandIds = new ArrayList<>();
		}
		this.strandIds = strandIds;
	}
	
	
	
}
