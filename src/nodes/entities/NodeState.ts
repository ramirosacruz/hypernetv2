import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Node } from './Node';

@Entity()
export class NodeState {
  @PrimaryGeneratedColumn()
  id!: number;
  @ManyToOne(() => Node)
  node!: Node;
  @Column()
  status!: 'pending' | 'executing' | 'success' | 'error';
  @Column('float', { default: 0 })
  activationScore!: number;
  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  lastRun!: Date;
}