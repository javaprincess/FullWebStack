package com.fox.it.erm.util;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fox.it.erm.RightStrandSave;
import com.fox.it.erm.util.IdsAccumulator.IdProvider;

public class IdsUtil {

	public IdsUtil() {
	}
	
	public static String getIdsAsListInParenthesis(List<Long> ids) {
		return "(" + getIdsAsString(ids) + ")";
	}
	
	
	public static String getIdsAsString(List<?> ids) {
		StringBuilder builder = new StringBuilder();		
		int count = 0;
		for (Object id: ids) {
			if (count > 0) {				
				builder.append(",");
			}
			builder.append(id.toString());					
			count++;
		}
		return builder.toString();
	}
	
	public static List<Long> getRightStrandSaveIds(List<RightStrandSave> save) {
		List<Long> ids = IdsAccumulator.getIds(save, new IdProvider<RightStrandSave>() {

			@Override
			public Long getId(RightStrandSave o) {
				return o.getRightStrandId();
			}
		});
		return ids;
		
	}
	
	public static List<Long> unique(List<Long> ids) {
		Set<Long> set = new HashSet<>();
		for (Long id: ids) {
			if (!set.contains(id)) {
				set.add(id);
			}
		}
		List<Long> unique = new ArrayList<>();
		unique.addAll(set);
		return unique;
	}
	

}
