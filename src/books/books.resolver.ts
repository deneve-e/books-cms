import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { BooksService } from './books.service';
import { Book } from './book.entity';

@Resolver((of) => Book)
export class BooksResolver {
  constructor(private readonly booksService: BooksService) {}

  @Query((returns) => [Book])
  books() {
    return this.booksService.findAll();
  }

  @Query((returns) => Book)
  book(@Args('id') id: number) {
    return this.booksService.findOne(id);
  }

  @Mutation((returns) => Book)
  createBook(
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

  @Mutation((returns) => Book)
  updateBook(
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

  @Mutation((returns) => Boolean)
  deleteBook(@Args('id') id: number) {
    return this.booksService.remove(id);
  }
}
