// 课程表
import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { SelectRecord } from './selectRecord';

@Entity()
export class Course {
  @PrimaryColumn()
  courseNo: number;

  @Column()
  courseName: string;

  @Column()
  teacherName: string;

  @Column({
    type: "double",
  })
  credit: number;

  //学时
  @Column()
  overallHour: number;

  @Column()
  courseType: string;

  @Column()
  department: string;

  @Column()
  grade: string;

  @Column()
  term: string;

  @Column()
  totalStu: number;

  @Column()
  selectedStu: number;

  @Column()
  area: string;

  @Column()
  room: string;

  //星期几上课
  @Column()
  day: string;

  //哪个时间段上课
  @Column()
  time: string;

  @OneToMany(() => SelectRecord, selectRecord => selectRecord.course)
  selectRecords: SelectRecord[];
}
