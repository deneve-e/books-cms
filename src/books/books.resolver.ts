import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

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

@Resolver(() => BookModel)
export class BooksResolver {
  constructor(private readonly booksService: BooksService) {}

  @Query(() => [BookModel])
  async books(
    @Args({ name: 'sort', type: () => SortBooksInput, nullable: true })
    sort: SortBooksInput,
    @Args({ name: 'pagination', type: () => PaginationInput, nullable: true })
    pagination: PaginationInput,
  ) {
    return this.booksService.findAll(sort, pagination);
  }

  @Query(() => BookModel)
  async book(@Args('id') id: number) {
    return this.booksService.findOne(id);
  }

  @Mutation(() => BookModel)
  async createBook(@Args('createBookInput') createBookInput: CreateBookInput) {
    return this.booksService.create(createBookInput);
  }

  @Mutation(() => BookModel)
  async updateBook(@Args('updateBookInput') updateBookInput: UpdateBookInput) {
    return this.booksService.update(updateBookInput.id, updateBookInput);
  }

  @Mutation(() => DeleteBookResponse)
  async deleteBook(@Args('id') id: number): Promise<DeleteBookResponse> {
    return this.booksService.remove(id);
  }

  @Query(() => [BookModel])
  async searchBooks(
    @Args('searchBooksInput') searchBooksInput: SearchBooksInput,
  ) {
    return this.booksService.searchBooks(searchBooksInput);
  }
}
