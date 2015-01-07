package com.fox.it.erm.service;

import java.util.Date;
import java.util.List;

import javax.ejb.Local;

import com.fox.it.erm.Media;
import com.fox.it.erm.util.ErmNodeAlt;

@Local
public interface MediaService {
	public List<Media> get();
	public List<Media> findAll();
	
	public List<Media> findAllIncludeInactive();
	
	public List<ErmNodeAlt> getTree();
	public List<ErmNodeAlt> getMediaTreeAlt();
	public List<ErmNodeAlt> loadMediaTreeAlt();	
	
	public Date getLastChangeInTreeTimestamp();
	
}
