package com.fox.it.erm.service;

import java.util.Date;
import java.util.List;

import javax.ejb.Local;

import com.fox.it.erm.Language;
import com.fox.it.erm.util.ErmNodeAlt;

@Local
public interface LanguageService {
	List<Language> get();
	List<Language> findAll();
	List<ErmNodeAlt> getTree();	
	List<ErmNodeAlt> getLanguageTreeAlt();	
	List<ErmNodeAlt> loadLanguageTreeAlt();
	
	Date getLastChangeInTreeTimestamp();
	
	
}
