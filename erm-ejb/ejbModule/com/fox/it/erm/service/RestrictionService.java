package com.fox.it.erm.service;

import java.util.Date;
import java.util.List;

import javax.ejb.Local;

import com.fox.it.erm.Restriction;

@Local
public interface RestrictionService {

	public List<Restriction> findAll();
	public List<Restriction> findByTypeId(Integer typeId);
	public Restriction findById(Integer id);
	public List<Restriction> findAllSortedByCode();
	
	public Date getLastModifiedTimestamp();
	
}
