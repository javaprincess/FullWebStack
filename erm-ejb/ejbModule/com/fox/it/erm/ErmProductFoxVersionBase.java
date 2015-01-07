package com.fox.it.erm;


import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.Column;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;


import com.fasterxml.jackson.annotation.JsonIgnore;

@SuppressWarnings("serial")
@MappedSuperclass
public abstract class ErmProductFoxVersionBase extends ErmProductRestrictionBase {

	@JsonIgnore
	@ManyToOne(fetch=FetchType.EAGER, optional=false)
	@JoinColumn(name="FOX_VERSION_ID", nullable=false,insertable=false,updatable=false)
	private ErmProductVersion ermProductVersion;

	@Column(name="FOX_VERSION_ID")
	private Long foxVersionId;
	
	
	public ErmProductVersion getErmProductVersion() {
		return ermProductVersion;
	}

	public void setErmProductVersion(ErmProductVersion ermProductVersion) {
		this.ermProductVersion = ermProductVersion;
	}

	public Long getFoxVersionId() {
		return foxVersionId;
	}

	public void setFoxVersionId(Long foxVersionId) {
		this.foxVersionId = foxVersionId;
	}	
	

}
