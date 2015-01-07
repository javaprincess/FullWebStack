package com.fox.it.erm.service.grants;

import java.util.HashSet;
import java.util.Set;

import com.fox.it.erm.enums.EntityCommentType;
import com.fox.it.erm.enums.GrantType;

/**
 * Predicate that computes if a comment should appear in CM
 * @author AndreasM
 *
 */
public class IncludeCommentInCMPredicate {

	private static Long[] SALES_MKTNG_GRANT_TYPES = {GrantType.PAID_AD_MEMO.getId(),GrantType.TITLE_CREDITS.getId(),GrantType.BILLING_BLOCK.getId()};
	private static Long[] SUBRIGHT_TYPES = {GrantType.REMAKES_SEQUELS.getId(),GrantType.FILMS_CLIPS_STILLS.getId()};
	private static Set<Long> allGrantTypes = new HashSet<>();
	private static Set<Long> subrightGrantTypes = new HashSet<>();
	
	static {
		for (Long grantType: SALES_MKTNG_GRANT_TYPES) {
			allGrantTypes.add(grantType);
		}
		for (Long grantType: SUBRIGHT_TYPES) {
			allGrantTypes.add(grantType);
			subrightGrantTypes.add(grantType);
		}
	}
	
	public IncludeCommentInCMPredicate() {

	}
	
	/**
	 * Returns the grant types that should be in CM
	 * @return
	 */
	public static final Set<Long> getGrantTypes() {
		return allGrantTypes;
	}
	
	public static final Set<Long> getSubrithsTypes() {
		return subrightGrantTypes;
	}
	
	public static boolean isCMEntityType(Long entityCommentTypeId) {
		return EntityCommentType.SALES_AND_MARKETING_SPECIAL.getId().equals(entityCommentTypeId);
		
	}
	
	public boolean apply(Long categoryId, Long grantCodeId) {
		if(grantCodeId==null) return false;
		if (!allGrantTypes.contains(grantCodeId)) return false;
		if (subrightGrantTypes.contains(grantCodeId)) return true;
		if (isCMEntityType(categoryId)) return true;
		return false;
	}

}
