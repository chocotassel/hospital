// 权限
import { Model, Table, Column, DataType, ForeignKey, PrimaryKey, AllowNull, BelongsTo, HasMany, BelongsToMany, Unique } from "sequelize-typescript";
import Role from "./Role";
import RolePermission from "./RolePermission";

@Table
export default class Permission extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Unique
  @Column(DataType.BIGINT)
  permission_id!: bigint;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(255))
  permission_name!: string;

  @BelongsToMany(() => Role, () => RolePermission)
  roles!: Role[];
}