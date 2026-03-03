import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Node } from './Node';

@Entity()
export class Edge {
  @PrimaryGeneratedColumn()
  id!: number;
  @ManyToOne(() => Node, node => node.outgoingEdges, {
    onDelete: 'CASCADE'
  })
  source!: Node;
  
  @ManyToOne(() => Node, node => node.incomingEdges , {
    onDelete: 'CASCADE'
  })
  target!: Node;
  @Column('simple-json', { nullable: true })
  condition?: any;
}