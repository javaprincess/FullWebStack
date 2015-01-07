package com.fox.it.erm;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.eclipse.persistence.annotations.BatchFetch;
import org.eclipse.persistence.annotations.BatchFetchType;

@Entity
@Table(name="EDM_GLOBAL_TITLE_VW")
public class ProductHeader extends ProductBase{
	
	@OneToOne(cascade=CascadeType.ALL, fetch=FetchType.EAGER)
	@JoinColumn(name="DEFAULT_VERSION_ID", insertable=false, updatable=false)
	@BatchFetch(value=BatchFetchType.IN)
	private ProductVersionHeader ermProductVersionHeader;		
	

	public ProductHeader() {
	}


	public ProductVersionHeader getErmProductVersionHeader() {
		return ermProductVersionHeader;
	}


	public void setErmProductVersionHeader(
			ProductVersionHeader ermProductVersionHeader) {
		this.ermProductVersionHeader = ermProductVersionHeader;
	}
	
//	public String getRightsIndicator() {
//		if (ermProductVersionHeader==null) return null;
//		return ermProductVersionHeader.getRightsIndicator();
//	}
	
	
	
	

}
