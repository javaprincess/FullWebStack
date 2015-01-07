package com.fox.it.erm.rest;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.SQLException;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.EJB;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.FormParam;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;

import com.fox.it.erm.Document;
import com.fox.it.erm.EntityAttachment;
import com.fox.it.erm.ErmException;
import com.fox.it.erm.enums.DocumentContentType;
import com.fox.it.erm.enums.EntityAttachmentType;
import com.fox.it.erm.enums.EntityType;
import com.fox.it.erm.service.AttachmentsService;
import com.fox.it.erm.service.ClearanceMemoService;
import com.fox.it.erm.service.DocumentsUrlProvider;
import com.fox.it.erm.service.comments.CommentsService;
import com.fox.it.erm.service.impl.ErmDocumentsUrlProvider;

@Path("/pdfgen")
public class PDFGeneratorRESTService extends RESTService {
	private static final Logger logger = Logger.getLogger(PDFGeneratorRESTService.class.getName());
	
	@EJB
	private ClearanceMemoService clearanceMemoService;
	
	@EJB
	private CommentsService commentService;
	
	@EJB
	private AttachmentsService attachmentsService;
	
	/**
	 * Returns the comments associated with a particular version id
	 * @return
	 */
	@GET
	@Produces(MediaType.APPLICATION_JSON)
	@Path("/getBaselineVersions/{foxVersionId: \\d+}")
	public List<EntityAttachment> findAttachments(@PathParam("foxVersionId") Long foxVersionId) {
		List<EntityAttachment> attachments = attachmentsService.findEntityAttachmentsForEntityTypeAndId(EntityType.PRODUCT_VERSION.getId().longValue(), foxVersionId, EntityAttachmentType.CLEARANCE_MEMO_VERSION.getId());
		return attachments;
	}
	
	/**
	 * Gets all the fox entities
	 * @return
	 */
	@GET  
	@Produces("application/pdf")
	@Path("/getBaselinePDF/{documentId: \\d+}/{title}")
	public Response doGetBaselinePDF(@PathParam("documentId") final Long documentId, @PathParam("title") final String title) 
			throws ServletException, IOException {						    	    	
		StreamingOutput stream = new StreamingOutput() {
			@Override
			public void write(OutputStream os) throws IOException,
			WebApplicationException {
				try {
				  attachmentsService.getDocumentContent(documentId, os);
				} catch (SQLException e) {
				  e.printStackTrace();
				  logger.log(Level.SEVERE,"Error generating baseline pdf: ",e);
				  throw getValidationException(e.getMessage());
				}							
			}
		};			 
		return Response.ok(stream).build();				
	} 	
	
	private ErmDocumentsUrlProvider getDocumentsUrlProvider(String baseUrl, String fullyQualifiedUrl) {
		return new ErmDocumentsUrlProvider(baseUrl, fullyQualifiedUrl);
	}
	
	/**
	 * Gets all the fox entities
	 * @return
	 */
	@POST
	@Path("/createBaselinePDF/{foxVersionId: \\d+}")
	public void doCreateBaselinePDF(@Context HttpServletRequest request, @PathParam("foxVersionId") Long foxVersionId,@FormParam("baselineTitle") String baselineTitle, @FormParam("isFoxipediaSearch") boolean isFoxipediaSearch) 
			throws ServletException, IOException {		
	  String userId = getUserId(request);
	  boolean isBusiness = isBusiness(request);
      String filePath = "";
      InputStream cssStream = null;	
      CloseableHttpClient cssclient = null;
      try {    	
        logger.log(Level.SEVERE, request.getScheme() + "://" + request.getServerName() + ":" + request.getLocalPort() + request.getContextPath() + "/css/clearance-report-pdf.css");
    	String qualifiedURLPrefix = request.getScheme() + "://" + request.getServerName() + ":" + request.getLocalPort() + request.getContextPath();
    	String cssURL = qualifiedURLPrefix + "/css/clearance-report-pdf.css";               
    	String fullyQualifiedURL = request.getRequestURL().toString(); 
    	HttpGet cssGet = new HttpGet(cssURL);           
      	cssclient = HttpClients.createDefault();
      	HttpResponse cssresponse = cssclient.execute(cssGet);        	
      	HttpEntity cssEntity = cssresponse.getEntity();
      	cssStream = cssEntity.getContent();
      	DocumentsUrlProvider documentsUrlProvider = getDocumentsUrlProvider(qualifiedURLPrefix, fullyQualifiedURL);
	    filePath = clearanceMemoService.generatePDF(cssStream, foxVersionId, documentsUrlProvider,userId,isFoxipediaSearch);
	    if (filePath != null && !filePath.equalsIgnoreCase("")) {
		    String[] tokens = filePath.split("/");
//		    String baselineTitle = request.getParameter("baselineTitle");
			String fileName = baselineTitle != null ? baselineTitle + (baselineTitle.indexOf(".pdf") <= 0 ? ".pdf" : "") : tokens[tokens.length-1];
			fileName = fileName.replaceAll("\"", "").replaceAll(" ", "_");		
		    Document document = new Document();
		    document.setDocumentName(fileName);
			document.setDocumentTypeId(DocumentContentType.APP_PDF.getId());		
			attachmentsService.addNewDocument(EntityType.PRODUCT_VERSION.getId().longValue(), foxVersionId, EntityAttachmentType.CLEARANCE_MEMO_VERSION.getId(), document, filePath, userId, isBusiness);		
			String fileUploadLocation = attachmentsService.getUploadFileLocation();
			File f = new File(fileUploadLocation);
			delete(f, fileUploadLocation);
	    } else {
	    	logger.log(Level.SEVERE,"Error generating baseline pdf: filePath is null or blank");
	    	throw new ErmException("Error generating baseline pdf");
	    }
      } catch (IOException e) {
	    logger.log(Level.SEVERE, "Excepton ", e);
      } catch (ErmException e) {
		logger.log(Level.SEVERE,"Error generating baseline pdf: ",e);
		throw getErmException(e);
      }
  }
	
  /**
	 * Returns the HTML Version of the Clearance Memo / Clearance Report
	 * @return
	 */
  @GET  
  @Produces(MediaType.TEXT_HTML)
  @Path("/SystemXComments/{foxVersionId: \\d+}/{printOnLoad}/{grantCodeId: \\d+}")
  public String getCommentsHTML(@Context final HttpServletRequest request, 
		  @PathParam("foxVersionId") Long foxVersionId,
		  @PathParam("printOnLoad") boolean printOnLoad,
		  @PathParam("grantCodeId") Long grantCodeId) throws ServletException, IOException {
	  String qualifiedURLPrefix = request.getScheme() + "://" + request.getServerName() + ":" + request.getLocalPort() + request.getContextPath();
	  String fullyQualifiedURL = request.getRequestURL().toString(); 
	  return commentService.getCommentsHTML(foxVersionId, grantCodeId, printOnLoad, false, qualifiedURLPrefix, fullyQualifiedURL);	  
  }
  
  /**
	 * Gets all the fox entities
	 * @return
	 */
	@GET  
	@Produces("application/pdf")
	@Path("/commentsPDF/{foxVersionId: \\d+}/{grantCodeId: \\d+}/{title}")
	public Response getCommentsPDF(@Context final HttpServletRequest request, @PathParam("foxVersionId") final Long foxVersionId, 
			@PathParam("grantCodeId") final Long grantCodeId, @PathParam("title") final String title) throws ServletException, IOException {						    	    	
		StreamingOutput stream = new StreamingOutput() {
			@Override
			public void write(OutputStream os) throws IOException,
			WebApplicationException {
				try {
				  String qualifiedURLPrefix = request.getScheme() + "://" + request.getServerName() + ":" + request.getLocalPort() + request.getContextPath();
				  String cssURL = qualifiedURLPrefix + "/css/comments-html.css";
				  String fullyQualifiedURL = request.getRequestURL().toString(); 
				  InputStream cssStream = null;	                 
				  HttpGet cssGet = new HttpGet(cssURL);           
				  CloseableHttpClient cssclient = HttpClients.createDefault();
				  HttpResponse cssresponse = cssclient.execute(cssGet);        	
				  HttpEntity cssEntity = cssresponse.getEntity();
				  cssStream = cssEntity.getContent();
				  commentService.generatePDFOutputStream(cssStream, os, foxVersionId, grantCodeId, qualifiedURLPrefix, fullyQualifiedURL);
				} catch (Exception e) {
				  e.printStackTrace();
				  logger.log(Level.SEVERE,"Error generating baseline pdf: ",e);
				  throw getValidationException(e.getMessage());
				}							
			}
		};			 
		return Response.ok(stream).build();				
	}
	
  /**
	 * Returns the HTML Version of the Clearance Memo / Clearance Report
	 * @return
	 */
  @GET  
  @Produces(MediaType.TEXT_HTML)
  @Path("/SystemXClearanceMemo/{foxVersionId: \\d+}")
  public String getClearanceMemoHTML(@Context final HttpServletRequest request, @PathParam("foxVersionId") Long foxVersionId,@QueryParam("isFoxipediaSearch") boolean isFoxipediaSearch) throws ServletException, IOException {
	  String qualifiedURLPrefix = request.getScheme() + "://" + request.getServerName() + ":" + request.getLocalPort() + request.getContextPath();
	  String fullyQualifiedURL = request.getRequestURL().toString();
	  String userId = getUserId(request);
	  DocumentsUrlProvider documentsUrlProvider = getDocumentsUrlProvider(qualifiedURLPrefix, fullyQualifiedURL);
	  return clearanceMemoService.getClearanceReportHTML(foxVersionId, true, true, false, false, documentsUrlProvider,userId,isFoxipediaSearch);
  }
	
  /**
	 * Returns the HTML Version of the Clearance Memo / Clearance Report
	 * @return
	 */
  @GET  
  @Produces(MediaType.TEXT_HTML)
  @Path("/clearanceHTML/{foxVersionId: \\d+}/{isClearanceMemo}/{includeTOC}/{printOnLoad}/{title}")
  public String getClearanceMemoHTML(@Context final HttpServletRequest request, 
		  @PathParam("foxVersionId") Long foxVersionId, 
		  @PathParam("isClearanceMemo") boolean isClearanceMemo,
		  @PathParam("includeTOC") boolean includeTOC, 
		  @PathParam("printOnLoad") boolean printOnLoad,
		  @PathParam("title") final String title,
		  @QueryParam("isFoxipediaSearch") boolean isFoxipediaSearch) throws ServletException, IOException {
	  String userId = getUserId(request);
	  String qualifiedURLPrefix = request.getScheme() + "://" + request.getServerName() + ":" + request.getLocalPort() + request.getContextPath();
	  String fullyQualifiedURL = request.getRequestURL().toString(); 
	  DocumentsUrlProvider documentsUrlProvider = getDocumentsUrlProvider(qualifiedURLPrefix, fullyQualifiedURL);
	  return clearanceMemoService.getClearanceReportHTML(foxVersionId, isClearanceMemo, includeTOC, printOnLoad, false, documentsUrlProvider,userId,isFoxipediaSearch);
  }
  
  /**
	 * Gets all the fox entities
	 * @return
	 */
	@GET  
	@Produces("application/pdf")
	@Path("/clearancePDF/{foxVersionId: \\d+}/{isClearanceMemo}/{title}")
	public Response getClearancePDF(@Context final HttpServletRequest request, @PathParam("foxVersionId") final Long foxVersionId, 
			  @PathParam("isClearanceMemo") final boolean isClearanceMemo, @PathParam("title") final String title,@QueryParam("isFoxipediaSearch")final  boolean isFoxipediaSearch) throws ServletException, IOException {						    	    	
		StreamingOutput stream = new StreamingOutput() {
			@Override
			public void write(OutputStream os) throws IOException,
			WebApplicationException {
				try {
				  String userId = getUserId(request);
				  String qualifiedURLPrefix = request.getScheme() + "://" + request.getServerName() + ":" + request.getLocalPort() + request.getContextPath();
				  String cssURL = qualifiedURLPrefix + (isClearanceMemo ? "/css/clearance-memo-pdf.css" : "/css/clearance-report-pdf.css");
				  String fullyQualifiedURL = request.getRequestURL().toString(); 
				  DocumentsUrlProvider documentsUrlProvider = getDocumentsUrlProvider(qualifiedURLPrefix, fullyQualifiedURL);
				  InputStream cssStream = null;	                 
				  HttpGet cssGet = new HttpGet(cssURL);           
				  CloseableHttpClient cssclient = HttpClients.createDefault();
				  HttpResponse cssresponse = cssclient.execute(cssGet);        	
				  HttpEntity cssEntity = cssresponse.getEntity();
				  cssStream = cssEntity.getContent();
				  clearanceMemoService.generatePDFOutputStream(cssStream, os, foxVersionId, isClearanceMemo, documentsUrlProvider,userId,isFoxipediaSearch);	
				} catch (Exception e) {
				  e.printStackTrace();
				  logger.log(Level.SEVERE,"Error generating baseline pdf: ",e);
				  throw getValidationException(e.getMessage());
				}							
			}
		};			 
		return Response.ok(stream).build();				
	}
	
	void delete(File f, String fileUploadLocation) throws IOException {
	  if (f.isDirectory()) {
	    for (File c : f.listFiles())
	      delete(c, fileUploadLocation);
	  }
	  logger.log(Level.SEVERE,"Deleting f.getAbsolutePath() : " + f.getAbsolutePath().replaceAll("\\\\", "/") + " file name " + fileUploadLocation);
	  if (!f.getAbsolutePath().replaceAll("\\\\", "/").equalsIgnoreCase(fileUploadLocation)) {	  
	    if (!f.delete())
	      logger.log(Level.SEVERE, "Failed to delete file: "  + f);
	  }
	}
  
}
