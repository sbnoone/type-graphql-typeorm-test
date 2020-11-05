import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from 'type-graphql'
import { User } from '../../entity/User'
import bcrypt from 'bcrypt'
import { MyContext } from 'src/types/types'
import { RegisterInput } from './input/RegisterInput'
import { isAuth } from './middleware/isAuth'

@Resolver(() => User)
export class UserResolver {
  @Mutation(() => User, { nullable: true })
  async login(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() context: MyContext
  ): Promise<User | null> {
    const user = await User.findOne({ email })

    if (!user) {
      throw new Error('Not found')
    }

    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      throw new Error('Bad credentials')
    }

    // if (!user.confirmed) {
    //   throw new Error('Confirm your Email to login')
    // }

    if (context.req.session) {
      context.req.session.userId = user.id
    }

    return user
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() context: MyContext): Promise<boolean> {
    return new Promise((res, rej) =>
      context.req.session?.destroy(error => {
        if (error) {
          console.log(error)
          return rej(false)
        } else {
          context.res.clearCookie('qid')
          return res(true)
        }
      })
    )
  }

  @Mutation(() => User, { nullable: true })
  async register(@Arg('registerData') { email, password, username }: RegisterInput): Promise<User | null> {
    const user = await User.findOne({ email })

    if (user) {
      return null
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    // const confirmToken = v4()
    // const confirmURL = `http://localhost:3000/user/confirm/${confirmToken}`

    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
    }).save()

    // await sendConfirmationEmail(newUser.email, confirmURL)

    return newUser
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() context: MyContext): Promise<User | undefined> {
    const userId: number = context.req.session!.userId
    if (!userId) {
      throw new Error(`User is not logged in`)
    }
    return User.findOne(userId)
  }

  @Query(() => [User], { nullable: true })
  async users() {
    return await User.find()
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async deleteUser(@Arg('userId') userId: number): Promise<boolean> {
    const user = await User.findOne(userId)

    if (!user) {
      throw new Error(`User doesn't exist`)
    }

    try {
      await User.remove(user)
    } catch {
      return false
    }

    return true
  }

  @Mutation(() => Boolean)
  async confirmUser(@Arg('token') token: string, @Ctx() context: MyContext): Promise<boolean> {
    // session store must be connected to proceed comfirmation
    // const userId = await redis.get(token)

    return true
  }

  @FieldResolver(() => String, { nullable: true })
  showEmail(@Root() user: User, @Ctx() context: MyContext): string | null {
    return user.id === context.req.session!.userId ? user.email : null
  }
}
