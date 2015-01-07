package com.fox.it.erm.rest;

import java.lang.reflect.Type;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.EJB;
import javax.ws.rs.ext.Provider;

import com.fox.it.ejb.provider.ReferencedEJBProvider;
import com.sun.jersey.core.spi.component.ComponentContext;
import com.sun.jersey.core.spi.component.ComponentScope;
import com.sun.jersey.spi.inject.Injectable;
import com.sun.jersey.spi.inject.InjectableProvider;

/**
 * Auxiliary class to inject references annotated with @EJB to jax-rs services (jersey)
 * @author AndreasM
 *
 */
@Provider
public class JaxRsEJBProvider implements InjectableProvider<EJB, Type> {
	
	private static final Logger logger = Logger.getLogger(JaxRsEJBProvider.class.getName());
	
	
	private Logger getLogger() {
		return logger;
	}
	
	@Override
	public Injectable<Object> getInjectable(ComponentContext cc, EJB ejb, Type t) {
		 getLogger().fine("EJBProvider.getInjectable() injecting type ");
		 if (!(t instanceof Class)) return null;
	        try {
	            Class<?> c = (Class<?>)t;
	            getLogger().info("Injecting class name " + c.getName());
 
	            final Object o = ReferencedEJBProvider.get().getService(c);
	            return new Injectable<Object>() {

					@Override
					public Object getValue() {
						return o;
					}
	            };            
	        } catch (Exception e) {
	        	getLogger().log(Level.SEVERE,"Unable to inject EJB ",e);
	            return null;
	        }
	    }	

	@Override
	public ComponentScope getScope() {
		return ComponentScope.Singleton;
	}

}
