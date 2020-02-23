import { PrismaClient } from '@prisma/client';
import { GraphQLModule } from '@graphql-modules/core';
import * as typeDefs from './question.graphql';
import { ApiContext } from '../server';

enum QuestionType {
  TEXT = "TEXT",
  EMAIL = "EMAIL",
  DROPDOWN = "DROPDOWN",
  TOGGLE = "TOGGLE",
  TEXTAREA = "TEXTAREA",
  DATE = "DATE",
}

type QuestionInput = {
  position: number;
  question: string
  questionType: QuestionType
  active: boolean
}

export const QuestionModule = new GraphQLModule({
  typeDefs,
  resolvers: {
    Query: {
      getQuestions: async (parent: any, args: any, ctx: { prisma: PrismaClient }, info: any) => {
        const questions = await ctx.prisma.question.findMany({
          where: { active: true },
          orderBy: { position: "asc" }
        });
        return questions;
      }
    },
    Mutation: {
      addQuestion: async (parent: any, args: { questionInput: QuestionInput }, context: ApiContext, info: any) => {
        const question = await context.prisma.question.create({
          data: {
            question: args.questionInput.question,
            position: args.questionInput.position,
            active: args.questionInput.active,
            questionType: args.questionInput.questionType
          }
        });
        return question;
      }
    }
  },
  context: async (context): Promise<ApiContext> => {
    return {
      ...context,
    };
  },
});