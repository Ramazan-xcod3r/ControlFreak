const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { readFileSync, existsSync, unlinkSync, stat } = require("fs");
const multer = require("multer");
/*
Burada inbox klasorune kayit yapacagimizi belirtiyoruz.
Ardindan dosya ismi olarak random bir json uzantili dosya ismi olusturuyoruz.
*/
const fileStorageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.mimetype === "application/json") {
            cb(null, "./inbox");
        }
    },
    filename: function (req, file, cb) {
        cb(null, "data" + Math.floor(Math.random() * 1000) + ".json");
    },
});
const app = express();
const router = express.Router();
const port = process.env.PORT || 4000;
const upload = multer({ storage: fileStorageEngine });
/*
Burada control modulumuzun icindeki readfiles fonksiyonunu cagiriyoruz.
Her 1 saniyede dosya yuklendiyse dosya okuma islemi yapiyoruz.
*/
require("./control");

app.use(cors());
app.use(bodyParser.json());
/*
Burada dosya yukleme islemi icin multer moduluyla expressin post methoduyla
dosya yukleme islemi yapiyoruz.  
*/
router.post("/upload", upload.single("file"), function (req, res, next) {
    /*
    Incorrectfilepath ile veri yapisi yanlis olan dosyalarin daha once varsa kontrolunu yapiyoruz.
    Yeni yuklenen dosyada incorrect veri varsa Incorrect dosyasina eklenecegi icin bunun kontrolunu 
    saglayip frontend kismina incorrect mesajini gonderiyoruz. Bu sayede frontend kisminda incorrect 
    yakalanmis oluyor ve frontend kisminda incorrect datatable`in gosterilmesi saglaniyor.
    --
    Ayni sekilde eger incorrect verisi yoksa frontend kisminda correct mesaji gonderilerek yonlendirme
    saglaniyor.
    */
    let size = 0;
    if (existsSync(IncorrectfilePath)) {
        stat(IncorrectfilePath, (error, stats) => {
            if (error) {
                console.log(error);
            }
            else {
                size = stats.size;
            }
        });
    }
    setTimeout(() => {
        if (size > 0) {
            stat(IncorrectfilePath, (error, stats) => {
                if (error) {
                    console.log(error);
                }
                else {
                    newSize = stats.size;
                    if (stats.size > size) {
                        console.log("Incorrect Page");
                        res.send("Incorrect Page");
                    } else if (stats.size !== size) {
                        const fileContent = readFileSync(IncorrectfilePath, "utf8");
                        //Bos bir json nesnesi olup olmadigini kontrol ediyoruz.
                        if (fileContent.length > 2) {
                            console.log("Incorrect Page");
                            res.send("Incorrect Page");
                        }
                    } else {
                        console.log("Correct Page");
                        res.send("Correct Page");
                    }
                }
            });
        } else {
            if (existsSync(IncorrectfilePath)) {
                const fileContent = readFileSync(IncorrectfilePath, "utf8");
                if (fileContent.length > 2) {
                    console.log("Incorrect Page");
                    res.send("Incorrect Page");
                }
            }
        }
    }, 1010);
});

//Correctdatatable sayfasina veriler sunuluyor.
const CorrectfilePath = `./correctOutbox/correct.json`;
router.get("/CorrectDatatable", upload.single("file"), function (req, res, next) {
    if (existsSync(CorrectfilePath)) {
        const fileContent = readFileSync(CorrectfilePath, "utf8");
        res.send(fileContent);
    }
});

//Incorrectdatatable sayfasina veriler sunuluyor.
const IncorrectfilePath = `./incorrectOutbox/incorrect.json`;
router.get("/IncorrectDatatable", upload.single("file"), function (req, res, next) {
    if (existsSync(IncorrectfilePath)) {
        const fileContent = readFileSync(IncorrectfilePath, "utf8");
        res.send(fileContent);
    }
});

/*Burada reset islemi icin frontend kisminda reset butonuna basildiginda backend kisminda
reset islemi yapiliyor.*/
router.get("/reset", function (req, res, next) {
    if (existsSync(CorrectfilePath)) {
        unlinkSync(CorrectfilePath);
    }
    if (existsSync(IncorrectfilePath)) {
        unlinkSync(IncorrectfilePath);
    }
    res.send("File Reset");
});
app.use('/', router);

app.listen(port, () => {
    console.log("Server started at port 4000");
});

module.exports = router;