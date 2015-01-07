package com.fox.it.erm.service.xproduct.delete;

import javax.inject.Inject;

import com.fox.it.erm.service.ProductService;

public class DeleteInfoCodesProcessor implements XProductSectionDeleteProcessor{


	private ProductService productService;

	@Inject
	public DeleteInfoCodesProcessor(ProductService productService) {
		this.productService = productService;
	}
	
	public void delete(Long foxVersionId, String userId,boolean isBusiness) {	
		productService.deleteProductInfoCodes(foxVersionId, userId, isBusiness);
	}

}
