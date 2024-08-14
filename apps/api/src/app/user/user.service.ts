import {BadRequestException, Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {Repository} from "typeorm";
import {User} from "./entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {PaginationOptions, UserRole} from "@coinvant/types";
import {paginate, Pagination} from "nestjs-typeorm-paginate";

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {
  }

  async create(createUserDto: CreateUserDto) {
    const user = await this.findOne({email: createUserDto.email});
    if (user) {
      throw new BadRequestException("Email address already exists");
    }
    return await this.userRepo.save(createUserDto);
  }

  findAll(options: PaginationOptions): Promise<Pagination<User>> {
    return paginate(this.userRepo, options, { where: { role: UserRole.user } });
  }

  findOne(condition: { id?: string; email?: string; }) {
    return this.userRepo.findOne({ where: condition });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.email) {
      const user = await this.findOne({email: updateUserDto.email});
      if (user && user.id !== id) {
        throw new BadRequestException("Email address already exists");
      }
    }
    await this.userRepo.update(id, updateUserDto);
    return await this.findOne({id});
  }

  remove(id: string) {
    return this.userRepo.delete(id);
  }
}
