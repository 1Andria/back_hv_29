import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDirectorDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  countryOfOrigin: string;

  @IsNotEmpty()
  @IsNumber()
  age: number;

  @IsNotEmpty()
  @IsString()
  @IsIn(['male', 'female'])
  gender: 'male' | 'female';
}
