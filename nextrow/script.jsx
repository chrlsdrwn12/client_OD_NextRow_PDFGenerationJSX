/*
Copyright 2017 NextRow Inc.
www.NextRow.com
All rights reserved

Developer: Darwin Lopena (info@darwinlopena.com).
Date: Nov 23, 2017
Custom JSX script file for automatically importing xml and producing a print pdf
*/

//Dummy folder for demo purposes only.
var dummyFolder = new Folder("c:/nextrow/");

//The following block of code is from the original script of Ankit
var exportFolder = new Folder(dummyFolder + "/tmp-" + (new Date().getTime() - Math.floor((Math.random()*10000)+1) ));
exportFolder.create();
var indesignTemplateFilePath = new File(dummyFolder + '/template/InDesign-Template_2.indd');
var sourceFile = new File(dummyFolder + '/source/tempContent.xml');
var outputFile = new File(exportFolder.fullName + '/generatedTempPDF.pdf');
app.consoleout("Created a temp folder -->"+exportFolder.fullName);

//Open the InDesign Template
var sourceTemplateDoc = app.open( indesignTemplateFilePath );

//Set import preferences - please refer to the 2 function at the bottom to check how it works.
setXMLPrefs(sourceTemplateDoc);

//Import xml
sourceTemplateDoc.importXML(sourceFile);
app.consoleout("<--Import was done fine -->");

//Export to PDF
sourceTemplateDoc.exportFile(ExportFormat.pdfType, outputFile);
app.consoleout('<-- Created a new PDF using Indesign Server -->'+outputFile);

//Always close the InDesign file you opened.
sourceTemplateDoc.close();




//Functions for XML Import Preferences
function setXMLPrefs(myDoc){
    var xsltemplate;

    //Filter the xsl file function
    if(myDoc.filePath.getFiles(filterXSLFile).length > 0){
        xsltemplate = myDoc.filePath.getFiles(filterXSLFile)[0];
    }
    else{
        app.consoleout('<-- WARNING: Can not find XSL Template! -->'+outputFile);
    }
    //Set the preferences
    with(myDoc.xmlImportPreferences){
        importStyle = XMLImportStyles.MERGE_IMPORT;
        createLinkToXML = false;
        repeatTextElements = true;
        ignoreUnmatchedIncoming = false;
        importTextIntoTables = true;
        ignoreWhitespace = false;
        removeUnmatchedExisting = false;
        importCALSTables = true;
        allowTransform = true;
        transformFilename = File(xsltemplate); //Here's where we are going to path the xsl file
    }
}

//Check the path of the InDesign template and get the xsl file on the same folder as the template.
function filterXSLFile(targetFile){
    var strExt = targetFile.fullName.toLowerCase().substr(targetFile.fullName.lastIndexOf("."));
    return strExt == ".xsl";
}