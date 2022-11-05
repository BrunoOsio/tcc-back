import { ColumnList } from "../../column/entities/column.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Team } from "../../team/entities/team.entity";

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

  @ManyToOne(
    () => Team,
    team => team.areas,
    { onDelete: "CASCADE"}
  )
  team: Team;

  //TODO: specialization

  //TODO: leader

  //TODO: team
}
