package com.fox.it.erm.query;


import java.util.List;

/**
 * 
 * @author tracyade
 * Wrapper class for the QueryParameters and the SavedQuery objects that come out of
 * one big json object
 * Used in json to/from object conversion
 */
public class QueryParametersWrapper {
	private List<QueryParameters> queryParametersList;
	
	private SavedQuery savedQuery;
	
	private List<ProductParameters> productParametersList;
	
	private String date;

	public List<QueryParameters> getQueryParametersList() {
		return queryParametersList;
	}

	public void setQueryParametersList(List<QueryParameters> queryParametersList) {
		this.queryParametersList = queryParametersList;
	}

	public SavedQuery getSavedQuery() {
		return savedQuery;
	}

	public void setSavedQuery(SavedQuery savedQuery) {
		this.savedQuery = savedQuery;
	}


	//public ParameterInfo getParameterInfo() {
	//	return parameterInfo;
	//}

	//public void setParameterInfo(ParameterInfo parameterInfo) {
	//	this.parameterInfo = parameterInfo;
	//}

	public List<ProductParameters> getProductParametersList() {
		return productParametersList;
	}

	public void setProductParametersList(
			List<ProductParameters> productParametersList) {
		this.productParametersList = productParametersList;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}
	

}
