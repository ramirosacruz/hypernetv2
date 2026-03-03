import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';
import { Node } from './entities/Node';
import { Edge } from './entities/Edge';
import { NodeState } from './entities/NodeState';

@Injectable()
export class NodesService {
  constructor(
    @InjectRepository(Node) private nodeRepo: Repository<Node>,
    @InjectRepository(Edge) private edgeRepo: Repository<Edge>,
    @InjectRepository(NodeState) private stateRepo: Repository<NodeState>,
  ) {}

  // 1. Obtener todo el grafo
  async getGraph() {
    return this.nodeRepo.find({
      relations: ['outgoingEdges', 'outgoingEdges.target'],
    });
  }

  // 2. Crear Nodo
  create(createNodeDto: CreateNodeDto) {
    const newNode = this.nodeRepo.create(createNodeDto);
    return this.nodeRepo.save(newNode);
  }

  // 3. Actualizar Nodo
  async update(id: number, updateNodeDto: UpdateNodeDto) {
    await this.nodeRepo.update(id, updateNodeDto);
    return this.nodeRepo.findOneBy({ id });
  }

  // 4. Conectar Nodos (Crear Edge)
  async connect(sourceId: number, targetId: number, condition?: string) {
    const source = await this.nodeRepo.findOneBy({ id: sourceId });
    const target = await this.nodeRepo.findOneBy({ id: targetId });

    if (!source || !target) {
      throw new NotFoundException('Nodo origen o destino no encontrado');
    }

    const newEdge = this.edgeRepo.create({ source, target, condition });
    return this.edgeRepo.save(newEdge);
  }

  // Desconectar (Eliminar Edge)
  async disconnect(edgeId: number) {
    await this.edgeRepo.delete(edgeId);
  }

  // 5. Eliminar Nodo y sus hijos
  async remove(id: number) {
    const node = await this.nodeRepo.findOne({
      where: { id },
      relations: ['outgoingEdges', 'outgoingEdges.target'],
    });

    if (!node) throw new NotFoundException('Nodo no encontrado');

    const childrenIds = node.outgoingEdges.map((edge) => edge.target.id);
    
    // Eliminamos el nodo (TypeORM se encarga de las aristas si hay CASCADE)
    await this.nodeRepo.remove(node);

    // Borramos los hijos si existen
    if (childrenIds.length > 0) {
      await this.nodeRepo.delete(childrenIds);
    }
  }

  // Ejecutar Nodo (Simulación)
  async execute(id: number) {
    const node = await this.nodeRepo.findOneBy({ id });
    if (!node) throw new NotFoundException('Nodo no encontrado');

    let state = await this.stateRepo.findOne({ where: { node: { id: node.id } } });
    if (!state) {
      state = this.stateRepo.create({ node });
    }

    state.status = 'executing';
    state.activationScore = (state.activationScore || 0) + 1;
    state.lastRun = new Date();
    await this.stateRepo.save(state);

    // Simulación de proceso
    state.status = 'success';
    return this.stateRepo.save(state);
  }
}