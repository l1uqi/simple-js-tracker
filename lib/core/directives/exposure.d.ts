declare class Exposure {
    private observer;
    private params;
    init(): void;
    add(entry: {
        el: Element;
        binding: any;
    }): void;
    remove(entry: {
        el: Element;
        binding?: any;
    }): void;
}
export default Exposure;
