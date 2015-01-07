package com.fox.it.erm;

import java.util.ArrayList;
import java.util.List;

/**
 * This class will contain the rights query result.
 * @author AndreasM
 *
 */
public class RightsQueryResult {
	private Integer queryId;
	private Boolean pass;

	//For each product that we queried. One element will exist on the list with the result for that specific product
	private List<RightsProductQueryResult> productsQueryResult;
	
	public Integer getQueryId() {
		return queryId;
	}
	public void setQueryId(Integer queryId) {
		this.queryId = queryId;
	}
	public Boolean getPass() {
		return pass;
	}
	public void setPass(Boolean pass) {
		this.pass = pass;
	}
	public List<RightsProductQueryResult> getProductsQueryResult() {
		if (productsQueryResult==null) {
			productsQueryResult = new ArrayList<>();
		}
		return productsQueryResult;
	}
	public void setProductsQueryResult(
			List<RightsProductQueryResult> productsQueryResult) {
		this.productsQueryResult = productsQueryResult;
	}
	
	
	
	
	
}
