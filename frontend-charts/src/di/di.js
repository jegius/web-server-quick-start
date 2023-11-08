const dependencies = new Map();

export function provide(key, factory) {
    dependencies.set(key, factory());
}

export function inject(key) {
    if (dependencies.has(key)) {
        return dependencies.get(key);
    }

    throw new Error(`No provider for: ${key}`);
}