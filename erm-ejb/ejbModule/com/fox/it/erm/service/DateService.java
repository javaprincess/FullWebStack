package com.fox.it.erm.service;

import java.util.List;

import javax.ejb.Local;

import com.fox.it.erm.DateCode;
import com.fox.it.erm.DateStatus;

@Local
public interface DateService {

	/**
	 * 
	 * @return
	 */
	public List<DateCode> findAllDateCodes();

	/**
	 * 
	 * @return
	 */
	public List<DateStatus> findAllDateStatus();
	
	/**
	 * 
	 * @return
	 */
	public Object findPartialDateCodes();

}