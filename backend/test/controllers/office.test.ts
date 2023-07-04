import {describe, expect, test, it} from '@jest/globals';
import request from 'supertest';
import app from '../../src/index'; // Koa应用实例
const adminToken = process.env.ADMIN_TOKEN
let officeId = '1675674884036235264'

const server = app.callback()

describe('Office Management API', () => {
  
    // 测试获取所有科室的接口
    it('should GET all offices', async () => {
      const res = await request(server)
      
        .get('/offices')
        .set('Authorization', `Bearer ${adminToken}`);
      console.log(res.body);
      expect(res.statusCode).toEqual(200);
      expect(Array.isArray(res.body.data)).toBe(true);
    });

    // 测试获取单个科室的接口
    it('should GET an existing office', async () => {
      const res = await request(server)
        .get(`/office/${officeId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      console.log(res.body);
      expect(res.statusCode).toEqual(200);
      expect(res.body.code).toEqual(0);
    });
  
    // 测试创建科室的接口
    it('should POST a new office', async () => {
      const res = await request(server)
        .post('/offices')
        .send({
          office_name: 'Test Office0',
          office_description: 'This is a test office0'
        })
        .set('Authorization', `Bearer ${adminToken}`);
      console.log('create office',res.body);
      expect(res.statusCode).toEqual(200);
      expect(res.body.code).toEqual(0);
      officeId = res.body.data.office_id;
    });
  
    // 测试更新科室的接口
    it('should PUT an existing office', async () => {
      const res = await request(server)
        .put(`/offices/${officeId}`)
        .send({
          office_name: 'Updated Test Office',
          office_description: 'This is an updated test office'
        })
        .set('Authorization', `Bearer ${adminToken}`);
      console.log('update office',res.body);
      expect(res.statusCode).toEqual(200);
      expect(res.body.code).toEqual(0);
    });
  
    // 测试删除科室的接口
    it('should DELETE an existing office', async () => {
      const res = await request(server)
        .delete(`/offices/${officeId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.code).toEqual(0);
    });
  
  }
);