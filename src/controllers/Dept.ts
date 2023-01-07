import { Context } from 'koa';
import * as argon2 from 'argon2';
import { getManager } from 'typeorm';
import jwt from 'jsonwebtoken';
import svgCaptcha from 'svg-captcha';
import { Department } from '../entity/department';
import { JWT_SECRET } from '../constants';
import { ForbiddenException } from '../exceptions';

export default class DeptController {
  public static async getDeptName(ctx: Context) {
    const deptRepository = getManager().getRepository(Department);
    const depts = await deptRepository.find();
    // console.log(depts);
    ctx.status = 200;
    ctx.body = {
      code: 1,
      datas: depts,
    };
  }
}
