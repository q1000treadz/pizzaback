import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Catalog {
    @PrimaryGeneratedColumn()
      id: number;

    @Column({ length: 128 })
      title: string;

    @Column({ length: 128 })
      description: string;

    @Column()
      picture: string;

    @Column()
      type: string;

    @Column('double precision')
      price: number;
}
