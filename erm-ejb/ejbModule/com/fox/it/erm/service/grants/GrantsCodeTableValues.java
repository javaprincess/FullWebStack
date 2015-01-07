package com.fox.it.erm.service.grants;

import java.util.List;

import com.fox.it.erm.grants.GrantCategory;
import com.fox.it.erm.grants.GrantCode;
import com.fox.it.erm.grants.GrantStatus;
import com.fox.it.erm.grants.GrantType;
import com.fox.it.erm.grants.SalesAndMarketingCategory;

public class GrantsCodeTableValues {
	private List<GrantCode> grantCodes;
	private List<GrantStatus> grantStatus;
	private List<GrantType> grantTypes;
	private List<GrantCategory> grantCategories;
	private List<SalesAndMarketingCategory> salesAndMarketingCategories;
	
	public GrantsCodeTableValues() {

	}

	public List<GrantCode> getGrantCodes() {
		return grantCodes;
	}

	public void setGrantCodes(List<GrantCode> grantCodes) {
		this.grantCodes = grantCodes;
	}

	public List<GrantStatus> getGrantStatus() {
		return grantStatus;
	}
	

	public void setGrantStatus(List<GrantStatus> grantStatus) {
		this.grantStatus = grantStatus;
	}

	public List<GrantType> getGrantTypes() {
		return grantTypes;
	}

	public void setGrantTypes(List<GrantType> grantTypes) {
		this.grantTypes = grantTypes;
	}

	public List<GrantCategory> getGrantCategories() {
		return grantCategories;
	}

	public void setGrantCategories(List<GrantCategory> grantCategories) {
		this.grantCategories = grantCategories;
	}

	public List<SalesAndMarketingCategory> getSalesAndMarketingCategories() {
		return salesAndMarketingCategories;
	}

	public void setSalesAndMarketingCategories(
			List<SalesAndMarketingCategory> salesAndMarketingCategories) {
		this.salesAndMarketingCategories = salesAndMarketingCategories;
	}
	
	
	
	
	
	

}
