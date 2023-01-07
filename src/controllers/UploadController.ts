import { Context } from "koa";
import { getManager } from 'typeorm';

export default class UploadController {
    public static async addPhoto(ctx: Context) {
        const file = ctx.request.body;
        console.log('111')
        console.log(file.PersistentFile)
        ctx.body = {
            code: 1,
            msg: '头像上传成功',
        }
    }

}