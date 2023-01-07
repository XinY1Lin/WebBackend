import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Admin {
  @PrimaryColumn()
  adminNo: number;

  @Column()
  name: string;
}
