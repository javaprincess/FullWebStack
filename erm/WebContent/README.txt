This file will contain any relevant notes about the code.

AMV 6/2/2014. There are multiple HTML elements with the same id that might cause issues as $("#<the id>") returns the first one it seems.
Multiple "errorPragraph" elements exist

There are also multiple times where the templates are being rendered. There should be a common function for that

There is a div called test2_addEditInfoCodeWindow, it should not be callled test2_XXXX

errorPopup.init() in renderTemplates happens twice. If you remove the first then the errors don't show. Why?


I added a method called renderTemplates in MainController. This method gets called in the rightsController, every time the product changes. Ideally it shold be called in the MainController only once  