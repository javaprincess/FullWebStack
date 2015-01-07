package com.fox.it.erm.service.impl;

import java.util.Calendar;
import java.util.Date;

import org.springframework.util.StringUtils;


public class SearchCriterias {

	
	public static String toEndsWith(String q) {
		if (q==null) q="";
		q="%" + q;
		return q;
	}

	public static String toStartsWith(String q){
		if (q==null) q="";
		q+="%";
		return q;
	}

	public static String toContains(String q) {
		if (q==null) q="";
		q="%" + q + "%";
		return q;		
	}

	public static String toWildcardType(String q, String wildcardType) {
		StringBuilder stringBuilder = new StringBuilder();	
		if (q != null) {
			String[] splitString = q.split(";");		
			//logger.log(Level.SEVERE, "toWildcardType: splitString - " + splitString);
			for (int i = 0; i < splitString.length; i++) {
			  //logger.log(Level.SEVERE, "toWildcardType: item - " + splitString[i]);
			  String item = StringUtils.trimWhitespace(splitString[i]);
			  if (stringBuilder.length() > 0)
			    stringBuilder.append(";");					 
			  if (SearchCriterias.CONTAINS.equals(wildcardType))
				  stringBuilder.append(toContains(item));		 
			  if (SearchCriterias.STARTS_WITH.equals(wildcardType))
				  stringBuilder.append(toStartsWith(item));		  
			  if (SearchCriterias.ENDS_WITH.equals(wildcardType)) 
				  stringBuilder.append(toEndsWith(item));
			  if (SearchCriterias.EQUALS.equals(wildcardType)) 
				  stringBuilder.append(item);
			}
		}
		return stringBuilder.toString();
	}

	public static Date getFirstDayOfYear(Integer year) {
		Calendar calendar = Calendar.getInstance();
		calendar.set(Calendar.DAY_OF_MONTH, 1);
		calendar.set(Calendar.MONTH, Calendar.JANUARY);
		calendar.set(Calendar.YEAR, year);
		calendar.set(Calendar.HOUR_OF_DAY, 0);
		calendar.set(Calendar.MINUTE, 0);
		calendar.set(Calendar.SECOND, 0);
		calendar.set(Calendar.MILLISECOND, 0);
		return calendar.getTime();				
	}

	public static final String CONTAINS = "C";
	public static final String EQUALS = "EQ";
	public static final String STARTS_WITH = "S";
	public static final String ENDS_WITH = "E";

}
