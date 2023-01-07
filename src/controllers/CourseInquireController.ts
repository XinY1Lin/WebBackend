import { Context } from 'koa';
import { getManager } from 'typeorm';
import jwt from 'jsonwebtoken';
import { Extracurricular } from '../entity/extracurricular';
import { JWT_SECRET } from '../constants';
import { NotFoundException, ForbiddenException, UnauthorizedException } from '../exceptions'
import Auth from '../authMiddleware/auth';
import { Course } from '../entity/course';
import { User_Teacher } from '../entity/user_teacher';

export default class CourseInquireController {
  //教师端查询个人学期课表
  public static async showTermSchedule(ctx: Context) {
    await Auth.Verify(ctx);
    const teacherRepository = getManager().getRepository(User_Teacher);
    const teacherInfo = await teacherRepository.findOneBy({ teacherNo: ctx.state.user.id })
    //必须是“findOneBy”这样才是只查一个，不然得到的就是数组类型下面无法“.name”，同时建表时就需要教师名字不重复
    if (teacherInfo) {
      const courseRepository = getManager().getRepository(Course);
      const teachSchedule = await courseRepository.findBy({ teacherName: teacherInfo.name, term: ctx.request.body.term });

      console.log("\n teachSchedule: \n")
      console.log(teachSchedule)
      if (teachSchedule) {
        ctx.status = 200;
        ctx.body = {
          code: 1,
          datas: teachSchedule,
        };
      } else {
        ctx.status = 200;
        ctx.body = {
          code: -1,
          msg: '课表不存在',
        }
      }
    } else {
      ctx.status = 200;
      ctx.body = {
        code: -1,
        msg: '教师不存在',
      }
    }
  }

  // //教师端查询教室课表
  // public static async showClassroomSchedule(ctx: Context) {
  //   await Auth.Verify(ctx);
  //   const courseRepository = getManager().getRepository(Course);
  //   const classSchedule = await courseRepository.findBy({ term: ctx.request.body.term, area: ctx.request.body.area, room: ctx.request.body.room });

  //   if (classSchedule) {
  //     ctx.status = 200;
  //     ctx.body = {
  //       code: 1,
  //       datas: classSchedule,
  //     };
  //   } else {
  //     ctx.status = 200;
  //     ctx.body = {
  //       code: -1,
  //       msg: '课程不存在',
  //     }
  //   }
  // }
    //教师端查询教室课表
    public static async showClassroomSchedule(ctx: Context) {
      await Auth.Verify(ctx);
      const teacherRepository = getManager().getRepository(User_Teacher);
      const teacherInfo = await teacherRepository.findOneBy({ teacherNo: ctx.state.user.id })
      //必须是“findOneBy”这样才是只查一个，不然得到的就是数组类型下面无法“.name”，同时建表时就需要教师名字不重复
      if (teacherInfo) {
        const courseRepository = getManager().getRepository(Course);
        const teachSchedule = await courseRepository.findBy({ teacherName: teacherInfo.name, term: ctx.request.body.term });
  
        console.log("\n teachSchedule: \n")
        console.log(teachSchedule)
        if (teachSchedule) {
          ctx.status = 200;
          ctx.body = {
            code: 1,
            datas: teachSchedule,
          };
        } else {
          ctx.status = 200;
          ctx.body = {
            code: -1,
            msg: '课表不存在',
          }
        }
      } else {
        ctx.status = 200;
        ctx.body = {
          code: -1,
          msg: '教师不存在',
        }
      }
    }

}