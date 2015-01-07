package com.fox.it.erm.service.xproduct.delete;

import javax.ejb.Local;



import com.fox.it.erm.jobs.Job;

@Local
public interface XProductAsyncDeleteService {
	public void doDelete(Job job, XProductDeleteSpec spec, String userId, boolean isBusiness);
}
