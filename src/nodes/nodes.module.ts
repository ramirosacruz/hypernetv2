import { Module } from '@nestjs/common';
import { NodesService } from './nodes.service';
import { NodesController } from './nodes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Node } from './entities/Node';
import { NodeState } from './entities/NodeState';
import { Edge } from './entities/Edge';

@Module({
  imports:[TypeOrmModule.forFeature([Node, NodeState, Edge])],
  controllers: [NodesController],
  providers: [NodesService],
})
export class NodesModule {}
