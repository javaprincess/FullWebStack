package com.fox.it.erm.copy;



import com.fox.it.erm.ClearanceMemo;
import com.fox.it.erm.ErmException;
import com.fox.it.erm.ErmValidationException;
import com.fox.it.erm.service.ClearanceMemoService;


public class ClearanceMemoCopyProcessor implements XProductSectionCopyProcessor{

	private final ClearanceMemoService clearanceMemoService;
	
	public ClearanceMemoCopyProcessor(ClearanceMemoService clearanceMemoService) {
		this.clearanceMemoService = clearanceMemoService;

	}
	
	/**
	 * Copies the complete clearance memo to the target product.
	 * Precondition: The target product must not have a clearance memo
	 * @param toFoxVersionId
	 * @param clearanceMemo
	 * @param userId
	 * @throws ErmException 
	 */
	public void copyClearanceMemo(Long toFoxVersionId,ClearanceMemo clearanceMemo,boolean copySections,String userId) throws ErmException {
		clearanceMemo.setFoxVersionId(toFoxVersionId);
		clearanceMemo.clearIds();
		//first see if the product has clearance memo
		boolean hasClearanceMemo = clearanceMemoService.hasClearanceMemo(toFoxVersionId);
		if (!hasClearanceMemo) {
			clearanceMemoService.create(clearanceMemo, userId);
			clearanceMemoService.copyCommentContentFromClearanceMemo(clearanceMemo,userId);
		} else {
			if (!copySections) {
				throw new ErmValidationException("Fox Version Id has clearance memo. Cannot copy clearance memo if one already exists");
			}
			clearanceMemoService.copyToExistingClearanceMemo(toFoxVersionId, clearanceMemo, userId);
			clearanceMemoService.copyCommentContentFromClearanceMemo(clearanceMemo,userId);			
		}
	}

	@Override
	public void copy(Long fromFoxVersionId, Long toFoxVersionId,
			XProductCopyData data, String userId, boolean isBusiness) throws ErmException{
		if (data.getClearanceMemo()!=null) {
			boolean copySections = data.getClearanceMemoNodeIds()!=null && data.getClearanceMemoNodeIds().size()>0; 
			copyClearanceMemo(toFoxVersionId, data.getClearanceMemo(), copySections,userId);
		}
		
	}
	

}
