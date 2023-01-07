import { Context } from 'koa';
import { getConnection, getManager } from 'typeorm';
import { User_Student } from '../entity/user_student';
import { Course } from '../entity/course';
import { OpenCourse } from '../entity/openCourse';
import Auth from '../authMiddleware/auth';

export default class CourseController {
  //管理员端显示开课信息
  public static async listCourse(ctx: Context) {
    const courseRepository = getManager().getRepository(Course);
    const course = await courseRepository.findBy({ department: ctx.request.body.dpt, grade: ctx.request.body.grade });
    //, term: ctx.request.body.term
    console.log
    ctx.status = 200;
    ctx.body = {
      code: 1,
      datas: {
        course,
      }
    };

  }

  //管理员端查看选课开关状态
  public static async loadState(ctx: Context) {
    const openRepository = getManager().getRepository(OpenCourse);
    const open = await openRepository.findOneBy({ openNo: 1 })
    console.log(open);
    ctx.status = 200;
    ctx.body = {
      code: 1,
      datas: open,
    };
  }
  //管理员端开启或关闭选课
  public static async openOrCloseCourse(ctx: Context) {
    const courseRepository = getManager().getRepository(OpenCourse);
    const course = await courseRepository.findOneBy({ openNo: 1 });

    await getConnection()
      .createQueryBuilder()
      .update(OpenCourse)
      .set({ isOpen: !course?.isOpen })
      .where("openNo = :openNo", { openNo: 1 })
      .execute();

    ctx.status = 200;
    ctx.body = {
      code: 1,
    };


  }

  public static async addCourse(ctx: Context) {
    const courseRepository = getManager().getRepository(Course);
    const crs = await courseRepository.findOneBy({ courseNo: ctx.request.body.courseNo });
    if (crs) {
      ctx.status = 200;
      ctx.body = {
        code: -1,
        msg: '不可重复添加课程'
      };

    } else {
        // console.log(ctx.request.body);
        const newCourse = new Course();
        newCourse.courseNo = ctx.request.body.courseNo;
        newCourse.courseName = ctx.request.body.courseName;
        newCourse.teacherName = ctx.request.body.teacherName;
        newCourse.credit = ctx.request.body.credit;
        newCourse.overallHour = ctx.request.body.overallHour;
        newCourse.courseType = ctx.request.body.courseType;
        newCourse.department = ctx.request.body.department;
        newCourse.grade = ctx.request.body.grade;
        newCourse.term = ctx.request.body.term;
        newCourse.totalStu = ctx.request.body.totalStu;
        newCourse.selectedStu = 0;
        newCourse.area = ctx.request.body.area;
        newCourse.room = ctx.request.body.room;
        newCourse.day = ctx.request.body.day;
        newCourse.time = ctx.request.body.time;

        const course = await courseRepository.save(newCourse);

        console.log('课程信息添加成功');
        ctx.status = 200;
        ctx.body = {
          code: 1,
        };
      }
    }

  

  //管理员段修改开课信息
  public static async updateCourse(ctx: Context) {

    const courseRepository = getManager().getRepository(Course);
    const course = await courseRepository.findOneBy({ courseNo: ctx.request.body.courseNo });
    if (course) {
      await courseRepository.update(ctx.request.body.courseNo, ctx.request.body);
      const updatedCourse = await courseRepository.findOneBy({ courseNo: ctx.request.body.courseNo });

      if (updatedCourse) {
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
      console.log('课程信息修改成功');

    } else {
      ctx.body = {
        code: -1,
        msg: '该条课程信息不存在',
      };
    }

  }

  // 管理员端删除课程信息
  public static async deleteCourse(ctx: Context) {

    const courseRepository = getManager().getRepository(Course);
    const course = await courseRepository.findOneBy({ courseNo: ctx.request.body.courseNo });
    if (course) {
      await courseRepository.delete(ctx.request.body.courseNo);

      ctx.status = 200;
      ctx.body = {
        code: 1,
      };
      console.log('课程信息删除成功');
    } else {
      ctx.status = 200;
      ctx.body = {
        code: -1,
        msg: '课程信息不存在'
      };
    }

  }




}