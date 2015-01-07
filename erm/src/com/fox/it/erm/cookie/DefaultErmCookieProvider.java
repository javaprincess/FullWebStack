package com.fox.it.erm.cookie;


import javax.ws.rs.core.Cookie;

import org.apache.commons.codec.binary.Base64;

public class DefaultErmCookieProvider implements ErmCookieProvider {

	public DefaultErmCookieProvider() {
	}

	
	private String encodeBase64(String value) {
		return new String(Base64.encodeBase64(value.getBytes()));
	}
	
	@Override
	public Cookie get(String userId) {
		return get(userId,null);
	}


	@Override
	public Cookie get(String userId, String domain) {
		String value = encodeBase64(userId);
		Cookie cookie = new Cookie(ERM_USER_COOKIE_NAME, value,null,domain);
		return cookie;
	}

}
