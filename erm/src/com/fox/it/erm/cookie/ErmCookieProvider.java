package com.fox.it.erm.cookie;

import javax.ws.rs.core.Cookie;


public interface ErmCookieProvider {
	String ERM_USER_COOKIE_NAME="ERMUserId";
	
	public Cookie get(String userId);
	public Cookie get(String userId,String domain);
}
