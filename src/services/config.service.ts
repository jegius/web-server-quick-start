import { Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';

@Injectable()
export class ConfigService {
    private readonly configData: any;

    constructor() {
        const rawData = readFileSync('./resources/config.json');
        this.configData = JSON.parse(rawData.toString());
    }

    get(key: string): any {
        return this.configData[key];
    }
}