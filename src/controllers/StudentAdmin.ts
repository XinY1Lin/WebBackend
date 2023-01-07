import { Context } from 'koa';
import * as argon2 from 'argon2';
import { getManager } from 'typeorm';
import jwt from 'jsonwebtoken';
import svgCaptcha from 'svg-captcha';
import { User_Student } from '../entity/user_student';
import { JWT_SECRET } from '../constants';
import { ForbiddenException } from '../exceptions';

export default class StudentAdminController {
  public static async insertStudent(ctx: Context) {
    console.log('001')
    console.log(ctx.request.body);

    const userStudentRepository = getManager().getRepository(User_Student);
    const newStudent = new User_Student();
    newStudent.studentNo = ctx.request.body.studentNo;
    newStudent.name = ctx.request.body.name;
    newStudent.gender = ctx.request.body.gender;
    newStudent.graduateSchool = ctx.request.body.graduateSchool;
    newStudent.birthDate = ctx.request.body.birthDate;
    newStudent.identityNum = ctx.request.body.identityNum;
    newStudent.politicalAppearance = ctx.request.body.politicalAppearance;
    newStudent.phoneNum = ctx.request.body.phoneNum;
    newStudent.department = ctx.request.body.department;
    newStudent.class = ctx.request.body.class;
    newStudent.status = ctx.request.body.status;
    const student = await userStudentRepository.insert(newStudent);
    console.log('student')
    console.log(student)
    ctx.status = 200;
    ctx.body = {
      status: 20,
      code: 1,
      inserted: student,
    };
  }

  public static async getStuData(ctx: Context) {
    ctx.body = {
      status: 20,
      code: 1,
    };
  }
}
