package com.fox.it.erm.service.impl;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.DateCode;
import com.fox.it.erm.DateStatus;

public class DateSearchCriterias {

	public static class DateCodeCriteria extends SearchCriteria<DateCode>{
		public DateCodeCriteria(EntityManager em) {
			super(em,DateCode.class);
		}
	}
	
	public static class DateStatusCriteria extends SearchCriteria<DateStatus>{
		public DateStatusCriteria(EntityManager em) {
			super(em,DateStatus.class);
		}
	}
	
	public static  DateCodeCriteria getDateCodeCriteria(EntityManager em) {
		return new DateCodeCriteria(em);
	}

	public static  DateStatusCriteria getDateStatusCriteria(EntityManager em) {
		return new DateStatusCriteria(em);
	}
	
}
