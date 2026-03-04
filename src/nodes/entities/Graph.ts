import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Node } from './Node';

@Entity()
export class Graph {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ nullable: true })
    activeVersionId?: number;

    @ManyToOne(() => Node, n => n.graph)
    nodes: Node[]
}