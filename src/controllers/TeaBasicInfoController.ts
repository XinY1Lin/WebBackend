import { Context } from 'koa';
import { getConnection, getManager } from 'typeorm';
import { UnauthorizedException } from '../exceptions';
import jwt from 'jsonwebtoken';
import svgCaptcha from 'svg-captcha';
import { JWT_SECRET } from '../constants';
import { NotFoundException, ForbiddenException,AlreadyExistsException } from '../exceptions'
import Auth from '../authMiddleware/auth';
import { Department } from '../entity/department';
import { User_Teacher } from '../entity/user_teacher';

export default class TeaBasicInfoController {
  //管理员端展示所有人的信息
    public static async listTeaBasicInfo(ctx: Context) {
      console.log('11111')
        const teaBasicInfoRepository = getManager().getRepository(User_Teacher);
        const teaBasicInfo = await teaBasicInfoRepository.findBy({ department: ctx.request.body.dpt});
        // const teaBasicInfo = await teaBasicInfoRepository.findBy({ department: ctx.request.body.dpt});
    
        ctx.status = 200;
        ctx.body = {
          code: 1,
          datas: {
            teaBasicInfo,
          }
        };

      }

  //管理员端调用所有老师的名字
  public static async listTeacherName(ctx: Context) {
    console.log('555555')
      const teaBasicInfoRepository = getManager().getRepository(User_Teacher);
      const allTeaName = await teaBasicInfoRepository.query("select name from User_Teacher");
      //const allTeaName = teaBasicInfo.teacherName;
      // const teaBasicInfo = await teaBasicInfoRepository.findBy({ department: ctx.request.body.dpt});
  
      if(allTeaName){
        ctx.status = 200;
        ctx.body = {
          code: 1,
          datas: {
            allTeaName,
          }
        };
      } else {
        ctx.status = 200;
          ctx.body = {
            code: -1,
            msg:'查询不到教师名字',
          }
      }
      

    }
      
  //教师端展示自己的信息(需要在url中传入teacherNo或user)
      public static async showTeaBasicInfoDetail(ctx: Context) {
        console.log('entered')
        await Auth.Verify(ctx);
        const teaBasicInfoRepository = getManager().getRepository(User_Teacher);
        console.log(ctx.state.user.id)

       const tea = await teaBasicInfoRepository.findOneBy({ teacherNo: ctx.state.user.id });
       console.log(tea);

    
        if (tea) {
          ctx.status = 200;
          ctx.body = {
            code: 1,
            datas: tea,
          };
          
        } else {
          ctx.status = 200;
          ctx.body = {
            code: -1,
            msg:'用户不存在',
          }
        }
      }

      public static async changeInfo(ctx: Context) {
        await Auth.Verify(ctx)
        await getConnection()
        .createQueryBuilder()
        .update(User_Teacher)
        .set({direction: ctx.request.body.direction, 
          teaCourse: ctx.request.body.teaCourse,
          book: ctx.request.body.book})
        .where("teacherNo = :teacherNo",{teacherNo: ctx.state.user.id})
        .execute();
        ctx.status = 200;
        ctx.body = {
          code: 1,
        };



      }

      //管理员端增加教师基本信息
      public static async addTeaBasicInfo(ctx: Context) {
        console.log(ctx.request.body) 
        const teaBasicInfoRepository = getManager().getRepository(User_Teacher);
        const tea = await teaBasicInfoRepository.findOneBy({ teacherNo: ctx.request.body.teacherNo });
        if(tea){
          console.log('11111')
          ctx.status = 200;
          ctx.body = {
            code: -1,
            msg: '用户已存在'
          };

        }else{
          console.log('222')
          const newTea = new User_Teacher();
          newTea.user = ctx.request.body.teacherNo;       //外键有点问题
          newTea.teacherNo = ctx.request.body.teacherNo;
          newTea.name = ctx.request.body.name;
          newTea.birth = ctx.request.body.birth;
          newTea.idCard = ctx.request.body.idCard;
          newTea.political = ctx.request.body.political;
          newTea.telephone = ctx.request.body.telephone;
          newTea.department = ctx.request.body.department;
          newTea.degree = ctx.request.body.degree;
          newTea.title = ctx.request.body.title;
          newTea.direction = ctx.request.body.direction;
          newTea.teaCourse = ctx.request.body.teaCourse;
          newTea.book = ctx.request.body.book;
          newTea.gender = ctx.request.body.gender;
          console.log(newTea)
          const ntea = await teaBasicInfoRepository.save(newTea);
  
          console.log('基本信息添加成功');

          ctx.status = 200;
          ctx.body = {
            code: 1,
            // datas: n,
          };
        } 
      }

      //管理员段修改教师基本信息
      public static async updateTeaBasicInfo(ctx: Context) {
    
        const teaBasicInfoRepository = getManager().getRepository(User_Teacher);
        const tea = await teaBasicInfoRepository.findOneBy({ teacherNo: ctx.request.body.teacherNo });
        if (tea) {
          await teaBasicInfoRepository.update(ctx.request.body.teacherNo, ctx.request.body);
          const updatedTea = await teaBasicInfoRepository.findOneBy({ teacherNo: ctx.request.body.teacherNo });
      
          if (updatedTea) {
            ctx.status = 200;
            ctx.body = {
              code: 1,
              
            };
          } else {
            ctx.status = 200;
            ctx.body = {
              code: -1,
              msg: '更新失败'
            };
          }
          console.log('基本信息修改成功');
            
        } else {
          ctx.body = {
            code: -1,
            msg: '用户不存在',
          };
        }

      }

      // 管理员端删除教师基本信息
      public static async deleteTeaBasicInfo(ctx: Context) {
        
        const teaBasicInfoRepository = getManager().getRepository(User_Teacher);
        console.log(ctx.request.body.teacherNo);
        const tea = await teaBasicInfoRepository.findOneBy({teacherNo: ctx.request.body.tachertNo });
        if (tea) {
          await teaBasicInfoRepository.delete(ctx.request.body.teacherNo);
    
          // console.log(tea)
          ctx.status = 200;
          ctx.body = {
            code: 1,
          };
          console.log('基本信息删除成功');
        } else {
          ctx.status = 200;
          ctx.body = {
            code: -1,
            msg: '用户不存在'
          };
        }
      
      }

}