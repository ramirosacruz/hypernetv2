import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Edge } from './Edge';

@Entity()
export class Node {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column()
  name!: string;
  @Column()
  type!: 'intent' | 'action' | 'condition' | 'ai' | 'ai_router';
  // En tu entidad Node.ts
  @Column('simple-json', { nullable: true })
  config?: {
    intentName?: string;       // Ej: "consultar_stock"
    requiredParams?: string[]; // Ej: ["producto"]
    mapping?: Record<string, string>; // Para mapear lo que viene de la IA a tu DB
  };
  @OneToMany(() => Edge, edge => edge.source)
  outgoingEdges!: Edge[];
  @OneToMany(() => Edge, edge => edge.source)
  incomingEdges!: Edge[];

}