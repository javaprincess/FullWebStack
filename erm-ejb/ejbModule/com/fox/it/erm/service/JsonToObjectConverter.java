package com.fox.it.erm.service;

public interface JsonToObjectConverter<T> {
	public T convert(String json);
}
