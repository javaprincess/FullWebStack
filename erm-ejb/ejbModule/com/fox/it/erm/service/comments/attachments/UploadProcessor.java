package com.fox.it.erm.service.comments.attachments;

import java.io.IOException;

public interface UploadProcessor {
	int upload(String fileName,Long documentId) throws IOException, UploadException;
}
