import Nodemailer from 'nodemailer';
import { Options } from 'nodemailer/lib/mailer';
const config = {
    host: "smtp.qq.com",
    port: 465,
    secureConnection: true,
    service: "qq",
    auth: {
        user: "2979115538@qq.com",    //发件账号
        pass: "rkesjbqzbguhdfaf",     //发件邮箱授权码
    },
};
const transport = Nodemailer.createTransport(config);


export const sendEmail = async (mail: Options) => {
    let res = {};
    let start_time = new Date().getTime();
    return new Promise((resolve,reject)=>{
        transport.sendMail(mail, (err, info) => {
            // res.err = err;
            // res.info = info;
            console.log(new Date().getTime() - start_time,"ms")
            resolve(res);
        });
    })
}
