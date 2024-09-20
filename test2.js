const data = require("./filteredData.json");
const fs = require("fs");
const linkBegin = "2154448434935069";
let finded = 0;
const findId = "0";
const link = data.data.filter(item=>item.id == findId)[0]?.links;
if (finded > 1) return console.log("Lỗi", finded)
const result = link.map(item=>{
    if (item.includes(linkBegin)) {
        finded ++;
        return item;
    }
    if (finded===0) return null;
    else return item;
}).filter(item=>item)
fs.writeFile('result.json', JSON.stringify(result), (err) => {
    if (err) {
      console.error('Có lỗi khi ghi file:', err);
    } else {
      console.log('Dữ liệu đã được lưu thành công vào file filteredData.json');
    }
  });
console.log(JSON.stringify(result))