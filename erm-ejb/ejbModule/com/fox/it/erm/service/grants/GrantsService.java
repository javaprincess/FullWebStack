/**
 * Does the CRUD operations for the Grants Entity
 * @author Tracy Michelle
 *
 */

package com.fox.it.erm.service.grants;

import java.util.List;

import javax.ejb.Local;

import com.fox.it.erm.ErmException;
import com.fox.it.erm.comments.Comment;
import com.fox.it.erm.grants.GrantCode;
import com.fox.it.erm.grants.ProductGrant;
import com.fox.it.erm.service.xproduct.delete.XProductDeleteSpec;


@Local
public interface GrantsService {
	
	public GrantsProxy findAllProductGrants(Long foxVersionId,
			Long grantCodeId,
			int salesAndmarketingFlag);

	public GrantsProxy findAllCommentsForGrant(Long foxVersionId, Long grantCodeId);
	
	public ProductGrant findById(Long grantId);

	public ProductGrant createGrant(Long foxVersionId, Long grantCodeId,String userId) throws ErmException;	
	
	public ProductGrant findOrCreateProductGrant(Long foxVersionId,Long grantCodeId, String userId) throws ErmException;	
	
	public ProductGrant findProductGrant(Long foxVersionId, Long grantCodeId);	
	
	public List<ProductGrant> findAllGrants(Long foxVersionId, Long grantCodeId);
	
	public List<ProductGrant> findAllPulblicGrants(Long foxVersionId, List<Long> grantCodeIds);
	
	public Long addComment(String userId, Comment comment, Long foxVersionId,Long categoryId, Long grantCodeId, boolean isBusiness) throws ErmException;	
	
	public Long addComment(String json, String userId, Long foxVersionId, Long grantCodeId, Long categoryId, boolean isBusiness) throws ErmException;
	
	public void deleteComment(Long foxVersionId,String json, String userId, boolean isBusiness) throws ErmException;
	
	public void deleteMultipleComments(Long foxVersionId,String json, String userId, boolean isBusiness) throws ErmException;
	
	public void editComment(Comment c, String userId, Long foxVersionId, boolean isBusiness) throws ErmException;
	
	public void addGrantStatus(String json, String userId, boolean isBusiness) throws ErmException;

	public void editGrantStatus(String json, String userId, boolean isBusiness) throws ErmException;

	public void removeGrantStatus(String json, String userId, boolean isBusiness) throws ErmException;

	public void deleteGrantsInBulk(XProductDeleteSpec foxVersionIdList);
	
	public GrantsCodeTableValues getCodeTableVales(); 
	
	public List<GrantCode> findAllGrantCode();
	
	
}
