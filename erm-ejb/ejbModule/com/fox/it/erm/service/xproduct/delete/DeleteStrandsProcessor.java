package com.fox.it.erm.service.xproduct.delete;

import javax.inject.Inject;

import com.fox.it.erm.service.RightStrandSaveService;

public class DeleteStrandsProcessor implements XProductSectionDeleteProcessor{
	private final RightStrandSaveService rightStrandSaveService;
	
	@Inject
	public DeleteStrandsProcessor(RightStrandSaveService rightStrandSaveService) {
		this.rightStrandSaveService = rightStrandSaveService;
	}
	
	public void delete(Long foxVersionId, String userId,boolean isBusiness) {
		rightStrandSaveService.deleteRightStrands(foxVersionId, userId, isBusiness);
	}

}
