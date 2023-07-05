<template>
  <!-- 书籍列表卡片 -->
  <el-card class="box-card">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="出诊单号" label-width="70px">
            <el-input clearable v-model="formInline.visit_id" placeholder="请输入单号"></el-input>
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
          label="出诊单号"
          width="300">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.visit_id }}</span>
          </template>
        </el-table-column>

          <el-table-column
          label="出诊日期"
          width="200">
        <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.visit_date }}</span>
        </template>
        </el-table-column>

        <el-table-column
          label="出诊时长"
          width="200">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.visit_hour }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="医生姓名"
          width="200">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.doctor_name }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="所属科室"
          width="200">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.department_name }}</span>
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
      <el-dialog title="出诊信息" :visible.sync="dialogFormVisible" >
        <el-form :model="form">
          <el-form-item label="出诊单号" :label-width="formLabelWidth">
            <el-input v-model="form.visit_id" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="出诊日期" :label-width="formLabelWidth">
            <el-input v-model="form.visit_date" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="出诊时长" :label-width="formLabelWidth">
            <el-input v-model="form.visit_hour" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="医生姓名" :label-width="formLabelWidth">
            <el-input v-model="form.doctor_name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="所属科室" :label-width="formLabelWidth">
            <el-input v-model="form.department_name" autocomplete="off"></el-input>
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
        :total="visit_id">
      </el-pagination>
      
    </el-card>
</template>

<script>
import axios from 'axios'
  export default {
    name: 'appointmentRecord',
    data() {
        return {
            formInline: {
              visit_id: "",
            },
            value: "",
            //列表
            tableData: [{
                    "visit_id": "",
                    "visit_date": "",
                    "visit_hour": "" + "小时",
                    "doctor_name": "",
                    "department_name": ""
                }],
            currentPage: 1,
            pageSize: 10,
            visit_id: 0,
            status:0,
            
            //编辑 添加
            dialogFormVisible: false,
            form: {
            },
            formLabelWidth: '120px',
            index:'',
        };
  },
  created() {
    this.handleQueryAll()
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
            url: `/api/visits`,
            method: 'get',
            params: {
              page: page,
              size: this.pageSize
            }
          }).then(res => {
            this.tableData = res.data
          })
      },
      handleEdit(index, row){
        console.log(row)
        this.status = 0
        this.dialogFormVisible = true
        this.index = index
      },
      handleReset() {
          this.formInline.visit_id = "";
          this.handleQueryAll()
      },
      // 查询
      handleQuery() {
        const token = localStorage.getItem('token');
        const visitId = this.formInline.visit_id;
      
        axios.get(`/api/visit/${visitId}`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        })
          .then(response => {
            if (response.data) {
              this.tableData = [response.data.data]; // 更新表格显示的数据
              console.log("111:",response.data.data)
            } else {
              this.tableData = []; // 清空表格数据
            }
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
    
      axios.post('/api/visits', this.form, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
        .then(() => {
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
    
      axios.put(`/api/visits/${this.form.visit_id}`, this.form, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
        .then(() => {
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
    
      axios.delete(`/api/visits/${row.visit_id}`, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
        .then(() => {
          this.handleQuery();
        })
        .catch(error => {
          console.error(error);
        });
    },
    handleQueryAll() {
      const token = localStorage.getItem('token');
      axios.get('/api/visits', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
        .then(response => {
          console.log(response.data.data); // 输出响应数据，检查其格式是否为数组
        
          if (Array.isArray(response.data.data)) {
            this.tableData = response.data.data; // 将响应数据转换为数组
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
}
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