package com.fox.it.erm;

public class ErmValidationException extends ErmException{

	
	private static final long serialVersionUID = 1L;

	public ErmValidationException() {
		super();
	}

	public ErmValidationException(String message, Throwable cause,
			boolean enableSuppression, boolean writableStackTrace) {
		super(message, cause, enableSuppression, writableStackTrace);

	}

	public ErmValidationException(String message, Throwable cause) {
		super(message, cause);

	}

	public ErmValidationException(String message) {
		super(message);

	}

	public ErmValidationException(Throwable cause) {
		super(cause);
	}


}
