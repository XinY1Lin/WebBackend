import { Context } from 'koa';
import { getManager } from 'typeorm';
import { User_Student } from '../entity/user_student';
import Auth from '../authMiddleware/auth';
import { Blog } from '../entity/blog';

export default class BlogController {
    public static async addBlog(ctx: Context) {
        await Auth.Verify(ctx);

        const blog = new Blog();
        blog.studentNo = ctx.state.user.id;
        blog.title = ctx.request.body.title;
        blog.content = ctx.request.body.content;
        blog.date = ctx.request.body.date;
        blog.html = ctx.request.body.html;

        const blogRepository = getManager().getRepository(Blog);
        const nblog = await blogRepository.save(blog);

        ctx.status = 200;
        ctx.body = {
          code: 1,
        };
    }

    public static async updateBlog(ctx: Context) {
      const blogRepository = getManager().getRepository(Blog);
      await blogRepository.update(ctx.request.body.blogNo, ctx.request.body);
      ctx.status = 200;
      ctx.body = {
        code: 1,
        
      };

    }

    public static async deleteBlog(ctx: Context) {
        await Auth.Verify(ctx);
        const blogRepository = getManager().getRepository(Blog);
        const blog = await blogRepository.findOneBy({studentNo: ctx.state.user.id, title: ctx.request.body.title});
        if(blog){
            await blogRepository.delete({studentNo: ctx.state.user.id, title: ctx.request.body.title});
            ctx.status = 200;
            ctx.body = {
              code: 1,
            };
            console.log('博客删除成功');
        }else{
            ctx.status = 200;
            ctx.body = {
              code: -1,
            };
            console.log('博客不存在');
        }      
    }

    public static async listBlogs(ctx: Context) {
        await Auth.Verify(ctx);
        const blogRepository = getManager().getRepository(Blog);
        const blogs = await blogRepository.findBy({studentNo: ctx.state.user.id});

        ctx.status = 200;
        ctx.body = {
          code: 1,
          datas: {
            blogs,
          }
        };
    }

    public static async blogDetail(ctx: Context) {
        await Auth.Verify(ctx);
        const blogRepository = getManager().getRepository(Blog);
        const blog = await blogRepository.findOneBy({studentNo: ctx.state.user.id, title: ctx.request.body.title});
        ctx.body = {
            code: 1,
            datas: {
              blog,
            }
          };

    }

}