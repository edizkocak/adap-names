export const DEFAULT_DELIMITER: string = '.';
export const ESCAPE_CHARACTER = '\\';

/**
 * A name is a sequence of string components separated by a delimiter character.
 * Special characters within the string may need masking, if they are to appear verbatim.
 * There are only two special characters, the delimiter character and the escape character.
 * The escape character can't be set, the delimiter character can.
 * 
 * Homogenous name examples
 * 
 * "oss.cs.fau.de" is a name with four name components and the delimiter character '.'.
 * "///" is a name with four empty components and the delimiter character '/'.
 * "Oh\.\.\." is a name with one component, if the delimiter character is '.'.
 */
export class Name {

    private delimiter: string = DEFAULT_DELIMITER;
    private components: string[] = [];

    /** Expects that all Name components are properly masked */
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

    /**
     * Returns a human-readable representation of the Name instance using user-set special characters
     * Special characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    public asString(delimiter: string = this.delimiter): string {
        return this.components
            .map(c => this.unmaskComponent(c, delimiter)
            )
            .join(delimiter);
    }
    /** 
     * Returns a machine-readable representation of Name instance using default special characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The special characters in the data string are the default characters
     */
    public asDataString(): string {
        return this.components.join(DEFAULT_DELIMITER);
    }

    public getComponent(i: number): string {
        if (i < 0 || i >= this.components.length) {
            throw new Error("Component index out of range");
        }
        return this.components[i];
    }

    /** Expects that new Name component c is properly masked */
    public setComponent(i: number, c: string): void {
        if (i < 0 || i >= this.components.length) {
            throw new Error("Component index out of range");
        }
        if(c === null || c === undefined) {
            throw new Error("setComponent: string must not be null or undefined");
        }
        this.components[i] = c;
    }

    /** Returns number of components in Name instance */
    public getNoComponents(): number {
        return this.components.length;
    }

    /** Expects that new Name component c is properly masked */
    public insert(i: number, c: string): void {
        if (i < 0 || i > this.components.length) {
            throw new Error("Insert index out of range");
        }
        if(c === null || c === undefined) {
            throw new Error("insert: string must not be null or undefined");
        }
        this.components.splice(i, 0, c);
    }

    /** Expects that new Name component c is properly masked */
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
}

