const { readFileSync, writeFileSync,unlinkSync, readdir,existsSync } = require("fs");
const { join } = require("path");

//Burada correct ve incorrect dosyalarini okuyup verileri bir arraye atiyoruz.
const getFiles = (source, callback) =>
    readdir(source, { withFileTypes: true }, (err, files) => {
        if (err) {
            callback(err)
        } else {
            callback(
                files
                    .filter(f => f.isFile())
                    .map(f => f.name)
            )
        }
    })

//Incorrect ve Correct dosya yollarini birlestirip readfiles icerisinde kullaniyoruz.
const IncorrectFilePath = join(__dirname, "incorrectOutbox", "incorrect.json");
const CorrectFilePath = join(__dirname, "correctOutbox", "correct.json");
function readfiles() {
    setInterval(() => {
        /*
        1 sn de bir inbox kontrol edilerek dosya upload edildiyse ilgili dosyayi okuyup 
        icerisinde ki veri tiplerinin eslesmelerini kontrol ediyoruz.
        Bu kontroller neticesinde dogru json verilerini correctOutbox klasorune,
        yanlis json verilerini incorrectOutbox klasorune yazarak kayit ediyoruz.
        -
        Daha onceden yuklenen incorrect veya correct verileri varsa bunlarin uzerine 
        yeni gelen verileri ekleyerek veri butunlugunu korumus oluyoruz.
        Ayrica bu yolla daha fazla dosya kayit isleminin de onune gecerek
        karmasasizlik ve okuma isleminin daha stabil olmasini sagliyoruz. 
        -
        Verilerin ayristirilmasi tamamlandiginda yazma islemleri tamamlaniyor.
        En sonda ise okunan inbox klasorundaki dosyalari silmek icin unlinkSync fonksiyonu kullaniyoruz.
        */
        getFiles("./inbox", (files, err) => {
            if (files) {
                files.forEach(file => {
                    const filePath = join(__dirname, "inbox", file);
                    const fileContent = readFileSync(filePath, "utf8");
                    const data = JSON.parse(fileContent);
                    if (data.length > 1) {
                        var incorrectData=[];
                        var correctData=[];
                        if (existsSync(CorrectFilePath)) {
                            const correctFileContent = readFileSync(CorrectFilePath, "utf8");
                            if(correctFileContent.length>0){
                                correctData=(JSON.parse(correctFileContent));
                            }
                        }
                        if (existsSync(IncorrectFilePath)) {
                            const incorrectFileContent = readFileSync(IncorrectFilePath, "utf8");
                             if(incorrectFileContent.length>0){
                            incorrectData=(JSON.parse(incorrectFileContent));
                        }}
                        data.forEach(element => {
                            const { billDate, billNo, vat } = element;
                            var vatValue = vat;
                            vatValue = parseFloat(vatValue);
                            vatValue = (vatValue + "").split(".")[1];
                            if (typeof billDate === "string" && typeof billNo === "string" && typeof vatValue !== "undefined") {
                                correctData.push(element);
                            } else {
                                incorrectData.push(element);
                            }
                        })
                    writeFileSync(IncorrectFilePath, JSON.stringify(incorrectData),{flag:'w'});
                    writeFileSync(CorrectFilePath, JSON.stringify(correctData),{flag:'w'});
                }
                    unlinkSync(filePath);
                })
            }
        })
    }, 1000);
}

readfiles();
