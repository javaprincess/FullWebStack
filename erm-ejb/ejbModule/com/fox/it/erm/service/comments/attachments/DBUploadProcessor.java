package com.fox.it.erm.service.comments.attachments;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;






public class DBUploadProcessor implements UploadProcessor{

	private static final Logger logger = Logger.getLogger(DBUploadProcessor.class.getName());
	
//	private static final String sql = "SELECT DOC_CONTENT FROM  DOCUMENT WHERE  DOC_ID = ? FOR UPDATE";
	
	private static final String updateEmptyBlob = "update DOCUMENT set doc_content=empty_blob() where DOC_ID = ? ";
	
	private static final String updateBlob = "update DOCUMENT set doc_content=? where DOC_ID = ?";
	
	private static final String isEmptyBlob = "Select 1 from document where doc_content is null and doc_id =?";
	
	private final Connection conn;
	
	public DBUploadProcessor(Connection conn) {
		this.conn = conn;
	}
	
	private boolean isNullBlob(Long documentId) throws SQLException {
		PreparedStatement stmnt = null;
		ResultSet rs = null;
		try {
		stmnt = conn.prepareStatement(isEmptyBlob);
		stmnt.setLong(1, documentId);
		rs = stmnt.executeQuery();
		if (rs.next()) {
			return true;
		}
		return false;
		} finally {
			if (stmnt!=null) {
				stmnt.close();
			}
			if (rs!=null) {
				rs.close();
			}
		}
		
	}
	
	private int updateEmptyBlob(Long documentId) throws SQLException{
		PreparedStatement stmnt = null;
		try {
		stmnt = conn.prepareStatement(updateEmptyBlob);
		stmnt.setLong(1, documentId);
		int rowsUpdated = stmnt.executeUpdate();
		return rowsUpdated;
		} finally {
			if (stmnt!=null) {
				stmnt.close();
			}
		}
	}

	public int writeBLOBNativeOracleConnection(InputStream inputStream, Long documentId) throws SQLException{

		PreparedStatement stmnt = null;
//		byte[] binaryBuffer;
//		long position;
//		int chunkSize = 0,
//			bytesRead = 0,
//			bytesWritten = 0;

		try {
			if (isNullBlob(documentId)) {
				updateEmptyBlob(documentId);
			}
			
//			Blob b = conn.createBlob();
			
			stmnt = conn.prepareStatement(updateBlob);
			
			stmnt.setBlob(1, inputStream);
//			stmnt.setBlob(1, b);
			stmnt.setLong(2, documentId);

/*			
//			stmnt = conn.prepareStatement(sql);
//			stmnt.setLong(1, documentId);
//			ResultSet rs = stmnt.executeQuery();
//			
//			if ( rs.next() ) {
//				Blob b = rs.getBlob(1);
				OutputStream s = b.setBinaryStream(1);
//				BLOB blob = ((OracleResultSet) rs).getBLOB(1);
//				chunkSize = blob.getChunkSize();
//				chunkSize = chunkSize * 8;
				chunkSize = 1024 * 4; //arbitrary size 4k;
				binaryBuffer = new byte[chunkSize];
				position = 1;
	
	
				while ((bytesRead = inputStream.read(binaryBuffer)) != -1) {
//					bytesWritten = blob.setBytes(position, binaryBuffer, 0, bytesRead);
					s.write(binaryBuffer,(int)position, bytesRead);
					position += bytesRead;
					s.flush();					
//					logger.info("Bytes writen " + bytesWritten);
				}


//			} 
*/
			
			@SuppressWarnings("unused")
			int updatedRows = stmnt.executeUpdate();
			inputStream.close();

			
//			rs.close();
			stmnt.close();
		} catch (IOException e) {
			logger.log(Level.SEVERE,"IO Exception writing the blob", e);
		} catch (SQLException e) {
			logger.log(Level.SEVERE,"SQL Exception writing the blob", e);
		}
		
//		return new Long(position).intValue();
		return 0;
	}
	
	
	@Override
	public int upload(String fileName,Long documentId) throws IOException, UploadException {
		FileInputStream inputStream = new FileInputStream(fileName);
		try {
			return writeBLOBNativeOracleConnection(inputStream, documentId);
		} catch (SQLException e) {
			String message = "Error uploading file " + fileName + " to documentId=" + documentId;
			logger.log(Level.SEVERE,message ,e);
			return 0;
		} finally {
		  inputStream.close();
		}
		
	}

}
