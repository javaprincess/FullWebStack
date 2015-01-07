package com.fox.it.erm;

/**
 * Simple status class with id and description
 * Not an entity. Used to send status to systemx
 * @author AndreasM
 *
 */
public class Status {
	
	private Long id;
	private String name;
	
	public Status() {

	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	
	

}
