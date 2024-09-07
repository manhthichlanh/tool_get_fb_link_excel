const fs = require('fs');
const path = require("path");
//***Xuất các sheet ra các csv tương ứng;
const XLSX = require('xlsx');

const excelFilePath = path.join(__dirname, 'MainDataFIle.xlsx');  // Đường dẫn tới file Excel
const outputDir = path.join(__dirname, 'CSV');  // Thư mục đầu ra cho các file CSV

// Đọc file Excel
const workbook = XLSX.readFile(excelFilePath);

// Tạo thư mục đầu ra nếu chưa tồn tại
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

// Lặp qua tất cả các sheet trong workbook
workbook.SheetNames.forEach(sheetName => {
  // Lấy dữ liệu từ sheet
  const worksheet = workbook.Sheets[sheetName];
  const csv = XLSX.utils.sheet_to_csv(worksheet);

  // Tạo tên file CSV từ tên sheet
  const csvFileName = `${sheetName.trim()}.csv`;
  const csvFilePath = path.join(outputDir, csvFileName);

  // Ghi dữ liệu vào file CSV
  if (sheetName !== "TOTAL")
    fs.writeFileSync(csvFilePath, csv);

  console.log(`Đã xuất sheet "${sheetName}" ra thành file CSV: ${csvFilePath}`);
});

console.log('Hoàn thành xuất tất cả các sheet ra file CSV.');