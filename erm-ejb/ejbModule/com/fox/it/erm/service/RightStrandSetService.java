package com.fox.it.erm.service;

import javax.ejb.Local;

import com.fox.it.erm.ErmRightStrandSet;

@Local
public interface RightStrandSetService {

	public ErmRightStrandSet createSet(Long foxVersionId,String name,String description,String userId);
	
	public ErmRightStrandSet findStrandSet(Long foxVersionId, String name);
	
	public ErmRightStrandSet findById(Long strandSetId);	
	
	public ErmRightStrandSet copyToProduct(Long strandSetId, Long foxVersionId,String userId);
}
