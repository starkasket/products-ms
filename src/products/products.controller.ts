import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  //@Post() Solo para http
  @MessagePattern({ cmd: 'createProduct' })
  //create(@Body() createProductDto: CreateProductDto) {
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  //@Get()
  @MessagePattern({ cmd: 'findAllProducts' })
  // findAll(@Query() paginationDto: PaginationDto) {
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }


  // findOne(@Param('id') id: string)
  //@Get(':id')
  @MessagePattern({ cmd: 'findOneProduct' })
  //findOne(@Param('id', ParseIntPipe) id: number) {
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }


  //@Patch(':id')
  @MessagePattern({ cmd: 'updateProduct' })
  //update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  update(@Payload() updateProductDto: UpdateProductDto) {
    //return this.productsService.update(+id, updateProductDto);
    return this.productsService.update(updateProductDto.id,updateProductDto);
  }

  //@Delete(':id')
  @MessagePattern({ cmd: 'deleteProduct' })
  remove(@Payload('id') id: string) {
    return this.productsService.remove(+id);
  }
}
