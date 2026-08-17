class CustomEventEmitter {
    private events: Record<string, Function[]> = {};

    on(event: string, listener: Function) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    emit(event: string, data?: any) {
        if (this.events[event]) {
            this.events[event].forEach(listener => listener(data));
        }
    }
}

export const eventEmitter = new CustomEventEmitter();
