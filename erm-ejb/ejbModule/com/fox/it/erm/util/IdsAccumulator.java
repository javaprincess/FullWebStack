package com.fox.it.erm.util;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

public class IdsAccumulator {
	public static interface  IdProvider<T> {
		Long getId(T o);
	};
	
	  public static  <T> List<Long> getIds(List<T> list, IdProvider<T> idProvider) {
		List<Long> ids = new ArrayList<Long>(list==null?0:list.size());
		for (T element: list) {
			Long id = idProvider.getId(element);
			ids.add(id);
		}
		return ids;
	}
	  
	  public static <T> HashSet<Long> getIdsSet(List<T> list, IdProvider<T> idProvider) {
		  List<Long> ids = getIds(list,idProvider);
		  HashSet<Long> set = new HashSet<Long>();
		  set.addAll(ids);
		  return set;
	  }

}
