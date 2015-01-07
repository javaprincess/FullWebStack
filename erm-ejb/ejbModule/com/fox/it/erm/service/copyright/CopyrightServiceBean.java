package com.fox.it.erm.service.copyright;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;

import com.fox.it.erm.copyright.ERMCopyright;

@Stateless
public class CopyrightServiceBean implements CopyrightService {

	@Inject
	EntityManager eM;
	
	public ERMCopyright findCopyrightById(Long foxVersionId) {
		
		return eM.find(ERMCopyright.class, foxVersionId);
	}

}
