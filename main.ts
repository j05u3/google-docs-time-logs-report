function myFunction() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const rowsData = [['Plants', 'Animals'], ['Ficus', 'Goat'], ['Basil', 'Cat'], ['Moss', 'Frog']];
  body.insertParagraph(0, doc.getName())
      .setHeading(DocumentApp.ParagraphHeading.HEADING1);
  const table = body.appendTable(rowsData);
  table.getRow(0).editAsText().setBold(true);
}

function readAllDays() {
  // get all the HEADING2 titles
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  const headings = body.getParagraphs().filter(p => p.getHeading() === DocumentApp.ParagraphHeading.HEADING2);
  const headingsText = headings.map(h => h.getText());
  Logger.log(headingsText);
}