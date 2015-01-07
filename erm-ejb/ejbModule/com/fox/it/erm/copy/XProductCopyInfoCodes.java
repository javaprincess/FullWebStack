package com.fox.it.erm.copy;

import java.util.List;

import com.fox.it.erm.ErmProductRestriction;
import com.fox.it.erm.service.impl.ProductInfoCodeCopyProcessor;

public class XProductCopyInfoCodes implements XProductSectionCopyProcessor {

	private final ProductInfoCodeCopyProcessor processor;
	
	public XProductCopyInfoCodes(ProductInfoCodeCopyProcessor processor) {
		this.processor = processor;
	}

	
	public void copy(Long fromFoxVersionId, Long toFoxVersionId,List<ErmProductRestriction> infoCodes, String userId, boolean isBusiness) {
		processor.copy(fromFoxVersionId, toFoxVersionId, infoCodes, userId, isBusiness);
	}
	
	@Override
	public void copy(Long fromFoxVersionId, Long toFoxVersionId,
			XProductCopyData data, String userId, boolean isBusiness) {
		if (data.getRestrictions()!=null) {
			copy(fromFoxVersionId,toFoxVersionId,data.getRestrictions(),userId,isBusiness);
		}
	}

}
