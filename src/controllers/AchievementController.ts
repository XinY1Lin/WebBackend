import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Achievement } from '../entity/achievement';
import { User } from '../entity/user';
import { NotFoundException, ForbiddenException, UnauthorizedException } from '../exceptions'
import Auth from '../authMiddleware/auth';

export default class AchievementController {

    //展示表中所有信息
      public static async listAchieve(ctx: Context) {
        const achieveRepository = getManager().getRepository(Achievement);
        //加载带有user_student的socia_prc
        const achieves = await achieveRepository.findBy({ department: ctx.request.body.dpt, grade: ctx.request.body.grade});
    
        ctx.status = 200;
        ctx.body = {
            status: 20,
            code: 1,
            datas: {
              achieves,
            }
          };
      }
  
      //学生端展示某个人社会实践信息
      public static async showAchieveDetail(ctx: Context) {
        await Auth.Verify(ctx);
        const achieveRepository = getManager().getRepository(Achievement);
        const achieve = await achieveRepository.findBy({ studentNo: +ctx.state.user.id });
    
        if (achieve) {
          ctx.status = 200;
          ctx.body = {
            code: 1,
            datas: achieve,
          };
          // ctx.body = socialPrc;
        } else {
          ctx.status = 200;
            ctx.body = {
              code: -1,
              msg:'用户不存在',
            }
        }
      }
  
      public static async addAchieve(ctx: Context) {
        const userRepository = getManager().getRepository(User);
        const user = await userRepository.findOneBy({ name: ctx.request.body.studentNo });
        if(user){
          const achieveRepository = getManager().getRepository(Achievement);
  
          const newAchieve = new Achievement();
          newAchieve.stuName = ctx.request.body.stuName;
          newAchieve.studentNo = ctx.request.body.studentNo;
          // newAchieve.user = ctx.request.body.studentNo;
          newAchieve.department = ctx.request.body.department;
          newAchieve.grade = ctx.request.body.grade;
          newAchieve.date = ctx.request.body.date;
          newAchieve.title = ctx.request.body.title;
          newAchieve.result = ctx.request.body.result;
  
          const achieve = await achieveRepository.save(newAchieve);
          console.log('成果奖励信息添加成功')
  
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
  
      public static async deleteAchieve(ctx: Context) {
          
        const achieveRepository = getManager().getRepository(Achievement);
        await achieveRepository.delete({studentNo: ctx.request.body.studentNo, title: ctx.request.body.title});
    
        ctx.status = 200;
        ctx.body = {
          status: 200,
          code: 1,
        };
        console.log('成果奖励信息删除成功');
      }
  
      public static async updateAchieve(ctx: Context) {
      
        const achieveRepository = getManager().getRepository(Achievement);
        //根据学生姓名跟社会实践名称唯一确定一条信息
          await achieveRepository.update({ stuName: ctx.request.body.stuName, title: ctx.request.body.title}, ctx.request.body);
          const achieve = await achieveRepository.findOneBy({ stuName: ctx.request.body.stuName, title: ctx.request.body.title});
      
          if (achieve) {
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
          console.log('成果奖励信息修改成功');
  
      }
     
  }