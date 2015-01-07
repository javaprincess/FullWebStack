package com.fox.it.erm.service;

import javax.ejb.Local;

import com.fox.it.erm.copy.XProductCopySpec;
import com.fox.it.erm.jobs.Job;

@Local
public interface XProductAsyncCopyService {
	public void doCopy(Job job, XProductCopySpec spec, String userId, boolean isBusiness);
}
