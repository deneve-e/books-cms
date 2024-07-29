import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Book } from './book.entity';
import {
  CreateBookInput,
  DeleteBookResponse,
  SearchBooksInput,
  UpdateBookInput,
} from './book.graphql';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(createBookInput: CreateBookInput): Promise<Book> {
    const book = this.bookRepository.create(createBookInput);
    return this.bookRepository.save(book);
  }

  async findAll(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  async findOne(id: number): Promise<Book> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async update(id: number, updateBookInput: UpdateBookInput): Promise<Book> {
    await this.bookRepository.update(id, updateBookInput);
    const updatedBook = await this.bookRepository.findOne({ where: { id } });
    if (!updatedBook) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return updatedBook;
  }

  async remove(id: number): Promise<DeleteBookResponse> {
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

  async searchBooks(searchBooksInput: SearchBooksInput): Promise<Book[]> {
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
}
