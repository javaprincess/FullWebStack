package com.fox.it.erm.util;

import java.util.Date;

import com.fox.it.erm.comments.Comment;
import com.fox.it.erm.service.comments.CommentsService;
import com.fox.it.erm.service.comments.CustomHTMLCleaner;

public class CommentCleanner {

	public CommentCleanner() {

	}
	
	public static String cleanHTML(String s) {
		if (s==null||s.isEmpty()) return s;
		s = s.replaceAll("<>", "").replaceAll("</body>", "").
		  replaceAll("<body>", "").replaceAll("</head>", "").replaceAll("<head>", "").replaceAll("\\t", "").
		  replaceAll("\\n", "").replaceAll("</>", "").replaceAll("<html>", "").replaceAll("</html>","");
		return s;
	}
	
	public static String getTitleIfCommentEmpty(String title, String comment) {
		if (title!=null&&!title.trim().isEmpty()) {
			return title;
		}
		String cleaned = cleanHTML(comment);	
		if(cleaned!=null&&cleaned.length() > CommentsService.COMMENT_SUBJECT_DEFAULT_LENGTH)
		  title = cleaned.substring(0, CommentsService.COMMENT_SUBJECT_DEFAULT_LENGTH) + "...";
		else
		  title = cleaned;
		return title;	
	}
	
	public static Comment getComment(String title,String text,String userId, boolean isBusiness) {
		Date now = new Date();
		Comment comment = new Comment();				
		String cleanedString = CustomHTMLCleaner.CleanHTML(StringUtil.unescapeHTML(text));
		if (cleanedString != null) {
		  comment.setLongDescription(cleanedString);
		}
		title = CommentCleanner.getTitleIfCommentEmpty(title, text);
		comment.setShortDescription(title);
//		if(comment.getLongDescription() != null && (title == null || StringUtils.isEmptyString(title))){
//			title = comment.getLongDescription().replaceAll("<>", "").replaceAll("</body>", "").
//					  replaceAll("<body>", "").replaceAll("</head>", "").replaceAll("<head>", "").replaceAll("\\t", "").
//					  replaceAll("\\n", "").replaceAll("</>", "").replaceAll("<html>", "").replaceAll("</html>","");						  
//			if(title.length() > CommentsService.COMMENT_SUBJECT_DEFAULT_LENGTH)
//			  comment.setShortDescription(title.substring(0, CommentsService.COMMENT_SUBJECT_DEFAULT_LENGTH) + "...");
//			else
//			  comment.setShortDescription(title);
//		}			
		UpdatableProcessor.setUserIdAndTypeIndicator(comment, userId, isBusiness,!isBusiness, now);
		return comment;		
	}

}
