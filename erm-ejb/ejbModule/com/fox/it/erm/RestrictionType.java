package com.fox.it.erm;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="REF_RSTRCN_TYP")
public class RestrictionType implements CodeTableValue{
	@Id
	@Column(name="RSTRCN_TYP_ID")
	private Long id;
	
	@Column(name="RSTRCN_TYP_CD")
	private String code;
	
	@Column(name="RSTRCN_TYP_DESC")
	private String name;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	
}
