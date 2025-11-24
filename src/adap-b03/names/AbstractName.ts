import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { assertIsNotNullOrUndefined, maskComponent, unmaskComponent } from "./utils";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        assertIsNotNullOrUndefined(delimiter, "AbstractName constructor");
        if (typeof delimiter !== "string" || delimiter.length !== 1 || delimiter === ESCAPE_CHARACTER) {
            throw new TypeError("delimiter must be a single character (not escape)");
        }
        this.delimiter = delimiter;
    }

    public asString(delimiter: string = this.delimiter): string {
        assertIsNotNullOrUndefined(delimiter, "asString");
        if(typeof delimiter !== "string" || delimiter.length !== 1 || delimiter === ESCAPE_CHARACTER){
            throw new TypeError("asString: delimiter has to be a single character (not escape)")
        }

        const name_components = [];
        for(let i = 0; i < this.getNoComponents(); i++){
            name_components.push(unmaskComponent(this.getComponent(i), this.delimiter, true));
        }
        return name_components.join(delimiter);
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        const name_components = [];
        for(let i = 0; i < this.getNoComponents(); i++){
            if(this.delimiter === DEFAULT_DELIMITER){
                name_components.push(this.getComponent(i));
            }
            else{
                name_components.push(maskComponent(
                    unmaskComponent(this.getComponent(i), this.delimiter), DEFAULT_DELIMITER));
            }
        }

        return name_components.join(DEFAULT_DELIMITER);
    }

    public isEqual(other: Name): boolean {
        if(this === other) return true;
        if (other === null || other === undefined || !(other instanceof AbstractName)) {
            throw new TypeError("other must be a valid Name instance");
        }

        if(this.getNoComponents() !== other.getNoComponents()) return false;

        return this.getDelimiterCharacter() === other.getDelimiterCharacter()
            && this.toString() === other.toString();
    }

    public getHashCode(): number {
        let hashCode: number = 0;
        const s: string = this.toString() + this.getDelimiterCharacter() + this.getNoComponents(); // different hash for StringName("") with 0 or 1 component
        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
            hashCode = (hashCode << 5) - hashCode + c;
            hashCode |= 0;
        }
        return hashCode;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public concat(other: Name): void {
        if (other === null || other === undefined || !(other instanceof AbstractName)) {
            throw new TypeError("other must be a valid Name instance");
        }
        if(other.getNoComponents() === 0){
            return;
        }

        const otherDelimiter = other.getDelimiterCharacter();

        for(let i = 0; i < other.getNoComponents(); i++){
            let comp = other.getComponent(i);
            if(this.delimiter !== otherDelimiter){
                let unmasked = unmaskComponent(comp, otherDelimiter);
                comp = maskComponent(unmasked, this.delimiter);
            }
            this.append(comp);
        }
    }

    abstract clone(): Name; // abstract, because the class does not know the constructors of its subclasses. maintains OOP principles

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;
}