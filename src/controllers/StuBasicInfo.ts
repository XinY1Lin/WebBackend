import { Context } from 'koa';
import { getManager } from 'typeorm';
import { User_Student } from '../entity/user_student';
import { User } from '../entity/user';
import Auth from '../authMiddleware/auth';

export default class StuBasicInfoController {
  //管理员端展示所有人的信息
    public static async listStuBasicInfo(ctx: Context) {
        const stuBasicInfoRepository = getManager().getRepository(User_Student);
        const stuBasicInfo = await stuBasicInfoRepository.findBy({ department: ctx.request.body.dpt, grade: ctx.request.body.grade});
        // const stuBasicInfo = await stuBasicInfoRepository.findBy({ department: ctx.request.body.dpt});
    
        ctx.status = 200;
        ctx.body = {
          code: 1,
          datas: {
            stuBasicInfo,
          }
        };

    }
  //用户端展示自己的信息(需要在url中传入studentNo或user)
      public static async showStuBasicInfoDetail(ctx: Context) {
        console.log('entered')
        await Auth.Verify(ctx);
        const stuBasicInfoRepository = getManager().getRepository(User_Student);
        console.log(ctx.state.user.id)

       const stu = await stuBasicInfoRepository.findOneBy({ studentNo: ctx.state.user.id });
       console.log(stu);

    
        if (stu) {
          ctx.status = 200;
          ctx.body = {
            code: 1,
            datas: stu,
          };
          
        } else {
          ctx.status = 200;
          ctx.body = {
            code: -1,
            msg:'用户不存在',
          }
        }
      }

      //管理员端增加用户基本信息
      public static async addStuBasicInfo(ctx: Context) {
        console.log(ctx.request.body)
        const userRepository = getManager().getRepository(User);
        const user = await userRepository.findOneBy({ name: ctx.request.body.studentNo });
        if(user){

          const stuBasicInfoRepository = getManager().getRepository(User_Student);
          const stu = await stuBasicInfoRepository.findOneBy({ studentNo: ctx.request.body.studentNo });
          if(stu){
            console.log('11111')
            ctx.status = 200;
            ctx.body = {
              code: -1,
              msg: '用户已存在'
            };
  
          }else{
            const newStu = new User_Student();
            newStu.user = ctx.request.body.studentNo;       //外键有点问题
            newStu.studentNo = ctx.request.body.studentNo;
            newStu.name = ctx.request.body.name;
            newStu.grade = ctx.request.body.grade;
            newStu.gender = ctx.request.body.gender;
            newStu.graduateSchool = ctx.request.body.graduateSchool;
            newStu.birthDate = ctx.request.body.birthDate;
            newStu.identityNum = ctx.request.body.identityNum;
            newStu.politicalAppearance = ctx.request.body.politicalAppearance;
            newStu.phoneNum = ctx.request.body.phoneNum;
            newStu.department = ctx.request.body.department;
            newStu.status = ctx.request.body.status;
            newStu.class = ctx.request.body.class;
            // newStu.GPA = 0;
            console.log(newStu.user)
            const nstu = await stuBasicInfoRepository.save(newStu);
    
            console.log('基本信息添加成功');

            ctx.status = 200;
            ctx.body = {
              code: 1,
              // datas: nstu,
            };
          } 
      }else{
        ctx.status = 200;
        ctx.body = {
          code: -1,
          msg: '用户未注册'
        };

      }
      }

      //管理员段修改学生基本信息
      public static async updateStuBasicInfo(ctx: Context) {
    
        const stuBasicInfoRepository = getManager().getRepository(User_Student);
        const stu = await stuBasicInfoRepository.findOneBy({ studentNo: ctx.request.body.studentNo });
        if (stu) {
          await stuBasicInfoRepository.update(ctx.request.body.studentNo, ctx.request.body);
          const updatedStu = await stuBasicInfoRepository.findOneBy({ studentNo: ctx.request.body.studentNo });
      
          if (updatedStu) {
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

      // 管理员端删除学生基本信息
      public static async deleteStuBasicInfo(ctx: Context) {
        
        const stuBasicInfoRepository = getManager().getRepository(User_Student);
        console.log(ctx.request.body.studentNo);
        const stu = await stuBasicInfoRepository.findOneBy({studentNo: ctx.request.body.studentNo });
        if (stu) {
          await stuBasicInfoRepository.delete(ctx.request.body.studentNo);
    
          // console.log(stu)
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