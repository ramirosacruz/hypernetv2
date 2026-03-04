import { ApiProperty } from "@nestjs/swagger";
import { Column } from "typeorm";

export class CreatePromptDto {
    @ApiProperty({
        default: "quiero el stock del producto manteca"
    })
    content: string

    @ApiProperty({
        default: "TEST"
    })
    referenceId: string

     @ApiProperty({
        default: "TEST"
    })
    optionNumber: string
}
