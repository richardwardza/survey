import { PrismaClient, Answer } from '@prisma/client';
import { GraphQLModule } from '@graphql-modules/core';
import * as typeDefs from './answer.graphql';
import { ApiContext } from '../server';

type AnswerInput = {
  id?: string;
  uuid: string;
  question: string;
  answer: string;
}
// Provide resolver functions for your schema fields
export const AnswerModule = new GraphQLModule({
  typeDefs,
  resolvers: {
    Query: {
      getAnswers: async (parent: any, args: { uuid: string }, ctx: { prisma: PrismaClient }, info: any) => {
        if(!args.uuid) {
          return [];
        }
        
        const answers = await ctx.prisma.answer.findMany({
          where: { uuid: args.uuid },
          include: {
            question: true,
          },
        });
        return answers;
      }
    },
    Mutation: {
      saveAnswer: async (parent: any, args: { answerInput: AnswerInput }, ctx: { prisma: PrismaClient }, info: any) => {
        const answerExists = await ctx.prisma.answer.findMany({
          where: {
            uuid: args.answerInput.uuid,
            question: { id: args.answerInput.question },
          }
        });

        let answer: Answer;
        if (answerExists.length > 0) {
          answer = await ctx.prisma.answer.update({
            data: {
              answer: args.answerInput.answer,
              uuid: args.answerInput.uuid,
              question: { connect: { id: args.answerInput.question } },
            },
            where: {
              id: answerExists[0].id
            }
          });
        }
        else {
          answer = await ctx.prisma.answer.create({
            data: {
              answer: args.answerInput.answer,
              uuid: args.answerInput.uuid,
              question: { connect: { id: args.answerInput.question } },
            }
          });
        }
        return answer;
      }
    },
  },
  context: async (context): Promise<ApiContext> => {
    return {
      ...context,
    };
  },

});


