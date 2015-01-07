package com.fox.it.erm.util;

import javax.persistence.EntityManager;

import com.fox.it.erm.ErmProductRightStrand;
import com.fox.it.erm.Language;
import com.fox.it.erm.Media;
import com.fox.it.erm.Territory;

public class StrandDescriptionProvider {

	
	public static String getStrandDescription(EntityManager em,ErmProductRightStrand strand) {
		String inclusionType = Boolean.TRUE.equals(strand.getExcludeFlag())?"Exclusion":"Inclusion";
		String mediaCode=strand.getMedia()!=null?strand.getMedia().getCode():em.find(Media.class, strand.getMediaId()).getCode();
		String territoryCode=strand.getTerritory()!=null?strand.getTerritory().getCode():em.find(Territory.class, strand.getTerritoryId()).getCode();
		String languageCode=strand.getLanguage()==null?strand.getLanguage().getCode():em.find(Language.class, strand.getLanguageId()).getCode();
		return inclusionType + " M: " + mediaCode + " T: " + territoryCode + " L: " + languageCode; 

	}
	
	
}
