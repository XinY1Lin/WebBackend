import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class editStatus {
  @PrimaryColumn()
  editNo: number;

  @Column()
  status: boolean;
}