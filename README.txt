IMPORTANT: this project was built to run on WLS 10.3.6.  This version is not as lienent as 12.x.
As such there are some very specific deployment configuration that has gone on in this project:
1. JDK 1.6 is used in the eclipse project
2. the web.xml file has references to 2.5 and not 3.0 for javaee xsd
3. the applicationcontext.xml and reportsServer.properties files are located in the classes
directory of the .war file (BOOOOOO).  There are classloader issues when packaged and deployed in any other way. WLS 12.x
lets you drop the files in the lib directory of the app server.

Note...initially, I didn't want to deploy to the WFserver instance (287/258) but because
we had to implement a security patch which requires userId and queryId to be stored in the session,
I have to be in this server's session.  The war has to be deployed in the same container as the WFServlet
so the session can be shared.

3/21/14 -- Tracy Michelle