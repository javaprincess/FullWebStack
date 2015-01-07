package com.fox.it.erm.service.xproduct.delete;

import javax.ejb.Local;

import com.fox.it.erm.jobs.Job;

@Local
public interface XProductDeleteService {
	
	public Job deleteAsJob(XProductDeleteSpec xProductDeleteSpec, String userId, boolean isBusiness);
}
