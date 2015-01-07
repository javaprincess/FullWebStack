package com.fox.it.erm;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="EDM_GLOBAL_TITLE_ALIAS_VW")
public class ProductAlias {
	@SuppressWarnings("serial")
	@Embeddable
	public class ProductAliasPK implements Serializable{
		@Column(name="FOX_VERSION_ID")
		Long foxVersionId;
		@Column(name="TITLE_ALT_TYP_CD")
		String aliasType;
	}

	@Id
	ProductAliasPK id;
	
	@Column(name="TITLE_DISP")
	private String alias;
	
	@Column(name="FOX_VERSION_ID",insertable=false,updatable=false)
	private Long foxVersionId;
	
	
	
	public String getAliasType() {
		return id.aliasType;
	}
	public void setAliasType(String aliasType) {
		if (id==null) id = new ProductAliasPK();
		this.id.aliasType = aliasType;
	}
	public Long getFoxVersionId() {
		return id.foxVersionId;
	}
	public void setFoxVersionId(Long foxVersionId) {
		if (id==null) id = new ProductAliasPK();
		this.id.foxVersionId = foxVersionId;
	}
	public String getAlias() {
		return alias;
	}
	public void setAlias(String alias) {
		this.alias = alias;
	}
	
	
	

}
