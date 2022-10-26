import { ColumnList } from "../../column/entities/column.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Area {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @OneToMany(
    () => ColumnList,
    column => column.area,
    { onDelete: "SET NULL"}
  )
  columns: ColumnList[];

  //TODO: specialization

  //TODO: leader

  //TODO: team
}
