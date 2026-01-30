import {
Body, CanActivate, Controller, Delete, ExecutionContext, Get, Injectable, Param,ParseIntPipe, Post, Put,
UseGuards} from '@nestjs/common';
import { BooksService } from './books.service';
import { ApiTags,ApiBearerAuth,ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { from } from 'rxjs';
@Injectable()
export class RolesGuards implements CanActivate {
constructor(private reflector: Reflector) {}
canActivate(context: ExecutionContext): boolean {
const requiredRoles = this.reflector.get<UserRole[]>(
'roles',
context.getHandler(),
);
if (!requiredRoles) return true;
const request = context.switchToHttp().getRequest();
const user = request.user;
return requiredRoles.includes(user.role);
}
}
@ApiTags('Books')
@ApiBearerAuth()
@Controller('books')
export class BooksController {
constructor(private readonly booksService:
BooksService) {}
@Post('regist')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiOperation({ summary: 'Menambahkan buku (ADMIN only)' })
create(@Body() dto: CreateBookDto) {
return this.booksService.create(dto);
}
@Get()
@ApiOperation({ summary: 'Menampilkan seluruh data buku' })
findAll() {
return this.booksService.findAll();
}
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
return this.booksService.findOne(id);
}
@Put(':id')
update(@Param('id', ParseIntPipe) id: number, @Body()
dto: UpdateBookDto) {
return this.booksService.update(id, dto);
}
@Delete(':id')
remove(@Param('id', ParseIntPipe) id: number) {
return this.booksService.remove(id);
}
}