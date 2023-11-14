const express = require("express");
const ListOfPropertiesSchema = require('../models/listofproperties')
const mongoose = require("mongoose");
const { checkAuthMiddleware , checkAminAuthMiddleware} = require("../middlewares");
const AcceptListOfPropertiesSchema = require('../models/acceptlistProperties')
const Questionnaire = require("../models/questionnaire");
const RejectListOfPropertiesSchema = require("../models/rejectListProperties")
const sendEmail = require('../nodemailer')
const Users = require("../models/users");
const handlebars = require("handlebars")
const bodyParser = require("body-parser");
const fs = require("fs")
const path = require("path")
const multer = require("multer");
const config = require("../configs");
const filePath = path.join(__dirname, "../../public/KYC.pdf");
const emailTemplateSource = fs.readFileSync(path.join(__dirname, "/email.handlebars"), "utf8")
const template = handlebars.compile(emailTemplateSource)
const app = express();
const juice = require('juice');
const generatePDF = require("./generatePDF");
const Handlebars = require('handlebars');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
Handlebars.registerHelper('truncateText', function (text, length) {
    if (text.length > length) {
        return text.slice(0, length) + '...';
    }
    return text;
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/images/");
    },
    filename: function (req, file, cb) {
        const image = file.fieldname + "-" + Date.now() + path.extname(file.originalname);
        cb(null, image);
    },
});

const upload = multer({ storage: storage }).single("image");
app.post("/upload", checkAminAuthMiddleware, async (req, res) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err);
        } else if (err) {
            return res.status(500).json(err);
        }
        return res.status(200).json({ success: true, data: req.file });
    });
})

app.post("/add_properties", checkAminAuthMiddleware, async (req, res) => {
    try {
        const user = await Users.findById(req.body.user_id)
        const userEmail = user?.email
        req.body?.propertyFields.forEach(async (element) => {
            let data = {
                image: `${config.serverUrl}/public/images/${element?.property_image}`,
                title: element?.property_title,
                price: element?.property_price,
                address: element?.property_location,
                destination: element?.destination,
                link: element?.property_url,
                questionnaireId: req.body.questionnaire_id,
                userId: req.body.user_id,
                userEmail: userEmail
            };
            await ListOfPropertiesSchema.create(data)
        })
        res.status(200).json({
            success: true,
            message: "Property added successfully.",
            code: "Properties_API",
        })
    } catch (err) {
        res.status(500).json({ success: false, error: "Internal Server Error " });
    }

})

// Get list of properties by questionnaire Id
app.get('/getListOfProperties', checkAuthMiddleware, async (req, res) => {
    try {
        const addressId = req.query.address_id;
        if (!mongoose.Types.ObjectId.isValid(addressId)) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid address ID." });
        }
        const questionnaire = await Questionnaire.findById(addressId);
        if (!questionnaire) {
            return res
                .status(404)
                .json({ success: false, message: "Questionnaire record not found." });
        }
        const data = await ListOfPropertiesSchema.find({ questionnaireId: addressId })
            .sort({ createdAt: -1 })
            .select('_id title price address destination link questionnaireId status image');

        res.status(200).json({
            data,
            success: true,
            message: "Success",
            code: "PropertiesByQuestionnaireId_API",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

//Admin get list of properties by questionnaire Id
app.get("/listOfPropertiesByQuestionnaire/:id", checkAminAuthMiddleware, async(req,res) => {
    try{
          let listofproperties = await ListOfPropertiesSchema.find({ questionnaireId: req?.params?.id })
          .sort({ createdAt: -1})
          .select('_id title price address destination link image')
          res.status(200).json({success: true, data: listofproperties, message: "List Of Properties By Questionnaire."})
    }catch(error){
      res.status(500).json({success: false, message: error.message})
    }
})

//Admin Get list of All properties 
app.get('/getListOfAllProperties', checkAminAuthMiddleware, async (req, res) => {
    try {
        const data = await ListOfPropertiesSchema.find().sort({ createdAt: -1 });
        const arraOfData = data.map((element) => ({
            _id: element?._id,
            title: element?.title,
            address: element?.address,
            destination: element?.destination,
            link: element?.link,
            status: element?.status,
            time: element?.time,
            date: element?.date,
            pickuploaction: element?.pickuploaction,
            userEmail: element?.userEmail,
        }));

        res.status(200).json({
            data: arraOfData,
            success: true,
            message: "success",
            code: "PropertiesByQuestionnaireId_API",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// update agenda Data
app.put('/agenda/:id', checkAminAuthMiddleware, async (req, res) => {
    try {
        await ListOfPropertiesSchema.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, useFindAndModify: false }
        );
        res.status(200).json({ success: true, message: "Agenda updated successfully." })
    } catch (err) {
        res.status(500).json({ success: false, error: "Internal Server Error " });
    }
})

// Get Adgenda List
app.get('/get_agenda', checkAuthMiddleware, async (req, res) => {
    try {
        const questionnaire = await ListOfPropertiesSchema.find({ userId: req.userId, status: 'Accepted', time: { $exists: true }, date: { $exists: true } });
        const array = questionnaire.map((element) => ({
            _id: element?._id,
            title: element?.title,
            price: element?.price,
            address: element?.address,
            pickuploaction: element?.pickuploaction,
            link: element?.link,
            questionnaireId: element?.questionnaireId,
            status: element?.status,
            time: element.time,
            date: element?.date,
            image: element?.image,
            userId: element?.userId
        }));

        res.status(200).json({
            success: true,
            data: array,
            message: "Success",
            code: "Agenda_API"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

// Post APi  Accept list of properties
app.post('/accept_list_of_porperties', checkAuthMiddleware, async (req, res) => {
    try {
        let listOfArray = []
        let accpetLists = {
            acceptList: [],
            questionnaireId: req.body?.questionnaireId,
            userId: req?.userId
        }
        if (req.body?.acceptList) {
            for (const item of req.body?.acceptList) {
                const accpetListsValue = await ListOfPropertiesSchema.findById(item.porpertiesId)
                listOfArray.push({ title: accpetListsValue?.title, price: accpetListsValue?.price, address: accpetListsValue?.address, destination: accpetListsValue?.link, image: accpetListsValue?.image })
                accpetLists.acceptList.push({ propertiesId: item.porpertiesId });
            }
        }
        const dataFrom = await Users.findById(req?.userId)
        let userName = dataFrom.name
        let fromMail = dataFrom.email;
        let dataToMail = await Users.find()
        let toMail;

        const htmlToSend = template({ message: "Hello World!", listOfArray, userName, text: "accepted" })
        const inlinedEmail = juice(htmlToSend);
        if (req.body.acceptList.length === 0) {
            return res.status(400).json({ success: false, message: "Please select list any Propertie" });
        }

        //email sent
        dataToMail?.forEach((element) => {
            if (element.role === "admin") {
                toMail = element?.email
            }
        })

        var mailOptions = {
            from: fromMail,
            to: [toMail, "lbr@yopmail.com", "sean.carpenter@london-brazil.com", "renato@london-brazil.com", "bilalsattar55544@gmail.com", "zeshanbutt9128@gmail.com"],
            subject: `Accepted Properties`,
            html: inlinedEmail
        };
        await sendEmail(mailOptions, function (error, info) {
            if (error) {
                console.log(error, "error");
            } else {
                console.log("Email sent: " + info.response);
            }
        })
        let data = await AcceptListOfPropertiesSchema.create(accpetLists)
        data?.acceptList.forEach(async (element) => {
            await ListOfPropertiesSchema.findByIdAndUpdate(element?.propertiesId, { status: 'Accepted' });
        })
        const successMessage = req.body.acceptList.length === 1
            ? "Property accepted successfully"
            : "List of Properties accepted successfully";
        return res.status(200).json({
            success: true,
            message: successMessage,
            code: "AcceptListOfProperties_API",
        });
    } catch (e) {
        res.status(500).json({ success: false, error: "Internal Server Error " });
    }
})

//Post APi reject list of properties
app.post('/reject_list_of_porperties', checkAuthMiddleware, async (req, res) => {
    try {
        let listOfArray = []
        let responseData = {
            rejectList: [],
            questionnaireId: req.body?.questionnaireId,
            userId: req?.userId
        };
        if (req.body?.rejectList) {
            for (const item of req.body.rejectList) {
                let rejectListItem = await ListOfPropertiesSchema.findById(item.porpertiesId)
                listOfArray.push({ title: rejectListItem?.title, price: rejectListItem?.price, address: rejectListItem?.address, destination: rejectListItem?.link, image: rejectListItem?.image })
                responseData.rejectList.push({ propertiesId: item.porpertiesId });
            }
        }

        // email send
        const dataFrom = await Users.findById(req?.userId)
        let userName = dataFrom.name
        let fromMail = dataFrom.email;
        let dataToMail = await Users.find()
        let toMail;
        const htmlToSend = template({ message: "Hello World!", listOfArray, userName, text: "rejected" })
        const inlinedEmail = juice(htmlToSend);
        dataToMail?.forEach((element) => {
            if (element.role === "admin") {
                toMail = element?.email
            }
        })
        var mailOptions = {
            from: fromMail,
            to: [toMail, "lbr@yopmail.com", "sean.carpenter@london-brazil.com", "renato@london-brazil.com", "zeshanbutt9128@gmail.com", "bilalsattar55544@gmail.com"],
            subject: `Rejected Properties`,
            html: inlinedEmail
        };

        await sendEmail(mailOptions, function (error, info) {
            if (error) {
                console.log(error, "error");
            } else {
                console.log("Email sent: " + info.response);
            }
        });
          
        if (responseData?.rejectList?.length === 0) {
            return res.status(400).json({ success: false, message: "Please select list any Propertie" });
        }
            let data = await RejectListOfPropertiesSchema.create(responseData)
            data?.rejectList.forEach(async (element) => {
                await ListOfPropertiesSchema.findByIdAndUpdate(element?.propertiesId, { status: 'Rejected' });
            })
            const successMessage = req?.body?.rejectList.length === 1
            ? "Property rejected successfully"
            : "List of Propertie rejected successfully";
            
                 return res.status(200).json(
                {
                    success: true,
                    message: successMessage,
                    code: "RejectListOfProperties_API",
                })

    } catch (e) {
        res.status(500).json({ success: false, error: "Internal Server Error " });
    }
})

//Post Request for more properties
app.post('/request_more_properties', checkAuthMiddleware, async (req, res) => {
    try {
        const questionnaire = await Questionnaire.findById(req?.body?.QuestionnaireId);
        const data = await Users.findById(req?.userId)

        const filePath = await generatePDF(questionnaire)
        let fromMail = data.email;
        let userName = data.name
        let dataToMail = await Users.findOne({role: "admin"})
        let toMail = dataToMail?.email;
        var mailOptions = {
            from: fromMail,
            to: [toMail, "lbr@yopmail.com", "sean.carpenter@london-brazil.com", "renato@london-brazil.com", "bilalsattar55544@gmail.com", "zeshanbutt9128@gmail.com"],
            subject: `Request for more properties`,
            html: `<div>Hi Admin,<div>${userName} have requested to add more properties.</div></div>`,
            attachments: [{ filename: "KYC.pdf", path: filePath }],
        };
        await sendEmail(mailOptions, function (error, info) {
            if (error) {
              return  res.status(400).json({
                    success: false,
                    message: error,
                });
            } else {
                console.log("Email sent: " + info.response);  
            }
           
        });
        return res.status(200).json({
            success: true,
            message: "Email sent successfully",
            code: "requestForMoreProperties_Api"
        });
        
    } catch (e) {
       return res.status(500).json({ success: false, error: "Internal Server Error " });
    }
})
module.exports = app;