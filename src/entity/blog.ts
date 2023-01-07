//博客表
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn,ManyToOne } from 'typeorm';
import { User_Student } from './user_student';

@Entity()
export class Blog {
    @PrimaryGeneratedColumn()
    blogNo: number;

    @Column()
    studentNo: number
    @ManyToOne(() => User_Student, user_student => user_student.blogs, {
      onDelete: 'CASCADE',
      eager: true,
    })
    @JoinColumn({ name: 'studentNo' })
    user_student: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column()
    html: string;

    @Column()
    date: string;
}