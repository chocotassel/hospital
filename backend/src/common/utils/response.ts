// response.ts
import { Context } from "koa";

/**
 * @description 成功响应
 * @param {Context} ctx
 * @param {Array} data
 * @param {String} msg
 * @param {Number} code
 */
function success(ctx: Context, data: any = [], msg: string = 'success', code: number = 0) {
  ctx.body = {
    code,
    msg,
    data,
  };
}

/**
 * @description 失败响应
 * @param {Context} ctx
 * @param {String} msg
 * @param {Array} data
 * @param {Number} code
 */
function fail(ctx: Context, msg: string = 'fail', data: any = [], code: number = 1) {
  ctx.body = {
    code,
    msg,
    data,
  };
}

export { 
  success, 
  fail 
};