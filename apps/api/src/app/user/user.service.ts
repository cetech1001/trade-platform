import {BadRequestException, Injectable} from '@nestjs/common';
import {QueryRunner, Repository} from "typeorm";
import {UserEntity} from "./entities/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {CreateUser, PaginationOptions, UpdateUser, User, UserRole} from "@coinvant/types";
import {paginate, Pagination} from "nestjs-typeorm-paginate";

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>) {
  }

  async create(createUserDto: CreateUser): Promise<User> {
    const user = await this.findOne({email: createUserDto.email});
    if (user) {
      throw new BadRequestException("Email address already exists");
    }
    return await this.userRepo.save(createUserDto);
  }

  findAll(options: PaginationOptions): Promise<Pagination<User>> {
    return paginate(this.userRepo, options, { where: { role: UserRole.user } });
  }

  findOne(condition: { id?: string; email?: string; }): Promise<User> {
    return this.userRepo.findOne({ where: condition });
  }

  async update(id: string, updateUserDto: UpdateUser, queryRunner?: QueryRunner): Promise<User> {
    if (updateUserDto.email) {
      const user = await this.findOne({email: updateUserDto.email});
      if (user && user.id !== id) {
        throw new BadRequestException("Email address already exists");
      }
    }
    if (queryRunner) {
      await queryRunner.manager.update(UserEntity, id, updateUserDto);
    } else {
      await this.userRepo.update(id, updateUserDto);
    }
    return this.findOne({id});
  }

  remove(id: string) {
    return this.userRepo.delete(id);
  }
}
