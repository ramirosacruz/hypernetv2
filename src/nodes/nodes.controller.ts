import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Put } from '@nestjs/common';
import { NodesService } from './nodes.service';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';
import { CreateGraphDto } from './dto/create-graph.dto';

@Controller('nodes')
export class NodesController {
  constructor(private readonly nodesService: NodesService) { }
  @Get('migrates')
  migrate() {
    return this.nodesService.migrate();
  }

  @Post("graph")
  createGraph(@Body() createNodeDto: CreateGraphDto) {
    return this.nodesService.createGraph(createNodeDto);
  }
  @Post('graph/:id/publish')
  publish(@Param("id") id: number) {
    return this.nodesService.publish(id);
  }

  @Get('graph/:id/version-current')
  getGraphVersionCurrent(@Param("id") id: number) {
    return this.nodesService.getGraphVersionCurrent(id);
  }

  @Get('graphs')
  findAllGraphs() {
    return this.nodesService.findAllGraphs();
  }
  @Get('graph-versions')
  getGraphVersions() {
    return this.nodesService.getGraphVersions();
  }

  @Get('graph/:id')
  getGraph(@Param("id") id: number) {
    return this.nodesService.getGraph(id);
  }

  @Post()
  create(@Body() createNodeDto: CreateNodeDto) {
    return this.nodesService.create(createNodeDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateNodeDto: UpdateNodeDto) {
    return this.nodesService.update(+id, updateNodeDto);
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