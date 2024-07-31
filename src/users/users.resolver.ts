import { Resolver, Mutation, Args } from '@nestjs/graphql';

import { UsersService } from './users.service';
import { CreateUserInput, UserModel } from './user.graphql';

@Resolver(() => UserModel)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => UserModel)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.createUser(createUserInput);
  }
}
