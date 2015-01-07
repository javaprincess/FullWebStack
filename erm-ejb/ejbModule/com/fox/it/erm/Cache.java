package com.fox.it.erm;

import java.util.Date;

/**
 * Utility class to determine if all the cached values need to be refreshed
 * @author AndreasM
 *
 */
public class Cache {
	private static  boolean shouldRefresh = false;
	private static Date date;
	private static boolean shouldRefrehsServer = false;
	private static Date dateServer; 
	
	public Cache() {

	}
	
	public static void invalidate() {
		date = new Date();
		shouldRefresh = true;
	}
	
	
	
	public static Date getDate() {
		return date;
	}

	public static void setDate(Date date) {
		Cache.date = date;
	}

	public static Date getDateServer() {
		return dateServer;
	}

	public static void setDateServer(Date dateServer) {
		Cache.dateServer = dateServer;
	}

	public static void clearRefresh() {
		shouldRefresh = false;
	}
	
	public static boolean shouldRefresh() {
		return shouldRefresh;
	}
	

	public static void invalidateServer() {
		dateServer = new Date();
		shouldRefrehsServer = true;
	}
	
	public static void clearRefreshServer() {
		shouldRefrehsServer = false;
	}
	
	public static boolean shouldRefreshServer() {
		return shouldRefrehsServer;
	}
	

}
