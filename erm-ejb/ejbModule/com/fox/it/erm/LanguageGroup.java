package com.fox.it.erm;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name="LNGG_GRP")
public class LanguageGroup {

	@Id
	@SequenceGenerator(name = "LNGG_GRP_SEQ", sequenceName = "LNGG_GRP_SEQ",allocationSize=1)
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "LNGG_GRP_SEQ")
	@Column(name="LNGG_GRP_ID")
	private Long languageGroupId;
	
	@Column(name="LNGG_GRP_NM")
	private String languageGroupName;
	
	@Column(name="OWNER_ID")
	private Long groupOwnerId;
	
	@JsonIgnore
	@OneToMany(cascade={CascadeType.ALL})
	@JoinColumn(name="LNGG_GRP_ID")
	private List<LanguageGroupLanguage> languageGroupLanguage;
	
	@Transient
	private List<Long> languageIds;

	public Long getLanguageGroupId() {
		return languageGroupId;
	}

	public void setLanguageGroupId(Long languageGroupId) {
		this.languageGroupId = languageGroupId;
	}

	public String getLanguageGroupName() {
		return languageGroupName;
	}

	public void setLanguageGroupName(String languageGroupName) {
		this.languageGroupName = languageGroupName;
	}

	public Long getGroupOwnerId() {
		return groupOwnerId;
	}

	public void setGroupOwnerId(Long groupOwnerId) {
		this.groupOwnerId = groupOwnerId;
	}

	private List<LanguageGroupLanguage> getLanguageGroupLanguage() {
		if(this.languageGroupLanguage == null){
			return new ArrayList<LanguageGroupLanguage>();
		}
		return languageGroupLanguage;
	}
	
	
	private List<Long> getListOfLanguagesBasedOnGroupId(){
		List<LanguageGroupLanguage> list = this.getLanguageGroupLanguage();
		List<Long> ids = new ArrayList<Long>();
		for(LanguageGroupLanguage l : list){
			ids.add(l.getLanguageId());
		}
		return ids;
	}
	
	
	public void setLanguageGroupLanguage(
			List<LanguageGroupLanguage> languageGroupLanguage) {
		this.languageGroupLanguage = languageGroupLanguage;
	}

	public List<Long> getLanguageIds() {
		return getListOfLanguagesBasedOnGroupId();
	}

	public void setLanguageIds(List<Long> languageIds) {
		this.languageIds = languageIds;
	}
	
	
	
}
