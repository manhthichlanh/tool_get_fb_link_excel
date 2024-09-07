// function extractFacebookId(url) {
//     // Biểu thức chính quy để tìm ID video Facebook
//     const idPatterns = [
//       /\/videos\/(\d+)+|v=(\d+)|vb.\d+\/(\d+))/,  // URL dạng /videos/1445831039518616
//     ];
  
//     // for (const pattern of idPatterns) {
//     //   const match = url.match(pattern);
//     //    console.log({match})
//     //   if (match) {
//     //     const id = match[1];
//     //     if (id.length <= 16) {
//     //       return id;
//     //     } else {
//     //       console.log(`*********  ID Facebook không hợp lệ (cần ít nhất 16 ký tự): ${id}, URL: ${url} *********\n`);
//     //     }
//     //   }
//     // }
//     const match = url.match(idPatterns[0]);
//     // console.log(match)
//     // Nếu là URL ngắn, giữ nguyên
//     if (/https:\/\/fb\.watch\/[a-zA-Z0-9_-]+/.test(url)) {
//       return url; // Giữ nguyên URL ngắn
//     }
  
//     console.log(`*********  URL không chứa ID Facebook hợp lệ: ${url} *********\n`);
//     return null;
//   }
//   extractFacebookId("https://www.facebook.com/TheHeroes.viva/videos/497759525966186")
//   console.log("1668822960364027".length)
const url = "https://www.facebook.com/baihathaynhatofficial/videos/%C4%91i-r%E1%BB%ABng-th%E1%BA%A5y-hi%E1%BB%87n-t%C6%B0%E1%BB%A3ng-l%E1%BA%A1-ch%E1%BB%9B-d%E1%BA%A1i-m%C3%A0-ch%E1%BA%A1m-v%C3%A0o-n%E1%BA%BFu-kh%C3%B4ng-s%E1%BA%BD-r%C6%B0%E1%BB%9Bc-h%E1%BB%8Da-v%C3%A0o-th%C3%A2n/486911824049361/";
const idPatterns = [
    /\/videos\/(\d{1,16})/,        // URL dạng /videos/<ID>
    /v=(\d{1,16})/,                // Tham số v=<ID>
    /vb\.\d{1,16}\/(\d{1,16})/,          // Dạng vb.<ID>/ hoặc vb.<ID>/something
    /\/(\d{1,16})\/$/
  ];

for (const pattern of idPatterns) {
const match = url.match(pattern);
if (match) {
    const id = match[1];
    console.log(`********* ID được tìm thấy: ${id}, URL: ${url} *********\n`);
    console.log(id)
    // return id;  // Trả về ID tìm thấy, không giới hạn độ dài
}
}
