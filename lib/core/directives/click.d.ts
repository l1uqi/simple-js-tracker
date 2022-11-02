declare class Click {
    add(entry: {
        el: any;
        binding: any;
    }): void;
    remove(entry: {
        el: any;
        binding?: any;
    }): void;
}
export default Click;
