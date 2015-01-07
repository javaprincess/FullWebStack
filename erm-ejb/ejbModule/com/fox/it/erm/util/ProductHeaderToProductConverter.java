package com.fox.it.erm.util;

import java.util.List;

import com.fox.it.erm.Product;
import com.fox.it.erm.ProductHeader;
import com.fox.it.erm.ProductVersionHeader;

public class ProductHeaderToProductConverter {

	public ProductHeaderToProductConverter() {

	}
	
	public static Product toProduct(ProductHeader productHeader) {
		Product product = new Product();
		product.copyFromBase(productHeader);
		return product;
	}

	
	public static void setProduct(List<ProductVersionHeader> headers,Product product) {
		for (ProductVersionHeader version: headers) {
			version.setProduct(product);
		}
	}
}
