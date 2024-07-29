import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { BooksService } from './books.service';
import { Book } from './book.entity';
import { Book as BookModel } from './book.graphql';

@Resolver((of) => BookModel)
export class BooksResolver {
  constructor(private readonly booksService: BooksService) {}

  @Query(() => [BookModel])
  async books() {
    return this.booksService.findAll();
  }

  @Query(() => BookModel)
  async book(@Args('id') id: number) {
    return this.booksService.findOne(id);
  }

  @Mutation(() => BookModel)
  async createBook(
    @Args('title') title: string,
    @Args('author') author: string,
    @Args('publicationDate') publicationDate: Date,
  ) {
    const book = new Book();
    book.title = title;
    book.author = author;
    book.publicationDate = publicationDate;
    return this.booksService.create(book);
  }

  @Mutation(() => BookModel)
  async updateBook(
    @Args('id') id: number,
    @Args('title') title: string,
    @Args('author') author: string,
    @Args('publicationDate') publicationDate: Date,
  ) {
    const book = new Book();
    book.title = title;
    book.author = author;
    book.publicationDate = publicationDate;
    return this.booksService.update(id, book);
  }

  @Mutation(() => Boolean)
  async deleteBook(@Args('id') id: number) {
    return this.booksService.remove(id);
  }
}
