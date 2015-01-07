package com.fox.it.erm.util;

import javax.persistence.PersistenceException;

import org.eclipse.persistence.exceptions.DatabaseException;

import weblogic.transaction.TimedOutException;

import com.fox.it.erm.ErmException;
import com.fox.it.erm.ErmValidationException;
import com.google.common.base.Throwables;

public class ExceptionUtil {
	public static final Integer ERM_ERROR_CODE = 20010;
	
	private boolean isValidationException(String message) {
		if (message==null) return false;
		return message.contains(ERM_ERROR_CODE.toString());
	}
	
	private Exception getValidationException(Exception e) {
		Throwable root = Throwables.getRootCause(e);
		String message = root.getMessage();
		if (isValidationException(message))  {
			return (Exception) root;
		}
		return null;
	}
	
	private ErmValidationException getErmValidationFromRootCause(Exception e) {
		String message = e.getMessage();
		return new ErmValidationException(message);
	}
	
	private ErmException getExceptionFromPersistenceException(Exception e) {
		Exception validationException = getValidationException(e);
		if (validationException!=null) {
			return getErmValidationFromRootCause(validationException);
		}
		return new ErmException(e.getMessage(),e);
	}
	
	public ErmException getErmException(Exception e) {
		if (e instanceof PersistenceException || e instanceof DatabaseException || e instanceof TimedOutException) {
			return getExceptionFromPersistenceException(e);
		}
		Throwable current = e;
		while (current!=null) {
			Throwable cause = current.getCause();
			if (cause!=null && (cause instanceof PersistenceException ||cause instanceof DatabaseException || e instanceof TimedOutException)) {
				return getErmException((Exception)cause);
			}
			current = cause;
		}
		return new ErmException(e.getMessage(),e) ;
	}
	
	public static String getMesage(Exception e) {
		if (e.getMessage()==null) {
			return e.toString();
		} 
		return e.getMessage();
	}
}
