package com.fox.it.erm.service.comments.attachments;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class DBAttachmentReader {

	private final Connection conn;
	private int blockSize = 1024 *4;
	
	private String sql  = "SELECT DOC_CONTENT FROM  DOCUMENT WHERE  DOC_ID = ?";
	
	public DBAttachmentReader(Connection conn) {
		this.conn = conn;
	}
	
	private void transfer(InputStream i, OutputStream o) throws IOException {
		int bytesRead = 0;
		byte bytes[] = new byte[blockSize];
//		int position = 0;
		while ((bytesRead = i.read(bytes))!=-1) {
			o.write(bytes, 0, bytesRead);
//			position+=bytesRead;
			o.flush();
		}
	}
	
	public void write(Long documentId, OutputStream out) throws SQLException, IOException{
		PreparedStatement stmnt = conn.prepareStatement(sql);
		stmnt.setLong(1, documentId);
		ResultSet rs = stmnt.executeQuery();
		if (rs.next()) {
			Blob b = rs.getBlob(1);			
			InputStream in = b.getBinaryStream();	
			transfer(in, out);
		}
	}

}
