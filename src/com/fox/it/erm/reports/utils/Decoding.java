package com.fox.it.erm.reports.utils;
import org.apache.commons.codec.binary.Base64;

//*************************************************************************
//CLASS : Decoding
//Purpose : This class is used to decode the String provided in encoded Base64 format to String
//Function: decodeBase64
//*************************************************************************
//Date 							Author							Version
//12th Jan 2014					Amit Kumar Sharma				1.0
//*************************************************************************
public class Decoding {

	// *************************************************************************
	// Function : decodeBase64
	// Purpose : This function is used to decode the String provided in encoded
	// Base64 format to String
	// input : Encoded String
	// output : Decoded output
	// *************************************************************************

	public String decodeBase64(String value) {

		// decode and return
		return new String(Base64.decodeBase64(value.getBytes()));

	}

}
