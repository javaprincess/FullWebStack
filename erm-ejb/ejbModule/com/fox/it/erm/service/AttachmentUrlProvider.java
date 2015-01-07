package com.fox.it.erm.service;

import com.fox.it.erm.EntityAttachment;

public interface AttachmentUrlProvider {
	String get(EntityAttachment attachment);
}
