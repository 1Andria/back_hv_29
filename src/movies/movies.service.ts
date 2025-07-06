import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Director } from 'src/directors/entities/director.entity';
import {
  Between,
  Equal,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Director)
    private readonly directorRepo: Repository<Director>,
    @InjectRepository(Movie)
    private readonly movieRepo: Repository<Movie>,
  ) {}

  async create(
    { description, genre, title, year }: CreateMovieDto,
    directorID: number,
  ) {
    const director = await this.directorRepo.findOne({
      where: { id: directorID },
      relations: ['movies'],
    });
    if (!director) throw new NotFoundException('Director not found');

    const newMovie = await this.movieRepo.create({
      description,
      genre,
      year,
      title,
      movieDirector: director,
    });
    await this.movieRepo.save(newMovie);
    director.movies.push(newMovie);
    this.directorRepo.save(director);

    return newMovie;
  }

  async findAll(
    page: number,
    take: number,
    yearFrom?: number,
    yearTo?: number,
    genre?: string,
    title?: string,
  ) {
    let where: any = {};

    if (yearFrom && yearTo) {
      where.year = Between(yearFrom, yearTo);
    } else if (yearFrom) {
      where.year = MoreThanOrEqual(yearFrom);
    } else if (yearTo) {
      where.year = LessThanOrEqual(yearTo);
    }

    if (genre) {
      where.genre = genre;
    }

    if (title) {
      where.title = ILike(`${title}%`);
    }

    const [data, total] = await this.movieRepo.findAndCount({
      where,
      relations: ['movieDirector'],
      skip: (page - 1) * take,
      take: take,
    });
    return { data, total };
  }

  async findOne(id: number) {
    const movie = await this.movieRepo.findOne({
      where: { id },
      relations: ['movieDirector'],
    });
    if (!movie) throw new NotFoundException('Movie not found');
    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto, directorID: number) {
    const directorOfTheMovie = await this.directorRepo.findOne({
      where: { id: directorID },
    });

    if (!directorOfTheMovie) throw new NotFoundException('Director not found');

    const movie = await this.movieRepo.findOne({
      where: { id },
      relations: ['movieDirector'],
    });

    if (!movie) throw new NotFoundException('Movie not found');

    if (directorOfTheMovie?.id !== movie?.movieDirector.id)
      throw new BadRequestException('It is not your movie to update');

    const movieToUpdate = await this.movieRepo.update(id, updateMovieDto);
    if (movieToUpdate.affected === 0)
      throw new BadRequestException(
        'Something went wrong or u did not updated any field',
      );

    const updatedMovie = await this.movieRepo.findOne({ where: { id } });

    return updatedMovie;
  }

  async remove(id: number, directorID: number) {
    const directorOfTheMovie = await this.directorRepo.findOne({
      where: { id: directorID },
    });

    if (!directorOfTheMovie) throw new NotFoundException('Director not found');

    const movie = await this.movieRepo.findOne({
      where: { id },
      relations: ['movieDirector'],
    });

    if (!movie) throw new NotFoundException('Movie not found');

    if (directorOfTheMovie?.id !== movie?.movieDirector.id)
      throw new BadRequestException('It is not your movie to delete');

    const deletedMovie = await this.movieRepo.delete(id);
    if (deletedMovie.affected === 0)
      throw new NotFoundException('Something went wrong try again');

    return 'Movie deleted successfully';
  }
}
