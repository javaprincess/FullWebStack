package com.fox.it.erm.service.impl;

import java.util.Calendar;
import java.util.Date;

public class DateCodes {

	public enum Code {

		P(1L),
		TBA(2L);

		
		private final Long id;
		Code(Long id) {
			this.id=id;
		}
		
		public boolean isPerpetuity() {
			return this==P;
		}
		
		public boolean isTBA() {
			return this==TBA;
		}
		
		public Long getId() {
			return id;
		}
		
		public static Code get(Long id) {
			if (id==null) return null;
			Code[] codes = Code.values();
			for (Code code: codes) {
				if (code.id.equals(id)) {
					return code;
				}
			}
			return null;
		}
		
		public Date getStartDate() {
			return getBeginingOfTime();
		}
		
		public Date getEndDate() {
			return getEndOfTime();
		}
		
		public static Date getBeginingOfTime() {
			Calendar calendar = Calendar.getInstance();
			calendar.set(Calendar.YEAR, 1000);
			calendar.set(Calendar.MONTH, 0);
			calendar.set(Calendar.DAY_OF_MONTH,1);
			return calendar.getTime();
		}
		
		public static Date getEndOfTime() {
			Calendar calendar = Calendar.getInstance();
			calendar.set(Calendar.YEAR, 9999);
			calendar.set(Calendar.MONTH, 0);
			calendar.set(Calendar.DAY_OF_MONTH,1);
			return calendar.getTime();
		}
		
		
	}
	public DateCodes() {

	}

}
