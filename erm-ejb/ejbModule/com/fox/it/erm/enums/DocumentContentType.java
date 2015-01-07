package com.fox.it.erm.enums;

public enum DocumentContentType {
	OCTET_STREAM(1l,"application/octet-stream"),
	TEXT_HTML(2l,"text/html"),
	TEXT_PLAIN(3l,"text/plain"),
	APP_DOCUMENT(4l,"application/msword"),
	APP_MSWORD(5l,"application/msword"),
	APP_MSEXCEL(6l,"application/vnd.ms-excel"),
	APP_PDF(7l,"application/pdf"),
	APP_SHEET(8l,"application/xml"),
	APP_JPG(9l,"image/jpeg"),
	APP_PNG(10l,"image/png"),
	APP_GIF(11l,"image/gif");
	
	private final Long id;
	private final String ouputType;
	
	private DocumentContentType(Long id,String outputType) {
		this.id = id;
		this.ouputType = outputType;
	}
	
	
	public Long getId() {
		return id;
	}
	
	public String getOutputType() {
		return ouputType;
	}
	
	public static DocumentContentType get(Long id) {
		for (DocumentContentType d: values()) {
			if (d.id.equals(id)) {
				return d;
			}
		}
		return null;
	}
}
