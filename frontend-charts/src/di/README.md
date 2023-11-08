
# Dependency Injection Container
[Назад](../../README.md)

Простой контейнер зависимостей (dependency injection, DI) для JavaScript приложений.

## Описание

`provide()` и `inject()` - это основные функции DI контейнера. `provide()` занимается созданием и хранением зависимостей, а `inject()` используется для их извлечения.

## Использование

```javascript
import {provide, inject} from '<path-to-di-container>';

function ExampleService() {
    this.showInfo = function() {
        console.log('Work in progress!');
    }
}

// Предоставляем зависимость
provide('example', ExampleService);

// Извлекаем зависимость
const exampleService = inject('example');

exampleService.showInfo(); // Выведет: "Work in progress!"
```

## Функции

### `provide(key, factory)`

Создаёт зависимость и сохраняет её в контейнере.

**Аргументы:**

- `key: string` - идентификатор, под которым зависимость будет храниться в контейнере.

- `factory: function` - функция-фабрика, создающая экземпляр зависимости.

### `inject(key)`

Возвращает зависимость из контейнера по ключу.

**Аргументы:**

- `key: string` - ключ, используемый для поиска зависимости в контейнере.

**Возвращаемое значение:** Экземпляр зависимости, полученной из контейнера.

**Ошибки:** Если зависимость для данного ключа не была предоставлена с помощью `provide()`, `inject()` сгенерирует ошибку.

## Ошибки

- Если ключ не найден при попытке извлечь зависимость с помощью `inject()`, будет вызвано исключение с сообщением 'No provider for: `<key>`'.