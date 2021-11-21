import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Users {
    @PrimaryGeneratedColumn()
      id: number;

    @Column()
      name: string;

    @Column()
      surname: string;

    @Column({ nullable: true })
      city: string;

    @Column({ nullable: true })
      address: string;

    @Column()
      phone: string;

    @Column({ nullable: true })
      email: string;

    @Column('timestamp', { nullable: true })
      birthday: Date;

    @Column({ default: 0 })
      type: number;

    @Column()
      password: string;
}
