package com.fox.it.erm.util;

import com.fox.it.erm.ErmException;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.ColumnText;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfPageEventHelper;
import com.itextpdf.text.pdf.PdfTemplate;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.tool.xml.XMLWorkerHelper;

import java.io.*;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.logging.Level;
import java.util.logging.Logger;


public class PDFRender {	
	private static final Logger logger = Logger.getLogger(PDFRender.class.getName()); 
	
	/** Inner class to add a header and a footer. */
	public class HeaderFooter extends PdfPageEventHelper {  
        /** Current page number (will be reset for every chapter). */
        int pagenumber;
        /** Alternating phrase for the header. */
        Phrase[] header = new Phrase[2];
        private PdfTemplate totalPages;
        private float headerTextSize = 8f;
        private boolean isClearanceMemo = false;
        private String headerText = "Clearance Memo";
        private String fullyQualifiedURL = "";
        
        public HeaderFooter(String headerText, boolean isClearanceMemo, String fullyQualifiedURL) {
        	this.isClearanceMemo = isClearanceMemo;
        	this.fullyQualifiedURL = fullyQualifiedURL;
        	this.headerText = headerText;
        }

		@Override
        public void onOpenDocument(PdfWriter writer, Document document) {
            totalPages = writer.getDirectContent().createTemplate(100, 100);    
            totalPages.setBoundingBox(new Rectangle(-20, -20, 100, 100));
        }
        
        /**
         * Initialize one of the headers, based on the chapter title;
         * reset the page number.
         * @see com.itextpdf.text.pdf.PdfPageEventHelper#onChapter(
         *      com.itextpdf.text.pdf.PdfWriter, com.itextpdf.text.Document, float,
         *      com.itextpdf.text.Paragraph)
         */
        public void onChapter(PdfWriter writer, Document document,
                float paragraphPosition, Paragraph title) {
            header[1] = new Phrase(title.getContent());
            pagenumber = 1;
        }
 
        /**
         * Increase the page number.
         * @see com.itextpdf.text.pdf.PdfPageEventHelper#onStartPage(
         *      com.itextpdf.text.pdf.PdfWriter, com.itextpdf.text.Document)
         */
        public void onStartPage(PdfWriter writer, Document document) {
            pagenumber++;
        }
                
        public void onCloseDocument(PdfWriter writer, Document document) {                        	        	        	        	
			try {								
            	totalPages.beginText();
				totalPages.setFontAndSize(BaseFont.createFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED), headerTextSize);
				totalPages.setTextMatrix(0, 0);				
	            totalPages.showText(String.valueOf(writer.getPageNumber() - 1));
	            totalPages.endText();   	           
			} catch (DocumentException | IOException e) {
				e.printStackTrace();
				System.err.println("onCloseDocument exception ");
			}
        }
 
        /**
         * Adds the header and the footer.
         * @see com.itextpdf.text.pdf.PdfPageEventHelper#onEndPage(
         *      com.itextpdf.text.pdf.PdfWriter, com.itextpdf.text.Document)
         */
        public void onEndPage(PdfWriter writer, Document document) {            
			try {						
	            if (isClearanceMemo) {
					String text = String.format("Page %s of ", writer.getPageNumber());
		            BaseFont bf = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
					float textSize = bf.getWidthPoint(text, headerTextSize);
					float textBase = document.top() + 20;
		            PdfContentByte cb = writer.getDirectContent();		            
		            cb.saveState();
		            cb.beginText(); 		            
		            cb.setFontAndSize(bf, headerTextSize);
		            cb.setTextMatrix(document.right() - textSize, textBase);
		            cb.showText(text);
		            cb.addTemplate(totalPages, document.right(), textBase);
		            cb.endText();
		            cb.restoreState();
		            
		            PdfContentByte clearanceContent = writer.getDirectContent();
		            clearanceContent.saveState();
		            clearanceContent.setFontAndSize(bf, headerTextSize);
		            clearanceContent.beginText();
		            clearanceContent.setTextMatrix(document.left(), textBase);
		            clearanceContent.showText(headerText);
		            clearanceContent.endText();
		            clearanceContent.restoreState();
		            
		            Date today = Calendar.getInstance().getTime(); 		            
		            SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy");
		            String todaysDate = formatter.format(today);
		            textSize = bf.getWidthPoint(todaysDate, headerTextSize);
		            textBase = document.bottom() - 20;
		            		            
		            PdfContentByte dateContent = writer.getDirectContent();
		            dateContent.saveState();
		            dateContent.setFontAndSize(bf, headerTextSize);
		            dateContent.beginText();
		            dateContent.setTextMatrix(document.right() - textSize, textBase);
		            dateContent.showText(todaysDate);	
		            dateContent.endText();
		            dateContent.restoreState();
		            logger.info("date update " + todaysDate);  		        
		            
		            PdfContentByte urlContent = writer.getDirectContent();
		            urlContent.saveState();
		            urlContent.setFontAndSize(bf, headerTextSize);
		            urlContent.beginText();
		            urlContent.setTextMatrix(document.left(), textBase);
		            urlContent.showText(fullyQualifiedURL);	
		            urlContent.endText();
		            urlContent.restoreState();
		            		            
	            } else {
	            	Rectangle rect = writer.getBoxSize("art");
	                ColumnText.showTextAligned(writer.getDirectContent(),
	                        Element.ALIGN_CENTER, new Phrase(String.format("-%d-", pagenumber)),
	                        (rect.getLeft() + rect.getRight()) / 2, rect.getBottom() - 40, 0);
	            }
	            //ColumnText.showTextAligned(clearanceContent, Element.ALIGN_LEFT, new Phrase(), rect.getLeft(), textBase, 0);	            
			} catch (DocumentException e) {
				e.printStackTrace();
			} catch (IOException e) {
				e.printStackTrace();
			}
           
        }
    }
    
	private static String getFileName(String path, Long foxVersionId, String fileName, String extension) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd_hhmmaa", Locale.US);
		return path + "/" + fileName + "_" + foxVersionId + "_" +  sdf.format(new Date()) + "." + extension;		
	}
    
    public String createPDF(String path, InputStream htmlInputStream, InputStream cssInputStream, String fileName, Long foxVersionId, String headerText, boolean isClearanceMemo, String fullyQualifiedURL)
            throws ErmException {
    	Document doc = new Document();
    	doc = new Document(PageSize.A4,30,25,25,25);
    	logger.info("Inside createPDF");		    	
		String saveFileName = getFileName(path, foxVersionId, fileName, "pdf");
        try {
        	//String outputPDF = "c:/aws/erm/clearance-memo-parse/clearance-report.pdf";
        	//System.err.println("outputPDF: " + outputPDF);
        	logger.info("saveFileName: " + saveFileName);
        	File file = new File(saveFileName);
        	FileOutputStream outFile = new FileOutputStream(file);
        	PdfWriter writer = PdfWriter.getInstance(doc, outFile);
        	writer.setPageEvent(new HeaderFooter(headerText, isClearanceMemo, fullyQualifiedURL));
        	writer.setBoxSize("art", new Rectangle(36, 54, 559, 788));
        	writer.setPdfVersion(PdfWriter.VERSION_1_7);
        	writer.setInitialLeading(12.5f);
	        doc.open();
	        XMLWorkerHelper.getInstance().parseXHtml(writer, doc, htmlInputStream, cssInputStream);	        
	        doc.close();
        } catch (IOException e) {
          saveFileName = null;
          logger.log(Level.SEVERE,"IOException: ", e);
		  throw new ErmException(e);
		} catch (DocumentException e) {
		  saveFileName = null;
		  logger.log(Level.SEVERE,"DocumentException: ", e);
		  throw new ErmException(e);
		}
        return saveFileName;
    }
    
    /**
     * Writes the content of a PDF file (using iText API)
     * to the {@link OutputStream}.
     * @param outputStream {@link OutputStream}.
     * @throws Exception
     */
    public void writePdfToOutputStream(OutputStream outputStream, InputStream htmlInputStream, InputStream cssInputStream, String headerText, boolean isClearanceMemo, String fullyQualifiedURL) throws Exception {
    	Document document = new Document();
    	document = new Document(PageSize.A4,30,25,40,25);
    	logger.info("Starting writePdfToOtuputStream");		    	        
        PdfWriter writer = PdfWriter.getInstance(document, outputStream);
    	writer.setPageEvent(new HeaderFooter(headerText, isClearanceMemo,fullyQualifiedURL));
    	writer.setBoxSize("art", new Rectangle(36, 54, 559, 788));
    	writer.setInitialLeading(12.5f);
    	writer.setPdfVersion(PdfWriter.VERSION_1_7);
    	document.open();
        XMLWorkerHelper.getInstance().parseXHtml(writer, document, htmlInputStream, cssInputStream);
        logger.info("Done parsing document for PDF");	        
        document.close();	
    }
    

}
