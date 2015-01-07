package com.fox.it.erm.service.impl;

import java.util.List;
import java.util.logging.Logger;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.Query;

import com.fox.it.erm.UserSession;

public class TempTableContextSetter implements DBContextSetter {
	private final static Logger logger = Logger.getLogger(TempTableContextSetter.class.getName());
	private EntityManager em;
	
	@Inject
	private TempTableContextSetter(EntityManager em) {
		this.em=em;
	}
	
	private Logger getLogger() {
		return logger;
	}
	
	@Override
	public void set(String userId, Boolean isBusiness) {
		UserSession session = new UserSession(userId,isBusiness);		
		set(session);
	}
	
//	private int update(UserSession session) {
//		String sql = "update TMP_USR_SESSION set USR_TYP=? where USR_NM=?";
//		Query query = em.createNativeQuery(sql);
//		query.setParameter(1, session.getUserType());
//		query.setParameter(2, session.getUserId());
//		int updated = query.executeUpdate();
//		return updated;
//	}
	
	private int createWithConfidential(UserSession session) {
		String sql = "insert into TMP_USR_SESSION(USR_NM,USR_TYP,FXP_SRC) values (?,?,?)";
		Query query = em.createNativeQuery(sql);
		query.setParameter(1, session.getUserId());
		query.setParameter(2, session.getUserType());
		query.setParameter(3, session.getFoxipediaSearch());
		int updated = query.executeUpdate();
		return updated;				
	}
	
	private int create(UserSession session) {
		if (session.isFoxipediaSearch()) {
			return createWithConfidential(session);
		}
		String sql = "insert into TMP_USR_SESSION(USR_NM,USR_TYP) values (?,?)";
		Query query = em.createNativeQuery(sql);
		query.setParameter(1, session.getUserId());
		query.setParameter(2, session.getUserType());
		int updated = query.executeUpdate();
		return updated;		
	}
	
	private void delete() {
		String sql = "delete TMP_USR_SESSION";
		Query query = em.createNativeQuery(sql);
		query.executeUpdate();				
	}
	
	private String toString(List<UserSession> userSessions) {
		StringBuilder builder = new StringBuilder();
		boolean first = true;
		for (UserSession userSession: userSessions) {
			builder.append(userSession.toString());
			if (first) builder.append("\n");
			first = false;
		}
		return builder.toString();
	}
	
	private void debug() {
		UserSessionSearchCriteria criteria = new UserSessionSearchCriteria(em);
		List<UserSession> existing = criteria.getResultList();
		getLogger().info("UserSession contains: " + toString(existing));
	}
	
	
	private void set(UserSession session) {
		delete();
		create(session);
		em.flush();
		//TODO remove
		//this is just for DEV
		debug();
		
	}
		

	@Override
	public void set(String userId, String userType) {
		UserSession session = new UserSession(userId,userType);
		set(session);
	}
	
	@Override
	public void set(String userId, String userType,boolean isConfidential) {
		UserSession session = new UserSession(userId,userType);
		session.setIsFoxipediaSearch(isConfidential);
		set(session);
	}

	@Override
	public void set(String userId, Boolean isBusiness,
			boolean isConfidentialAccess) {
		UserSession session = new UserSession(userId,isBusiness);
		session.setIsFoxipediaSearch(isConfidentialAccess);
		set(session);
	}
	
	@Override
	public void clear() {
		delete();
	}
	
	

}
