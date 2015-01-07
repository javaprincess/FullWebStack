package com.fox.it.erm.copy;

import java.util.List;

import javax.inject.Inject;

import com.fox.it.erm.ErmProductRightStrand;
import com.fox.it.erm.service.RightStrandService;

public class XProductCopyStrandsFinder {

	private final RightStrandService service;
	
	@Inject
	public XProductCopyStrandsFinder(RightStrandService service) {
		this.service = service;
	}
	
	public List<ErmProductRightStrand> find(Long foxVersionId,boolean isBusiness) {
		return service.findAllRightStrands(foxVersionId, isBusiness);
	}

}
