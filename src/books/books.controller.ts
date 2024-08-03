import { Controller, NotFoundException } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';

import { Book } from './book.entity';
import {
  CreateBookInput,
  DeleteBookResponse,
  PaginationInput,
  SearchBooksInput,
  SortBooksInput,
  UpdateBookInput,
} from './book.graphql';

@Controller()
export class BooksController {
  private redis: Redis;

  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {
    this.redis = new Redis({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10),
    });
  }

  @MessagePattern('create_book')
  async create(@Payload() createBookInput: CreateBookInput): Promise<Book> {
    const book = this.bookRepository.create(createBookInput);
    return this.bookRepository.save(book);
  }

  @MessagePattern('find_all_books')
  async findAll(
    @Payload() data: { sort?: SortBooksInput; pagination?: PaginationInput },
  ): Promise<Book[]> {
    const { sort, pagination } = data;
    const { field = 'id', order = 'ASC' } = sort || {};
    const { page = 1, limit = 10 } = pagination || {};

    const qb = this.bookRepository.createQueryBuilder('book');

    if (field && order) {
      qb.orderBy(`book.${field}`, order);
    }

    qb.skip((page - 1) * limit);
    qb.take(limit);

    return qb.getMany();
  }

  @MessagePattern('find_one_book')
  async findOne(@Payload() id: number): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  @MessagePattern('update_book')
  async update(
    @Payload() data: { id: number; updateBookInput: UpdateBookInput },
  ): Promise<Book> {
    const { id, updateBookInput } = data;
    await this.bookRepository.update(id, updateBookInput);
    const updatedBook = await this.bookRepository.findOne({ where: { id } });
    if (!updatedBook) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return updatedBook;
  }

  @MessagePattern('remove_book')
  async remove(@Payload() id: number): Promise<DeleteBookResponse> {
    const result = await this.bookRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return {
      success: true,
      message: `Book with ID ${id} has been deleted`,
      id,
    };
  }

  @MessagePattern('search_books')
  async searchBooks(
    @Payload() searchBooksInput: SearchBooksInput,
  ): Promise<Book[]> {
    const { title, author, publicationYear } = searchBooksInput;
    const query = this.bookRepository.createQueryBuilder('book');

    if (title) {
      query.andWhere('book.title ILIKE :title', { title: `%${title}%` });
    }

    if (author) {
      query.andWhere('book.author ILIKE :author', { author: `%${author}%` });
    }

    if (publicationYear) {
      query.andWhere(
        'EXTRACT(YEAR FROM book.publicationDate) = :publicationYear',
        { publicationYear },
      );
    }

    return query.getMany();
  }

  @MessagePattern('cache_set')
  async cacheSet(
    @Payload() data: { key: string; value: any; ttl: number },
  ): Promise<void> {
    await this.redis.set(data.key, JSON.stringify(data.value), 'EX', data.ttl);
  }

  @MessagePattern('cache_get')
  async cacheGet(@Payload() key: string): Promise<any> {
    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  @MessagePattern('cache_delete')
  async cacheDelete(@Payload() key: string): Promise<void> {
    await this.redis.del(key);
  }
}
