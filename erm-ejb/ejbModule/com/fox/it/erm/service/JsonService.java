package com.fox.it.erm.service;

public interface JsonService {
	String toJson(Object o);
	<T> T toObject(String s, Class<T> clazz);
}
