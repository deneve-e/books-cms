import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { BooksService } from './books.service';
import {
  BookModel,
  CreateBookInput,
  DeleteBookResponse,
  UpdateBookInput,
  SearchBooksInput,
  SortBooksInput,
  PaginationInput,
} from './book.graphql';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/user.entity';

@Resolver(() => BookModel)
@UseGuards(GqlAuthGuard, RolesGuard)
export class BooksResolver {
  constructor(private readonly booksService: BooksService) {}

  @Query(() => [BookModel])
  @Roles('USER', 'ADMIN')
  async books(
    @Args({ name: 'sort', type: () => SortBooksInput, nullable: true })
    sort: SortBooksInput,
    @Args({ name: 'pagination', type: () => PaginationInput, nullable: true })
    pagination: PaginationInput,
  ) {
    return this.booksService.findAll(sort, pagination);
  }

  @Query(() => BookModel)
  @Roles('USER', 'ADMIN')
  async book(@Args('id') id: number) {
    return this.booksService.findOne(id);
  }

  @Query(() => [BookModel])
  @Roles('USER', 'ADMIN')
  async searchBooks(
    @Args('searchBooksInput') searchBooksInput: SearchBooksInput,
  ) {
    return this.booksService.searchBooks(searchBooksInput);
  }

  @Mutation(() => BookModel)
  @Roles('ADMIN')
  async createBook(
    @Args('createBookInput') createBookInput: CreateBookInput,
    @CurrentUser() user: User,
  ) {
    return this.booksService.create(createBookInput);
  }

  @Mutation(() => BookModel)
  @Roles('ADMIN')
  async updateBook(
    @Args('updateBookInput') updateBookInput: UpdateBookInput,
    @CurrentUser() user: User,
  ) {
    return this.booksService.update(updateBookInput.id, updateBookInput);
  }

  @Mutation(() => DeleteBookResponse)
  @Roles('ADMIN')
  async deleteBook(
    @Args('id') id: number,
    @CurrentUser() user: User,
  ): Promise<DeleteBookResponse> {
    return this.booksService.remove(id);
  }
}
