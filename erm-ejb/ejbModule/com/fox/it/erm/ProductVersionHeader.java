package com.fox.it.erm;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;



@Entity
@Table(name="EDM_GLOBAL_TITLE_VERSION_VW")
public class ProductVersionHeader extends ProductVersionBase {

	@Transient
	private Product product;
	
	@Transient
	private int episodeCount;
	@Transient
	private int seasonCount;

	public ProductVersionHeader() {
	}


	public Product getProduct() {
		return product;
	}


	public void setProduct(Product product) {
		this.product = product;
	}
	
	public int getEpisodeCount() {
		return episodeCount;
	}


	public void setEpisodeCount(int episodeCount) {
		this.episodeCount = episodeCount;
	}

	public int getSeasonCount() {
		return seasonCount;
	}

	public void setSeasonCount(int seasonCount) {
		this.seasonCount = seasonCount;
	}

	public String getProductName() {
		if (product==null) return null;
		return product.getTitle();
	}
	
	public String getDisplayName() {
		boolean isDefault = getIsDefaultVersion()==null?false:getIsDefaultVersion().booleanValue(); 
		if (isDefault) {
			return getProductName();
		}
		return getVersionTitle();
	}
	

}
