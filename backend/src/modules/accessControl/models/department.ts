import { Model, Table, Column, DataType, ForeignKey } from "sequelize-typescript";

@Table
export default class Department extends Model {
  id!: number;
  name!: string;
  // other properties...
}