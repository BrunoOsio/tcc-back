import { IsEmail } from "class-validator";
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
  @JoinTable({name:"team-joined-user"})
  teams: Team[];

  //TODO: Photo
  //TODO: join requests
}

