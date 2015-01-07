package com.fox.it.erm.service.impl;

import javax.persistence.EntityManager;

import com.fox.it.criteria.SearchCriteria;
import com.fox.it.erm.User;

public class UserSearchCriteria extends SearchCriteria<User> {

	public UserSearchCriteria(EntityManager em) {
		super(em, User.class);
		setActive();
	}
	
	public void setActive() {
		equal("status","A" );
	}
	
	public void setUserId(String userId) {
		equalUpper("userId",userId.toUpperCase());
	}

}
