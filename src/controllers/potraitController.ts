import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Social_Prc } from '../entity/social_prc';
import { Achievement } from '../entity/achievement';
import { User_Student } from '../entity/user_student';
import { Evaluate } from '../entity/evaluate';
import { Extracurricular } from '../entity/extracurricular';
import { SelectRecord } from '../entity/selectRecord';
import { User } from '../entity/user';
import { NotFoundException, ForbiddenException, UnauthorizedException } from '../exceptions'
import Auth from '../authMiddleware/auth';

export default class PortraitController {
    //返回画像所用数据
    public static async listCharacter(ctx: Context) {
        await Auth.Verify(ctx);
        const socialPrcRepository = getManager().getRepository(Social_Prc);
        const socialPrc = await socialPrcRepository.findBy({ studentNo: +ctx.state.user.id });
        console.log('111')
        var social=1;
        if(socialPrc.length != 0) social = socialPrc.length;
        const exCurricularRepository = getManager().getRepository(Extracurricular);
        const exCurricular = await exCurricularRepository.findBy({ studentNo: +ctx.state.user.id });
        console.log('222')
        var exCurri=1;
        if(exCurricular.length != 0) exCurri = exCurricular.length;
        const achieveRepository = getManager().getRepository(Achievement);
        const achieve = await achieveRepository.findBy({ studentNo: +ctx.state.user.id });
        console.log('333')
        var ach=1;
        if(achieve.length != 0) ach = achieve.length;
        const stuBasicInfoRepository = getManager().getRepository(User_Student);
        const stuBasicInfo = await stuBasicInfoRepository.findOneBy({studentNo: ctx.state.user.id});
        if(stuBasicInfo){
          const selectRepository = getManager().getRepository(SelectRecord);
          const course = await selectRepository.findBy({student: stuBasicInfo});
          var cour=1;
          if(course.length != 0) cour =course.length;
          var gpa = 1;
          console.log('444')
          if(course.length != 0) gpa = course[0].score/10-5;
          const evaluateRepository = getManager().getRepository(Evaluate);
          const evaluateMe = await evaluateRepository.findBy({ evaluatedName: stuBasicInfo.name });
          var evalu=1;
          console.log('555')
          if(evaluateMe.length != 0) evalu =evaluateMe.length;
          ctx.status = 200;
          ctx.body = {
            code: 1,
            datas:{
              social,
              exCurri,
              ach,
              cour,
              gpa,
              evalu,
            }
          };
    }else{
      ctx.status = 200;
      ctx.body = {
        code: -1,
        msg: '请先联系管理员完善您的基本信息'
      }
    }
  }



}