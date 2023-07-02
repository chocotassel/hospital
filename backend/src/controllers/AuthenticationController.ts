import { Context } from 'koa';
import AuthenticationService from '../services/AuthenticationService';
import response from '../common/utils/response';
import { Rules } from 'async-validator';
import validate from '../common/utils/validate';

class AuthenticationController  {
  // 用户登录
  login = async (ctx: Context) => {
    
    // 数据校验
    const rules: Rules = {
      account: {
        type: 'string',
        required: true,
        min: 10,
        max: 11,
      },
      password: {
        type: 'string',
        required: true,
      },
    };


    const { data, error } = await validate(ctx, rules);
    if (error) {
      return response.fail(ctx, '非法数据', error, 400);
    }

    const { account, password } = data;
    try {
      const result = await AuthenticationService.loginUser(account, password);
      // 发送响应
      return response.success(ctx, result);
    } catch (err) {
      return response.fail(ctx, '服务器错误', err, 500);
    }
  }

  async index(ctx: Context) {
    ctx.body = 'Hello World!';
  }
}

export default new AuthenticationController();
