// 用户表
import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Achievement } from './achievement';
import { Extracurricular } from './extracurricular';
import { Social_Prc } from './social_prc';
import { User_Student } from './user_student';

@Entity()
export class User {
  // @PrimaryGeneratedColumn()
  // id: number;

  @PrimaryColumn()
  name: number;

  @Column()
  password: string;

  @Column()
  email: string;



  // @Column()
  // type: string;
}
