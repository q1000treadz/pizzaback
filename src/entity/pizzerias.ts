import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Pizzerias {
    @PrimaryGeneratedColumn()
      id: number;

    @Column({ length: 128 })
      title: string;

    @Column({ length: 128 })
      city: string;

    @Column()
      address: string;
}
