package com.fox.it.erm.util;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.fox.it.erm.ErmProductRestriction;
import com.fox.it.erm.ErmProductRightRestriction;
import com.fox.it.erm.ErmProductRightStrand;
import com.fox.it.erm.RightStrandBase;
import com.fox.it.erm.util.IdsAccumulator.IdProvider;
import com.google.common.base.Function;
import com.google.common.collect.Maps;

public class StrandsUtil {
	public static Map<Long, ? extends RightStrandBase> toStrandsMap(List<? extends RightStrandBase> strands) {
		Map<Long,? extends RightStrandBase> map = Maps.uniqueIndex(strands, new Function<RightStrandBase,Long>() {
			  public Long apply(RightStrandBase strand) {
			  	return strand.getRightStrandId();
			  }});
		return map;
	}
	
	public static List<Long> getStrandIds(List<ErmProductRightStrand> strands) {
		List<Long> ids = IdsAccumulator.getIds(strands, new IdProvider<ErmProductRightStrand>() {
			@Override
			public Long getId(ErmProductRightStrand o) {
				return o.getRightStrandId();
			}			
		});
		return ids;
	}
	
	public static List<Long> getProductRestrictionIds(List<ErmProductRestriction> restrictions) { 
		List<Long> ids = IdsAccumulator.getIds(restrictions, new IdProvider<ErmProductRestriction>() {
			@Override
			public Long getId(ErmProductRestriction o) {
				return o.getProductRestrictionId();
			}			
		});
		return ids;		
	}
	
	public static List<Long> getErmProductRestrictionIds(List<ErmProductRestriction> restrictions) { 
		List<Long> ids = new ArrayList<Long>();
		for (ErmProductRestriction restriction : restrictions)
		  ids.add(restriction.getProductRestrictionId());		
		return ids;			
	}
	
	public static List<Long> getErmProductRightRestrictionIds(List<ErmProductRightRestriction> restrictions) {
		List<Long> ids = new ArrayList<Long>();
		for (ErmProductRightRestriction restriction : restrictions) {
		  ids.add(restriction.getRightRestrictionId());		
		}
		return ids;		
	}
	
	public static Map<Long, ErmProductRightRestriction> toErmProductRightRestrictionMap(List<ErmProductRightRestriction> restrictions) {
		Map<Long,ErmProductRightRestriction> map = Maps.uniqueIndex(restrictions, new Function<ErmProductRightRestriction,Long>() {
			  public Long apply(ErmProductRightRestriction restriction) {
			  	return restriction.getRightRestrictionId();
			  }});
		return map;
	}
	
	public static Map<Long, ErmProductRestriction> toErmProductRestrictionMap(List<ErmProductRestriction> restrictions) {
		Map<Long,ErmProductRestriction> map = Maps.uniqueIndex(restrictions, new Function<ErmProductRestriction,Long>() {
			  public Long apply(ErmProductRestriction restriction) {
			  	return restriction.getProductRestrictionId();
			  }});
		return map;
	}

}
