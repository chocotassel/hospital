// 用户
import { Model, Table, Column, DataType, ForeignKey, PrimaryKey, AllowNull, BelongsTo, HasMany, Unique } from "sequelize-typescript";
import Role from "./Role";

@Table
export default class User extends Model {
  [x: string]: any;
  @PrimaryKey
  @AllowNull(false)
  @Unique
  @Column(DataType.BIGINT)
  user_id!: bigint;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  username!: string;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(15))
  phone_number!: string;

  @AllowNull(false)
  @Column(DataType.STRING(64))
  password!: string;

  @ForeignKey(() => Role)
  @Column(DataType.BIGINT)
  role_id!: bigint;
  
  @PrimaryKey
  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(15))
  employee_number!: string;

  @BelongsTo(() => Role)
  role!: Role;
}