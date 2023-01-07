import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Course } from '../entity/course';
import { User_Student } from '../entity/user_student';
import { SelectRecord } from '../entity/selectRecord';
import Auth from '../authMiddleware/auth';

export default class StuCourseController {
    public static async thisTermTable(ctx: Context) {
        await Auth.Verify(ctx);
        const stuBasicInfoRepository = getManager().getRepository(User_Student);
        const stu = await stuBasicInfoRepository.findOneBy({ studentNo: ctx.state.user.id });
        if(stu){
          const recordRepository = getManager().getRepository(SelectRecord);
          const record = await recordRepository.findBy({ student: stu });
          var courses = new Array();
          record.forEach((record) => {
            if(record.course.term == ctx.request.body.term){
              courses.push(record.course)
            }
          })
          console.log(courses)
          ctx.status = 200;
          ctx.body = {
            code: 1,
            datas: courses,
          };
        }

    }
}