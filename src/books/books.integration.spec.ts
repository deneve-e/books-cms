import { Test, TestingModule } from '@nestjs/testing';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BooksService } from './books.service';
import {
  CreateBookInput,
  UpdateBookInput,
  SearchBooksInput,
  SortBooksInput,
  PaginationInput,
  DeleteBookResponse,
} from './book.graphql';
import { of, throwError } from 'rxjs';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

// Mock the Redis client
const mockRedisClient = {
  send: jest.fn(),
};

describe('BooksService Integration', () => {
  let booksService: BooksService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        ClientsModule.registerAsync([
          {
            name: 'BOOKS_SERVICE',
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
              transport: Transport.REDIS,
              options: {
                host: configService.get('REDIS_HOST'),
                port: configService.get('REDIS_PORT'),
              },
            }),
            inject: [ConfigService],
          },
        ]),
      ],
      providers: [BooksService],
    })
      .overrideProvider('BOOKS_SERVICE')
      .useValue(mockRedisClient)
      .compile();

    booksService = module.get<BooksService>(BooksService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(booksService).toBeDefined();
  });

  describe('create', () => {
    it('should create a book', async () => {
      const createBookInput: CreateBookInput = {
        title: 'Test Book',
        author: 'Test Author',
        publicationDate: new Date(),
      };

      const mockBook = { id: 1, ...createBookInput };
      mockRedisClient.send.mockReturnValueOnce(of(mockBook));

      const result = await booksService.create(createBookInput);

      expect(mockRedisClient.send).toHaveBeenCalledWith(
        'create_book',
        createBookInput,
      );
      expect(result).toEqual(mockBook);
    });

    it('should handle errors when creating a book', async () => {
      const createBookInput: CreateBookInput = {
        title: 'Test Book',
        author: 'Test Author',
        publicationDate: new Date(),
      };

      mockRedisClient.send.mockReturnValueOnce(
        throwError(() => new Error('Database error')),
      );

      await expect(booksService.create(createBookInput)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findAll', () => {
    it('should find all books with sorting and pagination', async () => {
      const mockBooks = [
        { id: 1, title: 'Book 1', author: 'Author 1' },
        { id: 2, title: 'Book 2', author: 'Author 2' },
      ];
      const sort: SortBooksInput = { field: 'title', order: 'ASC' };
      const pagination: PaginationInput = { page: 1, limit: 10 };

      mockRedisClient.send.mockReturnValueOnce(of(mockBooks));

      const result = await booksService.findAll(sort, pagination);

      expect(mockRedisClient.send).toHaveBeenCalledWith('find_all_books', {
        sort,
        pagination,
      });
      expect(result).toEqual(mockBooks);
    });

    it('should handle errors when finding all books', async () => {
      mockRedisClient.send.mockReturnValueOnce(
        throwError(() => new Error('Database error')),
      );

      await expect(booksService.findAll()).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('findOne', () => {
    it('should find one book', async () => {
      const mockBook = { id: 1, title: 'Book 1', author: 'Author 1' };
      mockRedisClient.send.mockReturnValueOnce(of(mockBook));

      const result = await booksService.findOne(1);

      expect(mockRedisClient.send).toHaveBeenCalledWith('find_one_book', 1);
      expect(result).toEqual(mockBook);
    });

    it('should handle not found error', async () => {
      mockRedisClient.send.mockReturnValueOnce(
        throwError(() => ({ status: 404 })),
      );

      await expect(booksService.findOne(999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const updateBookInput: UpdateBookInput = { id: 1, title: 'Updated Book' };
      const mockUpdatedBook = {
        id: 1,
        title: 'Updated Book',
        author: 'Author 1',
      };

      mockRedisClient.send.mockReturnValueOnce(of(mockUpdatedBook));

      const result = await booksService.update(1, updateBookInput);

      expect(mockRedisClient.send).toHaveBeenCalledWith('update_book', {
        id: 1,
        updateBookInput,
      });
      expect(result).toEqual(mockUpdatedBook);
    });

    it('should handle errors when updating a book', async () => {
      const updateBookInput: UpdateBookInput = {
        id: 999,
        title: 'Updated Book',
      };

      mockRedisClient.send.mockReturnValueOnce(
        throwError(() => new Error('Database error')),
      );

      await expect(booksService.update(999, updateBookInput)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a book', async () => {
      const mockDeleteResponse: DeleteBookResponse = {
        success: true,
        message: 'Book deleted',
        id: 1,
      };

      mockRedisClient.send.mockReturnValueOnce(of(mockDeleteResponse));

      const result = await booksService.remove(1);

      expect(mockRedisClient.send).toHaveBeenCalledWith('remove_book', 1);
      expect(result).toEqual(mockDeleteResponse);
    });

    it('should handle errors when removing a book', async () => {
      mockRedisClient.send.mockReturnValueOnce(
        throwError(() => new Error('Database error')),
      );

      await expect(booksService.remove(999)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('searchBooks', () => {
    it('should search books', async () => {
      const searchInput: SearchBooksInput = { title: 'Test' };
      const mockBooks = [
        { id: 1, title: 'Test Book 1', author: 'Author 1' },
        { id: 2, title: 'Test Book 2', author: 'Author 2' },
      ];

      mockRedisClient.send.mockReturnValueOnce(of(mockBooks));

      const result = await booksService.searchBooks(searchInput);

      expect(mockRedisClient.send).toHaveBeenCalledWith(
        'search_books',
        searchInput,
      );
      expect(result).toEqual(mockBooks);
    });

    it('should handle errors when searching books', async () => {
      const searchInput: SearchBooksInput = { title: 'Test' };

      mockRedisClient.send.mockReturnValueOnce(
        throwError(() => new Error('Database error')),
      );

      await expect(booksService.searchBooks(searchInput)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
