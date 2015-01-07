package com.fox.it.erm;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Represents a product type:
 * Film,
 * Series,
 * etc
 * @author AndreasM
 *
 */
@Entity
@Table(name="EDM_REF_PRODUCT_TYPE_VW")
public class ProductType {
	@Id
	@Column(name="PROD_TYP_CD")
	private String code;
	@Column(name="PROD_TYP_DESC")
	private String name;
	
	public static final String SERIES="SRIES";
	public static final String SEASON="SEASN";
	public static final String EPISODE="EPSD";
	
	public ProductType() {
		
	}
	
	public ProductType(String code, String name) {
		this.code = code;
		this.name = name;
	}
	
	
	public String getCode() {
		return code;
	}
	public void setId(String code) {
		this.code = code;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	
	

}
