import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Course } from './course';
import { User } from './user';

@Entity()
export class User_Teacher {
  @PrimaryColumn()
  teacherNo: number;//工号

  @OneToOne(() => User,{
    onDelete: 'CASCADE',
    // cascade: true,    //外键对应的数据被删除，这条数据也会被删除
  })
  @JoinColumn({name: 'userNo'})
  user: User;

  @Column()
  name: string;//姓名

  @Column()
  gender: string;//性别

  @Column()
  birth: string;//出生日期

  @Column()
  idCard: string;//身份证

  @Column()
  political: string;//政治面貌

  @Column()
  telephone: string;//电话号

  @Column()
  department: string;//学院

  @Column()
  title: string;//职称

  @Column()
  direction: string;//研究方向

  @Column()
  teaCourse: string;//讲授课程

  @Column()
  book: string;//论文著作

  @Column()
  degree: string;//学历
}
