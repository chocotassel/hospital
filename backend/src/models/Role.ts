// 角色
import { Model, Table, Column, DataType, ForeignKey, PrimaryKey, AllowNull, BelongsTo, HasMany, BelongsToMany, Unique } from "sequelize-typescript";
import User from "./User";
import Permission from "./Permission";
import RolePermission from "./RolePermission";

@Table
export default class Role extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Unique
  @Column(DataType.BIGINT)
  role_id!: bigint;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(255))
  role_name!: string;

  @HasMany(() => User)
  users!: User[];

  @BelongsToMany(() => Permission, () => RolePermission)
  permissions!: Permission[];
}