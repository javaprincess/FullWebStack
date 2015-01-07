package com.fox.it.erm.service.xproduct.delete;

import com.fox.it.erm.copy.XProductSections;

public interface XProductSingleProductDeleteService {
	void doDeleteSingleProduct(Long jobId, Long actionId,Long foxVersionId,XProductSections sections, String userId, boolean isBusiness);	

}
