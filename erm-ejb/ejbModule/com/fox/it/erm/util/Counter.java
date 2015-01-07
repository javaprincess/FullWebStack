package com.fox.it.erm.util;

public class Counter {

	private long counter;
	
	public Counter() {
		this(0);
	}
	
	public Counter(long startWith) {
		this.counter = startWith;
	}
	
	public long count() {
		counter++;
		return counter;
	}
	
	public long get() {
		return counter;
	}
	

}
