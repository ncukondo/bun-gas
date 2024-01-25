// Entry file for GAS

// You can import modules from local or npm
import { calc } from "./module-sample";

const constantValueSample = "sample";

/**!
 * appendToRow
 * @param row
 */
const appendToRow = (row: string[]) => {
  const sheet = SpreadsheetApp.getActiveSheet();
  sheet.appendRow(row);
};

// all exports in entry file will be exposed as global variable
// You can access these functions from GAS editor
// You can export function or constant value
export { appendToRow, calc, constantValueSample };
