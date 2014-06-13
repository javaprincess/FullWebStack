package com.fox.it.erm.reports.test;

import java.util.UUID;

import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import com.fox.it.erm.reports.connection.ConnectionService;

public class ConnectionHandlerTest {
	
	ConnectionService cH = new ConnectionService();
	
	@Test
	public void insert() {
		String token = UUID.randomUUID().toString().replaceAll("-", "");
		//cH.connect(token, "TRACYADE", 231931584L);
		
	}

}
