import * as jspdfAutoTable from 'jspdf-autotable';

export const initAutoTable = async () => {
  // Load the jspdf-autotable library dynamically
  const jspdfAutoTableModule = await import('jspdf-autotable');

  // Get the autoTable function from the loaded module
  const autoTable = jspdfAutoTableModule.default;

  return autoTable;
};