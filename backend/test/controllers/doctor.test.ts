import {describe, expect, test, it} from '@jest/globals';
import request from 'supertest';
import app from '../../src/index'; // Koa应用实例
const adminToken = process.env.ADMIN_TOKEN
let doctorId = '1675674884111863808'

const server = app.callback()

describe('Doctor Management API', () => {

  // 测试获取所有医生的接口
  it('should GET all doctors', async () => {
    const res = await request(server)
      
      .get('/doctors')
      .set('Authorization', `Bearer ${adminToken}`);
    console.log(res.body);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  }
  );

  // 测试获取单个医生的接口
  it('should GET an existing doctor', async () => {
    const res = await request(server)
      .get(`/doctors/${doctorId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    console.log('get doctor',res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body.code).toEqual(0);
  }
  );

  // 测试创建医生的接口
  it('should POST a new doctor', async () => {
    const res = await request(server)
      .post('/doctors')
      .send({
        doctor_name: 'Test Doctor',
        gender: '男',
        date_of_birth: new Date('1999-01-01'),
        identity_card: '123456789012345678',
        phone_number: '12345678901',
        registration_fee: 100,
        office_id: '1675674884036235264',
        employee_number: '0101210001',
      })
      .set('Authorization', `Bearer ${adminToken}`);
    console.log('create doctor',res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body.code).toEqual(0);
  }

  );

  // 测试更新医生的接口
  it('should PUT an existing doctor', async () => {
    const res = await request(server)
      .put(`/doctors/${doctorId}`)
      .send({
        doctor_name: 'Test Doctor',
        gender: '男',
        date_of_birth: new Date('1999-01-01'),
        identity_card: '123456789012345678',
        phone_number: '12345678901',
        registration_fee: 100,
        office_id: '1675674884036235264',
        employee_number: '0101210001',
      })
      .set('Authorization', `Bearer ${adminToken}`);
    console.log('update doctor',res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body.code).toEqual(0);
  }

  );

  // 测试删除医生的接口
  it('should DELETE an existing doctor', async () => {
    const res = await request(server)
      .delete(`/doctors/${doctorId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    console.log('delete doctor',res.body);
    expect(res.statusCode).toEqual(200);
    expect(res.body.code).toEqual(0);
  });

}
);
