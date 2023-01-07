import { Context } from 'koa';
import { getConnection, getManager } from 'typeorm';
import * as argon2 from 'argon2';
import { AlreadyExistsException, UnauthorizedException } from '../exceptions';
import jwt from 'jsonwebtoken';
import svgCaptcha from 'svg-captcha';
import { User } from '../entity/user';
import { JWT_SECRET } from '../constants';
import { NotFoundException, ForbiddenException } from '../exceptions';
import Auth from "../authMiddleware/auth";

export default class UserController {
  public static async listUsers(ctx: Context) {
    const userRepository = getManager().getRepository(User);
    const users = await userRepository.find();

    ctx.status = 200;
    ctx.body = users;
  }

  public static async showUserDetail(ctx: Context) {
    const userRepository = getManager().getRepository(User);
    const user = await userRepository.findOneBy({ name: +ctx.params.name });

    if (user) {
      ctx.status = 200;
      ctx.body = user;
    } else {
      throw new NotFoundException();
    }
  }

  //增加用户
        //管理员端增加用户基本信息
      // public static async addUser(ctx: Context) {
      //   const stuBasicInfoRepository = getManager().getRepository(User);
      //   const stu = await stuBasicInfoRepository.findOneBy({ name: ctx.request.body.name });
      //   if(stu){
      //     throw new AlreadyExistsException();

      //   }else{
      //     const newStu = new User();
      //     ctx.request.body.password = await argon2.hash(ctx.request.body.password);
      //     newStu.name = ctx.request.body.name;
      //     newStu.password = ctx.request.body.password;
      //     newStu.email = ctx.request.body.email;
        
      //     console.log('基本信息添加成功')
  
      //     const nstu = await stuBasicInfoRepository.save(newStu);
  
      //     ctx.status = 201;
      //     ctx.body = nstu;

      //   }
  
      //   //检验数据库中是否有这个人

        
        
  
      // }

  public static async updateUser(ctx: Context) {
    const userId = +ctx.params.name;
    await Auth.Verify(ctx);

    // 鉴权逻辑
    if (userId !== +ctx.state.user.id) {
      throw new ForbiddenException();
    }

    const userRepository = getManager().getRepository(User);
    await userRepository.update(+ctx.params.name, ctx.request.body);
    const updatedUser = await userRepository.findOneBy({ name: +ctx.params.name });

    if (updatedUser) {
      ctx.status = 200;
      ctx.body = updatedUser;
    } else {
      ctx.status = 404;
    }
  }

  public static async deleteUser(ctx: Context) {
    const userRepository = getManager().getRepository(User);
    await userRepository.delete(ctx.request.body.studentNo);
    ctx.status = 200;
    ctx.body = {
      code: 1,
    };
    console.log('用户删除成功');
  }

    /*lxy*/
    public static async changePwd(ctx: Context) {
      await Auth.Verify(ctx)
      //验证原密码是否正确
      const preuserRepository = getManager().getRepository(User);   
      const preUser = await preuserRepository.findOneBy({ name: ctx.state.user.id });
      
      if(preUser){
        if(await argon2.verify(preUser.password, ctx.request.body.oldPass)){
          ctx.request.body.password = await argon2.hash(ctx.request.body.password);
          await getConnection()
          .createQueryBuilder()
          .update(User)
          .set({password: ctx.request.body.password})
          .where("name = :name",{name: ctx.state.user.id})
          .execute();
          
          const userRepository = getManager().getRepository(User);   
          const updatedUser = await userRepository.findOneBy({ name: ctx.state.user.id });
          if (updatedUser) {
            ctx.status = 200;
            ctx.body = {
              code: 1,
            };
          } else {
            ctx.status = 200;
            ctx.body = {
            code: -1,
            msg: '更改密码失败'
          };
         }
        }else{
          ctx.status = 200;
            ctx.body = {
            code: -1,
            msg: '原密码错误'
          };

        }
      }

      
  }

      
  }

