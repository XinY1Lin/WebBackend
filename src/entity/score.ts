//GPA成绩表
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm';
import { User_Student } from './user_student';

@Entity()
export class Score {
    @PrimaryGeneratedColumn()
    gpaNo: number;

    //跟学生表多对一
    @ManyToOne(() => User_Student, user_student => user_student.scores, {
        onDelete: 'CASCADE',
        eager: true,
    })
    @JoinColumn({ name: 'studentNo' })
    student: User_Student;

    @Column({
        type: "double",
    })
    gpa: number;

    @Column()
    rank: number;

    @Column()
    term: string;

    @Column()
    grade: string;
}