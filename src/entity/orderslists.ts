import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class OrderLists {
    @PrimaryGeneratedColumn()
      id: number;

    @Column()
      orderId: number;

    @Column('jsonb', { nullable: true })
      order: object[];
}
