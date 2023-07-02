// 权限
import { Model, Table, Column, DataType, ForeignKey, PrimaryKey, AllowNull, BelongsTo, HasMany, BelongsToMany } from "sequelize-typescript";
import { Role } from "./Role";
import { RolePermission } from "./RolePermission";

@Table
export class Permission extends Model {
  @PrimaryKey
  @Column(DataType.BIGINT)
  permission_id!: bigint;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  permission_name!: string;

  @BelongsToMany(() => Role, () => RolePermission)
  roles!: Role[];
}