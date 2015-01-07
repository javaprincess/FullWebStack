package com.fox.it.erm;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name="PROD_FILE_NO")
public class ProductFileNumber extends ProductFileNumberBase{

	@ManyToOne(fetch=FetchType.EAGER)
	@JoinColumn(name="FOX_VERSION_ID", nullable=true, insertable=false, updatable=false)
	private ProductVersion productVersion;
	


	@JsonIgnore
	public ProductVersion getProductVersion() {
		return productVersion;
	}

	public void setProductVersion(ProductVersion productVersion) {
		this.productVersion = productVersion;
	}

	
		
}
