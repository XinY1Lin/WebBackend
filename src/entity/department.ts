// 学院表
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Department {
  @PrimaryColumn()
  departmentNo: number;

  @Column()
  department: string;
}
