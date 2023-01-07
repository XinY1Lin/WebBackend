//课外活动表
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn,ManyToOne } from 'typeorm';
import { User } from './user';
import { User_Student } from './user_student';

@Entity()
export class Extracurricular {
  @PrimaryGeneratedColumn()
  actNo: number;

  @Column()
  studentNo: number;

  @ManyToOne(() => User_Student, user_student => user_student.extracurriculars, {
    // cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'studentNo' })
  user_student: User_Student;

  @Column()
  stuName: string;

  @Column()
  department: string;

  @Column()
  grade: string;

  @Column()
  date: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  result: string;


}