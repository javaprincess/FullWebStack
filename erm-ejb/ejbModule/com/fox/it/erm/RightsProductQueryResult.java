package com.fox.it.erm;

/**
 * Represents the result for a rights check for a single product version. 
 * A query might be submitted for a single product or for a batch of product's (product versions). 
 * In this case the result will contian a collection of RightsProductQueryResult objects. Each object containing the response for a single product
 * @author AndreasM
 *
 */
public class RightsProductQueryResult {
	private Integer foxVersionId;
	private Boolean pass;
	
	
	public Integer getFoxVersionId() {
		return foxVersionId;
	}
	public void setFoxVersionId(Integer foxVersionId) {
		this.foxVersionId = foxVersionId;
	}
	public Boolean getPass() {
		return pass;
	}
	public void setPass(Boolean pass) {
		this.pass = pass;
	}
	
	
}
