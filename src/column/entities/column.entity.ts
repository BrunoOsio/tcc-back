import { Task } from "../../task/entities/task.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ColumnList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  isForDoneTasks: boolean;

  @OneToMany(
    () => Task,
    task => task.column,
    // { onDelete: "SET NULL"}
  )
  tasks: Task[]

  //TODO: area
}
