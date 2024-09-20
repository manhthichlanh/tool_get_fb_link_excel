const fs = require('fs');
const csv = require('csv-parser');
const path = require("path");
//****Xử lý các file csv và xuất ra json
const csvPath = path.join(__dirname,"CSV");

let allResult = [];
// Hàm kiểm tra và sửa URL
function formatUrl(url, fileName,linkColumn) {
  if (!url) return ''; // Nếu không có URL, trả về chuỗi rỗng
  // Thay dấu phẩy bằng dấu chấm
  if (url.includes(linkColumn)) return null;
  let formattedUrl = url.replace(/,/g, '.');
  checkInvalidCharacters(formattedUrl,fileName);
      // Nếu URL không bắt đầu với 'https', thêm tiền tố
      if (!formattedUrl.startsWith('https://')) {
        formattedUrl = `https://www.facebook.com${formattedUrl}`;
      }
      formattedUrl =  extractFacebookId(formattedUrl) ? `https://www.facebook.com/${extractFacebookId(formattedUrl)}` : null;
      // Nếu là URL ngắn, giữ nguyên
      if (/https:\/\/fb\.watch\/[a-zA-Z0-9_-]+/.test(formattedUrl)) {
        return formattedUrl;  // Giữ nguyên URL ngắn dạng fb.watch
      }
      return formattedUrl;
}
function extractFacebookId(url) {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    console.log(`********* URL YouTube được bỏ qua: ${url} *********\n`);
    return null;  // Bỏ qua nếu là URL của YouTube
  }

  const idPatterns = [
    /\/videos\/(\d{1,17})/,        // URL dạng /videos/<ID>
    /v=(\d{1,17})/,                // Tham số v=<ID>
    /vb\.\d{1,16}\/(\d{1,17})/,          // Dạng vb.<ID>/ hoặc vb.<ID>/something
    /\/(\d{1,17})\/$/
  ];
  for (const pattern of idPatterns) {
    const match = url.match(pattern);
    if (match) {
        const id = match[1];
        return id
        // return id;  // Trả về ID tìm thấy, không giới hạn độ dài
    }
  }
  console.log("CÓ LỖI REGEX LINK FACEBOOK Ở ĐƯỜNG DẪN: ", url)
  return null;
}
// Hàm kiểm tra các ký tự không hợp lệ trong URL
function checkInvalidCharacters(url, fileName) {
  let formattedUrl = url.replace(/,/g, '.');
  // console.log({formattedUrl})
  const invalidChars = formattedUrl.match(/[^a-zA-Z0-9.:/?&=]/g);  // Tìm các ký tự không hợp lệ
  if (invalidChars) {
    console.log(`*********  URL chứa ký tự không hợp lệ: ${url}, Ký tự không hợp lệ: ${invalidChars.join(', ')}; *********\n`);
    // throw new Error(`URL chứa ký tự không hợp lệ: ${url}, Ký tự không hợp lệ: ${invalidChars.join(', ')}`,formattedUrl);
  }
  return !invalidChars;
}
const linkKeywords = ['link', 'url', 'address'];
// Xác định cột chứa liên kết
function findLinkColumn(headers) {
  return headers.find(header => 
    linkKeywords.some(keyword => header.toLowerCase().includes(keyword))
  );
}

const processCSVFile = async (fileName,id, skipL) => {
  let headerFound = false;
  let linkColumn = "";
  let skipLines = skipL || 0;
  const results = [];
  return new Promise((resolve, reject) => {
    fs
    .createReadStream(path.join(csvPath,fileName))
    .pipe(csv({
      skipLines, //Bỏ qua dòng trống để hàm có thể tìm thấy dữ liệu nếu tên các cột là rỗng
      // skipLines: 1,  // Bỏ qua dòng đầu tiên chứa các dấu phẩy trống
      // headers: ['STT', 'DATE', 'TITLE', 'LINK_SẢN_PHẨM_FACEBOOK', 'DOANH_THU_FB', 'LINK_SẢN_PHẨM_YOUTUBE', 'DOANH_THU_YT', 'STATUS'],  // Chỉ định tiêu đề cột thủ công
      mapHeaders: ({ header }) => header.trim()  // Loại bỏ khoảng trắng
    }))
    .on('headers', (headerList) => {
      console.log({headerList})
      if (headerList.every(header => header.trim() === '')) {
        // Bỏ qua nếu tất cả tiêu đề cột là rỗng
        headerFound = false;
      } else {
        headers = headerList;
        linkColumn = findLinkColumn(headers);  // Tìm cột chứa liên kết
        headerFound = true;
      }
    })
    .on('data', (row) => {
      if (headerFound && linkColumn && row[linkColumn]) {
        results.push(row);
      } 
      // else {
      //   skipLines ++;
      //   processCSVFile(fileName,id);
      // }
    })
    .on('end', async () => {
      if (headerFound && linkColumn) {
        // Sau khi đọc xong file CSV, bạn có thể truy xuất dữ liệu
        const links = results.map(row => formatUrl(row[linkColumn],fileName,linkColumn)).filter(row => row !== null && row !== undefined && row !== '');
        allResult.push({ id, name: path.basename(fileName, '.csv'), links, total: links.length});
        // console.log(allResult);
        resolve();
      } else {
        skipLines++;
        await processCSVFile(fileName,id, skipLines)
        resolve();
      }
    })
    .on('error', (error) => {
      reject(error);
    });
  })
}
const processAllCSVFiles = async () => {
  try {
    const files = fs.readdirSync(csvPath);  // Lấy danh sách tất cả file trong thư mục
    const csvFiles = files.filter(file => path.extname(file) === '.csv');  // Lọc các file có đuôi .csv
    let id = 0;
    for (const file of csvFiles) {
      // const filePath = path.join(csvPath, file);
      console.log(`Đang xử lý file: ${file}; Id: ${id}`);
      await processCSVFile(file, id);  // Đọc và xử lý từng file CSV
      id ++;
    }
  } catch (err) {
    console.error('Có lỗi xảy ra:', err);
  }
}

processAllCSVFiles()
.then((res) => {
  console.log({res,allResult})
  const jsonData = JSON.stringify({"data": allResult}, null, 2);  
  fs.writeFile('filteredData.json', jsonData, (err) => {
    if (err) {
      console.error('Có lỗi khi ghi file:', err);
    } else {
      console.log('Dữ liệu đã được lưu thành công vào file filteredData.json');
    }
  });
})
.catch(err=>console.log(err))