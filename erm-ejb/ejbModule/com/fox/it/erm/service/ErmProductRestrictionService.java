package com.fox.it.erm.service;

import java.util.List;

import javax.ejb.Local;
import javax.validation.constraints.NotNull;

import com.fox.it.erm.ErmProductGrant;
import com.fox.it.erm.ErmProductLanguageRestriction;
import com.fox.it.erm.ErmProductMediaRestriction;
import com.fox.it.erm.ErmProductRestriction;
import com.fox.it.erm.ErmProductTerritoryRestriction;

@Local
public interface ErmProductRestrictionService {

	
//	public ErmProductGrant findErmProductGrantByPrimaryKey(@NotNull Long ermProductGrantId);
	
	public List<ErmProductGrant> findErmProductGrantByErmProductVersionId(@NotNull Long ermProductVersionId);
	
	public List<ErmProductRestriction> findAllProductRestrictions(Long foxVersionId);
	
	public List<ErmProductRestriction> findAllProductRestrictions(Long foxVersionId,boolean isBusiness);	
	
	public List<ErmProductRestriction> findProductRestrictionsByIds(List<Long> ids);
		
//	public ErmProductLanguageRestriction findErmProductLanguageRestrictionByPrimaryKey(@NotNull Long ermProductLanguageRestrictionId);
	
	public List<ErmProductLanguageRestriction> findErmProductLanguageRestrictionByErmProductVersionId(@NotNull Long ermProductVersionId);
	
//	public ErmProductMediaRestriction findErmProductMediaRestrictionByPrimaryKey(@NotNull Long ermProductMediaRestrictionId);
	
	public List<ErmProductMediaRestriction> findErmProductMediaRestrictionByErmProductVersionId(@NotNull Long ermProductVersionId);
	
	public ErmProductRestriction findErmProductRestrictionByPrimaryKey(@NotNull Long ermProductRestrictionId);
	
	public List<ErmProductRestriction> findErmProductRestrictionByErmProductVersionId(@NotNull Long ermProductVersionId);
	
//	public ErmProductTerritoryRestriction findErmProductTerritoryRestrictionByPrimaryKey(@NotNull Long ermProductTerritoryRestrictionId);
	
	public List<ErmProductTerritoryRestriction> findErmProductTerritoryRestrictionByErmProductVersionId(@NotNull Long ermProductVersionId);
	
//	public ErmProductRightRestriction findErmProductRightRestrictionByPrimaryKey(@NotNull Long ermProductRightRestrictionId);
	
//	public List<ErmProductRightRestriction> findErmProductRightRestrictionByErmProductVersionId(@NotNull Long ermProductVersionId);
	
//	public ErmProductRightGrant findErmProductRightGrantByPrimaryKey(@NotNull Long ermProductRightGrantId);
	
//	public List<ErmProductRightGrant> findErmProductRightGrantByErmProductVersionId(@NotNull Long ermProductVersionId);
	
	public List<ErmProductRestriction> findRestriction(Long foxVersionId, Long restrictionId, boolean isBusiness);
}
