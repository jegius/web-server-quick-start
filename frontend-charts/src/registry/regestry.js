import Reset from '@/reset.scss?inline';
import {provide} from '@/di/di';

export function registry() {
    const COMPONENTS_MAP = new Map();

    function resetCss(customReset) {
        const head = document.querySelector('head');
        const style = document.createElement('style');
        style.innerHTML = customReset ?? Reset;
        head.append(style);

        return this;
    }

    function provideService(...services) {
        services.forEach(([key, service]) => {
            provide(key, service);
        });
        return this;
    }

    function mount(selector, root) {
        const entryPoint = document.querySelector(selector);
        entryPoint.innerHTML = `<${createComponentName(root.name)}>`;
    }

    function init() {
        [...COMPONENTS_MAP.entries()]
            .forEach(([name, component]) => {
                customElements.define(name, component);
            });
        return this;
    }

    function register(...components) {
        components.forEach(component => {
            COMPONENTS_MAP.set(createComponentName(component.name), component);
        });
        return this;
    }

    return {
        mount,
        init,
        provideService,
        register,
        resetCss,
    };
}

function createComponentName(string) {
    const convertedString = string
        .replace(/^[A-Z]/, match => match.toLowerCase())
        .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2')
        .toLowerCase();

    return `${convertedString}-component`;
}