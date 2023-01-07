import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OpenCourse {
    @PrimaryGeneratedColumn()
    openNo: number;

    @Column()
    isOpen: number;

}