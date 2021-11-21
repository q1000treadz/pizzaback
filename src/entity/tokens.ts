import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Tokens {
    @PrimaryGeneratedColumn()
      id: number;

    @Column({ unique: true })
      userId: number;

    @Column()
      token: string;
}
