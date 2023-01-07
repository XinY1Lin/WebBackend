import { Context } from 'koa';
import { getManager } from 'typeorm';
import { Social_Prc } from '../entity/social_prc';
import { User_Student } from '../entity/user_student';
import { OpenCourse } from '../entity/openCourse';
import { NotFoundException, ForbiddenException, UnauthorizedException } from '../exceptions'
import Auth from '../authMiddleware/auth';
import { SelectRecord } from '../entity/selectRecord';
import { Course } from '../entity/course';

export default class SelectCourseController {

  //学生端显示要选的课
  public static async listCourse(ctx: Context) {
    await Auth.Verify(ctx);
    const openRepository = getManager().getRepository(OpenCourse);
    const open = await openRepository.findOneBy({ openNo: 1 });
    if (open?.isOpen == 1) {
      const studentRepository = getManager().getRepository(User_Student);
      const student = await studentRepository.findOneBy({ studentNo: ctx.state.user.id });
      const courseRepository = getManager().getRepository(Course);
      const course = await courseRepository.findBy({ department: student?.department, grade: student?.grade });
      ctx.status = 200;
      ctx.body = {
        code: 1,
        datas: {
          course,
        }
      };

    } else {
      ctx.status = 200;
      ctx.body = {
        code: -1,
        msg: '选课还未开始'
      };
    }
  }
  //学生选课
  public static async selectCourse(ctx: Context) {
    await Auth.Verify(ctx);
    var flag: boolean = true;
    const studentRepository = getManager().getRepository(User_Student);
    const student = await studentRepository.findOneBy({ studentNo: ctx.state.user.id });
    const courseRepository = getManager().getRepository(Course);
    const course = await courseRepository.findOneBy({ courseNo: ctx.request.body.courseNo });
    var selectedStu=0;
    var totalStu=0;
    if(course?.selectedStu) selectedStu = course.selectedStu;
    if(course?.totalStu) totalStu = course.totalStu;
    if (selectedStu < totalStu) {
      if (student && course) {
        const recordRepository = getManager().getRepository(SelectRecord);
        const rec = await recordRepository.findOneBy({ student: student, course: course });
        if (rec) {
          ctx.status = 200;
          ctx.body = {
            code: -1,
            msg: '不可重复选课'
          }
        } else {
          const record = await recordRepository.findBy({ student: student });
          record.forEach((record) => {
            if (record.course.day == ctx.request.body.day &&
              record.course.time == ctx.request.body.time &&
              record.course.term == ctx.request.body.term) {
              flag = false;
            }
          })
          if (flag) {
            const newRecord = new SelectRecord();
            newRecord.student = student;
            newRecord.course = course;
            newRecord.score = 0;
            newRecord.classRank = 0;
            course.selectedStu += 1;
            const record = await recordRepository.save(newRecord);
            const cour = await courseRepository.update({ courseNo: ctx.request.body.courseNo }, course);

            ctx.status = 200;
            ctx.body = {
              code: 1,
            };
          } else {
            ctx.status = 200;
            ctx.body = {
              code: -1,
              msg: '所选课程与已选课程时间冲突'
            };
          }
        }
      } else {
        ctx.status = 200;
        ctx.body = {
          code: -1,
          msg: '选课失败'
        };
      }
    } else {
      ctx.status = 200;
      ctx.body = {
        code: -1,
        msg: '选课人数已满，无法选课'
      };
    }
  }

  //学生端退课
  public static async deleteSelect(ctx: Context) {
    await Auth.Verify(ctx);
    const studentRepository = getManager().getRepository(User_Student);
    const student = await studentRepository.findOneBy({ studentNo: ctx.state.user.id });
    const courseRepository = getManager().getRepository(Course);
    const course = await courseRepository.findOneBy({ courseNo: ctx.request.body.courseNo });
    const recordRepository = getManager().getRepository(SelectRecord);
    if (student && course) {
      const rec = await recordRepository.findOneBy({ student: student, course: course });
      if (rec) {
        course.selectedStu -= 1;
        const cour = await courseRepository.update({ courseNo: ctx.request.body.courseNo }, course);
        await recordRepository.delete(rec);
        ctx.status = 200;
        ctx.body = {
          code: 1,
        };
        console.log('退课成功');
      } else {
        ctx.status = 200;
        ctx.body = {
          code: -1,
          msg: '您还未选过此课'
        }
      }
    } else {
      ctx.status = 200;
      ctx.body = {
        code: -1,
        msg: '退课失败'
      }
    }
  }
}
