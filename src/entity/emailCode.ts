//验证码表
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class EmailCode {
    @PrimaryGeneratedColumn()
    codeNo: number;

    @Column()
    email: string;

    @Column()
    code: string;
}