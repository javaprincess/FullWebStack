package com.fox.it.erm.service.impl;

import java.util.List;

import com.fox.it.erm.ErmProductRightStrand;
import com.fox.it.erm.RightStrandSave;
import com.fox.it.erm.util.RightStrandUpdateObject;


public interface CopyStrandsProcessor {
	public List<RightStrandSave> copyStrands(Long foxVersionId, List<ErmProductRightStrand> strands,RightStrandUpdateObject update,String userId, boolean isBusiness);
	public List<RightStrandSave> copyStrands(Long foxVersionId, Long toFoxVersionId,List<ErmProductRightStrand> strands,RightStrandUpdateObject update,String userId, boolean isBusiness);	
}
