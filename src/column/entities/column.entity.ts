import { Task } from "../../task/entities/task.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ColumnList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  isForDoneTasks: boolean;

  @Column({nullable: true})
  taskIdsOrder: string;

  @OneToMany(
    () => Task,
    task => task.column,
    // { onDelete: "SET NULL"}
  )
  tasks: Task[];

  //TODO: area
}
