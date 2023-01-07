import jwt from 'jsonwebtoken';
import { Context } from 'koa';
import { JWT_SECRET } from '../constants';

export default class Auth{
    public static async Verify(ctx: Context){
        const token = ctx.cookies.get('token');

        try{
            //用verify验证token，验证成功之后提取出其中的payload（id,user_name,is_admin），验证失败则抛出异常
            const user = jwt.verify(token, JWT_SECRET)
            ctx.state.user = user
            console.log('token 验证成功')
    
        }catch(err){
            switch(err.name){
                case 'TokenExpiredError':  //18跟20行错误不同，一个是jwt返回的错误，一个是自定义错误格式
                   console.error('token已过期', err)
                   ctx.body = {
                    message: 'token已过期',
                   }
                    return  //有了return可以不用break
                
                case 'JsonWebTokenError':
                    console.log('无效的token', err)
                    ctx.body = {
                        message: '无效的token',
                       }
                    return
        }

    }

        
    }
}
