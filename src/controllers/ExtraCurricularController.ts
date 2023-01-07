import { Context } from 'koa';
import { getManager } from 'typeorm';
import jwt from 'jsonwebtoken';
import { Extracurricular } from '../entity/extracurricular';
import { User } from '../entity/user';
import { JWT_SECRET } from '../constants';
import { NotFoundException, ForbiddenException, UnauthorizedException } from '../exceptions'
import Auth from '../authMiddleware/auth';

export default class ExtraCurricularController {

    //展示表中所有信息
      public static async listExCurricular(ctx: Context) {
        const exCurricularRepository = getManager().getRepository(Extracurricular);
        const exCurriculars = await exCurricularRepository.findBy({ department: ctx.request.body.dpt, grade: ctx.request.body.grade});
        console.log(exCurriculars)
        ctx.status = 200;
        ctx.body = {
            status: 20,
            code: 1,
            datas: {
                exCurriculars,
            }
          };
      }
  
      //学生端展示某个人社会实践信息
      public static async showExCurricularDetail(ctx: Context) {
        await Auth.Verify(ctx);
        const exCurricularRepository = getManager().getRepository(Extracurricular);
        const exCurricular = await exCurricularRepository.findBy({ studentNo: +ctx.state.user.id });
    
        if (exCurricular) {
          ctx.status = 200;
          ctx.body = {
            code: 1,
            datas: exCurricular,
          };
        } else {
          ctx.status = 200;
            ctx.body = {
              code: -1,
              msg:'用户不存在',
            }
        }
      }
  
      public static async addExCurricular(ctx: Context) {
        const exCurricularRepository = getManager().getRepository(Extracurricular);
        const userRepository = getManager().getRepository(User);
        const user = await userRepository.findOneBy({ name: ctx.request.body.studentNo });
        if(user){
          const newCur = new Extracurricular();
          newCur.stuName = ctx.request.body.stuName;
          // newCur.stuNo = ctx.request.body.stuName;
          newCur.studentNo = ctx.request.body.studentNo;
          newCur.department = ctx.request.body.department;
          newCur.grade = ctx.request.body.grade;
          newCur.date = ctx.request.body.date;
          newCur.title = ctx.request.body.title;
          newCur.content = ctx.request.body.content;
          newCur.result = ctx.request.body.result;
    
          const prc = await exCurricularRepository.save(newCur);
          console.log('课外活动信息添加成功')
  
          ctx.status = 200;
          ctx.body = {
            code: 1,
          };
        }else{
          ctx.status = 200;
          ctx.body = {
            code: -1,
            msg: '用户未注册'
          };
        }
        
  
      }
  
      public static async deleteExCurricular(ctx: Context) {
          
        const exCurricularRepository = getManager().getRepository(Extracurricular);
        await exCurricularRepository.delete({studentNo: ctx.request.body.studentNo, title: ctx.request.body.title});
    
        ctx.status = 200;
        ctx.body = {
          status: 200,
          code: 1,
        };
        console.log('课外活动信息删除成功');
      }
  
      public static async updateExCurricular(ctx: Context) {
      
        const exCurricularRepository = getManager().getRepository(Extracurricular);
        //根据学生姓名跟社会实践名称唯一确定一条信息
          await exCurricularRepository.update({ stuName: ctx.request.body.stuName, title: ctx.request.body.title}, ctx.request.body);
          const exCurricular = await exCurricularRepository.findOneBy({ stuName: ctx.request.body.stuName, title: ctx.request.body.title});
      
          if (exCurricular) {
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
          console.log('课外活动信息修改成功');
  
      }
  
  
  
  
  
  
      
    
     
  }

