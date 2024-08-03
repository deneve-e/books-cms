import { ConflictException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '../app.module';
import { UsersService } from '../users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const usersService = app.get(UsersService);

  const adminExists = await usersService.adminExists();
  if (!adminExists) {
    const adminEmail = process.env.INITIAL_ADMIN_EMAIL;
    const adminPassword = process.env.INITIAL_ADMIN_PASSWORD;
    if (adminEmail && adminPassword) {
      try {
        await usersService.createAdmin({
          email: adminEmail,
          password: adminPassword,
        });
        console.log('Initial admin user created successfully');
      } catch (error) {
        if (error instanceof ConflictException) {
          console.log('Admin user already exists');
        } else {
          console.error('Error creating admin user:', error.message);
        }
      }
    } else {
      console.log(
        'Initial admin credentials not provided. Admin creation skipped.',
      );
    }
  } else {
    console.log('Admin user already exists. Skipping initial admin creation.');
  }

  await app.close();
}

bootstrap();
