import { Director } from 'src/directors/entities/director.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  year: number;

  @Column()
  genre: string;

  @ManyToOne(() => Director, (director) => director.movies, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  movieDirector: Director;
}
