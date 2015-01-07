package com.fox.it.erm.rest;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

public class UnauthorizedException extends WebApplicationException {
	private static final long serialVersionUID = 1L;
	private static final String  message= "User is not authorized to perform operation.";
	
	public UnauthorizedException() {
		this(message);
	}

	public UnauthorizedException(String message) {
		this(Response.status(Status.UNAUTHORIZED).entity(message).build());
	}
	
	public UnauthorizedException(Response response) {
		super(response);
	}

	public UnauthorizedException(int status) {
		super(status);
	}

	public UnauthorizedException(Status status) {
		super(status);
	}

	public UnauthorizedException(Throwable cause) {
		super(cause);
	}

	public UnauthorizedException(Throwable cause, Response response) {
		super(cause, response);
	}

	public UnauthorizedException(Throwable cause, int status) {
		super(cause, status);
	}

	public UnauthorizedException(Throwable cause, Status status) {
		super(cause, status);
	}

}
