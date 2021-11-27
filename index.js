// Core Modüllerin ve moment'in importu, ilk başta fs(filesystem) kullanacaktım,
// fakat doc'ta promise versiyonunu görünce bootcamp müfredatına
// uygun olacağını düşünüp onu kullandım.

const http = require("http");
const moment = require("moment");
//const fs = require("fs");
const { appendFile } = require("fs/promises");

//PORT tanımı.
const PORT = 3000;

// Loglama işlemini gerçekleştirecek fonksiyon:
const loggingFunction = async (url, notFound) => {
  // İsteğin ne zaman yapıldığını
  const dateNow = moment().format("DD-MM-YYYY HH:mm:ss");
  // Loglanacak satırın gelen parametrelerle oluşturulması:
  let logLine = `*${dateNow}* --- ${url} requested.`;
  if (notFound) {
    logLine += ` And returned Not Found.  \n`;
  } else {
    logLine += ` And returned successfully. \n`;
  }

  // Try-Catch bloguyla dosya varsa logLine ekleme
  // Yoksa dosyayı oluşturup logLine ekleme, hata durumunda error basma
  try {
    await appendFile("logs.txt", logLine);
    console.log(`successfully logged`);
  } catch (error) {
    console.error("there was an error:", error.message);
  }
};

// Server kurulumu
const myServer = http.createServer((req, res) => {
  // Her yerde req yazmasın diye destructuring
  const { url } = req;
  let isNotFound = false;

  // Path kontrolü ve ona göre veri döndürme
  // WriteHead ile 200(başarılı) 404(başarısız) istek belirtme

  res.writeHead(200, { "Content-Type": "text/html" });

  if (url === "/" || url.toLowerCase() === "/homepage") {
    res.end("Homepage");
  } else if (url.toLowerCase() === "/about") {
    res.end("About Page");
  } else if (url.toLowerCase() === "/help") {
    res.end("Help Page");
  } else {
    isNotFound = true;
    res.writeHead(404, {
      "Content-Type": "text/html;",
    });

    res.end("404 not found!");
  }
  // İstek ve cevap işlemleri sonunda loglamak için fonksiyonu çağırdım.
  loggingFunction(url, isNotFound);
});

// Server dinlenmeye başlıyor/ayağa kaldırılıyor.
myServer.listen(PORT);

console.log(`Listening on ${PORT}`);
