import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Director } from './entities/director.entity';
import {
  Between,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';

@Injectable()
export class DirectorsService {
  constructor(
    @InjectRepository(Director)
    private readonly directorRepo: Repository<Director>,
  ) {}

  async create({ age, countryOfOrigin, gender, name }: CreateDirectorDto) {
    const newDirector = await this.directorRepo.create({
      age,
      countryOfOrigin,
      gender,
      name,
      movies: [],
    });
    await this.directorRepo.save(newDirector);

    return newDirector;
  }

  async findAll(
    page: number,
    take: number,
    ageFrom?: number,
    ageTo?: number,
    name?: string,
    gender?: string,
    from?: string,
  ) {
    let where: any = {};

    if (ageFrom && ageTo) {
      where.age = Between(ageFrom, ageTo);
    } else if (ageFrom) {
      where.age = MoreThanOrEqual(ageFrom);
    } else if (ageTo) {
      where.age = LessThanOrEqual(ageTo);
    }

    if (name) {
      where.name = ILike(`${name}%`);
    }

    if (gender) {
      where.gender = gender;
    }

    if (from) {
      where.countryOfOrigin = from;
    }

    const [data, total] = await this.directorRepo.findAndCount({
      where,
      relations: ['movies'],
      skip: (page - 1) * take,
      take: take,
    });
    return { data, total };
  }

  async findOne(id: number) {
    const director = await this.directorRepo.findOne({
      where: { id },
      relations: ['movies'],
    });
    if (!director) throw new NotFoundException('Director is not found');
    return director;
  }

  async update(id: number, updateDirectorDto: UpdateDirectorDto) {
    const director = await this.directorRepo.update(id, updateDirectorDto);
    if (director.affected === 0) {
      throw new NotFoundException('Director not found or update failed');
    }
    const updatedDirector = await this.directorRepo.findOne({ where: { id } });
    return updatedDirector;
  }

  async remove(id: number) {
    const director = await this.directorRepo.delete(id);
    if (director.affected === 0) {
      throw new NotFoundException('Director not found or delete failed');
    }
    return 'Director deleted successfully';
  }
}
