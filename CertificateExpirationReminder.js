function emailReminderAlert() {

  // getting data from spreadsheet
   var sheet = SpreadsheetApp.getActive().getSheetByName('Sheet1');
   var startRow = 2; // Ignore the cloumn hedings and freezed rows
   var numRows = sheet.getLastRow() - 1; // Get the last number of row that has content with excluding header rows
   var numColumns = sheet.getLastColumn(); // Get the last number of column that has content.

  //Get data range dynamically
  var dataRange = sheet.getRange(startRow, 1, numRows, numColumns);
  var data = dataRange.getValues();

  for (var i = 0; i < data.length; ++i) {
    var row = data[i];
    //console.log(row[3]);
    var today = new Date(), // today's date
    exp_date = row[5] // exp date

    var cert_details = 
        {
          domain_name:row[0],
          cert_provider_name:row[1],
          account: row[2],
          cert_manager:row[3],
          cert_manager_email:row[4]
        };

    //Remove the time part from the date
    var t2 = new Date(exp_date);
    t2.setHours(0,0,0,0);
    var t1 = new Date(today);
    t1.setHours(0,0,0,0);

    //Calculate the ms difference between two date
    var difference_ms = Math.abs(t2.getTime() - t1.getTime());
    // 24*3600*1000 is milliseconds in a day
    var days_left = Math.round(difference_ms/(24*3600*1000));
    
    //Put the days_left to cert_details array
    cert_details.days_left = days_left;
    
    if (days_left == 3) {
      console.log(cert_details.domain_name+" expired in 3 days");
      sendEmail(cert_details);
    }
    else if (days_left == 7) {
      console.log(cert_details.domain_name+" expired in 7 days");
      sendEmail(cert_details);
    }
    else if (days_left == 30) {
      console.log(cert_details.domain_name+" expired in 30 days");
      sendEmail(cert_details);
    }
  }
}

function sendEmail(cert_details){

  //Get the html email template
  var templ = HtmlService.createTemplateFromFile('EmailTemplate');
  templ.cert_details = cert_details;
  
  var message = templ.evaluate().getContent();
  
  MailApp.sendEmail({
    to: cert_details.cert_manager_email,
    subject: "Your "+cert_details.cert_provider_name+" certificate expires in " + cert_details.days_left + " days",
    htmlBody: message
  });
  
}
