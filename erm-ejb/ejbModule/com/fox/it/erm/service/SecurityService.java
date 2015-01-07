package com.fox.it.erm.service;

import javax.validation.constraints.NotNull;

import com.fox.it.erm.SystemSecKey;
import com.fox.it.erm.User;

public interface SecurityService {
	public User get(@NotNull String userId);
	public SystemSecKey getSystemSecKeyBySystemName(String systemName);	
}
