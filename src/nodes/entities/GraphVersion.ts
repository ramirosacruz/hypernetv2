import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
  CreateDateColumn
} from 'typeorm';
import { Graph } from './Graph';

@Entity()
@Index(['graphId', 'version'], { unique: true })
export class GraphVersion {

  @PrimaryGeneratedColumn()
  id!: number;

  // 🔗 Relación con Graph
  @Column()
  graphId!: number;

  @ManyToOne(() => Graph, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'graphId' })
  graph!: Graph;

  // 🔢 Número incremental
  @Column()
  version!: number;

  // 🚦 Estado simple (como lo usás)
  @Column({ default: false })
  isPublished!: boolean;

  // 🧠 Snapshot completo del grafo
  @Column({
    type: 'simple-json'
  })
  snapshot!: {
    nodes: {
      id: string;
      name: string;
      type?: 'intent' | 'action' | 'condition';
      parentId?: string | null;
      config?: any;
    }[];
  };

  // 🚀 Resultado compilado (lo que tu método guarda)
  @Column({
    type: 'simple-json',
    nullable: true
  })
  compiled?: {
    id: string;
    nodeId: string;
    fullPath: string;
  }[];

  // 🕒 Metadata
  @CreateDateColumn()
  createdAt!: Date;
}