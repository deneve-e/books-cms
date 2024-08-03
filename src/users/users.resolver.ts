import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { ConflictException } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserInput, UserModel } from './user.graphql';

@Resolver(() => UserModel)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => UserModel)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    try {
      return this.usersService.create(createUserInput);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new GraphQLError(error.message, {
          extensions: { code: 'CONFLICT' },
        });
      }
      throw error;
    }
  }
}
