import { Injectable } from '@nestjs/common';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { UpdatePromptDto } from './dto/update-prompt.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Node } from 'src/nodes/entities/Node';
import { Repository } from 'typeorm';
import { NodesService } from 'src/nodes/nodes.service';
import { sendTGMessage } from 'src/utils/base';

@Injectable()
export class PromptService {
  constructor(
    private readonly nodeService: NodesService
  ) { }


  async getGraphOptimizeIntents({ parentId }) {

    const { nodes } = await this.nodeService.findAll({
      parentId
    })

    //Mapear los nodos que śolo tienen un hijo y borrar los que no tengan intenciones
    /* while (true) {

    } */

    const intents = nodes.map(x => (
      {
        id: x?.id,
        intent: x?.config?.intentName,
        name: x?.name
      }
    ))

    const intentsOptimize = []
    for (let i = 0; i < intents.length; i++) {
      const intent = intents[i];
      const nodeOptimize = await this.nodeService.findHerederoLegitimo(intent?.id, 0, 1)
    }


    return
    return [{
      id: 0,
      intent: "obtener_test",
      name: ""
    }]
  }
  async create(createPromptDto: CreatePromptDto) {

    const graph = await this.getGraphOptimizeIntents({
      parentId: 0
    })

    const promptsOptimize = `
    Sos un motor de clasificación para un ERP.

Detectá la intención del usuario y extraé los parámetros.

Intents permitidos:
${graph?.map(x => `${x?.id}) ${x?.intent || x?.name}`).join("\n")}

Respondé SOLO en JSON válido con este formato:

{
  "optionNumber": number,
  "confidence": number (0-1),
  "params": object
}

Usuario:
"${createPromptDto?.content}"
    `

    await sendTGMessage(promptsOptimize)

    return {
      createPromptDto,
    }
  }

  findAll() {
    return `T2222his action returns all prompt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} prompt`;
  }

  update(id: number, updatePromptDto: UpdatePromptDto) {
    return `This action updates a #${id} prompt`;
  }

  remove(id: number) {
    return `This action removes a #${id} prompt`;
  }
}
