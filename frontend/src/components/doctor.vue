<template>
  <!-- 书籍列表卡片 -->
  <el-card class="box-card">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="医生姓名" label-width="70px">
            <el-input clearable v-model="formInline.doctor_name" placeholder="请输入医生姓名"></el-input>
          </el-form-item>
          <el-form-item label="性别" label-width="70px">
            <el-input clearable v-model="formInline.gender" placeholder="请输入性别"></el-input>
          </el-form-item>
          <el-form-item label="电话号码" label-width="70px">
            <el-input clearable v-model="formInline.phone_number" placeholder="请输入电话号码"></el-input>
          </el-form-item>
          <el-form-item label="所属诊室" label-width="70px">
            <el-input clearable v-model="formInline.office_name" placeholder="请输入所属诊室"></el-input>
          </el-form-item>
          <el-form-item style="margin-left: 10px">
            <el-button icon="el-icon-refresh" @click="handleReset">重置</el-button>
            <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
            <el-button type="success" icon="el-icon-plus" @click="handleAdd">添加</el-button>
          </el-form-item>
        </el-form>

        <!-- 表格内容显示区域   -->
        <el-table
          :data="tableData"
          style="width: 100%">

          <el-table-column
          label="员工号"
          width="100">
        <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.employee_number }}</span>
        </template>
        </el-table-column>

          <el-table-column
          label="医生姓名"
          width="100">
        <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.doctor_name }}</span>
        </template>
        </el-table-column>

        <el-table-column
          label="性别"
          width="100">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.gender }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="出生日期"
          width="130">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.date_of_birth }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="身份证号"
          width="130">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.identity_card }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="电话号码"
          width="130">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.phone_number }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="挂号费"
          width="100">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.registration_fee }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="医生描述"
          width="130">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.description }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="所属诊室"
          width="100">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.office_name }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="照片"
          width="130">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.photo }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- Form -->
      <el-dialog title="医生信息" :visible.sync="dialogFormVisible" >
        <el-form :model="form">
          <el-form-item label="员工号" :label-width="formLabelWidth">
            <el-input v-model="form.employee_number" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="医生姓名" :label-width="formLabelWidth">
            <el-input v-model="form.doctor_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth">
            <el-input v-model="form.gender" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="出生日期" :label-width="formLabelWidth">
            <el-input v-model="form.date_of_birth" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" :label-width="formLabelWidth">
            <el-input v-model="form.identity_card" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话号码" :label-width="formLabelWidth">
            <el-input v-model="form.phone_number" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="挂号费" :label-width="formLabelWidth">
            <el-input v-model="form.registration_fee" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="医生描述" :label-width="formLabelWidth">
            <el-input v-model="form.description" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="所属诊室" :label-width="formLabelWidth">
            <el-input v-model="form.office_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="照片" :label-width="formLabelWidth">
            <el-input v-model="form.photo" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" >
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary"  @click="handleEditconfirm">确 定</el-button>
        </div>
      </el-dialog>
      <br>
      <!--   分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        @current-change="handleCurrentChange"
        :total="employee_number">
      </el-pagination>
      
    </el-card>
</template>

<script>
import axios from 'axios';

export default {
  name: 'doctor',
  data() {
    return {
      formInline: {
        employee_number: "",
        doctor_name: "",
        gender: "",
        date_of_birth: "",
        identity_card: "",
        phone_number: "",
        registration_fee: "",
        description: "",
        office_name: "",
        photo: ""
      },
      value: "",
      // 列表
      tableData: [{
        employee_number: "",
        doctor_name: "",
        gender: "",
        date_of_birth: "",
        identity_card: "",
        phone_number: "",
        registration_fee: "",
        description: "",
        office_name: "",
        photo: ""
      }],
      currentPage: 1,
      pageSize: 10,
      employee_number: 0,
      status: 0,

      // 编辑 添加
      dialogFormVisible: false,
      form: {},
      formLabelWidth: '120px',
      index: ''
    };
  },
  created() {
    this.handleQueryAll();
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(page) {
      console.log(`当前页: ${page}`);
      axios({
        url: `/api/doctors`,
        method: 'get',
        params: {
          page: page,
          size: this.pageSize
        }
      }).then(res => {
        this.tableData = res.data;
      });
    },
    handleEdit(index, row) {
      console.log(row);
      this.status = 0;
      this.dialogFormVisible = true;
      this.index = index;
    },
    handleReset() {
      this.formInline.doctor_name = "";
      this.formInline.gender = "";
      this.formInline.phone_number = "";
      this.formInline.office_name = "";
    },
    // 查询按钮点击事件
    handleQuery() {
      const token = localStorage.getItem('token');
    
      // 根据查询条件发送请求，获取医生列表
      axios.get('/api/doctors', {
        params: this.formInline,
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
        .then(response => {
          this.tableData = [response.data];
        })
        .catch(error => {
          console.error(error);
        });
    },

    // 添加按钮点击事件
    handleAdd() {
      this.dialogFormVisible = true; // 显示对话框
      this.form = {}; // 将表单数据初始化为空对象
    },

    // 确定按钮点击事件
    handleEditconfirm() {
      const token = localStorage.getItem('token');
    
      // 根据表单数据创建医生
      axios.post('/api/doctors', this.form, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
        .then(() => {
          // 创建成功，刷新医生列表
          this.handleQuery();
          this.dialogFormVisible = false; // 隐藏对话框
        })
        .catch(error => {
          console.error(error);
        });
    },

    // 编辑按钮点击事件
    handleEditConfirm() {
      const token = localStorage.getItem('token');
    
      // 根据表单数据更新医生
      axios.put(`/api/doctors/${this.form.employee_number}`, this.form, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
        .then(() => {
          // 更新成功，刷新医生列表
          this.handleQuery();
          this.dialogFormVisible = false; // 隐藏对话框
        })
        .catch(error => {
          console.error(error);
        });
    },

    // 删除按钮点击事件
    handleDelete(index, row) {
      const token = localStorage.getItem('token');
    
      // 根据医生的出诊单号删除医生
      axios.delete(`/api/doctors/${row.employee_number}`, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
        .then(() => {
          // 删除成功，刷新医生列表
          this.handleQuery();
        })
        .catch(error => {
          console.error(error);
        });
    },
    handleQueryAll() {
      const token = localStorage.getItem('token');
      axios.get('/api/doctors', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
        .then(response => {
          console.log(response.data); // 输出响应数据，检查其格式是否为数组
        
          if (Array.isArray(response.data)) {
            this.tableData = [response.data]; // 将响应数据转换为数组
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  },
  mounted() {
    // this.handleQueryAll();
  }
};
</script>






<style scoped>
.box-card {
  height: calc(100vh - 5px);
  position: relative;
}

.el-pagination {
  left: 50%;
  position: absolute;
  bottom: 3px;
  transform: translateX(-50%);
}
.el-dialog .el-input{
    width: 500px;
  }
</style>