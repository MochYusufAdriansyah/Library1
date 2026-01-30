


import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
// import { User } from './user.type';
import { NotFoundException } from '@nestjs/common';
import { hash } from 'bcrypt';
import { Prisma } from '@prisma/client';
import { User as PrismaUser } from '@prisma/client';


@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<PrismaUser> {
    const hashedPassword = await hash(dto.password, 10);
    return this.prisma.user.create({
  data: { ...dto, password: hashedPassword } as Prisma.UserCreateInput,
});
  }
  async findAll(): Promise<PrismaUser[]> {
    return this.prisma.user.findMany({ orderBy: { id: 'asc' } });
  }
  async findOne(id: number): Promise<PrismaUser> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
  async update(id: number, dto: UpdateUserDto): Promise<PrismaUser> {
    await this.findOne(id);
    const data: any = { ...dto };
if (dto.password) data.password = await hash(dto.password, 10);
return this.prisma.user.update({ where: { id }, data });
  }
  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.user.delete({ where: { id } });
    return { message: `User with id ${id} deleted` };
  }
}