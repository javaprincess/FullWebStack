package com.fox.it.erm.util;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.logging.Logger;

import com.fox.it.erm.enums.DocumentContentType;



public class FileUploadHandler {
	
	
	private static final Logger logger = Logger.getLogger(FileUploadHandler.class.getName());
	
	private final String path;
	
	public FileUploadHandler(String path) {
		this.path = path;
	}
	
	private void writeToFile(InputStream uploadedInputStream,String uploadedFileLocation) throws IOException{
		File uploadedFile = new File(uploadedFileLocation);
		OutputStream out = new FileOutputStream(uploadedFile);
		int read = 0;
		byte[] bytes = new byte[1024];			
		while ((read = uploadedInputStream.read(bytes)) != -1) {
			out.write(bytes, 0, read);
		}
		out.flush();
		out.close();
		out = null;		
		uploadedInputStream.close();
		uploadedInputStream = null;
		System.gc();
		//uploadedFile.delete();
	}
	
	private String getFileName() {
		return path + "/" + "erm_upload" +System.currentTimeMillis();
	}
	
	
	private String getFileName(Long entityId,String extension) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd_hhmmaa", Locale.US);
		return path + "/" + "erm_upload" + "_" + entityId + "_" + sdf.format(new Date()) + "." + extension;		
	}
	
	public String save(Long entityId,String fileName,InputStream input) throws IOException{
		String saveFileName = getFileName(entityId,getExtension(fileName));
		logger.info("saveFileName: " + saveFileName);
		writeToFile(input,saveFileName);
		return saveFileName;		
	}
	
	public String save(InputStream input) throws IOException{
		String fileName = getFileName();
		writeToFile(input,fileName);
		return fileName;
	}
	
	public static long getDocumentContentTypeFromExtension(String extension) {			
		if (extension.contains("bin"))
		  return DocumentContentType.OCTET_STREAM.getId();
		if (extension.contains("txt"))
		  return DocumentContentType.TEXT_PLAIN.getId();
		if (extension.contains("html"))
		  return DocumentContentType.TEXT_HTML.getId();
		if (extension.contains("docx"))
		  return DocumentContentType.APP_DOCUMENT.getId();
		if (extension.contains("doc"))
	      return DocumentContentType.APP_MSWORD.getId();
		if (extension.contains("xsl"))
		  return DocumentContentType.APP_MSWORD.getId();
		if (extension.contains("pdf"))
		  return DocumentContentType.APP_PDF.getId();
		if (extension.contains("jpeg") || extension.contains("jpg"))
		  return DocumentContentType.APP_JPG.getId();	
		if (extension.contains("png"))
		  return DocumentContentType.APP_PNG.getId();
		if (extension.contains("gif"))
		  return DocumentContentType.APP_GIF.getId();
		else // return TEXT_PLAIN as default
		  return DocumentContentType.TEXT_PLAIN.getId();
	}
	
	public static String getExtension(String fileName) {
		if (fileName==null) {
			return null;
		}
		int indexOf = fileName.lastIndexOf(".");
		if (indexOf<0) return null;
		return fileName.substring(indexOf+1);
	}
	
	public static boolean isDocx(String fileName) {
		if (fileName==null) return false;
		return fileName.endsWith(".docx");
	}
}
