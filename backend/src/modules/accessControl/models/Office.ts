import { Model, Table, Column, DataType, ForeignKey } from "sequelize-typescript";

@Table
export default class Office extends Model {
  office_id!: number;
  office_name!: string;
  office_description!: string;
  department_id!: number;
  // other properties...
}