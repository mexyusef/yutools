import {
  VSCodeBadge,
  VSCodeButton,
  VSCodeDataGrid,
  VSCodeDataGridCell,
  VSCodeDataGridRow,
  VSCodeDivider,
  VSCodeLink,
  VSCodePanels,
  VSCodePanelTab,
  VSCodePanelView,
} from "@vscode/webview-ui-toolkit/react";

function Demo() {
  const rowData = [
    { cell1: "Data 1", cell2: "Data 2", cell3: "Data 3", cell4: "Data 4" },
    { cell1: "Data A", cell2: "Data B", cell3: "Data C", cell4: "Data D" },
  ];

  return (
    <main>
      <h1>VsGent Demo</h1>
      <p>
        This is a demonstration of VsGent's capabilities for creating dynamic and interactive
        extensions in Visual Studio Code.
      </p>
      <VSCodeDataGrid>
        <VSCodeDataGridRow row-type="header">
          <VSCodeDataGridCell>Column 1</VSCodeDataGridCell>
          <VSCodeDataGridCell>Column 2</VSCodeDataGridCell>
          <VSCodeDataGridCell>Column 3</VSCodeDataGridCell>
          <VSCodeDataGridCell>Column 4</VSCodeDataGridCell>
        </VSCodeDataGridRow>
        {rowData.map((row, index) => (
          <VSCodeDataGridRow key={index}>
            <VSCodeDataGridCell>{row.cell1}</VSCodeDataGridCell>
            <VSCodeDataGridCell>{row.cell2}</VSCodeDataGridCell>
            <VSCodeDataGridCell>{row.cell3}</VSCodeDataGridCell>
            <VSCodeDataGridCell>{row.cell4}</VSCodeDataGridCell>
          </VSCodeDataGridRow>
        ))}
      </VSCodeDataGrid>
    </main>
  );
}

export default Demo;
