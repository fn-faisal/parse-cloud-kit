import { IsString } from "class-validator";

export class TestParams {
    @IsString()
    test!: string;
}