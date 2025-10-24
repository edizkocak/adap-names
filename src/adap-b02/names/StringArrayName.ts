import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringArrayName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        if (!Array.isArray(other)) {
            throw new Error("Constructor expects an array of string components");
        }
        this.components = [...other];
        if (delimiter) {
            this.delimiter = delimiter;
        }
    }
    private unmaskComponent(component: string, delim: string): string {
        let result = "";
        for (let i = 0; i < component.length; i++) {
            if (component[i] === ESCAPE_CHARACTER) {
                const nextChar = component[i + 1];
                result += nextChar; // or result += nextChar? depends
                i++;
            } else {
                result += component[i];
            }
        }
        return result;
    }

    public asString(delimiter: string = this.delimiter): string {
        return this.components
            .map(c => this.unmaskComponent(c, delimiter)
            )
            .join(delimiter);
    }

    public asDataString(): string {
        return this.components.join(DEFAULT_DELIMITER);
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() == 0 ? true : false;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        if (i < 0 || i >= this.components.length) {
            throw new Error("Component index out of range");
        }
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        if (i < 0 || i >= this.components.length) {
            throw new Error("Component index out of range");
        }
        if(c === null || c === undefined) {
            throw new Error("setComponent: string must not be null or undefined");
        }
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        if (i < 0 || i > this.components.length) {
            throw new Error("Insert index out of range");
        }
        if(c === null || c === undefined) {
            throw new Error("insert: string must not be null or undefined");
        }
        this.components.splice(i, 0, c);
    }

    public append(c: string): void {
        if(c === null || c === undefined) {
            throw new Error("append: string must not be null or undefined");
        }
        this.components.push(c);
    }

    public remove(i: number): void {
        if (i < 0 || i >= this.components.length) {
            throw new Error("Remove index out of range");
        }
        this.components.splice(i, 1);
    }

    public concat(other: Name): void {
        let otherNumComponents = other.getNoComponents();
        for(let i = 0; i < otherNumComponents; i++){
            this.append(other.getComponent(i));
        }
    }

}