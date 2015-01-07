package com.fox.it.erm.util;

/**
 * Simple utility holder to hold the pair (business,legal)
 * @author AndreasM
 *
 */
public class BusinessLegal {
	private boolean isBusiness;
	private boolean isLegal;
	
	
	public BusinessLegal() {
	}
	
	public BusinessLegal(boolean business, boolean legal) {
		setBusiness(business);
		setLegal(legal);
	}

	public boolean isBusiness() {
		return isBusiness;
	}

	public void setBusiness(boolean isBusiness) {
		this.isBusiness = isBusiness;
	}

	public boolean isLegal() {
		return isLegal;
	}

	public void setLegal(boolean isLegal) {
		this.isLegal = isLegal;
	}
	
	

}
