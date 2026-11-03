import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { PaginationDto } from '../common/dto/pagination.dto.js';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService {

  constructor(private readonly prisma: PrismaService) { };

  async create(createProductDto: CreateProductDto) {
    const product = await this.prisma.products.create({
      data: createProductDto,
    });
    return product;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const totalProducts = await this.prisma.products.count({
      where: {
        available: true
      }
    });
    const lastPage = Math.ceil(totalProducts / limit);

    return {
      data: await this.prisma.products.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          available: true
        }
      }),
      meta: {
        total: totalProducts,
        page: page,
        lastPage: lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.products.findFirst({
      where: { id: id,
        available: true
      },
      //where: {id }, (Porque tienen el mismo nombre la propiedad y el parámetro)
    });

    if (!product) {
      throw new RpcException({status: HttpStatus.BAD_REQUEST,
        message:`Product with ${id} not found.`});
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const {id: ___, ...data } = updateProductDto; 
    await this.findOne(id);
    return this.prisma.products.update({
      where: { id },
      data: data,
    });
  }
 /*  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    return this.prisma.products.update({
      where: { id },
      data: updateProductDto,
    });
  } */

  async remove(id: number) {
    await this.findOne(id);
    // Hard Delete: se pierde la integridad referencial
   /*  return this.prisma.products.delete({
      where: { id },
    }); */

    // Soft Delete:
     const product =  await this.prisma.products.update({
      where: { id },
      data: {
        available: false
      },
    });

    return {
      status: 200,
      msg: 'Product deleted succesfully',
      product: product
    }

  }
}
