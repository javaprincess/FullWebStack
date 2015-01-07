package com.fox.it.erm.service;

import java.util.List;

import javax.ejb.Local;

import com.fox.it.erm.ErmException;
import com.fox.it.erm.ErmProductRestriction;
import com.fox.it.erm.ErmProductRightStrand;
import com.fox.it.erm.RightStrandSave;
import com.fox.it.erm.util.RightStrandUpdateObject;

@Local
public interface CopyService {
	public List<RightStrandSave> copyStrandsAndAddComment(Long foxVersionId, Long toFoxVersionId,List<ErmProductRightStrand> strands,RightStrandUpdateObject update,String userId, boolean isBusiness,RightStrandSaveService strandsService) throws ErmException;	
	public List<RightStrandSave> copyStrands(Long foxVersionId, Long toFoxVersionId,List<ErmProductRightStrand> strands,RightStrandUpdateObject update,String userId, boolean isBusiness) throws ErmException;
	public List<Long> copyInfoCodes(Long foxVersionId, Long toFoxVersionId, List<ErmProductRestriction> infoCodes, String userId, boolean isBusiness);
}
