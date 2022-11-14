import { Area } from "../../area/entities/area.entity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";

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

  @ManyToMany(
    () => User,
    user => user.teams,
    //{ onDelete: "CASCADE"}
  )
  members: User[];
}
