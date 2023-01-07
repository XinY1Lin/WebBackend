// 学生表
import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user';
import { Blog } from './blog';
import { Score } from './score';
import { Social_Prc } from './social_prc';
import { Achievement } from './achievement';
import { SelectRecord } from './selectRecord';
import { Extracurricular } from './extracurricular';

@Entity()
export class User_Student {
  @PrimaryColumn()
  studentNo: number;

  @OneToOne(() => User,{
    onDelete: 'CASCADE',
    // cascade: true,    //外键对应的数据被删除，这条数据也会被删除
  })
  @JoinColumn({name: 'userNo'})
  user: number;   
  
  @OneToMany(() => SelectRecord, selectRecord => selectRecord.student)
  selectRecords: SelectRecord[];

  @OneToMany(() => Social_Prc, social_prc => social_prc.user_student)
  social_prcs: Social_Prc[];

  @OneToMany(() => Achievement, achievement => achievement.user_student)
  achievements: Achievement[];

  @OneToMany(() => Extracurricular, extracurricular => extracurricular.user_student)
  extracurriculars: Extracurricular[];

  @OneToMany(() => Blog, blog => blog.user_student)
  blogs: Blog[];

  @OneToMany(() => Score, score => score.student)
  scores: Score[];
  
  @Column()
  name: string;

  @Column()
  gender: string;

  @Column()
  grade: string;

  @Column()
  graduateSchool: string;

  @Column()
  birthDate: string;

  @Column()
  identityNum: string;

  @Column()
  politicalAppearance: string;

  @Column()
  phoneNum: string;

  @Column()
  department: string;

  @Column()
  status: string;

  @Column()
  class: number;


}
