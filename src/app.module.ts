import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NodesModule } from './nodes/nodes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Edge } from './nodes/entities/Edge';
import { NodeState } from './nodes/entities/NodeState';
import { Node } from './nodes/entities/Node';
import { PromptModule } from './prompt/prompt.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'dev.db',
      synchronize: true,
      logging: false,
      entities: [Node, Edge, NodeState ],
    }),
    NodesModule,
    PromptModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
