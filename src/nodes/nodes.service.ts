import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Not, IsNull } from 'typeorm';
import { CreateNodeDto } from './dto/create-node.dto';
import { UpdateNodeDto } from './dto/update-node.dto';
import { Node } from './entities/Node';
import { NodeState } from './entities/NodeState';
import { Graph } from './entities/Graph';
import { GraphInspector } from '@nestjs/core';
import { Snapshot, CompiledIntent, FlowNode } from './types';
import { GraphVersion } from './entities/GraphVersion';
import { CreateGraphDto } from './dto/create-graph.dto';

@Injectable()
export class NodesService {
  async findAllGraphs() {
    const graphs = await this.graphRepo.find()


    return {
      graphs
    }
  }
  async getGraphVersions() {
    const versions = await this.graphVersionRepo.find({
    });
    return {
      versions
    }
  }
  async getGraphVersionCurrent(id: number) {
    // 1. Buscamos el Grafo para saber cuál es su 'activeVersionId'
    const graph = await this.graphRepo.findOne({
      where: { id },
      select: ['activeVersionId'] // Solo traemos lo necesario
    });

    if (!graph || !graph.activeVersionId) {
      throw new Error(`Graph ${id} has no active version published.`);
    }

    // 2. Obtenemos la versión específica
    const currentVersion = await this.graphVersionRepo.findOne({
      where: {
        id: graph.activeVersionId,
        graphId: id
      }
    });

    if (!currentVersion) {
      throw new Error(`Active version ${graph.activeVersionId} not found.`);
    }

    // 3. Retornamos solo el 'compiled' para el LLM (ahorro de memoria)
    return currentVersion.compiled;
  }
  async createGraph(createNodeDto: CreateGraphDto) {
    return await this.graphRepo.save({
      name: createNodeDto?.name
    })
  }
  async migrate() {
    await this.nodeRepo.update({
      id: Not(IsNull())
    },
      {
        graphId: 1
      })
  }

  constructor(
    @InjectRepository(Graph) private graphRepo: Repository<Graph>,
    @InjectRepository(GraphVersion) private graphVersionRepo: Repository<GraphVersion>,
    @InjectRepository(Node) private nodeRepo: Repository<Node>,
    @InjectRepository(NodeState) private stateRepo: Repository<NodeState>,
  ) { }

  async findHerederoLegitimo(
    id: number,
    depth = 0,
    max = 5
  ) {
    if (depth >= max) return null;

    const children = await this.nodeRepo.find({
      where: { parentId: id }
    });

    if (children.length !== 1) return null;

    const child = children[0];

    if (child.config?.intentName) {
      return child;
    }

    return this.findHerederoLegitimo(child.id, depth + 1, max);
  }


  async findAll(query: { parentId?: number }) {
    if (typeof query.parentId !== "undefined") {
      return {
        nodes: await this.nodeRepo.find({
          where: { parentId: query.parentId ?? IsNull() }
        })
      };
    }

    return {
      nodes: await this.nodeRepo.find()
    };
  }

  // 1. Obtener todo el grafo
  async getGraph(id: number) {
    return this.nodeRepo.find({
      where: {
        graphId: id
      }
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

  // 5. Eliminar Nodo y sus hijos
  async remove(id: number) {
    const children = await this.nodeRepo.find({
      where: { parentId: id }
    });

    await this.nodeRepo.delete(id);

    if (children.length > 0) {
      await this.nodeRepo.delete(children.map(c => c.id));
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
 async publish(graphId: number) {
    const nodes = await this.nodeRepo.find({ where: { graphId } });
    if (!nodes || nodes.length === 0) throw new Error("Graph has no nodes to publish");

    const childrenMap = new Map<string, any[]>();
    nodes.forEach(node => {
        const pId = node.parentId?.toString();
        if (pId) {
            if (!childrenMap.has(pId)) childrenMap.set(pId, []);
            childrenMap.get(pId)!.push(node);
        }
    });

    const compiledRoutes: any[] = [];

    const processNode = (node: any) => {
        const children = childrenMap.get(node.id.toString()) ?? [];
        const intentName = node.config?.intentName;
        const hasIntent = !!(intentName && intentName.trim() !== "");

        // CASO 1: Es un punto de decisión (Padre con múltiples hijos)
        // Lo incluimos a él para que la integración pida elegir, NO a sus hijos aún.
        if (children.length > 1) {
            compiledRoutes.push({
                id: `menu_${node.id}`,
                nodeId: node.id.toString(),
                name: node.name.toUpperCase(),
                type: 'folder', // Indica que es para navegar
                parentId: node.parentId?.toString() ?? null
            });
            // No procesamos hijos aquí para no "ensuciar" el nivel actual
            // Los hijos se buscarán en la siguiente iteración de tu integración
            return; 
        }

        // CASO 2: Nodo con Intent Directo (Hoja o paso único)
        if (hasIntent) {
            compiledRoutes.push({
                id: intentName,
                nodeId: node.id.toString(),
                name: node.name.toUpperCase(),
                type: 'intent',
                parentId: node.parentId?.toString() ?? null
            });
            return;
        }

        // CASO 3: Nodo redundante (1 solo hijo y sin intent)
        // Saltamos este nodo y procesamos directamente al hijo
        if (children.length === 1) {
            processNode(children[0]);
            return;
        }

        // CASO 4: Nodo vacío (Sin intent y sin hijos) -> Se ignora (vuela)
    };

    // Empezamos procesando solo los raíces
    const rootNodes = nodes.filter(n => !n.parentId);
    rootNodes.forEach(root => processNode(root));

    // --- Persistencia ---
    const lastVersion = await this.graphVersionRepo.findOne({
        where: { graphId },
        order: { version: 'DESC' }
    });
    const nextVersionNumber = (lastVersion?.version || 0) + 1;

    const savedVersion = await this.graphVersionRepo.save({
        graphId,
        version: nextVersionNumber,
        isPublished: true,
        compiled: compiledRoutes,
        snapshot: {
            nodes: nodes.map(n => ({
                id: n.id.toString(),
                name: n.name,
                parentId: n.parentId?.toString() ?? null,
                config: n.config
            }))
        }
    });

    await this.graphRepo.update(graphId, { activeVersionId: savedVersion.id });

    return {
        version: savedVersion.version,
        routesCount: compiledRoutes.length,
        status: 'published'
    };
}
}