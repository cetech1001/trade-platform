import {Injectable} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {Repository} from "typeorm";
import {User} from "./entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {PaginationOptions, UserRole} from "@coinvant/types";
import {IPaginationOptions, paginate, Pagination} from "nestjs-typeorm-paginate";

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {
  }

  create(createUserDto: CreateUserDto) {
    return this.userRepo.save(createUserDto);
  }

  findAll(options: PaginationOptions): Promise<Pagination<User>> {
    return paginate(this.userRepo, options, { where: { role: UserRole.user } });
  }

  findOne(condition: { id?: string; email?: string; }) {
    return this.userRepo.findOne({ where: condition });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userRepo.update(id, updateUserDto);
  }

  remove(id: string) {
    return this.userRepo.delete(id);
  }
}
