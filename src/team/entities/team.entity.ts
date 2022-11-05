import { Area } from "../../area/entities/area.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  number: number;

  @OneToMany(
    () => Area,
    area => area.team,
    { onDelete: "CASCADE"}
  )
  areas: Area[];
}

