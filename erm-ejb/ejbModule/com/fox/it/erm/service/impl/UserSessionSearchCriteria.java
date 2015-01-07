package com.fox.it.erm.service.impl;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.UserSession;

public class UserSessionSearchCriteria extends SearchCriteria<UserSession> {

	public UserSessionSearchCriteria(EntityManager em) {
		super(em, UserSession.class);

	}
	
	public UserSessionSearchCriteria setUserId(String userId) {
		equal("userId",userId);
		return this;
	}

}
