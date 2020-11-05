import { Field, ID, ObjectType } from 'type-graphql'
import { Entity, Column, BaseEntity, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { Note } from './Note'
import { SharedNote } from './SharedNote'

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number

  @Field()
  @Column({ unique: true })
  username: string

  @Field()
  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({ default: false })
  confirmed: boolean

  @Field(() => [Note])
  @OneToMany(() => Note, note => note.owner)
  notes: Note[]

  @Field(() => [Note])
  @OneToMany(() => SharedNote, sharedNote => sharedNote.target)
  notesSharedWithYou: Note[]

  @Field(() => [Note])
  @OneToMany(() => SharedNote, sharedNote => sharedNote.sender)
  notesYouShared: Note[]

  // @Column( { nullable: true })
  // confirmToken: string
}
