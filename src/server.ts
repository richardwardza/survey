import 'dotenv/config';
import "reflect-metadata"
import 'graphql-import-node';
import { ApolloServer } from 'apollo-server-lambda';
import { PrismaClient } from '@prisma/client';
import { GraphQLModule } from '@graphql-modules/core';

import { AnswerModule } from "./answer/answer";
import { QuestionModule } from "./question/question";

import { ContextFunction, Context } from 'apollo-server-core';


export interface ApiContext {
  prisma: PrismaClient;
  headers: any;
  functionName: string;
  event: any;
  context?: Context | ContextFunction;
}

const prisma = new PrismaClient({ 
  errorFormat: 'minimal', 
  enableDebug: true,
 });

const modules = new GraphQLModule({
  imports: [
    AnswerModule,
    QuestionModule,
  ]
});

// Construct a schema, using GraphQL schema language
const server = new ApolloServer({
  modules: [modules],
  engine: {
    apiKey: process.env.ENGINE_API_KEY
  },
  context: ({ event, context }): ApiContext => {
    return {
      prisma,
      headers: event.headers,
      functionName: context.functionName,
      event,
      context,
    };
  },
  playground: true,
  introspection: true,
  tracing: true,
});

// Needed for CORS with admin
// @TODO: come up with a proper CORS stragety
exports.graphqlHandler = server.createHandler({
  cors: {
    origin: '*',
    credentials: true,
  },
});
