package com.fox.it.erm;

import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

/**
 * This is a class that continas Google Analytics util methods to obtain the key
 * The google account is erm.fox@gmail.com
 * Note: The environment is encoded in a JVM environment variable in the startup script.
 * The name of the environment is: ERM_ENV and the possible values are PROD, C1, S1,etc
 * @author AndreasM
 *
 */
public class GA {

	
	public static final String ENVIRONMENT_VAR_NAME = "ERM_ENV";
	private static final Map<String,String> envToKey = new HashMap<>();
	private static final Logger logger = Logger.getLogger(GA.class.getName());

	static {
		envToKey.put("C1","UA-51788300-2");
		envToKey.put("PROD","UA-51788300-1");
	}
	
	public GA() {
	}
	
	public static String get(String env) {
		logger.info("Getting Google Analytics key for env: " + env);
		if (env==null) return null;
		return envToKey.get(env);
	}
	
	private static String getFromEnvVariable(String variableName) {
		String value = System.getenv(variableName);
		return get(value);
	}
	
	public static String getFromEnvVariable() {
		return getFromEnvVariable(ENVIRONMENT_VAR_NAME);
	}
	
	public static String get() {
		return getFromEnvVariable();
	}

}
