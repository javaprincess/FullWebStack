package com.fox.it.erm.service.impl;

import java.util.Date;
import java.util.List;

import com.fox.it.erm.ErmProductRightStrand;
import com.fox.it.erm.RightStrandSave;

public class ReleaseDateProcessor {

	public ReleaseDateProcessor() {

	}
	
	/**
	 * We don't have the business/legal indicataor at this point
	 */
	public static void setReleaseDateForCreate(Date date, List<ErmProductRightStrand> strands,boolean isBusiness) {
		for (ErmProductRightStrand strand: strands) {		
			if (isBusiness) {
				strand.setReleaseDate(date);			
			} else {
				strand.setReleaseDate(null);			
			}
		}
	}

	
	public static void setReleaseDateForCreateSaveObjects(List<RightStrandSave> strands, boolean isBusiness) {
		for (RightStrandSave strand: strands) {
			if (!isBusiness) {
				strand.setReleaseDate(null);
			}
		}
	}
	

	
	
	public static void setReleaseDate(Date date, List<ErmProductRightStrand> strands) {
		for (ErmProductRightStrand strand: strands) {
			if (strand.isBusiness() && ! strand.isLegal()) {
				strand.setReleaseDate(date);
			} else {
				strand.setReleaseDate(null);
			}
		}
	}
	
	

}
