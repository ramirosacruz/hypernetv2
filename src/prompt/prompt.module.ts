import { Module } from '@nestjs/common';
import { PromptService } from './prompt.service';
import { PromptController } from './prompt.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Node } from 'src/nodes/entities/Node';
import { NodesModule } from 'src/nodes/nodes.module';

@Module({
  imports: [
     NodesModule,
    TypeOrmModule.forFeature([Node])],
  controllers: [PromptController],
  providers: [PromptService],
})
export class PromptModule { }
