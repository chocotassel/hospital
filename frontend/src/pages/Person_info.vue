<template>
  <div>
    <div class="personalCenter">
      <el-container>
        <el-header>个人中心</el-header>
        <el-container>
          <el-main>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <div class="img">
                  <div @click="toggleChangeAvatarDialog">
                    <el-avatar
                      :size="100"
                      :src="imageUrl"
                      box-align="center"
                    ></el-avatar>
                  </div>
                  <div class="change">
                    <el-button type="primary" icon="el-icon-edit" @click="handleEdit(info)">
                      编辑
                    </el-button>
                  </div>
                </div>
              </div>
              <el-descriptions>
                <el-descriptions-item label="医生号">{{ info.doctor_id }}</el-descriptions-item>
                <el-descriptions-item label="员工号">{{ info.employee_number }}</el-descriptions-item>
                <el-descriptions-item label="姓名">{{ info.doctor_name }}</el-descriptions-item>
                <el-descriptions-item label="性别">{{ info.gender }}</el-descriptions-item>
                <el-descriptions-item label="出生日期">{{ info.date_of_birth }}</el-descriptions-item>
                <el-descriptions-item label="身份证号">{{ info.identity_card }}</el-descriptions-item>
                <el-descriptions-item label="手机号">{{ info.phone_number }}</el-descriptions-item>
                <el-descriptions-item label="所属诊室">{{ info.office_name }}</el-descriptions-item>
                <el-descriptions-item label="挂号费">{{ info.registration_fee }}</el-descriptions-item>
                <el-descriptions-item label="自我描述">{{ info.description }}</el-descriptions-item>
              </el-descriptions>
              <br>
              <br>
            </el-card>
          </el-main>

          <!-- Form -->
          <el-dialog title="个人信息" :visible.sync="dialogVisible">
            <el-form :model="form">
              <el-form-item label="姓名" :label-width="formLabelWidth">
                <el-input v-model="form.doctor_name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="手机号" :label-width="formLabelWidth">
                <el-input v-model="form.phone_number" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="员工号" :label-width="formLabelWidth">
                <el-input v-model="form.employee_number" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="handleEditconfirm">确定</el-button>
            </div>
          </el-dialog>

          <el-dialog title="更改头像" :visible.sync="showChangeAvatarDialog">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :headers="headers"
              :show-file-list="true"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-dialog>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'personinfo',
  data() {
    return {
      i: null,
      info: {
        employee_number: '',
        doctor_name: '',
        phone_number: '',
        identity_card: '',
        gender: '',
        office_name: '',
        date_of_birth: '',
        registration_fee: '',
        description: '',
      },

      // 修改信息
      dialogVisible: false,
      form: {
        doctor_name: '',
        employee_number:'',
        phone_number: '',
      },
      formLabelWidth: '72px',
      radio: '1',
      input: '',
      showChangeAvatarDialog: false,
      editingDoctorId: null,
      imageUrl: '',
      file: null,

      token: '',
      uploadUrl: '/api/doctors/upload/',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    };
  },

  methods: {
    /// 查询
    handleQuery() {
      const token = localStorage.getItem('token');
      this.token = token;
      const employeeNumber = this.$store.state.employee_number; // 使用医生的 employee_number 字段进行查询
    
      axios.get(`/api/doctor/?employee_number=${employeeNumber}`, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
        .then(response => {
          console.log("单个:", response.data.data); // 输出响应数据，检查其格式是否符合预期
        
          if (response.data.data) {
            const doctorData = response.data.data;
            const row = {
              doctor_id:doctorData.doctor_id,
              employee_number: doctorData.employee_number,
              doctor_name: doctorData.doctor_name,
              gender: doctorData.gender,
              date_of_birth: doctorData.date_of_birth,
              office_name: doctorData.office.office_name,
              identity_card: doctorData.identity_card,
              phone_number: doctorData.phone_number,
              description: doctorData.description,
              registration_fee: doctorData.registration_fee
            };
            this.info = row;
            this.uploadUrl += doctorData.doctor_id;
          } else {
            this.info = {}; // 清空表格数据，因为未找到匹配的医生
          }
        })
        .catch(error => {
          console.error(error);
        });
    },

    handleEdit(info){
      console.log(info.doctor_id);
      const doctorId = info.doctor_id;
      this.editingDoctorId = doctorId;
      this.dialogVisible = true;
    }, 

      // 确定按钮点击事件
      handleEditconfirm() {
      const token = localStorage.getItem('token');
      // 编辑确认
      axios.put(`/api/doctors/${this.editingDoctorId}`, this.form, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
        .then(() => {
          this.handleQuery();
          this.dialogVisible = false; // 隐藏对话框
        })
        .catch(error => {
          console.error(error);
        });
    },

    toggleChangeAvatarDialog() {
      this.showChangeAvatarDialog = true;
    },
    handleAvatarSuccess(response) {
      console.log("111:",response);
      this.imageUrl = `https://localhost/${response.data.avatar}`;
      this.showChangeAvatarDialog = false;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
  },
  mounted() {
    this.handleQuery()
  },
};
</script>


<style scoped>
.el-header {
    line-height: 60px;
    text-align: center;
    background-color: #b3c0d1;
  }

  .el-container{
    height: 100vh;
    background-color: #e9eef3;
  }

  .el-aside {
    line-height: 44px;
    text-align: center;
    background-color: #d3dce6;
  }
  .el-main {
    display: flex;
    justify-content: center;
    line-height: 36px;
    text-align: center;
    height: 500px;
  }

  .demo-basic--circle {
    box-align: 'center';
    margin-top: 30px;
    margin-left: 150px;
  }
  .change .el-button{
    float: right;
  }

::v-deep .el-dialog{
  height: 430px;
  width: 800px;
}

  .block {
    margin-left: 25px;
    font-weight: bold;
  }
  .text {
    font-size: 14px;
  }
  .item {
    margin-bottom: 18px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: '';
  }
  .clearfix:after {
    clear: both;
  }

  .el-input{
    width: 400px;
  }

  .sex-change .el-button{
    float: left;
    margin-left: 10px;
  }

  .site-change .el-button{
    float: left;
    margin-top: 3px;
    margin-left: 10px;
  }

  .email-change .el-button{
    float: left;
    margin-top: 3px;
    margin-left: 10px;
  }

  .site{
    display: flex;
  }
  .site .el-input el-input--mini el-input-group el-input-group--append{
    width: 10px;
  }
  .box-card {
    width: 1368px;
    border-radius: 30px;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dashed #8c939d;
    border-radius: 6px;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

</style>