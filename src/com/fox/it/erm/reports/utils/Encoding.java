package com.fox.it.erm.reports.utils;
import org.apache.commons.codec.binary.Base64;

//*************************************************************************
//CLASS : Encoding
//Purpose : This class is used to encode the String provided in  Base64 
//Function: encodeBase64
//*************************************************************************
//Date 							Author							Version
//12th Jan 2014					Amit Kumar Sharma				1.0
//*************************************************************************
public class Encoding {

	// *************************************************************************
	// Function : encodeBase64
	// Purpose : This function is used to decode the String provided in encoded
	// Base64 format to String
	// input : String to be encoded
	// output : encoded output
	// *************************************************************************
	public String encodeBase64(String value) {

		// encode and return
		return new String(Base64.encodeBase64(value.getBytes()));

	}

}
