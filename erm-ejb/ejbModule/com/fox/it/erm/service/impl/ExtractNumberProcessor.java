package com.fox.it.erm.service.impl;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Replaces the extract numbers from the text 
 * @author AndreasM
 *
 */
public class ExtractNumberProcessor {
	private static final  String regExp = "\\([x|X]+\\w+[,*[\\s|\\-]*[x|X]*\\w*]*[,*\\s*[x|X]*\\w*]*\\)";
	private static final Pattern pattern = Pattern.compile(regExp);	
	public ExtractNumberProcessor() {

	}

	
	public String replaceExtractNumber(String content,boolean isClearanceMemo) {
		  if (content != null && !content.equalsIgnoreCase("")) {
			  Matcher matcher = pattern.matcher(content);	  
			  StringBuffer stringBuffer = new StringBuffer();
			  int matchedCount = 0;
			  while(matcher.find()){
				if (!isClearanceMemo)
				  matcher.appendReplacement(stringBuffer, "<span class=\"extractnumber\">" + matcher.group(matchedCount) + "</span>");
				else
				  matcher.appendReplacement(stringBuffer, "");
			  }
			  matcher.appendTail(stringBuffer);
			  return stringBuffer.toString();
		  }
		  return content;		  
	}
	

}
