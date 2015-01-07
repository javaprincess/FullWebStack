package com.fox.it.erm.util;

import java.util.List;

import com.fox.it.erm.service.impl.CopyToProductsResponse;

public class CopyStrandsResponse {
	private static final String STRANDS_IDS = "strandsIds";
	private static final String MULTI_PRODUCT_RESPONSE = "multiProductResponse";
	private String type;
	private Object response;
	
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	
	public void setStrandIds() {
		setType(STRANDS_IDS);
	}
	
	public void setMuliProductResponse() {
		setType(MULTI_PRODUCT_RESPONSE);
	}
	
	public void setStrandIds(List<Long> ids) {
		this.response = ids;
		setStrandIds();
	}
	public void setMultiProductResponse(CopyToProductsResponse response) {
		this.response = response;
		setMuliProductResponse();
	}
	
	public Object getResponse() {
		return response;
	}
	public void setResponse(Object response) {
		this.response = response;
	}
	
	

}
