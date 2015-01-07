package com.fox.it.erm.service.impl;

import java.util.logging.Logger;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.Query;

import com.fox.it.erm.service.BitmapUpdater;

/**
 * Updates the bitmaps of all the product version and the dependent versions by calling
 * RIGHT_BITMAPS.SET_BITMAPS_FOR_RGHT_STRND_UPD(?,?,?) 
 * @author AndreasM
 *
 */
public class BitmapUpdaterImpl implements BitmapUpdater {

//	private static final String PROCEDURE_NAME = "RIGHT_BITMAPS.SET_BITMAPS_FOR_RGHT_STRND_UPD(?,?,?)";
	private static final String SUMMARY_BITMAP_PROCEDURE = "RIGHT_BITMAPS.SET_SMRY_BITMAPS_FOR_PROD_VER(?, ?) ";
	
	private static final Logger logger = Logger.getLogger(BitmapUpdaterImpl.class.getName());
	
	private EntityManager em;
	
	@Inject
	public BitmapUpdaterImpl(EntityManager em) {
		this.em =em;
	}

	private Logger getLogger() {
		return logger;
	}
	
//	@Override
//	public void updateBitmap(Long foxVersionId, Date updateTimestamp,
//			String userId) {
//		Query query = em.createNativeQuery("call " + PROCEDURE_NAME);
//		query.setParameter(1, foxVersionId);
//		query.setParameter(2, new java.sql.Date(updateTimestamp.getTime()));
//		getLogger().info("updating bitmaps for  " + foxVersionId + " and userId: " + userId);
//		long t0 = System.currentTimeMillis();
//		query.setParameter(3, userId.toUpperCase());
//		query.executeUpdate();
//		long t1 = System.currentTimeMillis();
//		getLogger().info("Done updating bitmaps in " + (t1-t0) + " ms");
//
//	}
	
	public void setSummaryBitmap(Long foxVersionId, String userId){
		Query query = em.createNativeQuery("call " + SUMMARY_BITMAP_PROCEDURE);
		query.setParameter(1, foxVersionId);
		query.setParameter(2, userId.toUpperCase());
		long t0 = System.currentTimeMillis();
		query.executeUpdate();
		long t1 = System.currentTimeMillis();
		getLogger().info("Done execuing SUMMARY_BITMAP in " + (t1-t0) + " ms");
	}

}
