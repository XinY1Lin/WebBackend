import { Context } from 'koa';
import { getManager } from 'typeorm';
import { UnauthorizedException } from '../exceptions';
import jwt from 'jsonwebtoken';
import svgCaptcha from 'svg-captcha';
import { JWT_SECRET } from '../constants';
import { NotFoundException, ForbiddenException,AlreadyExistsException } from '../exceptions'
import { User_Student } from '../entity/user_student';
import { Evaluate } from '../entity/evaluate';
import { User } from '../entity/user';
import Auth from '../authMiddleware/auth';
import { Department } from '../entity/department';

export default class EvaluateController {

    //管理员端显示所有评价记录
    public static async listEvaluation(ctx: Context) {
        const evaluateRepository = getManager().getRepository(Evaluate);
        const evaluate = await evaluateRepository.find();
        ctx.status = 200;
        ctx.body = {
          code: 1,
          datas: {
            evaluate,
          }
        };
   

    }

    //找到同班级的同学
    public static async listClass(ctx: Context) {
        await Auth.Verify(ctx);
        const stuBasicInfoRepository = getManager().getRepository(User_Student);
        const stuBasicInfo = await stuBasicInfoRepository.findOneBy({studentNo: ctx.state.user.id});
        if(stuBasicInfo){
          const myClass = await stuBasicInfoRepository.findBy({grade: stuBasicInfo.grade});
          ctx.status = 200;
          ctx.body = {
            code: 1,
            datas: {
              myClass,
            }
          };
        }
    }

    public static async evaluate(ctx: Context) {
        await Auth.Verify(ctx);
        //在数据库里找到我的名字
        const stuBasicInfoRepository = getManager().getRepository(User_Student);
        const stuBasicInfo = await stuBasicInfoRepository.findOneBy({studentNo: ctx.state.user.id});
        if(stuBasicInfo){

          const evaluateRepository = getManager().getRepository(Evaluate);
          const newEva = new Evaluate();
          newEva.evaluateName = stuBasicInfo.name;
          newEva.evaluatedName = ctx.request.body.evaluatedName;
          newEva.tag = ctx.request.body.tag;
          newEva.content = ctx.request.body.content;

          const eva = await evaluateRepository.save(newEva);
          console.log('互评信息添加成功')
          ctx.status = 200;
          ctx.body = {
            code: 1,
          };
        }else{
          ctx.status = 200;
          ctx.body = {
            code: -1,
            msg: "互评信息添加失败",
          };
        }


    }

    //管理员端删除不当评论信息
    public static async admDeleteEvaluate(ctx: Context) {
        const evaluateRepository = getManager().getRepository(Evaluate);
        const meEvaluated = await evaluateRepository.delete({evaluateNo: ctx.request.body.evaluateNo})
        ctx.status = 200;
        ctx.body = {
          code: 1,
        };
      }

    
    //删除我评价过的
    public static async deleteEvaluate(ctx: Context) {
      await Auth.Verify(ctx);
      const stuBasicInfoRepository = getManager().getRepository(User_Student);
      const stu = await stuBasicInfoRepository.findOneBy({studentNo: ctx.state.user.id});
      console.log(ctx.request.body)
      if(stu){
        const evaluateRepository = getManager().getRepository(Evaluate);
        // const meEvaluated = await evaluateRepository.delete({ evaluateName: stu.name, 
        //                       evaluatedName: ctx.request.body.evaluatedName,tag: ctx.request.body.tag,
        //                       content: ctx.request.body.content});
        const meEvaluated = await evaluateRepository.delete({evaluateNo: ctx.request.body.evaluateNo})
        ctx.status = 200;
        ctx.body = {
          code: 1,
        };
      }

    }

    //查找我评价过的
    public static async meEvaluated(ctx: Context) {
        await Auth.Verify(ctx);
        //在数据库里找到我的名字
        const stuBasicInfoRepository = getManager().getRepository(User_Student);
        const stuBasicInfo = await stuBasicInfoRepository.findOneBy({studentNo: ctx.state.user.id});
        if(stuBasicInfo){
            const evaluateRepository = getManager().getRepository(Evaluate);
            const meEvaluated = await evaluateRepository.findBy({ evaluateName: stuBasicInfo.name });
            if (meEvaluated) {
                ctx.status = 200;
                ctx.body = {
                  code: 1,
                  datas: meEvaluated,
                };
            }else{
                ctx.status = 200;
                ctx.body = {
                  code: -1,
                  msg: '您暂未评价他人，先去评价一下吧'
                };
            }
        }

    }

    //查找评价我的信息
    public static async evaluateMe(ctx: Context) {
        await Auth.Verify(ctx);
        //在数据库里找到我的名字
        const stuBasicInfoRepository = getManager().getRepository(User_Student);
        const stuBasicInfo = await stuBasicInfoRepository.findOneBy({studentNo: ctx.state.user.id});
        if(stuBasicInfo){
            const evaluateRepository = getManager().getRepository(Evaluate);
            const evaluateMe = await evaluateRepository.findBy({ evaluatedName: stuBasicInfo.name });
            if (evaluateMe) {
                ctx.status = 200;
                ctx.body = {
                  code: 1,
                  datas: evaluateMe,
                };
            }else{
                ctx.status = 200;
                ctx.body = {
                  code: -1,
                  msg: '暂时还没有人评价过你呦'
                };
            }
        }

    }






}