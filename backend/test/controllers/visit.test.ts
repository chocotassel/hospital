import {describe, expect, test, it} from '@jest/globals';
import request from 'supertest';
import app from '../../src/index'; // Koa应用实例
const adminToken = process.env.ADMIN_TOKEN
let visitId = '1676074671579729920'
let doctorId = '1676074671546044416'

const server = app.callback()

describe('Visit Management API', () => {

  // 测试获取所有出诊记录的接口
  it('should GET all visits', async () => {
    const res = await request(server)
    
      .get('/visits')
      .set('Authorization', `Bearer ${adminToken}`);
    console.log(res.body);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  // 测试获取单个出诊记录的接口
  it('should GET an existing visit', async () => {
    const res = await request(server)
      .get(`/visit/${visitId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    console.log(res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body.code).toEqual(0);
  });

  // 测试创建出诊记录的接口
  it('should POST a new visit', async () => {
    const res = await request(server)
      .post('/visits')
      .send({
        doctor_id: doctorId,
        visit_date: new Date('2021-01-01'),
        visit_hour: 1,
      })
      .set('Authorization', `Bearer ${adminToken}`);
    console.log('create visit',res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body.code).toEqual(0);
    visitId = res.body.data.doctor_id;
  });

  // 测试更新出诊记录的接口
  it('should PUT an existing visit', async () => {
    const res = await request(server)
      .put(`/visits/${visitId}`)
      .send({
        doctor_id: doctorId,
        visit_date: new Date('2021-01-01'),
        visit_hour: 2,
      })
      .set('Authorization', `Bearer ${adminToken}`);
    console.log('update visit',res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body.code).toEqual(0);
  });

  // 测试删除出诊记录的接口
  it('should DELETE an existing visit', async () => {
    const res = await request(server)
      .delete(`/visits/${visitId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    console.log('delete visit',res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body.code).toEqual(0);
  });

});
