import { Model, Table, Column, DataType, ForeignKey } from "sequelize-typescript";

@Table
export default class ConsultationRoom extends Model {
  id!: number;
  name!: string;
  // other properties...
}
