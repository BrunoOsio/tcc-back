import { ColumnList } from "../../column/entities/column.entity";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  description: string

  @Column()
  createdAt: string;

  @Column({nullable: true})
  limitAt: string;

  @ManyToOne(
    () => ColumnList,
    column => column.tasks,
    { onDelete: "CASCADE"}
  )
  column: ColumnList

  //TODO: owner
}
