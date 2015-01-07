package com.fox.it.erm.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;

import com.fox.it.erm.DateCode;
import com.fox.it.erm.DateStatus;
import com.fox.it.erm.service.DateService;
import com.fox.it.erm.service.impl.DateSearchCriterias.DateCodeCriteria;
import com.fox.it.erm.service.impl.DateSearchCriterias.DateStatusCriteria;

@Stateless
public class DateServiceBean extends ServiceBase implements DateService {

	@Inject
	private EntityManager entityManager;
	
	/* (non-Javadoc)
	 * @see com.fox.it.erm.service.DateService#findAllDateCodes()
	 */
	@Override
	public List<DateCode> findAllDateCodes(){
		
		DateCodeCriteria dcc = DateSearchCriterias.getDateCodeCriteria(entityManager);
		dcc.addSort("code");
		List<DateCode> list = dcc.getResultList();
		if(list != null && !list.isEmpty()){
			DateCode d = new DateCode();
			d.setId(-1L);
			d.setDescription("");
			d.setCode("");
			list.add(0, d);
		}
		return list;
	}
	
	/**
	 * 
	 */
	@Override
	public List<DateCode> findPartialDateCodes(){
		
		DateCodeCriteria dcc = DateSearchCriterias.getDateCodeCriteria(entityManager);
		dcc.addSort("code");
		List<DateCode> list = dcc.getResultList();
		if(list != null && !list.isEmpty()){			
			List<DateCode> dcs = new ArrayList<DateCode>();
			for(DateCode dc : list){
				if(dc.getId() != 1L){
					dcs.add(dc);
				}
			}
			DateCode d = new DateCode();
			d.setId(-1L);
			d.setDescription("");
			d.setCode("");
			dcs.add(0, d);
		}
		return list;
	}
	
	/* (non-Javadoc)
	 * @see com.fox.it.erm.service.DateService#findAllDateStatus()
	 */
	@Override
	public List<DateStatus> findAllDateStatus(){
		DateStatusCriteria dsc = DateSearchCriterias.getDateStatusCriteria(entityManager);
		dsc.addSort("code");
		List<DateStatus> list = dsc.getResultList();
		if(list != null && !list.isEmpty()){
			DateStatus d = new DateStatus();
			d.setCode("");
			d.setDescription("");
			d.setId(-1);
			list.add(0, d);

		}
		return list;
	}
}
