const appendToRow = (row: string[]) => {
  const sheet = SpreadsheetApp.getActiveSheet();
  sheet.appendRow(row);
};

export { appendToRow };
