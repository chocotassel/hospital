<template>
  <!-- 书籍列表卡片 -->
  <el-card class="box-card">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="医生姓名" label-width="70px">
            <el-input clearable v-model="formInline.doctor_name" placeholder="请输入医生姓名"></el-input>
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
            <img :src="scope.row.photoUrl" style="width: 100px; height: 100px;" />
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
            <el-select v-model="form.department_id" placeholder="请选择所属诊室">
              <el-option
                v-for="item in departmentsData"
                :key="item.office_id"
                :label="item.office_name"
                :value="item.office_id">
              </el-option>
            </el-select>
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
        doctor_name: "",
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
        photoUrl: ""
      }],
      departmentOptions:[],
      departmentsData: [],
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
    handleReset() {
      this.formInline.doctor_name = "";
      this.handleQueryAll()
    },

      //查询全部
      handleQueryAll() {
      const token = localStorage.getItem('token');
      const page = 1; // 页码
      const limit = 10; // 每页显示的数量
        
      axios.get('/api/doctors', {
        params: {
          page,
          limit
        },
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
        .then(response => {
          console.log(response.data.data.data); // 输出响应数据，检查其格式是否符合预期
      
          if (Array.isArray(response.data.data.data)) {
            this.tableData = response.data.data.data; 
                    
            // 遍历每个医生对象，将其对应的 office_name 存储到 doctor 对象中
            this.tableData.forEach(doctor => {
              doctor.office_name = doctor.office.office_name;
            });           
          }


        })
        .catch(error => {
          console.error(error);
        });
    },

    // 查询
    handleQuery() {
      const token = localStorage.getItem('token');
      const page = 1; // 页码
      const limit = 10; // 每页显示的数量
      const doctorName = this.formInline.doctor_name; // 搜索关键字
    
      axios.get('/api/doctors', {
        params: {
          page,
          limit,
          name: doctorName
        },
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
        .then(response => {
          console.log("单个:", response.data.data.data); // 输出响应数据，检查其格式是否符合预期
        
          if (Array.isArray(response.data.data.data)) {
            this.tableData = response.data.data.data; 
            this.tableData.forEach(doctor => {
              doctor.office_name = doctor.office.office_name;

            });  
          }
        })
        .catch(error => {
          console.error(error);
        });
    },

    handleEdit(index, row){
      const doctorId = row.employee_number;
      this.editingDoctorId = doctorId;
      this.dialogFormVisible = true;
      this.editingMode =true;
    }, 

    // 添加按钮点击事件
    handleAdd() {
      this.dialogFormVisible = true; // 显示对话框
      this.form = {}; // 将表单数据初始化为空对象
      this.editingMode = false;
    },

    // 确定按钮点击事件
    handleEditconfirm() {
      const token = localStorage.getItem('token');
    
      if (this.editingMode === true) {
        // 编辑确认
        axios.put(`/api/doctors/${this.editingDoctorId}`, this.form, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
          .then(() => {
            this.handleQueryAll();
            this.dialogFormVisible = false; // 隐藏对话框
          })
          .catch(error => {
            console.error(error);
          });
      } else {
        // 添加确认
        axios.post('/api/doctors', this.form, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
          .then(() => {
            this.handleQueryAll();
            this.dialogFormVisible = false; // 隐藏对话框
          })
          .catch(error => {
            console.error(error);
          });
      }
    },

    handleQueryAllDepartments() {
      const token = localStorage.getItem('token');
      axios.get('/api/offices', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
        .then(response => {
          console.log("1111:",response.data.data.data); // 输出响应数据，检查其格式是否为数组
        
          if (Array.isArray(response.data.data.data)) {
            this.departmentsData = response.data.data.data; 
          }
        })
        .catch(error => {
          console.error(error);
        });
    }
  },
  mounted() {
    this.handleQueryAll();
    this.handleQueryAllDepartments()
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