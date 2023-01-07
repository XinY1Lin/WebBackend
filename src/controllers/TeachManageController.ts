//教师端第二个页面-教学管理下的方法
import { Context } from 'koa';
import { Course } from '../entity/course';
import { getManager } from 'typeorm';
import Auth from '../authMiddleware/auth';
import { User_Teacher } from '../entity/user_teacher';
import { SelectRecord } from '../entity/selectRecord';
import StudentAdminController from './StudentAdmin';
import { User_Student } from '../entity/user_student';
import { editStatus } from '../entity/editStatus';


export default class TeachManageController {
  //教师端查询个人教学任务
  public static async showTeachManage(ctx: Context) {
    await Auth.Verify(ctx);
    const teacherRepository = getManager().getRepository(User_Teacher);
    const teacherInfo = await teacherRepository.findOneBy({ teacherNo: ctx.state.user.id })
    //必须是“findOneBy”这样才是只查一个，不然得到的就是数组类型下面无法“.name”，同时建表时就需要教师名字不重复
    if (teacherInfo) {
      const courseRepository = getManager().getRepository(Course);
      const teachManage = await courseRepository.findBy({ teacherName: teacherInfo.name,term:ctx.request.body.term  });

      console.log(teachManage)
      if (teachManage) {
        ctx.status = 200;
        ctx.body = {
          code: 1,
          datas: teachManage,
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

  //教师端查询教学课程
  public static async showCourse(ctx: Context) {
    await Auth.Verify(ctx);
    const teacherRepository = getManager().getRepository(User_Teacher);
    const teacherInfo = await teacherRepository.findOneBy({ teacherNo: ctx.state.user.id })
    if (teacherInfo) {
      const courseRepository = getManager().getRepository(Course);
      const courses = await courseRepository.findBy({ teacherName: teacherInfo.name, term: ctx.request.body.term })
      if (courses) {
        ctx.status = 200;
        ctx.body = {
          code: 1,
          datas: courses,
        }
      } else {
        ctx.status = 200;
        ctx.body = {
          code: -1,
          msg: '课程不存在',
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

  //教师端查询教学班级
  public static async showTeachCourse(ctx: Context) {
    await Auth.Verify(ctx);
    const teacherRepository = getManager().getRepository(User_Teacher);
    const teacherInfo = await teacherRepository.findOneBy({ teacherNo: ctx.state.user.id })//
    //必须是“findOneBy”这样才是只查一个，不然得到的就是数组类型下面无法“.name”，同时建表时就需要教师名字不重复
    if (teacherInfo) {
      //console.log(ctx.request.body.id)
      //课程名应该是前端返回的，选了才会出现
      const courseRepository = getManager().getRepository(Course);
      const courseInfo = await courseRepository.findOneBy({ courseName: ctx.request.body.courseName, teacherName: teacherInfo.name });//返回的是名字还是学号？

      if (courseInfo) {

        const scoreRepository = getManager().getRepository(SelectRecord);
        const scoreInfo = await scoreRepository.findBy({ course: courseInfo })
        //console.log(scoreInfo)
        //还有“标签”的属性 //查到的应该是整个学生的信息吧

        if (scoreInfo) {
          //console.log(scoreInfo)
          ctx.status = 200;
          ctx.body = {
            code: 1,
            datas: scoreInfo,
          };
        } else {
          ctx.status = 200;
          ctx.body = {
            code: -1,
            msg: '成绩不存在',
          }
        }
      } else {
        ctx.status = 200;
        ctx.body = {
          code: -1,
          msg: '课程不存在',
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

  //教师端添加学生成绩信息+标签信息
  public static async updateStudentScore(ctx: Context) {
    await Auth.Verify(ctx);

    const arr = ctx.request.body.scoreList;
    console.log(ctx.request.body.scoreList);
    arr.forEach(async (element: any) => {
      const studentNo = element.studentNo;
      const score = element.score;
      if (score>=0&&score<=100) {

        const teacherRepository = getManager().getRepository(User_Teacher);
        const teacherInfo = await teacherRepository.findOneBy({ teacherNo: ctx.state.user.id })

        if (teacherInfo) {
          const studentRepository = getManager().getRepository(User_Student);
          const student = await studentRepository.findOneBy({ studentNo: studentNo });
          const courseRepository = getManager().getRepository(Course);
          const course = await courseRepository.findOneBy({ courseName: ctx.request.body.courseName, teacherName: teacherInfo.name });

          if (student && course) {
            const recordRepository = getManager().getRepository(SelectRecord);
            let newRecord = await recordRepository.findOneBy({ student: student, course: course })
            if (newRecord) {
              newRecord.score = score;
              await recordRepository.save(newRecord);

              console.log("\n studentNo: \n")
              console.log(studentNo);
              console.log("\n score: \n")
              console.log(score);
              console.log("\n courseNmae: \n")
              console.log(ctx.request.body.courseName);
              
              ctx.status = 200;
              ctx.body = {
                code: 1,
              }
            } else {
              ctx.status = 200;
              ctx.body = {
                code: -1,
                msg: '选课记录不存在'
              };
            }
          } else {
            ctx.status = 200;
            ctx.body = {
              code: -1,
              msg: '课程或学生不存在'
            };
          }
        } else {
          ctx.status = 200;
          ctx.body = {
            code: -1,
            msg: '教师不存在'
          };
        }
      } else {
        ctx.status = 200;
        ctx.body = {
          code: -1,
          msg: '成绩未写入或成绩超出'
        };
      }
    });
  }

  // //教师端提交学生成绩
  // public static async submitStuScore(ctx: Context) {
  //   await Auth.Verify(ctx);
  //   const scoreRepository = getManager().getRepository(SelectRecord);
  //   const scoreInfo = await scoreRepository.find()
  //   if (scoreInfo) {
  //     ctx.status = 200;
  //     ctx.body = {
  //       code: 1,
  //       datas: scoreInfo,
  //     };
  //   } else {
  //     ctx.status = 200;
  //     ctx.body = {
  //       code: -1,
  //       msg: '成绩不存在',
  //     }
  //   }
  // }

  // //教师端查询编辑状态
  // public static async ifEditStatus(ctx: Context) {
  //   await Auth.Verify(ctx);
  //   const editRepository = getManager().getRepository(editStatus);
  //   const status = await editRepository.find();

  //   ctx.status = 200;
  //   ctx.body = {
  //     code: 1,
  //     datas: status,
  //   };
  // }

  // //教师端更改编辑状态
  // public static async upupdateEditStatus(ctx: Context) {
  //   await Auth.Verify(ctx);
  //   const newStatus = new editStatus();
  //   newStatus.status = ctx.request.body.status;
  //   const editRepository = getManager().getRepository(editStatus);
  //   const updateStatus = await editRepository.save(newStatus);

  //   ctx.status = 200;
  //   ctx.body = {
  //     code: 1,
  //   };
  // }

  // //教师端-教学班级页面查询方法
  // public static async teaQuery(ctx: Context) {
  //   await Auth.Verify(ctx);
  //   const scoreRepository = getManager().getRepository(SelectRecord);
  //   const result = await scoreRepository.findBy(ctx.request.body.input);
  //   if (result) {
  //     ctx.status = 200;
  //     ctx.body = {
  //       code: 1,
  //       datas: result,
  //     };
  //   } else {
  //     ctx.status = 200;
  //     ctx.body = {
  //       code: -1,
  //       msg: '结果不存在',
  //     }
  //   }
  // }


}