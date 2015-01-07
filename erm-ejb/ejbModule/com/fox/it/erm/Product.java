package com.fox.it.erm;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;



@Entity
@Table(name="EDM_GLOBAL_TITLE_VW")
public class Product extends ProductBase{
	
	
	@OneToOne(cascade=CascadeType.ALL, fetch=FetchType.EAGER)
	@JoinColumn(name="DEFAULT_VERSION_ID", insertable=false, updatable=false)
	private ErmProductVersion ermProductVersionHeader;		
	
	public Product() {
		super();
	}

	public Product(Long id, String title) {
		super(id, title);

	}

	public Product(Long id) {
		super(id);

	}
	

	
	public ErmProductVersion getErmProductVersionHeader() {
		return ermProductVersionHeader;
	}


	public void setErmProductVersionHeader(ErmProductVersion ermProductVersionHeader) {
		this.ermProductVersionHeader = ermProductVersionHeader;
	}
	
	public void copyFromBase(ProductBase b) {
		setDefaultVersionId(b.getDefaultVersionId());
		setFinancialDivisionCode(b.getFinancialDivisionCode());
		//TMA adding financialDivisionDesc
		setFinancialDivisionDesc(b.getFinancialDivisionDesc());
		
		setFinancialProductId(b.getFinancialProductId());
		setFoxId(b.getFoxId());
		setLifecycleStatusCode(b.getLifecycleStatusCode());
		setLifecycleStatusDescription(b.getLifecycleStatusDescription());
		setProductionYear(b.getProductionYear());
		setProductTypeCode(b.getProductTypeCode());
		setProductTypeDesc(b.getProductTypeDesc());
		setOriginalMediaCode(b.getOriginalMediaCode());
		setOriginalMediaDesc(b.getOriginalMediaDesc());
		setReleaseDate(b.getReleaseDate());
		setTitle(b.getTitle());
		setStatusCode(b.getStatusCode());
	}

	
}
