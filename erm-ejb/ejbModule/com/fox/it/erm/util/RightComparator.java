package com.fox.it.erm.util;

import java.util.Comparator;

import com.fox.it.erm.ErmProductRightStrand;

public class RightComparator implements Comparator<ErmProductRightStrand>{

	@Override
	public int compare(ErmProductRightStrand o1, ErmProductRightStrand o2) {
		if(o1 != null && o2 != null && o1.getMedia() != null && o2.getMedia() != null){
			String local = o1.getMedia().getName()+o1.getRightStrandId();
			String other = o2.getMedia().getName()+o2.getRightStrandId();
					
			return local.compareToIgnoreCase(other);
		}
		return 0;
	}
	
	

}
