package com.fox.it.erm.service.comments;



import org.htmlcleaner.CleanerProperties;
import org.htmlcleaner.CompactHtmlSerializer;
import org.htmlcleaner.HtmlCleaner;
import org.htmlcleaner.HtmlSerializer;
import org.htmlcleaner.TagNode;

public class CustomHTMLCleaner {
//	private static final Logger logger = Logger.getLogger(CustomHTMLCleaner.class.getName());

	
	private static HtmlSerializer getSerializer(CleanerProperties props) {
        //new PrettyHtmlSerializer(props)
		//Do not chnage to pretty serializer as it will add new lines and later we replace new lines with "" therefor loosing spaces
		HtmlSerializer serializer = new CompactHtmlSerializer(props);
		return serializer;
	}
	
	public static String CleanHTML(String s) {
		if (s == null)
		  return s;
		CleanerProperties props = new CleanerProperties();
		props.setOmitXmlDeclaration(true);
		props.setOmitHtmlEnvelope(true);
		props.setOmitUnknownTags(true);
		//props.setPruneTags("st1:country-region,st1:placetype,st1:place,st1:placename,st1:country-region");
		HtmlCleaner cleaner = new HtmlCleaner(props);
		TagNode cleanNode = cleaner.clean(s);
		HtmlSerializer serializer = getSerializer(props);		
		String formatedstring = serializer.getAsString(cleanNode);		
		if (formatedstring != null) {
			formatedstring = formatedstring.replaceAll("<st1:.*?>", "<span>").replaceAll("</st1:.*?>", "</span>").replaceAll("¶", "").replaceAll("\n","").replaceAll("  ", "&nbsp;&nbsp;");		
		}
		return formatedstring;
	}
}

