package com.fox.it.erm.service.copyright;

import javax.ejb.Local;

import com.fox.it.erm.copyright.ERMCopyright;

@Local
public interface CopyrightService {
	
	public ERMCopyright findCopyrightById(Long foxVersionId);

}
