import { Task } from "../../task/entities/task.entity";
import { Area } from "../../area/entities/area.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

  @ManyToOne(
    () => Area,
    area => area.columns,
    { onDelete: "CASCADE"}
  )
  area: Area
}
