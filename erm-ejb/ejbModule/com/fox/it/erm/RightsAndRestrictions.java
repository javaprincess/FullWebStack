package com.fox.it.erm;

import java.util.Collections;
import java.util.List;

public class RightsAndRestrictions {

	private List<ErmProductGrant> productGrants;
	private List<ErmProductMediaRestriction> productMediaRestrictions;
	private List<ErmProductLanguageRestriction> productLanguageRestrictions;
	private List<ErmProductRestriction> productRestrictions;
	private List<ErmProductRightGrant> productRightGrants;
	private List<ErmProductRightRestriction> ermProductRightRestrictions;
	private List<ErmProductTerritoryRestriction> ermProductTerritoryRestrictions;
	
	
	public List<ErmProductGrant> getProductGrants() {
		return productGrants;
	}
	public void setProductGrants(List<ErmProductGrant> productGrants) {
		this.productGrants = productGrants;
	}
	public List<ErmProductMediaRestriction> getProductMediaRestrictions() {
		return productMediaRestrictions;
	}
	public void setProductMediaRestrictions(
			List<ErmProductMediaRestriction> productMediaRestrictions) {
		this.productMediaRestrictions = productMediaRestrictions;
	}
	public List<ErmProductLanguageRestriction> getProductLanguageRestrictions() {
		return productLanguageRestrictions;
	}
	public void setProductLanguageRestrictions(
			List<ErmProductLanguageRestriction> productLanguageRestrictions) {
		this.productLanguageRestrictions = productLanguageRestrictions;
	}
	public List<ErmProductRestriction> getProductRestrictions() {
		return productRestrictions;
	}
	public void setProductRestrictions(
			List<ErmProductRestriction> productRestrictions) {
		this.productRestrictions = productRestrictions;
	}
	public List<ErmProductRightGrant> getProductRightGrants() {
		return productRightGrants;
	}
	public void setProductRightGrants(List<ErmProductRightGrant> productRightGrants) {
		this.productRightGrants = productRightGrants;
	}
	public List<ErmProductRightRestriction> getErmProductRightRestrictions() {
		Collections.sort(ermProductRightRestrictions);
		return ermProductRightRestrictions;
	}
	public void setErmProductRightRestrictions(
			List<ErmProductRightRestriction> ermProductRightRestrictions) {
		this.ermProductRightRestrictions = ermProductRightRestrictions;
	}
	public List<ErmProductTerritoryRestriction> getErmProductTerritoryRestrictions() {
		return ermProductTerritoryRestrictions;
	}
	public void setErmProductTerritoryRestrictions(
			List<ErmProductTerritoryRestriction> ermProductTerritoryRestrictions) {
		this.ermProductTerritoryRestrictions = ermProductTerritoryRestrictions;
	}
	
	
}
