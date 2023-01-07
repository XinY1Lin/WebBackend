//社会实践表
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn,ManyToOne } from 'typeorm';
import { User } from './user';
import { User_Student } from './user_student';

@Entity()
export class Social_Prc {
  @PrimaryGeneratedColumn()
  prcNo: number;

  @Column()
  studentNo: number;
  @ManyToOne(() => User_Student, user_student => user_student.social_prcs, {
    // cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'studentNo' })
  user_student: User_Student;


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
  content: string;

  @Column()
  result: string;


}