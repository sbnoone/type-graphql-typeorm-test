import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import { MyContext } from '../../types/types'
import { Note } from '../../entity/Note'
import { User } from '../../entity/User'
import { isAuth } from '../user/middleware/isAuth'
import { SharedNote } from '../../entity/SharedNote'

@Resolver()
export class NoteResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Note)
  async createNote(@Arg('text') text: string, @Ctx() context: MyContext) {
    const owner = await User.findOne(context.req.session!.userId)
    const note = await Note.create({ text, ownerId: context.req.session!.userId, owner }).save()

    return note
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async deleteNotes(@Ctx() context: MyContext) {
    try {
      await Note.delete({ ownerId: context.req.session!.userId })
      return true
    } catch (error) {
      console.log('Delete notes error', error)
      return false
    }
  }

  @Query(() => [Note], { nullable: true })
  async notes(): Promise<Note[]> {
    const notes = await Note.find({ relations: ['owner'] })
    return notes
  }

  @Query(() => [Note], { nullable: true })
  async sharedNotes(): Promise<SharedNote[]> {
    const youShare = await SharedNote.find({ relations: ['sender'] })
    return youShare
  }

  @Query(() => [Note], { nullable: true })
  async sharedWithYouNotes(): Promise<SharedNote[]> {
    const sharedWithYou = await SharedNote.find({ relations: ['target'] })
    return sharedWithYou
  }

  @Query(() => [Note], { nullable: true })
  async shared(): Promise<SharedNote[]> {
    const shareNotes = await SharedNote.find({ relations: ['note', 'target', 'sender'] })
    return shareNotes
  }
}
