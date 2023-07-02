import { Context } from 'koa';
import AuthenticationService from '../services/AuthenticationService';
import response from '../common/utils/response';
import { Rules } from 'async-validator';
import validate from '../common/utils/validate';

class AuthenticationController  {
  private authenticationService: AuthenticationService;

  constructor() {
    this.authenticationService = new AuthenticationService();
  }

  // 用户登录
  login = async (ctx: Context) => {
    
    // 数据校验
    const rules: Rules = {
      username: {
        type: 'string',
        required: true,
      },
      password: {
        type: 'string',
        required: true,
      },
    };


    const { data, error } = await validate(ctx, rules);
    if (error) {
      return response.fail(ctx, 'Invalid data', error, 400);
    }

    const { username, password } = data;
    try {
      const result = await this.authenticationService.loginUser(username, password);
      // 发送响应
      return response.success(ctx, result);
    } catch (err) {
      console.error(err);
      return response.fail(ctx, 'Internal server error', [], 500);
    }
  }

  async index(ctx: Context) {
    ctx.body = 'Hello World!';
  }
}

export default new AuthenticationController();
