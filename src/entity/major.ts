// 专业表
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Major {
  @PrimaryColumn()
  majorNo: number;

  @Column()
  majorName: string;

  @Column()
  department: string;
}
