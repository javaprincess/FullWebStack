package com.fox.it.erm.util;

import java.util.List;

/**
 * Object representing the values passed from the UI to aid in deleting right strands and restrictions
 * @author JonathanP
 *
 */
public class DeleteRightsRestrictionStrandCreateObject {
	private List<Long> rightStrandIds;
	private List<Long> rightStrandRestrictionIds;
	private List<Long> productInfoCodeRestrictionIds;
	private Long foxVersionId;
	public List<Long> getRightStrandIds() {
		return rightStrandIds;
	}
	public void setRightStrandIds(List<Long> rightStrandIds) {
		this.rightStrandIds = rightStrandIds;
	}
	public List<Long> getRightStrandRestrictionIds() {
		return rightStrandRestrictionIds;
	}
	public void setRightStrandRestrictionIds(List<Long> rightStrandRestrictionIds) {
		this.rightStrandRestrictionIds = rightStrandRestrictionIds;
	}
	public List<Long> getProductInfoCodeRestrictionIds() {
		return productInfoCodeRestrictionIds;
	}
	public void setProductInfoCodeRestrictionIds(
			List<Long> productInfoCodeRestrictionIds) {
		this.productInfoCodeRestrictionIds = productInfoCodeRestrictionIds;
	}
	public Long getFoxVersionId() {
		return foxVersionId;
	}
	public void setFoxVersionId(Long foxVersionId) {
		this.foxVersionId = foxVersionId;
	}		
}
