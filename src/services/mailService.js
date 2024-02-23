
import nodemailer from 'nodemailer';
require('dotenv').config()

let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });

    let info = await transporter.sendMail({
        from: '"Nguyen_Tien_Anh 👻" <nguyentienanh13072003@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: "Thông tin đặt lịch khám bệnh", // Subject line
        html: getBodyEmail(dataSend), // html body
    });
}

let getBodyEmail = (dataSend) => {
    let result = ''
    if (dataSend.language === 'vi') {
        result = `
             <h3>Kính gửi ${dataSend.patientName}</h3 >
             <p>Bạn nhận được email này vì bạn đã đăng ký đặt lịch khám bệnh tại Nguyen_Tien_Anh.hospital</p>
             <p>Thông tin đặt lịch khám bệnh:</p>
             <div><b>Thời gian: ${dataSend.time}</b></div>
             <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
             <p>Nếu thông tin trên là chính xác, vui lòng nhấn vào liên kết bên dưới để
             xác nhận và hoàn tất thủ tục đặt lịch hẹn khám bệnh.
             </p>
             <div><a href=${dataSend.redirectLink} target='_blank'>Nhấn vào đây</a></div>
             <div>Xin chân thành cảm ơn!</div>
         `
    }
    if (dataSend.language === 'en') {
        result = `
            <h3>Dear, ${dataSend.patientName}</h3>
            <p>You received this email because you registered to schedule a medical examination on Nguyen_Tien_Anh.hospital</p>
            <p>Information on scheduling medical examinations:</p>
            <div><b>Time: ${dataSend.time}</b></div>
            <div><b>Doctor: ${dataSend.doctorName}</b></div>
            <p>If the above information is correct, please click on the link below to 
            confirm and complete the medical appointment booking procedure.
            </p>
            <div><a href=${dataSend.redirectLink} target='_blank'>Click here</a></div>
            <div>Sincerely thank!</div>
        `
    }
    return result
}

let getBodyEmailRemedy = (dataSend) => {
    let result = ''
    // if (dataSend.language === 'vi') {
    result = `
             <h3>Xin chào ${dataSend.patientName}</h3 >
             <p>Bạn nhận được email này vì bạn đã đăng ký đặt lịch khám bệnh tại Nguyen_Tien_Anh.hospital thành công</p>
             <p>Thông tin đơn thuốc/hóa đơn được gửi trong file đính kèm</p>
             <div>Xin chân thành cảm ơn!</div>
         `
    // }
    // if (dataSend.language === 'en') {
    //     result = `
    //         <h3>Dear, ${dataSend.patientName}</h3>
    //         <p>You received this email because you registered to schedule a medical examination on Nguyen_Tien_Anh.hospital</p>
    //         <p>Information on scheduling medical examinations:</p>
    //         <div><b>Time: ${dataSend.time}</b></div>
    //         <div><b>Doctor: ${dataSend.doctorName}</b></div>
    //         <p>If the above information is correct, please click on the link below to 
    //         confirm and complete the medical appointment booking procedure.
    //         </p>
    //         <div><a href=${dataSend.redirectLink} target='_blank'>Click here</a></div>
    //         <div>Sincerely thank!</div>
    //     `
    // }
    return result
}

let sendAttachment = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD
        }
    });

    let info = await transporter.sendMail({
        from: '"Nguyen_Tien_Anh 👻" <nguyentienanh13072003@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: "Kết quả đặt lịch khám bệnh", // Subject line
        html: getBodyEmailRemedy(dataSend), // html body
        attachments: [
            {
                filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                content: dataSend.imgBase64.split("base64,")[1],
                encoding: 'base64'
            }
        ]
    });
}

module.exports = {
    sendSimpleEmail, sendAttachment
}