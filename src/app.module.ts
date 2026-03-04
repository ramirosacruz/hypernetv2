import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NodesModule } from './nodes/nodes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NodeState } from './nodes/entities/NodeState';
import { Node } from './nodes/entities/Node';
import { PromptModule } from './prompt/prompt.module';
import { ConfigModule } from '@nestjs/config';
import { GraphVersion } from './nodes/entities/GraphVersion';
import { Graph } from './nodes/entities/Graph';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'dev.db',
      synchronize: true,
      logging: false,
      entities: [Node,  NodeState, GraphVersion, Graph ],
    }),
    NodesModule,
    PromptModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
