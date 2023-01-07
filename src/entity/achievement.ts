//成果奖励表
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn,ManyToOne } from 'typeorm';
import { User_Student } from './user_student';
import { User } from './user';

@Entity()
export class Achievement {
  @PrimaryGeneratedColumn()
  achieveNo: number;

  @Column()
  studentNo: number;
  @ManyToOne(() => User_Student, user_student => user_student.achievements, {
    onDelete: 'CASCADE',
    // cascade: true,
  })
  @JoinColumn({ name: 'studentNo' })
  user_student: number;

  @Column()
  stuName: string;

  @Column()
  grade: string;

  @Column()
  department: string;

  @Column()
  date: string;

  @Column()
  title: string;

  @Column()
  result: string;


}