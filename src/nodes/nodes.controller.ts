import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common';
import { NodesService } from './nodes.service';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';

@Controller('nodes')
export class NodesController {
  constructor(private readonly nodesService: NodesService) {}

  @Get('graph')
  getGraph() {
    return this.nodesService.getGraph();
  }

  @Post()
  create(@Body() createNodeDto: CreateNodeDto) {
    return this.nodesService.create(createNodeDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNodeDto: UpdateNodeDto) {
    return this.nodesService.update(+id, updateNodeDto);
  }

  @Post('connect')
  connect(@Body() data: { sourceId: number; targetId: number; condition: string }) {
    return this.nodesService.connect(data.sourceId, data.targetId, data.condition);
  }

  @Delete('connect/:edgeId')
  @HttpCode(204)
  disconnect(@Param('edgeId') edgeId: string) {
    return this.nodesService.disconnect(+edgeId);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id') id: string) {
    return this.nodesService.remove(+id);
  }

  @Post('execute/:id')
  execute(@Param('id') id: string) {
    return this.nodesService.execute(+id);
  }
}