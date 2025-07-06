import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class QueryMoviesParamsDto {
  @IsOptional()
  @Transform(({ value }) => Math.max(Number(value), 1))
  @IsNumber()
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => Math.min(Number(value), 30))
  @IsNumber()
  take: number = 30;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  yearFrom: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  yearTo: number;

  @IsOptional()
  @IsString()
  genre: string;

  @IsOptional()
  @IsString()
  title: string;
}
