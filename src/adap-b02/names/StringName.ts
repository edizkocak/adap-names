import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        this.name = source;

        if(delimiter){
            this.delimiter = delimiter;
        }

        this.noComponents = 0;
        let inEscape = false;

        for (let i = 0; i < this.name.length; i++) {
            const char = source[i];

            if (inEscape) {
                inEscape = false;
            } else if (char === ESCAPE_CHARACTER) {
                inEscape = true;
            } else if (char === this.delimiter) {
                this.noComponents++;
            }
        }

        if (this.name.length > 0) {
            this.noComponents++;
        }
    }

    public asString(delimiter: string = this.delimiter): string {
        throw new Error("needs implementation or deletion");
    }

    public asDataString(): string {
        return this.name;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.noComponents == 0 ? true : false;
    }

    public getNoComponents(): number {
        return this.noComponents;
    }

    public getComponent(x: number): string {
        throw new Error("needs implementation or deletion");
    }

    public setComponent(n: number, c: string): void {
        throw new Error("needs implementation or deletion");
    }

    public insert(n: number, c: string): void {
        throw new Error("needs implementation or deletion");
    }

    public append(c: string): void {
        this.name += this.delimiter;
        this.name += c;
    }

    public remove(n: number): void {
        throw new Error("needs implementation or deletion");
    }

    public concat(other: Name): void {
        throw new Error("needs implementation or deletion");
    }

}