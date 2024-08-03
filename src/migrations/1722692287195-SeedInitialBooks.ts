import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedInitialBooks1722692287195 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO "book" (title, author, publicationYear)
            VALUES 
            ('To Kill a Mockingbird', 'Harper Lee', 1960),
            ('1984', 'George Orwell', 1949),
            ('The Great Gatsby', 'F. Scott Fitzgerald', 1925),
            ('Pride and Prejudice', 'Jane Austen', 1813),
            ('The Catcher in the Rye', 'J.D. Salinger', 1951)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM "book" WHERE title IN (
            'To Kill a Mockingbird', '1984', 'The Great Gatsby', 
            'Pride and Prejudice', 'The Catcher in the Rye'
        )
    `);
  }
}
