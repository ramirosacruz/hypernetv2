import { ApiProperty } from "@nestjs/swagger";

export class CreateGraphDto {
    @ApiProperty({
        example: "Gerente"
    })
    name: string
}
