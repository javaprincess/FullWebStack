package com.fox.it.erm;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="LNGG")
public class Language implements CodeTableValue{
	
	@Id
	@Column(name="LNGG_ID")
	private Long id;
	
	@Column(name="LNGG_DESC", length=100)
	private String name;
	
	@Column(name="LNGG_CD", length=2)
	private String languageCode;
	
	@Column(name="ACTV_FLG", length=1)
	private String activeFlag;
	
	
	
	public Language(Long id, String name) {
		this.id = id;
		this.name = name;
	}
	
	
	
	public Language() {
		super();
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

	public String getLanguageCode() {
		return languageCode;
	}

	public void setLanguageCode(String languageCode) {
		this.languageCode = languageCode;
	}



	public String getActiveFlag() {
		return activeFlag;
	}



	public void setActiveFlag(String activeFlag) {
		this.activeFlag = activeFlag;
	}



	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((id == null) ? 0 : id.hashCode());
		return result;
	}



	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Language other = (Language) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		return true;
	}



	@Override
	public String getCode() {
		return languageCode;
	}

	

}
