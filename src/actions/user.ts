import { z } from 'astro/zod'
import { ActionError, defineAction } from 'astro:actions'
import { schemaRound } from '@/libs/api'
import { basicSchema, getDBUsers, ValidateMethod } from '@/services/dbUsers'
import { getConnection } from '@/libs/databases'

export const user = {
  login: defineAction({
    input: z.object({
      round: schemaRound,
      type: z.enum(ValidateMethod),
      name: z.string(),
    }),
    handler: async (input) => {
      const { round, type, name } = input
      const connection = getConnection(round)
      const dbUsers = getDBUsers(connection)

      try {
        const user = await z
          .promise(basicSchema)
          .parse(dbUsers.findOne({ 'profile.name': name, 'profile.validateType': type }))

        return user
      } catch (error) {
        console.error(`Failed to login with type:(${type}) and name:(${name}).`)
        console.error(error)

        throw new ActionError({
          code: 'NOT_FOUND',
          message: 'User not found',
        })
      }
    },
  }),
  logout: defineAction({
    handler: () => {
      return true
    },
  }),
}
