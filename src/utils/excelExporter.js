/**
 * Utilidad para exportar datos a Excel usando xlsx
 * Requiere: npm install xlsx
 */

// import * as XLSX from 'xlsx';

/**
 * Exportar tabla a Excel
 */
export const exportTableToExcel = (data, columns, sheetName = 'Datos', filename = 'reporte.xlsx') => {
  // SIMULADO - Descomentar cuando se instale xlsx
  console.log('Exportando a Excel:', { data, columns, sheetName, filename });
  
  // // Preparar datos
  // const headers = columns.map(col => col.label);
  // const rows = data.map(row => columns.map(col => row[col.field]));
  
  // // Crear worksheet
  // const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  
  // // Ajustar ancho de columnas
  // const colWidths = columns.map(col => ({
  //   wch: Math.max(col.label.length, 15)
  // }));
  // ws['!cols'] = colWidths;
  
  // // Crear workbook
  // const wb = XLSX.utils.book_new();
  // XLSX.utils.book_append_sheet(wb, ws, sheetName);
  
  // // Descargar
  // XLSX.writeFile(wb, filename);

  alert(`Excel "${filename}" generado (simulado). Instalar xlsx para funcionalidad real.`);
  return Promise.resolve({ success: true });
};

/**
 * Exportar múltiples hojas a Excel
 */
export const exportMultipleSheets = (sheets) => {
  console.log('Exportando múltiples hojas:', sheets);
  
  // const wb = XLSX.utils.book_new();
  
  // sheets.forEach(sheet => {
  //   const headers = sheet.columns.map(col => col.label);
  //   const rows = sheet.data.map(row => sheet.columns.map(col => row[col.field]));
  //   const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  //   XLSX.utils.book_append_sheet(wb, ws, sheet.name);
  // });
  
  // XLSX.writeFile(wb, filename);

  alert(`Excel con ${sheets.length} hojas generado (simulado)`);
  return Promise.resolve({ success: true });
};

/**
 * Exportar inventario completo a Excel
 */
export const exportInventarioToExcel = (inventario, filename = 'inventario.xlsx') => {
  console.log('Exportando inventario:', inventario);
  
  // const columns = [
  //   { field: 'codigo', label: 'Código' },
  //   { field: 'nombre', label: 'Nombre' },
  //   { field: 'categoria', label: 'Categoría' },
  //   { field: 'ubicacion', label: 'Ubicación' },
  //   { field: 'cantidad', label: 'Cantidad' },
  //   { field: 'unidad', label: 'Unidad' },
  //   { field: 'precioUnitario', label: 'Precio Unit.' },
  //   { field: 'valorTotal', label: 'Valor Total' },
  // ];
  
  // return exportTableToExcel(inventario, columns, 'Inventario', filename);

  alert(`Inventario exportado a "${filename}" (simulado)`);
  return Promise.resolve({ success: true });
};

/**
 * Exportar kardex a Excel
 */
export const exportKardexToExcel = (item, movimientos, filename = 'kardex.xlsx') => {
  console.log('Exportando kardex:', { item, movimientos });
  
  // const columns = [
  //   { field: 'fecha', label: 'Fecha' },
  //   { field: 'tipo', label: 'Tipo' },
  //   { field: 'documento', label: 'Documento' },
  //   { field: 'entrada', label: 'Entrada' },
  //   { field: 'salida', label: 'Salida' },
  //   { field: 'saldo', label: 'Saldo' },
  // ];
  
  // return exportTableToExcel(movimientos, columns, `Kardex - ${item.nombre}`, filename);

  alert(`Kardex exportado a "${filename}" (simulado)`);
  return Promise.resolve({ success: true });
};
