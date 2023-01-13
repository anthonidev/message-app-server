import { CreateUsernameResponse, GraphQLContext } from "../../util/types";
const resolvers = {
  Query: {
    searchUsers: () => {},
  },
  Mutation: {
    createUsername: async (
      _: any,
      args: { username: string },
      context: GraphQLContext
    ): Promise<CreateUsernameResponse> => {
      const { username } = args;
      const { session, prisma } = context;

      if (!session?.user) {
        return {
          error: "You must be logged in to create a username",
        };
      }
      const { id: userId } = session.user;

      try {
        const existingUser = await prisma.user.findUnique({
          where: {
            username,
          },
        });
        if (existingUser) {
          return {
            error: "Username already taken",
          };
        }

        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            username,
          },
        });

        return {
          success: true,
        };
      } catch (error: any) {
        return {
          error: error?.message,
        };
      }
    },
  },
};

export default resolvers;
