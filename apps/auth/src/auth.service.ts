import { HttpCode, Injectable, ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreteUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';


const saltOrRounds = 10;
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService
  ) { }

  async createUser(createUser: CreteUserDto) {
    const user = await this.usersRepository.findOne({
      where: {
        email: createUser.email
      }
    })
    if(user) {
      return new ConflictException('User already exist');
    }
    const password = createUser.password;
    const hashedPassword = bcrypt.hashSync(password, saltOrRounds);
    const createdUser = this.usersRepository.create({
      ...createUser,
      password: hashedPassword
    })
    const savedUser = await this.usersRepository.save(createdUser);
    return savedUser;
  }


  async loginUser(loginUser: LoginUserDto) {
    const user = await this.usersRepository.findOne({
        where: {
          email: loginUser.email
        }
    });
    if(!user) {
      throw new NotFoundException('User Not found');
    }

    const password = loginUser.password;
    const hashedPassword = user.password;

    const isPasswordCorrect = bcrypt.compareSync(password, hashedPassword);;
    if(!isPasswordCorrect) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
