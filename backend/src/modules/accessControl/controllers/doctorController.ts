import { Context } from 'koa';

export class DoctorController {
    public static async viewSelf(ctx: Context) {
        // 获取并返回医生自己的信息的代码
    }

    public static async modifySelf(ctx: Context) {
        // 修改医生自己的信息的代码
    }

    static async index(ctx: Context) {
        ctx.body = 'Hello, world!';
    }
}
