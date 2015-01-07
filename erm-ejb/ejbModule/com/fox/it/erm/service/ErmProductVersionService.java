package com.fox.it.erm.service;


import javax.ejb.Local;
import javax.validation.constraints.NotNull;

import com.fox.it.erm.ErmProductVersion;
import com.fox.it.erm.ErmProductVersionHeader;
import com.fox.it.erm.ErmRightStrandSet;
import com.fox.it.erm.Media;
import com.fox.it.erm.ProductVersionBase;
import com.fox.it.erm.util.ErmNode;

@Local
public interface ErmProductVersionService {

	/**
	 * Gets the ErmProductVersion with the RigthStrands attached to it.
	 * In addition it will get the comments (if there are any) associated with the product version
	 * and set them in the object. 
	 * @param ermProductVersionId
	 * @return
	 */
	public ErmProductVersion findById(@NotNull Long ermProductVersionId);

	
	public ErmNode<? extends ProductVersionBase> getMovieTVProductVersions(Long foxVersionId);
	
	public ErmNode<? extends ProductVersionBase> getMovieTVProductVersions(Long foxVersionId,String userId,boolean searchFoxipedia);	
	
	/**
	 * 
	 * @return
	 */
	public ErmNode<Media> loadMediaTree();
	
	
	public ErmProductVersionHeader findHeaderByFoxVersionId(Long foxVersionId);
	
	public ErmProductVersion createNewErmProductVersion(Long foxVersionId, String userName);
	
	public ErmProductVersion findOrCreateNewProductVersion(Long foxVersionId, String userName);	
	
	public ErmRightStrandSet copyStrandSet(Long strandSetId, Long foxVersionId, String userName);
	
}
