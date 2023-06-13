import * as XLSX from 'xlsx';

const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
}

export const handleDownload = (header, dataset, filename) => {
    const newWorkbook = XLSX.utils.book_new();
    const newWorksheet = XLSX.utils.aoa_to_sheet([header, ...dataset]);
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Sheet 1');
    const excelData = XLSX.write(newWorkbook, { type: 'binary', bookType: 'xlsx' });
    const blobData = new Blob([s2ab(excelData)], { type: 'application/octet-stream' });
    const downloadUrl = URL.createObjectURL(blobData);
    const downloadLink = document.createElement('a');
    downloadLink.href = downloadUrl;
    downloadLink.download = filename || 'algo.xlsx';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

export const handleDownloadMany = (sheetsData, filename) => {
    const newWorkbook = XLSX.utils.book_new();
    sheetsData.forEach(sheetData => {
      const { header, dataset, sheetName } = sheetData;
      const newWorksheet = XLSX.utils.aoa_to_sheet([header, ...dataset]);
      XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);
    });
    const excelData = XLSX.write(newWorkbook, { type: 'binary', bookType: 'xlsx' });
    const blobData = new Blob([s2ab(excelData)], { type: 'application/octet-stream' });
    const downloadUrl = URL.createObjectURL(blobData);
    const downloadLink = document.createElement('a');
    downloadLink.href = downloadUrl;
    downloadLink.download = filename || 'algo.xlsx';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };