//   * Copyright 2017 NextRow Inc.
//   * www.NextRow.com
//   * All rights reserved
//   *
//   * Developer : Ankit Gubrani (agubrani@nextrow.com).
//   * Date :   16th July 2017.
//   * Custom JSX script file for sending requests to Indesign server for creating PDF
//==== get soap arguments ====
if (app.scriptArgs.isDefined("credentials")) {
    var credentials = app.scriptArgs.getValue("credentials");
} else {
    throw "CQ host credentials argument is missing";
}
if (app.scriptArgs.isDefined("cqHost")) { 
    var host = app.scriptArgs.getValue("cqHost");
} else {
    throw "cqHost argument is missing";
}
if (app.scriptArgs.isDefined("resource")) { 
    var resourcePath = app.scriptArgs.getValue("resource");
} else {
    throw "resource argument is missing";
}

try {
	var exportFolder = new Folder("tmp-" + (new Date().getTime() - Math.floor((Math.random()*10000)+1) ));
    exportFolder.create();

	var sourceFile = new File(exportFolder.fullName + '/tempContent.xml');
	var sourceTemplateFile = new File(exportFolder.fullName + '/tempIndesignTemplate.indt');
	var outputFile = new File(exportFolder.fullName + '/generatedTempPDF.pdf');
	var indesignTemplateFilePath = "@INDESIGN_TEMPLATE_FILE_AEM_PATH@";

    app.consoleout("Created a temp folder -->"+exportFolder.fullName);

    var isINDTStoredInIndesign = @IS_INDESIGN_TEMPLATE_STORED_ON_INDESIGN_SERVER@;
    app.consoleout("isINDTStoredInIndesign Value =" + isINDTStoredInIndesign);
    if (isINDTStoredInIndesign == 'true') {
        app.consoleout("Picking Indesign template from Indesign server");
        sourceTemplateFile =  new File('@INDESIGN_TEMPLATE_FILE_SERVER_PATH@');
    } else {
        app.consoleout("Picking Indesign template from AEM");
        //Adding a PLACE HOLDER string to be replaced with actual AEM path to Indesign Template file uploaded in AEM.
        fetchResource (host,  credentials, indesignTemplateFilePath, sourceTemplateFile);
    }

    if (!sourceTemplateFile.exists) {
        app.consoleout("no template! Found --> ");
        alert ( "no template!" );
        exit();
    }

    var sourceTemplateDoc = app.open( sourceTemplateFile );  
    //Adding a PLACE HOLDER string to be replaced with actual AEM path of content XML file.
    fetchResource (host,  credentials, "@CONTENT_XML_FILE_PATH@" , sourceFile);
    
    app.consoleout("sourceFile->"+sourceFile);

    var imagesToCopy = @FILE_REFERENCES_TO_COPY_STRING_ARRAY@;

    if (imagesToCopy.length > 0) {
        for (i = 0; i < imagesToCopy.length; i++) {
            var fileNameArray = imagesToCopy[i].split("/");
            var temporaryFile = new File(exportFolder.fullName + '/' + fileNameArray[(fileNameArray.length-1)]);
            fetchResource (host,  credentials, imagesToCopy[i], temporaryFile);
        }
    }

    if(sourceFile.exists){
        //Place the setXMLPrefs(indesignTemplateFilePath); function on this line
        //Please remember to place the xsl file on the same folder as the template.
        //Pass the indesign template document to the function instead of the created temporary indesign file.

        sourceTemplateDoc.importXML(sourceFile);
        app.consoleout("<--Import was done fine -->");

        sourceTemplateDoc.exportFile(ExportFormat.pdfType, outputFile);
        app.consoleout('<-- Created a new PDF using Indesign Server -->'+outputFile);

        putResourceAsAsset (host, credentials,  outputFile, '@PDF_FILE_NAME@.pdf', 'application/pdf', "@DAM_IMPORT_PATH@.createasset.html");
        addUpdatedByProperty(host, credentials, "@ASSET_PATH@.pdf/jcr:content");
        outputFile.remove();
        sourceFile.remove();
        sourceTemplateFile.remove();
    } else {
        app.consoleout('ERROR File not foud! - '+sourceFile);
    }
} catch(e) {
    app.consoleout('Error Occurred : ' + e);
    sendFailureEmail(host, credentials, '', e);
} finally {
     //==== remove the temp folder ====
     cleanup(exportFolder);
}

function setXMLPrefs(myDoc){
    var xsltemplate;
    if(myDoc.filePath.getFiles(filterXSLFile).length > 0){
        xsltemplate = myDoc.filePath.getFiles(filterXSLFile)[0];
    }
    else{
        app.consoleout('<-- WARNING: Can not find XSL Template! -->'+outputFile);
    }
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
        transformFilename = File(xsltemplate);
    }
}

function filterXSLFile(targetFile){
    var strExt = targetFile.fullName.toLowerCase().substr(targetFile.fullName.lastIndexOf("."));
    return strExt == ".xsl";
}