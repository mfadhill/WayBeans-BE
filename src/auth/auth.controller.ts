import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login-dto';
import { JwtAuthGuard } from 'src/lib/db/authGuard';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtStrategy } from 'src/lib/db/jwtsrategy';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('check')
  getProfileLogin(@Request() req) {
    return this.authService.getUserById(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update')
  @UseInterceptors(FileInterceptor('photoProfile'))
  async updateProfile(
    @Request() req,
    @Body() updateDto: UpdateAuthDto,
    @UploadedFile() photoProfile,
  ) {
    return this.authService.update(req.user.id, updateDto, photoProfile);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete')
  async deleteaccount(@Request() req) {
    return this.authService.delete(req.user.id);
  }
}
