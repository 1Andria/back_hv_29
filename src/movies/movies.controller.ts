import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Headers,
  Query,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { HasDirecotrId } from 'src/common/guards/has-directorId.guard';
import { QueryMoviesParamsDto } from './dto/query-params.dto';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @UseGuards(HasDirecotrId)
  create(
    @Body() createMovieDto: CreateMovieDto,
    @Headers('director-id') directorID: number,
  ) {
    return this.moviesService.create(createMovieDto, directorID);
  }

  @Get()
  findAll(
    @Query()
    { page, take, yearFrom, yearTo, genre, title }: QueryMoviesParamsDto,
  ) {
    return this.moviesService.findAll(
      page,
      take,
      yearFrom,
      yearTo,
      genre,
      title,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moviesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(HasDirecotrId)
  update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDto,
    @Headers('director-id') directorID: number,
  ) {
    return this.moviesService.update(+id, updateMovieDto, directorID);
  }

  @Delete(':id')
  @UseGuards(HasDirecotrId)
  remove(@Param('id') id: string, @Headers('director-id') directorID: number) {
    return this.moviesService.remove(+id, directorID);
  }
}
