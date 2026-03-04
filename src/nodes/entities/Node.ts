import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Graph } from "./Graph";

@Entity()
export class Node {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  type!: 'intent' | 'action' | 'condition';

  @Column({ nullable: true })
  parentId!: number;

  @Column({ default: 1, nullable: true })
  graphId!: number;

  @ManyToOne(() => Graph)
  graph: Graph

  @Column('simple-json', { nullable: true })
  transitions?: {
    to: number;
    condition?: any;
  }[];

  @Column('simple-json', { nullable: true })
  config?: {
    intentName?: string;
    requiredParams?: string[];
    mapping?: Record<string, string>;
  };
}