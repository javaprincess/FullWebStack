package com.fox.it.erm.service.impl;



import com.fox.it.erm.User;
import com.fox.it.erm.service.UserTypePredicate;


public class UserTypePredicateImpl implements UserTypePredicate {
	
	@Override
	public boolean isBusiness(User user) {
		if (user==null) return false;
		return user.isBusiness();
	}

	@Override
	public boolean isLegal(User user) {
		if (user==null) return false;
		return user.isLegal();
	}

}
