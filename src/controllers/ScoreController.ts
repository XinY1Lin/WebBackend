import { Context } from 'koa';
import { getManager, Index } from 'typeorm';
import { Score } from '../entity/score';
import { SelectRecord } from '../entity/selectRecord';
import { User_Student } from '../entity/user_student';
import Auth from '../authMiddleware/auth';
import { Course } from '../entity/course';

export default class ScoreController {

  //查询个人成绩
  public static async checkScore(ctx: Context) {
    await Auth.Verify(ctx);
    const studentRepository = getManager().getRepository(User_Student);
    const stu = await studentRepository.findBy({ studentNo: ctx.state.user.id });
    const courseRepository = getManager().getRepository(Course);
    const course = await courseRepository.findBy({ term: ctx.request.body.term });
    console.log(course)
    //存入当前教学班级排名
    course.forEach(async (course) => {
      const recRepository = getManager().getRepository(SelectRecord);
      const rec = await recRepository.find({
        where: [{ course: course }],
        order: { score: "DESC" },
      });
      var count;//利用count实现同分的人排名相同
      for (var i = 0; i < rec.length; i++) {
        count = i;
        //只要跟前面一个人的分数相同，排名就-1，直到跟前面一个人不同
        //count >= 1 避免越界
        while (count >= 1 && rec[count].score == rec[count - 1].score) {
          count--;
        }
        rec[i].classRank = count + 1;
        await recRepository.update({ recordNo: rec[i].recordNo }, rec[i]);
      }
    })
    //查选课记录
    if (stu && course) {
      const recordRepository = getManager().getRepository(SelectRecord);
      const record = await recordRepository.findBy({ student: stu, course: course });
      console.log(record);
      ctx.status = 200;
      ctx.body = {
        code: 1,
        datas: {
          record,
        }
      };
    } else {
      ctx.status = 200;
      ctx.body = {
        code: 1,
        msg: '暂无成绩信息'
      };
    }
  }

  public static async calculateGPA(ctx: Context) {
    await Auth.Verify(ctx);
    // console.log(ctx.request.body)
    const studentRepository = getManager().getRepository(User_Student);
    const stu = await studentRepository.findOneBy({ studentNo: ctx.state.user.id });
    if (stu) {
      //根据表格中的内容计算绩点
      var scoreList = new Array();
      var credit = 0, gpa = 0, pregpa = 0;
      scoreList = ctx.request.body.scoreList;
      scoreList.forEach((scoreList) => {
        pregpa += scoreList.credit * (scoreList.score / 10 - 5);
        credit += scoreList.credit;
      })
      if (pregpa && credit) {
        gpa = Math.round(pregpa / credit * 100) / 100;
        // console.log(gpa)
        //将本学期绩点信息存起来
        const score = new Score();
        score.student = stu;
        score.gpa = gpa;
        score.term = ctx.request.body.term;
        score.grade = stu.grade;
        score.rank = 0;
        const scoreRepository = getManager().getRepository(Score);
        const exsist = await scoreRepository.findBy(score)
        if(!exsist){
          await scoreRepository.save(score);
        }
        console.log('111')
        console.log(gpa)
        
        //计算绩点排名
        // const scr = await scoreRepository.find({  //取出本学期本年级所有人绩点
        //   where: [{ term: ctx.request.body.term,grade: stu.grade}],
        //   order: { gpa: "DESC" },
        // });
        // // console.log(scr)

        // var rank = 0;
        // //用for循环在所取数组中找到本学生并读取其下标，+1作为排名
        // for(var i=0;i<scr.length;i++){
        //   if(stu.studentNo == scr[i].student.studentNo){
        //     rank = i+1;
        //     scr[i].rank = rank;
        //     console.log(scr[i])
        //     await scoreRepository.update({student: stu,term: ctx.request.body.term},scr[i]);
        //   }
        // }
        // const sco = await scoreRepository.findOneBy({student: stu,term: ctx.request.body.term})
        
        ctx.status = 200;
        ctx.body = {
          code: 1,
          datas: {
            // rank: 2,
            // gpa: 3.68,
            gpa,
          }
        };
      }
    }
  }
}