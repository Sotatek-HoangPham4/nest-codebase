import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Patch,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { UpdateUserDto } from '../../application/dtos/update-user.dto';
import { UserService } from '../../application/services/user.service';
import { UserResponseDto } from '../dtos/user-response.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    const user = await this.userService.createUser(dto);

    return {
      message: 'Create user successfully',
      data: UserResponseDto.toResponse(user!),
    };
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.userService.getUser(id);
    return {
      message: 'Get user successfully',
      data: UserResponseDto.toResponse(user!),
    };
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    const user = await this.userService.updateUser(id, dto);
    return {
      message: 'Updated user successfully',
      data: UserResponseDto.toResponse(user!),
    };
  }

  @Patch(':id/settings')
  async updateSetting(
    @Param('id') id: string,
    @Body() settings: Record<string, any>,
  ) {
    const user = await this.userService.updateSetting(id, settings);
    return {
      message: 'Updated user successfully',
      data: UserResponseDto.toResponse(user!),
    };
  }
}
