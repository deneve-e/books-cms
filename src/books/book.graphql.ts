import { Field, ObjectType, InputType } from '@nestjs/graphql';

@ObjectType()
export class BookModel {
  @Field()
  id: number;

  @Field()
  title: string;

  @Field()
  author: string;

  @Field()
  publicationDate: Date;
}

@InputType()
export class CreateBookInput {
  @Field()
  title: string;

  @Field()
  author: string;

  @Field()
  publicationDate: Date;
}

@InputType()
export class UpdateBookInput {
  @Field()
  id: number;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  author?: string;

  @Field({ nullable: true })
  publicationDate?: Date;
}

@ObjectType()
export class DeleteBookResponse {
  @Field()
  success: boolean;

  @Field({ nullable: true })
  message?: string;

  @Field({ nullable: true })
  id?: number;
}

@InputType()
export class SearchBooksInput {
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  author?: string;

  @Field({ nullable: true })
  publicationYear?: number;
}

@InputType()
export class SortBooksInput {
  @Field({ nullable: true })
  field?: string;

  @Field({ nullable: true })
  order?: 'ASC' | 'DESC';
}

@InputType()
export class PaginationInput {
  @Field({ defaultValue: 1 })
  page: number;

  @Field({ defaultValue: 10 })
  limit: number;
}
