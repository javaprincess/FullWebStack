package com.fox.it.erm.service;

import java.util.Date;
import java.util.List;

import com.fox.it.erm.ErmProductRightRestriction;
import com.fox.it.erm.ErmProductRightStrand;
import com.fox.it.erm.RightStrandSave;
import com.fox.it.erm.util.RestrictionObject;
import com.fox.it.erm.util.RightStrandUpdateObject;

public interface RightStrandSaveHandler {

	public List<RightStrandSave> create(List<ErmProductRightStrand> strands);
	public List<RightStrandSave> update(List<ErmProductRightStrand> strands,RightStrandUpdateObject rightStrandUpdate,String userId,boolean isBusiness) throws Exception;
	public List<Long> updateReleaseDate(Date date, List<ErmProductRightStrand> strands);
	public List<Long> delete(Long foxVersionId,List<Long> ids);
	
	public List<Long> updateStarndRestritctions(List<ErmProductRightRestriction> restrictions,List<RestrictionObject> restrictionsFromUpdate,String userId,boolean isBusiness);
	
	public List<Long> deleteRightRestrictions(List<Long> restrictionIds);
	
	public List<Long> adoptRightStrand(List<ErmProductRightStrand> strands, String userId, boolean isBusiness);
	public List<Long> adoptRightRestrictions(List<ErmProductRightRestriction> restrictions, String userId,boolean isBusiness);
}
