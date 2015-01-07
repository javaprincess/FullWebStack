package com.fox.it.erm;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="EDM_GLOBAL_TITLE_ALT_ID_VW")
public class ProductVersionAltId {
	@Id
	@Column(name="TITLE_ALT_ID")
	private Long id;
	@Column(name="FOX_VERSION_ID")
	private Long foxVersionId;
	@Column(name="TITLE_ALT_ID_TYP_CD")
	private String type;
	
	@Column(name="TITLE_ALT_ID_CD")
	private String altId;
	
	
	public ProductVersionAltId() {
	}


	public Long getId() {
		return id;
	}


	public void setId(Long id) {
		this.id = id;
	}


	public Long getFoxVersionId() {
		return foxVersionId;
	}


	public void setFoxVersionId(Long foxVersionId) {
		this.foxVersionId = foxVersionId;
	}


	public String getType() {
		return type;
	}


	public void setType(String type) {
		this.type = type;
	}


	public String getAltId() {
		return altId;
	}


	public void setAltId(String altId) {
		this.altId = altId;
	}
	
	

}
