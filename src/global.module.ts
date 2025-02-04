import { Module } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";

@Module({
    providers: [
        {
            provide: App_PIPE,
            useClass: validationPipe
        },
    ],
})

export class GlobalMoudle {}