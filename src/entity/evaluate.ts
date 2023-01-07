import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn,ManyToOne } from 'typeorm';

@Entity()
export class Evaluate {
  @PrimaryGeneratedColumn()
  evaluateNo: number;

  //进行评价者
  @Column()
  evaluateName: string;

  //被评价者
  @Column()
  evaluatedName: string;

  //标签
  @Column()
  tag: string;

  //评价内容
  @Column()
  content: string;

}