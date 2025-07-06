import { Movie } from 'src/movies/entities/movie.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Director {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  countryOfOrigin: string;

  @Column()
  age: number;

  @Column()
  gender: string;

  @OneToMany(() => Movie, (movie) => movie.movieDirector)
  movies: Movie[];
}
