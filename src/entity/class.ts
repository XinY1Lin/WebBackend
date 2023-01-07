// 班级表
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Class {
  @PrimaryColumn()
  classNo: number;

  @Column()
  className: string;

  @Column()
  numberOfStudent: string;

  @Column()
  majorNo: number;
}
