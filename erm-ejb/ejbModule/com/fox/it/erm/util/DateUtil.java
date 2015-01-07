package com.fox.it.erm.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;


public class DateUtil {

	
	public DateUtil() {

	}
	
	/*
	 * Returns true if both dates are the same date 
	 * ie same day month and year
	 */
	public static boolean isSameDate(Date d1, Date d2) {
		if (d1==d2) return true;
		if (d1==null&&d2!=null) return false;
		if (d2==null&&d1!=null) return false;
		Calendar c1 = Calendar.getInstance();
		Calendar c2 = Calendar.getInstance();
		c1.setTime(d1);
		c2.setTime(d2);
		int day1 = c1.get(Calendar.DAY_OF_MONTH);
		int day2 = c2.get(Calendar.DAY_OF_MONTH);
		
		int month1 = c1.get(Calendar.MONTH);
		int month2 = c2.get(Calendar.MONTH);
		
		int year1 = c1.get(Calendar.YEAR);
		int year2 = c2.get(Calendar.YEAR);
		
		return day1 == day2 &&
			   month1 == month2 &&
			   year1 == year2;
	}
	

	
	public static Date subtractDays(Date date,int numberOfDays){
		long time = date.getTime() - numberOfDays*1000*60*60*24;
		return new Date(time);
	}
	
	public static Long toDateAsLong(String dateStr) {
		Date date = toDate(dateStr);
		if (date==null) return 0L;
		return date.getTime();
	}
	
	public static Date toDate(String dateStr)  {		
		if (dateStr==null||dateStr.isEmpty()) return null;
		try {
			SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");			
			Date date = simpleDateFormat.parse(dateStr);
			return date;
		} catch (ParseException e) { e.printStackTrace(System.err);}
		return null;
	}
	
}
