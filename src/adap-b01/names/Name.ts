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
    // @methodtype initialization-method
    constructor(other: string[], delimiter?: string) {
        this.components = [...other];
        if(delimiter){ // does not allow for empty string delimiter ""
            this.delimiter = delimiter;
        }
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set special characters
     * Special characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    // @methodtype conversion-method
    public asString(delimiter: string = this.delimiter): string {
        return this.components
            .map(c => this.unmaskComponent(c, this.delimiter))
            .join(delimiter);
    }
    /** 
     * Returns a machine-readable representation of Name instance using default special characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The special characters in the data string are the default characters
     */
    // @methodtype conversion-method
    public asDataString(): string {
        if(this.delimiter !== DEFAULT_DELIMITER){
            return this.components
                .map(c => this.unmaskComponent(c, this.delimiter))
                .map(c => this.maskComponent(c, DEFAULT_DELIMITER))
                .join(DEFAULT_DELIMITER);
        }
        return this.components.join(DEFAULT_DELIMITER);
    }

    /** Returns properly masked component string */
    // @methodtype get-method 
    public getComponent(i: number): string {
        this.assertIsNotNullOrUndefined(i);
        this.assertIsValidIndex(i, this.getNoComponents(), "get");
        return this.components[i];
    }

    /** Expects that new Name component c is properly masked */
    // @methodtype set-method
    public setComponent(i: number, c: string): void {
        this.assertIsNotNullOrUndefined(i);
        this.assertIsValidIndex(i, this.getNoComponents(), "set");
        this.components[i] = c;
    }

    /** Returns number of components in Name instance */
    // @methodtype get-method 
    public getNoComponents(): number {
        return this.components.length;
    }

    /** Expects that new Name component c is properly masked */
    // @methodtype command-method
    public insert(i: number, c: string): void {
        this.assertIsNotNullOrUndefined(i);
        this.assertIsValidIndex(i, this.getNoComponents() + 1, "insert");
        this.components.splice(i, 0, c);
    }

    /** Expects that new Name component c is properly masked */
    // @methodtype command-method
    public append(c: string): void {
        this.components.push(c);
    }

    // @methodtype command-method
    public remove(i: number): void {
        this.assertIsNotNullOrUndefined(i);
        this.assertIsValidIndex(i, this.getNoComponents(), "remove");
        this.components.splice(i, 1);
    }

    // @methodtype helper-method
    private unmaskComponent(component: string, delim: string): string {
        let result = "";
        for (let i = 0; i < component.length; i++) {
            if (component[i] === ESCAPE_CHARACTER) {
                result += component[i + 1]; 
                i++;
            } else {
                result += component[i];
            }
        }
        return result;
    }

    // @methodtype helper-method
    private maskComponent(component: string, delim: string): string {
        let result = "";
        for (let i = 0; i < component.length; i++) {
            if (component[i] === ESCAPE_CHARACTER) {
                result += component[i + 1]; 
                i++;
            } else if(component[i] == DEFAULT_DELIMITER){
                result += ESCAPE_CHARACTER;
                result += component[i];
            }
            else{
                result += component[i];
            }
        }
        return result;
    }

    // @methodtype assertion-method
    private assertIsValidIndex(index : number, upperBound : number, funcName : string) : void{
        if(index < 0 || index >= upperBound){
            throw new Error(`${funcName}: index out of range")`);
        }
    }

    // @methodtype assertion-method
    private assertIsNotNullOrUndefined(other: Object): void {
        if ((other == null) || (other == undefined)) {
            throw new RangeError("Value is null or undefined");
        }
    }
}

