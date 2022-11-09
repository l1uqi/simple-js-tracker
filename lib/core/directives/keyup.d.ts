declare class Keyup {
    add(entry: {
        el: any;
        binding: any;
    }): void;
    remove(entry: {
        el: Element;
        binding?: any;
    }): void;
}
export default Keyup;
