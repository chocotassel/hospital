// 角色权限
import { Model, Table, Column, DataType, ForeignKey, PrimaryKey, AllowNull, BelongsTo, HasMany } from "sequelize-typescript";
import Role from "./Role";
import Permission from "./Permission";

@Table
export default class RolePermission extends Model {
  @ForeignKey(() => Role)
  @Column(DataType.BIGINT)
  role_id!: bigint;

  @ForeignKey(() => Permission)
  @Column(DataType.BIGINT)
  permission_id!: bigint;

  @BelongsTo(() => Role)
  role!: Role;

  @BelongsTo(() => Permission)
  permission!: Permission;
}