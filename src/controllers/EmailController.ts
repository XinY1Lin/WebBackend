import { Context } from 'koa';
import { User } from '../entity/user';
import { EmailCode } from '../entity/emailCode';
import { sendEmail} from '../authMiddleware/emailCode';
import { getConnection, getManager } from 'typeorm';
import Auth from '../authMiddleware/auth';

export default class emailController {
    // const getEmailCode = async ctx => 
public static async getEmailCode(ctx: Context){
    let codeStr = "";  //验证码
    let codeLen = 6;   //验证码长度
    for(let i=0;i<codeLen;i++){
        codeStr += Math.floor(Math.random()*10);
    }
    var mail = {
        from: "2979115538@qq.com",       //发件邮箱
        subject: "验证码",
        to: ctx.request.body.email,   //收件邮箱
        text: "验证码为：" + codeStr, //发送内容
    };
    const emailRepository = getManager().getRepository(EmailCode);
    const email = new EmailCode();
    email.email = ctx.request.body.email;
    email.code = codeStr;
    await emailRepository.save(email);
    const res = await sendEmail(mail);
    ctx.emailCode = codeStr;
    ctx.emailCodeTime = new Date().getTime();
    ctx.body = {
        code: 200,
        data: res,
        msg: 'success'
    } 
}

public static async checkEmailCode(ctx: Context){
    const emailRepository = getManager().getRepository(EmailCode);
    const email = await emailRepository.findBy({email: ctx.request.body.email});
    var flag = false;
    email.forEach((email) =>{
        if(email.code == ctx.request.body.code){
            flag = true;
        }
    })
    if(flag){
        await Auth.Verify(ctx);
        // const userRepository = getManager().getRepository(User);
        await getConnection()
        .createQueryBuilder()
        .update(User)
        .set({email: ctx.request.body.email})
        .where("name = :name",{name: ctx.state.user.id})
        .execute();

        ctx.status = 200;
        ctx.body = {
          code: 1,
        };
    }else{
        ctx.status = 200;
        ctx.body = {
          code: -1,
          msg:'验证码错误',
        }
    }

}

}
