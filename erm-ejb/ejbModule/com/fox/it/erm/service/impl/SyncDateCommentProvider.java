package com.fox.it.erm.service.impl;

import java.text.SimpleDateFormat;
import java.util.Date;

import com.fox.it.erm.comments.Comment;
import com.fox.it.erm.util.UpdatableProcessor;

/**
 * Gets the comment for a sync release date operation
 * @author AndreasM
 *
 */
public class SyncDateCommentProvider {


	
	public SyncDateCommentProvider() {
	}
	

	private String toString(Date date) {
		if (date==null) return null;
		SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/yyy");
		return sdf.format(date);
	}
	
	public Comment get(Date originalDate,Date newDate, String userId, boolean isBusiness) {
		Comment comment = new Comment();
		String text = "Sync release date performed at " + new Date() + " by " + userId + " <br/> \n";
		text += "From release date: " + toString(originalDate) + " . To release date:  " + toString(newDate);
		UpdatableProcessor.setUserIdAndTypeIndicator(comment, userId, isBusiness, !isBusiness, new Date());
		comment.setLongDescription(text);
		String shortDescription = "US Release date sync performed";
		comment.setShortDescription(shortDescription);
		return comment;
	}

}
