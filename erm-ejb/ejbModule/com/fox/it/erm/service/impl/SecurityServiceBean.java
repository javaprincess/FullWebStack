package com.fox.it.erm.service.impl;

import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.validation.constraints.NotNull;

import com.fox.it.erm.Privilege;
import com.fox.it.erm.Properties;
import com.fox.it.erm.SystemSecKey;
import com.fox.it.erm.User;
import com.fox.it.erm.service.SecurityService;

@Stateless
public class SecurityServiceBean extends ServiceBase implements SecurityService {
	private Logger logger = Logger.getLogger(SecurityServiceBean.class.getName());
	
	private static final String SYSTEM_ID_PROPETY="security.system_id";

//	private static final String privilegesSQL = "select r. role_id||'-'||p.priv_id||'-'||f.FUNC_PT_ID as id, ur.user_id, ur.role_id, r.role_desc, rp.*, fp.*, p.priv_desc, f.func_pt_nm From " +
//			"edm_sec_role r,edm_sec_Role_priv rp,edm_sec_Role_priv_func_Pt fp,edm_sec_priv p,edm_Sec_func_pt f,edm_sec_user_role ur " +
//			"where " +
//			"ur.user_id  = ?  and " +
//			"ur.role_id (+) = r.role_id and " +
//			"r.role_Id = rp.role_id (+) and " +
//			"r.system_id(+)=?  and " +
//			"rp.status_cd(+)='A' and " +
//			"fp.priv_id (+)= rp.priv_id and " +
//			"fp.role_id (+)= rp.role_id and " +
//			"rp.priv_id  = p.priv_id (+) and " +
//			"f.func_pt_id (+) =fp.func_pt_id ";

//	private static final String privilegesSQL_old = "select r. role_id||'-'||p.priv_id||'-'||f.FUNC_PT_ID as id, ur.user_id,  r.role_desc,  fp.*, p.priv_desc, f.func_pt_nm From edm_sec_role r, edm_sec_Role_priv_func_Pt fp, edm_sec_priv p, " +
//												"edm_Sec_func_pt f," +
//												"edm_sec_user_role ur " +
//												"where " +
//												"ur.user_id  = ?  and " +
//												"ur.role_id  = r.role_id and " +
//												"r.role_Id = fp.role_id  and " +
//												"r.system_id =?  and " +
//												"fp.status_cd='A' and " +
//												"fp.priv_id = p.priv_id and " +
//												"f.func_pt_id =fp.func_pt_id";


	private static final String privilegesSQL = "select r. role_id||'-'||p.priv_id||'-'||f.FUNC_PT_ID as id, ur.user_id,  r.role_desc,  fp.*, p.priv_desc, f.func_pt_nm From edm_sec_role r, edm_sec_Role_priv_func_Pt fp, edm_sec_priv p, " +
			"edm_Sec_func_pt f," +
			"edm_sec_user_role ur " +
			"where " +
			"ur.user_id  = ?  and " +
			"ur.role_id  = r.role_id and " +
			"r.role_Id = fp.role_id (+) and " +
			"r.system_id  =?  and " +
			"fp.status_cd(+)='A' and " +
			"fp.priv_id = p.priv_id (+) and " +
			"f.func_pt_id (+)=fp.func_pt_id";
	
	
	@Inject
	private EntityManager em;
	

	private Logger getLogger(){
		return logger;
	}
	
	/**
	 * Fetch the system id from the properties table
	 * @return
	 */
	private Long getSystemId() {
		
		Properties properties = em.find(Properties.class, SYSTEM_ID_PROPETY);
		if (properties==null) {
			String message = "No property found in properties table for: " + SYSTEM_ID_PROPETY + ". Please contact erm admin";
			getLogger().log(Level.SEVERE,message);
			throw new RuntimeException(message);
		}
		return properties.getLongValue();
		
	}
	
	
	
	private List<Privilege> getPrivileges(Long userId,Long systemId) {
		@SuppressWarnings("unchecked")
		TypedQuery<Privilege>  query = ((TypedQuery<Privilege>) em.createNativeQuery(privilegesSQL,Privilege.class));
		query.setParameter(1, userId);
		query.setParameter(2, systemId);
		return query.getResultList();
	}
	
	/**
	 * Makes a dummy query just to ensure that we have connectivity to db
	 */
	private void makeDummyQuery() {
		getLogger().info("making dummy query");
		String sql = "select 1 from dual";
		em.createNativeQuery(sql).getSingleResult();
		getLogger().info("dummy query returned");		
	}
	
	@Override
	public User get(@NotNull String userId) {
		getLogger().info("Getting user " + userId);
		makeDummyQuery();
		UserSearchCriteria criteria = new UserSearchCriteria(em);
		criteria.setUserId(userId);
		User user = criteria.getSingleResult();
		if (user==null)  {
			getLogger().info("Unable to find user with id " + userId);
			return null;
		}
		List<Privilege> privileges = getPrivileges(user.getId(), getSystemId());
		user.setPrivileges(privileges);
		return user;
	}
	
	@Override
	public SystemSecKey getSystemSecKeyBySystemName(String systemName) {
		SystemSecKeySearchCriteria criteria = new SystemSecKeySearchCriteria(em).setName(systemName);
		List<SystemSecKey> keys = criteria.getResultList();
		if (keys==null||keys.isEmpty()) {
			return null;
		}
		return keys.get(0);
	}
	

}
