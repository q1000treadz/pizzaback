import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Orders {
    @PrimaryGeneratedColumn()
      id: number;

    @Column()
      client: number;

    @Column()
      pizzeria: number;

    @Column()
      summ: number;

    @Column()
      discount: number;

    @Column()
      orderState: number;

    @Column('timestamp', { nullable: true })
      createdAt: Date;

    @Column('timestamp', { nullable: true })
      updatedAt: Date;
}
