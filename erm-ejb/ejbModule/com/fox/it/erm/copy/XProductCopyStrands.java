package com.fox.it.erm.copy;

import java.util.List;


import com.fox.it.erm.ErmProductRightStrand;
import com.fox.it.erm.service.impl.CopyStrandsProcessor;
import com.fox.it.erm.util.RightStrandUpdateObject;

public class XProductCopyStrands implements XProductSectionCopyProcessor {

	
	private final CopyStrandsProcessor copyStandsProcessor;

	public XProductCopyStrands(CopyStrandsProcessor copyStrandsProcessor) {
		this.copyStandsProcessor = copyStrandsProcessor;
	}


	public void copy(Long fromFoxVersionId,Long toFoxVersionId, List<ErmProductRightStrand> strands,String userId, boolean isBusiness) {
		copyStandsProcessor.copyStrands(fromFoxVersionId,toFoxVersionId,  strands, new RightStrandUpdateObject(),userId, isBusiness);
	}
	
	@Override
	public void copy(Long fromFoxVersionId,Long toFoxVersionId,XProductCopyData data,String userId, boolean isBusiness) {
		if (data.getStrands()!=null) {
			copy(fromFoxVersionId,toFoxVersionId,data.getStrands(),userId, isBusiness);
		}

	}

}
