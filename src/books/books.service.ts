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

  async create(createBookInput: CreateBookInput): Promise<Book> {
    const book = await firstValueFrom(
      this.client
        .send<Book>('create_book', createBookInput)
        .pipe(timeout(5000), catchError(this.handleError('creating book'))),
    );

    await this.cacheSet(`book:${book.id}`, book, 3600);

    return book;
  }

  async findAll(
    sort?: SortBooksInput,
    pagination?: PaginationInput,
  ): Promise<Book[]> {
    const cacheKey = `books:${JSON.stringify(sort)}:${JSON.stringify(pagination)}`;
    const cachedBooks = await this.cacheGet(cacheKey);

    if (cachedBooks) {
      return cachedBooks;
    }

    const books = await firstValueFrom(
      this.client
        .send<Book[]>('find_all_books', { sort, pagination })
        .pipe(timeout(5000), catchError(this.handleError('fetching books'))),
    );

    await this.cacheSet(cacheKey, books, 300);

    return books;
  }

  async findOne(id: number): Promise<Book> {
    const cachedBook = await this.cacheGet(`book:${id}`);

    if (cachedBook) {
      return cachedBook;
    }

    const book = await firstValueFrom(
      this.client
        .send<Book>('find_one_book', id)
        .pipe(timeout(5000), catchError(this.handleError('fetching book'))),
    );

    if (book) {
      await this.cacheSet(`book:${id}`, book, 3600);
    }

    return book;
  }

  async update(id: number, updateBookInput: UpdateBookInput): Promise<Book> {
    const updatedBook = await firstValueFrom(
      this.client
        .send<Book>('update_book', { id, updateBookInput })
        .pipe(timeout(5000), catchError(this.handleError('updating book'))),
    );

    await this.cacheSet(`book:${id}`, updatedBook, 3600);

    return updatedBook;
  }

  async remove(id: number): Promise<DeleteBookResponse> {
    const response = await firstValueFrom(
      this.client
        .send<DeleteBookResponse>('remove_book', id)
        .pipe(timeout(5000), catchError(this.handleError('deleting book'))),
    );

    if (response.success) {
      await this.cacheDelete(`book:${id}`);
    }

    return response;
  }

  async searchBooks(searchBooksInput: SearchBooksInput): Promise<Book[]> {
    const cacheKey = `search:${JSON.stringify(searchBooksInput)}`;
    const cachedResults = await this.cacheGet(cacheKey);

    if (cachedResults) {
      return cachedResults;
    }

    const books = await firstValueFrom(
      this.client
        .send<Book[]>('search_books', searchBooksInput)
        .pipe(timeout(5000), catchError(this.handleError('searching books'))),
    );

    await this.cacheSet(cacheKey, books, 300);

    return books;
  }

  private async cacheSet(key: string, value: any, ttl: number): Promise<void> {
    await firstValueFrom(
      this.client
        .send('cache_set', { key, value, ttl })
        .pipe(timeout(5000), catchError(this.handleError('setting cache'))),
    );
  }

  private async cacheGet(key: string): Promise<any> {
    return firstValueFrom(
      this.client
        .send('cache_get', key)
        .pipe(timeout(5000), catchError(this.handleError('getting cache'))),
    );
  }

  private async cacheDelete(key: string): Promise<void> {
    await firstValueFrom(
      this.client
        .send('cache_delete', key)
        .pipe(timeout(5000), catchError(this.handleError('deleting cache'))),
    );
  }

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
}
