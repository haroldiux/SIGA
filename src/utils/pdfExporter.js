/**
 * Utilidad para exportar datos a PDF usando jsPDF
 * Requiere: npm install jspdf jspdf-autotable
 */

// import jsPDF from 'jspdf';
// import 'jspdf-autotable';

/**
 * Exportar tabla a PDF
 */
export const exportTableToPDF = (data, columns, title, filename = 'reporte.pdf') => {
  // SIMULADO - Descomentar cuando se instale jsPDF
  console.log('Exportando a PDF:', { data, columns, title, filename });
  
  // const doc = new jsPDF();
  
  // // Logo y encabezado
  // doc.setFontSize(18);
  // doc.text(title, 14, 22);
  
  // doc.setFontSize(11);
  // doc.setTextColor(100);
  // doc.text(`Generado: ${new Date().toLocaleDateString()}`, 14, 30);
  
  // // Tabla
  // doc.autoTable({
  //   head: [columns.map(col => col.label)],
  //   body: data.map(row => columns.map(col => row[col.field])),
  //   startY: 35,
  //   styles: { fontSize: 9 },
  //   headStyles: { fillColor: [25, 118, 210] },
  // });
  
  // // Pie de página
  // const pageCount = doc.internal.getNumberOfPages();
  // for (let i = 1; i <= pageCount; i++) {
  //   doc.setPage(i);
  //   doc.setFontSize(8);
  //   doc.text(
  //     `Página ${i} de ${pageCount}`,
  //     doc.internal.pageSize.getWidth() / 2,
  //     doc.internal.pageSize.getHeight() - 10,
  //     { align: 'center' }
  //   );
  // }
  
  // doc.save(filename);

  // Simulación
  alert(`PDF "${filename}" generado (simulado). Instalar jsPDF para funcionalidad real.`);
  return Promise.resolve({ success: true });
};

/**
 * Exportar orden de compra a PDF
 */
export const exportOrdenCompraPDF = (orden, filename = 'orden_compra.pdf') => {
  console.log('Exportando orden de compra:', orden);
  
  // const doc = new jsPDF();
  
  // // Encabezado
  // doc.setFontSize(20);
  // doc.text('ORDEN DE COMPRA', 105, 20, { align: 'center' });
  
  // doc.setFontSize(12);
  // doc.text(`No. ${orden.codigo}`, 105, 28, { align: 'center' });
  
  // // Información del proveedor
  // doc.setFontSize(11);
  // doc.text('Proveedor:', 14, 45);
  // doc.setFont(undefined, 'bold');
  // doc.text(orden.proveedor, 14, 52);
  // doc.setFont(undefined, 'normal');
  
  // // Tabla de items
  // doc.autoTable({
  //   head: [['Item', 'Cantidad', 'Precio Unit.', 'Subtotal']],
  //   body: orden.items.map(item => [
  //     item.nombre,
  //     item.cantidad,
  //     `Bs. ${item.precioUnitario.toFixed(2)}`,
  //     `Bs. ${item.subtotal.toFixed(2)}`
  //   ]),
  //   startY: 60,
  //   styles: { fontSize: 9 },
  //   headStyles: { fillColor: [25, 118, 210] },
  // });
  
  // // Totales
  // const finalY = doc.lastAutoTable.finalY + 10;
  // doc.text(`Subtotal: Bs. ${orden.subtotal.toFixed(2)}`, 150, finalY);
  // doc.text(`IVA (13%): Bs. ${orden.iva.toFixed(2)}`, 150, finalY + 7);
  // doc.setFont(undefined, 'bold');
  // doc.text(`TOTAL: Bs. ${orden.total.toFixed(2)}`, 150, finalY + 14);
  
  // doc.save(filename);

  alert(`Orden de compra "${filename}" generada (simulado)`);
  return Promise.resolve({ success: true });
};

/**
 * Exportar kardex a PDF
 */
export const exportKardexPDF = (item, movimientos, filename = 'kardex.pdf') => {
  console.log('Exportando kardex:', { item, movimientos });
  
  alert(`Kardex "${filename}" generado (simulado)`);
  return Promise.resolve({ success: true });
};
