import { Module } from '@nestjs/common';
import { NodesService } from './nodes.service';
import { NodesController } from './nodes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Node } from './entities/Node';
import { NodeState } from './entities/NodeState';
import { Graph } from './entities/Graph';
import { GraphVersion } from './entities/GraphVersion';

@Module({
  imports: [TypeOrmModule.forFeature([Node, NodeState, GraphVersion, Graph])],
  controllers: [NodesController],
  providers: [NodesService],
  exports: [NodesService]
})
export class NodesModule { }
