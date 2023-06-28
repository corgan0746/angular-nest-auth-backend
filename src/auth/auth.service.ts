import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

import * as bcryptjs from 'bcryptjs';
import { LoginDto, RegisterUserDto, UpdateAuthDto, CreateUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginResponse } from './interfaces/login-response.interface';

@Injectable()
export class AuthService {


  constructor(
    @InjectModel(User.name) 
    private userModel: Model<User>,
    private jwtService: JwtService

  ){}

  async create(createUserDto: CreateUserDto): Promise<User> {
    console.log(createUserDto)
    
    try{
      
      const { password, ...userData } = createUserDto;

      // const newUser = new this.userModel( createUserDto );
      const newUser = new this.userModel({
        password: bcryptjs.hashSync(password, 10 ),
        ...userData
      });

      await newUser.save();
      //must use await, otherwise if an error happens it will be thrownoutside the service
      const {password:_, ...user } = newUser.toJSON();

      return user;

    }catch(err) {
      if(err.code === 11000){
        throw new BadRequestException(`${createUserDto.email} already exists!`);
      }
      throw new InternalServerErrorException('Something went wrong.')
    }

  }

  async register(registerDto: RegisterUserDto):Promise<LoginResponse>{

    // const { email, ...rest} = registerDto;

    // const foundEmail = await this.userModel.findOne({ email });

    // if(foundEmail){
    //   throw new BadRequestException('Email already exists');
    // }

    const newUser = await this.create(registerDto);

    console.log(newUser);

    return {user: newUser, token: this.getJwtToken({id: newUser._id})};


    // const {password:_, ...user} = newUser.toJson();


  }

  async login(loginDto: LoginDto): Promise<LoginResponse>{

    const {email, password} = loginDto;

    const user = await this.userModel.findOne({ email });

    if(!user){
      throw new UnauthorizedException('Not valid credentials - email')
    }

    if( !bcryptjs.compareSync(password, user.password)){
      throw new UnauthorizedException('Not valid credentials - password')
    }

    const { password:_, ...rest } = user.toJSON();

    return {
      user: rest,
      token: this.getJwtToken({id: user.id})
    }
  }


  findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findUserById(id: string){
    const user = await this.userModel.findById(id);
    const { password, ...rest} = user.toJSON(); //Very Important to access the properties normally

    return rest;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJwtToken(payload: JwtPayload){
    const token = this.jwtService.sign(payload);
    return token;
  }
}
