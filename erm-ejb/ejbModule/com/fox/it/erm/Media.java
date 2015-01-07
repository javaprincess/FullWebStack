package com.fox.it.erm;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="MEDIA")
public class Media implements CodeTableValue{

	@Id
	@Column(name="MEDIA_ID")
	private Long id;
	
	@Column(name="MEDIA_DESC", length=100)
	private String name;
	
	@Column(name="MEDIA_CD", length=2)
	private String mediaCd;
	
	@Column(name="ACTV_FLG", length=1)
	private String activeFlag;
	
	@Column(name="MEDIA_LGL_NOTE")
	private String legalNote;
 
	@Column(name="MEDIA_BSNS_NOTE")
	private String businessNote;
	
	public Media(Long id, String name) {
		this.id =id;
		this.name = name;
	}
	
	
	
	public Media() {
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

	public String getMediaCd() {
		return mediaCd;
	}

	public void setMediaCd(String mediaCd) {
		this.mediaCd = mediaCd;
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
		Media other = (Media) obj;
		if (id == null) {
			if (other.id != null)
				return false;
		} else if (!id.equals(other.id))
			return false;
		return true;
	}



	@Override
	public String getCode() {
		return mediaCd;
	}
	
	
	
	
}
