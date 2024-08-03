import {
  Injectable,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  catchError,
  timeout,
  throwError,
  TimeoutError,
  Observable,
  firstValueFrom,
} from 'rxjs';

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

  private handleError(operation: string) {
    return (error: any): Observable<never> => {
      if (error instanceof TimeoutError) {
        return throwError(
          () => new InternalServerErrorException(`Timeout while ${operation}`),
        );
      }
      if (error.status === 404) {
        return throwError(() => new NotFoundException(error.message));
      }
      return throwError(
        () => new InternalServerErrorException(`Error while ${operation}`),
      );
    };
  }

  async create(createBookInput: CreateBookInput): Promise<Book> {
    return firstValueFrom(
      this.client
        .send<Book>('create_book', createBookInput)
        .pipe(timeout(5000), catchError(this.handleError('creating book'))),
    );
  }

  async findAll(
    sort?: SortBooksInput,
    pagination?: PaginationInput,
  ): Promise<Book[]> {
    return firstValueFrom(
      this.client
        .send<Book[]>('find_all_books', { sort, pagination })
        .pipe(timeout(5000), catchError(this.handleError('fetching books'))),
    );
  }

  async findOne(id: number): Promise<Book> {
    return firstValueFrom(
      this.client
        .send<Book>('find_one_book', id)
        .pipe(timeout(5000), catchError(this.handleError('fetching book'))),
    );
  }

  async update(id: number, updateBookInput: UpdateBookInput): Promise<Book> {
    return firstValueFrom(
      this.client
        .send<Book>('update_book', { id, updateBookInput })
        .pipe(timeout(5000), catchError(this.handleError('updating book'))),
    );
  }

  async remove(id: number): Promise<DeleteBookResponse> {
    return firstValueFrom(
      this.client
        .send<DeleteBookResponse>('remove_book', id)
        .pipe(timeout(5000), catchError(this.handleError('deleting book'))),
    );
  }

  async searchBooks(searchBooksInput: SearchBooksInput): Promise<Book[]> {
    return firstValueFrom(
      this.client
        .send<Book[]>('search_books', searchBooksInput)
        .pipe(timeout(5000), catchError(this.handleError('searching books'))),
    );
  }
}
