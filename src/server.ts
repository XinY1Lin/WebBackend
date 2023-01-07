import Koa from 'koa';
import cors from '@koa/cors';
// import bodyParser from 'koa-bodyparser';
import { protectedRouter, unprotectedRouter } from './routes';
import { JWT_SECRET } from './constants';
import logger from './logger';
import sessionConfig from './config/session';
import { createConnection } from 'typeorm';
import jwt from 'koa-jwt';
import koaSession from 'koa-session';
import koaBody from 'koa-body';
import path from 'path';
import 'reflect-metadata';

// 配合 signed 属性的签名key
const session_signed_key = ['appletSystem'];

createConnection()
  .then(() => {
    // 初始化 Koa 应用实例
    const app = new Koa();

    // session 实例化
    const session = koaSession(sessionConfig, app);
    app.keys = session_signed_key;

    // app.use(bodyParser());
    
    app.use(koaBody({
      multipart: true,  //设置支持文件格式
      formidable: {
       //这是个 node 包, 设置一下选项
       uploadDir: path.join(__dirname,'./uploadPhoto'), //设置上传目录
      //不推荐使用相对路径
      keepExtensions: true,  //设置文件后缀名保留
      // maxFileSize: 100*1024*1024,
      onFileBegin:(name,file) =>{
        console.log(file);
      }
      }
    }))

    app.use(session);

    // 注册中间件
    app.use(logger());
    app.use(cors());

    // 错误处理中间件
    app.use(async (ctx, next) => {
      try {
        await next();
      } catch (err) {
        // 只返回 JSON 格式的响应
        ctx.status = err.status || 500;
        ctx.body = { message: err.message };
      }
    });
    // 响应用户请求
    // 无需 JWT Token 即可访问
    app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods());

    // 注册 JWT 中间件
    app.use(jwt({ secret: JWT_SECRET }).unless({ method: 'GET' }));

    // 需要 JWT Token 才可访问
    app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods());

    // 运行服务器
    app.listen(3000);
  })
  .catch((err: string) => console.log('TypeORM connection error:', err));
function multer(arg0: { storage: any; }) {
  throw new Error('Function not implemented.');
}

