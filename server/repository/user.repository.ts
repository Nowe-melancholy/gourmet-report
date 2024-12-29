import { PrismaD1 } from '@prisma/adapter-d1'
import { PrismaClient } from '@prisma/client'
import { User } from 'server/domain/user'

export class UserRepository {
  private constructor(db: D1Database) {
    const adapter = new PrismaD1(db)
    this.prismaClient = new PrismaClient({ adapter })
  }

  private readonly prismaClient: PrismaClient

  static create(db: D1Database) {
    return new UserRepository(db)
  }

  getUserByEmail = async (email: string) => {
    const user = await this.prismaClient.user.findFirst({
      where: {
        email,
      },
    })

    if (!user) throw new Error('User not found')

    return User.create({
      id: user.id,
      name: user.name,
      email: user.email,
    })
  }
}
