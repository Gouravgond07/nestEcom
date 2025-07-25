import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreteUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
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
    const actualPassword = createUser.password;
    const hashedPassword = bcrypt.hashSync(actualPassword, saltOrRounds);
    const createdUser = this.usersRepository.create({
      ...createUser,
      password: hashedPassword
    })
    const savedUser = await this.usersRepository.save(createdUser);
    const { password, ...result } = savedUser; // Exclude password from the result
    return result;
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({
      where: {
        email: email
      }
    });
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }


  async login(user: any) {
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
