import { IsEmail } from "class-validator";
import { Area } from "../../area/entities/area.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Team } from "../../team/entities/team.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @ManyToMany(
    () => Team,
    team => team.members,
    //{ onDelete: "CASCADE"}
  )
  teams: Team[];

  @ManyToMany(
    () => Team,
    team => team.leaders,
    //{ onDelete: "CASCADE"}
  )
  @JoinTable({name:"user-leaders-team"})
  teamsLeadered: Team[];

  @ManyToMany(
    () => Team,
    team => team.joinRequests
  )
  @JoinTable({name:"user-joinRequests-team"})
  joinRequests: Team[]

  @OneToMany(
    () => Area,
    area => area.leader
    //{ onDelete: "CASCADE"}
  )
  areasLeadered: Area[]
  //TODO: Photo
}

