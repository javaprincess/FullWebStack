package com.fox.it.erm;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name="TRRTRY")
public class Territory implements CodeTableValue{
	



@Id
 @Column(name="TRRTRY_ID")
 private Long id;
 
 @Column(name="TRRTRY_DESC", length=100)
 private String name;
 
 @Column(name="TRRTRY_CD", length=2)
 private String territoryCode;
 
 @Column(name="ACTV_FLG")
 private String activeFlag;
 
 @Column(name="TRRTRY_LGL_NOTE")
 private String legalNote;
 
 @Column(name="TRRTRY_BSNS_NOTE")
 private String businessNote;
 
 
 public Territory() {
	super();
 }

 public Territory(Long id, String name) {
	 this.id = id;
	 this.name = name;
 }
 
 public Territory(Long id) {
	 this.id = id;
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

public String getCode() {
	return territoryCode;
}


public void setCode(String territoryCode) {
	this.territoryCode = territoryCode;
}

public String getLegalNote() {
	return legalNote;
}

public void setLegalNote(String legalNote) {
	this.legalNote = legalNote;
}

public String getBusinessNote() {
	return businessNote;
}

public void setBusinessNote(String businessNote) {
	this.businessNote = businessNote;
}

public String getActiveFlag() {
	return activeFlag;
}

@JsonIgnore
public boolean isActive() {
	return "Y".equals(getActiveFlag());
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
	Territory other = (Territory) obj;
	if (id == null) {
		if (other.id != null)
			return false;
	} else if (!id.equals(other.id))
		return false;
	return true;
}
 


}
