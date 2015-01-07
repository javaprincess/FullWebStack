package com.fox.it.erm;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.eclipse.persistence.annotations.BatchFetch;
import org.eclipse.persistence.annotations.BatchFetchType;

@Entity
@Table(name="EDM_GLOBAL_TITLE_VERSION_VW")
public class ProductVersion extends ProductVersionBase implements Comparable<ProductVersion> {
		
	@OneToMany(fetch=FetchType.EAGER)
	@JoinColumn(name="FOX_VERSION_ID")
	@BatchFetch(value=BatchFetchType.JOIN)	
	private List<ProductFileNumber> productFileNumbers;
		
	@OneToOne(cascade=CascadeType.ALL, fetch=FetchType.EAGER)
	@JoinColumn(name="FOX_ID", insertable=false, updatable=false)
	@BatchFetch(value=BatchFetchType.JOIN)
	private Product product;
	
	@OneToOne(cascade=CascadeType.ALL, fetch=FetchType.EAGER)	
	@JoinColumn(name="FOX_VERSION_ID", insertable=false, updatable=false)
	private ErmProductVersion ermProductVersionHeader;
	
	



	public List<ProductFileNumber> getProductFileNumbers() {
		return productFileNumbers;
	}

	public void setProductFileNumbers(List<ProductFileNumber> productFileNumbers) {
		this.productFileNumbers = productFileNumbers;
	}



	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}
	
	public ErmProductVersion getErmProductVersionHeader() {
		return ermProductVersionHeader;
	}

	public void setErmProductVersionHeader(ErmProductVersion ermProductVersionHeader) {
		this.ermProductVersionHeader = ermProductVersionHeader;
	}
	
	
	public void copyFromBase(ProductVersionBase b) {
		setActRunTime(b.getActRunTime());
		setFinancialProductId(b.getFinancialProductId());
		setFoxId(b.getFoxId());
		setFoxVersionId(b.getFoxVersionId());
		setHasLegalApprovedAllRights(b.getHasLegalApprovedAllRights());
		setIsDefaultVersion(b.getIsDefaultVersion());
		setProduct(b.getProduct());
		setProductTypeCode(b.getProductTypeCode());
		setProgRunTime(b.getProgRunTime());
		setRightsIndicator(b.getRightsIndicator());
		setShowFactor(b.getShowFactor());
		setTitle(b.getTitle());
		setVersionTitle(b.getVersionTitle());
		setVersionTypeCode(b.getVersionTypeCode());
		setVersionTypeCode(b.getVersionTypeDescription());
	}

	
}
