import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module.js';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [ProductsModule, ConfigModule.forRoot({ isGlobal: true })],
  controllers: [],
  providers: [],
})
export class AppModule {}
