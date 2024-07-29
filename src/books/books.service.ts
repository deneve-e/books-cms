import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Book } from './book.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  create(book: Book): Promise<Book> {
    return this.bookRepository.save(book);
  }

  findAll(): Promise<Book[]> {
    return this.bookRepository.find();
  }

  findOne(id: number): Promise<Book> {
    return this.bookRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async update(id: number, book: Book): Promise<void> {
    await this.bookRepository.update(id, book);
  }

  async remove(id: number): Promise<void> {
    await this.bookRepository.delete(id);
  }
}
