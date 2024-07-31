import { Field, InputType, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserModel {
  @Field()
  id: number;

  @Field()
  email: string;

  @Field()
  role: string;
}

@InputType()
export class CreateUserInput {
  @Field()
  email: string;

  @Field()
  password: string;
}
