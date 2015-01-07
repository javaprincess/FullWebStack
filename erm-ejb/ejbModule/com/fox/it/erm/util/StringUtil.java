package com.fox.it.erm.util;

import java.util.HashMap;

public class StringUtil {

	public StringUtil() {
	}
	
	public static HashMap<String, String> htmlEntities = new HashMap<String, String>();
	static {
		htmlEntities = new HashMap<String,String>();
	    htmlEntities.put("&lt;","<")    ; htmlEntities.put("&gt;",">");
	    htmlEntities.put("&amp;","&")   ; htmlEntities.put("&quot;","\"");
	    htmlEntities.put("&agrave;","�"); htmlEntities.put("&Agrave;","�");
	    htmlEntities.put("&acirc;","�") ; htmlEntities.put("&auml;","�");
	    htmlEntities.put("&Auml;","�")  ; htmlEntities.put("&Acirc;","�");
	    htmlEntities.put("&aring;","�") ; htmlEntities.put("&Aring;","�");
	    htmlEntities.put("&aelig;","�") ; htmlEntities.put("&AElig;","�" );
	    htmlEntities.put("&ccedil;","�"); htmlEntities.put("&Ccedil;","�");
	    htmlEntities.put("&eacute;","�"); htmlEntities.put("&Eacute;","�" );
	    htmlEntities.put("&egrave;","�"); htmlEntities.put("&Egrave;","�");
	    htmlEntities.put("&ecirc;","�") ; htmlEntities.put("&Ecirc;","�");
	    htmlEntities.put("&euml;","�")  ; htmlEntities.put("&Euml;","�");
	    htmlEntities.put("&iuml;","�")  ; htmlEntities.put("&Iuml;","�");
	    htmlEntities.put("&ocirc;","�") ; htmlEntities.put("&Ocirc;","�");
	    htmlEntities.put("&ouml;","�")  ; htmlEntities.put("&Ouml;","�");
	    htmlEntities.put("&oslash;","�") ; htmlEntities.put("&Oslash;","�");
	    htmlEntities.put("&szlig;","�") ; htmlEntities.put("&ugrave;","�");
	    htmlEntities.put("&Ugrave;","�"); htmlEntities.put("&ucirc;","�");
	    htmlEntities.put("&Ucirc;","�") ; htmlEntities.put("&uuml;","�");
	    htmlEntities.put("&Uuml;","�")  ; htmlEntities.put("&nbsp;"," ");
	    htmlEntities.put("&copy;","\u00a9");
	    htmlEntities.put("&reg;","\u00ae");
	    htmlEntities.put("&euro;","\u20a0");
	}
		
	public static final String unescapeHTML(String source) {
      int i, j;

      boolean continueLoop;
      int skip = 0;
      do {
         continueLoop = false;
         i = source.indexOf("&", skip);
         if (i > -1) {
           j = source.indexOf(";", i);
           if (j > i) {
             String entityToLookFor = source.substring(i, j + 1);
             String value = (String) htmlEntities.get(entityToLookFor);
             if (value != null) {
               source = source.substring(0, i)
                        + value + source.substring(j + 1);
               continueLoop = true;
             }
             else if (value == null){
                skip = i+1;
                continueLoop = true;
             }
           }
         }
      } while (continueLoop);
      return source;
  }
	
	public static boolean isEmptyOrWhitespace(String s){
		return  (s==null||s.trim().length()==0);		
	}
	

}
