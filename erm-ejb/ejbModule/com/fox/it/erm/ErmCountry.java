package com.fox.it.erm;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="EDM_REF_COUNTRY_VW")
public class ErmCountry implements Comparable<ErmCountry> {
	
	@Id
	@Column(name="CNTRY_CD", length=15)
	private String countryCode;
	
	@Column(name="CNTRY_DESC", length=100)
	private String countryDesc;

	public String getCountryCode() {
		return countryCode;
	}

	public void setCountryCode(String countryCode) {
		this.countryCode = countryCode;
	}

	public String getCountryDesc() {
		return countryDesc;
	}

	public void setCountryDesc(String countryDesc) {
		this.countryDesc = countryDesc;
	}
	
	@Override
	public int compareTo(ErmCountry o) {
		return this.countryDesc.compareTo(o.countryDesc);
	}
	
}