package com.fox.it.erm.service.xproduct.delete;

import javax.inject.Inject;

import com.fox.it.erm.service.ClearanceMemoService;

public class DeleteClearanceMemoProcessor implements XProductSectionDeleteProcessor{
	
	private final ClearanceMemoService clearanceMemoService;
	
	@Inject
	public DeleteClearanceMemoProcessor(ClearanceMemoService clearanceMemoService) {
		this.clearanceMemoService = clearanceMemoService;
	}
	
	public void delete(Long foxVersionId, String userId) {
		clearanceMemoService.deleteClearanceMemo(foxVersionId, userId);
	}

	@Override
	public void delete(Long foxVersionId, String userId, boolean isBusiness) {
		delete(foxVersionId,userId);		
	}
	

}
