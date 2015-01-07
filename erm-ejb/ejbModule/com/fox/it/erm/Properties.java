package com.fox.it.erm;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="PROPERTIES")
public class Properties {
	@Id
	private String name;
	private String value;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getValue() {
		return value;
	}
	
	public Long getLongValue() {
		if (getValue()==null) return null;
		return Long.parseLong(getValue());
	}
	public void setValue(String value) {
		this.value = value;
	}
	
	
}
