import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Book } from './book.entity';
import {
  CreateBookInput,
  DeleteBookResponse,
  PaginationInput,
  SearchBooksInput,
  SortBooksInput,
  UpdateBookInput,
} from './book.graphql';

@Injectable()
export class BooksService {
  constructor(@Inject('BOOKS_SERVICE') private client: ClientProxy) {}

  create(createBookInput: CreateBookInput): Promise<Book> {
    return this.client.send<Book>('create_book', createBookInput).toPromise();
  }

  findAll(
    sort?: SortBooksInput,
    pagination?: PaginationInput,
  ): Promise<Book[]> {
    return this.client
      .send<Book[]>('find_all_books', { sort, pagination })
      .toPromise();
  }

  findOne(id: number): Promise<Book> {
    return this.client.send<Book>('find_one_book', id).toPromise();
  }

  update(id: number, updateBookInput: UpdateBookInput): Promise<Book> {
    return this.client
      .send<Book>('update_book', { id, updateBookInput })
      .toPromise();
  }

  remove(id: number): Promise<DeleteBookResponse> {
    return this.client.send<DeleteBookResponse>('remove_book', id).toPromise();
  }

  searchBooks(searchBooksInput: SearchBooksInput): Promise<Book[]> {
    return this.client
      .send<Book[]>('search_books', searchBooksInput)
      .toPromise();
  }
}
