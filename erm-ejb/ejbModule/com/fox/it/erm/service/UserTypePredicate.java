package com.fox.it.erm.service;



import com.fox.it.erm.User;

/**
 * Determines is a user is Busines or Legal based on the roles/privileges
 * @author AndreasM
 *
 */

public interface UserTypePredicate {
	public boolean isBusiness(User user);
	public boolean isLegal(User user);

}
