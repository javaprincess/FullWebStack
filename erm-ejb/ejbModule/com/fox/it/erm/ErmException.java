package com.fox.it.erm;

/**
 * Base ERM exception class
 * @author AndreasM
 *
 */
public class ErmException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public ErmException() {

	}

	public ErmException(String message) {
		super(message);
	}

	public ErmException(Throwable cause) {
		super(cause);
	}

	public ErmException(String message, Throwable cause) {
		super(message, cause);
	}

	public ErmException(String message, Throwable cause,
			boolean enableSuppression, boolean writableStackTrace) {
		super(message, cause, enableSuppression, writableStackTrace);
	}

}
