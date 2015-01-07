package com.fox.it.erm;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table(name="LNGG_GRP_LNGG")
public class LanguageGroupLanguage {

	@Id
	@SequenceGenerator(name = "LNGG_GRP_LNGG_SEQ", sequenceName = "LNGG_GRP_LNGG_SEQ",allocationSize=1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "LNGG_GRP_LNGG_SEQ")								
	@Column(name="LNGG_GRP_LNGG_ID")
	private Long languageGroupLanguageId;
	
	@Column(name="LNGG_ID")
	private Long languageId;
	
	@Column(name="LNGG_GRP_ID")
	private Long languageGroupId;

	public Long getLanguageGroupLanguageId() {
		return languageGroupLanguageId;
	}

	public void setLanguageGroupLanguageId(Long languageGroupLanguageId) {
		this.languageGroupLanguageId = languageGroupLanguageId;
	}

	public Long getLanguageId() {
		return languageId;
	}

	public void setLanguageId(Long languageId) {
		this.languageId = languageId;
	}

	public Long getLanguageGroupId() {
		return languageGroupId;
	}

	public void setLanguageGroupId(Long languageGroupId) {
		this.languageGroupId = languageGroupId;
	}
	
	
}
