# Инициализатор приложения

[Назад](../../README.md)

Этот модуль экспортирует функцию `registry`, которая предоставляет цепочку методов для инициализации вашего приложения:

- `resetCss(customReset)` - сброс CSS значений.
- `provideService(...services)` - предоставление сервисов.
- `mount(selector, root)` - точка монтирования приложения.
- `init()` - инициализация компонентов приложения.
- `register(...components)` - регистрация компонент приложения.

## Usage

```javascript
import { registry } from '<app-initializer-path>';

registry()
    .resetCss()
    .provideService(['service1', service1], ['service2', service2])
    .register(Component1, Component2)
    .init()
    .mount('#app', RootComponent);
```

## Описание методов

### `resetCss(customReset)`

Сбросить CSS стили в начальные значения (reset.css).

**Параметры:**

- `customReset: string` - Строка CSS стилей, которые заменят основной сброс стилей. Если `customReset` не предоставлен, сброс будет выполнен согласно значениям по умолчанию.

**Возвращает:** Экземпляр инициализатора для дальнейшего вызова методов цепочкой.

### `provideService(...services)`

Предоставляет сервисы в DI контейнер.

**Параметры:**

- `...services: Array<[key: string, service: function]>` - Массив кортежей, где первый элемент ключ, а второй - сервис, который должен быть предоставлен.

**Возвращает:** Экземпляр инициализатора для дальнейшего вызова методов цепочкой.

### `mount(selector, root)`

Определить основной компонент (root) приложения и точку монтирования (selector).

**Параметры:**

- `selector: string` - CSS-селектор контейнера в который будет вставлен основной компонент.
- `root: Class` - Класс основного компонента приложения.

### `init()`

Выполняет инициализацию зарегистрированных компонентов.

**Возвращает:** Экземпляр инициализатора для дальнейшего вызова методов цепочкой.

### `register(...components)`

Регистрирует компоненты, которые должны быть использованы в приложении.

**Параметры:**

- `...components: Array<Class>` - Массив классов компонентов.

**Возвращает:** Экземпляр инициализатора для дальнейшего вызова методов цепочкой.