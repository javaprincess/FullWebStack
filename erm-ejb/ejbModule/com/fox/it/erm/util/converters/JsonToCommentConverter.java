package com.fox.it.erm.util.converters;

import javax.inject.Inject;

import com.fox.it.erm.comments.Comment;
import com.fox.it.erm.service.JsonService;
import com.fox.it.erm.service.impl.JsonToObjectConverterBase;

public class JsonToCommentConverter extends JsonToObjectConverterBase<Comment> {

		@Inject
		public JsonToCommentConverter(JsonService jsonService) {
			super(jsonService,Comment.class);
		}
}
