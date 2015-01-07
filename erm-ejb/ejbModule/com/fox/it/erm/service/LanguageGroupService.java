package com.fox.it.erm.service;

import javax.ejb.Local;

import com.fox.it.erm.LanguageGroup;

@Local
public interface LanguageGroupService {

	public abstract Object loadAllLanguageGroupAsArray();

	public abstract LanguageGroup findById(Long languageGroupId);

}