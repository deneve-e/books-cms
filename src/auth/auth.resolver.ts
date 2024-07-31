import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UnauthorizedException, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginInput, AuthPayload } from './auth.graphql';
import { GqlAuthGuard } from './gql-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { User } from '../users/user.entity';
import { UserModel } from '../users/user.graphql';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async login(@Args('loginInput') loginInput: LoginInput) {
    const user = await this.authService.validateUser(
      loginInput.email,
      loginInput.password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }

  @Query(() => UserModel)
  @UseGuards(GqlAuthGuard)
  async currentUser(@CurrentUser() user: User) {
    return user;
  }
}
