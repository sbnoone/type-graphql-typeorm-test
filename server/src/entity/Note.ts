import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, OneToMany } from 'typeorm'
import { User } from './User'
import { SharedNote } from './SharedNote'
import { Field, ID, ObjectType } from 'type-graphql'

@ObjectType()
@Entity()
export class Note extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column()
  text: string

  @Field(() => ID)
  @Column()
  ownerId: number

  @Field(() => User)
  @ManyToOne(() => User, user => user.notes)
  @JoinColumn({ name: 'ownerId' })
  owner: User

  @Field(() => [SharedNote])
  @OneToMany(() => SharedNote, sharedNote => sharedNote.note)
  shares: SharedNote[]
}
