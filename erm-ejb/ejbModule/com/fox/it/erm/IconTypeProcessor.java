package com.fox.it.erm;

public class IconTypeProcessor {
	public static String getIconType(ErmUpdatable updatable) {
		String s = "";
		if (updatable.isBusiness()) s+="B";		
		if (updatable.isLegal()) s+="L";
		return s;
	}
}
