import { Entity, BaseEntity, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm'
import { User } from './User'
import { Note } from './Note'
import { Field, Int, ObjectType } from 'type-graphql'

@ObjectType()
@Entity()
export class SharedNote extends BaseEntity {
  @Field(() => Int)
  @PrimaryColumn()
  targetId: number

  @Field(() => [User])
  @ManyToOne(() => User, user => user.notesSharedWithYou)
  @JoinColumn({ name: 'targetId' })
  target: User

  @Field(() => Int)
  @PrimaryColumn()
  senderId: number

  @Field(() => [User])
  @ManyToOne(() => User, user => user.notesYouShared)
  @JoinColumn({ name: 'senderId' })
  sender: User

  @Field(() => Int)
  @PrimaryColumn()
  noteId: number

  @Field(() => [Note])
  @ManyToOne(() => Note, note => note.shares)
  @JoinColumn({ name: 'noteId' })
  note: Note
}
