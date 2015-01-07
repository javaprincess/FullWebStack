package com.fox.it.erm.service.grants;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.grants.ProductPromoMaterial;

public class PromoMaterialSearchCriteria extends
		SearchCriteria<ProductPromoMaterial> {

	public PromoMaterialSearchCriteria(EntityManager em) {
		super(em, ProductPromoMaterial.class);
	}
	
	public PromoMaterialSearchCriteria setId(Long id) {
		equal("id",id);
		return this;
	}
	
	public PromoMaterialSearchCriteria setFoxVersionId(Long foxVersionId) {
		equal("foxVersionId",foxVersionId);
		return this;
	}
	
	public PromoMaterialSearchCriteria setPromoMaterialId(Long promoMaterialId) {
		equal("promotionalMaterialId",promoMaterialId);
		return this;
	}
 

}
